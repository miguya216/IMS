<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Borrower Page</title>
  <script src="\ims\bootstrap\js\bootstrap.bundle.min.js"></script>
  <link rel="stylesheet" href="\ims\bootstrap\css\bootstrap.min.css">

  <style>
  body {
    background: linear-gradient(to bottom right, #005a34, #006705);
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    color: #333;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 20px;
    box-sizing: border-box;
  }

  .body-container {
    width: 100%;
    max-width: 500px;
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .header-container {
    margin-bottom: 30px;
  }

  .header-container h1 {
    font-size: 40px;
    color: #005a34;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .logo-img {
    height: 60px;
    width: 60px;
  }

  .header-container h4 {
    font-size: 18px;
    color: #007c4d;
  }

  .header-container p {
    font-size: 14px;
    color: #777;
  }

  .brw-container {
    margin-top: 20px;
  }

  /* Notification Modal Base Style */
.notif-modal {
    width: auto;
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    background: rgb(235, 235, 235);
    padding: 40px 50px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 9998;
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}
.modal-image {
    border-radius: 80px;
    width: 120px;
    height: auto;
    margin-bottom: 10px;
}
/* Smooth bounce + fade in */
@keyframes fadeBounceIn {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }
    50% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1.05);
    }
    75% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(0.98);
    }
    100% {
        transform: translate(-50%, -50%) scale(1);
    }
}

/* Show state with fadeBounceIn animation */
.notif-modal.show {
    display: block;
    opacity: 1;
    pointer-events: auto;
    animation: fadeBounceIn 0.45s ease forwards;
}


  .brw-select {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  }

  .brw-btn {
    background-color: #005a34;
    color: white;
    font-weight: 600;
    font-size: 16px;
    padding: 12px;
    border: none;
    border-radius: 8px;
    text-decoration: none;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .brw-btn:hover {
    background-color: #2ecc71;
    transform: scale(1.02);
  }

  @media (max-width: 576px) {
    .body-container {
      padding: 20px;
    }
  }
</style>
</head>
<body>
<div id="confirmModal" class="notif-modal">
<!-- <img class="modal-image" src="imgs/mita.gif" alt="mita"> -->
<div id="confirmationMessage"></div>
    <div style="margin-top: 10px;">
        <button class="brw-btn" id="confirmYes">Yes</button>
        <button class="brw-btn" id="confirmNo">No</button>
    </div>
</div>
  <div class="body-container">
    <div class="header-container">
      <h3>Welcome to</h3>
      <h1><img src="imgs\clarity.svg" alt="Box" class="logo-img">CLARITY</h1>
      <h3>Mr. <?= htmlspecialchars($_SESSION['full_name']) ?></h3>
    </div>

    <div class="brw-container">
        <div class="brw-select">
            <a href="requestForm.php" class="brw-btn">Create Request</a>
            <a href="receipt.php" class="brw-btn">Scan QR Code to Access Your Receipt</a>
            <a href="../logout.php" class="brw-btn" id="logoutLink">Log Out</a>
        </div>
    </div>
  </div>
  <script src="script/script.js"></script>
</body>
</html>
