<?php
if (!defined('IN_APP')) {
die("Access Denied");
}
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\uni_fetch.php';
function refList(){ 
$fetcher = new DataFetcher();
$roles = $fetcher->getAllRoles();
$units = $fetcher->getAllUnits();
$asset_types = $fetcher->getAllAssetTypes();
$brand = $fetcher->getAllBrands();
$logs = $fetcher->getAllLogs();
?>
<div class="card-container">
<div class="card table-card">
<div class="invt-table-data">
        <div class="invt-table-name">
            <span>Role Table</span>
        </div>
                <table class="invt-table-box" id="roleTable">      
                    <thead>
                        <tr>
                            <th hidden>Role ID</th>
                            <th>Role Name</th>
                            <th>Action</th>
                        </tr>
                    </thead> 
                    <tbody>
                    <?php
                        if ($roles && count($roles) > 0) {
                            foreach ($roles as $row) {
                                echo "<tr>";
                                echo "<td hidden>" . $row['role_ID'] . "</td>";
                                echo "<td>" . $row['role_name'] . "</td>";
                                echo "<td>
                                        <img 
                                            data-entity='role' 
                                            data-id='" . htmlspecialchars($row['role_ID']) . "' 
                                            data-name='" . htmlspecialchars($row['role_name']) . "' 
                                            class='btn-edit' 
                                            src='imgs/detail.png' 
                                            alt='Details' 
                                        />
                                        <img 
                                            class='btn-delete' 
                                            data-role='" . htmlspecialchars($row['role_ID']) . "' 
                                            src='imgs/delete.png' 
                                            alt='Delete' 
                                        />
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
</div>

<div class="card table-card">
    <div class="invt-table-data">
        <div class="invt-table-name">
            <span>Unit Table</span>
        </div>
            <table class="invt-table-box" id="unitTable">      
                            <thead>
                                <tr>
                                    <th hidden>Unit ID</th>
                                    <th>Unit Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead> 
                            <tbody>
                            <?php
                                if ($units && count($units) > 0) {
                                    foreach ($units as $row) {
                                        echo "<tr>";
                                        echo "<td hidden>" . $row['unit_ID'] . "</td>";
                                        echo "<td>" . $row['unit_name'] . "</td>";
                                        echo "<td>
                                                <img 
                                                    data-entity='unit' 
                                                    data-id='" . htmlspecialchars($row['unit_ID']) . "' 
                                                    data-name='" . htmlspecialchars($row['unit_name']) . "' 
                                                    class='btn-edit' 
                                                    src='imgs/detail.png' 
                                                    alt='Details' 
                                                />
                                                <img 
                                                    class='btn-delete' 
                                                    data-unit='" . htmlspecialchars($row['unit_ID']) . "' 
                                                    src='imgs/delete.png' 
                                                    alt='Delete' 
                                                />
                                            </td>";
                                        echo "</tr>";
                                    }
                                } else {
                                    echo "<tr><td colspan='6'>No units found.</td></tr>";
                                }
                                ?>
                            </tbody>
                        </table>
    </div>
</div>

<div class="card table-card">
    <div class="invt-table-data">
        <div class="invt-table-name">
            <span>Asset Type Table</span>
        </div>
                <table class="invt-table-box" id="assetTable">      
                    <thead>
                        <tr>
                            <th hidden>Asset type ID</th>
                            <th>Asset type Name</th>
                            <th>Action</th>
                        </tr>
                    </thead> 
                    <tbody>
                    <?php
                        if ($asset_types && count($asset_types) > 0) {
                            foreach ($asset_types as $row) {
                                echo "<tr>";
                                echo "<td hidden>" . $row['asset_type_ID'] . "</td>";
                                echo "<td>" . $row['asset_type'] . "</td>";
                                echo "<td>
                                        <img 
                                            data-entity='asset_type' 
                                            data-id='" . htmlspecialchars($row['asset_type_ID']) . "' 
                                            data-name='" . htmlspecialchars($row['asset_type']) . "' 
                                            class='btn-edit' 
                                            src='imgs/detail.png' 
                                            alt='Details' 
                                        />
                                        <img 
                                            class='btn-delete' 
                                            data-asset-type='" . htmlspecialchars($row['asset_type_ID']) . "' 
                                            src='imgs/delete.png' 
                                            alt='Delete' 
                                        />
                                    </td>";
                                echo "</tr>";
                            }
                        } else {
                            echo "<tr><td colspan='6'>No asset types found.</td></tr>";
                        }
                        ?>

                    </tbody>
                </table>
    </div>
</div>

<div class="card table-card">
    <div class="invt-table-data">
            <div class="invt-table-name">
                <span>Brand Table</span>
            </div>
        
                <table class="invt-table-box" id="BrandTable">      
                    <thead>
                        <tr>
                            <th hidden >Brand ID</th>
                            <th>Brand Name</th>
                            <th>Action</th>
                        </tr>
                    </thead> 
                    <tbody>
                    <?php
                        if ($brand && count($brand) > 0) {
                            foreach ($brand as $row) {
                                echo "<tr>";
                                echo "<td hidden>" . $row['brand_ID'] . "</td>";
                                echo "<td>" . $row['brand_name'] . "</td>";
                                echo "<td>
                                        <img 
                                            data-entity='brand' 
                                            data-id='" . htmlspecialchars($row['brand_ID']) . "' 
                                            data-name='" . htmlspecialchars($row['brand_name']) . "' 
                                            class='btn-edit' 
                                            src='imgs/detail.png' 
                                            alt='Details' 
                                        />
                                        <img 
                                            class='btn-delete' 
                                            data-brand='" . htmlspecialchars($row['brand_ID']) . "' 
                                            src='imgs/delete.png' 
                                            alt='Delete' 
                                        />
                                    </td>";
                                echo "</tr>";
                            }
                        } else {
                            echo "<tr><td colspan='6'>No brands found.</td></tr>";
                        }
                        ?>

                    </tbody>
                </table>
    </div>
</div>
</div>

<div class="invt-list-container">
    <div class="invt-table-data">
      
                <table class="invt-table-box" id="assetTable">      
                    <thead>
                        <tr>
                            <th>Log ID</th>
                            <th>User Logs</th>
                        </tr>
                    </thead> 
                    <tbody>
                    <?php
                        if ($logs && count($logs) > 0) {
                            foreach ($logs as $row) {
                                echo "<tr>";
                                echo "<td>" . $row['log_ID'] . "</td>";
                                echo "<td>" . $row['log_content'] . "</td>";
                                // echo "<td>
                                //         <img 
                                //             data-entity='asset_type' 
                                //             data-id='" . htmlspecialchars($row['asset_type_ID']) . "' 
                                //             data-name='" . htmlspecialchars($row['asset_type']) . "' 
                                //             class='btn-edit' 
                                //             src='imgs/detail.png' 
                                //             alt='Details' 
                                //         />
                                //         <img 
                                //             class='btn-delete' 
                                //             data-asset-type='" . htmlspecialchars($row['asset_type_ID']) . "' 
                                //             src='imgs/delete.png' 
                                //             alt='Delete' 
                                //         />
                                //     </td>";
                                echo "</tr>";
                            }
                        } else {
                            echo "<tr><td colspan='6'>No logs found.</td></tr>";
                        }
                        ?>

                    </tbody>
                </table>
    </div>
</div>
<?php } ?>
