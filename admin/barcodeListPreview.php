<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/class/conn.php';

    $sql = "SELECT 
                a.inventory_tag, 
                a.serial_number, 
                at.asset_type, 
                b.brand_name, 
                br.barcode_image_path,
                qr.qr_image_path
            FROM asset a
            JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
            JOIN brand b ON a.brand_ID = b.brand_ID
            JOIN barcode br ON a.barcode_ID = br.barcode_ID
            JOIN qr_code qr ON a.qr_ID = qr.qr_ID";

    $stmt = $pdo->query($sql);
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Barcode List</title>
    <link rel="stylesheet" href="\ims\bootstrap\css\bootstrap.min.css">
    <script src="\ims\bootstrap\js\bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="\ims\css\style.css">
    <script src="script/html2pdf.bundle.min.js"></script>
</head>
<body class = "request-body">
    
<div class="d-flex justify-content-center align-items-center min-vh-100">
<div class="bg-light border rounded p-4" style="max-width: 700px; width: 100%;">
    <div class="text-left mt-4" style="margin-bottom: 40px;">
        <button onclick="downloadBarcodePDF()" class="btn btn-primary me-2">Download as PDF</button>
    </div>
<div id="barcodeContent">
    <h3 class="mb-4 text-center">Barcode List</h3>
    <div class="row mb-2 fw-bold border-bottom pb-2">
        <div class="col-sm-4 text-start">Barcode:</div>
        <div class="col-sm-8 text-start">Details:</div>
    </div>

    <?php while ($row = $stmt->fetch()) { ?>
        <div class="row mb-4 align-items-start border-bottom pb-3">
            <div class="col-sm-4">
                <img src="../barcodes/<?php echo htmlspecialchars(basename($row['barcode_image_path'])); ?>" alt="Barcode" style="max-width: 100%; margin-bottom: 10px">
                <img src="../qrcodes/<?php echo htmlspecialchars(basename($row['qr_image_path'])); ?>" alt="Barcode" style="max-width: 100%;">
            </div>
            <div class="col-sm-8">
                <p><strong>Tag:</strong> <?php echo htmlspecialchars($row['inventory_tag']); ?></p>
                <p><strong>Serial:</strong> <?php echo htmlspecialchars($row['serial_number']); ?></p>
                <p><strong>Type:</strong> <?php echo htmlspecialchars($row['asset_type']); ?></p>
                <p><strong>Brand:</strong> <?php echo htmlspecialchars($row['brand_name']); ?></p>
            </div>
        </div>
    <?php } ?>
</div>
    </div>
</div>
<script src="script/script.js"></script>
</body>
</html>