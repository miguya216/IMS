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
                    <input type="text" id="detail_tag" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <label>Serial Number:</label>
                    <input type="text" id="detail_serial" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <label>Asset Type:</label>
                    <input type="text" id="detail_asset" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <label>Brand:</label>
                    <input type="text" id="detail_brand" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <label>Responsible To:</label>
                    <input type="text" id="detail_responsible" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <label>Unit/Institute:</label>
                    <input type="text" id="detail_unit" class="form-control" readonly>
                </div>

                <div class="input-box">
                    <button type="button" class="btn" id="close_bc_details">Close</button>
                </div>
            </div>
        </form>
    </div>
</div>
<?php } ?>
