// start of Navbar
document.addEventListener("DOMContentLoaded", function() {
    const menuBtn = document.getElementById("menu-btn");
    const sidebar = document.querySelector(".sidebar");
    const content = document.querySelector(".content");

    menuBtn.addEventListener("click", function() {
        sidebar.classList.toggle("shrink");
        content.classList.toggle("shrink");
    });
});
// end of navbar

// start of dynamic Searching
function searchInventory() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let table = document.getElementById("inventoryTable");
    let rows = table.getElementByTagName("tr");

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        let cells = rows[i].getElementByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length - 1; j++) { // Exclude the action column
            if (cells[j].innerText.toLowerCase().includes(input)) {
                match = true;
                break;
            }
        }

        rows[i].style.display = match ? "" : "none";
    }
}

function searchUser() {
    let input = document.getElementById("searchInputUser").value.toLowerCase();
    let table = document.getElementById("userTable");
    let rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        let cells = rows[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length - 1; j++) { // Exclude the action column
            if (cells[j].innerText.toLowerCase().includes(input)) {
                match = true;
                break;
            }
        }

        rows[i].style.display = match ? "" : "none";
    }
}

function searchRole() {
    let input = document.getElementById("searchInputRole").value.toLowerCase();
    let table = document.getElementById("roleTable");
    let rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        let cells = rows[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length - 1; j++) { // Exclude the action column
            if (cells[j].innerText.toLowerCase().includes(input)) {
                match = true;
                break;
            }
        }

        rows[i].style.display = match ? "" : "none";
    }
}

function searchUnit() {
    let input = document.getElementById("searchInputUnit").value.toLowerCase();
    let table = document.getElementById("unitTable");
    let rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        let cells = rows[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length - 1; j++) { // Exclude the action column
            if (cells[j].innerText.toLowerCase().includes(input)) {
                match = true;
                break;
            }
        }

        rows[i].style.display = match ? "" : "none";
    }
}

function searchAsset() {
    let input = document.getElementById("searchInputAsset").value.toLowerCase();
    let table = document.getElementById("assetTable");
    let rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        let cells = rows[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length - 1; j++) { // Exclude the action column
            if (cells[j].innerText.toLowerCase().includes(input)) {
                match = true;
                break;
            }
        }

        rows[i].style.display = match ? "" : "none";
    }
}

function searchBrand() {
    let input = document.getElementById("searchInputBrand").value.toLowerCase();
    let table = document.getElementById("BrandTable");
    let rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        let cells = rows[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length - 1; j++) { // Exclude the action column
            if (cells[j].innerText.toLowerCase().includes(input)) {
                match = true;
                break;
            }
        }

        rows[i].style.display = match ? "" : "none";
    }
}

// end of dynamic Searching

// start of add item modal
document.addEventListener("DOMContentLoaded", function () {
    // ✅ [ADDED] Check if all required elements exist before attaching event listeners
    const addItemBtn = document.getElementById("addItemBtn");
    const modal = document.getElementById("modal_cont_add");
    const closeBtn_add = document.getElementById("close_add");
    const form = document.getElementById("addAssetForm");
    const messageDiv = document.getElementById("add_responseMessage");

    if (addItemBtn && modal && closeBtn_add && form && messageDiv) {
        // ✅ Show modal
        addItemBtn.addEventListener("click", () => {
            // Disable Asset Type if brand is selected
        const brandSelect = document.getElementById("brand");
        const assetTypeSelect = document.getElementById("asset");

        // Disable Unit if responsible user is selected
        const responsibleSelect = document.getElementById("responsibleTo");
        const unitSelect = document.getElementById("unit");

        function checkBrandDependency() {
            const selectedBrand = brandSelect.value;
            const isCustom = selectedBrand === "__new_brand__" || selectedBrand === "";

            assetTypeSelect.disabled = !isCustom;
            assetTypeSelect.closest(".input-box").style.opacity = isCustom ? "1" : "0.5";
        }

        function checkResponsibleDependency() {
            const selectedResponsible = responsibleSelect.value;
            const isCustom = selectedResponsible === "__new_responsibleTo__" || selectedResponsible === "";

            unitSelect.disabled = !isCustom;
            unitSelect.closest(".input-box").style.opacity = isCustom ? "1" : "0.5";
        }

        // Initial check
        checkBrandDependency();
        checkResponsibleDependency();

        // Add listeners
        brandSelect.addEventListener("change", checkBrandDependency);
        responsibleSelect.addEventListener("change", checkResponsibleDependency);

            modal.classList.add("show");
            document.body.style.overflow = "hidden";

            // ✅ Initialize dynamic 'Add new...' fields
            toggleNewField("asset", "new_asset", "__new_asset_type__");
            toggleNewField("brand", "new_brand", "__new_brand__");
            toggleNewField("responsibleTo", "new_responsibleTo", "__new_responsibleTo__");
            toggleNewField("unit", "new_unit", "__new_unit__");
        });

        // ✅ Close modal
        closeBtn_add.addEventListener("click", () => {
            handleModalClose("modal_cont_add", {
                clearMessageId: "add_responseMessage",
                hideFields: [
                    "new_asset", "new_brand", "new_responsibleTo", "new_unit"
                ],
                resetStyles: [
                    { id: "asset" },
                    { id: "unit" }
                ],
                reloadAfter: 500
            });
        });
        

        // ✅ Submit form
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const formData = new FormData(form);

            fetch('/ims/auth/asset/InsertAuth.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(response => {
                messageDiv.textContent = response;

                if (response.trim().toLowerCase() === "success") {
                    form.reset();
                    messageDiv.style.color = '#4CAF50'; // green
                } else {
                    messageDiv.style.color = '#F44336'; // red
                }
            })
            .catch(err => {
                messageDiv.textContent = 'Something went wrong.';
                messageDiv.style.color = '#F44336';
            });
        });
    } else {
        console.warn("One or more elements for Add Item Modal not found in DOM.");
    }
});

function toggleNewField(selectId, inputId, triggerValue) {
    const select = document.getElementById(selectId);
    const input = document.getElementById(inputId);

    if (!select || !input) {
        console.warn(`Missing elements for: ${selectId} or ${inputId}`);
        return;
    }

    // Initial state
    input.style.display = (select.value === triggerValue) ? "block" : "none";
    input.required = (select.value === triggerValue);

    // Listen for changes
    select.addEventListener("change", () => {
        const isTrigger = select.value === triggerValue;
        input.style.display = isTrigger ? "block" : "none";
        input.required = isTrigger;
    });
}
// end of add item modal

// start of asset edit button
document.addEventListener("DOMContentLoaded", () => {
    const modalDetails = document.getElementById("modal_cont_details");
    const closeDetails = document.getElementById("close_details");

    // ✅ [ADDED] Ensure required elements exist
    if (modalDetails && closeDetails) {
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const serial = btn.id.split("-")[1];
                fetch(`/ims/auth/asset/get_asset_by_serial.php?serial=${encodeURIComponent(serial)}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log("Fetched data:", data); 
                        if (data) {
                            document.getElementById("barcodeImg").src = '/ims/' + data.barcode_image_path;
                            document.getElementById("detail_tag").value = data.inventory_tag;
                            document.getElementById("detail_serial").value = data.serial_number;
                            document.getElementById("detail_asset").value = data.asset_type || "";
                            document.getElementById("detail_brand").value = data.brand_name || "";
                            document.getElementById("detail_responsible").value = data.responsible_user || "";
                            document.getElementById("detail_unit").value = data.user_unit || "";

                            modalDetails.classList.add("show");
                            document.body.style.overflow = "hidden";
                        } else {
                            alert("Asset details not found.");
                        }
                    })
                    .catch(err => {
                        alert("Error loading asset details.");
                        console.error(err);
                    });
            });
        });

        closeDetails.addEventListener("click", () => {
            handleModalClose("modal_cont_details", {
                reloadAfter: 500
            });
        });
        
    } else {
        // ✅ [ADDED] Debugging message
        console.warn("modal_cont_details or close_details not found in DOM.");
    }
});
// end of asset edit button

// start of asset details modal
let initialDetails = {};

function captureInitialDetails() {
    initialDetails = {
        tag: document.getElementById('detail_tag').value,
        asset: document.getElementById('detail_asset').value,
        brand: document.getElementById('detail_brand').value,
        responsible: document.getElementById('detail_responsible').value,
        unit: document.getElementById('detail_unit').value
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('updateForm');
    const responseDiv = document.getElementById('update_responseMessage');
    const modal = document.getElementById('modal_cont_details');
    //const closeBtn = document.getElementById('close_details');

    if (form && responseDiv && modal && closeBtn) {

        // ✅ Capture initial values on open
        document.querySelectorAll('[data-open="details-modal"]').forEach(button => {
            button.addEventListener('click', () => {
                captureInitialDetails();
            });
        });

        // ✅ Submit handler
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const current = {
                tag: document.getElementById('detail_tag').value,
                asset: document.getElementById('detail_asset').value,
                brand: document.getElementById('detail_brand').value,
                responsible: document.getElementById('detail_responsible').value,
                unit: document.getElementById('detail_unit').value
            };

            const changed = Object.keys(current).some(key => current[key] !== initialDetails[key]);

            if (!changed) {
                responseDiv.innerText = "No changes detected.";
                responseDiv.style.color = "orange";
                return;
            }

            const formData = new FormData(form);

            fetch('/ims/auth/asset/updateAuth.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(response => {
                responseDiv.textContent = response;

                if (response.trim().toLowerCase() === "success") {
                    responseDiv.style.color = '#4CAF50'; // green
                    // Don't reset form — user still sees their changes
                    captureInitialDetails(); // update stored values after successful save
                } else {
                    responseDiv.style.color = '#F44336'; // red
                }
            })
            .catch(err => {
                responseDiv.textContent = 'Something went wrong.';
                responseDiv.style.color = '#F44336';
            });
        });

    } else {
        console.warn("Required elements for asset details modal not found.");
    }
});
// end of asset details modal

// start of delete asset 
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', () => {
            const serial = button.getAttribute('data-serial');
            if (!serial) return;

            if (confirm(`Are you sure you want to delete asset with Serial Number: ${serial}?`)) {
                fetch('/ims/auth/asset/deleteAuth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ serial })
                })
                .then(res => res.text())
                .then(response => {
                    if (response.trim().toLowerCase() === 'success') {
                        alert("Asset successfully inactivated.");
                        setTimeout(() => location.reload(), 500);
                    } else {
                        alert("Error: " + response);
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Something went wrong.");
                });
            }
        });
    });
});

// end of delete asset

// close button handler assets
function handleModalClose(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.warn(`Modal with ID '${modalId}' not found.`);
        return;
    }

    modal.classList.remove("show");
    document.body.style.overflow = "auto";

    if (options.clearFields) {
        options.clearFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.value = "";
            }
        });
    }

    if (options.clearMessageId) {
        const msg = document.getElementById(options.clearMessageId);
        if (msg) msg.textContent = "";
    }

    if (options.hideFields) {
        options.hideFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });
    }

    if (options.resetStyles) {
        options.resetStyles.forEach(({ id, opacity }) => {
            const el = document.getElementById(id);
            if (el) {
                el.disabled = false;
                el.closest(".input-box").style.opacity = opacity || "1";
            }
        });
    }

    if (options.reloadAfter) {
        setTimeout(() => location.reload(), options.reloadAfter);
    }
}
// close button handler assets

// start of add user modal
document.addEventListener("DOMContentLoaded", function () {
    // ✅ [ADDED] Check if all required elements exist before attaching event listeners
    const addUserBtn = document.getElementById("addUserBtn");
    const modal_add_user = document.getElementById("modal_cont_add_user");
    const close_add_user = document.getElementById("close_add_user");
    const addUserForm = document.getElementById("addUserForm");
    const messageDiv_add_user = document.getElementById("add_user_responseMessage");

    if (addUserBtn && modal_add_user && close_add_user && addUserForm && messageDiv_add_user) {
        
        // ✅ [ADDED] Enable/disable account fields based on checkbox toggle
        const toggleCheckbox = document.getElementById("toggle_account_fields");
        const role = document.getElementById('role');
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        
        if (toggleCheckbox && role && username && password) {
            // ✅ Initially hide and disable the fields
            role.parentElement.style.display = "none";
            username.parentElement.style.display = "none";
            password.parentElement.style.display = "none";
        
            role.disabled = true;
            username.disabled = true;
            password.disabled = true;
        
            toggleCheckbox.addEventListener("change", function () {
                const isChecked = this.checked;
        
                // ✅ Show/hide the fields
                role.parentElement.style.display = isChecked ? "flex" : "none";
                username.parentElement.style.display = isChecked ? "flex" : "none";
                password.parentElement.style.display = isChecked ? "flex" : "none";
        
                // ✅ Enable/disable + require/not required
                [role, username, password].forEach(input => {
                    input.disabled = !isChecked;
                    input.required = isChecked;
                });
            });
        }

        // ✅ Show modal
        addUserBtn.addEventListener("click", () => {

            modal_add_user.classList.add("show");
            document.body.style.overflow = "hidden";
            // ✅ Initialize dynamic 'Add new...' fields
            toggleNewField("unit", "new_unit", "__new_unit__");
            toggleNewField("role", "new_role", "__new_role__");
        });

        // ✅ Close modal
        close_add_user.addEventListener("click", () => {
            modal_add_user.classList.remove("show");
            document.body.style.overflow = "auto";
        
            addUserForm.reset();
            messageDiv_add_user.textContent = "";
        
            // Hide new input fields
            ["new_unit", "new_role"].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.display = "none";
                    el.disabled = true;
                    el.required = false;
                }
            });
        
            // Hide and reset account fields
            const toggleCheckbox = document.getElementById("toggle_account_fields");
            const role = document.getElementById('role');
            const username = document.getElementById('username');
            const password = document.getElementById('password');
        
            if (toggleCheckbox) toggleCheckbox.checked = false;
        
            [role, username, password].forEach(field => {
                if (field) {
                    field.parentElement.style.display = "none";
                    field.disabled = true;
                    field.required = false;
                }
            });
        
            // ✅ Force page reload after closing
            setTimeout(() => {
                location.reload();
            }, 500);
        });
        
        // ✅ Submit form
        addUserForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const formData_user_add = new FormData(addUserForm);

            // ✅ Remove account fields if checkbox is not checked
            const toggleCheckbox = document.getElementById("toggle_account_fields");
            if (!toggleCheckbox.checked) {
                formData_user_add.set("role", "");
                formData_user_add.set("username", "");
                formData_user_add.set("password", "");
            }

            fetch('/ims/auth/users/InsertAuth.php', {
                method: 'POST',
                body: formData_user_add
            })
            .then(res_user_add => res_user_add.text())
            .then(response_user_add => {
                messageDiv_add_user.textContent = response_user_add;

                if (response_user_add.trim().toLowerCase() === "success") {
                    addUserForm.reset();
                    messageDiv_add_user.style.color = '#4CAF50'; // green
                } else {
                    messageDiv_add_user.style.color = '#F44336'; // red
                }
            })
            .catch(err => {
                messageDiv_add_user.textContent = 'Something went wrong.';
                messageDiv_add_user.style.color = '#F44336';
            });
        });
    } else {
        console.warn("One or more elements for Add Item Modal not found in DOM.");
    }
});

function toggleNewField(selectId, inputId, triggerValue) {
    const select = document.getElementById(selectId);
    const input = document.getElementById(inputId);

    if (!select || !input) {
        console.warn(`Missing elements for: ${selectId} or ${inputId}`);
        return;
    }

    // Initial state
    input.style.display = (select.value === triggerValue) ? "block" : "none";
    input.required = (select.value === triggerValue);

    // Listen for changes
    select.addEventListener("change", () => {
        const isTrigger = select.value === triggerValue;
        input.style.display = isTrigger ? "block" : "none";
        input.required = isTrigger;
        input.disabled = !isTrigger;
    });
}

// end of add user modal


console.log("User details JS loaded.");
// start of user edit button
document.addEventListener("DOMContentLoaded", () => {
    const userDetailModal = document.getElementById('modal_cont_detail_user');
    const userDetailCloseBtn = document.getElementById('close_detail_user');

    if (userDetailModal && userDetailCloseBtn) {
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const user_ID = btn.id.split("-")[1];
                fetch(`/ims/auth/users/get_user_by_user_ID.php?user_ID=${encodeURIComponent(user_ID)}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log("Fetched data:", data);
                        if (data) {
                            document.getElementById("user_detail_username").value = data.username || "";
                            document.getElementById("user_detail_password").value = "";
                            document.getElementById("user_detail_fullname").value = data.full_name || "";
                            document.getElementById("user_detail_id").value = data.user_ID || "";

                            // Set role
                            const roleSelect = document.getElementById("user_detail_role");
                            if (roleSelect) {
                                Array.from(roleSelect.options).forEach(opt => {
                                    opt.selected = opt.text === data.role_name;
                                });
                            }

                            // Set unit
                            const unitSelect = document.getElementById("user_detail_unit");
                            if (unitSelect) {
                                Array.from(unitSelect.options).forEach(opt => {
                                    opt.selected = opt.text === data.unit_name;
                                });
                            }

                            // Handle account field toggle
                            const toggleCheckbox = document.getElementById("toggle_account_fields_details");
                            const roleField = roleSelect;
                            const usernameField = document.getElementById("user_detail_username");
                            const passwordField = document.getElementById("user_detail_password");

                            if (data.username) {
                                toggleCheckbox.checked = true;
                                roleField.parentElement.style.display = "flex";
                                usernameField.parentElement.style.display = "flex";
                                passwordField.parentElement.style.display = "flex";
                                roleField.disabled = false;
                                usernameField.disabled = false;
                                passwordField.disabled = false;
                            } else {
                                toggleCheckbox.checked = false;
                                roleField.parentElement.style.display = "none";
                                usernameField.parentElement.style.display = "none";
                                passwordField.parentElement.style.display = "none";
                                roleField.disabled = true;
                                usernameField.disabled = true;
                                passwordField.disabled = true;
                                usernameField.value = "";
                                passwordField.value = "";
                            }

                            toggleCheckbox.addEventListener("change", function () {
                                const show = this.checked;
                                roleField.parentElement.style.display = show ? "flex" : "none";
                                usernameField.parentElement.style.display = show ? "flex" : "none";
                                passwordField.parentElement.style.display = show ? "flex" : "none";
                                roleField.disabled = !show;
                                usernameField.disabled = !show;
                                passwordField.disabled = !show;
                            });

                            userDetailModal.classList.add("show");
                            document.body.style.overflow = "hidden";
                        } else {
                            alert("User details not found.");
                        }
                    })
                    .catch(err => {
                        alert("Error loading user details.");
                        console.error(err);
                    });
            });
        });

        userDetailCloseBtn.addEventListener("click", (e) => {
            e.preventDefault();
            userDetailModal.classList.remove("show");
            document.body.style.overflow = "auto";

            setTimeout(() => {
                location.reload();
            }, 500);
        });
    } else {
        console.warn("modal_cont_detail_user or close_detail_user not found in DOM.");
    }
});
// end of user edit button

// start of user details modal
let initialUserDetails = {};

function captureInitialUserDetails() {
    initialUserDetails = {
        role: document.getElementById('user_detail_role').value,
        user_ID: document.getElementById('user_detail_id').value,
        username: document.getElementById('user_detail_username').value,
        password: document.getElementById('user_detail_password').value,
        full_name: document.getElementById('user_detail_fullname').value,
        user_unit: document.getElementById('user_detail_unit').value
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const userDetailForm = document.getElementById("userDetailsForm");
    const userDetailDiv = document.getElementById("detail_user_responseMessage");
    const userDetailModal = document.getElementById("modal_cont_detail_user");
    const userDetailCloseBtn = document.getElementById("close_detail_user");

    if (userDetailForm && userDetailDiv && userDetailModal && userDetailCloseBtn) {
        document.querySelectorAll('[data-open="details-modal"]').forEach(button => {
            button.addEventListener("click", () => {
                captureInitialUserDetails();
            });
        });

        userDetailForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const current = {
                role: document.getElementById('user_detail_role').value,
                user_ID: document.getElementById('user_detail_id').value,
                username: document.getElementById('user_detail_username').value,
                password: document.getElementById('user_detail_password').value,
                full_name: document.getElementById('user_detail_fullname').value,
                user_unit: document.getElementById('user_detail_unit').value
            };

            const changed = Object.keys(current).some(key => current[key] !== initialUserDetails[key]);

            if (!changed) {
                userDetailDiv.innerText = "No changes detected.";
                userDetailDiv.style.color = "orange";
                return;
            }

            const formData = new FormData(userDetailForm);

            fetch("/ims/auth/users/updateAuth.php", {
                method: "POST",
                body: formData
            })
                .then(res => res.text())
                .then(response => {
                    userDetailDiv.textContent = response;

                    if (response.trim().toLowerCase() === "success") {
                        userDetailDiv.style.color = "#4CAF50"; // green
                        captureInitialUserDetails(); // update after save
                    } else {
                        userDetailDiv.style.color = "#F44336"; // red
                    }
                })
                .catch(err => {
                    userDetailDiv.textContent = "Something went wrong.";
                    userDetailDiv.style.color = "#F44336";
                });
        });

        const toggleCheckbox = document.getElementById("toggle_account_fields_details");
        const role = document.getElementById("user_detail_role");
        const username = document.getElementById("user_detail_username");
        const password = document.getElementById("user_detail_password");

        if (toggleCheckbox && role && username && password) {
            role.parentElement.style.display = "none";
            username.parentElement.style.display = "none";
            password.parentElement.style.display = "none";

            role.disabled = true;
            username.disabled = true;
            password.disabled = true;

            toggleCheckbox.addEventListener("change", function () {
                const show = this.checked;

                role.parentElement.style.display = show ? "flex" : "none";
                username.parentElement.style.display = show ? "flex" : "none";
                password.parentElement.style.display = show ? "flex" : "none";

                [role, username, password].forEach(input => {
                    input.disabled = !show;
                    input.required = show;
                });
            });
        }
    }
});
// end of user details modal

// start of delete user
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', () => {
            const user_ID = button.getAttribute('data-user');
            if (!user_ID) return;

            if (confirm(`Are you sure you want to delete user with User ID: ${user_ID}?`)) {
                fetch('/ims/auth/users/deleteAuth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ user_ID })
                })
                .then(res => res.text())
                .then(response => {
                    if (response.trim().toLowerCase() === 'success') {
                        alert("User successfully inactivated.");
                        setTimeout(() => location.reload(), 500);
                    } else {
                        alert("Error: " + response);
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Something went wrong.");
                });
            }
        });
    });
});

// end of delete user