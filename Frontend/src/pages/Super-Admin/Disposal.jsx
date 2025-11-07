import { useState, useEffect, useMemo } from "react";
import TableControls from "/src/components/TableControls";
import Modal from "/src/components/Modal";
import Modalbigger from "/src/components/Modal-bigger";
import DisposalForm from "/src/pages/Super-admin/forms/DisposalForm";
import { generateDisposalPDF } from "/src/pages/Super-admin/forms/functions/GenerateDisposalPDF.jsx";
import Pagination from "/src/components/Pagination"; //  import pagination

const Disposal = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [disposals, setDisposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // search state
  const [searchQuery, setSearchQuery] = useState("");

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // PDF preview states
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [selectedPDFName, setSelectedPDFName] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchDisposals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/Disposal-Hanlders/fetch_disposal.php");
      const data = await res.json();
      if (data.status === "success") {
        setDisposals(data.data);
      } else {
        console.error("Error fetching disposals:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisposals();
  }, []);

  // PDF preview logic
  const handlePDFPreview = async (disposalID) => {
    try {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);

      const result = await generateDisposalPDF(disposalID); // returns { url, filename }
      if (result) {
        setPdfPreviewUrl(result.url);
        setSelectedPDFName(result.filename);
        setShowPdfPreview(true);
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (err) {
      console.error("PDF preview error:", err);
    }
  };

  // filter disposals based on search query
  const filteredDisposals = useMemo(() => {
    if (!searchQuery.trim()) return disposals;
    const q = searchQuery.toLowerCase();
    return disposals.filter((d) =>
      [d.disposal_no, d.date, d.full_name, d.kld_email, d.unit_name]
        .some((field) => field?.toString().toLowerCase().includes(q))
    );
  }, [searchQuery, disposals]);

  // pagination slice
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredDisposals.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDisposals.length / itemsPerPage);

  return (
    <>
      <TableControls
        title="Disposal"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search Disposal"
        searchInputTitle="Search by disposal no, requestor, email etc."
        onAdd={() => setIsAddModalOpen(true)}
        addButtonTitle="Create New Disposal Form"
      />

      <div className="custom-table-wrapper mt-4">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Disposal #</th>
              <th>Date</th>
              <th>Requestor</th>
              <th>Email</th>
              <th>Department</th>
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
            ) : currentItems.length > 0 ? (
              currentItems.map((d) => (
                <tr key={d.disposal_id}
                className={selectedRow === d.disposal_id ? "selected-row" : ""}>
                  <td data-label="Disposal">{d.disposal_no}</td>
                  <td data-label="Date">{d.date}</td>
                  <td data-label="Requestor">{d.full_name}</td>
                  <td data-label="Email">{d.kld_email}</td>
                  <td data-label="Department">{d.unit_name}</td>
                  <td data-label="PDF">
                    <div className="action-btn-group">
                      <button
                        title="View Disposal PDF"
                        type="button"
                        className="action-btn"
                        onClick={() => {
                          handlePDFPreview(d.disposal_id);
                          setSelectedRow(d.disposal_id);
                        }}
                      >
                        <img
                          src="/resources/imgs/pdf-icon.png"
                          alt="Preview PDF"
                          className="action-icon"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No disposal records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*  Pagination */}
      {!loading && filteredDisposals.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Disposal Form"
      >
        <DisposalForm onSuccess={fetchDisposals} />
      </Modal>

      {/* PDF Preview Modal */}
      <Modalbigger
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        title="Disposal PDF Preview"
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
              title="Disposal PDF Preview"
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

export default Disposal;
