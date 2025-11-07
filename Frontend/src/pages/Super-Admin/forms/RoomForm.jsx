import React, { useState } from "react";
import Popups from "/src/components/Popups.jsx";

const RoomForm = ({ onSuccess }) => {
  const [rooms, setRooms] = useState([""]);

  // popup states
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // handle input change
  const handleInputChange = (index, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = value;
    setRooms(updatedRooms);
  };

  // add new room input
  const handleAddRoom = () => {
    setRooms([...rooms, ""]);
  };

  // remove specific input
  const handleRemoveRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredRooms = rooms.filter((room) => room.trim() !== "");

    try {
      setShowLoading(true);

      const response = await fetch("/api/Room-Handlers/insert_room.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rooms: filteredRooms }),
      });

      const result = await response.json();

      if (result.success) {
        setResponseTitle("✅ New Room(s) Inserted");
        setResponseMessage("Room(s) successfully added!");
        setRooms([""]); // reset form

        // 🔹 Call parent refresh
        if (onSuccess) onSuccess();
      } else {
        setResponseTitle("❌ Failed");
        setResponseMessage(result.message || "Failed to add rooms.");
      }
    } catch (error) {
      console.error("Error inserting rooms:", error);
      setResponseTitle("❌ Failed");
      setResponseMessage("An error occurred while saving.");
    } finally {
      setShowLoading(false);
      setShowResponse(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {rooms.map((room, index) => (
          <div className="row g-3 mb-2" key={index}>
            <div className="col-md-3">
              <label className="form-label fw-bold">Room Number {index + 1}</label>
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                name={`room_number_${index}`}
                placeholder="-- Enter Room Number --"
                value={room}
                onChange={(e) => handleInputChange(index, e.target.value)}
                required
              />
            </div>
            <div className="col-md-2">
              {rooms.length > 1 && (
                <button
                  type="button"
                  className="btn btn-form-red"
                  onClick={() => handleRemoveRoom(index)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="row g-3">
          <div className="col-md-3">
            <button
              type="button"
              className="btn btn-form-green"
              onClick={handleAddRoom}
            >
              +
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="submit" className="btn btn-form-green">
            Save
          </button>
        </div>
      </form>

      {/* Popups */}
      <Popups
        showLoading={showLoading}
        loadingText="Saving rooms..."
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </>
  );
};

export default RoomForm;
