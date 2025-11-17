import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TableControls from "/src/components/TableControls";
import ReservationBorrowingForm from "/src/pages/custodians/forms/ReservationBorrowingForm";
import Modal from "/src/components/Modal";
import Modalbigger from "/src/components/Modal-bigger";
import ReservationBorrowingDetails from "/src/pages/custodians/forms/ReservationBorrowingDetails";
import { generateBRSPDF } from "/src/pages/Super-Admin/forms/functions/GenerateBRSPDF";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";
import Pagination from "/src/components/Pagination";
import Popups from "/src/components/Popups";

const ReservationBorrowing = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const brsNoFromNotif = queryParams.get("brs_no");

  const { lastMessage, isConnected } = useWebSocketContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [brsList, setBrsList] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isDetailModal, setDetailModal] = useState(false);
  const [selectedBrsId, setSelectBrsId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // PDF preview states
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [selectedPDFName, setSelectedPDFName] = useState("");


  // Search + Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBrsList, setFilteredBrsList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchUserBRS = () => {
    setLoading(true);
    fetch("/api/Reservation-Borrowing-Handlers/fetch_all_user's_brs.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBrsList(data.data || []);
        } else {
          console.error("Failed to fetch BRS:", data.error || data);
          setBrsList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching BRS:", err);
        setBrsList([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserBRS();
  }, []);

   // websocket
    useEffect(() => {
      if (!lastMessage) return;
      try {
        const msg = typeof lastMessage === "string" ? JSON.parse(lastMessage) : lastMessage;
        if (msg && msg.type === "refreshBRS") {
          fetchUserBRS();
        }
      } catch (e) {
        // ignore non-json messages
      }
    }, [lastMessage]);

  // redirect to modal from notification
  useEffect(() => {
    if (brsNoFromNotif && brsList.length > 0) {
      const match = brsList.find(b => b.brs_no === brsNoFromNotif);
      if (match) {
        setSelectBrsId(match.brs_ID);
        setDetailModal(true);
        window.history.replaceState({}, "", "/custodians/reservationborrowing");
      }
    }
  }, [brsList, brsNoFromNotif]);

  const handleMoreClick = (brsId) => {
    setSelectBrsId(brsId);
    setDetailModal(true);
  };

   // Handle PDF preview (same logic as RIS)
  const handlePDFPreview = async (brsId) => {
    setShowLoading(true);
    try {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl); // clear previous blob
      const result = await generateBRSPDF(brsId);
      if (result) {
        setPdfPreviewUrl(result.url);
        setSelectedPDFName(result.filename);
        setShowPdfPreview(true);
      } else {
        console.error("Failed to generate BRS PDF");
        setShowLoading(false);
      }
    } catch (err) {
      console.error("PDF preview error:", err);
      setShowLoading(false);
    } finally {
      setShowLoading(false);
    }
  };

  //  Filtering logic (same approach as your RequisitionIssuance.jsx)
  useEffect(() => {
    const filtered = brsList.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredBrsList(filtered);
    setCurrentPage(1);
  }, [searchQuery, brsList]);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredBrsList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBrsList.length / itemsPerPage);

  // helper function
  const toStandardTime = (time) => {
    if (!time) return "";
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert "0" or "12" to "12"
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };


  return (
    <>
      <TableControls
        title="Reservation and Borrowing"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAdd={() => setIsAddModalOpen(true)}
        searchPlaceholder="Search by BRS, Date, or Status..."
      />

      <div className="custom-table-wrapper mt-4">
        <table className="custom-table">
          <thead>
            <tr>
              <th>BRS No.</th>
              <th>Date Requested</th>
              <th>Date & Time of Use</th>
              <th>Date & Time of Return</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                  <td colSpan="6">
                    <div className="loading-data">
                        <p>loading</p>
                        <img 
                          src="/resources/imgs/loading.gif"
                          alt="Loading..."
                          style={{ width: "40px", height: "40px" }}  
                        />
                    </div>
                  </td>
                </tr>
            ) : filteredBrsList.length > 0 ? (
              currentItems.map((item, index) => (
                <tr 
                  key={index}
                  className={selectedRow === item.brs_ID ? "selected-row" : ""}
                >
                  <td data-label="BRS no">{item.brs_no}</td>
                  <td data-label="Date Requested">{item.date_requested?.split(" ")[0]}</td>
                  <td data-label="Date & Time of use">
                    {item.date_of_use} {toStandardTime(item.time_of_use)}
                  </td>
                  <td data-label="Date & Time of return">
                    {item.date_of_return} {toStandardTime(item.time_of_return)}
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge ${item.brs_status}`}>
                      {item.brs_status.charAt(0).toUpperCase() +
                        item.brs_status.slice(1)}
                    </span>
                  </td>
                  <td data-label="Details">
                    <div className="action-btn-group">
                      <button
                        title="More"
                        className="action-btn"
                        onClick={() => {
                          handleMoreClick(item.brs_ID);
                          setSelectedRow(item.brs_ID);
                        }}
                      >
                        <img
                          src="/resources/imgs/detail.png"
                          alt="More"
                          className="action-icon"
                        />
                      </button>
                      <button
                        title="Preview BRS PDF"
                        type="button"
                        className="action-btn"
                        onClick={() => {
                          handlePDFPreview(item.brs_ID);
                          setSelectedRow(item.brs_ID);
                        }}
                      >
                        <img
                          src="/resources/imgs/pdf-icon.png"
                          alt="Preview PDF"
                          className="action-icon"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No reservations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredBrsList.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Asset Reservation and Borrowing Form"
      >
        <ReservationBorrowingForm
          onClose={() => setIsAddModalOpen(false)}
          refreshTable={fetchUserBRS}
        />
      </Modal>

      <Modal
        isOpen={isDetailModal}
        onClose={() => setDetailModal(false)}
        title="Asset Reservation and Borrowing Details"
      >
        <ReservationBorrowingDetails
          onClose={() => setDetailModal(false)}
          brsID={selectedBrsId}
          refreshTable={fetchUserBRS}
        />
      </Modal>

      {/* PDF Preview Modal */}
      <Modalbigger
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        title="BRS PDF Preview"
        footer={
          <button
            className="btn btn-form-green"
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfPreviewUrl;
              link.download = selectedPDFName;
              link.click();
            }}
          >
            Download PDF
          </button>
        }
      >
        <div style={{ height: "80vh" }}>
          {pdfPreviewUrl && (
            <iframe
              src={pdfPreviewUrl}
              title="BRS PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </div>
      </Modalbigger>

      <Popups 
        showLoading={showLoading}
        loadingText="Generating BRS form PDF, please wait..."
      />
    </>
  );
};

export default ReservationBorrowing;
