
<?php
function detailsPopUp() {
?>

<div class="modal-container" id="barcode_details">
    <div class="modal">
        <form>
            <h3>Edit Asset Details</h3>
            <div class="field-details">
                <div class="input-box">
                    <label>QR Code:</label>
                    <div class="qr-wrapper">
                        <img id="qrCodeImg_b" src="" alt="QR code">
                    </div>
                </div>

                <div class="input-box">
                    <label>Barcode:</label>
                    <div class="barcode-wrapper">
                        <img id="barcodeImg_b" src="" alt="Barcode">
                    </div>
                </div>

                <div class="input-box">
                    <label>Inventory Tag:</label>
                    <input type="text" id="detail_tag_b" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <label>Serial Number:</label>
                    <input type="text" id="detail_serial_b" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <label>Asset Type:</label>
                    <input type="text" id="detail_asset_b" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <label>Brand:</label>
                    <input type="text" id="detail_brand_b" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <label>Responsible To:</label>
                    <input type="text" id="detail_responsible_b" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <label>Unit/Institute:</label>
                    <input type="text" id="detail_unit_b" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <li type="button" class="btn" id="close_bc_details">Close</li>
                </div>
            </div>
        </form>
    </div>
</div>
<?php } ?>
<input type="text" id="barcode_input" style="display: none;" />

<?php detailsPopUp();?>

<script src="script/barcodeScanner.js"></script>