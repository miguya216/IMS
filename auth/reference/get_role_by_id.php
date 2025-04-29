<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/class/fetch_data.php';

header('Content-Type: application/json');

if (isset($_GET['role_ID'])) {
    $role_ID = $_GET['role_ID'];
    $role = new Role($pdo); // lowercase to match usage below
$role_data = $role->fetchRoleById($role_ID); // renamed for clarity

if ($role_data) {
    echo json_encode($role_data);
} else {
    echo json_encode(['error' => 'role not found', 'role_ID_received' => $role_ID]);
}

} else {
    echo json_encode(['error' => 'No role_ID received']);
}
?>
