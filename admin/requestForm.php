<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\uni_fetch.php';
    $fetcher = new DataFetcher();
    $assetTypes = $fetcher->getAllAssetTypes();
    $brands = $fetcher->getAllBrands();
    $units = $fetcher->getAllUnits();
    $users = $fetcher->getAllUsers(); // for Responsible To
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KLD IMS | Request Form</title>
    <link rel="stylesheet" href="\ims\bootstrap\css\bootstrap.min.css">
    <script src="\ims\bootstrap\js\bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="\ims\css\style.css">
</head>
<body class = "request-body">

<div class="d-flex justify-content-center align-items-center min-vh-100">
  <div class="bg-light border rounded p-4" style="max-width: 700px; width: 100%;">
    <h3 class="mb-4 text-center">EQUIPMENT RESERVATION FORM</h3>

    <form>
      <!-- Text Input -->
      <div class="row mb-3 align-items-center">
        <label for="borrower" class="col-sm-3 col-form-label text-start">Borrower's Name</label>
        <div class="col-sm-9">
          <input type="text" class="form-control" id="borrower" name="borrower"placeholder="Enter borrower's name" required>
        </div>
      </div>

      <!-- Date Input -->
      <div class="row mb-3 align-items-center">
        <label for="date" class="col-sm-3 col-form-label text-start">Date:</label>
        <div class="col-sm-9">
          <input type="date" class="form-control" id="date" name="date" required>
        </div>
      </div>

      <!-- Date Input -->
      <div class="row mb-3 align-items-center">
        <label for="time" class="col-sm-3 col-form-label text-start">Time:</label>
        <div class="col-sm-9">
          <input type="time" class="form-control" id="time" name="time" require>
        </div>
      </div>

      <div class="row mb-3 align-items-center">
        <label for="purpose" class="col-sm-3 col-form-label text-start">Purpose:</label>
        <div class="col-sm-9">
          <textarea type="textarea" class="form-control" id="purpose" name="purpose" placeholder="Enter purpose" required></textarea>
        </div>
      </div>


        <!-- Select Dropdown -->
      <div class="row mb-3 align-items-center">
      <label for="asset" class="col-sm-3 col-form-label text-start">Item Description</label>
      <div class="col-sm-9">
        <select class="form-select" id="asset" required>
        <option value="" selected disabled>Select Item Description</option>
        <?php foreach ($assetTypes as $type): ?>
            <option value="<?= htmlspecialchars($type['asset_type']) ?>">
                <?= htmlspecialchars($type['asset_type']) ?>
            </option>
        <?php endforeach; ?>
        </select>
      </div>
    </div>

    <div class="row mb-3 align-items-center">
        <label for="UOM" class="col-sm-3 col-form-label text-start">UOM:</label>
        <div class="col-sm-9">
          <input type="text" class="form-control" id="UOM" placeholder="Enter UOM" required>
        </div>
      </div>
    
      <!-- Number Input -->
      <div class="row mb-3 align-items-center">
        <label for="quantity" class="col-sm-3 col-form-label text-start">Quantity</label>
        <div class="col-sm-9">
          <input type="number" class="form-control" id="quantity" placeholder="Enter quantity" required>
        </div>
      </div>

        <div class="text-center">
          <button type="submit" class="btn">Submit Request</button>
        </div>
      
    </form>
  </div>
</div>

</body>
</html>