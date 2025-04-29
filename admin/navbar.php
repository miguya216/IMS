
<!-- Notification Modal -->
<div id="notifModal" class="notif-modal">
    <div id="responseMessage"></div>
</div>

  <nav> 
  <div class="content">
    <ul class="sidebar shrink">
        
        <li>
            <button id="menu-btn">
                <img src="imgs\menu-btn.png" alt="Menu" width="30">
            </button>
        </li>

        <li class="sidebar-header">
            <span class="sidebar-title"><?= htmlspecialchars($_SESSION['full_name']) ?></span>
        </li>
        
        <li>
            <a href="home.php">
                <img src="imgs/home.png" alt="Home" class="nav-icon"> 
                <span>Home</span>
            </a>
        </li>
        <li>
            <a href="InventoryList.php">
                <img src="imgs/list.png" alt="Assets" class="nav-icon">
                <span>Assets</span>
            </a>
        </li>
         <li>
            <a href="users.php">
                <img src="imgs/user.png" alt="users" class="nav-icon">
                <span>Users</span>
            </a>
        </li>
        <li>
            <a href="reference.php">
                <img src="imgs/reference.png" alt="reference" class="nav-icon">
                <span>Reference Data</span>
            </a>
        </li>
        <li>
            <a href="#">
                <img src="imgs/request.png" alt="Request" class="nav-icon">
                <span>Request</span>
            </a>
        </li>
        <li>
            <a href="#">
                <img src="imgs/borrowed.png" alt="Borrow" class="nav-icon">
                <span>Borrow</span>
            </a>
        </li>

        <li>
            <a href="../logout.php" class="logout-link">
                <img src="imgs/logout.png" alt="Logout" class="nav-icon">
                <span>Logout</span>
            </a>
        </li>
    </ul>
    </div>
</nav>
 