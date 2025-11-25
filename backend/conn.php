<?php
$host = 'localhost';
$db   = 'IMS';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Change only this when moving from local to hosting
define("BASE_STORAGE_PATH", $_SERVER['DOCUMENT_ROOT'] . '/IMS/frontend/public/');
// define("BASE_STORAGE_PATH", $_SERVER['DOCUMENT_ROOT'] . '/'); // for hosting

?>
