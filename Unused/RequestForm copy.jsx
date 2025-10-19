import React, { useState, useEffect } from "react";
import Popups from "/src/components/Popups.jsx";

const RequestForm = () => {
  const [accountData, setAccountData] = useState({});
  const [assetTypes, setAssetTypes] = useState([]);
  const [items, setItems] = useState([{ asset_type_ID: "", quantity: 1 }]);
  const [purpose, setPurpose] = useState("");
  const [neededDate, setNeededDate] = useState("");
  const [neededTime, setNeededTime] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    fetch("/api/check_session.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
            setAccountData(data);
        } else {
            setResponseMessage("Session expired.");
            setShowResponse(true);
        }

      });

    fetch("/api/dropdown_fetch.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.asset_types) {
          setAssetTypes(data.asset_types);
        } else {
          setResponseMessage("Failed to load asset types.");
          setShowResponse(true);
        }
      });
  }, []);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { asset_type_ID: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const validateForm = () => {
    const needed = new Date(`${neededDate}T${neededTime}`);
    const due = new Date(`${dueDate}T${dueTime}`);
    const today = new Date();
    const tenDaysLater = new Date(today);
    tenDaysLater.setDate(today.getDate() + 10);

    if (needed < tenDaysLater) {
      setResponseMessage("Needed date must be at least 10 days from now.");
      setShowResponse(true);
      return false;
    }

    if (due <= needed) {
      setResponseMessage("Expected due date must be after needed date.");
      setShowResponse(true);
      return false;
    }

    if (!purpose.trim()) {
      setResponseMessage("Purpose is required.");
      setShowResponse(true);
      return false;
    }

    for (const item of items) {
      if (!item.asset_type_ID || item.quantity <= 0) {
        setResponseMessage("Each item must have a valid type and quantity.");
        setShowResponse(true);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      account_ID: accountData.account_ID,
      purpose,
      needed_date: neededDate,
      needed_time: neededTime,
      expected_due_date: dueDate,
      expected_due_time: dueTime,
      items,
    };

    fetch("/api/Borrowing-Process/submit_request.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setResponseMessage(data.message);
        setShowResponse(true);
        if (data.success) {
            setPurpose("");
            setItems([{ asset_type_ID: "", quantity: 1 }]);
            setNeededDate("");
            setNeededTime("");
            setDueDate("");
            setDueTime("");
        }
      })
      .catch((error) => {
        console.error("Submit error:", error);
        setResponseMessage("Something went wrong.");
        setShowResponse(true);
      });
  };

  return (
  <div className="request-form-overlay">
    <div className="card shadow">
  <div className="card-header">
    <h5 className="mb-0">Request an Item</h5>
    {/* Optional Close Button */}
  </div>

  <div className="card-body">
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Needed Date & Time */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Needed Date</label>
          <input
            type="date"
            className="form-control"
            value={neededDate}
            onChange={(e) => setNeededDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold">Needed Time</label>
          <input
            type="time"
            className="form-control"
            value={neededTime}
            onChange={(e) => setNeededTime(e.target.value)}
            required
          />
        </div>

        {/* Expected Due Date & Time */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Expected Due Date</label>
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold">Expected Due Time</label>
          <input
            type="time"
            className="form-control"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            required
          />
        </div>

        {/* Purpose */}
        <div className="col-12">
          <label className="form-label fw-bold">Purpose</label>
          <textarea
            className="form-control"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
        </div>

        {/* Item Selection */}
        <div className="col-12">
          <label className="form-label fw-bold">Items</label>
          {items.map((item, index) => (
            <div key={index} className="row g-2 align-items-center mb-2">
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={item.asset_type_ID}
                  onChange={(e) =>
                    handleItemChange(index, "asset_type_ID", e.target.value)
                  }
                  required
                >
                  <option value="">Select Type</option>
                  {assetTypes.map((type) => (
                    <option key={type.asset_type_ID} value={type.asset_type_ID}>
                      {type.asset_type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input
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
              <div className="col-md-3">
                {items.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger w-100"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-success mt-2" onClick={addItem}>
            +
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="submit" className="btn btn-primary">
          Submit Request
        </button>
      </div>
    </form>
  </div>

  <Popups
    showResponse={showResponse}
    responseMessage={responseMessage}
    onCloseResponse={() => setShowResponse(false)}
  />
</div>

  </div>
);

};

export default RequestForm;
