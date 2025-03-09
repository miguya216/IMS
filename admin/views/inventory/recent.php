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
                                    <th>Remarks</th>
                                    <th>Institutes/Units</th>
                                </tr>
                            </thead> 
                            <tbody>
                                <?php
                                    include ('class\fetch_inventory.php');
                                    if($recentList->num_rows > 0){
                                        while($row = $recentList->fetch_assoc()){
                                            echo"<tr>
                                                        <td>{$row['assets']}</td>
                                                        <td>{$row['serial_num']}</td>
                                                        <td>{$row['responsibleTo']}</td>
                                                        <td>{$row['remarks']}</td>
                                                        <td>{$row['institute']}</td>    
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
