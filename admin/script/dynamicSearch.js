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
