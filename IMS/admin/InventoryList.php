<?php
if (file_exists('views/inventory/itemList.php')) {
    define('IN_APP', true); 
    include ('views\inventory\itemList.php'); 
    include('details.php');
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
    <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
    <script src="bootstrap/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="css/inventoryList.css">
</head>
<body> 
  
    <div id="inventory" class="header-container">
        <div class="field-container">
            <form id="searchForm">
                <div class="field-details">
                <div class="field-content"><h4>Search here:</h4>
                <div class="input-box">
                        <input type="text" class="search-bar" id="searchInput" placeholder="Type to Search Item" onkeyup="searchInventory()" required>
                    </div>
                    </div>

                </div>
            </form>
        </div>

        <div class="list-container">
            <div class="list">
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
    
<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="script/script.js"></script>
<script src="script/inventory.js"></script>

</body>
</html>
