<?php 
if (!defined('IN_APP')) {
    die("Access Denied");
}
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\asset\fetch_data.php';
function itemList(){ 
    global $pdo; 
    $inventory = new Inventory($pdo);
    $assets = $inventory->fetchAllAssets();
?>
                <div class="invt-table-name">
                    <span>Asset Table</span>
                </div>
                    <div class="invt-table-data">
                        <table class="invt-table-box" id="inventoryTable">      
                            <thead>
                                <tr>
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
                                    if ($assets && count($assets) > 0) {
                                        foreach ($assets as $row) {
                                            echo "<tr>";
                                            echo "<td>" . htmlspecialchars($row['serial_number']) . "</td>";
                                            echo "<td>" . htmlspecialchars($row['asset_type']) . "</td>";
                                            echo "<td>" . htmlspecialchars($row['brand_name']) . "</td>";
                                            echo "<td>" . htmlspecialchars($row['responsible_user']) . "</td>";
                                            echo "<td>" . htmlspecialchars($row['user_unit']) . "</td>";
                                            echo "<td>
                                                    <button id='edit-" . htmlspecialchars($row['serial_number']) . "' class='btn btn-edit'>Details</button>
                                                    <button 
                                                        class='btn btn-delete' 
                                                        data-serial='" . htmlspecialchars($row['serial_number']) . "'>
                                                        Delete
                                                    </button>
                                                  </td>";
                                            echo "</tr>";
                                        }
                                    } else {
                                        echo "<tr><td colspan='6'>No asset data found.</td></tr>";
                                    }
                                     ?>
                            </tbody>
                        </table>
                    </div>

                            </tbody>
                        </table>
                    </div>
<?php } ?>
