<?php 
$conn = require 'conn.php';

$sql = "
    SELECT 
        user.user_ID,
        user.full_name,
        unit.unit_name,
        account.username,
        role.role_name
    FROM 
        user
    JOIN 
        unit ON user.unit_ID = unit.unit_ID
    JOIN 
        account ON user.user_ID = account.user_ID
    JOIN 
        role ON account.role_ID = role.role_ID
";

$result = $conn->query($sql);



?>