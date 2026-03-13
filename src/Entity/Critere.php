<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'critere')]
class Critere
{
    #[ORM\Id]
    #[ORM\Column]
    #[Groups(['critere'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['critere'])]
    private ?string $anneePublication = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['critere'])]
    private ?string $nomDepartement = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['critere'])]
    private ?string $nomRegion = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['critere'])]
    private ?string $nombreHabitants = null;

    public function getId(): ?int { return $this->id; }
    public function setId(int $id): static { $this->id = $id; return $this; }

    public function getAnneePublication(): ?string { return $this->anneePublication; }
    public function setAnneePublication(?string $anneePublication): static { $this->anneePublication = $anneePublication; return $this; }

    public function getNomDepartement(): ?string { return $this->nomDepartement; }
    public function setNomDepartement(?string $nomDepartement): static { $this->nomDepartement = $nomDepartement; return $this; }

    public function getNomRegion(): ?string { return $this->nomRegion; }
    public function setNomRegion(?string $nomRegion): static { $this->nomRegion = $nomRegion; return $this; }

    public function getNombreHabitants(): ?string { return $this->nombreHabitants; }
    public function setNombreHabitants(?string $nombreHabitants): static { $this->nombreHabitants = $nombreHabitants; return $this; }
}
