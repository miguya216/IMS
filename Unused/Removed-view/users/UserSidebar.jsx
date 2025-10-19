import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaHome,
  FaQrcode,
  FaFileAlt,
  FaHistory,
  FaBoxOpen,
  FaCog,
} from "react-icons/fa";
import Popups from "/src/components/Popups";
import "/src/css/SidebarUser.css";

const UserSidebar = ({ isOpen, closeSidebar, isMobile }) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/getUser.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      });
  }, []);

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    const token = localStorage.getItem("token");

    try {
      await fetch("/api/logout.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("token");
      navigate("/welcome");
    }
  };

  return (
    <div
      className={`vh-100 user-sidebar transition-all`}
      style={{
        top: 0,
        left: 0,
        width: isMobile ? (isOpen ? "250px" : "0px") : "250px",
        position: "fixed",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.3s ease",
        zIndex: 1000,
        padding: isMobile ? (isOpen ? "1rem" : "0") : "1rem",
        color: "#fff",
      }}
    >
      {isOpen && user && (
        <>
          {/* User Info */}
          <div className="mb-4 text-white">
            <h5 className="mb-0">{user.name}</h5>
            <small className="text-light">{user.email}</small>
          </div>
          <hr className="border-light" />

          {/* Navigation */}
          <ul className="nav flex-column">
            <li className="nav-item">
              <NavLink
                to="/users/home"
                onClick={isMobile ? closeSidebar : undefined}
                className={({ isActive }) =>
                  `nav-link user-sidebar-link ${isActive ? "user-sidebar-active" : ""}`
                }
              >
                <FaHome className="me-2" /> Home
              </NavLink>

              <NavLink
                to="/users/roomqrscanning"
                onClick={isMobile ? closeSidebar : undefined}
                className={({ isActive }) =>
                  `nav-link user-sidebar-link ${isActive ? "user-sidebar-active" : ""}`
                }
              >
                <FaQrcode className="me-2" /> Asset Hunt
              </NavLink>

              <NavLink
                to="/users/requestform"
                onClick={isMobile ? closeSidebar : undefined}
                className={({ isActive }) =>
                  `nav-link user-sidebar-link ${isActive ? "user-sidebar-active" : ""}`
                }
              >
                <FaFileAlt className="me-2" /> Create Request
              </NavLink>

              <NavLink
                to="/users/requesthistory"
                onClick={isMobile ? closeSidebar : undefined}
                className={({ isActive }) =>
                  `nav-link user-sidebar-link ${isActive ? "user-sidebar-active" : ""}`
                }
              >
                <FaHistory className="me-2" /> Request History
              </NavLink>

              <NavLink
                to="/users/borroweditems"
                onClick={isMobile ? closeSidebar : undefined}
                className={({ isActive }) =>
                  `nav-link user-sidebar-link ${isActive ? "user-sidebar-active" : ""}`
                }
              >
                <FaBoxOpen className="me-2" /> Borrowed Items
              </NavLink>

              <NavLink
                to="/users/settings"
                onClick={isMobile ? closeSidebar : undefined}
                className={({ isActive }) =>
                  `nav-link user-sidebar-link ${isActive ? "user-sidebar-active" : ""}`
                }
              >
                <FaCog className="me-2" /> Settings
              </NavLink>
            </li>
          </ul>

          {/* Logout */}
          <ul className="nav flex-column mt-3">
            <li className="nav-item">
              <a
                href="#"
                className="nav-link user-sidebar-link"
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

      {/* Logout Confirmation Popup */}
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

export default UserSidebar;
