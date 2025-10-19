import React, { useState } from 'react';

const RenderSecuritySettings = ({ setShowChangePassword }) => {
  const [securityEditMode, setSecurityEditMode] = useState(false);

  const handleSecurityChange = (field, value) => {
    setTempSecurityData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecuritySave = () => {
    setSecurityData({ ...tempSecurityData });
    setSecurityEditMode(false);
    // TODO: send `tempSecurityData` to backend
  };

  const handleSecurityCancel = () => {
    setTempSecurityData({ ...securityData });
    setSecurityEditMode(false);
  };

  return (
    <>
      {securityEditMode ? (
        <>
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={tempSecurityData.rememberMe}
              onChange={(e) => handleSecurityChange("rememberMe", e.target.checked)}
              id="rememberMeSwitch"
            />
            <label className="form-check-label fw-semibold" htmlFor="rememberMeSwitch">
              Remember Me
            </label>
          </div>
          <p><strong>Last Login:</strong> {securityData.lastLogin}</p>

          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={handleSecuritySave}>Save</button>
            <button className="btn btn-secondary" onClick={handleSecurityCancel}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <button
            className="btn btn-form-green"
            onClick={() => setShowChangePassword(true)}
          >
            Change Password
          </button>
          {/* <button className="btn btn-outline-secondary mt-2" onClick={() => setSecurityEditMode(true)}>
            Edit Security Settings
          </button> */}
        </>
      )}
    </>
  );
};

export default RenderSecuritySettings;
