<?php 
if (file_exists('views/inventory/AddNewItem.php')) {
    define('IN_APP', true); 
    include ('views\inventory\AddNewItem.php');
    include ('views\inventory\recent.php'); 
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
    <link rel="stylesheet" href="css/addItem.css">
</head>
<body>
        <div class="header-container">
            <div class="field-container">
                <div class="field-details">
                    <?php newitem(); ?>
                </div>
             </div>
            <div class="list-container">
                <div class="recent">
                    <?php recentList(); ?>
                </div>
            </div>
        </div>

        <div>
            <?php include ('navbar.php'); ?>
        </div>

        
    <!-- JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script/script.js"></script>
    <script src="script/inventory.js"></script>

</body>
</html>
