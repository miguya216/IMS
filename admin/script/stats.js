document.addEventListener('DOMContentLoaded', () => {
    fetch('/IMS/admin/views/home/getdata.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }

            document.getElementById('total_assets').textContent = data.total_assets;
            document.getElementById('active_users').textContent = data.active_users;
            document.getElementById('borrowed_items').textContent = data.total_borrowed;
            document.getElementById('returned_items').textContent = data.total_returned;
            document.getElementById('pending_requests').textContent = data.pending_requests;
            document.getElementById('total_messages').textContent = data.total_messages;
            document.getElementById('inactive_assets').textContent = data.inactive_assets;
        })
        .catch(error => console.error('Fetch error:', error));
});

