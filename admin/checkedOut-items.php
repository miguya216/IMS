<?php 
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';
if (file_exists('views/checkedOut-item/checkedOutlist.php')) {
    define('IN_APP', true); 
    include ('head.php');
    include ('views/checkedOut-item/checkedOutlist.php');
} else {
    echo "Error: StatsOverview file not found!";
}
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checked-out Items</title>
    <link rel="stylesheet" href="\ims\bootstrap\css\bootstrap.min.css">
    <script src="\ims\bootstrap\js\bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="\ims\css\style.css">
</head>
<body>
    <?php head(); ?>
    <div class="field-inventory">
        <form id="searchForm">
            <div class="invt-input-details">
                <div class="invt-input-box">
                <img type="button" onclick="openRequestForm()" src="imgs/add.png" alt="Add Request" class="button-add">
                <input type="text" class="search-bar" id="searchInput" placeholder = "Search Checked-out item" onkeyup="searchInput()">
                </div>
            </div>
        </form>

        <div class="invt-list-container">
            <?php checkedOuts(); ?>
        </div>

    </div>
        
    <?php include ('navbar.php'); ?>
    <!-- JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script/script.js"></script>

</body>
</html>
