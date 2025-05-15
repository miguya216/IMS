<?php 
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';
if (file_exists('views\request\requestList.php')) {
    define('IN_APP', true); 
    include ('head.php');
    include ('views\request\requestList.php'); 
    include ('views\request\requestDetails.php');
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
    <link rel="stylesheet" href="\ims\bootstrap\css\bootstrap.min.css">
    <script src="\ims\bootstrap\js\bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="\ims\css\style.css">
</head>
<body>

    <?php head(); ?>
    
    <div class="field-inventory">
    <div class="stats-header">
        <h2>Request Log</h2>
    </div>
        <form id = "searchForm">
            <div class="invt-field-details">
                <div class="invt-input-box">
                    <img type="button" onclick="openRequestForm()" src="imgs/add.png" alt="Add Request" class="button-add">
                    <input type="text" class="search-bar" id="searchInputRequest" placeholder = "Search Request" onkeyup="searchRequest()">
                    <select id="mainFilter" class="dropdown-filter">
                        <option value="">Filter by...</option>
                        <option value="1">KLD ID</option>
                        <option value="2">Borrower's Name</option>
                        <option value="3">Responsible To</option>
                        <option value="4">Unit</option>
                        <option value="5">Date</option>
                        <option value="6">Status</option>
                    </select>

                    <select id="subFilter" class="dropdown-filter" disabled>
                    <option value="">Select a value</option>
                    </select>
                </div>
            </div>
        </form>
        
        <div class="invt-list-container">
            <?php requestList(); ?>
        </div>
    </div>
    <?php detailsRequest(); ?>
    <?php include ('navbar.php'); ?>

    <!-- JavaScript -->
    <script src="script/script.js"></script>
</body>
</html>
