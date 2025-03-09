<?php 
if (!defined('IN_APP')) {
    die("Access Denied");
}
function StatsOverview(){ ?>

<div class="card">
        <div class="card-content">
            <h2>Total Inventory Items</h2>
            <div>
                <h3>1,250</h3>
                <p>Total assets in the college inventory.</p>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-content">
            <h2>Checked-Out Equipment</h2>
            <div>
                <h3>450</h3>
                <p>Items currently borrowed by faculty/staff.</p>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-content">
            <h2>Maintenance Requests</h2>
            <div>
                <h3>320</h3>
                <p>Pending repair or service requests.</p>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-content">
            <h2>Items Needing Replacement</h2>
            <div>
                <h3>120</h3>
                <p>Assets marked as non-functional and require replacement.</p>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-content">
            <h2>Recent Messages</h2>
            <div>
                <h3>15</h3>
                <p>New notifications from the admin.</p>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-content">
            <h2>Upcoming Expirations</h2>
            <div>
                <h3>50</h3>
                <p>Items reaching their end-of-life soon.</p>
            </div>
        </div>
    </div>

    </div>
</div>
<?php } ?>
