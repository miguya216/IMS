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
            modalDetails.classList.remove("show");
            document.body.style.overflow = "auto";
        });
    } else {
        // ✅ [ADDED] Debugging message
        console.warn("modal_cont_details or close_details not found in DOM.");
    }
});
// end of asset edit button

// start of add item modal
document.addEventListener("DOMContentLoaded", function () {
    // ✅ [ADDED] Check if all required elements exist before attaching event listeners
    const addItemBtn = document.getElementById("addItemBtn");
    const modal = document.getElementById("modal_cont_add");
    const closeBtn = document.getElementById("close_add");
    const form = document.getElementById("addAssetForm");
    const messageDiv = document.getElementById("add_responseMessage");

    if (addItemBtn && modal && closeBtn && form && messageDiv) {
        // ✅ Show modal
        addItemBtn.addEventListener("click", () => {
            modal.classList.add("show");
            document.body.style.overflow = "hidden";

            // ✅ Initialize dynamic 'Add new...' fields
            toggleNewField("asset", "new_asset", "__new_asset_type__");
            toggleNewField("brand", "new_brand", "__new_brand__");
            toggleNewField("responsibleTo", "new_responsibleTo", "__new_responsibleTo__");
            toggleNewField("unit", "new_unit", "__new_unit__");
        });

        // ✅ Close modal
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("show");
            document.body.style.overflow = "auto";

            // Reset form and clear messages
            form.reset();
            messageDiv.textContent = "";

            // Hide all 'new' inputs
            document.getElementById("new_asset").style.display = "none";
            document.getElementById("new_brand").style.display = "none";
            document.getElementById("new_responsibleTo").style.display = "none";
            document.getElementById("new_unit").style.display = "none";

            setTimeout(() => {
                location.reload();
            }, 500);
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
    const closeBtn = document.getElementById('close_details');

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

        // ✅ Close modal logic
        closeBtn.addEventListener('click', () => {
            modal.classList.remove("show");
            document.body.style.overflow = "auto";

            // ✅ Reload page to refresh displayed table
            setTimeout(() => {
                location.reload();
            }, 500);
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

// // start of details modal
// document.addEventListener('DOMContentLoaded', () => {
//     console.log("JavaScript loaded");

//     const inventory = document.getElementById('inventory');
//     const modal = document.getElementById('modal_cont');
//     const closeModal = document.getElementById('close');
//     const buttons = document.querySelectorAll('[id^="edit-"]');

//     buttons.forEach(button => {
//         button.addEventListener('click', () => {
//             modal.classList.add('show');
//             if (inventory) inventory.style.display = 'none'; // Hide inventory
//         });
//     });

//     if (closeModal) {
//         closeModal.addEventListener('click', () => {
//             modal.classList.remove('show');
//             if (inventory) inventory.style.display = 'block'; // Show inventory again
//         });
//     } else {
//         console.error("Close button not found!");
//     }
// });

// // end of details modal


// start of details user modal
document.addEventListener('DOMContentLoaded', () => {
    console.log("JavaScript loaded");

    const inventory = document.getElementById('users');
    const modal = document.getElementById('modal_cont_detail_user');
    const closeModal = document.getElementById('close_user');
    const buttons = document.querySelectorAll('[id^="edit-"]');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.add('show');
            if (inventory) inventory.style.display = 'none'; // Hide inventory
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
            if (inventory) inventory.style.display = 'block'; // Show inventory again
        });
    } else {
        console.error("Close button not found!");
    }
});

// end of details user modal

// start of add user modal

document.addEventListener("DOMContentLoaded", function () {
    const addItemBtn = document.getElementById("addUserBtn");
    const modal = document.getElementById("modal_cont_add_user");
    const closeBtn = document.getElementById("close_add_user");

    addItemBtn.addEventListener("click", () => {
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
        document.body.style.overflow = "auto";
    });
});

// end of add user modal