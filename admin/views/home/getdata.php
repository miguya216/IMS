<?php
// getData.php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php';

// Make sure database connection is $pdo
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$action = $_GET['action'] ?? '';

if ($action === 'assets') {
    // Total Assets per Asset Type
    $sql = "
        SELECT at.asset_type, COUNT(a.asset_ID) AS total_assets
        FROM asset a
        JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
        GROUP BY a.asset_type_ID
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

} elseif ($action === 'status') {
    // Active vs Inactive Assets
    $sql = "
        SELECT asset_status, COUNT(*) AS total
        FROM asset
        GROUP BY asset_status
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

} elseif ($action === 'users_per_unit') {
    // Users per Unit
    $sql = "
        SELECT u.unit_name, COUNT(us.user_ID) AS total_users
        FROM user us
        JOIN unit u ON us.unit_ID = u.unit_ID
        GROUP BY u.unit_ID
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

} else {
  //  echo json_encode(['error' => 'Invalid action']);
}
?>
