<?php
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

session_start();
session_destroy();
include('../views/logout.html');
echo '<script>setTimeout(function() { window.location.href = "login.php"; }, 5000);</script>';

header('Location: login.php');
exit();

