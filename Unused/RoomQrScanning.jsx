import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Popups from "/src/components/Popups.jsx";

const RoomQrScanning = () => {
  const [roomInfo, setRoomInfo] = useState(null);
  const [assetsByType, setAssetsByType] = useState({});
  const [scannedAssets, setScannedAssets] = useState({});
  const [scanning, setScanning] = useState(false);
  const [scannerMode, setScannerMode] = useState(""); // "room" or "asset"
  const html5Qr = useRef(null);
  const scannedRef = useRef({});


  // ✅ Popups state
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const showPopup = (title, message) => {
    setResponseTitle(title);
    setResponseMessage(message);
    setShowResponse(true);
  };

  const startScanner = async (mode) => {
    setScanning(true);
    setScannerMode(mode);
    const qr = new Html5Qrcode("qr-reader");
    html5Qr.current = qr;

    try {
      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          await qr.stop();
          document.getElementById("qr-reader").innerHTML = "";
          setScanning(false);

          if (mode === "room") {
            handleRoomScan(decodedText);
          } else {
            handleAssetScan(decodedText);
          }
        }
      );
    } catch (err) {
      showPopup("⚠️ Scanner failed to start", err.message);
      setScanning(false);
    }
  };

  const restartAssetScanner = () => {
    setTimeout(() => {
      document.getElementById("qr-reader").innerHTML = "";
      html5Qr.current?.clear();
      startScanner("asset");
    }, 2000);
  };

  const handleRoomScan = async (qrValue) => {
    try {
      const res = await fetch(`/api/User-Handlers/scan_room.php?qr_value=${qrValue}`);
      const data = await res.json();

      if (!data.success) {
        showPopup("❌ Room Scan Failed", data.message);
        return;
      }

      const grouped = {};
      data.assets.forEach((asset) => {
        const typeID = asset.asset_type_ID;
        if (!grouped[typeID]) {
          grouped[typeID] = {
            asset_type: asset.asset_type,
            total: 0,
            scanned: 0,
            asset_IDs: [],
          };
        }
        grouped[typeID].total += 1;
        grouped[typeID].asset_IDs.push(asset.asset_ID);
      });

      setRoomInfo({ room_ID: data.room_ID, room_number: data.room_number });
      setAssetsByType(grouped);
      setScannedAssets({});
      showPopup("✅ Room scanned successfully!", `Room ${data.room_number} loaded.`);
    } catch (err) {
      showPopup("❌ Error", "Failed to fetch room: " + err.message);
    }
  };

const handleAssetScan = async (qrValue) => {
  if (!roomInfo) {
    showPopup("❌ No Room Selected", "Please scan a room first.");
    return;
  }

  try {
    const res = await fetch(
      `/api/User-Handlers/validate_asset.php?qr_value=${qrValue}&room_ID=${roomInfo.room_ID}`
    );
    const data = await res.json();

    if (!data.success) {
      showPopup("❌ Invalid Asset", data.message);
      return;
    }

    const { asset_ID, asset_type_ID } = data;

    if (!assetsByType[asset_type_ID]) {
      showPopup("❌ Type Mismatch", `Scanned asset type ID: ${asset_type_ID}`);
      return;
    }

   if (scannedRef.current[asset_ID]) {
  showPopup("⚠️ Already Scanned", "This asset has already been scanned.");
  return;
}

// Mark asset as scanned in ref
scannedRef.current[asset_ID] = true;

// Also update the state for display (if needed)
setScannedAssets((prev) => ({ ...prev, [asset_ID]: true }));

// Update scanned count
setAssetsByType((prev) => ({
  ...prev,
  [asset_type_ID]: {
    ...prev[asset_type_ID],
    scanned: Math.min(prev[asset_type_ID].scanned + 1, prev[asset_type_ID].total),
  },
}));


    showPopup("✅ Asset Recorded", "Asset matched and recorded.");
  } catch (err) {
    showPopup("❌ Network Error", "Failed to validate asset: " + err.message);
  } finally {
    restartAssetScanner();
  }
};

const resetSession = () => {
  window.location.reload();
};

useEffect(() => {
  return () => {
    if (html5Qr.current) {
      html5Qr.current
        .stop()
        .then(() => {
          html5Qr.current.clear();
          document.getElementById("qr-reader").innerHTML = "";
        })
        .catch((err) => {
          console.warn("Failed to stop scanner on unmount:", err);
        });
    }
  };
}, []);


 return (
  <>
    <div className="room-scanning-top">
      {/* Start Room Scanning Button (centered) */}
      {!scanning && !roomInfo && (
        <button className="start-scan-btn btn btn-success" onClick={() => startScanner("room")}>
          📷 Start Room Scanning
        </button>
      )}

      {/* Start Asset Scanning Button (centered) */}
      {!scanning && roomInfo && (
        <button className="start-scan-btn btn btn-primary" onClick={() => startScanner("asset")}>
          📦 Start Asset Scanning
        </button>
      )}

      {/* QR Scanner (shown after scanning starts) */}
      <div id="qr-reader" className="qr-scanner"></div>
    </div>

    <div className="room-scanning-bottom text-white position-relative">
      {/* Reset Session Button (top-right) */}
      {(scanning || roomInfo) && (
        <button className="btn btn-danger reset-btn" onClick={resetSession}>
          🔄 Reset Session
        </button>
      )}


      {/* Results display */}
      {roomInfo && (
        <div className="w-100 px-2">
          <h5 className="text-white">Room: {roomInfo.room_number}</h5>
          {Object.values(assetsByType).map((type, index) => (
            <div key={index} className="asset-count-row">
              <strong>{type.asset_type}</strong>
              <span>
                {type.scanned}/{type.total}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>

    <Popups
      showResponse={showResponse}
      responseTitle={responseTitle}
      responseMessage={responseMessage}
      onCloseResponse={() => setShowResponse(false)}
    />
  </>
);

};

export default RoomQrScanning;
