<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\request\request_form_hanlder.php';

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $request = new RequestForm();

    $kld_ID = $_POST['request_kld_id'];
    $kld_email = $_POST['request_kld_email'];
    $brand_ID = $_POST['request_brand_ID'];
    $UOM = $_POST['request_UOM'];
    $quantity = $_POST['request_quantity'];
    $purpose = $_POST['request_purpose'];

    $response = $request->insertRequest(
    $kld_ID,
    $kld_email,
    $brand_ID,
    $UOM,
    $quantity, 
    $purpose);

    if ($response === true){
        echo "success";
    } elseif ($response === "duplicate"){
        echo "Request is Already Existing";
    } else {
        echo "Error: " . $response;
    }
}
?>