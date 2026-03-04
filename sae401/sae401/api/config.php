<?php
// fichier PHP qui permet de se connecter à la base de données pour l'accès aux données
// il permet de retourner la connexion à la base de données

class Database {
    private $host = "localhost";
    private $dbname = "sae401";
    private $username = "root";
    private $password = "";

    public function getConnection() {
        try {
            $pdo = new PDO(
                "mysql:host=".$this->host.";dbname=".$this->dbname.";charset=utf8",
                $this->username,
                $this->password
            );
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;

        } catch(PDOException $e) {
            die("Erreur connexion BDD : " . $e->getMessage());
        }
    }
}
