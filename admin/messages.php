<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';
include ('views\messages\messagesview.php'); 
 include ('views\messages\emailsview.php'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Messages</title>
    <link rel="stylesheet" href="../bootstrap/css/bootstrap.min.css">
    <script src="../bootstrap/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Include Navbar -->
    <div>
            <?php include ('navbar.php'); ?>
    </div>

    <h1 class="text-center">Messages</h1>    

    <div class="container mt-12">
        <div class="row">
        <!-- Left Side: Add New Item -->
        <div class="col-md-6">
            <?php messages(); ?>
        </div>

        <!-- Right Side: Item List -->
        <div class="col-md-6">
            <?php emails(); ?>
        </div>
    </div>
</div>


    <!-- JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="script/script.js"></script>

</body>
</html>
