import { useState, useEffect } from "react";
import { FaBars, FaBell, FaQrcode } from "react-icons/fa";
import Modal from "/src/components/Modal.jsx";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";
import { useRef } from "react";
import "/src/css/Notification.css";

const Header = ({ toggleSidebar, showQr = true }) => {
  const notifRef = useRef(null);
  const { lastMessage, isConnected } = useWebSocketContext();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [qrPath, setQrPath] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // === QR FETCH ===
  useEffect(() => {
    if (qrModalOpen) {
      fetch("/api/get_user_qr.php")
        .then((res) => res.json())
        .then((data) => {
          if (data.qrPath) setQrPath(data.qrPath);
        });
    }
  }, [qrModalOpen]);

  // ✅ Reusable fetch for notifications
  const fetchNotifications = () => {
    fetch("/api/Notification-Handlers/fetch_notifications.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter(n => !n.is_read).length);
        }
      })
      .catch((err) => console.error("Notif fetch failed:", err));
  };

  // === INITIAL LOAD ===
  useEffect(() => {
    fetchNotifications();
  }, []);

  // === WEBSOCKET LISTENER ===
  useEffect(() => {
    if (!lastMessage) return;

    try {
      const msg = typeof lastMessage === "string" ? JSON.parse(lastMessage) : lastMessage;

      if (msg?.type === "refreshNotifications") {
        fetchNotifications();
      }
    } catch (e) {
      console.warn("Invalid WS message:", e);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (!notifOpen) return;

    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notifOpen]);

  const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  for (const [unit, value] of Object.entries(intervals)) {
    if (seconds >= value) return rtf.format(-Math.floor(seconds / value), unit);
  }
  return "just now";
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
          {showQr && (
            <FaQrcode
              className="me-4"
              size={20}
              style={{ cursor: "pointer" }}
              onClick={() => setQrModalOpen(true)}
            />
          )}

          {/* Bell icon */}
          <FaBell
            className="me-2"
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              const nextState = !notifOpen;
              setNotifOpen(nextState);

              if (!notifOpen) {
                // Mark all as read when opening dropdown
                fetch("/api/Notification-Handlers/mark_all_read.php", {
                  method: "POST",
                  credentials: "include",
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success) {
                      // update UI instantly
                      setNotifications((prev) =>
                        prev.map((n) => ({ ...n, is_read: 1 }))
                      );
                      setUnreadCount(0);
                    }
                  })
                  .catch((err) => console.error("Mark read failed:", err));
              }
            }}
          />

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span
              className="position-absolute top-0 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.65rem", left: "60%" }}
            >
              {unreadCount}
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
            <div className="p-3 border-bottom bg-light">
              <h6 className="fw-bold mb-0">Notifications</h6>
            </div>

            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.notification_ID}
                  className={`notification-item px-3 py-2 fade-in ${
                    n.is_read ? "read" : "unread"
                  }`}
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
                      <span className="unread-dot bg-primary rounded-circle"></span>
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

      {/* QR Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="My QR Code"
      >
        <div className="text-center p-3">
          {qrPath ? (
            <img
              src={`/${qrPath}`}
              alt="Account QR"
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <p>Loading QR code...</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Header;
