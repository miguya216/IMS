<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php';

try {
    $stats = [];

    // 1. Total Assets
    $stmt = $pdo->query("SELECT COUNT(*) AS total_assets FROM asset");
    $stats['total_assets'] = $stmt->fetch()['total_assets'];

    // 2. Active Users
    $stmt = $pdo->query("SELECT COUNT(*) AS active_users FROM user WHERE user_status = 'active'");
    $stats['active_users'] = $stmt->fetch()['active_users'];

    // 3. Total Borrowed Items
    $stmt = $pdo->query("SELECT COUNT(*) AS total_borrowed FROM borrow WHERE borrow_status = 'active'");
    $stats['total_borrowed'] = $stmt->fetch()['total_borrowed'];

    // 4. Total Returned Items
    $stmt = $pdo->query("SELECT COUNT(*) AS total_returned FROM returns");
    $stats['total_returned'] = $stmt->fetch()['total_returned'];

    // 5. Pending Requests
    $stmt = $pdo->query("SELECT COUNT(*) AS pending_requests FROM request_form WHERE response_status = 'pending'");
    $stats['pending_requests'] = $stmt->fetch()['pending_requests'];

    // 6. Total Messages Sent
    $stmt = $pdo->query("SELECT COUNT(*) AS total_messages FROM message");
    $stats['total_messages'] = $stmt->fetch()['total_messages'];

     // 7. Total Inactive Assets
    $stmt = $pdo->query("SELECT COUNT(*) AS inactive_assets FROM asset where asset_status = 'inactive'");
    $stats['inactive_assets'] = $stmt->fetch()['inactive_assets'];

    echo json_encode($stats);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
