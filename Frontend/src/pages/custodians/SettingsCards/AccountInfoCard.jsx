import { useState, useEffect } from "react";
import Popups from "/src/components/Popups";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";

const AccountInfoCard = ({ onRefreshLogs }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
  });
  const [tempAccountInfo, setTempAccountInfo] = useState({ ...accountInfo });  
  
  const { send: sendWS, isConnected: wsConnected } = useWebSocketContext();
  
  // Popup states
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
        fetchAccountInfo();
  }, []);

    const fetchAccountInfo = async () => {
      try {
        const response = await fetch("/api/User-Handlers/settings/get_user_info.php", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch account info");

        const data = await response.json();
        if (!data.error) {
          setAccountInfo(data);
          setTempAccountInfo(data);
        }
      } catch (error) {
        console.error("Error fetching account info:", error);
      }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow @kld.edu.ph emails
    if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@kld\.edu\.ph$/;
      if (value === "" || emailPattern.test(value)) {
        setTempAccountInfo((prev) => ({ ...prev, [name]: value }));
      } else {
        // optional: show warning popup or inline feedback
        setResponseTitle("⚠️ Invalid Email");
        setResponseMessage("Please use your @kld.edu.ph email address only.");
        setShowResponse(true);
        return;
      }
    } else {
      setTempAccountInfo((prev) => ({ ...prev, [name]: value }));
    }
  };


  // 🔹 Trigger confirmation popup
  const handleSaveClick = () => {
    setShowConfirm(true);
  };

  // 🔹 Actual save after confirmation
  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setShowLoading(true);

    try {
      const response = await fetch(
        "/api/User-Handlers/settings/settings_update_user_info.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(tempAccountInfo),
        }
      );

      const updatedData = await response.json();
      if (!updatedData.error) {
        setAccountInfo(updatedData);
        setIsEditing(false);

        setResponseTitle("✅ Success");
        setResponseMessage("Account information updated successfully.");
        // websocket
        try {
          sendWS({ type: "refreshSidebar" });
          sendWS({ type: "refreshLogs" });
          // 🔹 Force ActivityLogsCard to update immediately
          if (onRefreshLogs) onRefreshLogs();
        } catch (e) {
          console.warn("WS notify failed", e);
        }
      } else {
        setResponseTitle("❌ Error");
        setResponseMessage(updatedData.error || "Failed to update account info.");
      }
    } catch (error) {
      console.error("Error updating account info:", error);
      setResponseTitle("❌ Network Error");
      setResponseMessage("Unable to update account info, please try again.");
    } finally {
      setShowLoading(false);
      setShowResponse(true);
    }
  };

  const handleCancel = () => {
    setTempAccountInfo(accountInfo);
    setIsEditing(false);
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        {/* Title */}
        <h4 className="card-title">Account Information</h4>

        {/* Indented Content */}
        <div className="ps-3 mt-3">
          <div className="row">
            {["firstName", "middleName", "lastName", "email"].map((field) => (
              <div className="col-md-4 mb-3" key={field}>
                <label>
                  <strong>
                    {field
                      .replace(/([A-Z])/g, " $1") // add space before capital letters
                      .replace(/^./, (str) => str.toUpperCase())} {/* capitalize first letter */}
                  </strong>
                </label>
                {isEditing ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={tempAccountInfo[field]}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <p>{accountInfo[field]}</p>
                )}
              </div>
            ))}
          </div>

          {isEditing ? (
            <div className="mt-3">
              <button
                className="btn btn-form-green me-2"
                onClick={handleSaveClick}
              >
                Save
              </button>
              <button className="btn btn-form-red me-2" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn btn-form-yellow mt-3"
              onClick={() => setIsEditing(true)}
            >
              Edit Account Info
            </button>
          )}
        </div>
      </div>

      {/* 🔹 Popups integration */}
      <Popups
        // Confirm popup
        showConfirmYesNo={showConfirm}
        confirmYesNoTitle="⚠️ Confirm Update"
        confirmYesNoBody="Are you sure you want to update your account information?"
        confirmYesLabel="Yes, Update"
        confirmNoLabel="Cancel"
        onConfirmYes={handleConfirmSave}
        onConfirmNo={() => setShowConfirm(false)}

        // Loading popup
        showLoading={showLoading}
        loadingText="Updating account info, please wait..."

        // Response popup
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </div>
  );
};

export default AccountInfoCard;
