import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import Modalbigger from "/src/components/Modal-bigger.jsx";
import { generateTransferPDFPreview } from "/src/pages/Super-admin/forms/functions/GenerateTransferPDF";
import Select from "react-select";
import QRScannerModal from "/src/components/QRScannerModal";
import Popups from "/src/components/Popups.jsx";
import { generateAssetPDF } from "/src/pages/Super-admin/forms/functions/GenerateAssetPDF.jsx";
import { useWebSocketContext } from "/src/layouts/context/WebSocketProvider";

const TransferAccountability = () => {
  const { send: sendWS, isConnected: wsConnected } = useWebSocketContext();
  const [users, setUsers] = useState([]);
  const [selectedFromUser, setSelectedFromUser] = useState("");
  const [selectedToUser, setSelectedToUser] = useState("");
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [transferTypes, setTransferTypes] = useState([]);
  const [selectedTransferType, setSelectedTransferType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showConfirmYesNo, setShowConfirmYesNo] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [selectedPDFName, setSelectedPDFName] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  // pagination for selected assets
  const [selectedCurrentPage, setSelectedCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter assets by searchTerm (already lowercased)
  const filteredAssets = assets.filter((asset) =>
    Object.values(asset)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination for available assets
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

  // PDF preview state
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showAssetPdfPreview, setShowAssetPdfPreview] = useState(false);

  useEffect(() => {
    fetch("/api/dropdown_fetch.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
        if (data.transfer_type) setTransferTypes(data.transfer_type);
      })
      .catch((err) => console.error("Error fetching dropdown:", err));
  }, []);

  useEffect(() => {
    if (!selectedFromUser) {
      setAssets([]);
      setSelectedAssets([]);
      return;
    }

    fetch(`/api/Transfer-Form/fetch_asset_by_user_id.php?user_ID=${selectedFromUser}`)
      .then((res) => res.json())
      .then((data) => {
        setAssets(data || []);
        setSelectedAssets([]);
      })
      .catch((err) => console.error("Error fetching assets:", err));
  }, [selectedFromUser]);


  // toggle single asset by asset_ID
  const toggleSelect = (assetId) => {
    setSelectedAssets((prevSelected) =>
      prevSelected.includes(assetId)
        ? prevSelected.filter((id) => id !== assetId)
        : [...prevSelected, assetId]
    );
  };

  // Toggle all currently visible (page) assets
  const toggleSelectAllOnPage = () => {
    const currentPageIds = paginatedAssets.map((a) => a.asset_ID);
    const areAllSelected = currentPageIds.every((id) => selectedAssets.includes(id));

    if (areAllSelected) {
      // remove current page ids from selection
      setSelectedAssets((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      // add current page ids to selection (unique)
      setSelectedAssets((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  // Toggle all filtered assets (global filtered set)
  const toggleSelectAllFiltered = () => {
    const filteredIds = filteredAssets.map((a) => a.asset_ID);
    const areAllFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedAssets.includes(id));

    if (areAllFilteredSelected) {
      // remove all filtered ids
      setSelectedAssets((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      // add all filtered ids
      setSelectedAssets((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // list for right column (selected assets details)
  const selectedAssetsList = assets.filter((a) => selectedAssets.includes(a.asset_ID));
  const selectedTotalPages = Math.ceil(selectedAssetsList.length / itemsPerPage);
  const selectedIndexOfLastItem = selectedCurrentPage * itemsPerPage;
  const selectedIndexOfFirstItem = selectedIndexOfLastItem - itemsPerPage;
  const currentSelectedAssets = selectedAssetsList.slice(selectedIndexOfFirstItem, selectedIndexOfLastItem);

  // reset selected pagination when selection changes
  useEffect(() => {
    setSelectedCurrentPage(1);
  }, [selectedAssets]);

  // -------------- END SELECTION LOGIC ----------------

  // Transmit → Preview
  const handleTransfer = async () => {
  if (selectedFromUser === selectedToUser) {
    setResponseTitle("⚠️ Invalid Input");
    setResponseMessage("From and To accountable cannot be the same.");
    setShowResponse(true);
    return;
  }
  if (selectedAssets.length === 0) {
    setResponseTitle("⚠️ Invalid Input");
    setResponseMessage("No assets selected for transfer.");
    setShowResponse(true);
    return;
  }

  const fromName = users.find((u) => u.user_ID === parseInt(selectedFromUser))?.full_name || "";
  const toName = users.find((u) => u.user_ID === parseInt(selectedToUser))?.full_name || "";

  const includedAssets = assets.filter((a) => selectedAssets.includes(a.asset_ID));

  try {
    const url = await generateTransferPDFPreview(
      fromName,
      toName,
      includedAssets,
      transferTypes,
      selectedTransferType
    );

    if (!url) {
      setResponseTitle("❌ Failed");
      setResponseMessage("Failed to generate PDF preview.");
      setShowResponse(true);
      return;
    }

    setPdfPreviewUrl(url);
    setShowPdfPreview(true);
  } catch (err) {
    console.error("Error generating PDF preview:", err);
    setResponseTitle("❌ Failed");
    setResponseMessage("An error occurred while generating PDF preview.");
    setShowResponse(true);
  }
};

  // Confirm download (popup)
  const handleConfirmDownloadClick = () => {
    setShowConfirmYesNo(true);
  };

  // Confirm yes → submit and download
  const handleConfirmDownloadYes = async () => {
    setShowConfirmYesNo(false);

  const includedAssets = assets.filter(a => selectedAssets.includes(a.asset_ID));
  const payload = {
    fromUser: selectedFromUser,
    toUser: selectedToUser,
    transferType: selectedTransferType,
    assets: includedAssets.map(a => a.kld_property_tag),
  };


    try {
      const res = await fetch("/api/Transfer-Form/submit_transfer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        const fromName = users.find((u) => u.user_ID === parseInt(selectedFromUser))?.full_name || "";
        const toName = users.find((u) => u.user_ID === parseInt(selectedToUser))?.full_name || "";

        const includedAssets = assets.filter((a) => selectedAssets.includes(a.asset_ID));

        const url = generateTransferPDFPreview(
          fromName,
          toName,
          includedAssets,
          transferTypes,
          selectedTransferType,
          data.ptr_no
        );

        // const a = document.createElement("a");
        // a.href = url;
        // a.download = `${data.ptr_no}.pdf`;
        // a.click();

        setShowPdfPreview(false);
        // websocket
        try {
          sendWS({ type: "refreshNotifications" });
          sendWS({ type: "refreshAsset" });
        } catch (e) {
          console.warn("WS notify failed", e);
        }
        setAssets([]);
        setSelectedAssets([]);
        setSelectedFromUser("");
        setSelectedToUser("");

        setResponseTitle("✅ Transfer Successful")
        setResponseMessage("Transfer Accountability successfully completed!");
        setShowResponse(true);
      } else {
        setResponseTitle("❌ Transfer Failed")
        setResponseMessage(data.message || "Transfer failed.");
        setShowResponse(true);
      }
    } catch (err) {
      console.error("Error submitting transfer:", err);
      setResponseTitle("❌ Transfer Failed")
      setResponseMessage("An error occurred while processing the transfer.");
      setShowResponse(true);
    }
  };

  const handleConfirmDownloadNo = () => setShowConfirmYesNo(false);

  // QR success -> filter and show popup
  const handleQRSuccess = (decodedText) => {
    setSearchTerm(decodedText);
    setCurrentPage(1);
    setShowQRScanner(false);

    setResponseTitle("✅ Transfer Successful")
    setResponseMessage(`QR Scanned: ${decodedText}`);
    setShowResponse(true);
  };

  const handlePDFPreview = async (assetID) => {
    setShowLoading(true);
    try {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);

      const result = await generateAssetPDF(assetID);
      if (result) {
        setPdfPreviewUrl(result.url);
        setSelectedPDFName(result.filename);
        setShowAssetPdfPreview(true);
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


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, assets]);

  return (
    <>
      <h3>Property Transfer</h3>
      <div className="form-panel container-fluid p-3 rounded shadow-sm">
        <div className="row g-3 align-items-end">
          {/* From User */}
          <div title="Select a user to view their items for transfer" className="col-auto" >
            <label htmlFor="fromUser" className="form-label fw-semibold d-none d-md-block">
              Select From Accountable:
            </label>
            <Select
              id="fromUser"
              options={users.map((user) => ({ value: user.user_ID, label: user.full_name.trim() }))}
              value={selectedFromUser ? { value: selectedFromUser, label: users.find((u) => u.user_ID === parseInt(selectedFromUser))?.full_name } : null}
              onChange={(option) => setSelectedFromUser(option ? option.value : "")}
              placeholder="Select User"
              isClearable
            />
          </div>

          {/* To User */}
          <div title="Select the user to assign responsibility for this asset" className="col-auto">
            <label htmlFor="toUser" className="form-label fw-semibold d-none d-md-block">
              Select To Accountable:
            </label>
            <Select
              id="toUser"
              options={users.map((user) => ({ value: user.user_ID, label: user.full_name.trim() }))}
              value={selectedToUser ? { value: selectedToUser, label: users.find((u) => u.user_ID === parseInt(selectedToUser))?.full_name } : null}
              onChange={(option) => setSelectedToUser(option ? option.value : "")}
              placeholder="Select User"
              isClearable
            />
          </div>

          {/* Transfer Type */}
          <div title="Specify the transfer type" className="col-auto">
            <label htmlFor="transferType" className="form-label fw-semibold d-none d-md-block">
              Select Transfer Type:
            </label>
            <Select
              id="transferType"
              options={transferTypes.map((type) => ({ value: type.transfer_type_ID, label: type.transfer_type_name }))}
              value={selectedTransferType ? { value: selectedTransferType, label: transferTypes.find((t) => t.transfer_type_ID === parseInt(selectedTransferType))?.transfer_type_name } : null}
              onChange={(option) => setSelectedTransferType(option ? option.value : "")}
              placeholder="Select Type"
              isClearable
            />
          </div>
          
          <div className="col-auto">
            <button title="Preview the PDF" onClick={handleTransfer} className="btn btn-form-green"
              disabled={!selectedFromUser || !selectedToUser || !selectedTransferType || selectedAssets.length === 0}
            >
              Transmit
            </button>
          </div>

          <div className="col d-flex justify-content-end align-items-center gap-2">
            <div className="position-relative">
              <input
                title="Search by description name or tag"
                type="text"
                className="form-control pe-5"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-1"
                  style={{ border: "none" }}
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="col-auto">
            <button title="Scan QR code to find asset" type="button" className="btn btn-form-yellow" onClick={() => setShowQRScanner(true)}>
              Scan QR
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-4 g-4">
        {/* Left: Available Assets */}
        <div className="col-md-6">
          <div className="p-3 rounded-4 shadow-sm bg-subtle border border-dark">
            <h5 className="mb-4">Available Assets</h5>

            {/* Global Select All */}
            <div className="row mb-3 g-3 align-items-end">
              <div className="col-md-3">
                <div className="form-check">
                  <input
                    title="Select all filtered assets"
                    type="checkbox"
                    className="form-check-input"
                    id="selectAllFiltered"
                    checked={filteredAssets.length > 0 && filteredAssets.every((a) => selectedAssets.includes(a.asset_ID))}
                    onChange={toggleSelectAllFiltered}
                  />
                  <label className="form-check-label" htmlFor="selectAllFiltered">Select All</label>
                </div>
              </div>
            </div>

            <div className="overflow-auto" style={{ maxHeight: '65vh', minHeight: '40vh' }}>
              {paginatedAssets.length > 0 ? (
              paginatedAssets.map((asset) => (
                <div
                  key={asset.asset_ID}
                  className={`p-3 mb-3 rounded-3 shadow-sm border ${selectedAssets.includes(asset.asset_ID) ? "bg-success-subtle" : "bg-white"}`}
                  style={{ 
                    cursor: "pointer", 
                    transition: "transform 0.2s, box-shadow 0.2s" 
                  }}
                  onClick={() => toggleSelect(asset.asset_ID)}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  title="Select Asset"
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset.asset_ID)}
                      onChange={(e) => { e.stopPropagation(); toggleSelect(asset.asset_ID); }}
                    />
                    <span className="fw-semibold text-secondary">Select Asset</span>
                  </div>

                  <div className="row">
                    <div className="col-6 small">Date Acquired</div>
                    <div className="col-6 fw-semibold">{asset.date_acquired}</div>

                    <hr className="my-2"/>

                    <div className="col-6 small">KLD Tag</div>
                    <div className="col-6 fw-semibold">{asset.kld_property_tag}</div>

                    <hr className="my-2"/>

                    <div className="col-6 small">Transfer Type</div>
                    <div className="col-6 fw-semibold">{asset.transfer_type_name}</div>

                    <hr className="my-2"/>

                    <div className="col-6 small">Condition</div>
                    <div className="col-6 fw-semibold">{asset.condition_name}</div>

                    <hr className="my-2"/>

                    <div className="col-6 small">Description</div>
                    <div className="col-6 fw-semibold">{asset.description}</div>

                    <hr className="my-2"/>

                    <div className="col-6 small">Property Card</div>
                    <div className="col-6">
                      <button 
                        className="btn btn-form-blue btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePDFPreview(asset.asset_ID);
                        }}
                        title="Check Asset's Property Card"
                      >
                        Check Property Card
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted">No assets found</div>
            )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />}
          </div>
        </div>

        {/* Right: Selected Assets */}
        <div className="col-md-6">
          <div className="p-3 rounded-4 shadow-sm border border-dark">
            <h5 className="mb-4">Selected Assets</h5>

            <div className="overflow-auto" style={{ maxHeight: '70vh', minHeight: '45vh' }}>
              {currentSelectedAssets.length > 0 ? (
                currentSelectedAssets.map((asset) => (
                  <div
                    key={asset.asset_ID}
                    className="p-3 mb-3 rounded-3 shadow-sm border bg-success-subtle"
                    style={{ 
                      cursor: "pointer", 
                      transition: "transform 0.2s, box-shadow 0.2s" 
                    }}
                    onClick={() => toggleSelect(asset.asset_ID)}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    title="Deselect Asset"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <input type="checkbox" checked={true} onChange={() => toggleSelect(asset.asset_ID)} />
                      <span className="fw-semibold text-secondary">Unselect Asset</span>
                    </div>

                    <div className="row">
                      <div className="col-6 small">Date Acquired</div>
                      <div className="col-6 fw-semibold">{asset.date_acquired}</div>

                      <hr className="my-2"/>

                      <div className="col-6 small">KLD Tag</div>
                      <div className="col-6 fw-semibold">{asset.kld_property_tag}</div>

                      <hr className="my-2"/>

                      <div className="col-6 small">Transfer Type</div>
                      <div className="col-6 fw-semibold">{asset.transfer_type_name}</div>

                      <hr className="my-2"/>

                      <div className="col-6 small">Condition</div>
                      <div className="col-6 fw-semibold">{asset.condition_name}</div>

                      <hr className="my-2"/>

                      <div className="col-6 small">Description</div>
                      <div className="col-6 fw-semibold">{asset.description}</div>

                      <hr className="my-2"/>

                      <div className="col-6 small">Property Card</div>
                      <div className="col-6">
                        <button 
                          className="btn btn-form-blue btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePDFPreview(asset.asset_ID);
                          }}
                          title="Check Asset's Property Card"
                        >
                          Check Property Card
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted">No selected assets</div>
              )}
            </div>

            {/* Pagination for selected assets */}
            {selectedTotalPages > 1 && <Pagination currentPage={selectedCurrentPage} totalPages={selectedTotalPages} onPageChange={(page) => setSelectedCurrentPage(page)} />}
          </div>
        </div>
      </div>

      
      <QRScannerModal isOpen={showQRScanner} onClose={() => setShowQRScanner(false)} onScanSuccess={handleQRSuccess} onScanError={(err) => console.error("QR Error:", err)} />

      {/* PDF Preview Modal */}
      <Modalbigger isOpen={showPdfPreview} onClose={() => setShowPdfPreview(false)} title="PDF Preview" footer={<button className="btn btn-form-green" onClick={handleConfirmDownloadClick}>Confirm Transaction</button>}>
        <div style={{ height: "80vh" }}>
          {pdfPreviewUrl && <iframe src={pdfPreviewUrl} title="PDF Preview" width="100%" height="100%" style={{ border: "none" }} />}
        </div>
      </Modalbigger>

      <Modalbigger isOpen={showAssetPdfPreview} onClose={() => setShowAssetPdfPreview(false)} title="Asset PDF Preview" footer={<button className="btn btn-form-green" onClick={() => { const link = document.createElement("a"); link.href = pdfPreviewUrl; link.download = selectedPDFName; link.click(); }}>Download PDF</button>}>
        <div style={{ height: "80vh" }}>
          {pdfPreviewUrl && <iframe src={pdfPreviewUrl} title="Asset PDF Preview" width="100%" height="100%" style={{ border: "none" }} />}
        </div>
      </Modalbigger>

      <Popups
        showConfirmYesNo={showConfirmYesNo}
        confirmYesNoTitle="⚠️ Confirm Download"
        confirmYesNoBody="Are you sure you want to confirm this transfer? This record will be located at Transfer Records."
        confirmYesLabel="Yes, Confirm"
        confirmNoLabel="Cancel"
        onConfirmYes={handleConfirmDownloadYes}
        onConfirmNo={handleConfirmDownloadNo}
        showConfirmDone={false}
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}

        showLoading={showLoading}
        loadingText="Generating Property Card PDF, please wait..."
      />
    </>
  );
};

export default TransferAccountability;
