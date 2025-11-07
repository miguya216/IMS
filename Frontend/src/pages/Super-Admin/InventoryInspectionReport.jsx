import { useState, useEffect } from "react";
import "bootstrap/js/dist/collapse";
import Popups from "/src/components/Popups.jsx";
import Modalbigger from "/src/components/Modal-bigger";
import { generateIIRPDF } from "/src/pages/Super-admin/forms/functions/generateIIRPDF.jsx";
import Select from "react-select";
import QRScannerModal from "/src/components/QRScannerModal";

const InventoryInspectionReport = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [assets, setAssets] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [userUnit, setUserUnit] = useState("");

  // Popup States
  const [showConfirmYesNo, setShowConfirmYesNo] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // PDF preview states
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [selectedPDFName, setSelectedPDFName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showQRScanner, setShowQRScanner] = useState(false);

  const [reportDate, setReportDate] = useState(() => {
    const now = new Date();

    //for DB
    const isoDate = now.toISOString().slice(0, 19).replace("T", " "); // e.g. 2025-10-25 08:18:17

    //for display (PDF)
    const displayDate = now
      .toLocaleDateString("en-GB") // gives dd/mm/yyyy
      .split("/")
      .join("/");

    return { isoDate, displayDate };
  });



  // Fetch users & asset conditions only on mount
  useEffect(() => {
    fetch("/api/dropdown_fetch.php")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setConditions(data.asset_conditions || []);
      });
  }, []);

  // Fetch rooms when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetch(`/api/Inventory-Inspection-Hanlders/getRoomsByUser.php?user=${selectedUser}`)
        .then((res) => res.json())
        .then((data) => {
          setRooms(data || []);
          setSelectedRoom("");
          if (data && data.length > 0) {
            setUserUnit(data[0].unit_name || "");
          } else {
            setUserUnit("");
          }
        });
    } else {
      setRooms([]);
      setSelectedRoom("");
      setUserUnit("");
    }
  }, [selectedUser]);

  // Fetch assets when user & room selected
  useEffect(() => {
    if (selectedUser && selectedRoom) {
      fetch(`/api/Inventory-Inspection-Hanlders/getAssetsByUserRoom.php?user=${selectedUser}&room=${selectedRoom}`)
        .then((res) => res.json())
        .then((data) => {
          const preparedAssets = data.map((a) => ({
            ...a,
            quantity: a.quantity || 1,
            unitCostInput: a.unit_cost || 0,
            totalCostInput: a.unit_cost || 0,
            accumulatedDepreciation: a.accumulated_depreciation || 0,
            accumulatedImpairment: a.accumulated_impairment || 0,
            carryingAmount: a.carrying_amount || 0,
            selectedCondition: a.asset_condition_ID?.toString() || "",
            conditionName:
              conditions.find((c) => c.asset_condition_ID === a.asset_condition_ID)?.condition_name || "",
            sale: a.sale || 0,
            transfer: a.transfer || 0,
            disposal: a.disposal || 0, 
            damage: a.damage || 0, 
            others: a.others || "",
          }));
          setAssets(preparedAssets);
        });
    } else {
      setAssets([]);
    }
  }, [selectedUser, selectedRoom]);

 const handleChange = (idx, field, value) => {
  setAssets((prevAssets) => {
    const updatedAssets = [...prevAssets];

    if (
      [
        "quantity",
        "unitCostInput",
        "totalCostInput",
        "accumulatedDepreciation",
        "accumulatedImpairment",
        "sale",
        "transfer",
        "disposal",
        "damage",
      ].includes(field)
    ) {
      updatedAssets[idx][field] = parseFloat(value) || 0;
    } else if (field === "others") {
      updatedAssets[idx][field] = value.trim() === "" ? "N/A" : value;
    } else if (field === "selectedCondition") {
      updatedAssets[idx][field] = value;
      updatedAssets[idx].conditionName =
        conditions.find((c) => c.asset_condition_ID.toString() === value)?.condition_name || "";
    } else {
      updatedAssets[idx][field] = value;
    }

    // Always recalc total cost if qty or unit cost changes
    if (field === "quantity" || field === "unitCostInput") {
      updatedAssets[idx].totalCostInput =
        updatedAssets[idx].quantity * updatedAssets[idx].unitCostInput;
    }

    // Only recalc carrying amount if depreciation or impairment > 0
    if (["quantity", "unitCostInput", "accumulatedDepreciation", "accumulatedImpairment"].includes(field)) {
      const totalCost = updatedAssets[idx].totalCostInput || 0;
      const depreciation = updatedAssets[idx].accumulatedDepreciation || 0;
      const impairment = updatedAssets[idx].accumulatedImpairment || 0;

      if (depreciation > 0 || impairment > 0) {
        updatedAssets[idx].carryingAmount = Math.max(
          0,
          totalCost - (depreciation + impairment)
        );
      } else {
        // when both are 0, freeze carryingAmount at 0
        updatedAssets[idx].carryingAmount = 0;
      }
    }

    return updatedAssets;
  });
};

  const handleSaveConfirmed = async () => {
    setShowConfirmYesNo(false);

    // Do the download here
    // const link = document.createElement("a");
    // link.href = pdfPreviewUrl;
    // link.download = selectedPDFName;
    // link.click();

    // Then proceed with saving
    setShowLoading(true);

    const payload = {
      user_ID: selectedUser,
      room_ID: selectedRoom,
      unit: userUnit,
      reportDate: reportDate.isoDate,
      assets: assets.map((a) => ({
        kld_property_tag: a.kld_property_tag,
        quantity: a.quantity,
        unitCost: a.unitCostInput,
        totalCost: a.totalCostInput,
        accumulatedDepreciation: a.accumulatedDepreciation,
        accumulatedImpairment: a.accumulatedImpairment,
        carryingAmount: a.carryingAmount, // use what’s in state
        condition: a.selectedCondition,
        sale: a.sale,
        transfer: a.transfer,
        disposal: a.disposal,
        damage: a.damage,
        others: a.others,
    })),
    };

    try {
      const res = await fetch(
        "/api/Inventory-Inspection-Hanlders/saveInspectionReport.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      setShowLoading(false);

      if (data.success) {
        setResponseTitle("✅ Inspection Report Saved")
        setResponseMessage("Inspection Report saved successfully!");
        setShowPdfPreview(false); // close modal only on success
      } else {
        setResponseMessage("Error saving report: " + data.message);
      }
      setShowResponse(true);
    } catch (err) {
      console.error("Save failed:", err);
      setShowLoading(false);
      setResponseTitle("❌ Inspection Report Failed")
      setResponseMessage("Something went wrong while saving.");
      setShowResponse(true);
    }
  };

  const handlePDFPreview = async () => {
    try {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);

      const selectedEmployee = users.find(
        (u) => u.user_ID === parseInt(selectedUser)
      );

      const result = await generateIIRPDF({
        employeeName: selectedEmployee?.full_name || "",
        role: selectedEmployee?.role_name || "",
        room:
          rooms.find((r) => r.room_ID === parseInt(selectedRoom))?.room_number ||
          "",
        unit: userUnit,
        assets,
        reportDate: reportDate.displayDate,
      });

      if (result) {
        setPdfPreviewUrl(result.url);
        setSelectedPDFName(result.filename);
        setShowPdfPreview(true);
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (err) {
      console.error("PDF preview error:", err);
    }
  };

  const filteredAssets = assets.filter((a) =>
    `${a.kld_property_tag} ${a.asset_type} ${a.brand_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleQRSuccess = (decodedText) => {
    setSearchTerm(decodedText);
    setShowQRScanner(false);
    setResponseMessage(`QR Code scanned successfully: ${decodedText}`);
    setShowResponse(true);
  };

  const handleQRError = (errorMessage) => {
    console.error("QR Scan error:", errorMessage);
  };

return (
    <>
      {/* Controls */}
      <h3>Inventory and Inspection Report</h3>
      <div className="form-panel container-fluid p-3 rounded shadow-sm">
        <div className="row g-3 align-items-end">
          <div title="Pick an employee from the list" className="col-md-3">
            <label className="form-label fw-semibold d-none d-md-block">Select Employee:</label>
            <Select
              options={users.map((u) => ({
                value: u.user_ID,
                label: u.full_name,
              }))}
              value={
                selectedUser
                  ? {
                      value: selectedUser,
                      label: users.find((u) => u.user_ID === parseInt(selectedUser))
                        ?.full_name,
                    }
                  : null
              }
              onChange={(opt) => setSelectedUser(opt ? opt.value : "")}
              placeholder="Select Employee"
              isClearable
            />
          </div>

          <div className="col-md-2">
            <label className="form-label d-none d-md-block">Unit</label>
            <input type="text" className="form-control" value={userUnit} readOnly style={{ height: "36px" }} />
          </div>

          <div title="Choose the room assigned of employee's asset" className="col-md-2">
            <label className="form-label fw-semibold d-none d-md-block">Select Room Assigned:</label>
            <Select
              options={rooms.map((r) => ({
                value: r.room_ID,
                label: r.room_number,
              }))}
              value={
                selectedRoom
                  ? {
                      value: selectedRoom,
                      label: rooms.find((r) => r.room_ID === parseInt(selectedRoom))
                        ?.room_number,
                    }
                  : null
              }
              onChange={(opt) => setSelectedRoom(opt ? opt.value : "")}
              placeholder="Select Room"
              isDisabled={!selectedUser}
              isClearable
            />
          </div>

          {/* Search Bar */}
          <div className="col-md-2">
            <div className="position-relative">
              <input
                title="Search by Property Tag, Type, or Brand..."
                type="text"
                className="form-control pe-5" // padding for the clear button
                placeholder="Search Asset"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  title="Clear"
                  type="button"
                  className="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-1"
                  style={{ border: "none" }}
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>


          <div className="col-auto">
            <button
              title="Scan asset QR codes"
              type="button"
              className="btn btn-form-yellow"
              onClick={() => setShowQRScanner(true)}
            >
              Scan QR
            </button>
          </div>

          <div className="col-auto">
           <button
              title="Preview the PDF"
              className="btn btn-form-green"
              onClick={handlePDFPreview}
              disabled={!selectedUser || !selectedRoom}
            >
              Commit
            </button>

          </div>
        </div>
      </div>

      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRSuccess}
        onScanError={handleQRError}
      />

       {/* Accordion with Filtered Assets */}
      <div className="accordion" id="assetsAccordion">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset, idx) => (
            <div
              className="accordion-item"
              key={asset.kld_property_tag || idx}
            >
              <h2 className="accordion-header" id={`heading-${idx}`}>
                <button
                  className={`accordion-button collapsed fw-bold ${
                    asset.markedDone ? "done-accordion" : ""
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${idx}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${idx}`}
                  style={{
                    background: asset.markedDone ? "#006705" : "white",
                    color: asset.markedDone ? "#fff" : "inherit",
                  }}
                >
                  {idx + 1}. {asset.kld_property_tag} / {asset.asset_type}{" "}
                  {asset.brand_name}
                </button>
              </h2>
              <div
                id={`collapse-${idx}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${idx}`}
                data-bs-parent="#assetsAccordion"
              >
                <div
                  className="accordion-body"
                  style={{ backgroundColor: "#fdff71" }}
                >
                  {/* --- Inventory Section --- */}
                  <h6 className="fw-bold mb-3">Inventory</h6>
                  
                  <div className="row g-2 align-items-end mb-3">
                    <div className="col-md-2">
                      <label className="form-label fw-semibold">Date Acquired</label>
                      <input type="text" className="form-control" value={asset.date_acquired} readOnly />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold">Description</label>
                      <input type="text" className="form-control" value={`${asset.asset_type} / ${asset.brand_name}`} readOnly />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold">Property No.</label>
                      <input type="text" className="form-control" value={asset.kld_property_tag} readOnly />
                    </div>
                    <div className="col-md-1">
                      <label className="form-label fw-semibold">Quantity</label>
                      <input type="number" className="form-control" value={asset.quantity} onChange={(e) => handleChange(idx, "quantity", e.target.value)} readOnly/>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold">Unit Cost</label>
                      <input type="number" className="form-control" value={asset.unitCostInput} readOnly />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold">Total Cost</label>
                      <input type="number" className="form-control" value={asset.totalCostInput} readOnly />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label fw-semibold">Accumulated Depreciation</label>
                      <input type="number" className="form-control" value={asset.accumulatedDepreciation} onChange={(e) => handleChange(idx, "accumulatedDepreciation", e.target.value)} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold">Accumulated Impairment Losses</label>
                      <input type="number" className="form-control" value={asset.accumulatedImpairment} onChange={(e) => handleChange(idx, "accumulatedImpairment", e.target.value)} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold">Carrying Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        value={asset.carryingAmount}
                        readOnly
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold">Condition</label>
                      <select
                        className="form-select"
                        value={asset.selectedCondition || ""}
                        onChange={(e) => handleChange(idx, "selectedCondition", e.target.value)}
                      >
                        <option value="">-- Select Condition --</option>
                        {conditions.map((cond) => (
                          <option key={cond.asset_condition_ID} value={cond.asset_condition_ID.toString()}>
                            {cond.condition_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <hr />

                  {/* --- Inspection and Disposal Section --- */}
              <h6 className="fw-bold mb-3">Inspection and Disposal</h6>
              <div className="row g-2 align-items-end">
                {["Sale", "Transfer", "Disposal", "Damage", "Others"].map(
                  (field) => (
                    <div className="col-md-2" key={field}>
                      <label className="form-label fw-semibold">{field}</label>
                      <input
                        type={field === "Others" ? "text" : "number"}
                        className="form-control"
                        value={asset[field.toLowerCase()]}
                        onChange={(e) =>
                          handleChange(
                            idx,
                            field.toLowerCase(),
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )
                )}

                    {/*  Checkbox for Mark as Done */}
                    <div className="form-check col-md-2 ms-0.5">
                      <input
                        title="Helps track assets that have already been inspected"
                        className="form-check-input"
                        type="checkbox"
                        id={`done-${idx}`}
                        checked={asset.markedDone || false}
                        onChange={(e) =>
                          setAssets((prev) =>
                            prev.map((item) =>
                              item.kld_property_tag === asset.kld_property_tag
                                ? { ...item, markedDone: e.target.checked }
                                : item
                            ))}
                      />
                      <label  
                      className="form-check-label fw-semibold" 
                      htmlFor={`done-${idx}`}>
                        Mark as done
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">
            No assets found. Please select employee.
          </p>
        )}
      </div>

       {/* Popups Integration */}
      <Modalbigger
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        title="Inventory Inspection PDF Preview"
        footer={
          <button
            className="btn btn-form-green"
            onClick={() => {
              // 🔹 Just ask for confirmation (don’t close modal, don’t download yet)
              setShowConfirmYesNo(true);
            }}
          >
            Confirm Inspection
          </button>
        }
      >
        <div style={{ height: "80vh" }}>
          {pdfPreviewUrl && (
            <iframe
              src={pdfPreviewUrl}
              title="Inventory PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </div>
      </Modalbigger>

        <Popups
          showConfirmYesNo={showConfirmYesNo}
          confirmYesNoTitle="⚠️ Confirm Save"
          confirmYesNoBody="Are you sure you want to save this inspection report? This record will be located at Inspection Records."
          confirmYesLabel="Yes, Save"
          confirmNoLabel="Cancel"
          onConfirmYes={handleSaveConfirmed}
          onConfirmNo={() => setShowConfirmYesNo(false)}
          showLoading={showLoading}
          loadingText="Saving inspection report..."
          showResponse={showResponse}
          responseTitle={responseTitle}
          responseMessage={responseMessage}
          onCloseResponse={() => setShowResponse(false)}
        />
    </>
  );
};

export default InventoryInspectionReport;