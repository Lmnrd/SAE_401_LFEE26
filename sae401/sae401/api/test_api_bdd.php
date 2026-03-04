<?php
require_once 'config.php';

$db = new Database();
$cnx = $db->getConnection();

function getDonneesCritere($cnx, $table) {
    $sql = "SELECT * FROM $table";
    $stmt = $cnx->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

$tables = ["critere", "logements", "parc_social", "taux_logement", "taux_population"];
$donnees = [];

foreach ($tables as $table) {
    $donnees[$table] = getDonneesCritere($cnx, $table);
}

echo "<pre>";
print_r($donnees);
echo "</pre>";
