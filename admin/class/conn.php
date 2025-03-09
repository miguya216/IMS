<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "ims";

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Return the connection variable
return $conn;
?>
