// src/pages/Super-Admin/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  FaWineBottle, 
  FaTachometerAlt, 
  FaDoorOpen, 
  FaBoxOpen, 
  FaWpforms, 
  FaUsers, 
  FaDatabase, 
  FaClipboardList, 
  FaFileAlt,
  FaCog
} from "react-icons/fa";

const AdminSidebar = ({ closeSidebar, openAccordion, setOpenAccordion, isDesktop }) => {
   const handleNavClick = () => {
    if (!isDesktop) closeSidebar(); // only close if mobile/tablet
  };
  return (
    <ul className="nav flex-column">
      {/* Dashboard */}
      <li className="nav-item">
        <NavLink
          to="/admin/dashboard"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `nav-link sidebar-link ${isActive ? "active-link" : ""}`
          }
        >
          <FaTachometerAlt className="me-2" /> Dashboard
        </NavLink>
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
                to="/admin/requisitionissuance"
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
                to="/admin/reservationborrowing"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Reservation and Borrowing
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/transferaccountability"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Transfer of Accountability
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/inventoryinspectionreport"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Inventory Inspection Report
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/disposal"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Disposal
              </NavLink>
            </li>
          </ul>
        )}
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
                to="/admin/assets"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Serviceable
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/assetsborrowable"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Borrowable
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/assetsarchive"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Unserviceable
              </NavLink>
            </li>
          </ul>
        )}
      </li>
      
      {/* Consumables Accordion */}
      <li className="nav-item">
        <a
          href="#"
          className="nav-link sidebar-link"
          onClick={(e) => {
            e.preventDefault();
            setOpenAccordion((open) => ({ ...open, consumables: !open.consumables }));
          }}
        >
          <FaWineBottle className="me-2" /> Consumables
        </a>
        {openAccordion.consumables && (
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <NavLink
                to="/admin/consumables"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Available
              </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                  to="/admin/consumablesoutofstock"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                  }
                >
                  Out-of-Stock
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/consumablesarchive"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                  }
                >
                  Archive
                </NavLink>
              </li>
          </ul>
        )}
      </li>

      {/* Room Accordion */}
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
                to="/admin/roomlist"
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
                to="/admin/assethunt"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Asset Hunt
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/roomassignation"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Room Assignation
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
                to="/admin/auditptr"
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
                to="/admin/auditiir"
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
                to="/admin/auditroomassignation"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Room Assignation Records
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink
                to="/admin/activitylogs"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                Activity Logs
              </NavLink>
            </li> */}
          </ul>
        )}
      </li>
      
      {/* Settings */}
      <li className="nav-item">
        <NavLink
          to="/admin/adminsettings"
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

export default AdminSidebar;
