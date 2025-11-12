// src/pages\admin\Assets.jsx

import React, { useState, useEffect, useRef} from "react";
import TableControls from "../../components/TableControls";
import Pagination from "../../components/Pagination";
import Modal from '/src/components/Modal.jsx'
import Popups from "/src/components/Popups.jsx";
import AssetForm from '/src/pages/Super-admin/forms/AssetForm.jsx'
import AssetDetails from '/src/pages/custodians/forms/AssetDetails.jsx';
import AssetImport from "/src/pages/Super-admin/forms/functions/AssetImportCsv";
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
  const [showConfirmYesNo, setShowConfirmYesNo] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const assetImportRef = useRef();
  const [selectedRow, setSelectedRow] = useState(null);

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
    fetch("/api/fetch_data.php?action=custodianassets")
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

  const handleDeleteClick = (assetID) => {
    setAssetToDelete(assetID);
    setShowConfirmYesNo(true);
  };

  const confirmDelete = () => {
  setShowConfirmYesNo(false);

  fetch(`/api/Assets-Handlers/delete_asset.php?id=${assetToDelete}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      setResponseMessage(data.message || "Asset deleted successfully.");
      setShowResponse(true);
      fetchAssets(); // Reload data from server
    })
    .catch((err) => {
      console.error("Delete failed:", err);
      setResponseMessage("Failed to delete asset.");
      setShowResponse(true);
    });
};


  const cancelDelete = () => {
    setAssetToDelete(null);
    setShowConfirmYesNo(false);
  };
  
  const handleExport = () => {
    window.open("/api/Assets-Handlers/export_assets.php", "_blank");
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
                        {/* <button
                          className="action-btn"
                          onClick={() => handleDeleteClick(asset.asset_ID)}
                        >
                          <img
                            src="/resources/imgs/delete.png"
                            alt="Delete"
                            className="action-icon"
                          />
                        </button> */}
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

            <Popups
              showConfirmYesNo={showConfirmYesNo}
              confirmYesNoTitle="Delete Asset"
              confirmYesNoBody="Are you sure you want to archive this asset?"
              confirmYesLabel="Yes, Delete"
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

export default Assets;
