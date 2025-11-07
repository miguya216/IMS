import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";

const Logs = () => {
  const [log, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(5);

  useEffect(() => {
    fetch("/api/Reference-Data/fetch_ref_data.php?action=logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Error fetching Logs:", err));
  }, []);

  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = log.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(log.length / logsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleSelectChange = (e) => {
    setLogsPerPage(Number(e.target.value));
    setCurrentPage(1); // reset to first page
  };

  return (
    <div>
      <h5 className="mb-3">Activity Logs</h5>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <Form.Select value={logsPerPage} onChange={handleSelectChange} style={{ width: "120px" }}>
          <option value="5">5 entries</option>
          <option value="10">10 entries</option>
          <option value="25">25 entries</option>
        </Form.Select>
        <small className="text-muted">Total Logs: {log.length}</small>
      </div>

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Logs</th>
          </tr>
        </thead>
        <tbody>
          {currentLogs.map((log, index) => (
            <tr key={log.log_ID}>
              <td>{indexOfFirstLog + index + 1}</td>
              <td>{log.log_content}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-end">
          <Pagination>
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Logs;
