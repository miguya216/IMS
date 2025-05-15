<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\uni_fetch.php';
   require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';
    $fetcher = new DataFetcher();
    $brands = $fetcher->getAllBrandsWithAsset();
    $units = $fetcher->getAllUnits();
    $users = $fetcher->getAllUsers(); 
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
    <div id="notifModal" class="notif-modal">
        <div id="responseMessage"></div>
    </div>
    <h3 class="mb-4 text-center">EQUIPMENT RESERVATION FORM</h3>

    <form id="requestForm">
      <!-- Text Input -->
      <div class="row mb-3 align-items-center">
        <label for="borrower" class="col-sm-3 col-form-label text-start">KLD ID</label>
        <div class="col-sm-9">
          <input type="text" value="<?= htmlspecialchars($_SESSION['kld_ID']) ?>"  class="form-control" id="request_kld_id" name="request_kld_id" readonly>
        </div>
      </div>

      <div class="row mb-3 align-items-center">
        <label for="borrower" class="col-sm-3 col-form-label text-start">KLD email</label>
        <div class="col-sm-9">
          <input type="text" value="<?= htmlspecialchars($_SESSION['kld_email']) ?>" class="form-control" id="request_kld_email" name="request_kld_email" readonly>
        </div>
      </div>

      <div class="row mb-3 align-items-center">
      <label for="asset" class="col-sm-3 col-form-label text-start">Item Description</label>
      <div class="col-sm-9">
        <select name="request_brand_ID" class="form-select" id="brand_ID" required>
          <option value="" selected disabled>Select Item Description</option>
          <?php foreach ($brands as $brand): ?>
            <option value="<?= htmlspecialchars($brand['brand_ID']) ?>">
              <?= htmlspecialchars($brand['brand_name'] . ' / ' . $brand['asset_type']) ?>
            </option>
          <?php endforeach; ?>
        </select>
      </div>
    </div>

    <div class="row mb-3 align-items-center">
        <label for="UOM" class="col-sm-3 col-form-label text-start">UOM:</label>
        <div class="col-sm-9">
          <input type="text" class="form-control" id="request_UOM" name="request_UOM" placeholder="Enter UOM" required>
        </div>
      </div>
    
      <!-- Number Input -->
      <div class="row mb-3 align-items-center">
        <label for="quantity" class="col-sm-3 col-form-label text-start">Quantity</label>
        <div class="col-sm-9">
          <input type="number" class="form-control" id="request_quantity" name="request_quantity" placeholder="Enter quantity" required>
        </div>
      </div>

    <div class="row mb-3 align-items-center">
          <label for="purpose" class="col-sm-3 col-form-label text-start">Purpose:</label>
            <div class="col-sm-9">
              <textarea type="textarea" class="form-control" id="request_purpose" name="request_purpose" placeholder="Enter purpose" required></textarea>
            </div>
    </div>
        <div class="text-center">
          <button type="submit" id="request_submit" class="btn">Submit Request</button>
          <button type="button" class="btn" onclick="history.back()">Back</button>
        </div>
    </form>
  </div>
</div>
</body>
<script src="script/requestForm.js"></script>
</html>