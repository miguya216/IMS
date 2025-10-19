import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaHistory, FaQrcode, FaClipboardList } from "react-icons/fa";
import "/src/css/BorrowerHome.css"; // Import CSS

const Home = () => {
  const [borrowerName, setBorrowerName] = useState("Borrower");
  const [stats, setStats] = useState({
    borrowed: 0,
    pending: 0,
    late: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);

  // Fetch borrower info (name, unit, etc.)
  const fetchBorrowerInfo = async () => {
    try {
      const res = await fetch("/api/User-Handlers/non-admin/get_account_info.php");
      const data = await res.json();
      if (data.success && data.data) {
        const { f_name, m_name, l_name } = data.data;
        const fullName = `${f_name} ${m_name ? m_name.charAt(0) + "." : ""} ${l_name}`;
        setBorrowerName(fullName.trim());
      }
    } catch (error) {
      console.error("Error fetching borrower info:", error);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/User-Handlers/non-admin/fetch_stats.php");
      const data = await res.json();
      if (data.success) {
        setStats({
          borrowed: data.borrowed || 0,
          pending: data.pending || 0,
          late: data.late || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch recent activity
  const fetchRecentLogs = async () => {
    try {
      const res = await fetch("/api/User-Handlers/non-admin/fetch_recent_logs.php");
      const data = await res.json();
      if (data.success) {
        setRecentLogs(data.logs || []);
      }
    } catch (error) {
      console.error("Error fetching recent logs:", error);
    }
  };

  useEffect(() => {
    fetchBorrowerInfo();
    fetchStats();
    fetchRecentLogs();
  }, []);

  return (
    <div className="borrower-home">
      {/* Welcome Section */}
        <h3 className="p-4">
          Hi, {borrowerName}
          <img
            src="/resources/imgs/waving-hand.gif"
            alt="Waving Hand"
            className="wave-icon"
          />
        </h3>
      <div className="container p-4">
        {/* Stats Overview */}
        <div className="stats-container row g-3 mb-5">
          {/* Borrowed Items */}
          <div className="stats col-md-4">
            <div className="card text-center shadow-sm custom-card border-left-green position-relative">
              <img
                src="/resources/imgs/sphygmomanometer.png"
                alt="Monitor Icon"
                className="card-bg-icon"
              />
              <div className="card-body">
                <p className="text-dark mb-1">Borrowed Items</p>
                <h2 className="fw-bold text-dark">{stats.borrowed}</h2>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="stats col-md-4">
            <div className="card text-center shadow-sm custom-card border-left-green position-relative">
              <img
                src="/resources/imgs/monitor.png"
                alt="Flask Icon"
                className="card-bg-icon"
              />
              <div className="card-body">
                <p className="text-dark mb-1">Pending Requests</p>
                <h2 className="fw-bold text-dark">{stats.pending}</h2>
              </div>
            </div>
          </div>

          {/* Late Returns */}
          <div className="stats col-md-4">
            <div className="card text-center shadow-sm custom-card border-left-green position-relative">
              <img
                src="/resources/imgs/speaker.png"
                alt="Keyboard Icon"
                className="card-bg-icon"
              />
              <div className="card-body">
                <p className="text-dark mb-1">Late Returns</p>
                <h2 className="fw-bold text-danger">{stats.late}</h2>
              </div>
            </div>
          </div>
        </div>


         <p className="mb-4 text-end">Here’s your overview and quick actions.</p>

        {/* Quick Actions */}
        <div className="row g-3 mb-5">
          <div className="col-6 col-md-3">
            <Link
              to="/users/roomqrscanning"
              className="btn btn-form-blue w-100 p-4 d-flex flex-column align-items-center shadow-sm"
            >
              <FaQrcode size={24} className="mb-2" />
              Asset Hunt
            </Link>
          </div>
          <div className="col-6 col-md-3">
            <Link
              to="/users/requestform"
              className="btn btn-form-orange w-100 p-4 d-flex flex-column align-items-center shadow-sm"
            >
              <FaClipboardList size={24} className="mb-2" />
              Create Request
            </Link>
          </div>
          <div className="col-6 col-md-3">
            <Link
              to="/users/requesthistory"
              className="btn btn-form-yellow w-100 p-4 d-flex flex-column align-items-center shadow-sm"
            >
              <FaHistory size={24} className="mb-2" />
              Request History
            </Link>
          </div>
          <div className="col-6 col-md-3">
            <Link
              to="/users/BorrowedItems"
              className="btn btn-form-red w-100 p-4 d-flex flex-column align-items-center shadow-sm"
            >
              <FaBoxOpen size={24} className="mb-2" />
              Borrowed Items
            </Link>
          </div>
        </div>


      {/* Recent Activity */}
        <div className="recent-activity-wrapper position-relative">
          {/* Upper-left corner icon */}
          <img
            src="/resources/imgs/erlenmeyer-flask.png"
            alt="Flask Icon"
            className="corner-icon top-left"
          />

          {/* Lower-right corner icon */}
          <img
            src="/resources/imgs/tsquare.png"
            alt="T-Square Icon"
            className="corner-icon bottom-right"
          />

          <div className="card shadow-sm custom-card recent-activity">
            <div className="card-body">
              <h5 className="card-title mb-3 fw-bold">Recent Activity</h5>
              <ul className="list-group list-group-flush">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <li
                      key={log.id}
                      className="list-group-item d-flex justify-content-between"
                    >
                      <span>
                        <strong>{log.action}</strong> - {log.item}
                      </span>
                      <span className="text-muted small">{log.date}</span>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">
                    No recent activity found.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
