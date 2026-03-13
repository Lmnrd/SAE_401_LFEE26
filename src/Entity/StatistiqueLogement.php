<?php

namespace App\Entity;

use App\Repository\StatistiqueLogementRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;


#[ORM\Entity(repositoryClass: StatistiqueLogementRepository::class)]
class StatistiqueLogement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['statistique_logement', 'departement', 'region'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['statistique_logement', 'departement', 'region'])]
    private ?float $construction = null;


    #[ORM\Column]
    #[Groups(['statistique_logement', 'departement', 'region'])]
    private ?int $nombreLogement = null;

    #[ORM\ManyToOne(inversedBy: 'statistiqueLogements')]
    #[ORM\JoinColumn(name: 'departement_code', referencedColumnName: 'code')]
    #[Groups(['statistique_logement'])]
    private ?Departement $departement = null;

    #[ORM\Column]
    private ?float $logementsMisEnLocation = null;

    #[ORM\Column]
    private ?int $anneePublication = null;

    #[ORM\Column]
    private ?float $densiteDePopulationAuKm2 = null;

    #[ORM\Column]
    private ?float $variationDeLaPopulationSur10AnsEn = null;

    #[ORM\Column]
    private ?float $dontContributionDuSoldeNaturelEn = null;

    #[ORM\Column]
    private ?float $dontContributionDuSoldeMigratoireEn = null;

    #[ORM\Column]
    private ?float $populationDeMoinsDe20Ans = null;

    #[ORM\Column]
    private ?float $populationDe60AnsEtPlus = null;

    #[ORM\Column]
    private ?float $tauxDeChomageAuT4En = null;

    #[ORM\Column]
    private ?float $tauxDePauvreteEn = null;

    #[ORM\Column]
    private ?int $nombreDeResidencesPrincipales = null;

    #[ORM\Column]
    private ?float $tauxDeLogementsSociauxEn = null;

    #[ORM\Column]
    private ?float $tauxDeLogementsVacantsEn = null;

    #[ORM\Column]
    private ?float $tauxDeLogementsIndividuelsEn = null;

    #[ORM\Column]
    private ?int $moyenneAnnuelleDeLaConstructionNeuveSur10Ans = null;

    #[ORM\Column]
    private ?float $parcSocialLogementsDemolis = null;

    #[ORM\Column]
    private ?float $parcSocialVentesADesPersonnesPhysiques = null;

    #[ORM\Column]
    private ?float $parcSocialTauxDeLogementsVacantsEn = null;

    #[ORM\Column]
    private ?float $parcSocialTauxDeLogementsIndividuelsEn = null;

    #[ORM\Column]
    private ?float $parcSocialLoyerMoyenEnEurM2Mois = null;

    #[ORM\Column]
    private ?float $parcSocialAgeMoyenDuParcEnAnnees = null;

    #[ORM\Column]
    private ?float $parcSocialTauxDeLogementsEnergivoresEFGEn = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getConstruction(): ?float
    {
        return $this->construction;
    }

    public function setConstruction(float $construction): static
    {
        $this->construction = $construction;

        return $this;
    }


    public function getNombreLogement(): ?int
    {
        return $this->nombreLogement;
    }

    public function setNombreLogement(int $nombreLogement): static
    {
        $this->nombreLogement = $nombreLogement;

        return $this;
    }

    public function getDepartement(): ?Departement
    {
        return $this->departement;
    }

    public function setDepartement(?Departement $departement): static
    {
        $this->departement = $departement;

        return $this;
    }

    public function getLogementsMisEnLocation(): ?float
    {
        return $this->logementsMisEnLocation;
    }

    public function setLogementsMisEnLocation(float $logementsMisEnLocation): static
    {
        $this->logementsMisEnLocation = $logementsMisEnLocation;

        return $this;
    }

    public function getAnneePublication(): ?int
    {
        return $this->anneePublication;
    }

    public function setAnneePublication(?int $anneePublication): static
    {
        $this->anneePublication = $anneePublication;

        return $this;
    }

    public function getDensiteDePopulationAuKm2(): ?float
    {
        return $this->densiteDePopulationAuKm2;
    }

    public function setDensiteDePopulationAuKm2(?float $densiteDePopulationAuKm2): static
    {
        $this->densiteDePopulationAuKm2 = $densiteDePopulationAuKm2;

        return $this;
    }

    public function getVariationDeLaPopulationSur10AnsEn(): ?float
    {
        return $this->variationDeLaPopulationSur10AnsEn;
    }

    public function setVariationDeLaPopulationSur10AnsEn(?float $variationDeLaPopulationSur10AnsEn): static
    {
        $this->variationDeLaPopulationSur10AnsEn = $variationDeLaPopulationSur10AnsEn;

        return $this;
    }

    public function getDontContributionDuSoldeNaturelEn(): ?float
    {
        return $this->dontContributionDuSoldeNaturelEn;
    }

    public function setDontContributionDuSoldeNaturelEn(?float $dontContributionDuSoldeNaturelEn): static
    {
        $this->dontContributionDuSoldeNaturelEn = $dontContributionDuSoldeNaturelEn;

        return $this;
    }

    public function getDontContributionDuSoldeMigratoireEn(): ?float
    {
        return $this->dontContributionDuSoldeMigratoireEn;
    }

    public function setDontContributionDuSoldeMigratoireEn(?float $dontContributionDuSoldeMigratoireEn): static
    {
        $this->dontContributionDuSoldeMigratoireEn = $dontContributionDuSoldeMigratoireEn;

        return $this;
    }

    public function getPopulationDeMoinsDe20Ans(): ?float
    {
        return $this->populationDeMoinsDe20Ans;
    }

    public function setPopulationDeMoinsDe20Ans(?float $populationDeMoinsDe20Ans): static
    {
        $this->populationDeMoinsDe20Ans = $populationDeMoinsDe20Ans;

        return $this;
    }

    public function getPopulationDe60AnsEtPlus(): ?float
    {
        return $this->populationDe60AnsEtPlus;
    }

    public function setPopulationDe60AnsEtPlus(?float $populationDe60AnsEtPlus): static
    {
        $this->populationDe60AnsEtPlus = $populationDe60AnsEtPlus;

        return $this;
    }

    public function getTauxDeChomageAuT4En(): ?float
    {
        return $this->tauxDeChomageAuT4En;
    }

    public function setTauxDeChomageAuT4En(?float $tauxDeChomageAuT4En): static
    {
        $this->tauxDeChomageAuT4En = $tauxDeChomageAuT4En;

        return $this;
    }

    public function getTauxDePauvreteEn(): ?float
    {
        return $this->tauxDePauvreteEn;
    }

    public function setTauxDePauvreteEn(?float $tauxDePauvreteEn): static
    {
        $this->tauxDePauvreteEn = $tauxDePauvreteEn;

        return $this;
    }

    public function getNombreDeResidencesPrincipales(): ?int
    {
        return $this->nombreDeResidencesPrincipales;
    }

    public function setNombreDeResidencesPrincipales(?int $nombreDeResidencesPrincipales): static
    {
        $this->nombreDeResidencesPrincipales = $nombreDeResidencesPrincipales;

        return $this;
    }

    public function getTauxDeLogementsSociauxEn(): ?float
    {
        return $this->tauxDeLogementsSociauxEn;
    }

    public function setTauxDeLogementsSociauxEn(?float $tauxDeLogementsSociauxEn): static
    {
        $this->tauxDeLogementsSociauxEn = $tauxDeLogementsSociauxEn;

        return $this;
    }

    public function getTauxDeLogementsVacantsEn(): ?float
    {
        return $this->tauxDeLogementsVacantsEn;
    }

    public function setTauxDeLogementsVacantsEn(?float $tauxDeLogementsVacantsEn): static
    {
        $this->tauxDeLogementsVacantsEn = $tauxDeLogementsVacantsEn;

        return $this;
    }

    public function getTauxDeLogementsIndividuelsEn(): ?float
    {
        return $this->tauxDeLogementsIndividuelsEn;
    }

    public function setTauxDeLogementsIndividuelsEn(?float $tauxDeLogementsIndividuelsEn): static
    {
        $this->tauxDeLogementsIndividuelsEn = $tauxDeLogementsIndividuelsEn;

        return $this;
    }

    public function getMoyenneAnnuelleDeLaConstructionNeuveSur10Ans(): ?int
    {
        return $this->moyenneAnnuelleDeLaConstructionNeuveSur10Ans;
    }

    public function setMoyenneAnnuelleDeLaConstructionNeuveSur10Ans(?int $moyenneAnnuelleDeLaConstructionNeuveSur10Ans): static
    {
        $this->moyenneAnnuelleDeLaConstructionNeuveSur10Ans = $moyenneAnnuelleDeLaConstructionNeuveSur10Ans;

        return $this;
    }

    public function getParcSocialLogementsDemolis(): ?float
    {
        return $this->parcSocialLogementsDemolis;
    }

    public function setParcSocialLogementsDemolis(?float $parcSocialLogementsDemolis): static
    {
        $this->parcSocialLogementsDemolis = $parcSocialLogementsDemolis;

        return $this;
    }

    public function getParcSocialVentesADesPersonnesPhysiques(): ?float
    {
        return $this->parcSocialVentesADesPersonnesPhysiques;
    }

    public function setParcSocialVentesADesPersonnesPhysiques(?float $parcSocialVentesADesPersonnesPhysiques): static
    {
        $this->parcSocialVentesADesPersonnesPhysiques = $parcSocialVentesADesPersonnesPhysiques;

        return $this;
    }

    public function getParcSocialTauxDeLogementsVacantsEn(): ?float
    {
        return $this->parcSocialTauxDeLogementsVacantsEn;
    }

    public function setParcSocialTauxDeLogementsVacantsEn(?float $parcSocialTauxDeLogementsVacantsEn): static
    {
        $this->parcSocialTauxDeLogementsVacantsEn = $parcSocialTauxDeLogementsVacantsEn;

        return $this;
    }

    public function getParcSocialTauxDeLogementsIndividuelsEn(): ?float
    {
        return $this->parcSocialTauxDeLogementsIndividuelsEn;
    }

    public function setParcSocialTauxDeLogementsIndividuelsEn(?float $parcSocialTauxDeLogementsIndividuelsEn): static
    {
        $this->parcSocialTauxDeLogementsIndividuelsEn = $parcSocialTauxDeLogementsIndividuelsEn;

        return $this;
    }

    public function getParcSocialLoyerMoyenEnEurM2Mois(): ?float
    {
        return $this->parcSocialLoyerMoyenEnEurM2Mois;
    }

    public function setParcSocialLoyerMoyenEnEurM2Mois(?float $parcSocialLoyerMoyenEnEurM2Mois): static
    {
        $this->parcSocialLoyerMoyenEnEurM2Mois = $parcSocialLoyerMoyenEnEurM2Mois;

        return $this;
    }

    public function getParcSocialAgeMoyenDuParcEnAnnees(): ?float
    {
        return $this->parcSocialAgeMoyenDuParcEnAnnees;
    }

    public function setParcSocialAgeMoyenDuParcEnAnnees(?float $parcSocialAgeMoyenDuParcEnAnnees): static
    {
        $this->parcSocialAgeMoyenDuParcEnAnnees = $parcSocialAgeMoyenDuParcEnAnnees;

        return $this;
    }

    public function getParcSocialTauxDeLogementsEnergivoresEFGEn(): ?float
    {
        return $this->parcSocialTauxDeLogementsEnergivoresEFGEn;
    }

    public function setParcSocialTauxDeLogementsEnergivoresEFGEn(?float $parcSocialTauxDeLogementsEnergivoresEFGEn): static
    {
        $this->parcSocialTauxDeLogementsEnergivoresEFGEn = $parcSocialTauxDeLogementsEnergivoresEFGEn;

        return $this;
    }
}
