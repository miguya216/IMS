// Navbar
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

// start of inventory page content
let inventory = []; // Array to store inventory items
let editingIndex = -1; // To track which item is being edited

// Function to display the inventory table
function displayInventory() {
    const tableBody = document.querySelector("#inventoryTable tbody");
    tableBody.innerHTML = ""; // Clear the table

    inventory.forEach((item, index) => {
        const row = document.createElement("tr");

        // Create table data for item name and quantity
        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;
        const quantityCell = document.createElement("td");
        quantityCell.textContent = item.quantity;

        // Create action buttons (Edit, Delete)
        const actionsCell = document.createElement("td");
        actionsCell.innerHTML = `
            <button class="btn btn-warning btn-sm" onclick="editItem(${index})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteItem(${index})">Delete</button>
        `;

        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(actionsCell);
        tableBody.appendChild(row);
    });
}

// Add a new item to the inventory
// document.getElementById("addItemForm").addEventListener("submit", function (e) {
//     e.preventDefault();
//     const itemName = document.getElementById("itemName").value;
//     const itemQuantity = document.getElementById("itemQuantity").value;

//     if (itemName && itemQuantity) {
//         inventory.push({ name: itemName, quantity: itemQuantity });
//         displayInventory();
//         document.getElementById("addItemForm").reset();
//     }
// });

// // Edit an existing item
// function editItem(index) {
//     editingIndex = index;
//     const item = inventory[index];
//     document.getElementById("editItemName").value = item.name;
//     document.getElementById("editItemQuantity").value = item.quantity;
//     new bootstrap.Modal(document.getElementById("editItemModal")).show();
// }

// // Save the changes to an item
// document.getElementById("saveItemChanges").addEventListener("click", function () {
//     const itemName = document.getElementById("editItemName").value;
//     const itemQuantity = document.getElementById("editItemQuantity").value;

//     if (itemName && itemQuantity && editingIndex > -1) {
//         inventory[editingIndex] = { name: itemName, quantity: itemQuantity };
//         displayInventory();
//         new bootstrap.Modal(document.getElementById("editItemModal")).hide();
//     }
// });

// // Delete an item from the inventory
// function deleteItem(index) {
//     inventory.splice(index, 1);
//     displayInventory();
// }

// // Initial display of inventory
// displayInventory();

// end of inventory page content


// start of request page content
let requests = []; // Array to hold request data
let requestIndex = -1; // To track which request is being edited

// Function to display the request list
function displayRequests() {
    const tableBody = document.querySelector("#requestTable tbody");
    tableBody.innerHTML = ""; // Clear the table

    requests.forEach((request, index) => {
        const row = document.createElement("tr");

        // Create table data for item name, quantity, department, and status
        const nameCell = document.createElement("td");
        nameCell.textContent = request.name;
        const quantityCell = document.createElement("td");
        quantityCell.textContent = request.quantity;
        const departmentCell = document.createElement("td");
        departmentCell.textContent = request.department;
        const statusCell = document.createElement("td");
        statusCell.textContent = request.status;

        // Create action buttons (Approve, Reject)
        const actionsCell = document.createElement("td");
        actionsCell.innerHTML = `
            <button class="btn btn-success btn-sm" onclick="approveRequest(${index})">Approve</button>
            <button class="btn btn-danger btn-sm" onclick="rejectRequest(${index})">Reject</button>
        `;

        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(departmentCell);
        row.appendChild(statusCell);
        row.appendChild(actionsCell);
        tableBody.appendChild(row);
    });
}


// start of modal
document.addEventListener('DOMContentLoaded', () => {
    console.log("JavaScript loaded");

    const inventory = document.getElementById('inventory');
    const modal = document.getElementById('modal_cont');
    const closeModal = document.getElementById('close');
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

// end of modal