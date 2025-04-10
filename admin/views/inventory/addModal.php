<?php
function addModal (){
?>
<div class="modal-container" id="modal_cont_add">
    <div class="modal">
        <h1>Item Details</h1>
            <div class="field-details">
                        <div class="input-box">
                            <label for="barcode">Barcode</label>
                            <input type="text" class="form-control" id="barcode" required>
                        </div>

                        <div class="input-box">
                            <label for="serialNum">Serial Number</label>
                            <input type="number" class="form-control" id="serialNum" required>
                        </div>
                        
                        <div class="input-box">
                            <label for="asset">Asset Name</label>
                            <input type="text" class="form-control" id="asset" required>
                        </div>

                        <div class="input-box">
                            <label for="brand">Brand</label>
                            <input type="text" class="form-control" id="brand" required>
                        </div>

                        <div class="input-box">
                            <label for="tag">Inventory Tag</label>
                            <input type="text" class="form-control" id="tag" required>
                        </div>

                        <div class="input-box">
                            <label for="responsibleTo">Responsible To</label>
                            <input type="text" class="form-control" id="responsibleTo" required>
                        </div>  

                        <div class="input-box">
                            <label for="remarks">Remarks</label>
                            <input type="text" class="form-control" id="remarks" required>
                        </div>

                        <div class="input-box">
                            <label for="note">Note</label>
                            <input type="text" class="form-control" id="note" required>
                        </div>
                        
                        <div class="input-box">
                            <label for="institute">Institute</label>
                            <input type="text" class="form-control" id="institute" required>
                        </div>

                        <div class="input-box">
                            <button type="submit" class="btn" id="saveDetails">Add Item</button>
                            <button type="submit" class="btn" id="close_add">Close</button>
                        </div> 
            </div>      
    </div>        
</div>
<?php } ?>