<?php
function userModal (){
?>
<div class="modal-container" id="modal_cont_add_user">
    <div class="modal">
        <h1>Item Details</h1>
                <div class="field-details">
                    <label for="barcode">Barcode</label>
                    <input type="text" class="form-control" id="barcode" required>
                </div>

                <div class="field-details">
                    <label for="serialNum">Serial Number</label>
                    <input type="number" class="form-control" id="serialNum" required>
                </div>
                
                <div class="field-details">
                    <label for="asset">Asset Name</label>
                    <input type="text" class="form-control" id="asset" required>
                </div>

                <div class="field-details">
                    <label for="brand">Brand</label>
                    <input type="text" class="form-control" id="brand" required>
                </div>

                <div class="field-details">
                    <label for="tag">Inventory Tag</label>
                    <input type="text" class="form-control" id="tag" required>
                </div>

                <div class="field-details">
                    <label for="responsibleTo">Responsible To</label>
                    <input type="text" class="form-control" id="responsibleTo" required>
                </div>  

                <div class="field-details">
                    <label for="remarks">Remarks</label>
                    <input type="text" class="form-control" id="remarks" required>
                </div>

                <div class="field-details">
                    <label for="note">Note</label>
                    <input type="text" class="form-control" id="note" required>
                </div>
                
                <div class="field-details">
                    <label for="institute">Institute</label>
                    <input type="text" class="form-control" id="institute" required>
                </div>

                <div>
                    <button type="submit" class="btn" id="saveUser">Add User</button>
                    <button type="submit" class="btn" id="close_add_user">Close</button>
                </div>       
    </div>        
</div>
<?php } ?>