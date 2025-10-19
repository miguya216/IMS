// src/pages/custodians/RoomList.jsx
import React, { useState, useEffect } from "react";
import TableControls from "/src/components/TableControls";
import Modalbigger from "/src/components/Modal-bigger";
import RoomAsset from "/src/pages/custodians/forms/RoomAssets.jsx";
import Pagination from "/src/components/Pagination";

const RoomList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // same as admin

  // Fetch rooms for employee (only assigned)
  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/Room-Handlers/fetch_room_by_user.php");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter rooms based on searchQuery
  const filteredRooms = rooms.filter((room) =>
    room.room_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);

  // Handle More button click
  const handleMoreClick = (roomId) => {
    setSelectedRoomId(roomId);
    setIsModalOpen(true);
  };

  return (
    <div className="container-fluid">
      <TableControls
        title="Room List"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search room..."
        searchInputTitle="Search by Room number"
      />

      <div className="custom-table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Total Asset</th>
              <th>Good Assets</th>
              <th>Repair Assets</th>
              <th>Total Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : currentRooms.length > 0 ? (
              currentRooms.map((room, index) => (
                <tr key={index}>
                  <td data-label="Room Number">{room.room_number}</td>
                  <td data-label="Total Asset">{room.total_assets}</td>
                  <td data-label="Good Assets">{room.good_assets}</td>
                  <td data-label="Repair Assets">{room.repair_assets}</td>
                  <td data-label="Total Value">{room.total_value}</td>
                  <td data-label="Action">
                    <div className="action-btn-group">
                      <button
                        title="More"
                        className="action-btn"
                        onClick={() => handleMoreClick(room.room_ID)}
                      >
                        <img
                          src="/resources/imgs/detail.png"
                          alt="More"
                          className="action-icon"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination at bottom */}
      {!loading && filteredRooms.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Modal for Room Asset */}
      <Modalbigger
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Room Assets"
      >
        {selectedRoomId && <RoomAsset roomId={selectedRoomId} />}
      </Modalbigger>
    </div>
  );
};

export default RoomList;
