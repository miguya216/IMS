<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';
if (file_exists('views/inventory/itemList.php')) {
    define('IN_APP', true); 
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
    <title>Inventory Management</title>
    <link rel="stylesheet" href="\ims\bootstrap\css\bootstrap.min.css">
    <script src="\ims\bootstrap\js\bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="\ims\css\style.css">
</head>
<body> 
  
    <div id="inventory" class="header-inventory">
        <div class="field-inventory">
            <form id="searchForm">
                <div class="invt-field-details">
                    <div class="invt-field-header"><h4>Search here:</h4>
                        <div class="invt-input-box">
                            <input type="text" class="search-bar" id="searchInput" placeholder="Type to Search Account" onkeyup="searchInventory()" required>
                                <button type="button" class="btn" id="addItemBtn">
                                    <img src="imgs/add.png" alt="Add Items" class="invt-icon">
                                    Add Item
                                </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        <div class="field-inventory">
            <div class="invt-list-container">
                    <?php itemList(); ?>
            </div>
        </div>
    </div>
    
    <div>
        <?php 
            include ('navbar.php'); 
        ?>
    </div>

    <div>
        <?php 
            details();
        ?>
    </div>
    <div>
        <?php 
            addModal();
        ?>
    </div>
    
<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="script/script.js"></script>
<script src="script/inventory.js"></script>

</body>
</html>
