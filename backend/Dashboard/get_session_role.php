<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user']['role'])) {
    echo json_encode([
        'status' => 'success',
        'role' => $_SESSION['user']['role']
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'No active session'
    ]);
}
?>
