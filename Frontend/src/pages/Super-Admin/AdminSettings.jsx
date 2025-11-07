import { useState } from "react";
import AccountInfoCard from "/src/pages/Super-admin/SettingsCards/AccountInfoCard";
import SecuritySettingsCard from "/src/pages/Super-admin/SettingsCards/SecuritySettingsCard";
import ActivityLogsCard from "/src/pages/Super-admin/SettingsCards/ActivityLogsCard";
import BrandingSettingsCard from "/src/pages/Super-admin/SettingsCards/BrandingCard";

const AdminSettings = () => {
  const [refreshLogsKey, setRefreshLogsKey] = useState(0);

  const handleRefreshLogs = () => {
    setRefreshLogsKey((prev) => prev + 1); // force re-render of ActivityLogsCard
  };


  return (
    <>
      {/* Header Greeting */}
      <div className="d-flex align-items-center mb-4">
        <span className="me-2 fs-4 fw-bold">
          Settings
        </span>
      </div>

      {/* Settings Content */}
      <div className="container">
        <div className="row g-4">
          <div className="col-md-12">
            <AccountInfoCard onRefreshLogs={handleRefreshLogs} />
          </div>
          <div className="col-md-12">
            <SecuritySettingsCard onRefreshLogs={handleRefreshLogs}/>
          </div>
          <div className="col-md-12">
            <BrandingSettingsCard onRefreshLogs={handleRefreshLogs} />
          </div>
          <div className="col-md-12">
            <ActivityLogsCard key={refreshLogsKey} refreshLogs={refreshLogsKey} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
