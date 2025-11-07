import React, { useEffect, useState } from "react";
import ReferenceDetails from "/src/pages/Super-admin/forms/ReferenceDetails.jsx";

const AssetType = () => {
  const [assettypes, setAssetType] = useState([]);
 
  return (
    <>
     <ReferenceDetails
        type="asset_type"
        columns={["Type Name"]}
        idField="asset_type_ID"
        nameField="asset_type"
        statusFilter="inactive"
      />
    </>
  );
};

export default AssetType;
