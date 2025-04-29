<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';
if (file_exists('views/inventory/itemList.php')) {
    define('IN_APP', true); 
    include ('head.php');
    include ('views\inventory\itemList.php'); 
    include('views\inventory\detailsModal.php');
    include('views\inventory\addModal.php');
} else {
    echo "Error: StatsOverview file not found!";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assets</title>
    <link rel="stylesheet" href="\ims\bootstrap\css\bootstrap.min.css">
    <script src="\ims\bootstrap\js\bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="\ims\css\style.css">
</head>
<body> 
  
    <!-- <div id="inventory" class="header-inventory">
    </div> -->
        <?php head();?>
        <div class="field-inventory">
                <form id="searchForm">
                    <div class="invt-field-details">
                        <!-- <div class="invt-field-header">
                        </div> -->
                            <div class="invt-input-box">
                                <input type="text" class="search-bar" id="searchInput" placeholder="Search Asset" onkeyup="searchInventory()">
                                    
                                        <img type="button" id="addItemBtn" src="imgs/add.png" alt="Add Items" class="button-add">
                                        <img type="button" src="imgs/import.png" alt="Import file" class="button-add">
                             
                            </div>
                        
                    </div>
                </form>
            <div class="invt-list-container">
                    <?php itemList(); ?>
            </div>
        </div>
   
        <?php include ('navbar.php'); ?>

        <?php details();?>
        <?php addModal();?>
    
<!-- JavaScript -->
<!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script> -->
<script src="script/script.js"></script>

</body>
</html>
