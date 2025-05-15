<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\asset\asset_handler.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['csv_file'])) {
    $tmpPath = $_FILES['csv_file']['tmp_name'];

    $importer = new ImportCSV();
    $result = $importer->importFromCSV($tmpPath);

    if ($result === true) {
        echo "CSV imported successfully!";
    } else {
        echo "Error: " . $result;
    }
    exit;
}

?>