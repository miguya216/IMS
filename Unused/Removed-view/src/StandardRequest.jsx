import React, { useState, useEffect } from "react";
import TableControls from "/src/components/TableControls";
import Modal from "/src/components/Modal";
import BorrowRequestDetails from "/src/pages/custodians/forms/BorrowRequestDetails";

const BorrowingRequest = () => {
    const [selectedRequestID, setSelectedRequestID] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = () => {
        setLoading(true);
        fetch("/api/fetch_data.php?action=custodianstandardrequests")
            .then((res) => res.json())
            .then((data) => {
                setRequests(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch requests", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredRequests = requests.filter((req) =>
        req.kld_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.kld_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.purpose?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleMoreClick = (requestID) => {
        setSelectedRequestID(requestID);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequestID(null);
    };

    return (
        <div className="container-fluid">
            <TableControls
                title="Standard Request"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onFilter={() => console.log("Filter clicked")}
                searchPlaceholder="Search requests..."
                searchInputTitle="Search request by KLD ID, email or status"
            />

            {loading ? (
                <p className="text-center text-muted">⏳ Loading requests...</p>
            ) : filteredRequests.length === 0 ? (
                <p className="text-center text-muted">No matching requests found.</p>
            ) : (
                <div className="custom-table-wrapper">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>KLD ID</th>
                                <th>Email</th>
                                <th>Request Date</th>
                                <th>Needed</th>
                                <th>Expected Return</th>
                                <th>Status</th>
                                <th>More</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((req) => (
                                <tr key={req.request_ID}>
                                    <td data-label="KLD ID">{req.kld_ID}</td>
                                    <td data-label="Email">{req.kld_email}</td>
                                    <td data-label="Request Date">{`${req.request_date} ${req.request_time}`}</td>
                                    <td data-label="Needed">{`${req.needed_date} ${req.needed_time}`}</td>
                                    <td data-label="Expected Return">{`${req.expected_due_date} ${req.expected_due_time}`}</td>
                                    <td data-label="Status">
                                        <span className={`status-badge ${req.response_status}`}>
                                            {req.response_status.charAt(0).toUpperCase() + req.response_status.slice(1)}
                                        </span>
                                    </td>
                                    <td data-label="Action">
                                        <div className="action-btn-group">
                                            <button
                                                title="Response"
                                                className="action-btn"
                                                onClick={() => handleMoreClick(req.request_ID)}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Borrowing Request Details"
            >
                <BorrowRequestDetails
                    requestID={selectedRequestID}
                    onClose={closeModal}
                    refreshList={fetchRequests}
                />
            </Modal>
        </div>
    );
};

export default BorrowingRequest;
