// src/pages\admin\Assets.jsx

import React, { useState, useEffect, useRef} from "react";
import TableControls from "../../components/TableControls";
import Pagination from "../../components/Pagination";
import Modal from '/src/components/Modal.jsx'
import Modalbigger from "/src/components/Modal-bigger.jsx";
import Popups from "/src/components/Popups.jsx";
import AssetForm from '/src/pages/Super-admin/forms/AssetForm.jsx'
import AssetDetails from '/src/pages/custodians/forms/AssetDetails.jsx';
import AssetImport from "/src/pages/Super-admin/forms/functions/AssetImportCsv";
import { generateAssetPDF } from "/src/pages/Super-admin/forms/functions/GenerateAssetPDF.jsx";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";

const Assets = () => {
  const { lastMessage, isConnected } = useWebSocketContext();

  const [formResetSignal, setFormResetSignal] = useState(0);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAssetID, setSelectedAssetID] = useState(null);
  const assetImportRef = useRef();
  const [selectedRow, setSelectedRow] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [selectedPDFName, setSelectedPDFName] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");


  const handleImport = () => {
    assetImportRef.current?.importCsv();
  };

  const itemsPerPage = 7;
  const [showModal, setShowModal] = useState(false);

  const handleAddAsset = () => {
    setFormResetSignal(Date.now());
    setShowModal(true);
  };

  const fetchAssets = () => {
    fetch("/api/fetch_data.php?action=custodianassetsarchive")
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

  // websocket
  useEffect(() => {
    if (!lastMessage) return;
    // If the incoming message is a JSON object indicating refresh, call fetchRIS
    try {
      const msg = typeof lastMessage === "string" ? JSON.parse(lastMessage) : lastMessage;
      if (msg && msg.type === "refreshAsset") {
        // either optimistically insert msg.ris data, or just refetch
        fetchAssets();
      }
    } catch (e) {
      // ignore non-json messages
    }
  }, [lastMessage]);

  const handleExport = () => {
    window.open("/api/Assets-Handlers/export_assets.php", "_blank");
  };

  
  const handlePDFPreview = async (assetID) => {
    setLoadingText("Generating Property Card PDF, please wait...");
    setShowLoading(true);
  
    try {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
  
      const result = await generateAssetPDF(assetID);
      if (result) {
        setPdfPreviewUrl(result.url);
        setSelectedPDFName(result.filename);
        setShowPdfPreview(true);
      } else {
        console.error("Failed to generate Asset PDF");
        setShowLoading(false);
      }
    } catch (err) {
      console.error("PDF preview error:", err);
      setShowLoading(false);
    } finally {
      setShowLoading(false);
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
        onAdd={handleAddAsset}
        onFilter={() => console.log("Filter clicked")}
        onExport={handleExport}
        showImportButton={true}
        onImport={handleImport}
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
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Accounted</th>
                  <th>KLD Property Tag</th>
                  <th>Property Tag</th>
                  <th>Brand</th>
                  <th>Asset Type</th>
                  <th>Condition</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((asset) => (
                  <tr 
                    key={asset.asset_ID}
                    className={selectedRow === asset.asset_ID ? "selected-row" : ""}
                  >
                    <td data-label="Accounted">{asset.responsible}</td>
                    <td data-label="KLD Property Tag">{asset.kld_property_tag}</td>
                    <td data-label="Property Tag">{asset.property_tag}</td>
                    <td data-label="Brand">{asset.brand_name}</td>
                    <td data-label="Asset Type">{asset.asset_type}</td>
                    <td className="highlight-data" data-label="Condition">{asset.asset_condition}</td>
                    <td data-label="Details">
                      <div className="action-btn-group">
                        <button
                          title="More"
                          className="action-btn"
                          onClick={() => {
                            handleMoreClick(asset.asset_ID);
                            setSelectedRow(asset.asset_ID);
                          }}
                        >
                          <img
                            src="/resources/imgs/detail.png"
                            alt="More"
                            className="action-icon"
                          />
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
                ))}
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

            <Modalbigger
              isOpen={showPdfPreview}
              onClose={() => setShowPdfPreview(false)}
              title="Asset Details PDF Preview"
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
                    title="Asset Details PDF Preview"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                  />
                )}
              </div>
            </Modalbigger>

            <Popups
              showLoading={showLoading}
              loadingText={loadingText || "Generating PDF, please wait..."}
            />

      </div>
  );
};

export default Assets;
