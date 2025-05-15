<?php 
if (!defined('IN_APP')) {
    die("Access Denied");
}
function StatsOverview() { ?>

    <div class="card">
        <span class="card-title">Total Assets</span>
        <div class="card-content">
            <div id="total_assets"></div>
        </div>
    </div>

    <div class="card">
        <span class="card-title">Total Inactive Assets</span>
        <div class="card-content">
            <div id="inactive_assets"></div>
        </div>
    </div>

    <div class="card">
        <span class="card-title">Active Users</span>
        <div class="card-content">
            <div id="active_users"></div>
        </div>
    </div>

    <div class="card">
        <span class="card-title">Total Borrowed</span>
        <div class="card-content">
            <div id="borrowed_items"></div>
        </div>
    </div>

    <div class="card">
        <span class="card-title">Total Returned</span>
        <div class="card-content">
            <div id="returned_items"></div>
        </div>
    </div>

    <div class="card">
        <span class="card-title">Pending Request</span>
        <div class="card-content">
            <div id="pending_requests"></div>
        </div>
    </div>

    <div class="card">
        <span class="card-title">Total Messages</span>
        <div class="card-content">
            <div id="total_messages"></div>
        </div>
    </div>

<?php }
    
