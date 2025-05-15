<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\request\request_form_hanlder.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $request = new UpdateRequest();
    $request_ID = $_POST['request_ID'];
    $response_status = $_POST['response_status'];

    $response = $request->updateRequestForm(
        $request_ID,
        $response_status
    );
    
    if($response === true){
        echo "success";
    } else {
        echo "Error: " . $response;
    }
}
?>
