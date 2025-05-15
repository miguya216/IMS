<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/class/fetch_data.php';

header('Content-Type: application/json');

if(isset($_GET['request_ID'])){
    $request_ID = $_GET['request_ID'];
    $request = new Request($pdo);
    $requestDetails = $request->fetchRequestByID($request_ID);

    if($requestDetails){
        echo json_encode([
            'status' => 'success',
            'data' => [
                'request_ID' => $requestDetails['request_ID'],
                'kld_ID' => $requestDetails['kld_ID'],
                'kld_email' => $requestDetails['kld_email'],
                'borrower_name' => $requestDetails['borrower_name'],
                'request_date' => $requestDetails['request_date'],
                'request_time' => $requestDetails['request_time'],
                'brand_name' => $requestDetails['brand_name'],
                'uom' => $requestDetails['uom'],
                'quantity' => $requestDetails['quantity'],
                'unit_name' => $requestDetails['unit_name'],
                'purpose' => $requestDetails['purpose'],
                'request_note' => $requestDetails['request_note'],
                'response_status' => $requestDetails['response_status']
            ]
            ]);
    }else {
        echo json_encode(['status' => 'error', 'message' => 'Request not found', 'Request_received' => $request_ID]);
    }
}else {
    echo json_encode(['status' => 'error', 'message' => 'No Request received']);
}
?>