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
            <input type="hidden" value="<?= htmlspecialchars($_SESSION['full_name']) ?>" name="name">
        <h3>Edit Asset Details</h3>
             
                <div class="field-details">

                <div class="input-box">
                    <label>QR Code:</label>
                    <div class="qr-wrapper">
                        <img id="qrCodeImg" src="" alt="QR code">
                    </div>
                </div>
                
                <div class="input-box">
                    <label>Barcode:</label>
                    <div class="barcode-wrapper">
                        <img id="barcodeImg" src="" alt="Barcode">
                    </div>
                </div>

                <div class="input-box">
                    <label>Inventory Tag:</label>
                    <input type="text" class="form-control" id="detail_tag" name="inventory_tag" readonly>
                </div>

                <div class="input-box">
                    <label>Serial Number:</label>
                    <input type="text" class="form-control" id="detail_serial" name="serial" readonly>
                </div>
               
                <div class="input-box">
                <label>Asset Type:</label>
                    <select name="asset" class="form-control" id="detail_asset" required>
                        <?php foreach ($assetTypes as $type): ?>
                            <option value="<?= htmlspecialchars($type['asset_type_ID']) ?>">
                                <?= htmlspecialchars($type['asset_type']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="input-box">
                <label>Brand:</label>
                    <select name="brand" class="form-control" id="detail_brand" required>
                        <?php foreach ($brands as $brand): ?>
                            <option value="<?= htmlspecialchars($brand['brand_ID']) ?>">
                                <?= htmlspecialchars($brand['brand_name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="input-box">
                <label>Responsible To:</label>
                    <select name="responsibleTo" class="form-control" id="detail_responsible" required>
                    <?php foreach ($users as $user): ?>
                            <option value="<?= htmlspecialchars($user['user_ID']) ?>"><?= 
                                htmlspecialchars($user['f_name']) . ' ' .
                                htmlspecialchars($user['m_name']). ' ' .
                                htmlspecialchars($user['l_name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="input-box">
                <label>Unit/Institute:</label>
                    <select name="unit" class="form-control" id="detail_unit" required>
                        <?php foreach ($units as $unit): ?>
                            <option value="<?= htmlspecialchars($unit['unit_ID']) ?>">
                                <?= htmlspecialchars($unit['unit_name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="input-box">
                    <button type="submit" class="btn" id="updateDetails">Update</button>
                    <li class="btn" id="close_details">Close</li>
                </div>

            </div>
        </form>
    </div>
</div>
<?php } ?>
