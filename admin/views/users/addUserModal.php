<?php
function addUserModal () {
    require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\users\InsertAuth.php';
    $fetcher = new DataFetcher();
    $units = $fetcher->getAllUnits();
    $roles = $fetcher->getAllRoles();
?>
<div class="modal-container" id="modal_cont_add_user">
    <div class="modal">
        <form id="addUserForm" method="POST">
            <input type="hidden" value="<?= htmlspecialchars($_SESSION['full_name']) ?>" name="name">
            <h3>Register New User</h3>
          
            <div class="field-details">
                <div class="input-box">
                    <label>
                        <input type="checkbox" id="toggle_account_fields">
                        Create an account for this user
                    </label>
                </div>

                <div class="input-box account-field">
                    <label for="role">Role:</label>
                    <select name="role" class="form-control" id="role" required>
                        <option value="" selected disabled>Select role (Add new if none)</option>
                        <?php foreach ($roles as $role): ?>
                            <option value="<?= htmlspecialchars($role['role_ID']) ?>"><?= htmlspecialchars($role['role_name']) ?></option>
                        <?php endforeach; ?>
                        <option value="__new_role__">✙ Add new...</option>
                    </select>
                </div>

                <div class="input-box account-field">
                    <label for="role"></label>
                    <input name="new_role" type="text" class="form-control" id="new_role" style="display:none;" required>
                </div>

                <div class="input-box">
                    <label for="kld_id">KLD-ID:</label>
                    <input name="kld_id" type="text" class="form-control" id="kld_id" placeholder="KLD-00-000000">
                </div>

                <div class="input-box account-field">
                    <label for="kld_email">KLD-email:</label>
                    <input type="email" name="kld_email" class="form-control" id="kld_email" placeholder="jmprepuya@kld.edu.ph">
                </div>

                <div class="input-box account-field">
                    <label for="password">Password:</label>
                    <input type="password" name="password" class="form-control" id="password">
                </div>
                
                <div class="input-box">
                    <label for="f_name">First Name:</label>
                    <input name="f_name" type="text" class="form-control" id="f_name" required>
                </div> 

                <div class="input-box">
                    <label for="m_name">Middle Name:</label>
                    <input name="m_name" type="text" class="form-control" id="m_name" required>
                </div> 

                <div class="input-box">
                    <label for="l_name">Last Name:</label>
                    <input name="l_name" type="text" class="form-control" id="l_name" required>
                </div> 


                <div class="input-box">
                    <label for="unit">Unit/Institute:</label>
                        <select name="unit" class="form-control" id="unit" required>
                            <option value="" selected disabled>Select Unit (Add new if none)</option>
                            <?php foreach ($units as $unit): ?>
                                <option value="<?= htmlspecialchars($unit['unit_ID']) ?>"><?= htmlspecialchars($unit['unit_name']) ?></option>
                            <?php endforeach; ?>
                            <option value="__new_unit__">✙ Add new...</option>
                        </select>
                </div>

                <div class="input-box">
                    <label for="unit"></label>
                    <input type="text" name="new_unit" id="new_unit" class="form-control" placeholder="Enter new unit" style="display:none;">
                </div>

                <div class="input-box">
                    <button type="submit" class="btn" id="saveNewUser">Register</button>
                    <li type="submit" class="btn" id="close_add_user">Close</li>
                </div> 
            </div>      
        </form>
    </div>        
</div>
<?php } ?>
