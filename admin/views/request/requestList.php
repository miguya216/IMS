<?php 
if (!defined('IN_APP')) {
die("Access Denied");
}
function requestList(){ ?>
    <div class="invt-table-data">
    <table class="invt-table-box" id="requestTable">      
        <thead>
            <tr>
                <th>Item Name</th>
                <th>Remarks</th>
                <th>Responsible To</th>
                <th>Institutes/Units</th>
                <th>Date Borrowed</th>
                <th>Due Date</th>
                <th>Current Status</th>
                <th>Action</th>
            </tr>
        </thead> 
        <tbody>
            <tr>
                <td>Laptop</td>
                <td>Good Condition</td>
                <td>John Doe</td>
                <td>IT Department</td>
                <td>2025-03-01</td>
                <td>2025-03-10</td>
                <td>Borrowed</td>
                <td>
                    <img class='btn-edit' src='imgs/detail.png' alt='Details' />
                </td>
            </tr>
            <tr>
                <td>Projector</td>
                <td>Needs Calibration</td>
                <td>Jane Smith</td>
                <td>HR Department</td>
                <td>2025-02-28</td>
                <td>2025-03-05</td>
                <td>Returned</td>
                <td>
                    <img class='btn-edit' src='imgs/detail.png' alt='Details' />
                </td>
            </tr>
            <tr>
                <td>Printer</td>
                <td>Low Ink</td>
                <td>Michael Johnson</td>
                <td>Finance Department</td>
                <td>2025-02-27</td>
                <td>2025-03-08</td>
                <td>Borrowed</td>
                <td>
                    <img class='btn-edit' src='imgs/detail.png' alt='Details' />
                </td>
            </tr>
            <tr>
                <td>Tablet</td>
                <td>New</td>
                <td>Emily Davis</td>
                <td>Marketing</td>
                <td>2025-03-03</td>
                <td>2025-03-12</td>
                <td>Borrowed</td>
                <td>
                    <img class='btn-edit' src='imgs/detail.png' alt='Details' />
                </td>
            </tr>
            <tr>
                <td>Desktop PC</td>
                <td>Good Condition</td>
                <td>Robert Wilson</td>
                <td>Engineering</td>
                <td>2025-02-25</td>
                <td>2025-03-15</td>
                <td>Borrowed</td>
                <td>
                    <img class='btn-edit' src='imgs/detail.png' alt='Details' />
                </td>
            </tr>
        </tbody>
    </table>
</div>

<?php }?>