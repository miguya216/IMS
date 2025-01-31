document.addEventListener("DOMContentLoaded", function() {
    // Check if loginForm exists before adding event listener
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            window.location.href = "home.html";
        });
    }

    // Fetch the navbar HTML and insert it into the navbar-placeholder div
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-content').innerHTML = data;
        })
        .catch(err => console.log('Error loading navbar: ', err));

    // Sales chart example using Chart.js
    var ctx = document.getElementById('salesChart').getContext('2d');
    var salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales ($)',
                data: [15000, 17000, 16000, 19000, 18000, 20000],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
}});
});
