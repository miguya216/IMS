<?php 
if (!defined('IN_APP')) {
    die("Access Denied");
}
function userList(){ ?>
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
                                     include('class\fetch_users.php');
                                        if ($result && $result->num_rows > 0) {
                                            while ($row = $result->fetch_assoc()) {
                                                echo "<tr>";
                                                echo "<td>" . $row['user_ID'] . "</td>";
                                                echo "<td>" . $row['full_name'] . "</td>";
                                                echo "<td>" . $row['unit_name'] . "</td>";
                                                echo "<td>" . $row['username'] . "</td>";
                                                echo "<td>" . $row['role_name'] . "</td>";
                                                echo "<td>
                                                        <button id='edit-" . htmlspecialchars($row['user_ID']) . "' class='btn btn-edit'>Details</button>
                                                        <button class='btn btn-delete'>Delete</button>
                                                    </td>";
                                                echo "</tr>";
                                            }
                                        } else {
                                            echo "<tr><td colspan='6'>No users found.</td></tr>";
                                        }

                                        $conn->close();
                                     ?>
                            </tbody>
                        </table>
                    </div>
<?php } ?>
