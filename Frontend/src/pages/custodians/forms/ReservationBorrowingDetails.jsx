import React, { useEffect, useState } from "react";
import Popups from "/src/components/Popups";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";

const ReservationBorrowingDetails = ({ brsID, refreshTable, onClose }) => {
  const { send: sendWS, isConnected: wsConnected } = useWebSocketContext();
  const { lastMessage, isConnected } = useWebSocketContext();
    
  const [reservation, setReservation] = useState(null);
  const [assets, setAssets] = useState([]);

  // Popup + loading states
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    if (!brsID) return;
    fetchDetails();
  }, [brsID]);

  const fetchDetails = async () => {
    try {
      const response = await fetch(
        `/api/Reservation-Borrowing-Handlers/fetch_brs_by_id.php?brs_ID=${brsID}`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (data.success) {
        setReservation(data.reservation);
        setAssets(data.assets);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching reservation details:", err);
    } finally {
      setLoading(false);
    }
  };

  // websocket
  useEffect(() => {
    if (!lastMessage) return;
    // If the incoming message is a JSON object indicating refresh, call fetchRIS
    try {
      const msg = typeof lastMessage === "string" ? JSON.parse(lastMessage) : lastMessage;
      if (msg && msg.type === "refreshBRS") {
        fetchDetails();
      }
    } catch (e) {
      // ignore non-json messages
    }
  }, [lastMessage]);

  // First click → open confirmation
  const handleCancelClick = () => {
    setShowConfirm(true);
  };

  // Confirmed cancel
  const confirmCancel = async () => {
    setShowConfirm(false);
    setShowLoading(true);

    try {
      const response = await fetch(
        "/api/Reservation-Borrowing-Handlers/cancel_brs.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ brs_ID: brsID }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setResponseTitle("✅ Success");
        setResponseMessage("Reservation cancelled successfully.");
        // websocket
        try {
          sendWS({ type: "refreshBRS" });
          sendWS({ type: "refreshNotifications" });
        } catch (e) {
          console.warn("WS notify failed", e);
        }
        setTimeout(() => {
            refreshTable?.();
            onClose?.();
          }, 1500);
      } else {
        setResponseTitle("❌ Error");
        setResponseMessage(data.error || "Failed to cancel reservation.");
      }
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      setResponseTitle("❌ Error");
      setResponseMessage("An error occurred while cancelling.");
    } finally {
      setShowLoading(false);
      setShowResponse(true);
    }
  };

  if (loading) return <p>Loading reservation details...</p>;
  if (!reservation) return <p>No reservation found.</p>;

  return (
    <>
      <form>
        {/* --- Reservation Info Fields --- */}
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Borrower's Name</label>
            <input
              type="text"
              className="form-control"
              value={reservation.full_name || ""}
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Institute/Unit</label>
            <input
              type="text"
              className="form-control"
              value={reservation.unit_name || ""}
              readOnly
            />
          </div>
          <div className="col-md-12">
            <label className="form-label fw-bold">Purpose</label>
            <textarea
              className="form-control"
              value={reservation.purpose || ""}
              readOnly
            ></textarea>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">BRS No.</label>
            <input
              type="text"
              className="form-control"
              value={reservation.brs_no || ""}
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Date Requested</label>
            <input
              type="date"
              className="form-control"
              value={reservation.created_at?.split(" ")[0] || ""}
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Date of Use</label>
            <input
              type="date"
              className="form-control"
              value={reservation.date_of_use || ""}
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Time of Use</label>
            <input
              type="time"
              className="form-control"
              value={reservation.time_of_use || ""}
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Date of Return</label>
            <input
              type="date"
              className="form-control"
              value={reservation.date_of_return || ""}
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Time of Return</label>
            <input
              type="time"
              className="form-control"
              value={reservation.time_of_return || ""}
              readOnly
            />
          </div>
          <div className="col-md-3">
              <label className="form-label fw-bold">Status</label>
              <input
                type="text"
                className="form-control"
                value={reservation.brs_status || ""}
                readOnly
              />
            </div>
        </div>

        {/* Assets Section */}
          <h4>Asset For Reservation / Borrowing</h4>
          {assets.length > 0 ? (
            assets.map((asset) => (
              <div key={asset.brs_asset_ID} className="border rounded p-3 mb-2">
                <div className="row g-2 mb-2">
                  <div className="col-md-10">
                    <label className="form-label fw-bold">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${asset.asset_type} - ${asset.brand_name} (${asset.property_tag})`}
                      readOnly
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold">Availability</label>
                    <select
                      className="form-select"
                      value={asset.is_available}
                      disabled
                    > 
                      <option value="">Pending</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">UOM</label>
                    <input
                      type="text"
                      className="form-control"
                      value={asset.UOM_brs || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={asset.qty_brs || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Quantity (Issuance)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={asset.qty_issuance || ""}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row g-2 mb-2">
                    <div className="col-md-6">
                    <label className="form-label fw-bold">BorrowRemarks</label>
                    <input
                      type="text"
                      className="form-control"
                      value={asset.borrow_asset_remarks || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Return Remarks</label>
                    <input
                      type="text"
                      className="form-control"
                      value={asset.return_asset_remarks || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No assets found for this reservation.</p>
          )}

        <div className="text-end mt-3">
          {reservation.brs_status === "pending" && (
            <button
              type="button"
              className="btn btn-form-red"
              onClick={handleCancelClick}
              disabled={showLoading}
            >
              Cancel Reservation
            </button>
          )}
        </div>
      </form>

      {/* Popups */}
      <Popups
        // confirmation popup
        showConfirmYesNo={showConfirm}
        confirmYesNoTitle="⚠️ Cancel Reservation"
        confirmYesNoBody="Are you sure you want to cancel this reservation?"
        confirmYesLabel="Yes, Cancel"
        confirmNoLabel="No"
        onConfirmYes={confirmCancel}
        onConfirmNo={() => setShowConfirm(false)}

        // loading popup
        showLoading={showLoading}
        loadingText="Cancelling reservation, please wait..."

        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </>
  );
};

export default ReservationBorrowingDetails;
