import React, { useEffect, useState } from "react";
import Popups from "/src/components/Popups";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";

const ReservationBorrowingDetails = ({ brsID, onClose, refreshTable }) => {
  const { send: sendWS, isConnected: wsConnected } = useWebSocketContext();
  const { lastMessage, isConnected } = useWebSocketContext();
      
  const [reservation, setReservation] = useState(null);
  const [originalStatus, setOriginalStatus] = useState(""); 
  const [originalAssets, setOriginalAssets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const [isStatusAuto, setIsStatusAuto] = useState(false);

  // Fetch details
  useEffect(() => {
    if (!brsID) return;
    fetchDetails();
  }, [brsID]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/Reservation-Borrowing-Handlers/fetch_brs_by_id.php?brs_ID=${brsID}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
          setReservation(data.reservation);
          setAssets(
            data.assets.map((a) => ({
              ...a,
              enableReturnRemarks: false,
              borrowLocked: !!a.borrow_asset_remarks,
              lockQty:
                a.qty_issuance !== null && a.qty_issuance !== "" && !isNaN(a.qty_issuance),
            }))
          );
          // store backend snapshot for reference
          setOriginalStatus(data.reservation.brs_status);
          setOriginalAssets(data.assets); 

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

  // Handle status change (manual when not auto)
  const handleStatusChange = (e) => {
    if (!isStatusAuto) {
      setReservation((prev) => ({ ...prev, brs_status: e.target.value }));
    }
  };

  // Handle asset field changes
  const handleAssetChange = (index, field, value) => {
  setAssets((prev) => {
    const newAssets = [...prev];
    const asset = { ...newAssets[index] };

    if (field === "qty_issuance") {
      // handle empty string (user clearing input)
      const val = value === "" ? "" : Number(value);
      const max = Number(asset.qty_brs);

      // allow 0
      if (value !== "" && (val <= 0 || val > max)) {
        setResponseTitle("⚠️ Invalid Input");
        setResponseMessage(`The issued quantity must be a positive number and cannot exceed the original request (${max})`);
        setShowResponse(true);
        return prev; // stop update
      }

      asset[field] = val; // this now correctly accepts 0
    } else {
      asset[field] = value;
    }

    if (field === "is_available") {
      if (value === "no") {
        asset.qty_issuance = 0;
        asset.lockQty = true; // prevent user editing
        // ensure remarks field visible for required entry
        if (!asset.borrow_asset_remarks) asset.borrow_asset_remarks = "";
      } else {
        // switching back to yes/pending
        if (asset.qty_issuance === 0) asset.qty_issuance = ""; // clear it
        asset.lockQty = false;
        // remarks optional again
      }
    }


    newAssets[index] = asset;
    return newAssets;
  });
};

  // Auto status logic (now with proper "on-going" stage)
  useEffect(() => {
    if (!assets.length || !reservation) return;

    const hasQtyIssuance = assets.some(
      (a) =>
        a.qty_issuance !== null &&
        a.qty_issuance !== "" &&
        !isNaN(a.qty_issuance) &&
        Number(a.qty_issuance) > 0
    );

    const hasAvailability = assets.some(
      (a) => a.is_available === "yes" || a.is_available === "no"
    );

    const allNoAvailability = assets.every((a) => a.is_available === "no");

    const allReturned =
      assets
        .filter((a) => Number(a.qty_issuance) > 0)
        .every(
          (a) =>
            (a.return_asset_remarks && a.return_asset_remarks.trim() !== "") ||
            a.enableReturnRemarks
        ) && assets.some((a) => Number(a.qty_issuance) > 0);

    // CASE 1: All unavailable → Completed
    if (allNoAvailability) {
      setReservation((prev) => ({ ...prev, brs_status: "completed" }));
      setIsStatusAuto(true);
      return;
    }

    // CASE 2: All returned → Completed
    if (allReturned) {
      setReservation((prev) => ({ ...prev, brs_status: "completed" }));
      setIsStatusAuto(true);
      return;
    }

    // CASE 3: Some items issued → On-Going
    if (hasQtyIssuance) {
      setReservation((prev) => ({ ...prev, brs_status: "on-going" }));
      setIsStatusAuto(true);
      return;
    }

    // CASE 4: Availability decided but no issuance → Issuing
    if (hasAvailability) {
      setReservation((prev) => ({ ...prev, brs_status: "issuing" }));
      setIsStatusAuto(true);
      return;
    }

    // CASE 5: Default → revert to original
    setReservation((prev) => ({ ...prev, brs_status: originalStatus }));
    setIsStatusAuto(false);
  }, [assets, originalStatus]);



const validateAssets = () => {
  for (const asset of assets) {
    const qty = asset.qty_issuance;
    const remarks = asset.borrow_asset_remarks?.trim();

    // CASE 1: "No" availability → must have remarks and qty = 0
    if (asset.is_available === "no") {
      if (qty !== 0 || !remarks) {
        setResponseTitle("⚠️ Invalid Input");
        setResponseMessage(
          `Unavailable items must have 0 quantity and a remark. Please fix "${asset.asset_type}" (${asset.kld_property_tag}).`
        );
        setShowResponse(true);
        return false;
      }
    }

    // CASE 2: "Yes" availability
    if (asset.is_available === "yes") {
      const hasQty = qty !== "" && qty !== null && !isNaN(qty);
      const hasRemarks = !!remarks;

      // Rule A: has qty but missing remarks → invalid
      if (hasQty && !hasRemarks) {
        setResponseTitle("⚠️ Invalid Input");
        setResponseMessage(
          `For available items, please provide remarks when issuing quantity for "${asset.asset_type}" (${asset.kld_property_tag}).`
        );
        setShowResponse(true);
        return false;
      }

      // Rule B: has remarks but missing qty → invalid
      if (!hasQty && hasRemarks) {
        setResponseTitle("⚠️ Invalid Input");
        setResponseMessage(
          `For available items, please provide a quantity issued when entering remarks for "${asset.asset_type}" (${asset.kld_property_tag}).`
        );
        setShowResponse(true);
        return false;
      }

      // Rule C: negative qty
      if (hasQty && Number(qty) < 0) {
        setResponseTitle("⚠️ Invalid Input");
        setResponseMessage(
          `Invalid quantity for "${asset.asset_type}" (${asset.kld_property_tag}).`
        );
        setShowResponse(true);
        return false;
      }
    }
  }

  return true;
};

  const checkChanges = () =>{
     for (const asset of assets) {
      const hasQty = asset.qty_issuance !== "" && asset.qty_issuance !== null;
      const hasRemarks = asset.borrow_asset_remarks?.trim() !== "" && asset.borrow_asset_remarks !== null;
      const hasAvailability = asset.is_available === "yes" || asset.is_available === "no";
      
      // this prevents submitting without any update at all
      if (!hasAvailability && !hasQty && !hasRemarks) {
        return false;
      }
    }

     return true;
  }

 // Actual backend update (only runs after confirmation)
  const submitUpdate = async () => {
    setShowLoading(true);
    try {
      const res = await fetch("/api/Reservation-Borrowing-Handlers/update_brs.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brs_ID: reservation.brs_ID,
          brs_status: reservation.brs_status,
          assets: assets.map((a) => ({
            brs_asset_ID: a.brs_asset_ID,
            is_available: a.is_available || null,
            qty_issuance:
            a.qty_issuance === "" || a.qty_issuance === undefined
              ? null
              : a.qty_issuance,
            borrow_asset_remarks: a.borrow_asset_remarks || null,
            enableReturnRemarks: a.enableReturnRemarks || false,
            return_asset_remarks: a.return_asset_remarks || null,
          })),
        }),
      });
      const data = await res.json();

      setResponseTitle("✅ Update Success");
      setResponseMessage(
        data.message || (data.success ? "Updated successfully!" : "Update failed.")
      );
      setShowResponse(true);
      if (data.success && refreshTable)
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
    } catch (err) {
      console.error(err);
      setResponseTitle("❌ Failed");
      setResponseMessage("Error updating reservation.");
      setShowResponse(true);
    } finally {
      setShowLoading(false);
    }
  };

  // Form submit handler (shows confirm first)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAssets()) {
      setResponseTitle("⚠️ Invalid Input");
      setResponseMessage(
        "Please fill both Quantity Issued and Remarks for each asset before submitting."
      );
      setShowResponse(true);
      return;
    }
    if(!checkChanges()) {
      setResponseTitle("⚠️ Invalid Input");
      setResponseMessage(
        "Some items has no changes"
      );
      setShowResponse(true);
      return;
    };
    setShowConfirm(true); // show popup first
  };

  if (loading) return <p>Loading reservation details...</p>;
  if (!reservation) return <p>No reservation found.</p>;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Borrower's Name</label>
            <input type="text" className="form-control" value={reservation.full_name || ""} disabled />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Institute/Unit</label>
            <input type="text" className="form-control" value={reservation.unit_name || ""} disabled />
          </div>
          <div className="col-md-12">
            <label className="form-label fw-bold">Purpose</label>
            <textarea className="form-control" value={reservation.purpose || ""} disabled></textarea>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">BRS No.</label>
            <input
              type="text"
              className="form-control"
              value={reservation.brs_no || ""}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Date Requested</label>
            <input
              type="date"
              className="form-control"
              value={reservation.created_at?.split(" ")[0] || ""}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Date of Use</label>
            <input
              type="date"
              className="form-control"
              value={reservation.date_of_use || ""}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Time of Use</label>
            <input
              type="time"
              className="form-control"
              value={reservation.time_of_use || ""}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Date of Return</label>
            <input
              type="date"
              className="form-control"
              value={reservation.date_of_return || ""}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Time of Return</label>
            <input
              type="time"
              className="form-control"
              value={reservation.time_of_return || ""}
              disabled
            />
          </div>


          <div className="col-md-3">
            <label className="form-label fw-bold">Status</label>
            <select
              className="form-select"
              value={reservation.brs_status || ""}
              onChange={handleStatusChange}
              // disabled={isStatusAuto}
              disabled
            >
              <option value="pending">Pending</option>
              <option value="issuing">Issuing</option>
              <option value="on-going">On-Going</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

          <h4>Assets for Reservation / Borrowing</h4>
          {assets.length > 0 ? (
            assets.map((asset, index) => (
              <div key={asset.brs_asset_ID} className="border border-success rounded p-3 mb-3">
                <div className="row g-2 mb-2">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${asset.asset_type} - ${asset.brand_name} (${asset.kld_property_tag})`}
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">UOM</label>
                    <input type="text" className="form-control" value={asset.UOM_brs || ""} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Quantity Requested</label>
                    <input type="number" className="form-control" value={asset.qty_brs || ""} disabled />
                  </div>
                </div>

              <div className="row g-2 mb-2">
                  <div className="section-divider">
                    <span>Admin Fields</span>
                  </div>
                  {/* Borrow Remarks */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Availability</label>
                    <select
                        className="form-select"
                        value={asset.is_available ?? ""}
                        onChange={(e) =>
                          handleAssetChange(index, "is_available", e.target.value)
                        }
                        disabled={originalStatus !== "pending"} //disable based on DB status
                      >
                      <option value="">Pending</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Quantity Issued</label>
                    <input
                      type="number"
                      className="form-control"
                      value={asset.qty_issuance === 0 ? 0 : asset.qty_issuance || ""}
                      onChange={(e) =>
                        handleAssetChange(index, "qty_issuance", e.target.value)
                      }
                      disabled={asset.lockQty || originalStatus === "pending"}
                    />
                  </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Borrow Remarks</label>
                  <input
                      type="text"
                      className="form-control"
                      placeholder="Enter borrow remarks"
                      value={asset.borrow_asset_remarks || ""}
                      disabled={
                        asset.borrowLocked ||
                        (originalStatus === "pending" && asset.is_available !== "no")
                      }
                      onChange={(e) =>
                        handleAssetChange(index, "borrow_asset_remarks", e.target.value)
                      }
                    />
                </div>

                {/* Return Remarks */}
                <div className="col-md-6">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="form-label fw-bold d-flex align-items-center gap-2">
                      {/* Checkbox beside label, only show if no value from DB */}
                      {!asset.return_asset_remarks && 
                       originalStatus === "on-going" && 
                       asset.is_available !== "no" && (
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={!!asset.enableReturnRemarks}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setAssets((prev) =>
                              prev.map((item, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      enableReturnRemarks: checked,
                                      // reset remarks when unchecked
                                      return_asset_remarks: !checked
                                        ? ""
                                        : item.return_asset_remarks || "",
                                    }
                                  : item
                              )
                            );
                          }}
                        />
                      )}
                      Return Remarks
                    </label>
                  </div>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter return remarks"
                    value={asset.return_asset_remarks || ""}
                    required
                    disabled={
                      (!!asset.return_asset_remarks && !asset.enableReturnRemarks) ||
                      (!asset.return_asset_remarks && !asset.enableReturnRemarks)
                    }
                    onChange={(e) =>
                      handleAssetChange(index, "return_asset_remarks", e.target.value)
                    }
                  />
                </div>
              </div>
              </div>
            ))
          ) : (
            <p>No assets found for this reservation.</p>
          )}
       

        <div className="text-end mt-3">
          {reservation.brs_status !== "cancelled" &&
            originalAssets.some(
              (a) =>
                (!a.borrow_asset_remarks?.trim() || !a.return_asset_remarks?.trim())
            ) && (
              <button
                type="submit"
                className="btn btn-form-green"
                disabled={showLoading}
              >
                {showLoading ? "Updating..." : "Update Reservation"}
              </button>
            )}
        </div>
      </form>

      <Popups
        showConfirmYesNo={showConfirm}
        confirmYesNoTitle="⚠️ Confirm Update"
        confirmYesNoBody="Are you sure you want to update this reservation? This action cannot be undone."
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

        showLoading={showLoading}
      />
    </>
  );
};

export default ReservationBorrowingDetails;
