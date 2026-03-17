<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260306182059 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750 (queue_name, available_at, delivered_at, id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE departement ADD CONSTRAINT FK_C1765B6370E4A9D4 FOREIGN KEY (code_region) REFERENCES region (code)');
        $this->addSql('ALTER TABLE statistique_logement ADD logements_mis_en_location DOUBLE PRECISION NOT NULL, ADD annee_publication INT NOT NULL, ADD densite_de_population_au_km2 DOUBLE PRECISION NOT NULL, ADD variation_de_la_population_sur10_ans_en DOUBLE PRECISION NOT NULL, ADD dont_contribution_du_solde_naturel_en DOUBLE PRECISION NOT NULL, ADD dont_contribution_du_solde_migratoire_en DOUBLE PRECISION NOT NULL, ADD population_de_moins_de20_ans DOUBLE PRECISION NOT NULL, ADD population_de60_ans_et_plus DOUBLE PRECISION NOT NULL, ADD taux_de_chomage_au_t4_en DOUBLE PRECISION NOT NULL, ADD taux_de_pauvrete_en DOUBLE PRECISION NOT NULL, ADD nombre_de_residences_principales INT NOT NULL, ADD taux_de_logements_sociaux_en DOUBLE PRECISION NOT NULL, ADD taux_de_logements_vacants_en DOUBLE PRECISION NOT NULL, ADD taux_de_logements_individuels_en DOUBLE PRECISION NOT NULL, ADD moyenne_annuelle_de_la_construction_neuve_sur10_ans INT NOT NULL, ADD parc_social_logements_demolis DOUBLE PRECISION NOT NULL, ADD parc_social_ventes_ades_personnes_physiques DOUBLE PRECISION NOT NULL, ADD parc_social_taux_de_logements_vacants_en DOUBLE PRECISION NOT NULL, ADD parc_social_taux_de_logements_individuels_en DOUBLE PRECISION NOT NULL, ADD parc_social_loyer_moyen_en_eur_m2_mois DOUBLE PRECISION NOT NULL, ADD parc_social_age_moyen_du_parc_en_annees DOUBLE PRECISION NOT NULL, ADD parc_social_taux_de_logements_energivores_efgen DOUBLE PRECISION NOT NULL');
        $this->addSql('ALTER TABLE statistique_logement ADD CONSTRAINT FK_57E380456A333750 FOREIGN KEY (departement_code) REFERENCES departement (code)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE messenger_messages');
        $this->addSql('ALTER TABLE departement DROP FOREIGN KEY FK_C1765B6370E4A9D4');
        $this->addSql('ALTER TABLE statistique_logement DROP FOREIGN KEY FK_57E380456A333750');
        $this->addSql('ALTER TABLE statistique_logement DROP logements_mis_en_location, DROP annee_publication, DROP densite_de_population_au_km2, DROP variation_de_la_population_sur10_ans_en, DROP dont_contribution_du_solde_naturel_en, DROP dont_contribution_du_solde_migratoire_en, DROP population_de_moins_de20_ans, DROP population_de60_ans_et_plus, DROP taux_de_chomage_au_t4_en, DROP taux_de_pauvrete_en, DROP nombre_de_residences_principales, DROP taux_de_logements_sociaux_en, DROP taux_de_logements_vacants_en, DROP taux_de_logements_individuels_en, DROP moyenne_annuelle_de_la_construction_neuve_sur10_ans, DROP parc_social_logements_demolis, DROP parc_social_ventes_ades_personnes_physiques, DROP parc_social_taux_de_logements_vacants_en, DROP parc_social_taux_de_logements_individuels_en, DROP parc_social_loyer_moyen_en_eur_m2_mois, DROP parc_social_age_moyen_du_parc_en_annees, DROP parc_social_taux_de_logements_energivores_efgen');
    }
}
