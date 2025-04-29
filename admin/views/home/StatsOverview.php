<?php 
if (!defined('IN_APP')) {
    die("Access Denied");
}
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\admin\views\home\getdata.php';
function StatsOverview() { ?>
<div class="card-container">
    <div class="card">
        <span>Total Assets</span>
        <div class="card-content">
            <div id="stat-total-assets"></div>
        </div>
    </div>

    <div class="card">
        <span>Active/Inactive Assets</span>
        <div class="card-content">
            <div id="stat-asset-status"></div>
        </div>
    </div>

    <div class="card">
        <span>Total Units</span>
        <div class="card-content">
            <div id="stat-users-unit"></div>
        </div>
    </div>
</div>


<!-- Link the external JS -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="/IMS/admin/script/stats.js"></script>
<?php }
    
