import React, { useEffect, useState } from "react";
import ReferenceDetails from "/src/pages/Super-admin/forms/ReferenceDetails.jsx";

const Unit = () => {
  const [units, setUnits] = useState([]);
 
  return (
    <>
      <ReferenceDetails
           type="unit"
           columns={["Unit Name"]}
           idField="unit_ID"
           nameField="unit_name"
           statusFilter="inactive"
         />
     </>
  );
};

export default Unit;
