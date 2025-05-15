<?php
session_start();
require_once($_SERVER['DOCUMENT_ROOT'] . '/ims/class/conn.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/ims/class/uni_fetch.php');

// Check remember me token if session is missing
if (!isset($_SESSION['account_ID']) && isset($_COOKIE['remember_token'])) {
    $stmt = $pdo->prepare("
       SELECT 
            a.account_ID,
            a.user_ID,
            a.role_ID,
            a.kld_ID,
            a.remember_token,
            a.token_expiry,
            CONCAT(u.f_name, ' ', u.m_name, ' ', u.l_name) AS full_name,
            k.kld_email,
            un.unit_name
        FROM account a
        JOIN user u ON a.user_ID = u.user_ID
        JOIN kld k ON a.kld_ID = k.kld_ID
        LEFT JOIN unit un ON u.unit_ID = un.unit_ID
        WHERE a.remember_token = :token AND a.token_expiry > NOW()");
    $stmt->execute(['token' => $_COOKIE['remember_token']]);
    $user = $stmt->fetch();

    if ($user) {
        $_SESSION['account_ID']  = $user['account_ID'];
        $_SESSION['user_ID']     = $user['user_ID'];
        $_SESSION['role_ID']     = $user['role_ID'];
        $_SESSION['full_name']   = $user['full_name'];
        $_SESSION['kld_email']   = $user['kld_email'];
        $_SESSION['kld_ID']      = $user['kld_ID'];
        $_SESSION['unit_name']        = $user['unit_name'];
    } else {
        setcookie("remember_token", "", time() - 3600, "/");
    }
}

// Force login redirect for all pages that include this file
if (!isset($_SESSION['account_ID'])) {
    header("Location: /ims/login.php");
    exit();
}

// Optional: restrict admin-only pages automatically
$current_page = basename($_SERVER['PHP_SELF']);
$admin_only_pages = ['users.php', 'reference.php']; // add more as needed
$borrower_only_pages = ['borrower.php','requestForm.php','receipt.php','index.php'];


if ($_SESSION['role_ID'] != 1 && in_array($current_page, $admin_only_pages)) {
    echo '
    <script>
        alert("Access denied. This page is restricted to administrator.");
        window.history.back();
    </script>';
    exit();
}

// Block borrowers from all pages EXCEPT the allowed ones
if ($_SESSION['role_ID'] == 3 && !in_array($current_page, $borrower_only_pages)) {
    echo '
    <script>
        alert("Access denied. This page is restricted to administrator.");
        window.location.href = "/ims/admin/borrower.php";
    </script>';
    exit();
}

?>
