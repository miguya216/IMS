<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';
include ('head.php');
if (file_exists('views\reference\refList.php')) {
    define('IN_APP', true); 
    include ('views\reference\refList.php'); 
    include('views\reference\detailsModal.php');
    // include('views\inventory\addModal.php');
} else {
   // echo "Error: StatsOverview file not found!";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reference Data</title>
    <link rel="stylesheet" href="\ims\bootstrap\css\bootstrap.min.css">
    <script src="\ims\bootstrap\js\bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="\ims\css\style.css">
</head>
<body> 
  
    <!-- <div id="inventory" class="header-inventory">
    </div> -->
    <?php head();?>
                
        <div class="field-inventory">
        <div class="stats-header">
                    <h2>Reference Data</h2>
                </div>
                    <?php refList(); ?>
        </div>
    

        <?php 
            include ('navbar.php'); 
        ?>


        <?php 
          detailsRefModal();
        ?>
   
    
<!-- JavaScript -->
<script src="script/script.js"></script>

</body>
</html>
