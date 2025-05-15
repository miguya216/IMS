<?php
function detailsRequest (){?>
<div class="modal-container" id="modal_cont_detail_request">
    <div class="modal">
        <form id="RequestDetailsForm">
        <h3>Request Details</h3>
            <div class="field-details">
             
                <input name="detail_request_ID" type="hidden" class="form-control" id="detail_request_ID">

                <div class="reponse-box">
                    <div id="repsonse-label"></div>
                    <div id="action-button-approve"></div>
                    <div id="action-buttons-decline"></div>
                </div>
                
                <div class="input-box">
                    <label for="detail_response">Status:</label>
                    <input name="detail_response" type="text" class="form-control" id="detail_response" required>
                </div>

                <div class="input-box">
                    <label for="detail_kld_ID">KLD ID:</label>
                    <input name="detail_kld_ID" type="text" class="form-control" id="detail_kld_ID" readonly>
                </div>

                <div class="input-box">
                    <label for="detail_kld_email">KLD Email:</label>
                    <input name="detail_kld_email" type="text" class="form-control" id="detail_kld_email" readonly>
                </div>
                
                <div class="input-box">
                    <label for="detail_borrower">Borrower's Name:</label>
                    <input name="detail_borrower" type="text" class="form-control" id="detail_borrower" readonly>
                </div>

                <div class="input-box">
                    <label for="detail_date">Date Requested:</label>
                    <input name="detail_date" type="date" class="form-control" id="detail_date" readonly>
                </div>

                <div class="input-box">
                    <label for="detail_time">Time Requested:</label>
                    <input name="detail_time" type="time" class="form-control" id="detail_time" readonly>
                </div>

                <div class="input-box">
                    <label for="detail_brand">Item Description:</label>
                    <input name="detail_brand" type="text" class="form-control" id="detail_brand" readonly>
                </div>

                <div class="input-box">
                    <label for="detail_UOM">UOM:</label>
                    <input name="detail_UOM" type="text" class="form-control" id="detail_UOM" readonly>
                </div>
                
                <div class="input-box">
                    <label for="detail_quantity">Quantity:</label>
                    <input name="detail_quantity" type="text" class="form-control" id="detail_quantity" readonly>
                </div>

                <div class="input-box">
                    <label for="detail_unit">Unit:</label>
                    <input name="detail_unit" type="text" class="form-control" id="detail_unit" readonly>
                </div>

                <div class="input-box">
                    <label for="detail_purpose">Purpose:</label>
                    <input name="detail_purpose" type="textarea" class="form-control" id="detail_purpose" readonly>
                </div>

                  <div class="input-box">
                    <label for="detail_note">Notes:</label>
                    <input name="detail_note" type="text" class="form-control" id="detail_note" readonly>
                </div>

                

                <div class="input-box">
                    <li class="btn" id="close_detail_request">Close</li>
                </div> 
            </div>  
        </form>    
    </div>        
</div>
<?php } ?>