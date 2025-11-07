<?php
session_start();
require_once __DIR__ . '/conn.php';

if (isset($_SESSION['user']) && isset($_SESSION['user']['user_ID'])) {
    $user_ID = $_SESSION['user']['user_ID'];

    try {
        $stmt = $pdo->prepare("
            SELECT 
                u.user_ID,
                CONCAT(u.f_name,' ', u.l_name) AS name,
                k.kld_email AS email,
                a.role_ID AS role,
                r.role_name,
                u.unit_ID
            FROM user u
            LEFT JOIN account a ON u.user_ID = a.user_ID
            LEFT JOIN role r ON a.role_ID = r.role_ID
            LEFT JOIN kld k ON u.kld_ID = k.kld_ID
            WHERE u.user_ID = ?
            LIMIT 1
        ");
        $stmt->execute([$user_ID]);
        $user = $stmt->fetch();

        if ($user) {
            echo json_encode([
                'success' => true,
                'user' => [
                    'user_ID' => $user['user_ID'],
                    'name' => trim($user['name']),
                    'email' => $user['email'],
                    'role' => (int)$user['role'],
                    'role_name' => $user['role_name'],
                    'unit_ID' => (int)$user['unit_ID']
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'User not found in database'
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'User not logged in'
    ]);
}
?>
