<?php
function addModal () {
    require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\asset\InsertAuth.php';
    $fetcher = new DataFetcher();
    $assetTypes = $fetcher->getAllAssetTypes();
    $brands = $fetcher->getAllBrands();
    $units = $fetcher->getAllUnits();
    $users = $fetcher->getAllUsers(); // for Responsible To
?>
<div class="modal-container" id="modal_cont_add">
    <div class="modal">
        <form id="addAssetForm" method="POST">
            <h1>Insert Asset</h1>
            <div class="notif-container">
                <div id="add_responseMessage"></div>
            </div>
            <div class="field-details">

                <div class="input-box">
                    <label for="tag">Inventory Tag</label>
                    <input name="inventory_tag" type="text" class="form-control" id="tag" required>
                </div>            

                <div class="input-box">
                    <label for="serialNum">Serial Number</label>
                    <input name="serial_num" type="text" class="form-control" id="serialNum" required>
                </div>

                <!-- ASSET TYPE -->
                <div class="input-box dual-input">
                    <label for="asset">Asset Type</label>
                    <div class="flex-wrap-row">
                        <select name="asset" class="form-control" id="asset" required>
                            <option value="" selected disabled>Select Asset Type (Add new if none)</option>
                            <?php foreach ($assetTypes as $type): ?>
                                <option value="<?= htmlspecialchars($type['asset_type']) ?>"><?= htmlspecialchars($type['asset_type']) ?></option>
                            <?php endforeach; ?>
                            <option value="__new_asset_type__">➕ Add new...</option>
                        </select>
                        <input type="text" name="new_asset" id="new_asset" class="form-control" placeholder="Enter new asset type" style="display:none;">
                    </div>
                </div>

                <!-- BRAND -->
                <div class="input-box dual-input">
                    <label for="brand">Brand</label>
                    <div class="flex-wrap-row">
                        <select name="brand" class="form-control" id="brand" required>
                            <option value="" selected disabled>Select Brand (Add new if none)</option>
                            <?php foreach ($brands as $brand): ?>
                                <option value="<?= htmlspecialchars($brand['brand_name']) ?>"><?= htmlspecialchars($brand['brand_name']) ?></option>
                            <?php endforeach; ?>
                            <option value="__new_brand__">➕ Add new...</option>
                        </select>
                        <input type="text" name="new_brand" id="new_brand" class="form-control" placeholder="Enter new brand" style="display:none;">
                    </div>
                </div>

                <!-- RESPONSIBLE TO -->
                <div class="input-box dual-input">
                    <label for="responsibleTo">Responsible To</label>
                    <div class="flex-wrap-row">
                        <select name="responsibleTo" class="form-control" id="responsibleTo" required>
                            <option value="" selected disabled>Select User (Add new if none)</option>
                            <?php foreach ($users as $user): ?>
                                <option value="<?= htmlspecialchars($user['full_name']) ?>"><?= htmlspecialchars($user['full_name']) ?></option>
                            <?php endforeach; ?>
                            <option value="__new_responsibleTo__">➕ Add new...</option>
                        </select>
                        <input type="text" name="new_responsibleTo" id="new_responsibleTo" class="form-control" placeholder="Enter new name" style="display:none;">
                    </div>
                </div>

                <!-- UNIT -->
                <div class="input-box dual-input">
                    <label for="unit">Unit/Institute</label>
                    <div class="flex-wrap-row">
                        <select name="unit" class="form-control" id="unit" required>
                            <option value="" selected disabled>Select Unit (Add new if none)</option>
                            <?php foreach ($units as $unit): ?>
                                <option value="<?= htmlspecialchars($unit['unit_name']) ?>"><?= htmlspecialchars($unit['unit_name']) ?></option>
                            <?php endforeach; ?>
                            <option value="__new_unit__">➕ Add new...</option>
                        </select>
                        <input type="text" name="new_unit" id="new_unit" class="form-control" placeholder="Enter new unit" style="display:none;">
                    </div>
                </div>

                <div class="input-box">
                    <button type="submit" class="btn" id="saveDetails">Add Item</button>
                    <li class="btn" id="close_add">Close</li>
                </div> 

            </div>      
        </form>
    </div>        
</div>
<?php } ?>
