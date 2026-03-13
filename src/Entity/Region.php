<?php

namespace App\Entity;

use App\Repository\RegionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: RegionRepository::class)]
class Region
{
    #[ORM\Id]
    #[ORM\Column(length: 3)]
    #[Groups(['departement', 'region'])]
    private ?string $code = null;

    #[ORM\Column(length: 255)]
    #[Groups(['departement', 'region'])]
    private ?string $nom = null;

    #[ORM\OneToMany(mappedBy: 'codeRegion', targetEntity: Departement::class)]
    #[Groups(['region'])]
    private Collection $departements;

    public function __construct()
    {
        $this->departements = new ArrayCollection();
    }



    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * @return Collection<int, Departement>
     */
    public function getDepartements(): Collection
    {
        return $this->departements;
    }

    public function addDepartement(Departement $departement): static
    {
        if (!$this->departements->contains($departement)) {
            $this->departements->add($departement);
            $departement->setCodeRegion($this);
        }

        return $this;
    }

    public function removeDepartement(Departement $departement): static
    {
        if ($this->departements->removeElement($departement)) {
            // set the owning side to null (unless already changed)
            if ($departement->getCodeRegion() === $this) {
                $departement->setCodeRegion(null);
            }
        }

        return $this;
    }
}
