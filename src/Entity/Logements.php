<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'logements')]
class Logements
{
    #[ORM\Id]
    #[ORM\Column]
    #[Groups(['logements'])]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logements'])]
    private ?int $nombreLogements = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logements'])]
    private ?int $nombreResidencesPrincipales = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logements'])]
    private ?int $nombreLogementsVacants = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logements'])]
    private ?float $tauxLogementsVacants = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['logements'])]
    private ?int $nombreResidenceSecondaire = null;

    public function getId(): ?int { return $this->id; }
    public function setId(int $id): static { $this->id = $id; return $this; }

    public function getNombreLogements(): ?int { return $this->nombreLogements; }
    public function setNombreLogements(?int $nombreLogements): static { $this->nombreLogements = $nombreLogements; return $this; }

    public function getNombreResidencesPrincipales(): ?int { return $this->nombreResidencesPrincipales; }
    public function setNombreResidencesPrincipales(?int $nombreResidencesPrincipales): static { $this->nombreResidencesPrincipales = $nombreResidencesPrincipales; return $this; }

    public function getNombreLogementsVacants(): ?int { return $this->nombreLogementsVacants; }
    public function setNombreLogementsVacants(?int $nombreLogementsVacants): static { $this->nombreLogementsVacants = $nombreLogementsVacants; return $this; }

    public function getTauxLogementsVacants(): ?float { return $this->tauxLogementsVacants; }
    public function setTauxLogementsVacants(?float $tauxLogementsVacants): static { $this->tauxLogementsVacants = $tauxLogementsVacants; return $this; }

    public function getNombreResidenceSecondaire(): ?int { return $this->nombreResidenceSecondaire; }
    public function setNombreResidenceSecondaire(?int $nombreResidenceSecondaire): static { $this->nombreResidenceSecondaire = $nombreResidenceSecondaire; return $this; }
}
