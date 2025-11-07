import React, { useState, useEffect } from "react";
import Select from "react-select";
import Popups from "/src/components/Popups.jsx";

const AssetMultiEdit = ({ assetIDs, fetchAssets }) => {
  const [field, setField] = useState("");
  const [allOptions, setAllOptions] = useState({});
  const [options, setOptions] = useState([]);
  const [newValue, setNewValue] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isConditionDisabled, setIsConditionDisabled] = useState(false);
  const [lockedAssets, setLockedAssets] = useState([]);

  useEffect(() => {
    fetch("/api/dropdown_fetch.php")
      .then((res) => res.json())
      .then((data) => setAllOptions(data))
      .catch((err) => console.error(err));
  }, []);

  // Check if any selected asset is locked in RIS/BRS
  useEffect(() => {
    if (!assetIDs || assetIDs.length === 0) return;

    fetch("/api/Assets-Handlers/checkAssetLockStatus.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: assetIDs }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLockedAssets(data.locked || []);
        setIsConditionDisabled(data.hasLocked);
      })
      .catch((err) => console.error("Check lock failed:", err));
  }, [assetIDs]);

  useEffect(() => {
    if (field) {
      let selectedOptions = [];

      switch (field) {
        case "is_borrowable":
          selectedOptions = [
            { value: "yes", label: "Yes, make these assets borrowable" },
            { value: "no", label: "No, don't make these assets borrowable" },
          ];
          break;

        case "brand":
          selectedOptions = allOptions.brands?.map((b) => ({
            value: b.brand_ID,
            label: b.brand_name,
          }));
          break;

        case "asset_classification":
          selectedOptions = allOptions.asset_classifications?.map((cls) => ({
            value: cls.asset_classification_ID,
            label: cls.asset_classification,
          }));
          break;

        case "acquisition_source":
          selectedOptions = allOptions.acquisition_sources?.map((a) => ({
            value: a.a_source_ID,
            label: a.a_source_name,
          }));
          break;

        case "asset_condition":
          if (isConditionDisabled) {
            setResponseMessage(
              "Asset condition change is disabled — one or more selected assets are part of an active RIS or BRS."
            );
            setShowResponse(true);
            selectedOptions = []; // block options
          } else {
            selectedOptions = allOptions.asset_conditions?.map((c) => ({
              value: c.asset_condition_ID,
              label: c.condition_name,
            }));
          }
          break;

        default:
          selectedOptions = [];
      }

      setOptions(selectedOptions || []);
      setNewValue(null); // reset
    } else {
      setOptions([]);
    }
  }, [field, allOptions, isConditionDisabled]);

  const handleMultiUpdate = () => {
    if (!field || !newValue) {
      setResponseTitle("⚠️ Incomplete Action");
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
        newValue: newValue.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResponseTitle("✅ Update Success");
        setResponseMessage(data.message || "Assets updated successfully.");
        setShowResponse(true);
        if (fetchAssets) fetchAssets();
      })
      .catch((err) => {
        console.error("Multi update failed:", err);
        setResponseTitle("❌ Failed");
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
              <option value="is_borrowable">Borrowable</option>
              <option value="brand">Brand</option>
              <option value="asset_classification">Asset Classification</option>
              <option value="acquisition_source">Acquisition Source</option>
              <option
                value="asset_condition"
                disabled={isConditionDisabled}
              >
                Asset Condition
              </option>
            </select>
            {isConditionDisabled && (
              <small className="text-danger">
                Cannot update Asset Condition: assets currently in use (RIS/BRS).
              </small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Select New Data</label>
            <Select
              options={options}
              value={newValue}
              onChange={(selected) => setNewValue(selected)}
              isClearable
              isDisabled={field === "asset_condition" && isConditionDisabled}
              placeholder={
                isConditionDisabled && field === "asset_condition"
                  ? "Disabled due to active RIS/BRS"
                  : "Type or select..."
              }
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </div>
  );
};

export default AssetMultiEdit;
