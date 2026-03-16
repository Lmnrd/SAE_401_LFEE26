<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\Critere;
use App\Entity\Logements;
use App\Entity\ParcSocial;
use App\Entity\TauxLogement;
use App\Entity\TauxPopulation;
use Doctrine\ORM\EntityManagerInterface;


final class StatistiqueController extends AbstractController
{
    public function critere(EntityManagerInterface $entityManager): Response
    {
        $criteres = $entityManager->getRepository(Critere::class)->findAll();
        return $this->json($criteres, 200, [
            'Access-Control-Allow-Origin' => '*'
        ], [
            'groups' => ['critere']
        ]);
    }

    public function logements(EntityManagerInterface $entityManager): Response
    {
        $logements = $entityManager->getRepository(Logements::class)->findAll();
        return $this->json($logements, 200, [
            'Access-Control-Allow-Origin' => '*'
        ], [
            'groups' => ['logements']
        ]);
    }

    public function parcSocial(EntityManagerInterface $entityManager): Response
    {
        $parcSocial = $entityManager->getRepository(ParcSocial::class)->findAll();
        return $this->json($parcSocial, 200, [
            'Access-Control-Allow-Origin' => '*'
        ], [
            'groups' => ['parc_social']
        ]);
    }

    public function tauxLogement(EntityManagerInterface $entityManager): Response
    {
        $tauxLogement = $entityManager->getRepository(TauxLogement::class)->findAll();
        return $this->json($tauxLogement, 200, [
            'Access-Control-Allow-Origin' => '*'
        ], [
            'groups' => ['taux_logement']
        ]);
    }

    public function tauxPopulation(EntityManagerInterface $entityManager): Response
    {
        $tauxPopulation = $entityManager->getRepository(TauxPopulation::class)->findAll();
        return $this->json($tauxPopulation, 200, [
            'Access-Control-Allow-Origin' => '*'
        ], [
            'groups' => ['taux_population']
        ]);
    }
}
