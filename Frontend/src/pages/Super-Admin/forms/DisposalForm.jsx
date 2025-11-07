import React, { useState, useEffect } from "react";
import Select from "react-select";
import Popups from "/src/components/Popups";
import QRScannerModal from "/src/components/QRScannerModal";

const DisposalForm = ({ onSuccess }) => {
  const [items, setItems] = useState([
    { asset: null, propertyTag: "", model: "", description: "" },
  ]);
  const [options, setOptions] = useState([]);

  // Popups
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // NEW: Confirmation + Loading
  const [showConfirmYesNo, setShowConfirmYesNo] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // QR Scanner
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanningIndex, setScanningIndex] = useState(null);

  // Fetch assets from backend
  useEffect(() => {
    fetch("/api/Disposal-Hanlders/fetch_disposal_asset.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.assets) {
          const opts = data.assets.map((a) => ({
            value: a.asset_ID,
            label: `${a.kld_property_tag} - ${a.property_tag}`,
            propertyTag: a.property_tag,
            model: a.asset_type,
            description: a.brand_name,
            kldTag: a.kld_property_tag,
          }));
          setOptions(opts);
        }
      })
      .catch((err) => console.error("Error fetching assets:", err));
  }, []);

  // Prevent duplicate
  const isDuplicate = (value) => {
    return items.some((i) => i.asset?.value === value);
  };

  // Add new row
  const addItem = () =>
    setItems([
      ...items,
      { asset: null, propertyTag: "", model: "", description: "" },
    ]);

  // Remove row
  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Handle react-select change
  const handleAssetChange = (index, selectedOption) => {
    if (selectedOption && isDuplicate(selectedOption.value)) {
      setResponseTitle("❌ Error");
      setResponseMessage("This asset has already been added.");
      setShowResponse(true);
      return;
    }

    const updated = [...items];
    updated[index] = {
      asset: selectedOption,
      propertyTag: selectedOption?.propertyTag || "",
      model: selectedOption?.model || "",
      description: selectedOption?.description || "",
    };
    setItems(updated);
  };

  // Handle manual input change
  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Handle QR scan success
  const handleScanSuccess = (decodedText) => {
    if (scanningIndex === null) return;

    const matched = options.find((opt) => opt.kldTag === decodedText);

    if (!matched) {
      setResponseTitle("❌ Error");
      setResponseMessage("Scanned QR does not match any available asset.");
      setShowResponse(true);
    } else if (isDuplicate(matched.value)) {
      setResponseTitle("❌ Error");
      setResponseMessage("This asset has already been added.");
      setShowResponse(true);
    } else {
      handleAssetChange(scanningIndex, matched);

      setResponseTitle("✅ QR Scanned");
      setResponseMessage(`Scanned asset: ${decodedText}`);
      setShowResponse(true);
    }

    setShowQRScanner(false);
    setScanningIndex(null);
  };

  // === SUBMISSION LOGIC ===
  const handleSubmit = (e) => {
    e.preventDefault();
    // Instead of submitting immediately, open confirmation
    setShowConfirmYesNo(true); // NEW
  };

  const confirmSubmission = async () => {
    setShowConfirmYesNo(false);
    setShowLoading(true); // show loading while submitting

    // Prepare payload
    const payload = items.map((item) => ({
      asset_ID: item.asset?.value,
      propertyTag: item.propertyTag,
      model: item.model,
      description: item.description,
    }));

    try {
      const res = await fetch("/api/Disposal-Hanlders/submit_disposal.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assets: payload }),
      });

      const data = await res.json();
      setShowLoading(false);

      if (data.success) {
        setResponseTitle("✅ Success");
        setResponseMessage(data.message || "Disposal request submitted.");
        setShowResponse(true);

        // Reset form
        setItems([{ asset: null, propertyTag: "", model: "", description: "" }]);
        onSuccess();
      } else {
        setResponseTitle("❌ Error");
        setResponseMessage(data.message || "Failed to submit disposal request.");
        setShowResponse(true);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setShowLoading(false);
      setResponseTitle("❌ Error");
      setResponseMessage("An error occurred while submitting the form.");
      setShowResponse(true);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {items.map((item, index) => (
              <div key={index} className="row g-3 align-items-end mb-3">
                {/* For Disposal Assets */}
                <div className="col-md-6" title="Select or Scan KLD Property Tag">
                  <label className="form-label fw-bold">For Disposal Assets</label>
                    <Select
                      options={options.filter(
                        (opt) =>
                          !items.some(
                            (i, idx) => i.asset?.value === opt.value && idx !== index
                          )
                      )}
                      value={item.asset}
                      onChange={(selected) => handleAssetChange(index, selected)}
                      placeholder="Select Disposable Asset"
                    />
                </div>

                {/* Property Tag */}
                <div className="col-md-4">
                  <label className="form-label fw-bold">Property Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Property Tag"
                    value={item.propertyTag}
                    readOnly
                  />
                </div>

                {/* Model */}
                <div className="col-md-4">
                  <label className="form-label fw-bold">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Model"
                    value={item.model}
                    readOnly
                  />
                </div>

                {/* Description */}
                <div className="col-md-4">
                  <label className="form-label fw-bold">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    value={item.description}
                    readOnly
                  />
                </div>

                {/* Scan QR Button */}
                <div className="col-md-2">
                  <button
                    title="Scan Asset QR code"
                    type="button"
                    className="btn btn-form-yellow w-100"
                    onClick={() => {
                      setScanningIndex(index);
                      setShowQRScanner(true);
                    }}
                  >
                    Scan QR
                  </button>
                </div>

                {/* Remove Button */}
                <div className="col-md-3">
                  {items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-form-red w-100"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add Button */}
            <div className="col-md-3">
              <button
                type="button"
                className="btn btn-form-green mt-2"
                onClick={addItem}
              >
                +
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="submit" className="btn btn-form-green">
              Create
            </button>
          </div>
        </form>
      </div>

      {/* Popups */}
      <Popups
        showConfirmYesNo={showConfirmYesNo}
        confirmYesNoTitle="⚠️ Submit Disposal Request"
        confirmYesNoBody={`You are about to submit ${items.filter(i => i.asset !== null).length} asset(s) for disposal. These assets will be moved to Unserviceable Assets. Continue?`}
        confirmYesLabel="Yes, Submit"
        confirmNoLabel="Cancel"
        onConfirmYes={confirmSubmission}
        onConfirmNo={() => setShowConfirmYesNo(false)}
        
        // Loading
        showLoading={showLoading}
        loadingText="Submitting your request..."
        
        // Response
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />


      {/* QR Scanner */}
      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => {
          setShowQRScanner(false);
          setScanningIndex(null);
        }}
        onScanSuccess={handleScanSuccess}
      />
    </>
  );
};

export default DisposalForm;
