// start of reusable popup modal
function showPopup(message, color = '#005a34') {
    const notifModal = document.getElementById('notifModal');
    const notifMessage = document.getElementById('responseMessage');

    notifMessage.textContent = message;
    notifMessage.style.color = color;

    notifModal.style.display = 'block';
    void notifModal.offsetWidth; // Force reflow
    notifModal.classList.add('show');

    setTimeout(() => {
        notifModal.classList.remove('show');
        setTimeout(() => {
            notifModal.style.display = 'none';
        }, 300); // Wait for fade out
    }, 1500); // Visible for 1.5s
}

// end of reusable popup modal

document.addEventListener( "DOMContentLoaded", ()=>{
    const requestForm = document.getElementById('requestForm');

    requestForm.addEventListener("submit", function (e){
        e.preventDefault();
        const formData = new FormData(requestForm);

        fetch('/ims/auth/request/requestAuth.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.text())
        .then(response => {
        if  (response.trim().toLowerCase() === "success"){
                showPopup('Success!', '#005a34');
                requestForm.reset();
            } else {
                showPopup(response, '#FF0000');
            }
        })
        .catch(err =>{
            showPopup('Something went wrong.', '#FF0000');
            setTimeout(() => {
            }, 1500);
        });
    });
})
