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

            <h1>Insert Usert</h1>
            <div class="notif-container">
                <div id="add_user_responseMessage"></div>
            </div>
            <div class="field-details">
                <div class="input-box">
                    <label>
                        <input type="checkbox" id="toggle_account_fields">
                        Create an account for this user
                    </label>
                </div>

                <div class="input-box">
                    <label for="role">Role:</label>
                    <select name="role" class="form-control" id="role" required>
                        <option value="" selected disabled>Select role (Add new if none)</option>
                        <?php foreach ($roles as $role): ?>
                            <option value="<?= htmlspecialchars($role['role_name']) ?>"><?= htmlspecialchars($role['role_name']) ?></option>
                        <?php endforeach; ?>
                        <option value="__new_role__">➕ Add new...</option>
                    </select>
                </div>

                <div class="input-box">
                    <label for="role"></label>
                    <input name="new_role" type="text" class="form-control" id="new_role" style="display:none;" required>
                </div>
                <div class="input-box">
                    <label for="username">Username:</label>
                    <input type="text" name="username" class="form-control" id="username" disabled required>
                </div>

                <div class="input-box">
                    <label for="password">Password:</label>
                    <input type="password" name="password" class="form-control" id="password" disabled required>
                </div>

                <div class="input-box">
                    <label for="full_name">Full Name:</label>
                    <input name="full_name" type="text" class="form-control" id="full_name" required>
                </div> 

                <div class="input-box">
                    <label for="unit">Unit/Institute:</label>
                        <select name="unit" class="form-control" id="unit" required>
                            <option value="" selected disabled>Select Unit (Add new if none)</option>
                            <?php foreach ($units as $unit): ?>
                                <option value="<?= htmlspecialchars($unit['unit_name']) ?>"><?= htmlspecialchars($unit['unit_name']) ?></option>
                            <?php endforeach; ?>
                            <option value="__new_unit__">➕ Add new...</option>
                        </select>
                </div>

                <div class="input-box">
                    <label for="unit"></label>
                    <input type="text" name="new_unit" id="new_unit" class="form-control" placeholder="Enter new unit" style="display:none;">
                </div>

                <div class="input-box">
                    <button type="submit" class="btn" id="saveNewUser">Add Item</button>
                    <li type="submit" class="btn" id="close_add_user">Close</li>
                </div> 
            </div>      
        </form>
    </div>        
</div>
<?php } ?>
