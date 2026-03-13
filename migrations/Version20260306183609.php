<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260306183609 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE departement ADD CONSTRAINT FK_C1765B6370E4A9D4 FOREIGN KEY (code_region) REFERENCES region (code)');
        $this->addSql('ALTER TABLE statistique_logement ADD CONSTRAINT FK_57E380456A333750 FOREIGN KEY (departement_code) REFERENCES departement (code)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE departement DROP FOREIGN KEY FK_C1765B6370E4A9D4');
        $this->addSql('ALTER TABLE statistique_logement DROP FOREIGN KEY FK_57E380456A333750');
    }
}
