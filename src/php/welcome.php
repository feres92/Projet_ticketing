<?php

session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
echo "Bienvenue sur la page d'accueil sécurisée!";
// Lien de déconnexion
echo "<a href='logout.php'>Déconnexion</a>";

