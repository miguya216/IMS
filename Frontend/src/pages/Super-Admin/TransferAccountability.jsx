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
  const [responseMessage, setResponseMessage] = useState("");
  const [selectedPDFName, setSelectedPDFName] = useState("");
  


  const itemsPerPage = 5;

  // filter based on search
  const filteredAssets = assets.filter((asset) =>
    Object.values(asset)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

  // PDF Preview Modal
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
        setAssets(data);
        setSelectedAssets([]);
      })
      .catch((err) => console.error("Error fetching assets:", err));
  }, [selectedFromUser]);

  // Toggle individual row
  const handleToggleAsset = (tag) => {
    setSelectedAssets((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Toggle all rows
  const handleToggleAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map((a) => a.kld_property_tag));
    }
  };

  // Commit → Preview
  const handleTransfer = () => {
    if (selectedFromUser === selectedToUser) {
      alert("From and To users cannot be the same.");
      return;
    }
    if (selectedAssets.length === 0) {
      alert("No assets selected for transfer.");
      return;
    }

    const fromName =
      users.find((u) => u.user_ID === parseInt(selectedFromUser))?.full_name ||
      "";
    const toName =
      users.find((u) => u.user_ID === parseInt(selectedToUser))?.full_name || "";

    const includedAssets = assets.filter((a) =>
      selectedAssets.includes(a.kld_property_tag)
    );

    const url = generateTransferPDFPreview(
      fromName,
      toName,
      includedAssets,
      transferTypes,
      selectedTransferType
    );

    setPdfPreviewUrl(url);
    setShowPdfPreview(true);
  };

  //  Ask confirmation before download
  const handleConfirmDownloadClick = () => {
    setShowConfirmYesNo(true);
  };

  //  Confirm Yes → Save DB + Download PDF
  const handleConfirmDownloadYes = async () => {
    setShowConfirmYesNo(false);

    const payload = {
      fromUser: selectedFromUser,
      toUser: selectedToUser,
      transferType: selectedTransferType,
      assets: selectedAssets,
    };

    try {
      const res = await fetch("/api/Transfer-Form/submit_transfer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        const fromName =
          users.find((u) => u.user_ID === parseInt(selectedFromUser))
            ?.full_name || "";
        const toName =
          users.find((u) => u.user_ID === parseInt(selectedToUser))?.full_name ||
          "";

        const includedAssets = assets.filter((a) =>
          selectedAssets.includes(a.kld_property_tag)
        );

        const url = generateTransferPDFPreview(
          fromName,
          toName,
          includedAssets,
          transferTypes,
          selectedTransferType,
          data.ptr_no
        );

        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.ptr_no}.pdf`;
        a.click();

        setShowPdfPreview(false);
        // websocket
        try {
          sendWS({ type: "refreshNotifications" });
        } catch (e) {
          console.warn("WS notify failed", e);
        }
        setAssets([]);
        setSelectedAssets([]);
        setSelectedFromUser("");
        setSelectedToUser("");

        //  Transaction complete → Response Popup
        setResponseMessage("Transaction successfully completed!");
        setShowResponse(true);
      } else {
        setResponseMessage(data.message || "Transfer failed.");
        setShowResponse(true);
      }
    } catch (err) {
      console.error("Error submitting transfer:", err);
      setResponseMessage("An error occurred while processing the transfer.");
      setShowResponse(true);
    }
  };

  const handleConfirmDownloadNo = () => {
    setShowConfirmYesNo(false);
  };

  //  QR Scan Success → show response popup
  const handleQRSuccess = (decodedText) => {
    setSearchTerm(decodedText);
    setCurrentPage(1);
    setShowQRScanner(false);

    setResponseMessage(`QR Scanned: ${decodedText}`);
    setShowResponse(true);
  };

  const handlePDFPreview = async (assetID) => {
    try {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);

      const result = await generateAssetPDF(assetID);
      if (result) {
        setPdfPreviewUrl(result.url);
        setSelectedPDFName(result.filename);
        setShowAssetPdfPreview(true);
      } else {
        console.error("Failed to generate Asset PDF");
      }
    } catch (err) {
      console.error("PDF preview error:", err);
    }
  };


  return (
    <>
      {/* Controls */}
      <h3>Property Transfer</h3>
      <div className="form-panel container-fluid p-3 rounded shadow-sm">
        <div className="row g-3 align-items-end">
          {/* From User */}
          <div title="Select a user to view their items for transfer" className="col-md-2" >
            <label htmlFor="fromUser" className="form-label fw-semibold d-none d-md-block">
              Select From Accountable:
            </label>
            <Select
              id="fromUser"
              options={users.map((user) => ({
                value: user.user_ID,
                label: user.full_name.trim(),
              }))}
              value={
                selectedFromUser
                  ? {
                      value: selectedFromUser,
                      label: users.find((u) => u.user_ID === parseInt(selectedFromUser))
                        ?.full_name,
                    }
                  : null
              }
              onChange={(option) => setSelectedFromUser(option ? option.value : "")}
              placeholder="Select User"
              isClearable
            />
          </div>

          {/* To User */}
          <div title="Select the user to assign responsibility for this asset" className="col-md-2">
            <label htmlFor="toUser" className="form-label fw-semibold d-none d-md-block">
              Select To Accountable:
            </label>
            <Select
              id="toUser"
              options={users.map((user) => ({
                value: user.user_ID,
                label: user.full_name.trim(),
              }))}
              value={
                selectedToUser
                  ? {
                      value: selectedToUser,
                      label: users.find((u) => u.user_ID === parseInt(selectedToUser))
                        ?.full_name,
                    }
                  : null
              }
              onChange={(option) => setSelectedToUser(option ? option.value : "")}
              placeholder="Select User"
              isClearable
            />
          </div>

          {/* Transfer Type */}
          <div title="Specify the transfer type" className="col-md-2">
            <label htmlFor="transferType" className="form-label fw-semibold d-none d-md-block">
              Select Transfer Type:
            </label>
            <Select
              id="transferType"
              options={transferTypes.map((type) => ({
                value: type.transfer_type_ID,
                label: type.transfer_type_name,
              }))}
              value={
                selectedTransferType
                  ? {
                      value: selectedTransferType,
                      label: transferTypes.find(
                        (t) => t.transfer_type_ID === parseInt(selectedTransferType)
                      )?.transfer_type_name,
                    }
                  : null
              }
              onChange={(option) =>
                setSelectedTransferType(option ? option.value : "")
              }
              placeholder="Select Type"
              isClearable
            />
          </div>

          <div className="col-md-2">
            <div className="position-relative">
              <input
                title="Search by description name or tag"
                type="text"
                className="form-control pe-5" // extra padding for the button
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
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
              <button
                title="Scan QR code to find asset"
                type="button"
                className="btn btn-form-yellow"
                onClick={() => setShowQRScanner(true)}
              >
                Scan QR
              </button>
          </div>
      
          <div className="col-auto">
            <button
              title="Preview the PDF"
              onClick={handleTransfer}
              className="btn btn-form-green"
              disabled={
                !selectedFromUser ||
                !selectedToUser ||
                !selectedTransferType ||
                selectedAssets.length === 0
              }
            >
              Commit
            </button>
          </div>
          <QRScannerModal
              isOpen={showQRScanner}
              onClose={() => setShowQRScanner(false)}
              onScanSuccess={handleQRSuccess}
              onScanError={(err) => console.error("QR Error:", err)}
            />

           {/* Select All Checkbox */}
          <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <div className="form-check">
                  <input
                    title="Select all displayed assets"
                    type="checkbox"
                    className="form-check-input"
                    id="selectAll"
                    checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                    onChange={handleToggleAll}
                  />
                  <label className="form-check-label" htmlFor="selectAll">
                    Select All
                  </label>
                </div>
              </div>
          </div>

          {/* PDF Preview Modal */}
          <Modalbigger
            isOpen={showPdfPreview}
            onClose={() => setShowPdfPreview(false)}
            title="PDF Preview"
            footer={
              <button className="btn btn-form-green" onClick={handleConfirmDownloadClick}>
                Download PDF & Confirm
              </button>
            }
          >
            <div style={{ height: "80vh" }}>
              {pdfPreviewUrl && (
                <iframe
                  src={pdfPreviewUrl}
                  title="PDF Preview"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                ></iframe>
              )}
            </div>
          </Modalbigger>
          <Modalbigger
              isOpen={showAssetPdfPreview}
              onClose={() => setShowAssetPdfPreview(false)}
              title="Asset PDF Preview"
              footer={
                <>
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
                </>
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


        </div>
      </div>

      {/* Assets Table */}
      <div className="custom-table-wrapper mt-4">
        <table className="custom-table">
          <thead>
            <tr>
              <th></th>
              <th>Date Acquired</th>
              <th>KLD Property Tag</th>
              <th>Item Description</th>
              <th>Transfer Type</th>
              <th>Condition</th>
              <th>More</th>
            </tr>
          </thead>

          <tbody>
            {paginatedAssets.length > 0 ? (
              paginatedAssets.map((asset) => {
                const isSelected = selectedAssets.includes(asset.kld_property_tag);
                return (
                  <tr
                    key={asset.kld_property_tag}
                    onClick={() => handleToggleAsset(asset.kld_property_tag)}
                    style={{ cursor: "pointer", background: isSelected ? "#7dff86" : "transparent" }}
                  >
                    <td data-label="Select" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleAsset(asset.kld_property_tag)}
                      />
                    </td>
                    <td data-label="Date Acquired">{asset.date_acquired}</td>
                    <td data-label="KLD Tag">{asset.kld_property_tag}</td>
                    <td data-label="Description">{asset.description}</td>
                    <td data-label="Tranfer Type">{asset.transfer_type_name}</td>
                    <td data-label="Condition">{asset.condition_name}</td>
                    <td data-label="More">
                      <button
                        title="Property Card"
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePDFPreview(asset.asset_ID);
                        }}
                      >
                        <img src="/resources/imgs/pdf-icon.png" alt="PDF" className="action-icon" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No assets found for this user.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
      {/*  Popups */}
      <Popups
        showConfirmYesNo={showConfirmYesNo}
        confirmYesNoTitle="Confirm Download"
        confirmYesNoBody="Are you sure you want to confirm this transfer and download the PDF?"
        confirmYesLabel="Yes, Confirm"
        confirmNoLabel="Cancel"
        onConfirmYes={handleConfirmDownloadYes}
        onConfirmNo={handleConfirmDownloadNo}
        showConfirmDone={false}
        showLoading={false}
        showResponse={showResponse}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </>
  );
};

export default TransferAccountability;
