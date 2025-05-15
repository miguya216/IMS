<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\login_auth.php';
session_start();

// Already logged in? Redirect to home
if (isset($_SESSION['account_ID'])) {
    $role = $_SESSION['role_ID'];

    if ($role == 1 || $role == 2) {
        header("Location: admin/home.php");
    } elseif ($role == 3) {
        header("Location: admin/borrower.php");
    } else {
        header("Location: login.php");
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Login</title>
  <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" />
  <script src="bootstrap/js/bootstrap.bundle.min.js"></script>

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
    }
    .logo-img {
      height: 60px;
      width: 60px;
      image-rendering: auto;
      -webkit-image-rendering: auto;
    }
    .header-container h4 {
      font-size: 18px;
      color: #007c4d;
    }
    .header-container p {
      font-size: 14px;
      color: #777;
    }
    .login-container {
      margin-top: 20px;
    }
    .input-box {
      margin-bottom: 20px;
      max-width: 100%;
    }
    .input-box input {
      width: 100%;
      padding: 12px 15px;
      font-size: 16px;
      border-radius: 5px;
      border: 1px solid #ccc;
      margin-top: 10px;
      transition: border-color 0.3s ease;
    }
    .input-box input:focus {
      border-color: #005a34;
      outline: none;
    }
    .remember-me {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      margin: 15px;
      flex-wrap: wrap;
    }
    .sign-up{
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin: 15px;
      flex-wrap: wrap;
    }
    input[type="checkbox"] {
      accent-color: #005a34;
    }

    .remember-me label {
      font-size: 16px;
      margin-bottom: 0;
      white-space: nowrap; 
    }
    .login-btn {
      background-color: #005a34;
      color: white;
      font-weight: bold;
      padding: 12px 0;
      border: none;
      border-radius: 5px;
      width: 100%;
      transition: background-color 0.3s ease;
    }
    .login-btn:hover {
      background-color: #2ecc71;
    }
    .error-message {
      height: 20px;
      color: #e74c3c;
      font-size: 18px;
      margin: 20px;
      text-align: center;
    }

    @media (max-width: 576px) {
      .body-container {
        padding: 20px;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="body-container">
    <div class="header-container">
      <h1><img src="admin\imgs\clarity.svg" alt="Box" class="logo-img"> CLARITY</h1>
      <h4>College Logistics Asset Registry & Inventory Tracking</h4>
      <p>Developed by the Institute of Mathematical Application and Sciences (IMACS) Kolehiyo ng Lungsod ng Dasmariñas</p>
    </div>
    <div class="login-container">

      <?php if (isset($_GET['registered']) && $_GET['registered'] == 1): ?>
        <div class="alert alert-success" role="alert">
          Registration successful! You can now log in.
        </div>
      <?php endif; ?>

      <form id="loginForm" method="POST">
      <div class="error-message">
          <?php if (isset($error)) echo "<span>$error</span>"; ?>
        </div>

        <div class="input-box">
          <input name="kld_email" type="email" class="form-control" placeholder="KLD EMAIL" required />
        </div>
        <div class="input-box">
          <input name="password" type="password" class="form-control" placeholder="PASSWORD" required />
        </div>
        <div  class="remember-me">
          <input type="checkbox" name="remember_me" id="remember_me" />
          <label for="remember_me">Remember Me</label>
        </div>
        <button type="submit" class="login-btn">Log In</button>
        <div class="sign-up">
          <a href="signup.php">Create an account</a>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
