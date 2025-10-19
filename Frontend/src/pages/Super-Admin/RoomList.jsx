import React, { useState, useEffect, useRef } from "react";
import TableControls from "/src/components/TableControls";
import Modal from "/src/components/Modal";
import Modalbigger from "/src/components/Modal-bigger";
import RoomAsset from "/src/pages/custodians/forms/RoomAssets.jsx";
import Pagination from "/src/components/Pagination"; 
import RoomImport from "/src/pages/Super-admin/forms/functions/RoomImport.jsx";
import RoomForm from "./forms/RoomForm";
import { generateRoomDetailsPDF } from "/src/pages/Super-admin/forms/functions/RoomDetailsPDF.jsx";
import Popups from "/src/components/Popups";   // ✅ import Popups

const RoomList = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const importRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfFilename, setPdfFilename] = useState("");

  // ✅ new popup state
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/Room-Handlers/fetch_all_room.php");
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

  const filteredRooms = rooms.filter((room) =>
    room.room_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRooms = filteredRooms.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAdd = () =>{
    setShowModal(true);
  }

  const handleCloseModal = () =>{
    setShowModal(false);
  }

  const handleMoreClick = (roomId) => {
    setSelectedRoomId(roomId);
    setIsModalOpen(true);
  };

  const handleExport = async () => {
    try {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);

      setShowLoadingPopup(true);  // ✅ show popup
      const result = await generateRoomDetailsPDF();
      setShowLoadingPopup(false); // ✅ hide popup

      if (result) {
        setPdfUrl(result.url);
        setPdfFilename(result.filename);
        setPdfModalOpen(true);
      } else {
        console.error("Failed to generate Room Stickers PDF");
      }
    } catch (err) {
      setShowLoadingPopup(false);
      console.error("Export error:", err);
    }
  };

  return (
    <div className="container-fluid">
      <TableControls
        title="Room List"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAdd={handleAdd}
        onExport={handleExport}   
        searchPlaceholder="Search room..."
        onImport={() => importRef.current.importCsv()}
        showImportButton={true}
        addButtonTitle="Create Room"
        exportButtonTitle="Download Room Stickers"   
        importButtonTitle="Import Room CSV"
        searchInputTitle="Search by room name or tag"
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

      {!loading && filteredRooms.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      <Modal 
        isOpen={showModal} 
        onClose={handleCloseModal}
        title="Add Room Number"
      >
        <RoomForm onSuccess={fetchRooms} />
      </Modal>

      <Modalbigger
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Room Assets"
      >
        {selectedRoomId && <RoomAsset roomId={selectedRoomId} />}
      </Modalbigger>

      <Modalbigger
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title="Room Stickers PDF Preview"
        footer={
          <button
            className="btn btn-form-green"
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfUrl;
              link.download = pdfFilename;
              link.click();
            }}
          >
            Download PDF
          </button>
        }
      >
        <div style={{ height: "80vh" }}>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              title="Room Stickers PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </div>
      </Modalbigger>

      {/* Popups loading */}
      <Popups showLoading={showLoadingPopup} loadingText="Generating Room Stickers PDF..." />

      {/* Import logic */}
      <RoomImport ref={importRef} onImportSuccess={fetchRooms} />
    </div>
  );
};

export default RoomList;
