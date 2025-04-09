<?php 
if (!defined('IN_APP')) {
    die("Access Denied");
}
function newitem(){ ?>
        <div class="field-content">
            <form id="addItem">
                <h2>Add Inventory</h2>
                <div class="field-details">
                    <div class="input-box">
                        <input type="text" class="field-control" id="assets" placeholder="Assets" required>
                    </div>

                    <div class="input-box">
                        <input type="text" class="field-control" id="inventorytag" placeholder="Inventory Tag" required>
                    </div>

                    <div class="input-box">
                        <input type="text" class="field-control" id="serialnum" placeholder="Serial Number" required>
                    </div>

                    <div class="input-box">
                        <input type="text" class="field-control" id="responsible" placeholder="Responsible To" required>
                    </div>

                    <div class="input-box">
                        <input type="text" class="field-control" id="institute" placeholder="Institute" required>
                    </div>

                    <div>
                        <button type="submit" class="btn">Add Item</button>
                    </div>
                    
                    <div> 
                        <button type="button" class="btn">Import .CSV</button>
                    </div>
                </div>
                
            </form>
        </div>

<?php }?>
