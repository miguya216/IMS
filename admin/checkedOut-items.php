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
    <div class="stats-header">
            <h2>Check-out items</h2>
        </div>
        <form id="searchForm">
            <div class="invt-input-details">
                <div class="invt-input-box">
                    <img type="button" onclick="openReceiptForm()" src="imgs/add.png" alt="Add Request" class="button-add">
                    <input type="text" class="search-bar" id="searchInput" placeholder = "Search Checked-out item" onkeyup="searchInput()">
                    <!-- <label>Sort:</label>
                    <select class="dropdown-filter" data-column="1">
                        <option value="">by name</option>
                    </select> 
                    <select class="dropdown-filter" data-column="2">
                        <option value="">by unit</option>
                    </select> 
                    <select class="dropdown-filter" data-column="3">
                        <option value="">by username</option>
                    </select> 
                    <select class="dropdown-filter" data-column="4">
                        <option value="">by role</option>
                    </select>  -->
                </div>
            </div>
        </form>
    
        <div class="invt-list-container">
            <?php checkedOuts(); ?>
        </div>

    </div>
        
    <?php include ('navbar.php'); ?>
    
    <script src="script/script.js"></script>

</body>
</html>
