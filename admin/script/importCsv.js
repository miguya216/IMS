function importCsvFile() {
    // Create a file input element to trigger file selection
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";

    fileInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("csv_file", file);

            // Send the file to the backend via AJAX (fetch API)
            fetch('import_csv.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('CSV data imported successfully.');
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                alert('An error occurred: ' + error);
            });
        }
    });

    fileInput.click();  // Trigger the file selection dialog
}
