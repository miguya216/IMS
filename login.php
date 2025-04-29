<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\login_auth.php';
session_start();

// Already logged in? Redirect to home
if (isset($_SESSION['account_ID'])) {
    header("Location: /ims/admin/home.php"); // or dynamic redirect based on role
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Login Page</title>
  <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" />
  <script src="bootstrap/js/bootstrap.bundle.min.js"></script>

  <style>
    body {
      background: linear-gradient(to bottom right, #005a34, #009708);
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      color: white;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px; /* spacing at top and sides */
      box-sizing: border-box;
    }
    .header-container {
      text-align: center;
      margin-bottom: 30px; /* space between header and form */
      padding: 0 10px;
    }
    .content-wrapper {
      width: 100%;
      max-width: 400px;
      text-align: center;
      margin-top: 100px;
    }

    h1 {
      font-size: 40px;
      margin-bottom: 10px;
    }

    p {
      font-size: 20px;
      margin-bottom: 30px;
    }

    .login-container {
      padding: 30px 25px;
      border-radius: 10px;
    }

    .input-box {
        margin: 0 auto 15px auto;
        max-width: 350px;
    }
    .input-box.remember-me {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        margin-top: 10px;
        margin-left: 10px;
        font-size: 16px;
      }


    .form-control {
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    .login-btn {
      background-color: #005a34;
      box-shadow: rgb(0, 0, 0);
      color: white;
      font-weight: bold;
      border: none;
      padding: 10px;
      width: 100%;
      border-radius: 5px;
      margin-top: 10px;
    }

    .login-btn:hover {
      background-color: #2ecc71;
      color: white;
    }
    .error-message {
      font-size: large;
      min-height: 24px; /* reserve space */
      margin-top: 10px;
      text-align: center;
      color:rgb(190, 0, 10);
      font-weight: bold;
    }

    .error-message span {
      display: inline-block;
      margin: 0;
      padding: 0;
    }

    @media (max-width: 576px) {
      .content-wrapper {
        margin-top: 10px;
      }
    }

  </style>
</head>
<body>
<div class="header-container">
  <h1>KLD's Inventory Revolution</h1>
  <p>Optimizing Inventory Management for Property, Procurement & Supply Unit</p>
</div>


    <div class="content-wrapper">
        <div class="login-container">
            <form id="loginForm" method="POST">
                <div class="input-box">
                    <input name="username" type="text" class="form-control" placeholder="USERNAME" required />
                </div>
                <div class="input-box">
                    <input name="password" type="password" class="form-control" placeholder="PASSWORD" required />
                </div>
                <div class="input-box remember-me">
                  <input type="checkbox" name="remember_me" id="remember_me" />
                  <label for="remember_me">Remember Me</label>
                </div>
                  <button type="submit" class="login-btn">Log In</button>
                <div class="error-message">
                  <?php if (isset($error)) echo "<span>$error</span>"; ?>
                </div>
                    
            </form>
        </div>
    </div>

</body>
</html>
