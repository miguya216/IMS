import React, { useEffect, useState } from "react";
import Popups from "/src/components/Popups";
import QRScannerModal from "/src/components/QRScannerModal";
import Pagination from "/src/components/Pagination";
import Select from "react-select";

const RoomAssignation = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [assets, setAssets] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCurrentPage, setSelectedCurrentPage] = useState(1);
  const itemsPerPage = 5; // adjust per page count

  // popup states
  const [showConfirmYesNo, setShowConfirmYesNo] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const roomName = rooms.find(r => r.room_ID === selectedRoom)?.room_number || "N/A";

  // scanner state
  const [showScanner, setShowScanner] = useState(false);

  // Filtered assets
  const filteredAssets = assets.filter(
    (asset) =>
      asset.kld_property_tag?.toLowerCase().includes(searchTag.toLowerCase()) ||
      asset.brand?.toLowerCase().includes(searchTag.toLowerCase()) ||
      asset.asset_type?.toLowerCase().includes(searchTag.toLowerCase())
  );

  // Apply pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);

  // Selected assets pagination logic
  const selectedAssetsList = assets.filter((a) =>
    selectedAssets.includes(a.asset_ID)
  );

  const selectedTotalPages = Math.ceil(selectedAssetsList.length / itemsPerPage);
  const selectedIndexOfLastItem = selectedCurrentPage * itemsPerPage;
  const selectedIndexOfFirstItem = selectedIndexOfLastItem - itemsPerPage;
  const currentSelectedAssets = selectedAssetsList.slice(
    selectedIndexOfFirstItem,
    selectedIndexOfLastItem
  );


  // reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTag, assets]);

  // Fetch assets assigned to logged-in user
  const fetchAssetsByUser = () => {
    fetch(`/api/Room-Handlers/fetch_user_assets.php`)
      .then((res) => res.json())
      .then((data) => setAssets(data.error ? [] : data))
      .catch(() => setAssets([]));
  };

  //  Toggle row selection
  const toggleSelect = (assetId) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  };

  //  Show confirm popup before moving
  const handleMoveClick = () => {
    setShowConfirmYesNo(true);
  };

  //  Confirmed: Send selected items to backend
  const moveSelectedAssets = () => {
    setShowConfirmYesNo(false);
    setShowLoading(true);

    fetch("/api/Room-Handlers/update_asset_room.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asset_IDs: selectedAssets, room_ID: selectedRoom }),
    })
      .then((res) => res.json())
      .then((data) => {
        setShowLoading(false);

        if (data.success) {
          fetchAssetsByUser();
          setSelectedAssets([]);
          setResponseTitle("✅ Moved Success");
          setResponseMessage(data.message || "Assets moved successfully.");
        } else {
          setResponseTitle("❌ Action Failed");
          setResponseMessage(data.message || "Failed to move assets.");
        }
        setShowResponse(true);
      })
      .catch(() => {
        setShowLoading(false);
        setResponseTitle("❌ Error");
        setResponseMessage("Something went wrong. Please try again.");
        setShowResponse(true);
      });
  };

  // Fetch rooms on load
  useEffect(() => {
    fetch("/api/dropdown_fetch.php")
      .then((res) => res.json())
      .then((data) => data.rooms && setRooms(data.rooms))
      .catch(console.error);
  }, []);

    //  Handle QR Scan success
    const handleQrSuccess = (decodedText) => {
    setShowScanner(false);

    if (!selectedRoom) {
      setResponseTitle("❌ Error");
      setResponseMessage("Please select a room before scanning.");
      setShowResponse(true);
      return;
    }

    // Drop scanned QR directly into search bar
    setSearchTag(decodedText);

    // Optional: show a small popup for user feedback
    setResponseTitle("✅ QR Scanned");
    setResponseMessage(`Scanned value: ${decodedText}`);
    setShowResponse(true);
  };


  const handleQrError = (err) => {
    console.warn("QR Scan error:", err);
  };

  useEffect(() => {
    fetchAssetsByUser();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTag, assets]);


  return (
    <>
      <h3>Room Assignation</h3>
      <div className="container-fluid mt-4">
        <div className="form-panel row g-3 align-items-end rounded shadow-sm p-2">
          {/* Select Room */}
            <div title="Select destination room for assets" className="col-auto">
              <label className="form-label fw-semibold d-none d-md-block">
                Select Room:
              </label>
              <Select
                options={rooms.map((room) => ({
                  value: room.room_ID,
                  label: room.room_number,
                }))}
                value={
                  selectedRoom
                    ? {
                        value: selectedRoom,
                        label: rooms.find((r) => r.room_ID === selectedRoom)?.room_number,
                      }
                    : null
                }
                onChange={(option) => setSelectedRoom(option?.value || "")}
                placeholder="-- Select Room --"
                isClearable
                isSearchable
              />
            </div>

            {/* Move button */}
            <div className="col-auto">
              <button
                className="btn btn-form-green"
                onClick={handleMoveClick}
                disabled={!selectedRoom || selectedAssets.length === 0}
              >
                Transmit
              </button>
            </div>


          {/* Search */}
        <div className="col-md-3 ms-auto"> 
          <label className="form-label fw-semibold d-none d-md-block">
            Search Asset:
          </label>
          <div className="position-relative">
            <input
              title="Search manually or use QR scanning"
              type="text"
              className="form-control pe-5"
              placeholder="Enter KLD-Tag, Brand or Asset Type"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
            />
            {searchTag && (
              <button
                type="button"
                className="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-1"
                style={{ border: "none" }}
                onClick={() => setSearchTag("")}
              >
                ×
              </button>
            )}
          </div>
        </div>

          {/* Scan QR button */}
          <div className="col-auto">
            <button
              title="Scan QR to filter the asset"
              className="btn btn-form-yellow"
              onClick={() => setShowScanner(true)}
              disabled={!selectedRoom}
            >
              Scan QR
            </button>
          </div>

        </div>
      </div>

      {/* Two-column asset display */}
        <div className="row mt-4">
          {/* Left: available assets */}
          <div className="col-md-6 border border-dark p-3">
            <h5 className="mb-3">Available Assets</h5>
            
            <div className="row mb-2 g-3 align-items-end">
              {/* Select All Checkbox */}
                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      title="Select All displayed asset"
                      type="checkbox"
                      className="form-check-input"
                      id="selectAllCheckbox"
                      checked={
                        filteredAssets.length > 0 &&
                        selectedAssets.length === filteredAssets.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAssets(filteredAssets.map((a) => a.asset_ID));
                        } else {
                          setSelectedAssets([]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="selectAllCheckbox">
                      Select All
                    </label>
                  </div>
                </div>
            </div>
            
            {currentAssets.length > 0 ? (
              currentAssets.map((asset) => (
                <div
                  key={asset.asset_ID}
                  className={`p-3 mb-3 rounded shadow-sm border ${
                    selectedAssets.includes(asset.asset_ID) ? "bg-success-subtle" : "bg-white"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSelect(asset.asset_ID)}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset.asset_ID)}
                      onChange={() => toggleSelect(asset.asset_ID)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="fw-semibold text-secondary">Select Asset</span>
                  </div>

                  <div className="row">
                    <div className="col-6 small">KLD-Property Tag</div>
                    <div className="col-6 fw-semibold">{asset.kld_property_tag}</div>

                    <hr className="my-2"/>

                    <div className="col-6 small">Room</div>
                    <div className="col-6 fw-semibold">{asset.room}</div>

                    <hr className="my-2"/>

                    <div className="col-6 small">Brand</div>
                    <div className="col-6 fw-semibold">{asset.brand}</div>

                    <hr className="my-2"/>

                    <div className="col-6 small">Asset Type</div>
                    <div className="col-6 fw-semibold">{asset.asset_type}</div>

                    <hr className="my-2"/>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted">No assets found</div>
            )}

            {/* Pagination for available assets */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>

          {/* Right: selected assets */}
          <div className="col-md-6 border border-dark p-3">
            <h5 className="mb-5">Selected Assets</h5>
            {currentSelectedAssets.length > 0 ? (
              currentSelectedAssets.map((asset) => (
                  <div
                    key={asset.asset_ID}
                    className="p-3 mb-3 rounded shadow-sm border bg-success-subtle"
                    style={{ cursor: "pointer" }}
                  onClick={() => toggleSelect(asset.asset_ID)}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => toggleSelect(asset.asset_ID)}
                      />
                      <span className="fw-semibold text-secondary">Unselect Asset</span>
                    </div>

                    <div className="row">
                      <div className="col-6 small">KLD-Property Tag</div>
                      <div className="col-6 fw-semibold">{asset.kld_property_tag}</div>

                      <hr className="my-2"/>

                      <div className="col-6 small">Room</div>
                      <div className="col-6 fw-semibold">{asset.room}</div>

                      <hr className="my-2"/>

                      <div className="col-6 small">Brand</div>
                      <div className="col-6 fw-semibold">{asset.brand}</div>

                      <hr className="my-2"/>

                      <div className="col-6 small">Asset Type</div>
                      <div className="col-6 fw-semibold">{asset.asset_type}</div>

                      <hr className="my-2"/>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center text-muted">No selected assets</div>
            )}
            {/* Pagination for selected assets */}
        {selectedTotalPages > 1 && (
          <Pagination
            currentPage={selectedCurrentPage}
            totalPages={selectedTotalPages}
            onPageChange={(page) => setSelectedCurrentPage(page)}
          />
        )}
      </div>
    </div>

      
      {/* Scanner Modal */}
      <QRScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleQrSuccess}
        onScanError={handleQrError}
      />

      {/* Popups */}
      <Popups
        showConfirmYesNo={showConfirmYesNo}
        confirmYesNoTitle="⚠️ Confirm Transfer"
        confirmYesNoBody={`Are you sure you want to transfer ${selectedAssets.length} selected item(s) to room ${roomName}? This record will be located at Room Assignation Records.`}
        confirmYesLabel="Yes, Move"
        confirmNoLabel="Cancel"
        onConfirmYes={moveSelectedAssets}
        onConfirmNo={() => setShowConfirmYesNo(false)}
        showLoading={showLoading}
        loadingText="Transferring assets, please wait..."
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </>
  );
};

export default RoomAssignation;