// src/pages/BorrowRequestDetails.jsx

import React, { useEffect, useState } from "react";
import Popups from "/src/components/Popups.jsx";

const RequestHistoryDetails = ({ requestID, onClose, refreshList, fetchRequests }) => {
  const [request, setRequest] = useState(null);
  const [items, setItems] = useState([]);

  // Popups state
  const [showConfirmYesNo, setShowConfirmYesNo] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch request details
  useEffect(() => {
    if (requestID) {
      fetch(`/api/Borrowing-Process/fetch_request_by_id.php?id=${requestID}`)
        .then((res) => res.json())
        .then((data) => {
          setRequest(data.request);
          setItems(data.items || []);
        })
        .catch((err) => console.error("Failed to fetch request details", err));
    }
  }, [requestID]);

  const handleAction = (action) => {
    setShowLoading(true);

    fetch("/api/Borrowing-Process/request_cancellation.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_ID: requestID, response: action }),
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setResponseMessage(data.message || "Action completed.");
        } catch {
          setResponseMessage("Invalid response format: " + text);
        }
      })
      .catch((err) => {
        setResponseMessage("Something went wrong: " + err.message);
      })
      .finally(() => {
        setShowLoading(false);
        setShowResponse(true);
        if (refreshList) refreshList();
      });
  };

  if (!request) return <p>Loading...</p>;

  return (
    <div>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label fw-bold">KLD ID</label>
          <input type="text" className="form-control" value={request.kld_ID} readOnly />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Email</label>
          <input type="text" className="form-control" value={request.kld_email} readOnly />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Purpose</label>
          <textarea className="form-control" rows={2} value={request.purpose} readOnly />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Requested Date</label>
          <input type="text" className="form-control" value={`${request.request_date} ${request.request_time}`} readOnly />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Needed On</label>
          <input type="text" className="form-control" value={`${request.needed_date} ${request.needed_time}`} readOnly />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Expected Return</label>
          <input type="text" className="form-control" value={`${request.expected_due_date} ${request.expected_due_time}`} readOnly />
        </div>

        <div className="col-md-12">
          <label className="form-label fw-bold">Requested Items</label>
          <ul className="list-group">
            {items.map((item, index) => (
              <li className="list-group-item d-flex justify-content-between" key={index}>
                <span>{item.asset_type}</span>
                <span className="fw-bold">× {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        {request.response_status === "pending" && (
          <button
            className="btn btn-form-red"
            onClick={() => setShowConfirmYesNo(true)}
          >
            Cancel Request
          </button>
        )}
      </div>

      {/* Popups */}
      <Popups
        showConfirmYesNo={showConfirmYesNo}
        confirmYesNoTitle="Cancel Borrowing Request?"
        confirmYesNoBody="Are you sure you want to cancel this request? This cannot be undone."
        confirmYesLabel="Yes, Cancel"
        confirmNoLabel="No"
        onConfirmYes={() => {
          setShowConfirmYesNo(false);
          handleAction("cancelled");
        }}
        onConfirmNo={() => setShowConfirmYesNo(false)}
        showConfirmDone={false}
        showLoading={showLoading}
        loadingText="Cancelling request..."
        showResponse={showResponse}
        responseTitle="Borrowing Request"
        responseMessage={responseMessage}
        onCloseResponse={() => {
          setShowResponse(false);
          if (fetchRequests) fetchRequests(); // ✅ refresh table
          onClose(); // ✅ close modal
        }}
      />

    </div>
  );
};

export default RequestHistoryDetails;
