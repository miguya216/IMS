import React, { useState, useEffect, useRef } from "react";
import TableControls from "/src/components/TableControls";
import Modal from "/src/components/Modal";
import Modalbigger from "/src/components/Modal-bigger";
import RoomAsset from "/src/pages/custodians/forms/RoomAssets.jsx";
import Pagination from "/src/components/Pagination";
import RoomImport from "/src/pages/Super-admin/forms/functions/RoomImport.jsx";
import RoomForm from "./forms/RoomForm";
import { generateRoomDetailsPDF } from "/src/pages/Super-admin/forms/functions/RoomDetailsPDF.jsx";
import Popups from "/src/components/Popups";

const RoomList = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const importRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfFilename, setPdfFilename] = useState("");

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
  const currentRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);

  const handleAdd = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleMoreClick = (roomId) => {
    setSelectedRoomId(roomId);
    setIsModalOpen(true);
  };

  const handleExport = async () => {
    try {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);

      setShowLoadingPopup(true);
      const result = await generateRoomDetailsPDF();
      setShowLoadingPopup(false);

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
    <>
      <div className="container-fluid">
      {/* Controls */}
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

      {/* Add Room Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title="Add Room Number">
        <RoomForm onSuccess={fetchRooms} />
      </Modal>

      {/* Room Assets Modal */}
      <Modalbigger
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Room Assets"
      >
        {selectedRoomId && <RoomAsset roomId={selectedRoomId} />}
      </Modalbigger>

      {/* PDF Preview Modal */}
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

      {/* Popups */}
      <Popups
        showLoading={showLoadingPopup}
        loadingText="Generating Room Stickers PDF..."
      />

      {/* Import CSV */}
      <RoomImport ref={importRef} onImportSuccess={fetchRooms} />
    </>
  );
};

export default RoomList;
