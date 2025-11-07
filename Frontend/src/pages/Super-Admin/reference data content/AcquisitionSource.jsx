import React, { useEffect, useState } from "react";
import ReferenceDetails from "/src/pages/Super-admin/forms/ReferenceDetails.jsx";

const AcquisitionSource = () => {
 
  return (
    <>
     <ReferenceDetails
        type="acquisition_source"
        columns={["Source Name"]}
        idField="a_source_ID"
        nameField="a_source_name"
      />
    </>
  );
};

export default AcquisitionSource;
