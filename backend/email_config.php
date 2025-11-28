<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

function getMailer(): PHPMailer {
    global $pdo; 
    // Fetch email sender from DB
    $stmt = $pdo->query("SELECT email_sender, email_sender_password FROM settings_preferences LIMIT 1");
    $row = $stmt->fetch();

    // Fallback if DB is empty
    $emailSender = $row ? $row['email_sender'] : 'repuya.juanmiguel.kld.com';
    $emailSenderPassword = $row ? $row['email_sender_password'] : 'qglriuafygubefju';

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $emailSender;
    $mail->Password   = $emailSenderPassword; 
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    $mail->setFrom($emailSender, 'IMS Admin'); // from DB
    return $mail;
}

$domain = "https://localhost:5173/";
?>



<?php
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// require_once __DIR__ . '/../vendor/autoload.php';

// function getMailer(): PHPMailer {
//     $mail = new PHPMailer(true);
//     $mail->isSMTP();
//     $mail->Host       = 'smtp.gmail.com';
//     $mail->SMTPAuth   = true;
//     $mail->Username   = 'repuya.juanmiguel.kld@gmail.com'; // Can be modify
//     $mail->Password   = 'qglriuafygubefju'; // Can be modify
//     $mail->SMTPSecure = 'tls';
//     $mail->Port       = 587;

//     $mail->setFrom('repuya.juanmiguel.kld@gmail.com', 'IMS Admin'); // Can be modify
//     return $mail;
// }

// $domain = "https://192.168.100.52:5173/"
?>