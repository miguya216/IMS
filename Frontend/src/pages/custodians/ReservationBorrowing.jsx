import { useState, useEffect } from "react";
import TableControls from "/src/components/TableControls";
import ReservationBorrowingForm from "/src/pages/custodians/forms/ReservationBorrowingForm";
import Modal from "/src/components/Modal";
import ReservationBorrowingDetails from "/src/pages/custodians/forms/ReservationBorrowingDetails";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";

const ReservationBorrowing = () => {
  const { lastMessage, isConnected } = useWebSocketContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [brsList, setBrsList] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isDetailModal, setDetailModal] = useState(false);
  const [selectedBrsId, setSelectBrsId] = useState(null);

  // Search + Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBrsList, setFilteredBrsList] = useState([]);

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


  const handleMoreClick = (brsId) => {
    setSelectBrsId(brsId);
    setDetailModal(true);
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
  }, [searchQuery, brsList]);

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
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredBrsList.length > 0 ? (
              filteredBrsList.map((item, index) => (
                <tr key={index}>
                  <td data-label="BRS no">{item.brs_no}</td>
                  <td data-label="Date Requested">{item.date_requested}</td>
                  <td data-label="Date & Time of use">
                    {item.date_of_use} {item.time_of_use}
                  </td>
                  <td data-label="Date & Time of return">
                    {item.date_of_return} {item.time_of_return}
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge ${item.brs_status}`}>
                      {item.brs_status.charAt(0).toUpperCase() +
                        item.brs_status.slice(1)}
                    </span>
                  </td>
                  <td data-label="More">
                    <div className="action-btn-group">
                      <button
                        title="More"
                        className="action-btn"
                        onClick={() => handleMoreClick(item.brs_ID)}
                      >
                        <img
                          src="/resources/imgs/detail.png"
                          alt="More"
                          className="action-icon"
                        />
                      </button>
                      <button
                        title="View Disposal PDF"
                        type="button"
                        className="action-btn"
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
    </>
  );
};

export default ReservationBorrowing;
