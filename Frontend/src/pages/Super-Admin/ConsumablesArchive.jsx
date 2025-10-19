import React, { useEffect, useState, useRef } from "react";
import TableControls from "/src/components/TableControls";
import ConsumableImport from "/src/pages/Super-admin/forms/functions/ConsumableImport.jsx";
import Modalbigger from "/src/components/Modal-bigger";
import Modal from "/src/components/Modal"; 
import Popups from "/src/components/Popups";
import ConsumableForm from "/src/pages/Super-admin/forms/ConsumableForm.jsx";
import ConsumableDetails from "/src/pages/Super-admin/forms/ConsumableDetails.jsx";
import { generateConsumablePDF } from "/src/pages/Super-admin/forms/functions/GenerateSC.jsx";
import Pagination from "/src/components/Pagination";

const ConsumableArchive = () => {
  const [consumables, setConsumables] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfFilename, setPdfFilename] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedConsumableId, setSelectedConsumableId] = useState(null);
  const [showConfirmYesNo, setShowConfirmYesNo] = useState(false);
  const [consumableToDelete, setConsumableToDelete] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // optional add modal (kept since you had it)
  const [addModalOpen, setAddModalOpen] = useState(false);

  const importRef = useRef();

  useEffect(() => {
    fetchConsumables();
  }, []);

  const fetchConsumables = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/Consumable-Handlers/fetch_consumables_archive.php");
      const data = await response.json();
      if (data.status === "success") {
        setConsumables(data.data);
      } else {
        console.error("Error fetching consumables:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConsumables = consumables.filter((c) =>
    c.kld_property_tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.consumable_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredConsumables.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentConsumables = filteredConsumables.slice(indexOfFirst, indexOfLast);

  const handleDelete = (id) => {
    setConsumableToDelete(id);
    setShowConfirmYesNo(true);
  };

  const confirmDelete = () => {
    setShowConfirmYesNo(false);

    fetch(`/api/Consumable-Handlers/restore_consumable.php?id=${consumableToDelete}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setResponseMessage(data.message || "Consumable restored successfully.");
        setShowResponse(true);
        fetchConsumables();
      })
      .catch((err) => {
        console.error("Restore failed:", err);
        setResponseMessage("Failed to restore consumable.");
        setShowResponse(true);
      });
  };

  const cancelDelete = () => {
    setConsumableToDelete(null);
    setShowConfirmYesNo(false);
  };

  const handleDetail = (id) => {
    setSelectedConsumableId(id);
    setDetailModalOpen(true);
  };

  const handlePDFPreview = async (id) => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    const result = await generateConsumablePDF(id);
    if (result) {
      setPdfUrl(result.url);
      setPdfFilename(result.filename);
      setPdfModalOpen(true);
    } else {
      console.error("Failed to generate consumable PDF");
    }
  };

  return (
    <div className="container-fluid">
      <TableControls
        title="Archived Consumables"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search archived consumables..."
        searchInputTitle="Search by consumable name or tag"
      />

      <ConsumableImport ref={importRef} onImportSuccess={fetchConsumables} />

      {/* Table */}
      <div className="custom-table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>KLD Property Tag</th>
              <th>Name</th>
              <th>Description</th>
              <th>UOM</th>
              <th>Qty</th>
              <th>Price Amount</th>
              <th>Date Acquired</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentConsumables.length > 0 ? (
              currentConsumables.map((c) => (
                <tr key={c.consumable_ID}>
                  <td data-label="KLD Tag">{c.kld_property_tag}</td>
                  <td data-label="Name">{c.consumable_name}</td>
                  <td data-label="Description">{c.description || "-"}</td>
                  <td data-label="UOM">{c.unit_of_measure}</td>
                  <td data-label="Quantity">{c.total_quantity}</td>
                  <td data-label="Amount">
                    {c.price_amount ? parseFloat(c.price_amount).toFixed(2) : "-"}
                  </td>
                  <td data-label="Date Acquired">{c.date_acquired || "-"}</td>
                  <td data-label="Action">
                    <div className="action-btn-group">
                      <button
                        title="More"
                        className="action-btn"
                        onClick={() => handleDetail(c.consumable_ID)}
                      >
                        <img
                          src="/resources/imgs/detail.png"
                          alt="More"
                          className="action-icon"
                        />
                      </button>

                      <button 
                        title="Restore Consumable"
                        className="action-btn"
                        onClick={() => handleDelete(c.consumable_ID)}
                      >
                        <img
                          src="/resources/imgs/restore.png"
                          alt="Restore"
                          className="action-icon"
                        />
                      </button>
                      <button
                        title="Stock Card"
                        className="action-btn"
                        alt="PDF"
                        onClick={() => handlePDFPreview(c.consumable_ID)}
                      >
                        <img
                          src="/resources/imgs/pdf-icon.png"
                          alt="Download PDF"
                          className="action-icon"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No archived consumables found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredConsumables.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Consumable Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Consumable"
      >
        <ConsumableForm fetchConsumables={fetchConsumables}/>
      </Modal>

      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Consumable Details"
      >
        <ConsumableDetails consumableId={selectedConsumableId} />
      </Modal>

      {/* PDF Preview Modal */}
      <Modalbigger
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title="Consumable Details PDF Preview"
        footer={
          <button
            className="btn btn-form-green"
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfUrl;
              link.download = pdfFilename;
              link.click();
            }}
          >
            Download PDF
          </button>
        }
      >
        <div style={{ height: "80vh" }}>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              title="Consumable Details PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </div>
      </Modalbigger>

      <Popups
        showConfirmYesNo={showConfirmYesNo}
        confirmYesNoTitle="Restore Consumable"
        confirmYesNoBody="Are you sure you want to restore this consumable?"
        confirmYesLabel="Yes, Restore"
        confirmNoLabel="Cancel"
        onConfirmYes={confirmDelete}
        onConfirmNo={cancelDelete}
        showResponse={showResponse}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </div>
  );
};

export default ConsumableArchive;
