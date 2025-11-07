import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TableControls from "/src/components/TableControls";
import Modal from "/src/components/Modal";
import Modalbigger from "/src/components/Modal-bigger";
import Pagination from "/src/components/Pagination"; 
import RequisitionIssuanceForm from "/src/pages/custodians/forms/RequisitionIssueForm.jsx";
import RequisitionIssueDetails from "/src/pages/custodians/forms/RequisitionIssueDetails.jsx";
import { generateRISPDF } from "/src/pages/Super-admin/forms/functions/GenerateRISPDF.jsx";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";

const RequisitionIssuance = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const risNoFromNotif = queryParams.get("ris_no");

  const { lastMessage, isConnected } = useWebSocketContext();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [risList, setRisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRIS, setSelectedRIS] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // PDF preview states
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [selectedPDFName, setSelectedPDFName] = useState(""); 

  // new states for search + pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRisList, setFilteredRisList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Fetch RIS data
  const fetchRIS = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/RIS-Handlers/fetch_custodian_RIS_data.php");
      const data = await response.json();
      if (data.status === "success") {
        setRisList(data.data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Call once on mount
  useEffect(() => {
    fetchRIS();
  }, []);

   // websocket
  useEffect(() => {
    if (!lastMessage) return;
    // If the incoming message is a JSON object indicating refresh, call fetchRIS
    try {
      const msg = typeof lastMessage === "string" ? JSON.parse(lastMessage) : lastMessage;
      if (msg && msg.type === "refreshRIS") {
        // either optimistically insert msg.ris data, or just refetch
        fetchRIS();
      }
    } catch (e) {
      // ignore non-json messages
    }
  }, [lastMessage]);

  // redirect to modal from notification
  useEffect(() => {
    if (risNoFromNotif && risList.length > 0) {
      const match = risList.find(r => r.ris_number === risNoFromNotif);
      if (match) {
        setSelectedRIS(match.ris_ID);
        setIsDetailsModalOpen(true);
        window.history.replaceState({}, "", "/custodians/requisitionissuance");
      }
    }
  }, [risList, risNoFromNotif]);

  // Filtering logic
  useEffect(() => {
    const filtered = risList.filter((r) =>
      Object.values(r).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRisList(filtered);
    setCurrentPage(1);
  }, [searchQuery, risList]);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredRisList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRisList.length / itemsPerPage);

  const handlePDFPreview = async (risID) => {
    try {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);

      const result = await generateRISPDF(risID); // returns { url, filename }
      if (result) {
        setPdfPreviewUrl(result.url);
        setSelectedPDFName(result.filename); // store filename for download
        setShowPdfPreview(true);
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (err) {
      console.error("PDF preview error:", err);
    }
  };

  return (
    <>
        <TableControls
          title="Requisition and Issuance"
          onAdd={() => setIsAddModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search RIS..."
          addButtonTitle="Add New RIS"
        />

        <div className="custom-table-wrapper mt-4">
          <table className="custom-table">
            <thead>
              <tr>
                <th>RIS number</th>
                <th>Office / Unit</th>
                <th>Employee name</th>
                <th>RIS Type</th>
                <th>RIS Status</th>
                <th>Action</th>
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
                currentItems.map((ris, index) => (
                  <tr
                    key={index}
                    className={selectedRow === ris.ris_ID ? "selected-row" : ""}
                  >
                    <td data-label="RIS number">{ris.ris_number}</td>
                    <td data-label="Office / Unit">{ris.office_unit}</td>
                    <td data-label="Employee name">{ris.employee_name}</td>
                    <td data-label="RIS Type">{ris.ris_type}</td>
                    <td data-label="RIS Status">
                      <span className={`status-badge ${ris.ris_status}`}>
                        {ris.ris_status.charAt(0).toUpperCase() + ris.ris_status.slice(1)}
                      </span>
                    </td>
                      <td data-label="Action">
                      <div className="action-btn-group">
                        <button
                          title="More"
                          type="button"
                          className="action-btn"
                          onClick={() => {
                            setSelectedRIS(ris.ris_ID);
                            setSelectedRow(ris.ris_ID);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <img
                            src="/resources/imgs/detail.png"
                            alt="More"
                            className="action-icon"
                          />
                        </button>

                        {/* PDF Preview button */}
                        <button
                          title="RIS PDF"
                          type="button"
                          className="action-btn"
                          onClick={() => {
                            handlePDFPreview(ris.ris_ID);
                            setSelectedRow(ris.ris_ID);
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
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredRisList.length > 0 && (
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
        title="Requisition and Issuance Form"
      >
        <RequisitionIssuanceForm refreshTable={fetchRIS} />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Requisition and Issuance Details"
      >
        <RequisitionIssueDetails risID={selectedRIS} refreshTable={fetchRIS} />
      </Modal>

      {/* PDF Preview Modal */}
      <Modalbigger
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        title="RIS PDF Preview"
      >
        <div style={{ height: "80vh" }}>
          {pdfPreviewUrl && (
            <iframe
              src={pdfPreviewUrl}
              title="RIS PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
          {/* Download button overlay */}
          <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                className="btn btn-form-green"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = pdfPreviewUrl;
                  link.download = selectedPDFName; // use dynamic filename
                  link.click();
                }}
              >
                Download PDF
              </button>
          </div>  
        </div>
      </Modalbigger>
    </>
  );
};

export default RequisitionIssuance;
