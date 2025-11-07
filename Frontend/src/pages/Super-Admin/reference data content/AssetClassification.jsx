import React, { useEffect, useState } from "react";
import ReferenceDetails from "/src/pages/Super-admin/forms/ReferenceDetails.jsx";

const AssetClassification = () => {
  const [assetclassifications, setAssetClassification] = useState([]);
 
  return (
    <>
     <ReferenceDetails
        type="asset_classification"
        columns={["Class Name"]}
        idField="asset_classification_ID"
        nameField="asset_classification"
      />
    </>
  );
};

export default AssetClassification;
