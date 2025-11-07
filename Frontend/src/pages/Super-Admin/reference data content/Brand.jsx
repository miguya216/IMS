import React, { useEffect, useState } from "react";
import ReferenceDetails from "/src/pages/Super-admin/forms/ReferenceDetails.jsx";

const Brand = () => {
  const [brands, setBrands] = useState([]);
 
  return (
    <>
    <ReferenceDetails
      type="brand"
      columns={["Brand Name", "Asset Type"]}
      idField="brand_ID"
      nameField="brand_name"
      assetTypeField="asset_type_ID"
    />

    </>
  );
};

export default Brand;
