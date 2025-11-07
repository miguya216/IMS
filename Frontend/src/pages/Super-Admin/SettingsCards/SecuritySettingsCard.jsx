import { useState, useEffect } from "react";
import Modal from "/src/components/Modal";
import ChangePassword from "/src/pages/Super-admin/SettingsCards/ChangePassword";

const SecuritySettingsCard = ({ onRefreshLogs }) => {
  // Modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="card shadow">
      <div className="card-body">
        <h4 className="card-title">Security Settings</h4>

        {/* Indented content */}
        <div className="ps-3 mt-3">
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

      {/* Modal for Change Password */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <ChangePassword 
          onClose={() => setIsPasswordModalOpen(false)}
          onRefreshLogs={onRefreshLogs}
        />
      </Modal>
    </div>
  );
};

export default SecuritySettingsCard;
