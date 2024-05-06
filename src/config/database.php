<?php
// database.php
$host = 'localhost';  // Retirer le port ici
$db   = 'users';      // Assurez-vous que c'est le bon nom de la base de données
$user = 'root';
$pass = 'root';
$charset = 'utf8mb4';

// Correction du DSN: utilisation de 'dbname' et ajout du port correct
$dsn = "mysql:host=$host;port=3000;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
