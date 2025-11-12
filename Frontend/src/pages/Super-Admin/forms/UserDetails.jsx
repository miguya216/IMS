import React, { useEffect } from "react";
import { useUserFormHandler } from "./functions/UserOptionHandler";
import { useState } from "react";
import Popups from "/src/components/Popups.jsx";
import { generateAccountabilityPDF } from "./functions/GenerateAccountabilityPDF.jsx"; // <-- import your PDF function

const UserDetails = ({ user_ID, fetchUsers }) => {
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [userData, setUserData] = useState(null);

  const {
    formData,
    handleChange,
    handleToggle,
    showNew,
    setFormData,
    showAccountFields,
    handleToggleAccount,
    setShowAccountFields,
    dropdownOptions,
    handleDropdownChange
  } = useUserFormHandler({ onClose: () => {} });

  useEffect(() => {
    if (user_ID) {
      fetch(`/api/User-Handlers/fetch_user_by_id.php?user_ID=${user_ID}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [user_ID]);

  useEffect(() => {
    const dropdownsReady =
      dropdownOptions.units.length > 0 && dropdownOptions.roles.length > 0;

    if (userData && dropdownsReady) {
      const matchedUnit = dropdownOptions.units.find(u => u.name === userData.unit_name);

      setFormData((prev) => ({
        ...prev,
        first_name: userData.first_name || "",
        middle_name: userData.middle_name || "",
        last_name: userData.last_name || "",
        unit: matchedUnit?.id || "",
        role: userData.role_name || "",
        kld_id: userData.kld_ID || "",
        kld_email: userData.kld_email || "",
        password: "",
        new_unit: "",
        new_role: "",
      }));

      setShowAccountFields(!!userData.kld_email);
    }
  }, [userData, dropdownOptions, setFormData, setShowAccountFields]);

  if (!userData) return <p>Loading user info...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate domain before sending request
    if (formData.kld_email && !formData.kld_email.endsWith("@kld.edu.ph")) {
      setResponseTitle("⚠️ Invalid Email");
      setResponseMessage("Please use your KLD email address (must end with @kld.edu.ph).");
      setShowResponse(true);
      return;
    }
    
    try {
      const response = await fetch("/api/User-Handlers/update_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_ID: userData.user_ID }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setResponseTitle("✅ Update Success");
        setResponseMessage("User updated successfully!");
        setShowResponse(true);
      } else {
        setResponseTitle("❌ Failed");
        setResponseMessage("Failed to update user.");
        setShowResponse(true);
      }
    } catch (error) {
      console.error("Update error:", error);
      setResponseTitle("❌ Failed")
      setResponseMessage("Something went wrong.");
      setShowResponse(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3 mb-3">
        {/* Name Fields */}
        <div className="col-md-4">
          <label className="form-label fw-bold">First Name</label>
          <input type="text" className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">Middle Name</label>
          <input type="text" className="form-control" name="middle_name" value={formData.middle_name} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">Last Name</label>
          <input type="text" className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} required />
        </div>

        {/* Unit Dropdown */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Unit</label>
          <select
            className="form-select"
            name="unit"
            value={formData.unit}
            onChange={(e) => handleDropdownChange(e, "unit")}
            required
          >
            <option value="">Select</option>
            {dropdownOptions.units.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>

        {/* Toggle Account */}
        <div className="col-md-12">
          <div className="form-check mt-2">
            <input className="form-check-input" type="checkbox" id="createAccount" checked={showAccountFields} onChange={handleToggleAccount} />
            <label className="form-check-label" htmlFor="createAccount">Edit user account</label>
          </div>
        </div>

        {/* Account Fields */}
        {showAccountFields && (
          <>
            <div className="col-md-4">
              <label className="form-label fw-bold">KLD ID</label>
              <input
                type="text"
                className="form-control"
                name="kld_id"
                placeholder="KLD-22-XXXXXX"
                value={formData.kld_id}
                onChange={handleChange}
                pattern="^KLD-22-\d{6}$"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">KLD Email</label>
              <input
                type="email"
                className="form-control"
                name="kld_email"
                placeholder="user@kld.edu.ph"
                value={formData.kld_email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">New Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />
            </div>

            {/* Role Dropdown */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Role</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={(e) => handleDropdownChange(e, "role")}
                required
              >
                <option value="">Select</option>
                {dropdownOptions.roles.map((opt) => (
                  <option key={opt.id} value={opt.name}>{opt.name}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="form-modal-footer">
        <button type="submit" className="btn btn-form-green">Update</button>
      </div>

      <Popups
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => {
          setShowResponse(false);
          if (fetchUsers) fetchUsers();
        }}
      />
    </form>
  );
};

export default UserDetails;
