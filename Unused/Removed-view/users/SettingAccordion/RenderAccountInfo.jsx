import React, { useState, useEffect } from 'react';
import Popups from '/src/components/Popups.jsx'; // Make sure this path is correct

const FIELD_LABELS = {
  f_name: "First Name",
  m_name: "Middle Name",
  l_name: "Last Name",
  kld_email: "Email",
  unit_name: "Unit"
};

const RenderAccountInfo = ({ userData, setUserData }) => {
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({ ...userData });
  const [unitOptions, setUnitOptions] = useState([]);

  // 🔻 State for response popup
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseTitle, setResponseTitle] = useState("System Message");

  const triggerResponsePopup = (message, title = "System Message") => {
    setResponseMessage(message);
    setResponseTitle(title);
    setShowResponse(true);
  };

  useEffect(() => {
    fetch("/api/User-Handlers/non-admin/get_account_info.php", { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserData(data.data);
        } else {
          triggerResponsePopup("Failed to load user info");
        }
      });
  }, []);

  useEffect(() => {
    fetch("/api/dropdown_fetch.php")
      .then(res => res.json())
      .then(data => {
        if (data.units) {
          setUnitOptions(data.units);
        }
      });
  }, []);

  useEffect(() => {
    const sanitized = Object.fromEntries(
      Object.entries(userData).map(([k, v]) => [k, v ?? ""])
    );
    setTempData(sanitized);
  }, [userData]);

  const handleChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    fetch("/api/User-Handlers/non-admin/update_account_info.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(tempData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserData({ ...tempData });
          setEditMode(false);
          triggerResponsePopup("Account info updated successfully!");
        } else {
          triggerResponsePopup("Update failed. Please try again.");
        }
      });
  };

  const handleCancel = () => {
    setTempData({ ...userData });
    setEditMode(false);
  };

  return (
    <>
      {Object.entries(userData).map(([key, value]) => {
        const label = FIELD_LABELS[key] || key;

        return (
          <div className="mb-3" key={key}>
            <label className="form-label fw-semibold">{label}:</label>

            {editMode ? (
              key === "unit_name" ? (
                <select
                  className="form-select"
                  value={tempData[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                >
                  {unitOptions.map((unit) => (
                    <option key={unit.unit_ID} value={unit.unit_name}>
                      {unit.unit_name}
                    </option>
                  ))}
                </select>
              ) : key === "kld_email" ? (
                <p className="form-control-plaintext">{value}</p> // email not editable
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value={tempData[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )
            ) : (
              <p className="form-control-plaintext">{value}</p>
            )}
          </div>
        );
      })}

      {editMode ? (
        <div className="d-flex gap-2">
          <button className="btn btn-form-green" onClick={handleSave}>Save</button>
          <button className="btn btn-form-red" onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <button className="btn btn-form-yellow" onClick={() => setEditMode(true)}>
          Edit Account Info
        </button>
      )}
      <Popups
        showResponse={showResponse}
        responseMessage={responseMessage}
        responseTitle={responseTitle}
        onCloseResponse={() => setShowResponse(false)}
      />
    </>
    
  );
};

export default RenderAccountInfo;
