import React, { useState, useEffect } from "react";
import QrScanner from "/src/components/QR-Scanner";

const QRScannerModal = ({ isOpen, onClose, onScanSuccess, onScanError }) => {
  const [isCameraReady, setIsCameraReady] = useState(false);

  // 🔹 Reset state every time modal opens
  useEffect(() => {
    if (isOpen) {
      setIsCameraReady(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    // Always try to stop/clear scanner safely
    const el = document.getElementById("qr-scanner-region");
    if (el) el.innerHTML = ""; // force clear container
    setIsCameraReady(false); // reset state
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
    >
      <div
        style={{
          background: "#fdff71",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "-150px",
        }}
      >
        <h5>Scan QR</h5>
        <QrScanner
          onScanSuccess={onScanSuccess}
          onScanError={onScanError}
          onCameraReady={() => setIsCameraReady(true)} // ✅ only show cancel when ready
        />
        {isCameraReady && (
          <button className="btn btn-form-red mt-3" onClick={handleClose}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScannerModal;
