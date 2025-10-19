import React, { useState, useEffect } from "react";
import Select from "react-select";
import Popups from "/src/components/Popups.jsx";

const AssetMultiEdit = ({ assetIDs, fetchAssets }) => {
  const [field, setField] = useState("");
  const [allOptions, setAllOptions] = useState({});
  const [options, setOptions] = useState([]);
  const [newValue, setNewValue] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    fetch("/api/dropdown_fetch.php")
      .then((res) => res.json())
      .then((data) => setAllOptions(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (field) {
      let selectedOptions = [];

      switch (field) {
        case "brand":
          selectedOptions = allOptions.brands?.map((b) => ({
            value: b.brand_ID,
            label: b.brand_name,
          }));
          break;

        case "acquisition_source":
          selectedOptions = allOptions.acquisition_sources?.map((a) => ({
            value: a.a_source_ID,
            label: a.a_source_name,
          }));
          break;

        case "asset_condition":
          selectedOptions = allOptions.asset_conditions?.map((c) => ({
            value: c.asset_condition_ID,
            label: c.condition_name,
          }));
          break;

        default:
          selectedOptions = [];
      }

      setOptions(selectedOptions || []);
      setNewValue(null); // reset when field changes
    } else {
      setOptions([]);
    }
  }, [field, allOptions]);

  const handleMultiUpdate = () => {
    if (!field || !newValue) {
      setResponseMessage("Please select a field and a new value.");
      setShowResponse(true);
      return;
    }

    fetch("/api/Assets-Handlers/update_multi_assets.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: assetIDs,
        field,
        newValue: newValue.value, // send the ID
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResponseMessage(data.message || "Assets updated successfully.");
        setShowResponse(true);
        if (fetchAssets) fetchAssets();
      })
      .catch((err) => {
        console.error("Multi update failed:", err);
        setResponseMessage("Failed to update assets.");
        setShowResponse(true);
      });
  };

  return (
    <div>
      <form>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label fw-bold">Field to Change</label>
            <select
              name="field"
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="form-control"
            >
              <option value="">Select Field</option>
              <option value="brand">Brand</option>
              <option value="acquisition_source">Acquisition Source</option>
              <option value="asset_condition">Asset Condition</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Select New Data</label>
            <Select
                options={options}
                value={newValue}
                onChange={(selected) => setNewValue(selected)}
                isClearable
                placeholder="Type or select..."
                menuPortalTarget={document.body}   // Portal to body
                styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Keep it on top
                }}
            />
          </div>
        </div>
      </form>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button onClick={handleMultiUpdate} className="btn btn-form-green">
          Update Selected
        </button>
      </div>

      <Popups
        showResponse={showResponse}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </div>
  );
};

export default AssetMultiEdit;
