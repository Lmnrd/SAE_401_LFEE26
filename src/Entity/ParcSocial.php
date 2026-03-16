<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'parc_social')]
class ParcSocial
{
    #[ORM\Id]
    #[ORM\Column]
    #[Groups(['parc_social'])]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['parc_social'])]
    private ?int $nombreLogements = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['parc_social'])]
    private ?int $logementsLocation = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['parc_social'])]
    private ?int $logementsDemolis = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['parc_social'])]
    private ?int $ventesPersonnesPhysiques = null;

    // === RELATION : ParcSocial -> Critere (ManyToOne) ===
    #[ORM\ManyToOne(targetEntity: Critere::class, inversedBy: 'parcSociaux')]
    #[ORM\JoinColumn(name: 'critere_id', referencedColumnName: 'id')]
    #[Groups(['parc_social'])]
    private ?Critere $critere = null;

    public function getId(): ?int { return $this->id; }
    public function setId(int $id): static { $this->id = $id; return $this; }

    public function getNombreLogements(): ?int { return $this->nombreLogements; }
    public function setNombreLogements(?int $nombreLogements): static { $this->nombreLogements = $nombreLogements; return $this; }

    public function getLogementsLocation(): ?int { return $this->logementsLocation; }
    public function setLogementsLocation(?int $logementsLocation): static { $this->logementsLocation = $logementsLocation; return $this; }

    public function getLogementsDemolis(): ?int { return $this->logementsDemolis; }
    public function setLogementsDemolis(?int $logementsDemolis): static { $this->logementsDemolis = $logementsDemolis; return $this; }

    public function getVentesPersonnesPhysiques(): ?int { return $this->ventesPersonnesPhysiques; }
    public function setVentesPersonnesPhysiques(?int $ventesPersonnesPhysiques): static { $this->ventesPersonnesPhysiques = $ventesPersonnesPhysiques; return $this; }

    // Getter/Setter pour la relation
    public function getCritere(): ?Critere { return $this->critere; }
    public function setCritere(?Critere $critere): static { $this->critere = $critere; return $this; }
}
