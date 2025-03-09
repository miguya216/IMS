<?php 
if (file_exists('views/inventory/itemList.php')) {
    define('IN_APP', true); 
    include ('views\request\list.php');
} else {
    echo "Error: StatsOverview file not found!";
}
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request</title>
    <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
    <script src="bootstrap/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="css/borrowed.css">
</head>
<body>
        <div class="header-container"><h2>Borrowed Assets</h2>
            <div class="list-container">
                <div class="list">
                    <?php requestList(); ?>
                </div>
            </div>
        </div>
    <div>
            <?php include ('navbar.php'); ?>
    </div>
    <!-- JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script/script.js"></script>

</body>
</html>
