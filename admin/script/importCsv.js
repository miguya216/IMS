// Show popup modal with message or loading
function showImportPopup(message = '', isLoading = false) {
    const notifModal = document.getElementById('ImportnotifModal');
    const notifMessage = document.getElementById('ImportresponseMessage');
    const loadingGif = document.getElementById('ImportloadingGif');
    const closeBtn = document.getElementById('ImportnotifCloseBtn');

    notifMessage.textContent = message;
    notifMessage.style.color = isLoading ? '#000' : '#005a34';

    loadingGif.style.display = isLoading ? 'inline-block' : 'none';
    closeBtn.style.display = isLoading ? 'none' : 'inline-block';

    notifModal.style.display = 'block';
    void notifModal.offsetWidth;
    notifModal.classList.add('show');

    closeBtn.onclick = () => {
        notifModal.classList.remove('show');
        setTimeout(() => {
            notifModal.style.display = 'none';
            location.reload(); // reload page on close
        }, 300);
    };
}

// Trigger file input
function importCsvFile() {
    document.getElementById('csvFileInput').click();
}

// On file selection
document.getElementById('csvFileInput').addEventListener('change', () => {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('csv_file', file);

    showImportPopup('Importing CSV file...', true); // show loading with GIF

    fetch('/ims/auth/asset/CVSimportAuth.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        showImportPopup(result, false); // show success message
    })
    .catch(error => {
        console.error('Error:', error);
        showImportPopup('Failed to import CSV.', false); // show error message
    })
    .finally(() => {
        document.getElementById('csvFileInput').value = ''; // reset input
    });
});
