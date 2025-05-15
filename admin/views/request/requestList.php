<?php 
if (!defined('IN_APP')) {
die("Access Denied");
}
function requestList(){ 
    require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\fetch_data.php';
    global $pdo; 
    $Request = new Request($pdo);
    $requests = $Request->fetchAllRequest();
    ?>
    <div class="invt-table-data">
    <table class="invt-table-box" id="requestable">      
        <thead>
            <tr>
                <th>KLD ID</th>
                <th>Borrower's name</th>
                <th>Responsible To</th>
                <th>Institutes/Units</th>
                <th>Rquest Date</th>
                <th>Current Status</th>
                <th>Action</th>
            </tr>
        </thead> 
        <tbody>
            <?php
            if ($requests && count($requests) > 0) {
                foreach ($requests as $row) {
                echo "<tr>";
                echo "<td data-label='KLD ID'>" . htmlspecialchars($row['kld_ID']) . "</td>";
                echo "<td data-label=\"Borrower's Name\">" . htmlspecialchars($row['borrower_name']) . "</td>";
                echo "<td data-label='Brand'>" . htmlspecialchars($row['brand_name']) . "</td>";
                echo "<td data-label='Unit'>" . htmlspecialchars($row['unit_name']) . "</td>";
                echo "<td data-label='Request Date'>" . htmlspecialchars($row['request_date']) . "</td>";
                echo "<td class = '". htmlspecialchars($row['response_status']) ."' data-label='Status'>" . htmlspecialchars(ucfirst($row['response_status'])) . "</td>";
                echo "<td data-label='Action'>
                        <div class='action-buttons'>
                                <img id='edit-" . htmlspecialchars($row['request_ID']) . "' class='btn-edit' src='imgs/detail.png' alt='Details' />
                                <img class='btn-delete' data-request='" . htmlspecialchars($row['request_ID']) . "' src='imgs/delete.png' alt='Delete' />
                        </div>
                        </td>";
                echo "</tr>";
                }
                
            } else {
                echo "<tr><td colspan='6'>No asset data found.</td></tr>";
            }
                ?>
        </tbody>
    </table>
</div>

<?php }?>