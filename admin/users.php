<?php 
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';
if (file_exists('views/users/userList.php')) {
    define('IN_APP', true); 
    include ('head.php');
    include ('views/users/userList.php'); 
    include('views/users/addUserModal.php');
    include('views/users/detailesUserModal.php');
} else {
    echo "Error: StatsOverview file not found!";
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Users</title>
    <link rel="stylesheet" href="\ims\bootstrap\css\bootstrap.min.css">
    <script src="\ims\bootstrap\js\bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="\ims\css\style.css">
</head>
<body>

<div id="users" class="header-inventory">
<?php head();?>
       <div class="field-inventory">
                <form id="searchForm">
                    <div class="invt-field-details">
                        <div class="invt-field-header">
                            <div class="invt-input-box">
                                <input type="text" class="search-bar" id="searchInputUser" placeholder="Search Users" onkeyup="searchUser()" required>
                                    <button type="button" class="btn" id="addUserBtn">
                                        <img src="imgs/add.png" alt="Add Items" class="invt-icon">
                                        Add User
                                    </button>
                            </div>
                        </div>
                    </div>
                </form>
            <div class="invt-list-container">
                <?php userList(); ?>
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
            detailesUserModal();
        ?>
    </div>

    <div>
        <?php 
           addUserModal();
        ?>
    </div>
      
    <!-- JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script/script.js"></script>

</body>
</html>
