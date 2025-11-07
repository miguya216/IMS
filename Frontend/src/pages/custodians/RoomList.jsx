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
  const [selectedRow, setSelectedRow] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // same as admin

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
    <>
      <div className="container-fluid">
      {/* Controls */}
      <TableControls
          title="Room List"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search room..."
          searchInputTitle="Search by Room number"
        />

        {/* Room Cards */}
        <div className="row g-3">
          {loading ? (
            <div className="text-center py-5">
              <p className="fw-semibold">Loading...</p>
              <img
                src="/resources/imgs/loading.gif"
                alt="Loading..."
                style={{ width: "40px", height: "40px" }}
              />
            </div>
          ) : currentRooms.length > 0 ? (
            currentRooms.map((room, index) => (
              <div 
                key={index} 
                className={`${selectedRow === room.room_ID ? "selected-row" : ""} col-12 col-md-6 col-lg-3`}
              >
                <div className="card card-room shadow-sm h-100 border-0 hover-card">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3">
                      🚪 Room {room.room_number}
                    </h5>
                    <p className="mb-1">
                      <strong>📦 Total Assets:</strong> {room.total_assets}
                    </p>
                    <p className="mb-3">
                      <strong>💰 Total Value:</strong> ₱{room.total_value}
                    </p>
                    <button
                      className="btn btn-form-green shadow-sm"
                      onClick={() => {
                        handleMoreClick(room.room_ID);
                        setSelectedRow(room.room_ID);
                      }}
                    >
                      View Room Assets
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted mt-3">No rooms found.</p>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredRooms.length > itemsPerPage && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
      
      {/* Room Assets Modal */}
      <Modalbigger
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Room Assets"
      >
        {selectedRoomId && <RoomAsset roomId={selectedRoomId} />}
      </Modalbigger>

    </>
  );
};

export default RoomList;
