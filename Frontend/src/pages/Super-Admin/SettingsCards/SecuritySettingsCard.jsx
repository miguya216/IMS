import { useState, useEffect } from "react";
import Modal from "/src/components/Modal";
import Popups from "/src/components/Popups";
import ChangePassword from "/src/pages/Super-admin/SettingsCards/ChangePassword";

const SecuritySettingsCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [securityInfo, setSecurityInfo] = useState({
    emailSender: "",
  });
  const [tempSecurityInfo, setTempSecurityInfo] = useState({ ...securityInfo });

  // 🔹 Modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // 🔹 Popup states
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch email sender from backend
  useEffect(() => {
    const fetchSecurityInfo = async () => {
      try {
        const response = await fetch(
          "/api/User-Handlers/settings/admin_get_security_info.php",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch security info");

        const data = await response.json();

        if (!data.error) {
          setSecurityInfo(data);
          setTempSecurityInfo(data);
        }
      } catch (error) {
        console.error("Error fetching security info:", error);
      }
    };

    fetchSecurityInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempSecurityInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Show confirmation before saving
  const handleSaveClick = () => {
    setShowConfirm(true);
  };

  // 🔹 Actual save logic
  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setShowLoading(true);

    try {
      const response = await fetch(
        "/api/User-Handlers/settings/admin_update_security_infor.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(tempSecurityInfo),
        }
      );

      const updatedData = await response.json();

      if (!updatedData.error) {
        setSecurityInfo(updatedData);
        setIsEditing(false);

        setResponseTitle("Success");
        setResponseMessage("Security settings updated successfully.");
      } else {
        setResponseTitle("Error");
        setResponseMessage(updatedData.error || "Failed to update security info.");
      }
    } catch (error) {
      console.error("Error updating security info:", error);
      setResponseTitle("Network Error");
      setResponseMessage("Unable to update security settings, please try again.");
    } finally {
      setShowLoading(false);
      setShowResponse(true);
    }
  };

  const handleCancel = () => {
    setTempSecurityInfo(securityInfo);
    setIsEditing(false);
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        <h4 className="card-title">Security Settings</h4>

        {/* Indented content */}
        <div className="ps-3 mt-3">
          {/* Email Sender */}
          <div className="row">
            <div className="col-md-4 mb-3">
              <label title="This is the email used as sender for system notifications">
                <strong>IMS Email Sender</strong>
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="emailSender"
                  value={tempSecurityInfo.emailSender}
                  onChange={handleChange}
                  className="form-control"
                  title="Enter your email sender address"
                />
              ) : (
                <p title="Email sender">{securityInfo.emailSender}</p>
              )}
            </div>
          </div>

          {isEditing ? (
            <div>
              <button
                className="btn btn-form-green me-2"
                onClick={handleSaveClick}
                title="Save new email sender"
              >
                Save
              </button>
              <button
                className="btn btn-form-red me-2"
                onClick={handleCancel}
                title="Cancel changes"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn btn-form-yellow mt-2"
              onClick={() => setIsEditing(true)}
              title="Edit email sender"
            >
              Change Email Sender
            </button>
          )}

          {/* Change Password button */}
          <div className="mt-4">
            <button
              className="btn btn-form-green"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Modal for Change Password */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <ChangePassword onClose={() => setIsPasswordModalOpen(false)} />
      </Modal>

      {/* 🔹 Popups integration */}
      <Popups
        // Confirm popup
        showConfirmYesNo={showConfirm}
        confirmYesNoTitle="Confirm Update"
        confirmYesNoBody="Are you sure you want to update security settings?"
        confirmYesLabel="Yes, Update"
        confirmNoLabel="Cancel"
        onConfirmYes={handleConfirmSave}
        onConfirmNo={() => setShowConfirm(false)}

        // Loading popup
        showLoading={showLoading}
        loadingText="Updating security settings, please wait..."

        // Response popup
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </div>
  );
};

export default SecuritySettingsCard;
