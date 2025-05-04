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

// start of dynamic populate filter
document.addEventListener("DOMContentLoaded", function () {
    const mainFilter = document.getElementById("mainFilter");
    const subFilter = document.getElementById("subFilter");

    // Function to initialize filtering when the table is visible
    function initializeTableFiltering() {
        const table = document.querySelector(".filterable-table");
        if (!table) return; // Return early if the table is not found

        const rows = table.querySelectorAll("tbody tr");

        mainFilter.addEventListener("change", () => {
            const colIndex = parseInt(mainFilter.value, 10);
            subFilter.innerHTML = `<option value="">Select a value</option>`;
            subFilter.disabled = true;

            if (!isNaN(colIndex)) {
                const uniqueValues = new Set();
                rows.forEach(row => {
                    const text = row.cells[colIndex].textContent.trim();
                    if (text) uniqueValues.add(text);
                });

                [...uniqueValues].sort().forEach(val => {
                    const option = document.createElement("option");
                    option.value = val;
                    option.textContent = val;
                    subFilter.appendChild(option);
                });

                subFilter.disabled = false;
            }
        });

        subFilter.addEventListener("change", () => {
            const colIndex = parseInt(mainFilter.value, 10);
            const selected = subFilter.value.toLowerCase();

            rows.forEach(row => {
                const cellText = row.cells[colIndex].textContent.toLowerCase();
                row.style.display = !selected || cellText === selected ? "" : "none";
            });
        });
    }

    // You could trigger this initialization when the table tab is shown (if using tabbed navigation)
    const tableTab = document.getElementById("tableTab"); // Assume you have an ID for the tab with the table

    // Example: Listen for tab change event if using Bootstrap tabs or similar
    if (tableTab) {
        tableTab.addEventListener("shown.bs.tab", () => {
            initializeTableFiltering();
        });
    } else {
        // If not using tabs, you can simply initialize the filter on DOMContentLoaded
        initializeTableFiltering();
    }
});

// end of dynamic populate filter

// start of request form tab
function openRequestForm(){
    window.open('/ims/admin/requestForm.php', 'KLD IMS | Request Form');
}
// end of request form tab

// start of barcode tab
function openBarcode(){
    window.open('/ims/admin/barcodeListPreview.php', 'Barcode List');
}

function downloadBarcodePDF() {
    // Clone the content without scroll
    const original = document.getElementById('barcodeContent');
    const clone = original.cloneNode(true);

    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-10000px';
    container.appendChild(clone);
    document.body.appendChild(container);

    // Generate PDF from the clone
    const opt = {
        margin:       0.5,
        filename:     'Barcode_List.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(clone).save().then(() => {
        // Clean up
        document.body.removeChild(container);
    });
}
// end of barcode tab

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
            toggleNewField("responsibleTo", "new_responsibleTo_f", "__new_responsibleTo__");
            toggleNewField("responsibleTo", "new_responsibleTo_m", "__new_responsibleTo__" , false);
            toggleNewField("responsibleTo", "new_responsibleTo_l", "__new_responsibleTo__");
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

function toggleNewField(selectId, inputId, triggerValue = true) {
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
                .then(response => {
                    if (response.status === 'success') {
                            const data = response.data;
                            document.getElementById("qrCodeImg").src = '/ims/' + data.qr_path;
                            document.getElementById("barcodeImg").src = '/ims/' +  data.barcode_path;
                    
                            document.getElementById("detail_tag").value = data.inventory_tag;
                            document.getElementById("detail_serial").value = data.serial_number;
                    
                            document.getElementById("detail_asset").value = data.asset_type_ID;
                            document.getElementById("detail_brand").value = data.brand_ID;
                            document.getElementById("detail_responsible").value = data.responsible_user;
                            document.getElementById("detail_unit").value = data.unit_ID;
                    
                            captureInitialDetails();
                            modalDetails.classList.add("show");
                            document.body.style.overflow = "hidden";
                        } else {
                            alert(response.message || "Asset details not found.");
                        }
                    })
                    .catch((err) => { console.error("Fetch error:", err);
                    alert("Error loading asset details.");})
            });
        });

        closeDetails.addEventListener("click", () => handleModalClose("modal_cont_details", { reloadAfter: 500 }));
    }
});

// Start of asset details modal
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

    const toggleFields = (toggle, className = "account-field", forceRequired = true) => {
        const show = toggle.checked;
        document.querySelectorAll(`.${className}`).forEach(box => {
            box.style.display = show ? "flex" : "none";
            box.querySelectorAll("input, select").forEach(input => {
                input.disabled = !show;
                input.required = forceRequired && show;
            });
        });
    };
    
    const addUserBtn = get("addUserBtn"),
          modalAdd = get("modal_cont_add_user"),
          closeAdd = get("close_add_user"),
          addUserForm = get("addUserForm"),
          toggleAccount = get("toggle_account_fields");
    
    if (addUserBtn && modalAdd && closeAdd && addUserForm && toggleAccount) {
        toggleFields(toggleAccount);
    
        toggleAccount.addEventListener("change", () => toggleFields(toggleAccount));
    
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
                if (el) Object.assign(el.style, { display: "none" }), el.disabled = true, el.required = false;
            });
            toggleAccount.checked = false;
            toggleFields({ checked: false });
            setTimeout(() => location.reload(), 500);
        });
    
        addUserForm.addEventListener("submit", e => {
            e.preventDefault();
            const data = new FormData(addUserForm);
            if (!toggleAccount.checked) ["role", "kld_id", "kld_email", "password"].forEach(k => data.set(k, ""));
            fetch('/ims/auth/users/InsertAuth.php', { method: 'POST', body: data })
                .then(res => res.text())
                .then(res => showPopup(
                    res.trim().toLowerCase() === "success" ? "User successfully added." : res,
                    res.trim().toLowerCase() === "success" ? "#005a34" : "#FF0000"
                ))
                .catch(() => showPopup('Something went wrong.', '#FF0000'));
        });
    }

    const userModal = document.getElementById('modal_cont_detail_user');
    const closeDetail = document.getElementById('close_detail_user');
    if (userModal && closeDetail) {
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", () => {
                fetch(`/ims/auth/users/get_user_by_user_ID.php?user_ID=${encodeURIComponent(btn.id.split("-")[1])}`)
                    .then(res => res.json())
                    .then(d => {
                        if (!d) return alert("User details not found.");
                        // Set user details into modal
                        document.getElementById("user_detail_user_ID").value = d.user_ID || "";
                        document.getElementById("user_detail_kld_ID").value = d.kld_ID || "";
                        document.getElementById("user_detail_f_name").value = d.f_name || "";
                        document.getElementById("user_detail_m_name").value = d.m_name || "";
                        document.getElementById("user_detail_l_name").value = d.l_name || "";
                        document.getElementById("user_detail_kld_email").value = d.kld_email || "";
                        document.getElementById("user_detail_password").value = "";
                        

                        // Populate select fields (role, unit)
                        ["role", "unit"].forEach(f => {
                            const s = get(`user_detail_${f}`);
                            Array.from(s.options).forEach(opt => opt.selected = opt.text === d[`${f}_name`]);
                        });

                        const toggleDetails = get("toggle_account_fields_details"),
                            detailRole = get("user_detail_role"),
                            detailUsername = get("user_detail_kld_email"),
                            detailPassword = get("user_detail_password");

                        const toggleAccountFields = (enabled, passwordRequired = true) => {
                            // Toggle visibility and enable/disable fields
                            [detailRole, detailUsername].forEach(f => {
                                const wrapper = f.closest(".account-field") || f.parentElement;
                                if (wrapper) wrapper.style.display = enabled ? "flex" : "none";
                                f.disabled = !enabled;
                                f.required = enabled;
                            });

                            const pwdWrapper = detailPassword.closest(".account-field") || detailPassword.parentElement;
                            if (pwdWrapper) pwdWrapper.style.display = enabled ? "flex" : "none";
                            detailPassword.disabled = !enabled;
                            detailPassword.required = enabled && passwordRequired;
                        };

                        // If user has account details (role, email), show account fields
                        const hasAccount = d.kld_email && d.role_name;
                        if (hasAccount) {
                            toggleDetails.checked = true; // Checkbox on
                            toggleAccountFields(true, false); // Account fields enabled, password not required
                        } else {
                            toggleDetails.checked = false; // Checkbox off
                            toggleAccountFields(false); // Account fields hidden
                        }

                        // Toggle the account fields visibility when checkbox is changed
                        toggleDetails.addEventListener("change", () => {
                            if (toggleDetails.checked) {
                                toggleAccountFields(true, true); // Password required when checkbox is checked
                            } else {
                                toggleAccountFields(false); // Hide account fields when unchecked
                            }
                        });
                        captureInitialUserDetails();
                        // Show modal
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
});

// Start of user details modal form submission
let initialUserDetails = {};
function captureInitialUserDetails() {
    initialUserDetails = {
        user_ID: document.getElementById('user_detail_user_ID').value,
        kld_ID: document.getElementById('user_detail_kld_ID').value,
        f_name: document.getElementById('user_detail_f_name').value,
        m_name: document.getElementById('user_detail_m_name').value,
        l_name: document.getElementById('user_detail_l_name').value,
        kld_email: document.getElementById('user_detail_kld_email').value,
        role: document.getElementById('user_detail_role').value,
        unit: document.getElementById('user_detail_unit').value,
        password: document.getElementById("user_detail_password").value
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const formUpdateUser = document.getElementById('userDetailsForm');

    if (formUpdateUser) {
        formUpdateUser.addEventListener('submit', function (e) {
            e.preventDefault();
            const currentU = {
                user_ID: document.getElementById('user_detail_user_ID').value,
                kld_ID: document.getElementById('user_detail_kld_ID').value,
                f_name: document.getElementById('user_detail_f_name').value,
                m_name: document.getElementById('user_detail_m_name').value,
                l_name: document.getElementById('user_detail_l_name').value,
                kld_email: document.getElementById('user_detail_kld_email').value,
                role: document.getElementById('user_detail_role').value,
                unit: document.getElementById('user_detail_unit').value,
                password: document.getElementById("user_detail_password").value
            };

            const changed = Object.keys(currentU).some(key => currentU[key] !== initialUserDetails[key]);
            if (!changed) return showPopup("No changes detected.", 'orange');

            const formData = new FormData(formUpdateUser);
            fetch('/ims/auth/users/updateAuth.php', { method: 'POST', body: formData })
                .then(res => res.text())
                .then(response => {
                    console.log(response); // Log the response from the backend
                    showPopup(response.trim().toLowerCase() === "success" ? 'Success!' : response, response.trim().toLowerCase() === "success" ? '#005a34' : '#FF0000');
                })
                .catch(() => showPopup('Something went wrong.', '#FF0000'));
        });

        // Capture initial user details on modal open
        document.querySelectorAll('[data-open="user-details-modal"]').forEach(button => {
            button.addEventListener('click', () => captureInitialUserDetails());
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

// // Field toggle handler
// function toggleNewField(selectId, inputId, triggerValue) {
//     const select = document.getElementById(selectId), input = document.getElementById(inputId);
//     if (!select || !input) return console.warn(`Missing ${selectId} or ${inputId}`);
//     const toggle = () => {
//         const match = select.value === triggerValue;
//         input.style.display = match ? "block" : "none";
//         input.required = match;
//         input.disabled = !match;
//     };
//     toggle();
//     select.addEventListener("change", toggle);
// }


// document.addEventListener("DOMContentLoaded", () => {
//     const modal = document.getElementById("editModal");
//     const modalTitle = document.getElementById("modalTitle");
//     const form = document.getElementById("editForm");
//     const responseDiv = document.getElementById("responseMessage");
//     const entityTypeField = document.getElementById("entity_type");
//     const idField = document.getElementById("entity_ID");
//     const nameField = document.getElementById("entity_name");

//     const openModal = () => {
//         modal.classList.remove("hidden");
//         setTimeout(() => modal.classList.add("show"), 10);
//     };

//     const closeModal = () => {
//         modal.classList.remove("show");
//         setTimeout(() => modal.classList.add("hidden"), 300);
//     };

//     const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

//     document.addEventListener("click", (e) => {
//         if (e.target.classList.contains("btn-edit")) {
//             const { entity, id, name } = e.target.dataset;
//             Object.assign(entityTypeField, { value: entity });
//             Object.assign(idField, { value: id });
//             Object.assign(nameField, { value: name });
//             modalTitle.textContent = `Manage ${capitalize(entity.replace("_", " "))}`;
//             responseDiv.textContent = "";
//             openModal();
//         }

//         if (e.target.id === "close_ref") {
//             closeModal();
//             setTimeout(() => location.reload(), 500);
//         }
//     });

//     if (form) {
//         form.addEventListener("submit", async (e) => {
//             e.preventDefault();
//             try {
//                 const res = await fetch("/ims/auth/reference/updateAuth.php", {
//                     method: "POST",
//                     body: new FormData(form)
//                 });
//                 const text = (await res.text()).trim().toLowerCase();
//                 const messages = {
//                     success: ['Success!', '#005a34'],
//                     duplicate: ['No changes detected.', 'orange']
//                 };
//                 showPopup(...(messages[text] || [text, '#FF0000']));
//             } catch {
//                 showPopup("Something went wrong.", "error");
//             }
//         });
//     }


// // Start of delete reference

// document.querySelectorAll('.btn-delete').forEach(button => {
//     button.addEventListener('click', () => {
//         let type = '';
//         let id = '';

//         if (button.hasAttribute('data-role')) {
//             type = 'role';
//             id = button.getAttribute('data-role');
//         } else if (button.hasAttribute('data-unit')) {
//             type = 'unit';
//             id = button.getAttribute('data-unit');
//         } else if (button.hasAttribute('data-asset-type')) {
//             type = 'asset_type';
//             id = button.getAttribute('data-asset-type');
//         } else if (button.hasAttribute('data-brand')) {
//             type = 'brand';
//             id = button.getAttribute('data-brand');
//         }

//         if (!type || !id) return;

//         if (confirm(`Are you sure you want to delete this ${type.replace('_', ' ')}?`)) {
//             const payload = new URLSearchParams({
//                 id,
//                 type
//             });

//             // Add specific field name required by backend
//             payload.append(`${type}_ID`, id);
            
//             fetch('/ims/auth/reference/deleteAuth.php', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 },
//                 body: payload
//             })
//             .then(res => res.text())
//             .then(response => {
//                 if (response.trim().toLowerCase() === 'success') {
//                     showPopup(`${type.replace('_', ' ')} successfully deleted.`, '#005a34');
//                     setTimeout(() => location.reload(), 1500);
//                 } else {
//                     showPopup('Error: ' + response, '#FF0000');
//                 }
//             })
//             .catch(() => showPopup('Something went wrong.', '#FF0000'));
//         }
//     });
// });

// });
