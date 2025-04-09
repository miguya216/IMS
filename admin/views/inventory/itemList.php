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
                                    <th>Assets ID</th>
                                    <th>Inventory Tag</th>
                                    <th>Serial Number</th>
                                    <th>Asset Type</th>
                                    <th>Brand Name</th>
                                    <th>Responsible to</th>
                                    <th>Unit</th>
                                    <th>Action</th>
                                </tr>
                            </thead> 
                            <tbody>
                                    <?php
                                    include('class\fetch_inventory.php');
                                    if ($result && $result->num_rows > 0) {
                                        while ($row = $result->fetch_assoc()) {
                                            echo "<tr>";
                                            echo "<td>" . $row['asset_ID'] . "</td>";
                                            echo "<td>" . $row['inventory_tag'] . "</td>";
                                            echo "<td>" . $row['serial_number'] . "</td>";
                                            echo "<td>" . $row['asset_type'] . "</td>";
                                            echo "<td>" . $row['brand_name'] . "</td>";
                                            echo "<td>" . $row['responsible_user'] . "</td>";
                                            echo "<td>" . $row['user_unit'] . "</td>";
                                            echo "<td>
                                                        <button id='edit-" . htmlspecialchars($row['serial_number']) . "' class='btn btn-edit'>Details</button>
                                                        <button class='btn btn-delete'>Delete</button>
                                                    </td>";
                                            echo "</tr>";
                                        }
                                    } else {
                                        echo "<tr><td colspan='7'>No asset data found.</td></tr>";
                                    }
                                    
                                    $conn->close();
                                     ?>
                            </tbody>
                        </table>
                    </div>

                            </tbody>
                        </table>
                    </div>
<?php } ?>
