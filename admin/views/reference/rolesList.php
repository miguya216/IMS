<?php
if (!defined('IN_APP')) {
    die("Access Denied");
}
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\uni_fetch.php';
function roleList(){ 
    $fetcher = new DataFetcher();
    $roles = $fetcher->getAllRoles();
    $units = $fetcher->getAllUnits();
    $asset_types = $fetcher->getAllAssetTypes();
    $brand = $fetcher->getAllBrands();
    ?>

<div class="reference-container">
<div class="invt-table-data">
                    <div class="invt-table-name">
                    <span>Role Table</span>
                    </div>
                    <div class="invt-input-box">
                        <input type="text" class="search-bar" id="searchInputRole" placeholder="Search Role" onkeyup="searchRole()">  
                        <button type="button" class="btn" id="addRoleBtn">
                        <img src="imgs/add.png" alt="Add Items" class="invt-icon"></button>    
                    </div>
               
                        <table class="invt-table-box" id="roleTable">      
                            <thead>
                                <tr>
                                    <th>Role ID</th>
                                    <th>Role Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead> 
                            <tbody>
                                    <?php
                                        if($roles && count($roles) > 0) {
                                            foreach ($roles as $row) {
                                                echo "<tr>";
                                                echo "<td>" . $row['role_ID'] . "</td>";
                                                echo "<td>" . $row['role_name'] . "</td>";
                                                echo "<td>
                                                        <button id='edit-" . htmlspecialchars($row['role_ID']) . "' class='btn btn-edit'>Details</button>
                                                        <button class='btn btn-delete'
                                                        data-user='" . htmlspecialchars($row['role_ID']) . "'>Delete</button>
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

                   
                    <div class="invt-table-data">
                    <div class="invt-table-name">
                    <span>Unit Table</span>
                    </div>
                    <div class="invt-input-box">
                        <input type="text" class="search-bar" id="searchInputUnit" placeholder="Search Unit" onkeyup="searchUnit()">  
                        <button type="button" class="btn" id="addRUnitBtn">
                        <img src="imgs/add.png" alt="Add Items" class="invt-icon"></button>    
                    </div>
                        <table class="invt-table-box" id="unitTable">      
                            <thead>
                                <tr>
                                    <th>Unit ID</th>
                                    <th>Unit Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead> 
                            <tbody>
                                    <?php
                                        if($units && count($units) > 0) {
                                            foreach ($units as $row) {
                                                echo "<tr>";
                                                echo "<td>" . $row['unit_ID'] . "</td>";
                                                echo "<td>" . $row['unit_name'] . "</td>";
                                                echo "<td>
                                                        <button id='edit-" . htmlspecialchars($row['unit_ID']) . "' class='btn btn-edit'>Details</button>
                                                        <button class='btn btn-delete'
                                                        data-user='" . htmlspecialchars($row['unit_ID']) . "'>Delete</button>
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
            <div class="reference-container">
                        
                    <div class="invt-table-data">
                    <div class="invt-table-name">
                    <span>Asset Type Table</span>
                </div>
                <div class="invt-input-box">
                        <input type="text" class="search-bar" id="searchInputAsset" placeholder="Search Asset" onkeyup="searchAsset()">  
                        <button type="button" class="btn" id="addRAssetBtn">
                        <img src="imgs/add.png" alt="Add Items" class="invt-icon"></button>    
                    </div>
                        <table class="invt-table-box" id="assetTable">      
                            <thead>
                                <tr>
                                    <th>Asset type ID</th>
                                    <th>Asset type Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead> 
                            <tbody>
                                    <?php
                                        if($asset_types && count($asset_types) > 0) {
                                            foreach ($asset_types as $row) {
                                                echo "<tr>";
                                                echo "<td>" . $row['asset_type_ID'] . "</td>";
                                                echo "<td>" . $row['asset_type'] . "</td>";
                                                echo "<td>
                                                        <button id='edit-" . htmlspecialchars($row['asset_type_ID']) . "' class='btn btn-edit'>Details</button>
                                                        <button class='btn btn-delete'
                                                        data-user='" . htmlspecialchars($row['asset_type_ID']) . "'>Delete</button>
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

                   
                    <div class="invt-table-data">
                    <div class="invt-table-name">
                    <span>Brand Table</span>
                </div>
                <div class="invt-input-box">
                        <input type="text" class="search-bar" id="searchInputBrand" placeholder="Search Brand" onkeyup="searchBrand()">  
                        <button type="button" class="btn" id="addRBrandBtn">
                        <img src="imgs/add.png" alt="Add Items" class="invt-icon"></button>    
                    </div>
                        <table class="invt-table-box" id="BrandTable">      
                            <thead>
                                <tr>
                                    <th>Brand ID</th>
                                    <th>Brand Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead> 
                            <tbody>
                                    <?php
                                        if($brand && count($brand) > 0) {
                                            foreach ($brand as $row) {
                                                echo "<tr>";
                                                echo "<td>" . $row['brand_ID'] . "</td>";
                                                echo "<td>" . $row['brand_name'] . "</td>";
                                                echo "<td>
                                                        <button id='edit-" . htmlspecialchars($row['brand_ID']) . "' class='btn btn-edit'>Details</button>
                                                        <button class='btn btn-delete'
                                                        data-user='" . htmlspecialchars($row['brand_ID']) . "'>Delete</button>
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
<?php } ?>
