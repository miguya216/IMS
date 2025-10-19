import React, { useEffect, useState } from "react";
import ReferenceDetails from "/src/pages/Super-admin/forms/ReferenceDetails.jsx";

const Room = () => {
  const [rooms, setRooms] = useState([]);
  

  return (
      <>
        <ReferenceDetails
          type="room"
          columns={["Room Number"]}
          idField="room_ID"
          nameField="room_number"
        />
      </>
  );
};

export default Room;
