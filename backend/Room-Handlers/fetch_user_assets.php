<?php
session_start();
require_once __DIR__ . '/../conn.php';

if (!isset($_SESSION['user']['user_ID'])) {
    echo json_encode(["error" => "Unauthorized access"]);
    exit;
}

$sql = "
    SELECT 
        a.asset_ID,
        a.kld_property_tag AS kld_property_tag,
        r.room_number AS room,
        b.brand_name AS brand,
        at.asset_type AS asset_type,
        a.price_amount AS price_amount,
        ac.condition_name AS asset_condition,
        CONCAT(u.f_name, ' ', u.l_name) AS responsible_person,
        u.user_ID AS responsible_user_ID
    FROM asset a
    LEFT JOIN room r 
        ON a.room_ID = r.room_ID
    LEFT JOIN brand b 
        ON a.brand_ID = b.brand_ID
    LEFT JOIN asset_type at 
        ON a.asset_type_ID = at.asset_type_ID
    LEFT JOIN asset_condition ac 
        ON a.asset_condition_ID = ac.asset_condition_ID
    LEFT JOIN user u
        ON a.responsible_user_ID = u.user_ID
    WHERE a.asset_status = 'active'
";

$stmt = $pdo->prepare($sql);
$stmt->execute();
$assets = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($assets);
?>