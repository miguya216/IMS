import React, { useEffect, useState } from "react";
import ReferenceDetails from "/src/pages/Super-admin/forms/ReferenceDetails.jsx";

const AssetCondition = () => {
 
  return (
    <>
     <ReferenceDetails
        type="asset_condition"
        columns={["Condition Name"]}
        idField="asset_condition_ID"
        nameField="condition_name"
      />
    </>
  );
};

export default AssetCondition;
