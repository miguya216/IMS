import { useEffect, useState, useMemo } from "react";
import TableControls from "/src/components/TableControls";
import Modalbigger from "/src/components/Modal-bigger";
import Pagination from "/src/components/Pagination";
import { AuditIIRPDF } from "/src/pages/Super-admin/forms/functions/AuditIIRPDF.jsx"; // you'll make this similar to AuditPTRPDF

const AuditIIR = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState(null); 
  
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // PDF states
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [selectedPDFName, setSelectedPDFName] = useState("");

  // fetch IIR
  const fetchIIR = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/Inventory-Inspection-Hanlders/fetch_iir.php");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error("Error fetching IIR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIIR();
  }, []);

  // PDF preview
  const handlePDFPreview = async (iir_id) => {
    try {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);

      const result = await AuditIIRPDF(iir_id); // { url, filename }
      if (result) {
        setPdfPreviewUrl(result.url);
        setSelectedPDFName(result.filename);
        setShowPdfPreview(true);
      } else {
        console.error("Failed to generate IIR PDF");
      }
    } catch (err) {
      console.error("PDF preview error:", err);
    }
  };

  // search filter
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const query = searchQuery.toLowerCase();
    return records.filter(
      (rec) =>
        rec.iir_no?.toLowerCase().includes(query) ||
        rec.employee_name?.toLowerCase().includes(query) ||
        rec.room_no?.toLowerCase().includes(query)
    );
  }, [records, searchQuery]);

  // pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <TableControls
        title="Inventory Inspection Records"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search IIR"
        searchInputTitle="Search IIR no., Employee name, or Room no."
      />

      <div className="custom-table-wrapper mt-4">
        <table className="custom-table">
          <thead>
            <tr>
              <th>IIR no.</th>
              <th>Employee Name</th>
              <th>Room No.</th>
              <th>Department</th>
              <th>Role</th>
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
              paginatedRecords.map((rec) => (
                <tr key={rec.iir_id}
                className={selectedRow === rec.iir_id ? "selected-row" : ""}>
                  <td data-label="IIR no.">{rec.iir_no}</td>
                  <td data-label="Employee Name">{rec.employee_name}</td>
                  <td data-label="Room No.">{rec.room_no}</td>
                  <td data-label="Department">{rec.unit}</td>
                  <td data-label="Role">{rec.role}</td>
                  <td data-label="PDF">
                    <div className="action-btn-group">
                      <button
                        title="View Inventory Inspection Record"
                        className="action-btn"
                        onClick={() => {
                          handlePDFPreview(rec.iir_id);
                          setSelectedRow(rec.iir_id);
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
                  No records found
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
        title="Inventory Inspection Report PDF"
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
              title="IIR PDF Preview"
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

export default AuditIIR;
