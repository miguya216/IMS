import React, { useState } from 'react';
import Modal from "/src/components/Modal.jsx";
import ChangePassword from "/src/pages/users/ChangePassword.jsx";
import RenderAccountInfo from "/src/pages/users/SettingAccordion/RenderAccountInfo.jsx";
import RenderSecuritySettings from "/src/pages/users/SettingAccordion/RenderSettingsSecurity.jsx";

const AccordionItem = ({ id, title, isOpen, onToggle, children }) => {
  return (
    <div className="accordion-item mb-3 rounded shadow-sm border-0 overflow-hidden">
      <h2 className="accordion-header" id={`heading-${id}`}>
        <button
          className={`accordion-button ${!isOpen ? "collapsed" : ""} bg-light fw-semibold`}
          type="button"
          onClick={() => onToggle(id)}
        >
          {title}
          <span className="ms-auto">{isOpen ? "▼" : "▶"}</span>
        </button>
      </h2>
      <div
        id={`collapse-${id}`}
        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
      >
        <div className="accordion-body bg-white border-top">
          {children}
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const [openId, setOpenId] = useState(null)
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    unit: "",
  });

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="settings-body">
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="mb-4 p-3 rounded bg-body-tertiary shadow-sm text-center">
              <h2 className="mb-0">👤 User Settings</h2>
              <p className="text-muted mb-0">Manage your account and security preferences</p>
            </div>

            <div className="accordion" id="settingsAccordion">
              <AccordionItem
                id="account"
                title="👥 Account Information"
                isOpen={openId === "account"}
                onToggle={handleToggle}
              >
                <RenderAccountInfo
                  userData={userData}
                  setUserData={setUserData}
                />
              </AccordionItem>

              <AccordionItem
                id="security"
                title="🔐 Security Settings"
                isOpen={openId === "security"}
                onToggle={handleToggle}
              >
                <RenderSecuritySettings
                  setShowChangePassword={setShowChangePassword}
                />
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        title="Change Password"
      >
        <ChangePassword
          onClose={() => setShowChangePassword(false)}
          onSave={() => setShowChangePassword(false)}
        />
      </Modal>
    </div>
  );
};

export default Settings;
