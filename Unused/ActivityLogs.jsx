import { useEffect, useState, useMemo } from "react";
import TableControls from "/src/components/TableControls";
import Pagination from "/src/components/Pagination"; // ✅ import pagination

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // search state
  const [searchQuery, setSearchQuery] = useState("");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // ✅ adjust if needed

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fetch_activity_logs.php");
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  // filter logs by search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter((log) =>
      [log.done_by, log.action_type, log.module, log.description, log.created_at]
        .some((field) => field?.toString().toLowerCase().includes(q))
    );
  }, [searchQuery, logs]);

  // pagination: slice filtered logs
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  // reset to page 1 if search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <TableControls
        title="Activity Logs"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search Activity Logs"
        searchInputTitle="Search Done by, action type, module, description, or date"
      />

      <div className="custom-table-wrapper mt-4">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Done by</th>
              <th>Action Type</th>
              <th>Module</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <tr key={log.activity_ID}>
                  <td>{log.done_by || "System"}</td>
                  <td>{log.action_type}</td>
                  <td>{log.module}</td>
                  <td>{log.description}</td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No logs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredLogs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default ActivityLogs;
