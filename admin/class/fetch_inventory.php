<?php
include ('class\conn.php'); 
$sql = "
    SELECT 
        asset.asset_ID,
        asset.inventory_tag,
        asset.serial_number,
        asset_type.asset_type,
        brand.brand_name,
        user.full_name AS responsible_user,
        unit.unit_name AS user_unit
    FROM 
        asset
    JOIN 
        asset_type ON asset.asset_type_ID = asset_type.asset_type_ID
    JOIN 
        brand ON asset.brand_ID = brand.brand_ID
    JOIN 
        user ON asset.responsible_user_ID = user.user_ID
    JOIN 
        unit ON user.unit_ID = unit.unit_ID
";

$result = $conn->query($sql);


?>