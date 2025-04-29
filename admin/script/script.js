// Start of Navbar
document.addEventListener("DOMContentLoaded", function() {
    const menuBtn = document.getElementById("menu-btn");
    const sidebar = document.querySelector(".sidebar");
    const content = document.querySelector(".content");

    if (menuBtn && sidebar && content) {
        menuBtn.addEventListener("click", function(e) {
            e.stopPropagation(); // prevent click from reaching document
            sidebar.classList.toggle("shrink");
            content.classList.toggle("shrink");
        });

        // Click outside sidebar to shrink it
        document.addEventListener("click", function(e) {
            // If sidebar is OPEN and click is OUTSIDE sidebar + menu button
            if (!sidebar.classList.contains("shrink") && 
                !sidebar.contains(e.target) && 
                !menuBtn.contains(e.target)) {
                
                sidebar.classList.add("shrink");
                content.classList.add("shrink");
            }
        });

        // Clicking inside sidebar should not close it
        sidebar.addEventListener("click", function(e) {
            e.stopPropagation();
        });
    }
});
// End of Navbar


// start of dynamic Searching
function searchInventory() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let table = document.getElementById("inventoryTable");
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
// end of dynamic Searching

// start of reusable popup modal
function showPopup(message, color = '#005a34') {
    const notifModal = document.getElementById('notifModal');
    const notifMessage = document.getElementById('responseMessage');

    notifMessage.textContent = message;
    notifMessage.style.color = color;

    notifModal.style.display = 'block';

    setTimeout(() => {
        notifModal.style.display = 'none';
    }, 1500); // 1.5 seconds
}
// start of reusable popup modal


// Start of add item modal
document.addEventListener("DOMContentLoaded", () => {
    const addItemBtn = document.getElementById("addItemBtn");
    const modal = document.getElementById("modal_cont_add");
    const closeBtn_add = document.getElementById("close_add");
    const form = document.getElementById("addAssetForm");

    // Ensure all required elements are present
    const brandSelect = document.getElementById("brand");
    const assetTypeSelect = document.getElementById("asset");
    const responsibleSelect = document.getElementById("responsibleTo");
    const unitSelect = document.getElementById("unit");

    if (addItemBtn && modal && closeBtn_add && form && brandSelect && assetTypeSelect && responsibleSelect && unitSelect) {

        // Function to disable dropdowns based on dependencies
        function checkBrandDependency() {
            const isCustom = brandSelect.value === "__new_brand__" || brandSelect.value === "";
            assetTypeSelect.disabled = !isCustom;
            assetTypeSelect.closest(".input-box").style.opacity = isCustom ? "1" : "0.5";
        }

        function checkResponsibleDependency() {
            const isCustom = responsibleSelect.value === "__new_responsibleTo__" || responsibleSelect.value === "";
            unitSelect.disabled = !isCustom;
            unitSelect.closest(".input-box").style.opacity = isCustom ? "1" : "0.5";
        }

        // Initial dependency checks
        checkBrandDependency();
        checkResponsibleDependency();

        // Event listeners for brand and responsible selections
        brandSelect.addEventListener("change", checkBrandDependency);
        responsibleSelect.addEventListener("change", checkResponsibleDependency);

        // Show modal
        addItemBtn.addEventListener("click", () => {
            modal.classList.add("show");
            document.body.style.overflow = "hidden";

            // Initialize 'Add new...' input fields
            toggleNewField("asset", "new_asset", "__new_asset_type__");
            toggleNewField("brand", "new_brand", "__new_brand__");
            toggleNewField("responsibleTo", "new_responsibleTo", "__new_responsibleTo__");
            toggleNewField("unit", "new_unit", "__new_unit__");
        });

        // Close modal
        closeBtn_add.addEventListener("click", () => {
            handleModalClose("modal_cont_add", {
                hideFields: ["new_asset", "new_brand", "new_responsibleTo", "new_unit"],
                resetStyles: [{ id: "asset" }, { id: "unit" }],
                reloadAfter: 500
            });
        });

        // Form submission
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const formData = new FormData(form);

            fetch('/ims/auth/asset/InsertAuth.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(response => {
                if (response.trim().toLowerCase() === "success") {
                    showPopup('Success!', '#005a34');
                    form.reset();
                } else {
                    showPopup(response, '#FF0000');
                }
            })
            .catch(err => {
                showPopup('Something went wrong.', '#FF0000');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 1500);
            });
        });
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

function handleModalClose(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("show");
        document.body.style.overflow = "auto";
        if (options.hideFields) {
            options.hideFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.style.display = "none";
                }
            });
        }
        if (options.resetStyles) {
            options.resetStyles.forEach(element => {
                const el = document.getElementById(element.id);
                if (el) {
                    el.style.opacity = "1"; // Reset opacity
                    el.disabled = false;    // Enable the select dropdown
                }
            });
        }
        if (options.reloadAfter) {
            setTimeout(() => {
                location.reload();
            }, options.reloadAfter);
        }
    }
}

// Start of asset edit button
document.addEventListener("DOMContentLoaded", () => {
    const modalDetails = document.getElementById("modal_cont_details");
    const closeDetails = document.getElementById("close_details");

    if (modalDetails && closeDetails) {
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const serial = btn.id.split("-")[1];
                fetch(`/ims/auth/asset/get_asset_by_serial.php?serial=${encodeURIComponent(serial)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data) {
                            document.getElementById("barcodeImg").src = '/ims/' + data.barcode_image_path;
                            document.getElementById("detail_tag").value = data.inventory_tag;
                            document.getElementById("detail_serial").value = data.serial_number;
                            document.getElementById("detail_asset").value = data.asset_type || "";
                            document.getElementById("detail_brand").value = data.brand_name || "";
                            document.getElementById("detail_responsible").value = data.responsible_user || "";
                            document.getElementById("detail_unit").value = data.user_unit || "";

                            captureInitialDetails();
                            modalDetails.classList.add("show");
                            document.body.style.overflow = "hidden";
                        } else {
                            alert("Asset details not found.");
                        }
                    })
                    .catch(() => alert("Error loading asset details."));
            });
        });

        closeDetails.addEventListener("click", () => handleModalClose("modal_cont_details", { reloadAfter: 500 }));
    }
});

// Start of asset details modal
let initialDetails = {};

document.addEventListener('DOMContentLoaded', () => {
    const formUpdate = document.getElementById('updateForm');

    if (formUpdate) {
        document.querySelectorAll('[data-open="details-modal"]').forEach(button => {
            button.addEventListener('click', () => captureInitialDetails());
        });

        formUpdate.addEventListener('submit', function (e) {
            e.preventDefault();
            const current = {
                tag: document.getElementById('detail_tag').value,
                asset: document.getElementById('detail_asset').value,
                brand: document.getElementById('detail_brand').value,
                responsible: document.getElementById('detail_responsible').value,
                unit: document.getElementById('detail_unit').value
            };

            const changed = Object.keys(current).some(key => current[key] !== initialDetails[key]);
            if (!changed) return showPopup("No changes detected.", 'orange');

            const formData = new FormData(formUpdate);
            fetch('/ims/auth/asset/updateAuth.php', { method: 'POST', body: formData })
                .then(res => res.text())
                .then(response => showPopup(response.trim().toLowerCase() === "success" ? 'Success!' : response, response.trim().toLowerCase() === "success" ? '#005a34' : '#FF0000'))
                .catch(() => showPopup('Something went wrong.', '#FF0000'));
        });
    }
});

function captureInitialDetails() {
    initialDetails = {
        tag: document.getElementById('detail_tag').value,
        asset: document.getElementById('detail_asset').value,
        brand: document.getElementById('detail_brand').value,
        responsible: document.getElementById('detail_responsible').value,
        unit: document.getElementById('detail_unit').value
    };
}

// Start of delete asset
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', () => {
            const serial = button.getAttribute('data-serial');
            if (!serial) return;
            if (confirm(`Are you sure you want to delete Asset with serial number: ${serial}?`)) {
                fetch('/ims/auth/asset/deleteAuth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ serial })
                })
                .then(res => res.text())
                .then(response => {
                    if (response.trim().toLowerCase() === 'success') {
                        showPopup('Asset successfully inactivated.', '#005a34');
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        showPopup('Error: ' + response, '#FF0000');
                    }
                })
                .catch(() => showPopup('Something went wrong.', '#FF0000'));
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const get = id => document.getElementById(id);
    const toggleFields = (toggle, fields, forceRequired = true) => {
        const show = toggle.checked;
        fields.forEach(f => {
            if (!f) return;
            f.parentElement.style.display = show ? "flex" : "none";
            f.disabled = !show;
            f.required = forceRequired && show;
        });
    };

    const addUserBtn = get("addUserBtn"), modalAdd = get("modal_cont_add_user"),
          closeAdd = get("close_add_user"), addUserForm = get("addUserForm"),
          toggleAccount = get("toggle_account_fields"),
          role = get("role"), username = get("username"), password = get("password");

    if (addUserBtn && modalAdd && closeAdd && addUserForm && toggleAccount) {
        toggleFields({checked:false}, [role, username, password]);

        toggleAccount.addEventListener("change", () => toggleFields(toggleAccount, [role, username, password]));

        addUserBtn.addEventListener("click", () => {
            modalAdd.classList.add("show");
            document.body.style.overflow = "hidden";
            ["unit", "role"].forEach(f => toggleNewField(f, `new_${f}`, `__new_${f}__`));
        });

        closeAdd.addEventListener("click", () => {
            modalAdd.classList.remove("show");
            document.body.style.overflow = "auto";
            addUserForm.reset();
            ["new_unit", "new_role"].forEach(id => {
                const el = get(id);
                if (el) Object.assign(el.style, {display:"none"}), el.disabled = true, el.required = false;
            });
            toggleAccount.checked = false;
            toggleFields({checked:false}, [role, username, password]);
            setTimeout(() => location.reload(), 500);
        });

        addUserForm.addEventListener("submit", e => {
            e.preventDefault();
            const data = new FormData(addUserForm);
            if (!toggleAccount.checked) ["role", "username", "password"].forEach(k => data.set(k, ""));
            fetch('/ims/auth/users/InsertAuth.php', { method: 'POST', body: data })
                .then(res => res.text())
                .then(res => showPopup(res.trim().toLowerCase() === "success" ? "User successfully added." : res, res.trim().toLowerCase() === "success" ? "#005a34" : "#FF0000"))
                .catch(() => showPopup('Something went wrong.', '#FF0000'));
        });
    }

    // User Detail Modal
    const userModal = get('modal_cont_detail_user'), closeDetail = get('close_detail_user');
    if (userModal && closeDetail) {
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", () => {
                fetch(`/ims/auth/users/get_user_by_user_ID.php?user_ID=${encodeURIComponent(btn.id.split("-")[1])}`)
                    .then(res => res.json())
                    .then(d => {
                        if (!d) return alert("User details not found.");
                        get("user_detail_id").value = d.user_ID || "";
                        get("user_detail_fullname").value = d.full_name || "";
                        get("user_detail_username").value = d.username || "";
                        get("user_detail_password").value = "";
                        ["role", "unit"].forEach(f => {
                            const s = get(`user_detail_${f}`);
                            Array.from(s.options).forEach(opt => opt.selected = opt.text === d[`${f}_name`]);
                        });

                        const toggleDetails = get("toggle_account_fields_details"),
                              detailRole = get("user_detail_role"),
                              detailUsername = get("user_detail_username"),
                              detailPassword = get("user_detail_password");
                        
                        if (d.username) {
                            // Has account
                            toggleDetails.checked = true;
                            toggleFields(toggleDetails, [detailRole, detailUsername], true);
                            toggleFields(toggleDetails, [detailPassword], false); // Password NOT required when editing
                        } else {
                            // No account
                            toggleDetails.checked = false;
                            toggleFields({checked:false}, [detailRole, detailUsername, detailPassword]);
                        }

                        toggleDetails.addEventListener("change", () => {
                            if (toggleDetails.checked) {
                                toggleFields(toggleDetails, [detailRole, detailUsername], true);
                                toggleFields(toggleDetails, [detailPassword], true);
                            } else {
                                toggleFields({checked:false}, [detailRole, detailUsername, detailPassword]);
                            }
                        });

                        userModal.classList.add("show");
                        document.body.style.overflow = "hidden";
                    })
                    .catch(() => alert("Error loading user details."));
            });
        });

        closeDetail.addEventListener("click", e => {
            e.preventDefault();
            userModal.classList.remove("show");
            document.body.style.overflow = "auto";
            setTimeout(() => location.reload(), 500);
        });
    }

    // Edit Form
    const detailForm = get("userDetailsForm");
    if (detailForm) {
        let initial = {};
        document.querySelectorAll('[data-open="details-modal"]').forEach(btn => btn.addEventListener("click", () => {
            ["role", "user_ID", "username", "password", "full_name", "user_unit"].forEach(k => initial[k] = get(`user_detail_${k}`)?.value || "");
        }));

        detailForm.addEventListener("submit", e => {
            e.preventDefault();
            const current = {};
            ["role", "user_ID", "username", "password", "full_name", "user_unit"].forEach(k => current[k] = get(`user_detail_${k}`)?.value || "");
            if (!Object.keys(current).some(k => current[k] !== initial[k])) return showPopup("No changes detected.", 'orange');

            fetch("/ims/auth/users/updateAuth.php", { method: "POST", body: new FormData(detailForm) })
                .then(res => res.text())
                .then(r => {
                    const resp = r.trim().toLowerCase();
                    showPopup(resp === "success" ? "Success!" : resp === "duplicate" ? "No changes detected." : r, resp === "success" ? "#005a34" : "orange");
                    if (resp === "success") initial = {...current};
                })
                .catch(() => showPopup('Something went wrong.', '#FF0000'));
        });
    }
});

// Start of delete users
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', () => {
            const user = button.getAttribute('data-user');
            if (!user) return;
            if (confirm(`Are you sure you want to delete user with User ID: ${user}?`)) {
                fetch('/ims/auth/users/deleteAuth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ user })
                })
                .then(res => res.text())
                .then(response => {
                    if (response.trim().toLowerCase() === 'success') {
                        showPopup('User successfully inactivated.', '#005a34');
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        showPopup('Error: ' + response, '#FF0000');
                    }
                })
                .catch(() => showPopup('Something went wrong.', '#FF0000'));
            }
        });
    });
});

// Field toggle handler
function toggleNewField(selectId, inputId, triggerValue) {
    const select = document.getElementById(selectId), input = document.getElementById(inputId);
    if (!select || !input) return console.warn(`Missing ${selectId} or ${inputId}`);
    const toggle = () => {
        const match = select.value === triggerValue;
        input.style.display = match ? "block" : "none";
        input.required = match;
        input.disabled = !match;
    };
    toggle();
    select.addEventListener("change", toggle);
}


document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("editModal");
    const modalTitle = document.getElementById("modalTitle");
    const form = document.getElementById("editForm");
    const responseDiv = document.getElementById("responseMessage");
    const entityTypeField = document.getElementById("entity_type");
    const idField = document.getElementById("entity_ID");
    const nameField = document.getElementById("entity_name");

    const openModal = () => {
        modal.classList.remove("hidden");
        setTimeout(() => modal.classList.add("show"), 10);
    };

    const closeModal = () => {
        modal.classList.remove("show");
        setTimeout(() => modal.classList.add("hidden"), 300);
    };

    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-edit")) {
            const { entity, id, name } = e.target.dataset;
            Object.assign(entityTypeField, { value: entity });
            Object.assign(idField, { value: id });
            Object.assign(nameField, { value: name });
            modalTitle.textContent = `Manage ${capitalize(entity.replace("_", " "))}`;
            responseDiv.textContent = "";
            openModal();
        }

        if (e.target.id === "close_ref") {
            closeModal();
            setTimeout(() => location.reload(), 500);
        }
    });

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            try {
                const res = await fetch("/ims/auth/reference/updateAuth.php", {
                    method: "POST",
                    body: new FormData(form)
                });
                const text = (await res.text()).trim().toLowerCase();
                const messages = {
                    success: ['Success!', '#005a34'],
                    duplicate: ['No changes detected.', 'orange']
                };
                showPopup(...(messages[text] || [text, '#FF0000']));
            } catch {
                showPopup("Something went wrong.", "error");
            }
        });
    }


// Start of delete reference

document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', () => {
        let type = '';
        let id = '';

        if (button.hasAttribute('data-role')) {
            type = 'role';
            id = button.getAttribute('data-role');
        } else if (button.hasAttribute('data-unit')) {
            type = 'unit';
            id = button.getAttribute('data-unit');
        } else if (button.hasAttribute('data-asset-type')) {
            type = 'asset_type';
            id = button.getAttribute('data-asset-type');
        } else if (button.hasAttribute('data-brand')) {
            type = 'brand';
            id = button.getAttribute('data-brand');
        }

        if (!type || !id) return;

        if (confirm(`Are you sure you want to delete this ${type.replace('_', ' ')}?`)) {
            const payload = new URLSearchParams({
                id,
                type
            });

            // Add specific field name required by backend
            payload.append(`${type}_ID`, id);
            
            fetch('/ims/auth/reference/deleteAuth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: payload
            })
            .then(res => res.text())
            .then(response => {
                if (response.trim().toLowerCase() === 'success') {
                    showPopup(`${type.replace('_', ' ')} successfully deleted.`, '#005a34');
                    setTimeout(() => location.reload(), 1500);
                } else {
                    showPopup('Error: ' + response, '#FF0000');
                }
            })
            .catch(() => showPopup('Something went wrong.', '#FF0000'));
        }
    });
});

});
