import { useEffect, useState, useMemo } from "react";
import TableControls from "/src/components/TableControls";
import Pagination from "/src/components/Pagination"; // import pagination
import Modalbigger from "/src/components/Modal-bigger"; // modal for preview
import { AuditRoomAssignationPDF } from "/src/pages/Super-admin/forms/functions/AuditRoomAssignationPDF.jsx"; // ✅ pdf generator

const AuditRoomAssignation = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  // search state
  const [searchQuery, setSearchQuery] = useState("");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // PDF preview states
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [selectedPDFName, setSelectedPDFName] = useState("");

  const fetchRoomAssignations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/Room-Handlers/fetch_room_assignation.php");
      const data = await res.json();

      if (data.success) {
        setRecords(data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomAssignations();
  }, []);

  // PDF preview
  const handlePDFPreview = async (room_assignation_ID) => {
    try {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);

      const result = await AuditRoomAssignationPDF(room_assignation_ID); // should return { url, filename }
      if (result) {
        setPdfPreviewUrl(result.url);
        setSelectedPDFName(result.filename);
        setShowPdfPreview(true);
      } else {
        console.error("Failed to generate Room Assignation PDF");
      }
    } catch (err) {
      console.error("PDF preview error:", err);
    }
  };

  // filter records by search query
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter((row) =>
      [
        row.room_assignation_no,
        row.from_room,
        row.to_room,
        row.moved_by,
        row.moved_at,
      ].some((field) => field?.toString().toLowerCase().includes(q))
    );
  }, [searchQuery, records]);

  // pagination: slice filtered records
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // reset to page 1 if search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <TableControls
        title="Room Assignation Records"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search Room Assignation"
        searchInputTitle="Search by assignation no., rooms, moved by, or date"
      />

      <div className="custom-table-wrapper mt-4">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Room Assigna. No.</th>
              <th>From Room</th>
              <th>To Room</th>
              <th>Moved By</th>
              <th>Moved At</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">
                  <div className="loading-data">
                      <p>loading</p>
                      <img 
                        src="/resources/imgs/loading.gif"
                        alt="Loading..."
                        style={{ width: "40px", height: "40px" }}  
                      />
                  </div>
                </td>
              </tr>
            ) : paginatedRecords.length > 0 ? (
              paginatedRecords.map((row) => (
                <tr key={row.room_assignation_ID}
                 className={selectedRow === row.room_assignation_ID ? "selected-row" : ""}>
                  <td>{row.room_assignation_no}</td>
                  <td>{row.from_room || "Not Assigned Yet"}</td>
                  <td>{row.to_room}</td>
                  <td>{row.moved_by}</td>
                  <td>
                    {row.moved_at
                      ? new Date(row.moved_at).toLocaleDateString()
                      : ""}
                  </td>
                  <td>
                    <div className="action-btn-group">
                      <button
                        title="View Room Assignation Record"
                        className="action-btn"
                        onClick={() => {
                          handlePDFPreview(row.room_assignation_ID);
                          setSelectedRow(row.room_assignation_ID);
                        }}
                      >
                        <img
                          src="/resources/imgs/pdf-icon.png"
                          className="action-icon"
                          alt="Preview PDF"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredRecords.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* PDF Preview Modal */}
      <Modalbigger
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        title="Room Assignation Report PDF"
        footer={
          <button
            className="btn btn-form-green"
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfPreviewUrl;
              link.download = selectedPDFName;
              link.click();
            }}
          >
            Download PDF
          </button>
        }
      >
        <div style={{ height: "80vh" }}>
          {pdfPreviewUrl && (
            <iframe
              src={pdfPreviewUrl}
              title="Room Assignation PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </div>
      </Modalbigger>
    </>
  );
};

export default AuditRoomAssignation;
