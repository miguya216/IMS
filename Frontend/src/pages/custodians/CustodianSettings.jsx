import AccountInfoCard from "/src/pages/custodians/SettingsCards/AccountInfoCard";
import SecuritySettingsCard from "/src/pages/custodians/SettingsCards/SecuritySettingsCard";
import ActivityLogsCard from "/src/pages/Super-admin/SettingsCards/ActivityLogsCard";

const CustodianSettings = () => {

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


export default CustodianSettings;
