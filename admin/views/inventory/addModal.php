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
        <input type="hidden" value="none" name="asset" id="asset_hidden">
        <input type="hidden" value="none" name="unit" id="unit_hidden">
        <input type="hidden" value="<?= htmlspecialchars($_SESSION['full_name']) ?>" name="name">
        
            <h3>Register New Asset</h3>
     

            <div class="field-details">
                
                <div class="input-box">
                    <label for="tag">Inventory Tag:</label>
                    <input name="inventory_tag" type="text" class="form-control" id="tag" required>
                </div>            

                <div class="input-box">
                    <label for="serialNum">Serial Number:</label>
                    <input name="serial_num" type="text" class="form-control" id="serialNum" required>
                </div>

                   <!-- BRAND -->
                   <div class="input-box">
                    <label for="brand">Brand:</label>
                        <select name="brand" class="form-control" id="brand" required>
                            <option value="" selected disabled>Select Brand (Add new if none)</option>
                            <?php foreach ($brands as $brand): ?>
                                <option value="<?= htmlspecialchars($brand['brand_ID']) ?>"><?= htmlspecialchars($brand['brand_name']) ?></option>
                            <?php endforeach; ?>
                            <option value="__new_brand__">✙ Add new...</option>
                        </select>
                    </div>
                    <div class="input-box">
                        <label for="brand"></label>
                        <input type="text" name="new_brand" id="new_brand" class="form-control" placeholder="Enter new brand" style="display:none;">
                    </div>

                <!-- ASSET TYPE -->
                <div class="input-box">
                    <label for="asset">Asset Type:</label>
                        <select name="asset" class="form-control" id="asset" required>
                            <option value="" selected disabled>Select Asset Type (Add new if none)</option>
                            <?php foreach ($assetTypes as $type): ?>
                                <option value="<?= htmlspecialchars($type['asset_type_ID']) ?>"><?= htmlspecialchars($type['asset_type']) ?></option>
                            <?php endforeach; ?>
                            <option value="__new_asset_type__">✙ Add new...</option>
                        </select>
                </div>
                <div class="input-box">
                    <label for="asset"></label>
                    <input type="text" name="new_asset" id="new_asset" class="form-control" placeholder="Enter new asset type" style="display:none;">
                </div>

              <!-- RESPONSIBLE TO -->
                <div class="input-box">
                    <label for="responsibleTo">Responsible To:</label>
                    <select name="responsibleTo" class="form-control" id="responsibleTo" required>
                        <option value="" selected disabled>Select User (Add new if none)</option>
                        <?php foreach ($users as $user): ?>
                            <option value="<?= htmlspecialchars($user['user_ID']) ?>"><?= 
                                htmlspecialchars($user['f_name']) . ' ' .
                                htmlspecialchars($user['m_name']). ' ' .
                                htmlspecialchars($user['l_name']) ?></option>
                        <?php endforeach; ?>
                        <option value="__new_responsibleTo__">✙ Add new...</option>
                    </select>
                </div>

                <!-- New Name Fields -->
                <div class="input-box">
                    <label for="new_responsibleTo"></label>
                    <input type="text" name="new_responsibleTo_f" class="form-control" id="new_responsibleTo_f" style="display: none;" placeholder="Enter First name">
                </div>
                <div class="input-box">
                    <label for="new_responsibleTo"></label>
                    <input type="text" name="new_responsibleTo_m" class="form-control" id="new_responsibleTo_m" style="display: none;" placeholder="Enter Middle name">
                </div>
                <div class="input-box">
                    <label for="new_responsibleTo"></label>
                    <input type="text" name="new_responsibleTo_l" class="form-control" id="new_responsibleTo_l" style="display: none;" placeholder="Enter Last name">
                </div>

                <!-- UNIT -->
                <div class="input-box">
                    <label for="unit">Unit/Institute:</label>
                        <select name="unit" class="form-control" id="unit" required>
                            <option value="" selected disabled>Select Unit (Add new if none)</option>
                            <?php foreach ($units as $unit): ?>
                                <option value="<?= htmlspecialchars($unit['unit_ID']) ?>"><?= htmlspecialchars($unit['unit_name']) ?></option>
                            <?php endforeach; ?>
                            <option value="__new_unit__">✙ Add new...</option>
                        </select>
                </div>
                <div class="input-box">
                    <label for="unit"></label>
                    <input type="text" name="new_unit" id="new_unit" class="form-control" placeholder="Enter new unit" style="display:none;">
                </div>

                <div class="input-box">
                    <button type="submit" class="btn" id="saveDetails">Register</button>
                    <li type="" submit class="btn" id="close_add">Close</li>
                </div> 

            </div>      
        </form>
    </div>        
</div>
<?php } ?>
