<?php
function detailesUserModal (){
    $fetcher = new DataFetcher();
    $units = $fetcher->getAllUnits();
    $roles = $fetcher->getAllRoles();
?>
<div class="modal-container" id="modal_cont_detail_user">
    <div class="modal">
        <form id="userDetailsForm" method="POST">
        <h3>Edit User Information</h3>
            <div class="field-details">
         
            <div class="field-details">
                <div class="input-box">
                    <label>
                        <input type="checkbox" id="toggle_account_fields_details">
                        Create an account for this user
                    </label>
                </div>

                <div class="input-box">
                    <label for="user_detail_id">User ID:</label>
                    <input name="user_ID" type="text" class="form-control" id="user_detail_id" readonly>
                </div>

                <div class="input-box">
                    <label for="_user_role">Role:</label>
                    <select name="user_detail_role" class="form-control" id="user_detail_role" required>
                        <option value="" selected disabled>Select role</option>
                        <?php foreach ($roles as $role): ?>
                            <option value="<?= htmlspecialchars($role['role_name']) ?>"><?= htmlspecialchars($role['role_name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="input-box">
                    <label for="user_detail_username">username:</label>
                    <input name="user_detail_username" type="text" class="form-control" id="user_detail_username" required>
                </div>

                <div class="input-box">
                    <label for="user_detail_password">password:</label>
                    <input name="user_detail_password" type="password" class="form-control" id="user_detail_password">
                </div>

                <div class="input-box">
                    <label for="user_detail_fullname">Full name:</label>
                    <input name="user_detail_fullname" type="text" class="form-control" id="user_detail_fullname" required>
                </div>

                <div class="input-box">
                    <label for="unit">Unit/Institute:</label>
                        <select name="user_detail_unit" class="form-control" id="user_detail_unit" required>
                            <option value="" selected disabled>Select Unit (Add new if none)</option>
                            <?php foreach ($units as $unit): ?>
                                <option value="<?= htmlspecialchars($unit['unit_ID']) ?>"><?= htmlspecialchars($unit['unit_name']) ?></option>
                            <?php endforeach; ?>
                        </select>
                </div>
             
                <div class="input-box">
                    <button type="submit" class="btn" id="updateUserDetails">Update</button>
                    <li class="btn" id="close_detail_user">Close</li>
                </div> 
            </div>  
        </form>    
    </div>        
</div>
<?php } ?>