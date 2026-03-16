<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'taux_logement')]
class TauxLogement
{
    #[ORM\Id]
    #[ORM\Column]
    #[Groups(['taux_logement'])]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['taux_logement'])]
    private ?float $pourcTauxLogementsSociaux = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['taux_logement'])]
    private ?float $pourcTauxLogementsVacants = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['taux_logement'])]
    private ?float $pourcTauxLogementsIndividuels = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['taux_logement'])]
    private ?int $nombreLogements = null;

    // === RELATION : TauxLogement -> Critere (ManyToOne) ===
    #[ORM\ManyToOne(targetEntity: Critere::class, inversedBy: 'tauxLogements')]
    #[ORM\JoinColumn(name: 'critere_id', referencedColumnName: 'id')]
    #[Groups(['taux_logement'])]
    private ?Critere $critere = null;

    public function getId(): ?int { return $this->id; }
    public function setId(int $id): static { $this->id = $id; return $this; }

    public function getPourcTauxLogementsSociaux(): ?float { return $this->pourcTauxLogementsSociaux; }
    public function setPourcTauxLogementsSociaux(?float $pourcTauxLogementsSociaux): static { $this->pourcTauxLogementsSociaux = $pourcTauxLogementsSociaux; return $this; }

    public function getPourcTauxLogementsVacants(): ?float { return $this->pourcTauxLogementsVacants; }
    public function setPourcTauxLogementsVacants(?float $pourcTauxLogementsVacants): static { $this->pourcTauxLogementsVacants = $pourcTauxLogementsVacants; return $this; }

    public function getPourcTauxLogementsIndividuels(): ?float { return $this->pourcTauxLogementsIndividuels; }
    public function setPourcTauxLogementsIndividuels(?float $pourcTauxLogementsIndividuels): static { $this->pourcTauxLogementsIndividuels = $pourcTauxLogementsIndividuels; return $this; }

    public function getNombreLogements(): ?int { return $this->nombreLogements; }
    public function setNombreLogements(?int $nombreLogements): static { $this->nombreLogements = $nombreLogements; return $this; }

    // Getter/Setter pour la relation
    public function getCritere(): ?Critere { return $this->critere; }
    public function setCritere(?Critere $critere): static { $this->critere = $critere; return $this; }
}
