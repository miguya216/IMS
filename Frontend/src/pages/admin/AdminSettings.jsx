import AccountInfoCard from "/src/pages/admin/SettingsCards/AccountInfoCard";
import SecuritySettingsCard from "/src/pages/admin/SettingsCards/SecuritySettingsCard";
import ActivityLogsCard from "/src/pages/admin/SettingsCards/ActivityLogsCard";

const AdminSettings = () => {

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
            <AccountInfoCard />
          </div>
          <div className="col-md-12">
            <SecuritySettingsCard />
          </div>
          <div className="col-md-12">
            <ActivityLogsCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
