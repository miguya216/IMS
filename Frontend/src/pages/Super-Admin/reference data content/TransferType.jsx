import React, { useEffect, useState } from "react";
import ReferenceDetails from "/src/pages/Super-admin/forms/ReferenceDetails.jsx";

const TransferType = () => {
  const [TransferTypes, setTransferTypes] = useState([]);

  return (
    <>
    <ReferenceDetails
      type="transfer_type"
      columns={["Type Name"]}
      idField="transfer_type_ID"
      nameField="transfer_type_name"
    />
    </>
  );
};

export default TransferType;
