document.addEventListener("DOMContentLoaded", () => {
    const barcodeInput = document.getElementById("barcodeInput");

    // Always keep input focused
    function keepFocus() {
        if (document.activeElement !== barcodeInput) {
            barcodeInput.focus();
        }
    }

    keepFocus();

    document.addEventListener("click", keepFocus);
    document.addEventListener("keydown", (e) => {
        keepFocus();

        if (e.key === "Enter" && barcodeInput.value.trim() !== "") {
            const scannedValue = barcodeInput.value.trim();
            fetchBarcodeItem(scannedValue);
            barcodeInput.value = "";
        }
    });
});

function fetchBarcodeItem(barcodeValue) {
    fetch('../class/fetchItemByBarcode.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `barcode=${encodeURIComponent(barcodeValue)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const container = document.getElementById("BarcodeItemContainer");

            const itemHTML = `
                <div class="row mb-2">
                    <div class="col-sm-4">
                        <img src="/ims/${data.barcode_image}" alt="Barcode" class="img-fluid" style="max-height: 60px;">
                    </div>
                    <div class="col-sm-8">
                        <strong>Brand:</strong> ${data.brand}<br>
                        <strong>Responsible:</strong> ${data.responsible}
                    </div>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', itemHTML);
        } else {
            alert(data.message || "Item not found.");
        }
    })
    .catch(err => {
        console.error("Fetch error:", err);
    });
}
