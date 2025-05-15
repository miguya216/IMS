<?php
function detailesUserModal (){
    $fetcher = new DataFetcher();
    $units = $fetcher->getAllUnits();
    $roles = $fetcher->getAllRoles();
?>
<div class="modal-container" id="modal_cont_detail_user">
    <div class="modal">
        <form id="userDetailsForm" method="POST">
        <input type="hidden" value="<?= htmlspecialchars($_SESSION['full_name']) ?>" name="name">
        <h3>Edit User Information</h3>
            <div class="field-details">
         
            <div class="field-details">
                <div class="input-box">
                    <label>
                        <input type="checkbox" id="toggle_account_fields_details">
                        Create an account for this user
                    </label>
                </div>
                <input name="user_ID" type="hidden" class="form-control" id="user_detail_user_ID">
                
                <div class="input-box">
                    <label for="kld_ID">KLD ID:</label>
                    <input name="kld_ID" type="text" class="form-control" id="user_detail_kld_ID" required>
                </div>

                <div class="input-box">
                    <label for="_user_role">Role:</label>
                    <select name="role" class="form-control" id="user_detail_role" required>
                        <option value="" selected disabled>Select role</option>
                        <?php foreach ($roles as $role): ?>
                            <option value="<?= htmlspecialchars($role['role_name']) ?>"><?= htmlspecialchars($role['role_name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="input-box">
                    <label for="kld_email">KLD email:</label>
                    <input name="kld_email" type="text" class="form-control" id="user_detail_kld_email" required>
                </div>

                <div class="input-box">
                    <label for="password">password:</label>
                    <input name="password" type="password" class="form-control" id="user_detail_password">
                </div>

                <div class="input-box">
                    <label for="f_name">First name:</label>
                    <input name="f_name" type="text" class="form-control" id="user_detail_f_name" required>
                </div>

                <div class="input-box">
                    <label for="m_name">Middle name:</label>
                    <input name="m_name" type="text" class="form-control" id="user_detail_m_name" required>
                </div>

                <div class="input-box">
                    <label for="l_name">Last name:</label>
                    <input name="l_name" type="text" class="form-control" id="user_detail_l_name" required>
                </div>

                <div class="input-box">
                    <label for="unit">Unit/Institute:</label>
                        <select name="unit" class="form-control" id="user_detail_unit" required>
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