<?php


namespace App\Command;


use App\Entity\Departement;
use App\Entity\StatistiqueLogement;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


#[AsCommand(
   name: 'app:import:stats-logement',
   description: 'Import des statistiques logement depuis un CSV'
)]
class ImportStatistiquesDepartementCommand extends Command
{
   public function __construct(private EntityManagerInterface $em)
   {
       parent::__construct();
   }


   protected function configure(): void
   {
       $this
           ->setDescription('Import des statistiques logement depuis un CSV')
           ->addArgument('file', InputArgument::REQUIRED, 'Chemin du fichier CSV');
   }


   protected function execute(InputInterface $input, OutputInterface $output): int
   {
       $filePath = $input->getArgument('file');


       if (!is_readable($filePath)) {
           $output->writeln('<error>Fichier introuvable ou illisible</error>');
           return Command::FAILURE;
       }


       $handle = fopen($filePath, 'r');
       if (!$handle) {
           $output->writeln('<error>Impossible d’ouvrir le fichier</error>');
           return Command::FAILURE;
       }


       $separator = ';';
       $batchSize = 50;
       $i = 0;


       // HEADER
       $header = fgetcsv($handle, 0, $separator);
       if ($header === false) {
           $output->writeln('<error>CSV vide</error>');
           return Command::FAILURE;
       }


       $header = array_map([$this, 'normalizeHeader'], $header);


       while (($row = fgetcsv($handle, 0, $separator)) !== false) {


           // Ignore lignes vides
           if ($row === [null] || count(array_filter($row)) === 0) {
               continue;
           }


           if (count($row) !== count($header)) {
               $output->writeln('<comment>Ligne ignorée (mauvais nombre de colonnes)</comment>');
               continue;
           }


           $data = array_combine($header, $row);


           if ($data === false) {
               continue;
           }


           $rawCode = trim($data['code_departement'] ?? '');


           if ($rawCode === '') {
               // ligne invalide → on ignore
               continue;
           }


           $code = $this->formatCodeDepartement($rawCode);


           if ($code === null) {
               continue;
           }


           $departement = $this->em
               ->getRepository(Departement::class)
               ->find($code);


           if (!$departement) {
               $output->writeln("<comment>Département absent : $code</comment>");
               continue;
            }




           $stat = new StatistiqueLogement();
           $stat->setDepartement($departement);
           $stat->setConstruction($this->decimal($data['construction']));
           $stat->setNombreLogement($this->int($data['parc_social_nombre_de_logements']));
           $stat->setLogementsMisEnLocation($this->decimal($data['parc_social_logements_mis_en_location']));
           $stat->setAnneePublication($this->int($data['annee_publication']));
           $stat->setDensiteDePopulationAuKm2($this->decimal($data['densite_de_population_au_km2']));
           $stat->setVariationDeLaPopulationSur10AnsEn($this->decimal($data['variation_de_la_population_sur_10_ans_en']));
           $stat->setDontContributionDuSoldeNaturelEn($this->decimal($data['dont_contribution_du_solde_naturel_en']));
           $stat->setDontContributionDuSoldeMigratoireEn($this->decimal($data['dont_contribution_du_solde_migratoire_en']));
           $stat->setPopulationDeMoinsDe20Ans($this->decimal($data['population_de_moins_de_20_ans']));
           $stat->setPopulationDe60AnsEtPlus($this->decimal($data['population_de_60_ans_et_plus']));
           $stat->setTauxDeChomageAuT4En($this->decimal($data['taux_de_chomage_au_t4_en']));
           $stat->setTauxDePauvreteEn($this->decimal($data['taux_de_pauvrete_en']));
           $stat->setNombreDeResidencesPrincipales($this->int($data['nombre_de_residences_principales']));
           $stat->setTauxDeLogementsSociauxEn($this->decimal($data['taux_de_logements_sociaux_en']));
           $stat->setTauxDeLogementsVacantsEn($this->decimal($data['taux_de_logements_vacants_en']));
           $stat->setTauxDeLogementsIndividuelsEn($this->decimal($data['taux_de_logements_individuels_en']));
           $stat->setMoyenneAnnuelleDeLaConstructionNeuveSur10Ans($this->int($data['moyenne_annuelle_de_la_construction_neuve_sur_10_ans']));
           $stat->setParcSocialLogementsDemolis($this->decimal($data['parc_social_logements_demolis']));
           $stat->setParcSocialVentesADesPersonnesPhysiques($this->decimal($data['parc_social_ventes_a_des_personnes_physiques']));
           $stat->setParcSocialTauxDeLogementsVacantsEn($this->decimal($data['parc_social_taux_de_logements_vacants_en']));
           $stat->setParcSocialTauxDeLogementsIndividuelsEn($this->decimal($data['parc_social_taux_de_logements_individuels_en']));
           $stat->setParcSocialLoyerMoyenEnEurM2Mois($this->decimal($data['parc_social_loyer_moyen_en_eur_m2_mois']));
           $stat->setParcSocialAgeMoyenDuParcEnAnnees($this->decimal($data['parc_social_age_moyen_du_parc_en_annees']));
           $stat->setParcSocialTauxDeLogementsEnergivoresEFGEn($this->decimal($data['parc_social_taux_de_logements_energivores_e_f_g_en']));


           $this->em->persist($stat);


           if (($i % $batchSize) === 0 && $i > 0) {
               $this->em->flush();
               $this->em->clear(StatistiqueLogement::class); // important
           }


           $i++;
       }


       $this->em->flush();
       fclose($handle);


       $output->writeln("<info>Import terminé : $i lignes</info>");


       return Command::SUCCESS;
   }


   private function normalizeHeader(string $value): string
   {
       $value = preg_replace('/^\xEF\xBB\xBF/', '', $value);


       $encoding = mb_detect_encoding($value, ['UTF-8','ISO-8859-1','Windows-1252'], true);
       if ($encoding !== 'UTF-8') {
           $value = mb_convert_encoding($value, 'UTF-8', $encoding);
       }


       $value = trim($value);
       $value = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
       $value = strtolower($value);


       $value = str_replace(
           [' ', '-', '%', '(', ')', '/', '*', ',', '€', '²', "'"],
           '_',
           $value
       );


       $value = preg_replace('/_+/', '_', $value);


       return trim($value, '_');
   }


   private function decimal($value): ?string
   {
       if ($value === null || $value === '') {
           return null;
       }
       return number_format((float)$value, 16, '.', '');
   }


   private function int($value): ?int
   {
       if ($value === null || $value === '') {
           return null;
       }
       return (int)$value;
   }


   private function formatCodeDepartement(string $code): ?string
   {
       $code = trim($code);
       if ($code === '') {
           return null;
       }
       if (in_array($code, ['2A', '2B'])) {
           return $code;
       }
       if (strlen($code) === 3) {
           return $code;
       }


       return str_pad($code, 2, '0', STR_PAD_LEFT);
   }
}
