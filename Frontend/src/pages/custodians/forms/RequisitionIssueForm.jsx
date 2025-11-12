import React, { useState, useEffect } from "react";
import Popups from "/src/components/Popups";
import Select from "react-select";
import QRScannerModal from "/src/components/QRScannerModal";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";

const RequisitionIssuanceForm = ({ onClose, refreshTable }) => {
  const { send: sendWS, isConnected: wsConnected } = useWebSocketContext();

  const [type, setType] = useState(""); // Repair or Purchase
  const [category, setCategory] = useState(""); // Asset or Consumables
  const [risTypes, setRisTypes] = useState([]);
  const [adminAssets, setAdminAssets] = useState([]);
  const [custodianAssets, setCustodianAssets] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [items, setItems] = useState([{ description: "", quantity: 1, uom: "" }]);

  // Popups
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseTitle, setResponseTitle] = useState("");

  // QR Scanner
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanningIndex, setScanningIndex] = useState(null);

  // Fetch dropdown data
  useEffect(() => {
    fetch("/api/RIS-Handlers/fetch_RIS_selection.php")
      .then((res) => res.json())
      .then((data) => {
        setRisTypes(data.ris_tag_type || []);
        setAdminAssets(data.admin_assets || []);
        setCustodianAssets(data.custodian_assets || []);
        setConsumables(data.consumables || []);
      })
      .catch((err) => console.error("Error fetching dropdown data:", err));
  }, []);

  // Reset UOM and Quantity when type/category changes
  useEffect(() => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        uom: "",
        description: "",
        quantity: type === "1" || category === "Asset" ? 1 : item.quantity, // reset to 1 if Repair or Asset
      }))
    );
  }, [type, category]);


  // Generate Select options
  const getAvailableOptions = () => {
    let options = [];
    
    if (type === "1") {
      // Repair
      return custodianAssets.map((a) => ({
        value: a.kld_property_tag,
        label: `${a.kld_property_tag} - ${a.asset_type} - ${a.brand_name}`,
        uom: "",
      }));
    }
    if (type === "2") {
      // Purchase
      if (category === "Asset") {
        return adminAssets.map((a) => ({
          value: a.kld_property_tag,
          label: `${a.kld_property_tag} - ${a.asset_type} - ${a.brand_name}`,
          uom: "",
        }));
      }
      if (category === "Consumables") {
        return consumables.map((c) => ({
          value: c.consumable_ID,
          label: `${c.kld_property_tag} - ${c.consumable_name} (${c.total_quantity} available)`,
          uom: c.unit_of_measure,
          kld_tag: c.kld_property_tag,
        }));
      }
    }
    // Filter out items already selected
  const selectedValues = items.map((i) => i.description);
  return options.filter((opt) => !selectedValues.includes(opt.value));
  };


  // Prevent duplicate description selection
  const isDuplicate = (value) => {
    return items.some((i) => i.description === value);
  };


  const handleItemChange = (index, field, value) => {
    const updated = [...items];

    // Prevent duplicate descriptions
    if (field === "description" && value && isDuplicate(value)) {
      setResponseTitle("⚠️ Error");
      setResponseMessage("This item has already been added.");
      setShowResponse(true);
      return;
    }

    // Lock quantity for Repair (type === "1") or Asset category
    if (field === "quantity" && (type === "1" || category === "Asset")) {
      updated[index].quantity = 1; // force it to always stay 1
    } else {
      updated[index][field] = value;
    }

    // Auto-fill UOM
    if (field === "description") {
      if (category === "Consumables") {
        const selectedConsumable = consumables.find((c) => c.consumable_ID === value);
        updated[index].uom = selectedConsumable ? selectedConsumable.unit_of_measure : "";
      } else if (category === "Asset" || type === "1") {
        // Default UOM for assets (Repair or Purchase)
        updated[index].uom = "pc";
      } else {
        updated[index].uom = "";
      }
    }

    setItems(updated);
  };

  const resetForm = () => {
    setType("");
    setCategory("");
    setItems([{ description: "", quantity: 1, uom: "" }]);
  };


  // Add new item row
  const addItem = () => setItems([...items, { description: "", quantity: 1, uom: "" }]);

  // Remove item row
  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      type,
      category,
      items: items.map((i) => ({ description: i.description, quantity: Number(i.quantity), uom: i.uom })),
    };

    setShowLoading(true);

    fetch("/api/RIS-Handlers/save_ris.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        setShowLoading(false);
        if (data.success) {
          setResponseTitle("✅ Success");
          setResponseMessage("RIS created successfully!");
          setShowResponse(true);
            // websocket
            try {
              sendWS({ type: "refreshRIS" });
              sendWS({ type: "refreshNotifications" });
            } catch (e) {
              console.warn("WS notify failed", e);
            }
          refreshTable?.();
          resetForm(); 
          onClose?.();
        } else {
          setResponseTitle("❌ Error");
          setResponseMessage(data.error || "Failed to create RIS");
          setShowResponse(true);
        }
      })
      .catch((err) => {
        setShowLoading(false);
        setResponseTitle("❌ Error");
        setResponseMessage("An unexpected error occurred.");
        setShowResponse(true);
        console.error(err);
      });
  };

  // Handle QR scan
  const handleScanSuccess = (decodedText) => {
    if (scanningIndex === null) return;

    const options = getAvailableOptions();
    let matchedValue = null;

    if (category === "Consumables") {
      const matched = consumables.find((c) => c.kld_property_tag === decodedText);
      if (matched) matchedValue = matched.consumable_ID;
    } else {
      // Asset
      const matched = options.find((opt) => opt.value === decodedText);
      if (matched) matchedValue = matched.value;
    }

    if (!matchedValue) {
      setResponseTitle("❌ Error");
      setResponseMessage(`Scanned QR does not match any available item.`);
      setShowResponse(true);
    } else if (isDuplicate(matchedValue)) {
      setResponseTitle("❌ Error");
      setResponseMessage("This item has already been added.");
      setShowResponse(true);
    } else {
      handleItemChange(scanningIndex, "description", matchedValue);

       // Show success notification
      setResponseTitle("✅ QR Scanned");
      setResponseMessage(`Scanned value: ${decodedText}`);
      setShowResponse(true);
    }

    setShowQRScanner(false);
    setScanningIndex(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          {/* RIS Type */}
          <div className="col-md-4">
            <label className="form-label fw-bold">RIS Type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setCategory("");
              }}
              required
            >
              <option value="">Select</option>
              {risTypes.map((t) => (
                <option key={t.ris_tag_ID} value={t.ris_tag_ID}>
                  {t.ris_tag_name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          {type === "2" && (
            <div className="col-md-4">
              <label className="form-label fw-bold">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Asset">Asset</option>
                <option value="Consumables">Consumables</option>
              </select>
            </div>
          )}

          {/* Items */}
          <div className="col-12 mt-3">
            <label className="form-label fw-bold">Items</label>
            {items.map((item, index) => {
              const allOptions = getAvailableOptions();

              // Filter out options already chosen in other rows
              const selectedValues = items.map((i, idx) => idx !== index ? i.description : null);
              const filteredOptions = allOptions.filter(
                (opt) => !selectedValues.includes(opt.value)
              );

              // Preserve the selected option for this row
              const selectedOption = allOptions.find((opt) => opt.value === item.description) || null;

              return (
                <div key={index} className="row g-2 align-items-center mb-2">
                  {/* Select */}
                  <div className="col-md-10">
                    <Select
                      value={selectedOption}
                      onChange={(selected) =>
                        handleItemChange(index, "description", selected?.value || "")
                      }
                      options={filteredOptions}
                      isClearable
                      isSearchable
                      isDisabled={filteredOptions.length === 0}
                      classNamePrefix="react-select"
                    />
                  </div>

                  {/* Scan QR */}
                  <div className="col-md-2">
                    <button
                      title="Scan Asset QR Code"
                      type="button"
                      className="btn btn-form-yellow"
                      onClick={() => {
                        setScanningIndex(index);
                        setShowQRScanner(true);
                      }}
                    >
                      Scan QR
                    </button>
                  </div>

                  {/* Quantity */}
                  <div className="col-md-2">
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      required
                      disabled={type === "1" || category === "Asset"} // disable for Repair or Asset
                    />
                  </div>


                  {/* UOM */}
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="UOM"
                      value={item.uom}
                      onChange={(e) => handleItemChange(index, "uom", e.target.value)}
                      disabled={category === "Consumables" || category === "Asset" || type === "1"}
                    />
                  </div>

                  {/* Remove */}
                  <div className="col-md-3">
                    {items.length > 1 && (
                      <button
                        title="Remove this item"
                        type="button"
                        className="btn btn-form-red w-100"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <button title="Add Another item" type="button" className="btn btn-form-green mt-2" onClick={addItem}>
              +
            </button>
          </div>
        </div>

        <div className="form-modal-footer gap-3">
         <span className="form-label">
            {items.filter(i => i.description).length} items added
          </span>
          <button type="submit" className="btn btn-form-green">
            Request
          </button>
        </div>
      </form>

      {/* Popups */}
      <Popups
        showLoading={showLoading}
        loadingText="Saving RIS, please wait..."
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

export default RequisitionIssuanceForm;
