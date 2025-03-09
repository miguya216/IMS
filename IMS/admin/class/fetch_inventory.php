<?php
include ('class\conn.php'); 

$selectInvetory = "SELECT assets, serial_num, responsibleTo, remarks, institute FROM item";
$inventoryList = $conn->query($selectInvetory); 

$selectRecent = "SELECT assets, serial_num, responsibleTo, remarks, institute FROM item ORDER BY ID DESC LIMIT 10";
$recentList = $conn->query($selectRecent);

?>