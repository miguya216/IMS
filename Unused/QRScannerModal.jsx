import React from "react";
import QrScanner from "/src/components/QR-Scanner";

const QRScannerModal = ({ isOpen, onClose, onScanSuccess, onScanError }) => {
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
      <div style={{ background: "#fdff71", padding: "20px", borderRadius: "12px", marginTop: "-150px"}}>
        <h5>Scan Asset QR</h5>
        <QrScanner onScanSuccess={onScanSuccess} onScanError={onScanError} />
        <button className="btn btn-form-red mt-3" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QRScannerModal;
