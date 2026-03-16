<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'taux_population')]
class TauxPopulation
{
    #[ORM\Id]
    #[ORM\Column]
    #[Groups(['taux_population'])]
    private ?int $id = null;

    #[ORM\Column(name: "pourc_population_moins_20_ans", nullable: true)]
    #[Groups(['taux_population'])]
    private ?float $pourcPopulationMoins20Ans = null;
    
    #[ORM\Column(name: "pourc_population_60_ans_et_plus", nullable: true)]
    #[Groups(['taux_population'])]
    private ?float $pourcPopulation60AnsEtPlus = null;

    #[ORM\Column(name: "pourc_variation_population_sur_10_ans", nullable: true)]
    #[Groups(['taux_population'])]
    private ?float $pourcVariationPopulationSur10Ans = null;

    #[ORM\Column(name: "densite_population_au_km_carre", nullable: true)]
    #[Groups(['taux_population'])]
    private ?float $densitePopulationAuKmCarre = null;

    public function getId(): ?int { return $this->id; }
    public function setId(int $id): static { $this->id = $id; return $this; }

    public function getPourcPopulationMoins20Ans(): ?float { return $this->pourcPopulationMoins20Ans; }
    public function setPourcPopulationMoins20Ans(?float $pourcPopulationMoins20Ans): static { $this->pourcPopulationMoins20Ans = $pourcPopulationMoins20Ans; return $this; }

    public function getPourcPopulation60AnsEtPlus(): ?float { return $this->pourcPopulation60AnsEtPlus; }
    public function setPourcPopulation60AnsEtPlus(?float $pourcPopulation60AnsEtPlus): static { $this->pourcPopulation60AnsEtPlus = $pourcPopulation60AnsEtPlus; return $this; }

    public function getPourcVariationPopulationSur10Ans(): ?float { return $this->pourcVariationPopulationSur10Ans; }
    public function setPourcVariationPopulationSur10Ans(?float $pourcVariationPopulationSur10Ans): static { $this->pourcVariationPopulationSur10Ans = $pourcVariationPopulationSur10Ans; return $this; }

    public function getDensitePopulationAuKmCarre(): ?float { return $this->densitePopulationAuKmCarre; }
    public function setDensitePopulationAuKmCarre(?float $densitePopulationAuKmCarre): static { $this->densitePopulationAuKmCarre = $densitePopulationAuKmCarre; return $this; }
}
