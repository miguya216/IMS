// src/pages/custodians/custodiansSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaWpforms,
  FaDoorOpen,
  FaCog,
  FaFileAlt
} from "react-icons/fa";

const CustodianSidebar = ({ closeSidebar, openAccordion, setOpenAccordion, isDesktop }) => {
  const handleNavClick = () => {
    if (!isDesktop) closeSidebar(); // ✅ only close if mobile/tablet
  };

  return (
    <ul className="nav flex-column">
      {/* Dashboard */}
      <li className="nav-item">
        <NavLink
          to="/custodians/dashboard"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `nav-link sidebar-link ${isActive ? "active-link" : ""}`
          }
        >
          <FaTachometerAlt className="me-2" /> Dashboard
        </NavLink>
      </li>

      {/* Assets Accordion */}
      <li className="nav-item">
        <a
          href="#"
          className="nav-link sidebar-link"
          onClick={(e) => {
            e.preventDefault();
            setOpenAccordion((open) => ({ ...open, assets: !open.assets }));
          }}
        >
          <FaBoxOpen className="me-2" /> Asset
        </a>
        {openAccordion.assets && (
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <NavLink
                to="/custodians/assets"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Assigned
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/custodians/assetsarchive"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Unserviceable
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink
                to="/custodians/assethunt"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Asset Hunt
              </NavLink>
            </li> */}
          </ul>
        )}
      </li>
       {/*  Room Accordion */}
      <li className="nav-item">
        <a
          href="#"
          className="nav-link sidebar-link"
          onClick={(e) => {
            e.preventDefault();
            setOpenAccordion((open) => ({ ...open, room: !open.room }));
          }}
        >
          <FaDoorOpen className="me-2" /> Room
        </a>
        {openAccordion.room && (
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <NavLink
                to="/custodians/roomlist"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Room List
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/custodians/assethunt"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Asset Hunt
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* Forms Accordion */}
      <li className="nav-item">
        <a
          href="#"
          className="nav-link sidebar-link"
          onClick={(e) => {
            e.preventDefault();
            setOpenAccordion((open) => ({ ...open, forms: !open.forms }));
          }}
        >
          <FaWpforms className="me-2" /> Forms
        </a>
        {openAccordion.forms && (
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <NavLink
                to="/custodians/requisitionissuance"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Requisition and Issuance
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/custodians/reservationborrowing"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Reservation and Borrowing
              </NavLink>
            </li>
          </ul>
        )}
      </li>


       {/* Audit & Activity Logs */}
            <li className="nav-item">
              <a
                href="#"
                className="nav-link sidebar-link"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenAccordion((open) => ({
                    ...open,
                    logs: !open.logs,
                  }));
                }}
              >
                <FaFileAlt className="me-2" /> Audit & Activity Logs
              </a>
              {openAccordion.logs && (
                <ul className="nav flex-column ms-3">
                  <li className="nav-item">
                    <NavLink
                      to="/custodians/auditptr"
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                      }
                    >
                      Transfer Record
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/custodians/auditiir"
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                      }
                    >
                      Inspection Records
                    </NavLink>
                  </li>
                   <li className="nav-item">
                    <NavLink
                      to="/custodians/auditroomassignation"
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                      }
                    >
                      Room Assignation Records
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/custodians/institutesconsumables"
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                      }
                    >
                      Consumables Tracking
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

        {/* Settings */}
        <li className="nav-item">
          <NavLink
            to="/custodians/custodiansettings"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `nav-link sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaCog className="me-2" /> Settings
          </NavLink>
        </li>
    </ul>
  );
};

export default CustodianSidebar;
