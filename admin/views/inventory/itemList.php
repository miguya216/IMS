<?php 
if (!defined('IN_APP')) {
    die("Access Denied");
}
function itemList(){ ?>
                    <!-- <h2>Item List:</h2> -->
                    <div class="invt-table-data">
                        <table class="invt-table-box" id="inventoryTable">      
                            <thead>
                                <tr>
                                    <th>Assets</th>
                                    <th>Serial Number</th>
                                    <th>Responsible to</th>
                                    <th>Remarks</th>
                                    <th>Institutes/Units</th>
                                    <th>Action</th>
                                </tr>
                            </thead> 
                            <tbody>
                                    <?php
                                    include('class\fetch_inventory.php');
                                    if ($inventoryList->num_rows > 0) {
                                         while ($row = $inventoryList->fetch_assoc()) {
                                            echo "<tr>
                                                    <td>{$row['assets']}</td>
                                                    <td>{$row['serial_num']}</td>
                                                    <td>{$row['responsibleTo']}</td>
                                                    <td>{$row['remarks']}</td>
                                                    <td>{$row['institute']}</td>
                                                    <td>
                                                        <button id='edit-" . htmlspecialchars($row['serial_num']) . "' class='btn btn-edit'>Details</button>
                                                        <button class='btn btn-delete'>Delete</button>
                                                    </td>
                                                </tr>";
                                        
                                            }
                                        } else {
                                            echo "<tr><td colspan='6'>No records found</td></tr>";
                                        }

                                        $conn->close(); ?>
                            </tbody>
                        </table>
                    </div>

                            </tbody>
                        </table>
                    </div>
<?php } ?>
