document.addEventListener('DOMContentLoaded', function () {
    
    const barcodeInput = document.getElementById('barcode_input');
    let buffer = '';
    let timer = null;

    // Ensure input is always focused
    barcodeInput.focus();
    document.addEventListener('click', () => barcodeInput.focus());
    document.addEventListener('keydown', () => barcodeInput.focus());

    document.addEventListener('keydown', function (e) {
        if (timer) clearTimeout(timer);

        if (e.key === 'Enter') {
            const barcode = buffer.trim();
            buffer = ''; // reset buffer

            if (barcode !== "") {
                fetch('../class/get_details_by_barcode.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        barcode_path: barcode
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('barcodeImg_b').src = "../" + (data.asset.barcode_image_path || 'barcodes/placeholder.png');
                        document.getElementById('qrCodeImg_b').src = "../" + (data.asset.qr_image_path || 'qrcodes/placeholder.png');
                        document.getElementById('detail_tag_b').value = data.asset.inventory_tag || '';
                        document.getElementById('detail_serial_b').value = data.asset.serial_number || '';
                        document.getElementById('detail_asset_b').value = data.asset.asset_type || '';
                        document.getElementById('detail_brand_b').value = data.asset.brand || '';
                        document.getElementById('detail_responsible_b').value = data.asset.responsible_user || '';
                        document.getElementById('detail_unit_b').value = data.asset.unit || '';

                        // Show modal
                        document.getElementById('barcode_details').classList.add('show');
                    } else {
                        alert('Asset not found.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching asset details:', error);
                    alert('An error occurred while fetching the asset details.');
                });
            }
        } else {
            buffer += e.key;
            timer = setTimeout(() => {
                buffer = '';
            }, 500); // reset if idle too long
        }
    });

    // Close modal button
    const closeBtn = document.getElementById('close_bc_details');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            document.getElementById('barcode_details').classList.remove('show');
        });
    }
});
