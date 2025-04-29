<?php 
if (!defined('IN_APP')) {
    die("Access Denied");
}
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\fetch_data.php';
function itemList(){ 
    global $pdo; 
    $inventory = new Inventory($pdo);
    $assets = $inventory->fetchAllAssets();
?>
                <!-- <div class="invt-table-name">
                    <span>Asset Table</span>
                </div> -->
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
                                            echo "<td data-label='Serial Number'>" . htmlspecialchars($row['serial_number']) . "</td>";
                                            echo "<td class = '". htmlspecialchars($row['asset_type_status']) ."'  data-label='Asset Type'>" . htmlspecialchars($row['asset_type']) . "</td>";
                                            echo "<td class = '". htmlspecialchars($row['brand_status']) ."'  data-label='Brand Name'>" . htmlspecialchars($row['brand_name']) . "</td>";
                                            echo "<td class = '". htmlspecialchars($row['user_status']) ."'  data-label='Responsible to'>" . htmlspecialchars($row['responsible_user']) . "</td>";
                                            echo "<td class = '". htmlspecialchars($row['unit_status']) ."'  data-label='Unit'>" . htmlspecialchars($row['user_unit']) . "</td>";
                                            echo "<td data-label='Action'>
                                                    <div class='action-buttons'>
                                                            <img id='edit-" . htmlspecialchars($row['serial_number']) . "' class='btn-edit' src='imgs/detail.png' alt='Details' />
                                                            <img class='btn-delete' data-serial='" . htmlspecialchars($row['serial_number']) . "' src='imgs/delete.png' alt='Delete' />
                                                    </div>
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
<?php } ?>
