<?php
function detailsRefModal (){
?>
<div class="modal-container hidden" id="editModal">
    <div class="modal">
        <form id="editForm" method="POST">
            <h3 id="modalTitle"></h3>
            <div class="field-details">
      
                <div class="field-details">
                    <input type="hidden" name="entity_type" id="entity_type" />
                    <div class="input-box">
                        <label> ID:</label>
                        <input name="entity_ID" type="text" class="form-control" id="entity_ID" readonly>
                    </div>

                    <div class="input-box">
                        <label> Name:</label>
                        <input name="entity_name" type="text" class="form-control" id="entity_name" required>
                    </div>
                
                    <div class="input-box">
                        <button type="submit" class="btn" id="UpdateRole">Update</button>
                        <li class="btn" id="close_ref">Close</li>
                    </div> 
                </div>  
            </div>
        </form>    
    </div>        
</div>

<?php } ?>