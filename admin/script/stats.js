// stats.js

// Fetch and render Total Assets Chart
async function loadTotalAssetsChart() {
    const response = await fetch('/IMS/admin/views/home/getdata.php?action=assets');
    const data = await response.json();

    const labels = data.map(item => item.asset_type);
    const counts = data.map(item => item.total_assets);

    const ctx = document.getElementById('stat-total-assets').appendChild(document.createElement('canvas')).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Assets',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Fetch and render Asset Status Pie Chart
async function loadAssetStatusChart() {
    const response = await fetch('/IMS/admin/views/home/getdata.php?action=status');
    const data = await response.json();

    const labels = data.map(item => item.asset_status);
    const counts = data.map(item => item.total);

    const ctx = document.getElementById('stat-asset-status').appendChild(document.createElement('canvas')).getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Fetch and render Users per Unit Doughnut Chart
async function loadUsersPerUnitChart() {
    const response = await fetch('/IMS/admin/views/home/getdata.php?action=users_per_unit');
    const data = await response.json();

    const labels = data.map(item => item.unit_name);
    const counts = data.map(item => item.total_users);

    const ctx = document.getElementById('stat-users-unit').appendChild(document.createElement('canvas')).getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: [
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 99, 132, 0.5)'
                ],
                borderColor: [
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Call the functions to load all charts
loadTotalAssetsChart();
loadAssetStatusChart();
loadUsersPerUnitChart();
