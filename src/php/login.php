<?php
// Ajout des en-têtes CORS pour permettre les requêtes inter-domaines
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

// Début du script pour l'authentification
session_start();
$db = new PDO('mysql:host=localhost;dbname=users', 'root', 'root');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $statement = $db->prepare("SELECT * FROM users WHERE username = ?");
    $statement->execute([$username]);
    $user = $statement->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        header("Location: welcome.php");
    } else {
        echo "Invalid username or password";
    }
}
else {
    // Inclure le fichier HTML si aucune donnée POST n'est traitée
    include '../views/login.html';
}
?>
