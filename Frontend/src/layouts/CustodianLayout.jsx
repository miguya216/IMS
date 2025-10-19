import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Sidebar from "/src/components/Sidebar";
import Header from "/src/components/Header";
import ConnectionNotifier from "/src/components/ConnectionNotifier";

import Dashboard from "/src/pages/custodians/Dashboard";
import Assets from "/src/pages/custodians/Assets";
import AssetsArchive from "/src/pages/custodians/AssetsArchive";
import RoomList from "/src/pages/custodians/RoomList";
import RoomAssignation from "/src/pages/Super-admin/RoomAssignation";
import RequisitionIssuance from "/src/pages/custodians/RequisitionIssuance";
import ReservationBorrowing from "/src/pages/custodians/ReservationBorrowing";
import CustodianSettings from "/src/pages/custodians/CustodianSettings";
import useIsDesktop from "/src/layouts/hooks/useIsDesktop";

// import AssetHunt from "/src/pages/AssetHunt";


function CustodianLayout() {
  const [loading, setLoading] = useState(true);
  const isDesktop = useIsDesktop();
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/check_session.php", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn || data.role !== 3) {
          navigate("/");
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error checking session:", err);
        navigate("/");
      });
  }, []);

  useEffect(() => {
    setIsSidebarOpen(isDesktop); // auto-open when desktop
  }, [isDesktop]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className={`admin-layout d-flex ${
        isSidebarOpen && isDesktop ? "sidebar-open" : ""
      }`}
    >
      <ConnectionNotifier />
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Mobile overlay */}
      {!isDesktop && isSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }}
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div className="content-wrapper flex-grow-1">
        <Header toggleSidebar={toggleSidebar} />
        <div className="p-4">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="assets" element={<Assets />} />
            {/* <Route path="assethunt" element={<AssetHunt />} /> */}
            <Route path="assetsarchive" element={<AssetsArchive />} />
            <Route path="roomlist" element={<RoomList />} />
            <Route path="roomassignation" element={<RoomAssignation />} />
            <Route path="requisitionissuance" element={<RequisitionIssuance />} />
            <Route path="reservationborrowing" element={<ReservationBorrowing />} />
            <Route path="custodiansettings" element={<CustodianSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default CustodianLayout;
