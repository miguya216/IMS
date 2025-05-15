<?php 
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';
if (file_exists('views/home/StatsOverview.php')) {
    define('IN_APP', true); 
    include ('head.php');
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
    <link rel="stylesheet" href="\ims\bootstrap\css\bootstrap.min.css">
    <script src="\ims\bootstrap\js\bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="\ims\css\style.css">
</head>
<body> 
<?php head();?>

<input type="text" id="barcode_input" style="display: none;" />
<div class="field-inventory">
        <div class="stats-header">
            <h2>Dashboard</h2>
        </div>
        <div class="card-container">
                <?php StatsOverview(); ?>
        </div>
       
        <div>
            <?php include ('navbar.php'); ?>
        </div>
</div>
    <script src="script/script.js"></script>
    <script src="script/importCsv.js"></script>
    <script src="script/stats.js"></script>
</body>
</html>
