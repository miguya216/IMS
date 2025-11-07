import React, { useState, useEffect } from "react";
import Popups from "/src/components/Popups.jsx";

const ReferenceForm = () => {
  const [selectedType, setSelectedType] = useState("");
  const [newValue, setNewValue] = useState("");
  const [assetTypes, setAssetTypes] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState("");

  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch asset types once when brand is selected
  useEffect(() => {
    if (selectedType === "brand") {
      fetch("/api/Reference-Data/fetch_ref_data.php?action=asset_type")
        .then((res) => res.json())
        .then((data) => setAssetTypes(data))
        .catch((err) => console.error("Error fetching asset types:", err));
    }
  }, [selectedType]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedType || !newValue.trim() || (selectedType === "brand" && !selectedAssetType)) {
    setResponseTitle("⚠️ Invalid Input");
    setResponseMessage("Please complete all fields.");
    setShowResponse(true);
    return;
  }

  setLoading(true);
  try {
    const response = await fetch("/api/Reference-Data/insert_reference.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedType,
        newValue,
        asset_type_ID: selectedType === "brand" ? selectedAssetType : null,
      }),
    });

    const result = await response.json();
    const formattedMessage = result.message
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    setResponseTitle("✅ New Data Inserted");
    setResponseMessage(formattedMessage);
    setShowResponse(true);

    if (result.success) {
      setTimeout(() => {
        window.location.reload();
      }, 2000); 
    }

  } catch (error) {
    console.error("Error submitting reference:", error);
    setResponseTitle("❌ Failed");
    setResponseMessage("An error occurred while saving. Please try again.");
    setShowResponse(true);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="row mb-4 align-items-end">
          {/* Reference Type Dropdown */}
          <div className="col-md-4">
            <label htmlFor="refType" className="form-label fw-bold">
              Select Reference Type
            </label>
            <select
              id="refType"
              className="form-select"
              style={{ height: "42px" }}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="" disabled>
                Select Reference Type
              </option>
              <option value="acquisition_source">Acquisition Source</option>
              <option value="asset_classification">Asset Classificationn</option>
              <option value="asset_condition">Asset Condition</option>
              <option value="asset_type">Asset Type</option>
              <option value="brand">Brand</option>
              <option value="transfer_type">Transfer Type</option>
              <option value="room">Room</option>
              <option value="unit">Unit</option>
            </select>
          </div>

          {/* Conditional Asset Type Dropdown */}
          {selectedType === "brand" && (
            <div className="col-md-4">
              <label htmlFor="assetTypeSelect" className="form-label fw-bold">
                Select Asset Type
              </label>
              <select
                id="assetTypeSelect"
                className="form-select"
                style={{ height: "42px" }}
                value={selectedAssetType}
                onChange={(e) => setSelectedAssetType(e.target.value)}
              >
                <option value="" disabled>Select Asset Type</option>
                {assetTypes.map((type) => (
                  <option key={type.asset_type_ID} value={type.asset_type_ID}>
                    {type.asset_type}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Input Field */}
          <div className="col-md-4">
            <label htmlFor="refValue" className="form-label fw-bold">
              New Value
            </label>
            <input
              type="text"
              id="refValue"
              className="form-control"
              style={{ height: "42px" }}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={
                selectedType ? `Enter new ${selectedType}` : "Enter new value"
              }
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-end">
          <button
            type="submit"
            className="btn btn-form-green"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      <Popups
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
        showLoading={loading}
      />
    </div>
  );
};

export default ReferenceForm;
