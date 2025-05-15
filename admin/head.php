<?php
function head(){
?>
    <div id="loadingPopup" style="display: none; position: fixed; top: 30%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.75); color: white; padding: 20px; border-radius: 10px; z-index: 1000;">
        Importing CSV... Please wait.
    </div>
<div class="head-section">
            <div class="left-head">
                <img src="imgs/KLDlogo.png" alt="Logo" class="kld-logo">
                <h1><span>KLD IMS | CLARITY</span></h1>
            </div>
            <div class="right-head">
                <img type="button" onclick="openRequestForm()" src="imgs/requestFrom.png" alt="Form" class="icon-head">
                <img type="button" src="imgs/print.png" alt="Download Barcode PDF" class="icon-head">
                <img src="imgs/settings.png" alt="Setting" class="icon-head">
            </div>
        </div>
<?php 

}?>