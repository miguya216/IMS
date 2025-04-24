<?php
function details() {
    require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\asset\updateAuth.php';
    $fetcher = new DataFetcher();
    $assetTypes = $fetcher->getAllAssetTypes();
    $brands = $fetcher->getAllBrands();
    $units = $fetcher->getAllUnits();
    $users = $fetcher->getAllUsers();
?>
<div class="modal-container" id="modal_cont_details">
    <div class="modal">
        <form method="POST" id="updateForm">
            
                <h1>Asset Details</h1>
                <div class="notif-container">
                    <div id="update_responseMessage"></div>
                </div>

                <div class="field-details">
                <div class="input-box">
                    <label>Barcode</label>
                    <div class="barcode-wrapper">
                        <img id="barcodeImg" src="" alt="Barcode">
                    </div>
                </div>

                <div class="input-box">
                    <label>Inventory Tag</label>
                    <input type="text" class="form-control" id="detail_tag" name="inventory_tag" readonly>
                </div>

                <div class="input-box">
                    <label>Serial Number</label>
                    <input type="text" class="form-control" id="detail_serial" name="serial" readonly>
                </div>
               
                <div class="input-box">
                <label>Asset Type</label>
                    <select name="asset" class="form-control" id="detail_asset" required>
                        <?php foreach ($assetTypes as $type): ?>
                            <option value="<?= htmlspecialchars($type['asset_type']) ?>">
                                <?= htmlspecialchars($type['asset_type']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <!-- <div class="input-box">
                    <label>Brand</label>
                    <input type="text" class="form-control" id="detail_brand" name="brand">
                </div> -->

                <div class="input-box">
                <label>Brand</label>
                    <select name="brand" class="form-control" id="detail_brand" required>
                        <?php foreach ($brands as $brand): ?>
                            <option value="<?= htmlspecialchars($brand['brand_name']) ?>">
                                <?= htmlspecialchars($brand['brand_name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="input-box">
                <label>Responsible To</label>
                    <select name="responsibleTo" class="form-control" id="detail_responsible" required>
                        <?php foreach ($users as $user): ?>
                            <option value="<?= htmlspecialchars($user['full_name']) ?>">
                                <?= htmlspecialchars($user['full_name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="input-box">
                <label>Unit/Institute</label>
                    <select name="unit" class="form-control" id="detail_unit" required>
                        <?php foreach ($units as $unit): ?>
                            <option value="<?= htmlspecialchars($unit['unit_name']) ?>">
                                <?= htmlspecialchars($unit['unit_name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="input-box">
                    <button type="submit" class="btn" id="updateDetails">Update Details</button>
                    <li class="btn" id="close_details">Close</li>
                </div>

            </div>
        </form>
    </div>
</div>
<?php } ?>
