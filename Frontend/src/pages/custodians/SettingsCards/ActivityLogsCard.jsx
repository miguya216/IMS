import { useState, useEffect } from "react";
import { FaClock, FaEdit, FaTrash, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import Pagination from "/src/components/Pagination";

const ActivityLogsCard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("timeline"); // "timeline" or "table"
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // 🔹 logs per page

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/User-Handlers/settings/settings_get_activity_logs.php?page=${currentPage}&limit=${limit}`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (!data.error) {
          setLogs(data.logs);
          setTotalPages(data.totalPages);
        } else {
          console.error("Error:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentPage]);

  const getActionIcon = (action) => {
    switch (action.toLowerCase()) {
      case "update":
        return <FaEdit className="text-primary me-1" />;
      case "delete":
        return <FaTrash className="text-danger me-1" />;
      case "login":
        return <FaSignInAlt className="text-success me-1" />;
      case "logout":
        return <FaSignOutAlt className="text-warning me-1" />;
      default:
        return <FaClock className="text-secondary me-1" />;
    }
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="card-title">Activity Logs</h4>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() =>
              setViewMode((prev) => (prev === "timeline" ? "table" : "timeline"))
            }
          >
            Switch to {viewMode === "timeline" ? "Table View" : "Timeline View"}
          </button>
        </div>

        <div className="ps-3 mt-3">
          {loading ? (
            <p>Loading activity logs...</p>
          ) : logs.length === 0 ? (
            <p>No logs found.</p>
          ) : viewMode === "timeline" ? (
            // 🔹 TIMELINE VIEW
            <div className="timeline">
              {logs.map((log) => (
                <div
                  key={log.activity_ID}
                  className="timeline-item border-start border-2 ps-3 mb-3"
                >
                  <div className="d-flex align-items-center mb-1">
                    {getActionIcon(log.action_type)}
                    <strong>{log.account_name || "System"}</strong>
                    <span className="ms-2 badge bg-secondary">{log.module}</span>
                  </div>
                  <small className="text-muted">
                    {new Date(log.created_at).toLocaleString()}
                  </small>
                  <div>{log.description}</div>
                </div>
              ))}
            </div>
          ) : (
            // 🔹 TABLE VIEW
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Module</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.activity_ID}>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                      <td>{log.account_name || "System"}</td>
                      <td>{log.action_type}</td>
                      <td>{log.module}</td>
                      <td>{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 🔹 Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsCard;
