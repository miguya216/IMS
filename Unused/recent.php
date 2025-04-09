<?php 
if (!defined('IN_APP')) {
    die("Access Denied");
}
function recentList(){ ?>
                    <h2>Recently Added</h2>
                    <div class="table-data">
                        <table class="table-box" id="recentTable">      
                            <thead>
                                <tr>
                                    <th>Assets</th>
                                    <th>Serial Number</th>
                                    <th>Responsible to</th>
                                </tr>
                            </thead> 
                            <tbody>
                                <?php
                                    include ('class\fetch_inventory.php');
                                    if($recentList->num_rows > 0){
                                        while($row = $recentList->fetch_assoc()){
                                            echo"<tr>
                                                        <td>{$row['assets_ID']}</td>
                                                        <td>{$row['serial_number']}</td>
                                                        <td>{$row['responsible_user_ID']}</td>   
                                                    </tr>";}
                                        } else {
                                            "<tr><td colspan='6'>No records found</td></tr>";
                                        }
                                    $conn->close();
                                ?>
                            </tbody>
                        </table>
                    </div>
         
<?php } ?>
