// src/pages\admin\Assets.jsx

import React, { useState, useEffect, useRef} from "react";
import TableControls from "../../components/TableControls";
import Pagination from "../../components/Pagination";
import Modal from '/src/components/Modal.jsx'
import Popups from "/src/components/Popups.jsx";
import AssetForm from '/src/pages/Super-admin/forms/AssetForm.jsx'
import AssetDetails from '/src/pages/Super-admin/forms/AssetDetails.jsx';
import AssetMultiEdit from "/src/pages/Super-admin/forms/AssetMultiEdit";
import AssetImport from "/src/pages/Super-admin/forms/functions/AssetImportCsv";
import { generateAssetPDF } from "/src/pages/Super-admin/forms/functions/GenerateAssetPDF.jsx";
import Modalbigger from "/src/components/Modal-bigger.jsx";

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedAssetID, setSelectedAssetID] = useState(null);
  const [showConfirmYesNo, setShowConfirmYesNo] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseTitle, setResponseTitle] = useState("");
  const assetImportRef = useRef();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [selectedPDFName, setSelectedPDFName] = useState("");
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const itemsPerPage = 7;
  const [showModal, setShowModal] = useState(false);

  const fetchAssets = () => {
    fetch("/api/fetch_data.php?action=assetsborrowable")
      .then((res) => res.json())
      .then((data) => {
        setAssets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  };

  const handleMoreClick = (assetID) => {
    setSelectedAssetID(assetID);
    setShowDetailModal(true);
  };

  const handleModify = () =>{
    setShowModifyModal(true);
  };

  // Toggle asset selection
  const handleRowClick = (assetID) => {
    if (!multiSelectMode) {
      // Enter multi-select mode
      setMultiSelectMode(true);
      setSelectedAssets([assetID]);
    } else {
      setSelectedAssets((prev) => {
        if (prev.includes(assetID)) {
          const updated = prev.filter((id) => id !== assetID);
          if (updated.length === 0) {
            // Auto exit multi-select if no items left
            exitMultiSelect();
          }
          return updated;
        } else {
          return [...prev, assetID];
        }
      });
    }
  };

  //  Exit multi-select mode
  const exitMultiSelect = () => {
    setMultiSelectMode(false);
    setSelectedAssets([]);
  };

  // Multiple delete → set array of IDs
  const handleDeleteSelected = () => {
    if (selectedAssets.length === 0) return;
    setAssetToDelete([...selectedAssets]); // store array
    setShowConfirmYesNo(true);
  };

  // Single delete → set single ID
  const handleDeleteClick = (assetID) => {
    setAssetToDelete(assetID);
    setShowConfirmYesNo(true);
  };

  // Unified confirm delete
  const confirmDelete = () => {
    setShowConfirmYesNo(false);

    if (Array.isArray(assetToDelete)) {
      //  Multiple delete
      fetch(`/api/Assets-Handlers/delete_multiple_assets.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: assetToDelete }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResponseTitle("✅ Asset Deletetion");
          setResponseMessage(data.message || "Selected assets deleted.");
          setShowResponse(true);
          fetchAssets();
          exitMultiSelect();
        })
        .catch((err) => {
          console.error("Delete failed:", err);
          setResponseTitle("❌ Asset Deletetion");
          setResponseMessage("Failed to delete assets.");
          setShowResponse(true);
        });
    } else {
      //  Single delete
      fetch(`/api/Assets-Handlers/delete_asset.php?id=${assetToDelete}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          setResponseTitle("✅ Asset Deletetion");
          setResponseMessage(data.message || "Asset deleted successfully.");
          setShowResponse(true);
          fetchAssets();
        })
        .catch((err) => {
          console.error("Delete failed:", err);
          setResponseTitle("❌ Asset Deletetion");
          setResponseMessage("Failed to delete asset.");
          setShowResponse(true);
        });
    }
  };

  const cancelDelete = () => {
    setAssetToDelete(null);
    setShowConfirmYesNo(false);
  };

  const handlePDFPreview = async (assetID) => {
  try {
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);

    const result = await generateAssetPDF(assetID);
    if (result) {
      setPdfPreviewUrl(result.url);
      setSelectedPDFName(result.filename);
      setShowPdfPreview(true);
    } else {
      console.error("Failed to generate Asset PDF");
    }
  } catch (err) {
    console.error("PDF preview error:", err);
  }
};


  // Register global function to reload from anywhere
  useEffect(() => {
    fetchAssets(); // initial load

    window.reloadAssetTable = () => {
      setLoading(true); // optional: show spinner again
      fetchAssets();
    };

    return () => {
      delete window.reloadAssetTable;
    };
  }, []);

  // Filter logic
  useEffect(() => {
    const filtered = assets.filter((a) =>
      Object.values(a).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAssets(filtered);
    setCurrentPage(1);
  }, [searchQuery, assets]);

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredAssets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);


  return (
    <div className="container-fluid">
      <TableControls
        title="Assets"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search assets..."
        searchInputTitle="Search by asset name or tag"
      />

      <AssetImport ref={assetImportRef} onImportSuccess={fetchAssets} />
        {loading ? (
          <>
            <div className="loading-data">
                <p>loading</p>
                <img 
                  src="/resources/imgs/loading.gif"
                  alt="Loading..."
                  style={{ width: "40px", height: "40px" }}  
                />
            </div>
          </>
        ) : currentItems.length === 0 ? (
          <p className="text-center text-muted">No matching assets found.</p>
        ) : (
          <>
          <div className="custom-table-wrapper">
            <div className="mb-2 d-flex justify-content-between align-items-center">
              <span>{selectedAssets.length} selected</span>
              <div className="action-btn-group">
                <button
                  title={
                    selectedAssets.length === filteredAssets.length && filteredAssets.length > 0
                      ? "Deselect All"
                      : "Select All"
                  }
                  className="action-btn"
                  onClick={() => {
                    if (selectedAssets.length === filteredAssets.length) {
                      // Deselect all
                      setSelectedAssets([]);
                      setMultiSelectMode(false);
                    } else {
                      // Select all filtered items (across all pages)
                      setMultiSelectMode(true);
                      setSelectedAssets(filteredAssets.map((asset) => asset.asset_ID));
                    }
                  }}
                >
                  <img
                    src="/resources/imgs/select-all.png"
                    alt="Select All"
                    className="action-icon"
                  />
                </button>

                <button
                  title="Modify"
                  className="action-btn"
                  onClick={handleModify}
                  disabled={selectedAssets.length === 0}
                >
                  <img
                    src="/resources/imgs/modify.png"
                    alt="Modify"
                    className="action-icon"
                  />
                </button>
                <button
                  title="Archive Selected"
                  className="action-btn"
                  onClick={handleDeleteSelected}
                  disabled={selectedAssets.length === 0}
                >
                  <img
                    src="/resources/imgs/delete.png"
                    alt="Archive"
                    className="action-icon"
                  />
                </button>
                <button
                  title="Cancel"
                  className="action-btn"
                  onClick={exitMultiSelect}
                  disabled={selectedAssets.length === 0}
                >
                  <img
                    src="/resources/imgs/decline.png"
                    alt="Cancel"
                    className="action-icon"
                  />
                </button>
              </div>
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  {multiSelectMode && <th>Select</th>}
                  <th>Accounted</th>
                  <th>KLD Property Tag</th>
                  <th>Brand</th>
                  <th>Asset Type</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((asset) => {
                  const isSelected = selectedAssets.includes(asset.asset_ID);
                  return (
                    <tr
                      key={asset.asset_ID}
                      onClick={() => handleRowClick(asset.asset_ID)}
                      className={`table-row ${
                        isSelected || selectedRow === asset.asset_ID ? "selected-row" : ""
                      }`}
                    >
                      {multiSelectMode && (
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                          />
                        </td>
                      )}
                      <td data-label="Accounted">{asset.responsible}</td>
                      <td data-label="KLD Tag">{asset.kld_property_tag}</td>
                      <td data-label="Brand">{asset.brand_name}</td>
                      <td data-label="Asset Type">{asset.asset_type}</td>
                      <td className="highlight-data" data-label="Asset Condition">{asset.asset_condition}</td>
                      <td data-label="Status">
                        <span className={`status-badge ${asset.asset_status}`}>
                        {asset.asset_status.charAt(0).toUpperCase() + asset.asset_status.slice(1)}
                        </span>
                      </td>
                      <td data-label="Action">
                        <div className="action-btn-group">
                          <button
                            title="More"
                            className="action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoreClick(asset.asset_ID);
                              setSelectedRow(asset.asset_ID);
                            }}
                          >
                            <img src="/resources/imgs/detail.png" alt="More" className="action-icon" />
                          </button>
                          <button
                            title="Archive Asset"
                            className="action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(asset.asset_ID);
                              setSelectedRow(asset.asset_ID);
                            }}
                            disabled={multiSelectMode}  // disable when multi-select is on
                          >
                            <img src="/resources/imgs/delete.png" alt="Delete" className="action-icon" />
                          </button>
                          <button
                            title="Property Card"
                            className="action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePDFPreview(asset.asset_ID);
                              setSelectedRow(asset.asset_ID);
                            }}
                          >
                            <img src="/resources/imgs/pdf-icon.png" alt="PDF" className="action-icon" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Asset">
              {showModal && (
                <AssetForm
                  key={formResetSignal} // This forces re-mount
                  onClose={() => setShowModal(false)}
                  fetchAssets={fetchAssets}
                />
              )}
            </Modal>
            <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)}title="Asset Details">
              <AssetDetails 
              assetID={selectedAssetID} 
              onClose={() => setShowDetailModal(false)} 
              fetchAssets={fetchAssets}
              />
            </Modal>
            <Modal isOpen={showModifyModal} onClose={() => setShowModifyModal(false)} title="Multi Edit Assets">
              {showModifyModal && (
                <AssetMultiEdit 
                  assetIDs={selectedAssets} 
                  onClose={() => setShowModifyModal(false)}
                  fetchAssets={fetchAssets}
                />
              )}
            </Modal>
            <Modalbigger
              isOpen={showPdfPreview}
              onClose={() => setShowPdfPreview(false)}
              title="Asset PDF Preview"
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
                    title="Asset PDF Preview"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                  />
                )}
              </div>
            </Modalbigger>

            <Popups
              showConfirmYesNo={showConfirmYesNo}
              confirmYesNoTitle="⚠️ Delete Asset"
              confirmYesNoBody="Are you sure you want to archive this asset/s?"
              confirmYesLabel="Yes, Delete"
              confirmNoLabel="Cancel"
              onConfirmYes={confirmDelete}
              onConfirmNo={cancelDelete}

              responseTitle={responseTitle}
              showResponse={showResponse}
              responseMessage={responseMessage}
              onCloseResponse={() => setShowResponse(false)}

              showLoading={showLoading}
              loadingText="Generating PDF, please wait..."
            />

      </div>
  );
};

export default Assets;
