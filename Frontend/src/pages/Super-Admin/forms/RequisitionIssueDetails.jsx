import React, { useEffect, useState } from "react";
import Popups from "/src/components/Popups.jsx";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";

const RequisitionIssueDetails = ({ risID, refreshTable }) => {
  const { send: sendWS, isConnected: wsConnected } = useWebSocketContext();
  const { lastMessage, isConnected } = useWebSocketContext();
    
  const [header, setHeader] = useState(null);
  const [items, setItems] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isStatusLocked, setIsStatusLocked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [dbItems, setDbItems] = useState([]);
  const [dbConsumables, setDbConsumables] = useState([]);


  useEffect(() => {
    if (!risID) return;
    fetchDetails();
  }, [risID]);

  const fetchDetails = async () => {
    try {
      const response = await fetch(`/api/RIS-Handlers/fetch_RIS_by_id.php?ris_ID=${risID}`);
      const data = await response.json();

      if (data.status === "success") {
        setHeader(data.header);
        setSelectedStatus(data.header.ris_status);
        setItems(data.items);
        setConsumables(data.consumables || []);

        // Deep copy for comparison (DB reference)
        setDbItems(JSON.parse(JSON.stringify(data.items)));
        setDbConsumables(JSON.parse(JSON.stringify(data.consumables || [])));
        
        // Lock if completed, cancelled, or issuing
        if (["completed", "cancelled", "issuing"].includes(data.header.ris_status)) {
          setIsStatusLocked(true);
        }
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

  const checkAndSetStatusLock = (newItems, newConsumables) => {
    // We only check completion logic when current DB status is "issuing"
    if (header.ris_status === "issuing") {
      const allQuantities = [
        ...newItems.map(i => i.quantity_issuance),
        ...newConsumables.map(c => c.quantity_issuance),
      ];

      // Check if ALL issuance fields have a numeric value (including 0)
      const allFilled = allQuantities.every(qty => qty !== "" && qty !== null && qty !== undefined);

      if (allFilled) {
        // all have values — mark completed automatically (frontend only)
        setSelectedStatus("completed");
        setIsStatusLocked(true);
      } else {
        // not all filled — stay issuing
        setSelectedStatus("issuing");
        setIsStatusLocked(true); // status dropdown must stay locked
      }
    } else if (header.ris_status === "pending") {
      // when status is pending, only admin can change it manually
      setIsStatusLocked(false);
    } else {
      // completed or others
      setIsStatusLocked(true);
    }
  };


  // Actual request (runs only if user confirms)
  const submitUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/RIS-Handlers/update_RIS_issuance.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ris_ID: risID,
          items: items.map((item) => ({
            item_id: item.ris_asset_ID,
            quantity_issuance: item.quantity_issuance,
            ris_remarks: item.ris_remarks,
          })),
          consumables: consumables.map((c) => ({
            item_id: c.ris_consumable_ID,
            quantity_issuance: c.quantity_issuance,
            ris_remarks: c.ris_remarks,
          })),
          ris_status: selectedStatus,
        }),
      });

      const result = await response.json();
      setResponseTitle("✅ Update Success");
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
      console.error("Update error:", err);
      setResponseTitle("❌ Failed");
      setResponseMessage("An error occurred while updating. Please try again.");
      setShowResponse(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit → show confirm first
  const handleSubmit = (e) => {
    e.preventDefault();

    // Collect all invalid entries (from both items & consumables)
    const invalidItems = [
      ...items.filter(
        (i) =>
          (i.quantity_issuance !== "" && i.quantity_issuance !== null && i.quantity_issuance !== undefined && (!i.ris_remarks || i.ris_remarks.trim() === "")) ||
          ((i.quantity_issuance === "" || i.quantity_issuance === null || i.quantity_issuance === undefined) && i.ris_remarks && i.ris_remarks.trim() !== "")
      ),
      ...consumables.filter(
        (c) =>
          (c.quantity_issuance !== "" && c.quantity_issuance !== null && c.quantity_issuance !== undefined && (!c.ris_remarks || c.ris_remarks.trim() === "")) ||
          ((c.quantity_issuance === "" || c.quantity_issuance === null || c.quantity_issuance === undefined) && c.ris_remarks && c.ris_remarks.trim() !== "")
      ),
    ];

    if (invalidItems.length > 0) {
      setResponseTitle("⚠️ Invalid Input");
      setResponseMessage(
        "Each item must have BOTH Quantity Issuance and Remarks filled, or BOTH left blank."
      );
      setShowResponse(true);
      return;
    }

    // If everything valid, show confirm popup
    setShowConfirm(true);
  };


  if (!header) return <p>Loading...</p>;

  return (
  <div>
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Header Info */}
        <div className="col-md-4">
          <label className="form-label fw-bold">RIS No.</label>
          <input type="text" className="form-control" value={header.ris_no} disabled />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">RIS Type</label>
          <input type="text" className="form-control" value={header.ris_type} disabled />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">Office / Unit</label>
          <input type="text" className="form-control" value={header.office_unit} disabled />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">Date Created</label>
          <input
            type="date"
            className="form-control"
            value={header.created_at ? header.created_at.split(" ")[0] : ""}
            disabled
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">
            Status
            <span className="admin-field"> (Admin Field)</span>
          </label>
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={isStatusLocked}
          >
            <option value="pending">Pending</option>
            <option value="issuing">Issuing</option>
            {(isStatusLocked || selectedStatus === "completed" || selectedStatus === "cancelled") && (
                <>
                  <option 
                    value="completed" 
                    disabled={selectedStatus === "completed" || selectedStatus === "cancelled"}
                  >
                    Completed
                  </option>
                  <option 
                    value="cancelled" 
                    disabled={selectedStatus === "completed" || selectedStatus === "cancelled"}
                  >
                    Cancelled
                  </option>
                </>
              )}
          </select>
        </div>

        {/* Combined rendering for items + consumables */}
        {(items.length === 0 && consumables.length === 0) ? (
          <p>No items found</p>
        ) : (
          <>
            {/* ITEMS SECTION */}
            {items.map((item, index) => (
              <div className="row g-3 border p-2 mb-2" key={index}>
                {/* Requisition Section */}
                <div className="col-12 mt-3">
                  <h5>Requisition</h5>
                </div>
                {/* <div className="col-md-4">
                  <label className="form-label fw-bold">Item ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.ris_asset_ID}
                    disabled
                  />
                </div> */}
                <div className="col-md-4">
                  <label className="form-label fw-bold">Property No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.asset_property_no || ""}
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">UOM</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.UOM || ""}
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.asset_description}
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Quantity (Requisition)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity_requisition}
                    disabled
                  />
                </div>

                <div className="section-divider">
                  <span>Admin Fields</span>
                </div>

                {/* Issuance Section */}
                <div className="col-12 mt-3">
                  <h5>Issuance</h5>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Quantity (Issuance)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity_issuance ?? ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? "" : Number(e.target.value);
                      const max = Number(item.quantity_requisition);

                      if (value !== "" && (value < 0 || value > max)) {
                        setResponseMessage(`Quantity issuance cannot exceed the requisition (${max}) or be negative.`);
                        setShowResponse(true);
                        return;
                      }

                      const newItems = [...items];
                      newItems[index].quantity_issuance = value;
                      setItems(newItems);

                      checkAndSetStatusLock(newItems, consumables);
                    }}
                    disabled={
                        header.ris_status !== "issuing" ||
                        (
                          dbItems[index]?.quantity_issuance !== null &&
                          dbItems[index]?.quantity_issuance !== "" &&
                          dbItems[index]?.quantity_issuance !== undefined
                        ) ||
                        (
                          dbItems[index]?.ris_remarks &&
                          dbItems[index]?.ris_remarks.trim() !== ""
                        )
                      }
                  />
                </div>

                <div className="col-md-9">
                  <label className="form-label fw-bold">Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.ris_remarks || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].ris_remarks = e.target.value;
                      setItems(newItems);
                    }}
                     disabled={
                        header.ris_status !== "issuing" ||
                        (
                          dbItems[index]?.quantity_issuance !== null &&
                          dbItems[index]?.quantity_issuance !== "" &&
                          dbItems[index]?.quantity_issuance !== undefined
                        ) ||
                        (
                          dbItems[index]?.ris_remarks &&
                          dbItems[index]?.ris_remarks.trim() !== ""
                        )
                      }
                  />
                </div>
              </div>
            ))}

            {/* CONSUMABLES SECTION */}
            {consumables.map((c, index) => (
              <div className="row g-3 border p-2 mb-2" key={`cons-${index}`}>
                <div className="col-12 mt-3">
                  <h5>Requisition</h5>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Consumable</label>
                  <input type="text" className="form-control" value={c.consumable_name} disabled />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Property Tag</label>
                  <input type="text" className="form-control" value={c.kld_property_tag || ""} disabled />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">UOM</label>
                  <input type="text" className="form-control" value={c.UOM || ""} disabled />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Description</label>
                  <input type="text" className="form-control" value={c.consumable_description} disabled />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Quantity (Requisition)</label>
                  <input type="number" className="form-control" value={c.quantity_requisition} disabled />
                </div>

                <div className="section-divider">
                  <span>Admin Fields</span>
                </div>

                <div className="col-12 mt-3">
                  <h5>Issuance</h5>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Quantity (Issuance)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={c.quantity_issuance ?? ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? "" : Number(e.target.value);
                      const max = Number(c.quantity_requisition);

                      if (value !== "" && (value < 0 || value > max)) {
                        setResponseMessage(`Quantity issuance cannot exceed the requisition (${max}) or be negative.`);
                        setShowResponse(true);
                        return;
                      }

                      const newConsumables = [...consumables];
                      newConsumables[index].quantity_issuance = value;
                      setConsumables(newConsumables);

                      checkAndSetStatusLock(items, newConsumables);
                    }}
                    disabled={
                        header.ris_status !== "issuing" ||
                        (
                          dbConsumables[index]?.quantity_issuance !== null &&
                          dbConsumables[index]?.quantity_issuance !== "" &&
                          dbConsumables[index]?.quantity_issuance !== undefined
                        ) ||
                        (
                          dbConsumables[index]?.ris_remarks &&
                          dbConsumables[index]?.ris_remarks.trim() !== ""
                        )
                      }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    value={c.ris_remarks || ""}
                    onChange={(e) => {
                      const newConsumables = [...consumables];
                      newConsumables[index].ris_remarks = e.target.value;
                      setConsumables(newConsumables);
                    }}
                    disabled={
                        header.ris_status !== "issuing" ||
                        (
                          dbConsumables[index]?.quantity_issuance !== null &&
                          dbConsumables[index]?.quantity_issuance !== "" &&
                          dbConsumables[index]?.quantity_issuance !== undefined
                        ) ||
                        (
                          dbConsumables[index]?.ris_remarks &&
                          dbConsumables[index]?.ris_remarks.trim() !== ""
                        )
                      }
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Submit Button */}
      {header.ris_status !== "cancelled" && header.ris_status !== "completed" && (
        <div className="form-modal-footer">
          <button type="submit" className="btn btn-form-green" disabled={loading}>
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      )}
    </form>

    {/* Popups */}
    <Popups
      showConfirmYesNo={showConfirm}
      confirmYesNoTitle="⚠️ Confirm Update"
      confirmYesNoBody="Are you sure you want to update this issuance? This action cannot be undone."
      confirmYesLabel="Yes, Update"
      confirmNoLabel="Cancel"
      onConfirmYes={() => {
        setShowConfirm(false);
        submitUpdate();
      }}
      onConfirmNo={() => setShowConfirm(false)}
      showResponse={showResponse}
      responseTitle={responseTitle}
      responseMessage={responseMessage}
      onCloseResponse={() => setShowResponse(false)}
      showLoading={loading}
    />
  </div>
);
};

export default RequisitionIssueDetails;