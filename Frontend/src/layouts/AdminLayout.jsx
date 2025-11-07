import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
// import AssetHunt from "/src/pages/AssetHunt";
import Sidebar from "/src/components/Sidebar";
import Header from "/src/components/Header";
import ConnectionNotifier from "/src/components/ConnectionNotifier";

import Dashboard from "/src/pages/Super-Admin/Dashboard";
import RequisitionIssuance from "/src/pages/Super-Admin/RequisitionIssuance";
import ReservationBorrowing from "/src/pages/Super-Admin/ReservationBorrowing";
import TransferAccountability from "/src/pages/Super-Admin/TransferAccountability";
import AuditPTR from "/src/pages/Super-Admin/AuditPTR";
import InventoryInspectionReport from "/src/pages/Super-Admin/InventoryInspectionReport";
import AuditIIR from "/src/pages/Super-Admin/AuditIIR";
import Disposal from "/src/pages/Super-Admin/Disposal";
import Assets from "/src/pages/Super-Admin/Assets";
import AssetsBorrowable from "/src/pages/Super-Admin/AssetsBorrowable";
import AssetsArchive from "/src/pages/Super-Admin/AssetsArchive";
import Consumables from "/src/pages/Super-Admin/Consumables";
import ConsumablesOutofStock from "/src/pages/Super-Admin/ConsumablesOutofStock";
import ConsumablesArchive from "/src/pages/Super-Admin/ConsumablesArchive";
import RoomList from "/src/pages/Super-Admin/RoomList";
import RoomAssignation from "/src/pages/Super-Admin/RoomAssignation";
import AuditRoomAssignation from "/src/pages/Super-Admin/AuditRoomAssignation";
import useIsDesktop from "/src/layouts/hooks/useIsDesktop";
// import ActivityLogs from "/src/pages/Super-Admin/ActivityLogs";
import AdminSettings from "/src/pages/Super-Admin/AdminSettings";
import AssetHunt from "/src/pages/Super-Admin/AssetHunt.jsx";

function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const isDesktop = useIsDesktop();
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/check_session.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn || data.role !== 2) {
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
    setIsSidebarOpen(isDesktop); // auto open when switching to desktop
  }, [isDesktop]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (loading)  
    return (
    <div className="loading-page">
        <p>Redirecting</p>
        <img 
          src="/resources/imgs/loading.gif"
          alt="Loading..." 
          style={{ width: "80px", height: "80px" }} 
        />
    </div>
  );

  return (
    <div className={`admin-layout d-flex ${isSidebarOpen && isDesktop ? "sidebar-open" : ""}`}>
      <ConnectionNotifier />
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Mobile overlay background */}
      {!isDesktop && isSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }}
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div className="content-wrapper flex-grow-1">
        <Header toggleSidebar={toggleSidebar} showQr={false} />
        <div className="p-4">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="requisitionissuance" element={<RequisitionIssuance />} />
            <Route path="reservationborrowing" element={<ReservationBorrowing />} />
            <Route path="transferaccountability" element={<TransferAccountability />} />
            <Route path="auditptr" element={<AuditPTR />} />
            <Route path="inventoryinspectionreport" element={<InventoryInspectionReport />} />
            <Route path="auditiir" element={<AuditIIR />} />
            <Route path="disposal" element={<Disposal />} />
            <Route path="assets" element={<Assets />} />
            <Route path="assethunt" element={<AssetHunt />} />
            <Route path="assetsborrowable" element={<AssetsBorrowable />} />
            <Route path="assetsarchive" element={<AssetsArchive />} />
            <Route path="consumables" element={<Consumables />} />ConsumablesOutofStock
            <Route path="consumablesoutofstock" element={<ConsumablesOutofStock />} />
            <Route path="consumablesarchive" element={<ConsumablesArchive />} />
            <Route path="roomlist" element={<RoomList />} />
            <Route path="roomassignation" element={<RoomAssignation />} />
            <Route path="auditroomassignation" element={<AuditRoomAssignation />} />
            {/* <Route path="activitylogs" element={<ActivityLogs />} /> */}
            <Route path="adminsettings" element={<AdminSettings />}/>
          </Routes>
        </div>
      </div>
    </div>
  );

}

export default AdminLayout;
