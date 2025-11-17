import React, { useEffect, useState } from "react";
import Popups from "/src/components/Popups.jsx";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";

const RequisitionIssueDetails = ({ risID, refreshTable }) => {
  const { send: sendWS, isConnected: wsConnected } = useWebSocketContext();
  const { lastMessage, isConnected } = useWebSocketContext();
      
  const [header, setHeader] = useState(null);
  const [items, setItems] = useState([]);
  const [consumables, setConsumables] = useState([]);

  // Popup + loading states
  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // new confirm popup state
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!risID) return;
     fetchDetails();
  }, [risID]);

  const fetchDetails = async () => {
    try {
      const response = await fetch(
        `/api/RIS-Handlers/fetch_RIS_by_id.php?ris_ID=${risID}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setHeader(data.header);
        setItems(data.items);
        setConsumables(data.consumables || []);
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  // websocket
  useEffect(() => {
    if (!lastMessage) return;
    // If the incoming message is a JSON object indicating refresh, call fetchRIS
    try {
      const msg = typeof lastMessage === "string" ? JSON.parse(lastMessage) : lastMessage;
      if (msg && msg.type === "refreshRIS") {
        // either optimistically insert msg.ris data, or just refetch
        fetchDetails();
      }
    } catch (e) {
      // ignore non-json messages
    }
  }, [lastMessage]);

  // First click: just open confirmation
  const handleCancelClick = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  // Confirmed cancel
  const confirmCancel = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      const response = await fetch("/api/RIS-Handlers/cancelRIS.php", {
        method: "POST",
        body: new URLSearchParams({ ris_ID: risID }),
      });

      const result = await response.json();
      setResponseTitle("✅ Success");
      setResponseMessage(result.message);
      setShowResponse(true);

      if (result.status === "success" && refreshTable) {
        // websocket
        try {
          sendWS({ type: "refreshRIS" });
          sendWS({ type: "refreshNotifications" });
        } catch (e) {
          console.warn("WS notify failed", e);
        }
        refreshTable();
      }
    } catch (err) {
      console.error("Cancel error:", err);
      setResponseTitle("✅ Failed");
      setResponseMessage("An error occurred while cancelling. Please try again.");
      setShowResponse(true);
    } finally {
      setLoading(false);
    }
  };

  if (!header) return <p>Loading...</p>;

  return (
    <div>
      <form>
        <div className="row g-3 mb-3">
          {/* Header Info */}
          <div className="col-md-4">
            <label className="form-label fw-bold">RIS No.</label>
            <input type="text" className="form-control" value={header.ris_no} readOnly />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">RIS Type</label>
            <input type="text" className="form-control" value={header.ris_type} readOnly />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">Office / Unit</label>
            <input type="text" className="form-control" value={header.office_unit} readOnly />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">Date Created</label>
            <input
                type="date"
                className="form-control"
                value={header.created_at ? header.created_at.split(' ')[0] : ''} 
                readOnly
              />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">Status</label>
            <input type="text" className="form-control" value={header.ris_status} readOnly />
          </div>

          {/* Requested Assets */}
          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="row g-3 border p-2 mb-2" key={index}>
                <div className="col-12 mt-3">
                  <h5>Requisition</h5>
                </div>
                {/* <div className="col-md-4">
                  <label className="form-label fw-bold">Item ID</label>
                  <input type="number" className="form-control" value={item.ris_asset_ID} readOnly />
                </div> */}
                <div className="col-md-4">
                  <label className="form-label fw-bold">Property No.</label>
                  <input type="text" className="form-control" value={item.asset_property_no || ""} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">UOM</label>
                  <input type="text" className="form-control" value={item.UOM || ""} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Description</label>
                  <input type="text" className="form-control" value={item.asset_description} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Quantity (Requisition)</label>
                  <input type="number" className="form-control" value={item.quantity_requisition} readOnly />
                </div>

                <div className="col-12 mt-3">
                  <h5>Issuance</h5>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Quantity (Issuance)</label>
                  <input type="number" className="form-control" value={item.quantity_issuance ?? ""} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Remarks</label>
                  <input type="text" className="form-control" value={item.ris_remarks || ""} readOnly />
                </div>
              </div>
            ))
          ) : (
            <p>No items found</p>
          )}
        </div>

        {/* Consumables */}
        {consumables.length > 0 && (
          <>
            {consumables.map((c, index) => (
              <div className="row g-3 border p-2 mb-2" key={index}>
                <div className="col-12 mt-3">
                  <h5>Consumable Requisition</h5>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Consumable</label>
                  <input type="text" className="form-control" value={c.consumable_name} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Property Tag</label>
                  <input type="text" className="form-control" value={c.kld_property_tag || ""} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">UOM</label>
                  <input type="text" className="form-control" value={c.UOM || ""} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Description</label>
                  <input type="text" className="form-control" value={c.consumable_description} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Quantity (Requisition)</label>
                  <input type="number" className="form-control" value={c.quantity_requisition} readOnly />
                </div>

                <div className="col-12 mt-3">
                  <h5>Issuance</h5>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Quantity (Issuance)</label>
                  <input type="number" className="form-control" value={c.quantity_issuance ?? ""} readOnly />
                </div>
                <div className="col-md-9">
                  <label className="form-label fw-bold">Remarks</label>
                  <input type="text" className="form-control" value={c.ris_remarks || ""} readOnly />
                </div>
              </div>
            ))}
          </>
        )}

        {/* Cancel Button */}
        {header.ris_status === "pending" && (
          <div className="form-modal-footer">
            <button
              type="button"
              className="btn btn-form-red"
              onClick={handleCancelClick}
              disabled={loading}
            >
              Cancel Request
            </button>
          </div>
        )}
      </form>

      {/* Popups */}
      <Popups
        // ✅ confirmation popup
        showConfirmYesNo={showConfirm}
        confirmYesNoTitle="⚠️ Cancel RIS"
        confirmYesNoBody="Are you sure you want to cancel this requisition?"
        confirmYesLabel="Yes, Cancel"
        confirmNoLabel="No"
        onConfirmYes={confirmCancel}
        onConfirmNo={() => setShowConfirm(false)}

        // loading popup
        showLoading={loading}
        loadingText="Cancelling RIS, please wait..."

        // response popup
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </div>
  );
};

export default RequisitionIssueDetails;
