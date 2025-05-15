<?php
require_once 'conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['barcode'])) {
    $inventoryTag = trim($_POST['barcode']); // this is actually the inventory tag

    $stmt = $pdo->prepare("
        SELECT 
            b.barcode_image_path,
            br.brand_name,
            CONCAT(u.f_name, ' ', COALESCE(u.m_name, ''), ' ', u.l_name) AS responsible
        FROM asset a
        INNER JOIN barcode b ON a.barcode_ID = b.barcode_ID
        INNER JOIN brand br ON a.brand_ID = br.brand_ID
        INNER JOIN user u ON a.responsible_user_ID = u.user_ID
        WHERE a.inventory_tag = :inventory_tag
        LIMIT 1
    ");
    $stmt->execute(['inventory_tag' => $inventoryTag]);
    $result = $stmt->fetch();

    if ($result) {
        echo json_encode([
            'success' => true,
            'barcode_image' => $result['barcode_image_path'],
            'brand' => $result['brand_name'],
            'responsible' => trim($result['responsible'])
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No asset found for that inventory tag.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request.'
    ]);
}
?>
