import React from "react";
import { useUserFormHandler } from "./functions/UserOptionHandler";
import { useState } from "react";
import Popups from "/src/components/Popups.jsx";
import { Eye, EyeOff } from "lucide-react";

const UserForm = ({ onClose , fetchUsers }) => {
    const [showLoading, setShowLoading] = useState(false);
    const [showResponse, setShowResponse] = useState(false);
    const [responseTitle, setResponseTitle] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [showPassword, setShowPassword] = useState({ password: false });
    const toggleShow = (field) => {
      setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };
const {
  formData,
  showNew,
  showAccountFields,
  handleChange,
  handleDropdownChange,
  handleAddNewClick,
  handleToggleAccount,
  renderNewInput,
  handleSubmit,
  dropdownOptions,
} = useUserFormHandler({
  onClose,
  setShowResponse,
  setResponseTitle,
  setResponseMessage,
  setShowLoading
});


  return (
    <form onSubmit={(e) => handleSubmit(e, onClose)}>
      <div className="row g-3">
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
          <div className="d-flex gap-2">
            <select
              className="form-select"
              name="unit"
              value={formData.unit}
              onChange={(e) => handleDropdownChange(e, "unit")}
              required={!showNew.unit}
            >
              <option value="">Select</option>
              {dropdownOptions.units.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
            <button type="button" className="btn btn-form-green" onClick={() => handleAddNewClick("unit")}>+</button>
          </div>
          {renderNewInput("unit", "Unit")}
        </div>

        {/* Toggle Account Creation */}
        <div className="col-md-12">
          <div className="form-check mt-2">
            <input className="form-check-input" type="checkbox" id="createAccount" checked={showAccountFields} onChange={handleToggleAccount} />
            <label className="form-check-label" htmlFor="createAccount">Create user account</label>
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
                // pattern="^KLD-22-\d{6}$"
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
            <label className="form-label fw-bold">Password</label>
            <div className="position-relative">
              <input
                type={showPassword.password ? "text" : "password"}
                className="form-control pe-5" // adds space for the icon
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => toggleShow("password")}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6c757d"
                }}
              >
                {showPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>


            {/* Role Dropdown */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Role</label>
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  name="role"
                  value={formData.role}
                  onChange={(e) => handleDropdownChange(e, "role")}
                  required={!showNew.role}
                >
                  <option value="">Select</option>
                  {dropdownOptions.roles.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
                {/* <button type="button" className="btn btn-form-green" onClick={() => handleAddNewClick("role")}>+</button> */}
              </div>
              {/* {renderNewInput("role", "Role")} */}
            </div>
          </>
        )}
      </div>

      <div className="form-modal-footer">
        <button type="submit" className="btn btn-form-green">Save</button>
      </div>
        <Popups
            showLoading={showLoading}
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

export default UserForm;
