<?php
// Démarrage de la session
session_start();

// Redirection simple en fonction de l'état de connexion de l'utilisateur
if (isset($_SESSION['user_id'])) {
    include('welcome.php'); // Fichier pour les utilisateurs connectés
} else {
    include('login.php'); // Fichier de connexion pour les utilisateurs non connectés
}
?>
