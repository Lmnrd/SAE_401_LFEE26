VERSIONS DES LANGAGES : 
Symfony CLI version 5.16.1 (c) 2021-2026 Fabien Potencier (2025-11-25T07:30:20Z - stable)
React : 18.3.1
Chart.js : 4.5.1
react-chartjs-2 : 5.3.1


PRE-REQUIS : 
PHP (8.2 ou +)
Composer
Node.js (v18 ou +)
Symfony CLI
Un serveur SQL


POUR FAIRE FONCTIONNER : 
1. Installation du Backend (Symfony)
   Dans le terminal, aller dans le dossier backend :
   - cd backend
   - composer install

Pour la base SQL, importer le fichier sae401.sql
Ensuite, lancer le serveur backend : symfony serve


2. Installation du Frontend (React + Vite)
   Dans le terminal, aller dans le dossier frontend :
   - cd frontend
   - npm install
Lancer le serveur : npm run dev


IMPORTANT
Si c'est un nouveau projet cloné, il faudra peut-être générer une clé d'application Symfony si elle manque dans le .env :
php bin/console secrets:generate-keys




