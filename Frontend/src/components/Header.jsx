import { useState, useEffect, useRef } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";
import "/src/css/Notification.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const Header = ({ toggleSidebar = true }) => {
  const notifRef = useRef(null);
  const { lastMessage } = useWebSocketContext();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // === FETCH NOTIFICATIONS ===
  const fetchNotifications = () => {
    fetch("/api/Notification-Handlers/fetch_notifications.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter((n) => !n.is_read).length);
          if (data.role) setUserRole(data.role);
        }
      })
      .catch((err) => console.error("Notif fetch failed:", err));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // === HANDLE NEW NOTIFICATIONS VIA WEBSOCKET ===
  useEffect(() => {
    if (!lastMessage) return;
    try {
      const msg = typeof lastMessage === "string" ? JSON.parse(lastMessage) : lastMessage;
      if (msg?.type === "refreshNotifications") fetchNotifications();
    } catch (e) {
      console.warn("Invalid WS message:", e);
    }
  }, [lastMessage]);

  // === CLOSE NOTIF DROPDOWN ON CLICK OUTSIDE OR ESC ===
  useEffect(() => {
    if (!notifOpen) return;

    const handleClickOutside = (event) => {
      const bell = document.querySelector(".notification-bell");
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target) &&
        bell &&
        !bell.contains(event.target)
      ) {
        setNotifOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setNotifOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notifOpen]);

  // === FORMAT TIME ===
  const formatTimeAgo = (dateString) => {
    const date = dayjs(dateString);
    if (!date.isValid()) return "just now";
    return date.fromNow();
  };

  const buildNotificationLink = (module, reference_ID) => {
    if (!module || !reference_ID) return "/dashboard";

    const mod = module.toLowerCase();

    // Match user role number to route prefix
    let rolePath = "user"; // default
    if (userRole === "1" || userRole === 1) rolePath = "super-admin";
    else if (userRole === "2" || userRole === 2) rolePath = "admin";
    else if (userRole === "3" || userRole === 3) rolePath = "custodians";

    // Build route path based on module
    switch (mod) {
      case "ris":
        return `/${rolePath}/requisitionissuance?ris_no=${reference_ID}`;
      case "brs":
        return `/${rolePath}/reservationborrowing?brs_no=${reference_ID}`;
      case "ptr":
        return `/${rolePath}/auditptr?ptr_no=${reference_ID}`;
      default:
        // return `/${rolePath}/dashboard`;
    }
  };

  // === HANDLE NOTIFICATION CLICK ===
  const handleNotificationClick = async (notif) => {
    const link = buildNotificationLink(notif.module, notif.reference_ID);

    try {
      // Mark one as read in backend
      const res = await fetch("/api/Notification-Handlers/mark_one_read.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_ID: notif.notification_ID }),
      });
      const data = await res.json();

      if (data.success) {
        // Update UI immediately
        setNotifications((prev) =>
          prev.map((n) =>
            n.notification_ID === notif.notification_ID ? { ...n, is_read: 1 } : n
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Failed to mark one as read:", err);
    } finally {
      // redirect after marking
      if (link) {
        setNotifOpen(false);
        fetchNotifications();
        navigate(link);
      }
    }
  };

  // === HANDLE MARK ALL AS READ ===
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/Notification-Handlers/mark_all_read.php", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        // Instantly update UI
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Mark all read failed:", err);
    }
  };


  return (
    <>
      <nav className="navbar navbar-sticky px-4 py-3 d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <FaBars
            title="Main Menu"
            onClick={toggleSidebar}
            size={24}
            className="me-3"
            style={{ cursor: "pointer" }}
          />
          <img
            src="/resources/imgs/KLDlogo.png"
            style={{ width: "38px", height: "38px" }}
            className="me-3"
          />
          <span className="fw-bold">IMS | CLARITY</span>
        </div>

        <div className="position-relative">
          <FaBell
            className={`me-2 notification-bell ${notifOpen ? "active" : ""}`}
            size={35}
            onClick={() => setNotifOpen(!notifOpen)}
            style={{ cursor: "pointer" }}
          />

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span
              className="position-absolute top-0 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.65rem", left: "60%" }}
            >
               {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}

          {/* Notification dropdown */}
          {notifOpen && (
            <div
              ref={notifRef}
              className="notification-dropdown card position-absolute end-0 mt-2 shadow-lg border-0"
              style={{
                width: "340px",
                zIndex: 9999,
                maxHeight: "420px",
                overflowY: "auto",
                borderRadius: "12px",
              }}
            >
              <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">Notifications</h6>
                {unreadCount > 0 && (
                  <button
                    className="btn btn-sm btn-link text-decoration-none text-success"
                    onClick={handleMarkAllRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.notification_ID}
                    onClick={() => handleNotificationClick(n)}
                    className={`notification-item px-3 py-2 fade-in ${
                      n.is_read ? "read" : "unread"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="me-2">
                        <div className="fw-semibold text-dark">{n.title}</div>
                        <div className="text-muted small mb-1">{n.message}</div>
                        <div className="text-secondary small">
                          {n.module} • {formatTimeAgo(n.created_at)}
                        </div>
                      </div>
                      {!n.is_read && (
                        <span className="unread-dot bg-success rounded-circle"></span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted small py-3">
                  No notifications yet.
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
