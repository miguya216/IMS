import React, { useEffect, useState } from "react";
import Popups from "/src/components/Popups.jsx";

const RequisitionIssueDetails = ({ risID, refreshTable }) => {
  const [header, setHeader] = useState(null);
  const [items, setItems] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isStatusLocked, setIsStatusLocked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!risID) return;
    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/RIS-Handlers/fetch_RIS_by_id.php?ris_ID=${risID}`);
        const data = await response.json();

        if (data.status === "success") {
          setHeader(data.header);
          setSelectedStatus(data.header.ris_status);
          setItems(data.items);
          setConsumables(data.consumables || []);
          // If DB status is already completed, lock it
          if (data.header.ris_status === "completed") {
            setIsStatusLocked(true);
          }
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchDetails();
  }, [risID]);

  const checkAndSetStatusLock = (newItems, newConsumables) => {
    const allIssuances = [
      ...newItems.map(i => i.quantity_issuance),
      ...newConsumables.map(c => c.quantity_issuance),
    ];

    // If any issuance is blank → reset to original DB status
    if (allIssuances.some(qty => qty === "" || qty === null || qty === undefined)) {
      setSelectedStatus(header.ris_status); 
      setIsStatusLocked(false);
      return;
    }

    // If any issuance has a value (including 0) → Completed
    setSelectedStatus("completed");
    setIsStatusLocked(true);
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
      setResponseMessage(result.message);
      setShowResponse(true);

      if (result.status === "success" && refreshTable) {
        refreshTable();
      }
    } catch (err) {
      console.error("Update error:", err);
      setResponseMessage("An error occurred while updating. Please try again.");
      setShowResponse(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit → show confirm first
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true); // 👈 show confirmation popup instead of submitting immediately
  };

  if (!header) return <p>Loading...</p>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
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
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={isStatusLocked}   // 🔒 locked only when issuance filled
          >
            <option value="pending">Pending</option>
            <option value="issuing">Issuing</option>
            {/* Show Completed if locked OR current status is completed */}
            {(isStatusLocked || selectedStatus === "completed") && (
              <option value="completed">Completed</option>
            )}
          </select>
          </div>

          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="row g-3 border p-2 mb-2" key={index}>
                {/* Requisition Section */}
                <div className="col-12 mt-3">
                  <h5>Requisition</h5>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Item ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.ris_asset_ID}
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Property No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.asset_property_no || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">UOM</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.UOM || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.asset_description}
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Quantity (Requisition)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity_requisition}
                    readOnly
                  />
                </div>

                {/* Issuance Section */}
                <div className="col-12 mt-3">
                  <h5>Issuance</h5>
                </div>
                {/* Items Issuance Section */}
                <div className="col-md-4">
                  <label className="form-label fw-bold">Quantity (Issuance)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity_issuance || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].quantity_issuance = e.target.value;
                      setItems(newItems);

                      checkAndSetStatusLock(newItems, consumables);
                    }}
                    readOnly={header.ris_status === "completed"}
                  />
                </div>

                <div className="col-md-4">
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
                    readOnly={header.ris_status === "completed"}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No items found</p>
          )}
        </div>

        {consumables.length > 0 && (
          <>
            {consumables.map((c, index) => (
              <div className="row g-3 border p-2 mb-2" key={index}>
                <div className="col-12 mt-3">
                  <h5>Requisition</h5>
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
                <div className="col-md-4">
                  <label className="form-label fw-bold">Quantity (Issuance)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={c.quantity_issuance ?? ""}
                    onChange={(e) => {
                      const newConsumables = [...consumables];
                      newConsumables[index].quantity_issuance = e.target.value=== "" ? null : Number(e.target.value);
                      setConsumables(newConsumables);

                      checkAndSetStatusLock(items, newConsumables);
                    }}
                    readOnly={header.ris_status === "completed"}
                  />
                </div>
                <div className="col-md-4">
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
                    readOnly={header.ris_status === "completed"}
                  />
                </div>
              </div>
            ))}
          </>
        )}

    {/* Submit Button */}
    {header.ris_status !== "cancelled" && header.ris_status !== "completed" && (
      <div className="text-end mt-3">
        <button type="submit" className="btn btn-form-green" disabled={loading}>
          {loading ? "Saving..." : "Update"}
        </button>
      </div>
    )}

    </form>

      {/* Popups */}
      <Popups
        showConfirmYesNo={showConfirm}
        confirmYesNoTitle="Confirm Update"
        confirmYesNoBody="Are you sure you want to update this issuance? This action cannot be undone."
        confirmYesLabel="Yes, Update"
        confirmNoLabel="Cancel"
        onConfirmYes={() => {
          setShowConfirm(false);
          submitUpdate(); // 👈 run real request only if user confirms
        }}
        onConfirmNo={() => setShowConfirm(false)}
        
        showResponse={showResponse}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
        
        showLoading={loading}
      />
    </div>
  );
};

export default RequisitionIssueDetails;