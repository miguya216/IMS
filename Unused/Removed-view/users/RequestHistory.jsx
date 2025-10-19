import React, { useState, useEffect } from "react";
import TableControls from "../../components/TableControls";
import Pagination from "../../components/Pagination";
import Modal from "/src/components/Modal.jsx";
import RequestHistoryDetails from "/src/pages/users/UserForms/RequestHistoryDetails.jsx";
import "/src/css/RequestHistory.css";

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequestID, setSelectedRequestID] = useState(null);
  const itemsPerPage = 8; 

  const fetchRequests = () => {
    fetch("/api/fetch_data.php?action=requesthistory")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();

    window.reloadRequestTable = () => {
      setLoading(true);
      fetchRequests();
    };

    return () => {
      delete window.reloadRequestTable;
    };
  }, []);

  useEffect(() => {
    const filtered = requests.filter((r) =>
      Object.values(r).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchQuery, requests]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleMoreClick = (requestID) => {
    setSelectedRequestID(requestID);
    setShowDetailModal(true);
  };

  return (
    <div className="borrower-home">
        <div className="container-fluid">
        <TableControls
            title="Request History"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onFilter={() => console.log("Filter clicked")}
            searchPlaceholder="Search requests..."
        />

        {loading ? (
            <p className="text-center text-white">⏳ Loading requests...</p>
          ) : currentItems.length === 0 ? (
            <div className="empty-state text-center">
              <img
                src="/resources/imgs/no-results.gif"
                alt="no-results"
                className="mx-auto mb-3 w-40 opacity-90"
              />
              <p className="text-white text-lg font-semibold">
                No matching requests found.
              </p>
              <p className="text-white text-lg font-semibold">
                Try adjusting your search or refresh the list.
              </p>
            </div>
          ) : (
            <>
             <div className="row g-3">
                {currentItems.map((req) => (
                  <div className="col-md-6" key={req.request_ID}>
                    <div
                      className="card shadow-sm custom-card border-left-green cursor-pointer"
                      onClick={() => handleMoreClick(req.request_ID)}
                    >
                      <div className="card-body">
                        <h4 className="fw-bold text-dark mb-3">{req.purpose}</h4>
                        <p className="small text-muted mb-1">
                          📅 Request: {req.request_date} {req.request_time}
                        </p>
                        <p className="small text-muted mb-1">📌 Needed: {req.needed_date}</p>
                        <p className="small text-muted mb-1">⏳ Due: {req.expected_due_date}</p>
                        <p className="small text-muted mb-3">📦 Items: {req.requested_items}</p>

                        <div className="d-flex justify-content-between align-items-center">
                          <span className={`status-badge ${req.response_status}`}>
                            {req.response_status.charAt(0).toUpperCase() +
                              req.response_status.slice(1)}
                          </span>
                          <span className="small text-primary fw-medium">Tap to view →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        <Modal
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            title="Request Details"
            fetchRequests={fetchRequests}
        >
            <RequestHistoryDetails
            requestID={selectedRequestID}
            onClose={() => setShowDetailModal(false)}
            fetchRequests={fetchRequests}
            />
        </Modal>
        </div>
    </div>
  );
};

export default RequestHistory;
