<?php 
if (!defined('IN_APP')) {
    die("Access Denied");
}
function requestform(){ ?>
        <!-- Left Column: Instructions -->
        <div class="request-box">
            <form id="request">
                <div class="header-request"><h2>Request to Borrow Item</h2></div>
                <div class="request-fields">
                    <div class="input-box">
                        <label for="kldid">KLD ID:</label>
                        <input type="text" class="field-control" id="kldid" required>
                    </div>
                    
                    <div class="input-box">
                        <label for="data">Date:</label>
                        <input type="date" class="field-control" id="data" required>
                    </div>

                    <div class="input-box">
                        <label for="time">Time:</label>
                        <input type="time" class="field-control" id="time" required>
                    </div>

                    <div class="input-box">
                        <label for="serialnum">Item Name:</label>
                        <input type="text" class="field-control" id="serialnum" required>
                    </div>

                    <div class="input-box">
                        <label for="uom">UOM:</label>
                        <input type="text" class="field-control" id="uom" required>
                    </div>

                    <div class="input-box">
                        <label for="quantity">Quantity:</label>
                        <input type="number" class="field-control" id="quantity" required>
                    </div>

                    <div class="input-box">
                        <label for="requestDepartment">Institute/Unit:</label>
                        <select class="field-control" id="requestDepartment" required>
                            <option value="" disabled selected>Select Institute/Unit</option>
                            <option value="IMACS">IMACS</option>
                            <option value="IOM">IOM</option>
                            <option value="ION">ION</option>
                            <option value="IOE">IOE</option>
                            <option value="ILA">ILA</option>
                        </select>
                    </div>

                    <div class="input-box">
                        <label for="remarks">Purpose:</label>
                        <textarea class="field-control" id="remarks" rows="4"></textarea>
                    </div>
                </div>
                
                <div class="button-box">
                    <button type="submit" class="btn">Request</button>
                </div>
            </form>
        </div>

        <!-- Right Column: Request Form -->
        <div class="instruction-box">
            <div class="header-request"><h2>How Borrowing Works</h2></div>
            <p>1. Fill in the required details in the form.</p>
            <p>2. Select the correct institute/unit.</p>
            <p>3. Submit your request and wait for approval.</p>
            <p>4. Ensure items are returned on time.</p>
        </div>

       
<?php } ?>