import { useEffect, useState, useMemo } from "react";
import TableControls from "/src/components/TableControls";
import Modalbigger from "/src/components/Modal-bigger";
import { AuditPTRPDF } from "/src/pages/Super-admin/forms/functions/AuditPTRPDF.jsx";
import Pagination from "/src/components/Pagination"; // ✅ import your pagination

const AuditPTR = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // search state
  const [searchQuery, setSearchQuery] = useState("");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // ✅ adjust as needed

  // PDF preview states
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [selectedPDFName, setSelectedPDFName] = useState("");

  const fetchPTR = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/Transfer-Form/fetch_pt_records.php");
      const data = await response.json();

      if (data.success) {
        setRecords(data.data);
      } else {
        console.error("Fetch failed:", data.message);
      }
    } catch (error) {
      console.error("Error fetching PTR records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPTR();
  }, []);

  // PDF preview
  const handlePDFPreview = async (ptr_ID) => {
    try {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);

      const result = await AuditPTRPDF(ptr_ID); // should return { url, filename }
      if (result) {
        setPdfPreviewUrl(result.url);
        setSelectedPDFName(result.filename);
        setShowPdfPreview(true);
      } else {
        console.error("Failed to generate PTR PDF");
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
      [row.ptr_number, row.from_accounted, row.to_accounted, row.transfer_date]
        .some((field) => field?.toString().toLowerCase().includes(q))
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
        title="Property Transfer Records"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search PTR"
        searchInputTitle="Search PTR no., account names, or date."
      />

      <div className="custom-table-wrapper mt-4">
        <table className="custom-table">
          <thead>
            <tr>
              <th>PTR no.</th>
              <th>From Accounted</th>
              <th>To Accounted</th>
              <th>Date</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : paginatedRecords.length > 0 ? (
              paginatedRecords.map((row) => (
                <tr key={row.ptr_ID}>
                  <td data-label="PTR #">{row.ptr_number}</td>
                  <td data-label="From Accounted">{row.from_accounted}</td>
                  <td data-label="To Accounted">{row.to_accounted}</td>
                  <td data-label="Date">
                    {new Date(row.transfer_date).toLocaleDateString()}
                  </td>
                  <td data-label="PDF">
                    <div className="action-btn-group">
                      <button
                        title="View Property Transfer Record"
                        className="action-btn"
                        onClick={() => handlePDFPreview(row.ptr_ID)}
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
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No property transfer records found.
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
        title="Property Transfer Report PDF"
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
              title="PTR PDF Preview"
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

export default AuditPTR;
