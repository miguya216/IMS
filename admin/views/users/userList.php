<?php 
if (!defined('IN_APP')) {
    die("Access Denied");
}
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\fetch_data.php';
function userList(){ 
    global $pdo;
    $inventory = new Users($pdo);
    $users = $inventory->fetchAllUsers();
    ?>
                 <!-- <div class="invt-table-name">
                    <span>Users Table</span>
                </div> -->
                    <div class="invt-table-data">
                        <table class="invt-table-box" id="userTable">      
                            <thead>
                                <tr>
                                    <th>user ID</th>
                                    <th>Name</th>
                                    <th>Unit</th>
                                    <th>User name</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead> 
                            <tbody>
                                    <?php
                                        if($users && count($users) > 0) {
                                            foreach ($users as $row) {
                                                echo "<tr>";
                                                echo "<td data-label='User ID'>" . htmlspecialchars($row['user_ID']) . "</td>";
                                                echo "<td data-label='Full Name'>" . htmlspecialchars($row['full_name']) . "</td>";
                                                echo "<td data-label='Unit'>" . htmlspecialchars($row['unit_name']) . "</td>";
                                                echo "<td data-label='Username'>" . htmlspecialchars($row['username']) . "</td>";
                                                echo "<td data-label='Role'>" . htmlspecialchars($row['role_name']) . "</td>";
                                                echo "<td data-label='Action'>
                                                        <div class='action-buttons'>
                                                        <img id='edit-" . htmlspecialchars($row['user_ID']) . "' class='btn-edit' src='imgs/detail.png' alt='Details' />
                                                        <img class='btn-delete' data-serial='" . htmlspecialchars($row['user_ID']) . "' src='imgs/delete.png' alt='Delete' />
                                                        </div>
                                                      </td>";
                                                echo "</tr>";
                                            }
                                            
                                        } else {
                                            echo "<tr><td colspan='6'>No users found.</td></tr>";
                                        }
                                     ?>
                            </tbody>
                        </table>
                    </div>
<?php } ?>
