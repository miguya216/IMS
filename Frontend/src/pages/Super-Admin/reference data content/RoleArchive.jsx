import React, { useEffect, useState } from "react";
import ReferenceDetails from "/src/pages/Super-admin/forms/ReferenceDetails.jsx";

const Role = () => {
  const [roles, setRoles] = useState([]);

  return (
    <>
    <ReferenceDetails
      type="role"
      columns={["Role Name"]}
      idField="role_ID"
      nameField="role_name"
      statusFilter="inactive"
    />
    </>
  );
};

export default Role;
