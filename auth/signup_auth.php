<?php
require_once ('class/signup_class.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $signUp = new SignUP();

    $f_name = $_POST['f_name'];
    $m_name = $_POST['m_name'];
    $l_name = $_POST['l_name'];
    $kld_email = $_POST['kld_email'];
    $kld_ID = $_POST['kld_id'];
    $password = $_POST['password'];
    $unit = $_POST['unit'];

    $response = $signUp->insertNewBorrower(
        $f_name,
        $m_name,
        $l_name,
        $kld_email,
        $kld_ID,
        $password,
        $unit
    );

    if ($response['status']) {
        header("Location: /ims/login.php?registered=1");
        exit();
    } else {
        $error = $response['message']; // This is used in your signup.php HTML
    }
}
?>