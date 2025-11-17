// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popups from "/src/components/Popups";
import SuperAdminSidebar from "/src/pages/Super-admin/AdminSidebar";
import AdminSidebar from "/src/pages/admin/AdminSidebar";
import CustodianSidebar from "/src/pages/custodians/CustodianSidebar";
// import UserSidebar from "/src/pages/users/UserSidebar";
import { FaSignOutAlt } from "react-icons/fa";
import useIsDesktop from "/src/layouts/hooks/useIsDesktop";

import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";


const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const [openAccordion, setOpenAccordion] = useState({
    assets: false,
    users: false,
    reference: false,
    request: false,
  });

  const isDesktop = useIsDesktop(); //  unified detection

  const { lastMessage, isConnected } = useWebSocketContext();

  // Function to fetch user data (no need to pass setUser)
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/getUser.php", { credentials: "include" });
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchUser();
  }, []);


  // websocket
  useEffect(() => {
    if (!lastMessage) return;
    try {
      const msg = typeof lastMessage === "string" ? JSON.parse(lastMessage) : lastMessage;
      if (msg && msg.type === "refreshSidebar") {
        fetchUser();
      }
    } catch (e) {
      // ignore non-json messages
    }
  }, [lastMessage]);


  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    const token = localStorage.getItem("token");
    try {
      await fetch("/api/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
      });
    } catch (err) {
    } finally {
      localStorage.removeItem("token");
      navigate("/welcome");
    }
  };

  return (
    <div
      className={`sidebar-custom transition-all ${isOpen ? "open" : ""}`}
    >
      {user && (
        <>
          <div className="mb-4 text-white row g-1">
            <h5 className="mb-0">{user.name}</h5>
            <small className="text-light">{user.email}</small>
            <small className="text-light">Institue/Unit: {user.unit_name || ""}</small>
          </div>
          <hr className="border-light" />

          {user.role === 1 && (
            <SuperAdminSidebar
              closeSidebar={closeSidebar}
              openAccordion={openAccordion}
              setOpenAccordion={setOpenAccordion}
              isDesktop={isDesktop}
            />
          )}
           {user.role === 2 && (
            <AdminSidebar
              closeSidebar={closeSidebar}
              openAccordion={openAccordion}
              setOpenAccordion={setOpenAccordion}
              isDesktop={isDesktop}
            />
          )}
          {user.role === 3 && (
            <CustodianSidebar
              closeSidebar={closeSidebar}
              openAccordion={openAccordion}
              setOpenAccordion={setOpenAccordion}
              isDesktop={isDesktop}
            />
          )}

          {/* Logout */}
          <ul className="nav flex-column mt-3">
            <li className="nav-item">
              <a
                className="nav-link sidebar-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogoutConfirm(true);
                }}
              >
                <FaSignOutAlt className="me-2" /> Logout
              </a>
            </li>
          </ul>
        </>
      )}

      <Popups
        showConfirmYesNo={showLogoutConfirm}
        confirmYesNoTitle="Confirm Logout"
        confirmYesNoBody="Are you sure you want to logout?"
        confirmYesLabel="Yes, Logout"
        confirmNoLabel="Cancel"
        onConfirmYes={confirmLogout}
        onConfirmNo={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};

export default Sidebar;
