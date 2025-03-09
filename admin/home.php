<?php 
//error handling
if (file_exists('views/home/StatsOverview.php')) {
    define('IN_APP', true); 
    include ('views/home/StatsOverview.php');
} else {
    echo "Error: StatsOverview file not found!";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
    <script src="bootstrap/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="css/home.css">
</head>
<body>
        <div class="card-container">
                <?php StatsOverview(); ?>
        </div>

        <div>
            <?php include ('navbar.php'); ?>
        </div>
    <!-- JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="script/script.js"></script>

</body>
</html>
