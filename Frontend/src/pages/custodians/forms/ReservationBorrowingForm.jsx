import React, { useState, useEffect } from "react";
import Select from "react-select";
import QRScannerModal from "/src/components/QRScannerModal";
import Popups from "/src/components/Popups";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";

const ReservationBorrowingForm = ({ onClose, refreshTable }) => {
  const { send: sendWS, isConnected: wsConnected } = useWebSocketContext();
  
  const [items, setItems] = useState([{ description: null, quantity: 1, uom: "pc" }]);
  const [purpose, setPurpose] = useState("");
  const [dateUsed, setDateUsed] = useState("");
  const [timeUsed, setTimeUsed] = useState("");
  const [dateReturn, setDateReturn] = useState("");
  const [timeReturn, setTimeReturn] = useState("");

  const [assetOptions, setAssetOptions] = useState([]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanningIndex, setScanningIndex] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // Calculate minimum "Date of Use" (3 days ahead)
  const getMinUseDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split("T")[0];
  };

  // Handle Date of Use change (disable Sundays)
  const handleDateUsedChange = (value) => {
    const selectedDate = new Date(value);
    const day = selectedDate.getUTCDay(); // Sunday = 0

    if (day === 0) {
      setResponseTitle("⚠️ Invalid Date");
      setResponseMessage("Sundays are not allowed for Date of Use.");
      setShowResponse(true);
      setDateUsed(""); // reset input
      return;
    }

    setDateUsed(value);

    // Reset dateReturn if it's before new dateUsed
    if (dateReturn && value > dateReturn) {
      setDateReturn("");
    }
  };

  // Handle Date of Return change (disable Sundays)
  const handleDateReturnChange = (value) => {
    const selectedDate = new Date(value);
    const day = selectedDate.getUTCDay(); // Sunday = 0

    if (day === 0) {
      setResponseTitle("⚠️ Invalid Date");
      setResponseMessage("Sundays are not allowed for Date of Return.");
      setShowResponse(true);
      setDateReturn(""); // reset input
      return;
    }

    if (dateUsed && value < dateUsed) {
      setResponseTitle("⚠️ Invalid Date");
      setResponseMessage("Date of Return cannot be earlier than Date of Use.");
      setShowResponse(true);
      return;
    }

    setDateReturn(value);
  };


  // Handle Time of Return logic
  const handleTimeReturnChange = (value) => {
    if (dateReturn === dateUsed && timeUsed && value <= timeUsed) {
      setResponseTitle("⚠️ Invalid Time");
      setResponseMessage("Time of Return must be later than Time of Use.");
      setShowResponse(true);
      return;
    }
    setTimeReturn(value);
  };

  useEffect(() => {
    fetch("/api/Reservation-Borrowing-Handlers/fetch_borrowable_assets.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const options = data.data.map((asset) => ({
            value: asset.asset_ID,
            label: `${asset.kld_property_tag || asset.property_tag} - ${asset.brand_name || ""} ${asset.asset_type || ""}`.trim(),
          }));
          setAssetOptions(options);
        }
      })
      .catch((err) => console.error("Error fetching assets:", err));
  }, []);

  const addItem = () => setItems([...items, { description: null, quantity: 1, uom: "pc" }]);

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleScanSuccess = (decodedText) => {
    if (scanningIndex === null) return;

    // Try to find an asset that has this KLD-tag in its label
    const matchedAsset = assetOptions.find(opt =>
      opt.label.startsWith(decodedText) // since your label begins with `${kld_property_tag} - ...`
    );

    const updated = [...items];
    if (matchedAsset) {
      updated[scanningIndex].description = matchedAsset;
      setResponseTitle("✅ QR Scanned");
      setResponseMessage(`Matched asset: ${matchedAsset.label}`);
    } else {
      // fallback if scanned code is not in the options
      updated[scanningIndex].description = { value: decodedText, label: decodedText };
      setResponseTitle("✅ QR Scanned");
      setResponseMessage(`No matching asset found for: ${decodedText}`);
    }

    setItems(updated);
    setShowResponse(true);

    setShowQRScanner(false);
    setScanningIndex(null);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.some(i => !i.description)) {
      setResponseTitle("⚠️ Validation Error");
      setResponseMessage("Please select an asset for each item.");
      setShowResponse(true);
      return;
    }

    const payload = {
      dateUsed,
      timeUsed,
      dateReturn,
      timeReturn,
      purpose,
      // map selected asset objects to plain values for backend
      items: items.map((i) => ({
        description: i.description?.value || "",
        quantity: i.quantity,
        uom: i.uom,
      })),
    };

    setShowLoading(true);

    fetch("/api/Reservation-Borrowing-Handlers/save_borrowing.php", {
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
          setResponseMessage("Reservation created successfully!");
          setShowResponse(true);
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
          setResponseMessage(data.error || "Failed to create reservation");
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

return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row g-2">
          {/* 🗓 Date & Time of Use */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Date of Use</label>
            <input
              type="date"
              className="form-control"
              value={dateUsed}
              onChange={(e) => handleDateUsedChange(e.target.value)}
              min={getMinUseDate()}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Time of Use</label>
            <input
              type="time"
              className="form-control"
              value={timeUsed}
              onChange={(e) => setTimeUsed(e.target.value)}
              required
            />
          </div>

          {/* 📆 Date & Time of Return */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Date of Return</label>
            <input
              type="date"
              className="form-control"
              value={dateReturn}
              onChange={(e) => handleDateReturnChange(e.target.value)}
              min={dateUsed || getMinUseDate()}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Time of Return</label>
            <input
              type="time"
              className="form-control"
              value={timeReturn}
              onChange={(e) => handleTimeReturnChange(e.target.value)}
              required
            />
          </div>

          {/* Purpose */}
          <div className="col-md-12">
            <label className="form-label fw-bold">Purpose</label>
            <textarea
              className="form-control"
              value={purpose}
              placeholder="State the purpose and location of use (e.g., for classroom activity at Room 1302)"
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
          </div>

          {/* Items Section */}
          <div className="col-12 mt-3">
            <label className="form-label fw-bold">Items</label>
            {items.map((item, index) => (
              <div key={index} className="row g-2 align-items-center mb-2">
                {/* Description with react-select */}
                <div className="col-md-10">
                 <Select
                    options={assetOptions.filter(
                      (opt) =>
                        !items
                          .filter((_, i) => i !== index) // all other items except this one
                          .some((item) => item.description?.value === opt.value)
                    )}
                    value={item.description}
                    onChange={(selected) => handleItemChange(index, "description", selected)}
                    placeholder="Select Asset..."
                    isClearable
                    required
                  />
                </div>

                {/* Scan QR */}
                <div className="col-md-2">
                  <button
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

                {/* Quantity */}
                <div className="col-md-2">
                  <input
                    readOnly
                    type="number"
                    min="1"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    required
                  />
                </div>

                {/* UOM */}
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="UOM"
                    value={item.uom}
                    onChange={(e) =>
                      handleItemChange(index, "uom", e.target.value)
                    }
                    disabled
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
            ))}

            <button
              title="Add more items"
              type="button"
              className="btn btn-form-green mt-2"
              onClick={addItem}
            >
              +
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between gap-2 mt-4">
          <span className="form-label">
            {items.filter((i) => i.description).length} items added
          </span>
          <button
            title="Submit your Reservation"
            type="submit"
            className="btn btn-form-green"
          >
            Submit Reservation
          </button>
        </div>
      </form>

      {/* Popups */}
      <Popups
        showLoading={showLoading}
        loadingText="Saving reservation, please wait..."
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

export default ReservationBorrowingForm;
