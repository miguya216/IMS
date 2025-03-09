<?php
include ('controller/login.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
    <script src="bootstrap/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="css/login_style.css">
</head>
<body class="login-page">
    <div class="container-fluid">
        <div class="row g-0 vh-100">
            <!-- Image Section -->
            <div class="col-7 image-section d-flex justify-content-center align-items-center">
                <div class="title-container text-center text-white">
                    <h1 class="fw-bold">KLD's Inventory Revolution</h1>
                    <p class="fs-5">Optimizing Inventory Management for Property, Procurement & Supply Unit</p>
                </div>
            </div>
    
            <!-- Login Form Section -->
            <div class="col-5 gradient-section d-flex justify-content-center align-items-center">
                <div class="card p-4 shadow-lg w-100">
                    <h3 class="text-center mb-3">Login</h3>
                    <form id="loginForm" method="POST">
                        <div class="mb-3">
                            <label for="email" class="form-label">Username</label>
                            <input name = "username" type="email" class="form-control" id="email" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input name = "password" type="password" class="form-control" id="password" required>
                        </div>
                        <button type="submit" class="btn">Login</button>
                        <?php if (isset($error)) echo "<p>$error</p>"; ?>
                    </form>
                </div>
            </div>
        </div>
    </div>
    

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="script/script.js"></script>
</body>
</html>
