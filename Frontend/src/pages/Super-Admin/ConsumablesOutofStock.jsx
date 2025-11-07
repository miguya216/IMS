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

const ConsumablesOutofStock = () => {
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
  const [responseTitle, setResponseTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const importRef = useRef();

  useEffect(() => {
    fetchConsumables();
  }, []);

  const fetchConsumables = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/Consumable-Handlers/fetch_outOfStock_consumables.php");
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

    fetch(`/api/Consumable-Handlers/delete_consumable.php?id=${consumableToDelete}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setResponseTitle("✅ Consumable Deletion");
        setResponseMessage(data.message || "Consumable deleted successfully.");
        setShowResponse(true);
        fetchConsumables(); 
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        setResponseTitle("❌ Consumable Deletion");
        setResponseMessage("Failed to delete consumable.");
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

  //  Single item PDF Preview
  const handlePDFPreview = async (id) => {
    try {
      setShowLoading(true);

      if (pdfUrl) URL.revokeObjectURL(pdfUrl);

      const result = await generateConsumablePDF(id);
      if (result) {
        setPdfUrl(result.url);
        setPdfFilename(result.filename);
        setPdfModalOpen(true);
      } else {
        console.error("Failed to generate consumable PDF");
      }
    } catch (err) {
      console.error("PDF preview error:", err);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <TableControls
        title="Consumables"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search consumable..."
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
             {loading ? (
                <tr>
                  <td colSpan="8">
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
              ) : currentConsumables.length > 0 ? (
              currentConsumables.map((c) => (
                <tr 
                  key={c.consumable_ID}
                  className={selectedRow === c.consumable_ID ? "selected-row" : ""}
                >
                  <td data-label="KLD Tag">{c.kld_property_tag}</td>
                  <td data-label="Name">{c.consumable_name}</td>
                  <td data-label="Description">{c.description || "-"}</td>
                  <td data-label="UOM">{c.unit_of_measure}</td>
                  <td
                    data-label="Quantity"
                    style={{
                      color: c.total_quantity <= 10 ? "red" : "inherit",
                      backgroundColor: c.total_quantity <= 10 ? "#ffe5e5" : "transparent",
                      fontWeight: c.total_quantity <= 10 ? "bold" : "normal",
                    }}
                  >
                    {c.total_quantity}
                  </td>
                  <td data-label="Amount">
                    {c.price_amount ? parseFloat(c.price_amount).toFixed(2) : "-"}
                  </td>
                  <td data-label="Date Acquired">{c.date_acquired || "-"}</td>
                  <td data-label="Action">
                    <div className="action-btn-group">
                      <button
                        title="More"
                        className="action-btn"
                        onClick={() => {
                          handleDetail(c.consumable_ID);
                          setSelectedRow(c.consumable_ID);
                        }}
                      >
                        <img src="/resources/imgs/detail.png" alt="More" className="action-icon" />
                      </button>

                      <button 
                        title="Archive Consumable"
                        className="action-btn"
                        onClick={() => {
                          handleDelete(c.consumable_ID); 
                          setSelectedRow(c.consumable_ID);
                        }}
                      >
                        <img src="/resources/imgs/delete.png" alt="Delete" className="action-icon" />
                      </button>

                      <button
                        title="Stock Card"
                        className="action-btn"
                        onClick={() => {
                          handlePDFPreview(c.consumable_ID);
                          setSelectedRow(c.consumable_ID);
                         }}
                      >
                        <img src="/resources/imgs/pdf-icon.png" alt="PDF" className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No consumables found.
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

      {/* Details Modal */}
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

      {/* Popups */}
      <Popups
        showConfirmYesNo={showConfirmYesNo}
        confirmYesNoTitle="⚠️ Delete Consumable"
        confirmYesNoBody="Are you sure you want to archive this consumable?"
        confirmYesLabel="Yes, Delete"
        confirmNoLabel="Cancel"
        onConfirmYes={confirmDelete}
        onConfirmNo={cancelDelete}

        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}

        showLoading={showLoading}
        loadingText="Generating PDF, please wait..."
      />
    </div>
  );
};

export default ConsumablesOutofStock;
