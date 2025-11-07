import Popups from "/src/components/Popups.jsx";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = ({ onRefreshLogs, onClose }) => {
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseTitle, setResponseTitle] = useState("");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleShow = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setResponseTitle("⚠️ Password Mismatch");
      setResponseMessage("New passwords do not match.");
      setShowResponse(true);
      return;
    }

    fetch("/api/User-Handlers/settings/change_pass_settings.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResponseTitle("✅ Success");
          setResponseMessage("Password changed successfully.");
          setShowResponse(true);
          setTimeout(() => {
            if (onRefreshLogs) onRefreshLogs();
            setShowResponse(false);
            onClose();
          }, 1000);
          
          setTimeout(() => {
            setShowResponse(false);
            onClose(); // close modal or form
          }, 1500);
        } else {
          setResponseTitle("❌ Error");
          setResponseMessage(data.message || "Password change failed.");
          setShowResponse(true);
        }
      })
      .catch(() => {
        setResponseTitle("❌ Network Error");
        setResponseMessage("Please try again.");
        setShowResponse(true);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 position-relative">
        <label className="form-label fw-semibold">Current Password</label>
        <input
          type={showPassword.current ? "text" : "password"}
          className="form-control pe-5"
          value={form.currentPassword}
          onChange={(e) => handleChange("currentPassword", e.target.value)}
          required
        />
        <span
          onClick={() => toggleShow("current")}
          style={{
            position: "absolute",
            right: "15px",
            top: "38px",
            cursor: "pointer",
          }}
        >
          {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>

      <div className="mb-3 position-relative">
        <label className="form-label fw-semibold">New Password</label>
        <input
          type={showPassword.new ? "text" : "password"}
          className="form-control pe-5"
          value={form.newPassword}
          onChange={(e) => handleChange("newPassword", e.target.value)}
          required
        />
        <span
          onClick={() => toggleShow("new")}
          style={{
            position: "absolute",
            right: "15px",
            top: "38px",
            cursor: "pointer",
          }}
        >
          {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>

      <div className="mb-3 position-relative">
        <label className="form-label fw-semibold">Confirm New Password</label>
        <input
          type={showPassword.confirm ? "text" : "password"}
          className="form-control pe-5"
          value={form.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          required
        />
        <span
          onClick={() => toggleShow("confirm")}
          style={{
            position: "absolute",
            right: "15px",
            top: "38px",
            cursor: "pointer",
          }}
        >
          {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-form-green">
          Save Password
        </button>
      </div>

      <Popups
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </form>
  );
};

export default ChangePassword;
