import React, { useState, useEffect } from "react";
import Select from "react-select";
import QRScannerModal from "/src/components/QRScannerModal";
import Popups from "/src/components/Popups";

const RoomQrScanning = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [assets, setAssets] = useState([]); // store fetched assets
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch all rooms for dropdown
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/Asset-Hunt-Handlers/fetch_all_room.php");
        const data = await res.json();

        if (data.success && data.data) {
          const roomOptions = data.data.map((room) => ({
            value: room.room_ID,
            label: `🚪 Room ${room.room_number}`,
          }));
          setRooms(roomOptions);
        } else {
          setRooms([]);
        }
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    fetchRooms();
  }, []);

  // Fetch assets for a given room
  const fetchAssetsByRoom = async (roomID) => {
    try {
      const res = await fetch(
        `/api/Asset-Hunt-Handlers/fetch_asset_by_room_id.php?room=${roomID}`
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        setAssets(data);
      } else {
        setAssets([]);
      }
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      setAssets([]);
    }
  };

const handleScanSuccess = async (decodedText) => {
  console.log("Scanned QR:", decodedText);

  try {
    // Try as room QR
    const res = await fetch(
      `/api/Asset-Hunt-Handlers/fetch_room_by_qr.php?qr_value=${encodeURIComponent(decodedText)}`
    );
    const data = await res.json();

    if (data.success && data.room) {
      // Room QR
      const matchedRoom = {
        value: data.room.room_ID,
        label: `🚪 Room ${data.room.room_number}`,
      };

      setSelectedRoom(matchedRoom);

      if (!rooms.find((r) => r.value === matchedRoom.value)) {
        setRooms((prev) => [...prev, matchedRoom]);
      }

      fetchAssetsByRoom(data.room.room_ID);

      setResponseMessage(`Successfully scanned ${matchedRoom.label}`);
      setShowResponse(true);

      //  Always close scanner
      setIsScannerOpen(false);
    } else {
      // Not a room → treat as asset
      const kldTag = decodedText;
      await checkAssetRoom(kldTag);

      //  Always close scanner
      setIsScannerOpen(false);
    }
  } catch (err) {
    console.error("Error in handleScanSuccess:", err);
    setResponseMessage("Failed to process scanned QR.");
    setShowResponse(true);
    setIsScannerOpen(false);
  }
};



  // Handle manual room select
  const handleRoomSelect = (option) => {
    setSelectedRoom(option);

    // Fetch assets for the selected room
    fetchAssetsByRoom(option.value);
  };

 // function to check if asset belongs to room
const checkAssetRoom = async (kldTag) => {
  if (!selectedRoom) {
    setResponseMessage("Please select or scan a room first.");
    setShowResponse(true);
    return;
  }

  try {
    const res = await fetch("/api/Asset-Hunt-Handlers/check_asset_room.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_ID: selectedRoom.value,
        kld_property_tag: kldTag,
      }),
    });

    const data = await res.json();

    if (data.success && data.belongs) {
      let scannedAsset = null;

      // Mark card as checked
      setAssets((prevAssets) => {
        const updated = prevAssets.map((a) => {
          if (a.kld_property_tag === kldTag) {
            scannedAsset = a; // capture the scanned asset
            return { ...a, checked: true };
          }
          return a;
        });

        // Move checked ones to the TOP
        updated.sort((a, b) =>
          a.checked === b.checked ? 0 : a.checked ? -1 : 1
        );

        return updated;
      });

      // Show popup with asset details
      if (scannedAsset) {
        setResponseMessage(
          `✅ Asset Found with Tag: ${scannedAsset.kld_property_tag}`
        );
        setShowResponse(true);
      }
    } else {
      // Show popup if wrong room
      setResponseMessage(data.message || "This asset does not belong here.");
      setShowResponse(true);
    }
  } catch (err) {
    console.error("Error checking asset-room match:", err);
    setResponseMessage("Server error while checking asset-room match.");
    setShowResponse(true);
  }
};


  return (
    <>
      <div className="borrower-home">
        <div className="container-fluid p-4">
          {/* Prompt */}
          <div className="row mb-2 text-center">
            <div className="col">
              <h2 className="fw-bold mb-2">🔎 Asset Hunt</h2>
              <p className="fs-5 text-dark">
                Start your hunt! Scan or select a room to load its assets, then
                check each one to ensure nothing is missing.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="row g-2 align-items-center justify-content-center text-center text-md-start">
            {/* Button */}
            <div className="col-12 col-md-auto">
              {/* Button */}
                <div className="col-12 col-md-auto">
                  {assets.length > 0 ? (
                    <button
                      className="btn btn-form-yellow btn-lg shadow-sm w-100 w-md-auto"
                      onClick={() => setIsScannerOpen(true)}
                    >
                      📷 Scan Asset QR Code
                    </button>
                  ) : (
                    <button
                      className="btn btn-form-green btn-lg shadow-sm w-100 w-md-auto"
                      onClick={() => setIsScannerOpen(true)}
                    >
                      📷 Scan Room QR Code
                    </button>
                  )}
                </div>
            </div>

            {/* "or" text */}
            <div className="col-12 col-md-auto d-flex align-items-center justify-content-center">
              <h5 className="fw-bold text-muted mb-0">OR</h5>
            </div>

            {/* Dropdown */}
            <div className="col-12 col-md-3">
              <Select
                options={rooms}
                value={selectedRoom}
                onChange={handleRoomSelect}
                placeholder="🚪 Choose a Room"
                className="shadow-sm"
              />
            </div>
          </div>

         {/* Asset List */}
          <div className="row mt-4">
            <div className="col">
              <h4 className="fw-semibold mb-3">
                Assets in {selectedRoom ? selectedRoom.label : "Room"}
              </h4>

              {assets.length > 0 ? (
                <div className="row g-3">
                  {assets.map((asset, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-4">
                      <div
                        className={`card shadow-sm h-100 border-0 ${
                          asset.checked ? "bg-success text-white" : ""
                        }`}
                      >
                        <div className="card-body">
                          <h5 className="card-title fw-bold">
                            {asset.asset_type}{" "}
                            {asset.checked && <span className="badge bg-light text-success">Already Checked</span>}
                          </h5>
                          <h6 className="card-subtitle mb-2">
                            {asset.brand_name}
                          </h6>
                          <p><strong>🏷 Tag:</strong> {asset.kld_property_tag}</p>
                          <p><strong>📦 Condition:</strong> {asset.asset_condition}</p>
                          <p><strong>💰 Cost:</strong> ₱{asset.unit_cost}</p>
                          <p><strong>📅 Acquired:</strong> {asset.date_acquired}</p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mt-3">
                  {selectedRoom
                    ? "No assets found in this room."
                    : "Select or scan a room to view assets."}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      <Popups
        showResponse={showResponse}
        responseTitle="Scan Successful"
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </>
  );
};

export default RoomQrScanning;
