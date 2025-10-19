import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Popups from "/src/components/Popups.jsx";
import { useNavigate, useParams } from "react-router-dom";


const BorrowReceipt = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const html5Qr = useRef(null);
  const scannedRef = useRef({});
  const [loading, setLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const [requestedItems, setRequestedItems] = useState([]);
  const [scannedAssets, setScannedAssets] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [redirectAfterPopup, setRedirectAfterPopup] = useState(false);


  // Popups
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const showPopup = (message) => {
    setResponseMessage(message);
    setShowResponse(true);
  };

  const fetchRequestedItems = () => {
    fetch("/api/Borrowing-Process/get_requested_items.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRequestedItems(data);
        else if (Array.isArray(data.items)) setRequestedItems(data.items);
        else setRequestedItems([]);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setRequestedItems([]);
      });
  };

 useEffect(() => {
  fetch("/api/Borrowing-Process/validate_session.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token }),
  })
    .then((res) => res.json())
    .then((data) => {
      setLoading(false);
      if (data.valid) {
        setSessionValid(true);
        fetchRequestedItems();
      } else {
        showPopup("Session expired or link is invalid. Redirecting...");
        setRedirectAfterPopup(true);
      }
    })
    .catch(() => {
      setLoading(false);
      showPopup("Something went wrong validating the session. Redirecting...");
      setRedirectAfterPopup(true);
    });
}, [token]);


  const startScanner = async () => {
    if (scanning || !sessionValid) return;

    setScanning(true);
    const qr = new Html5Qrcode("qr-reader");
    html5Qr.current = qr;

    try {
      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (scannedText) => {
          await qr.stop();
          document.getElementById("qr-reader").innerHTML = "";
          setScanning(false);
          handleAssetScan(scannedText);
        }
      );
    } catch (err) {
      showPopup("Scanner error: " + err.message);
      setScanning(false);
    }
  };

  const restartScanner = () => {
    setTimeout(() => {
      document.getElementById("qr-reader").innerHTML = "";
      html5Qr.current?.clear();
      startScanner();
    }, 2000);
  };

 // 🧠 Add this outside the component (or inside using useRef)
const scannedCountMap = useRef({}); // Keeps track of counts per asset_type_ID

const handleAssetScan = async (qrValue) => {
  if (!requestedItems || requestedItems.length === 0) {
    showPopup("⚠️ Request data still loading. Please wait...");
    restartScanner();
    return;
  }

  if (scannedRef.current[qrValue]) {
    showPopup("⚠️ This asset has already been scanned.");
    restartScanner();
    return;
  }

  try {
    const res = await fetch("/api/Borrowing-Process/validate_asset_scan.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ kld_property_tag: qrValue, token }),
    });

    const result = await res.json();

    if (!result.success) {
      showPopup(result.message || "Invalid asset.");
      restartScanner();
      return;
    }

    const asset = result.asset;
    const assetTypeID = asset.asset_type_ID;

    // ✅ Find corresponding request item
    const requestedItem = requestedItems.find(
      (item) => item.asset_type_ID === assetTypeID
    );

    if (!requestedItem) {
      showPopup("⚠️ This asset type is not part of the request.");
      restartScanner();
      return;
    }

    // ✅ Init count if not yet tracked
    if (!scannedCountMap.current[assetTypeID]) {
      scannedCountMap.current[assetTypeID] = 0;
    }

    // ✅ Check scanned count limit
    if (scannedCountMap.current[assetTypeID] >= requestedItem.quantity) {
      showPopup(
        `⚠️ You already scanned all required items for: ${asset.asset_type}`
      );
      restartScanner();
      return;
    }

    // ✅ Proceed: Mark as scanned
    scannedRef.current[qrValue] = true;
    scannedCountMap.current[assetTypeID] += 1;

    setScannedAssets((prev) => [...prev, asset]);
    showPopup(`✅ Scanned: ${asset.asset_type} - ${asset.kld_property_tag}`);
    fetchRequestedItems();

  } catch (err) {
    showPopup("❌ Error validating scanned asset.");
  } finally {
    restartScanner();
  }
};


  const handleSave = () => {
    const assetData = scannedAssets.map((asset) => ({
      asset_ID: asset.asset_ID,
      asset_condition: asset.asset_condition || "N/A", // default if not set
    }));

    if (!token || assetData.length === 0) {
      showPopup("Missing token or no scanned assets to save.");
      return;
    }

    fetch("/api/Borrowing-Process/save_borrowed_items.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token, assets: assetData }), // ✅ match PHP
    })
      .then((res) => res.json())
      .then((data) => {
        showPopup(data.message || "Items saved successfully.");
        if (data.success) {
          setRedirectAfterPopup(true);
        }
      })
      .catch(() => {
        showPopup("Failed to save scanned items.");
      });
  };

  const allItemsScanned = Array.isArray(requestedItems) &&
    requestedItems.every((req) => {
      const count = scannedAssets.filter((a) => a.asset_type_ID === req.asset_type_ID).length;
      return count >= req.quantity;
    });

  useEffect(() => {
    return () => {
      if (html5Qr.current) {
        html5Qr.current.stop().then(() => {
          html5Qr.current.clear();
          document.getElementById("qr-reader").innerHTML = "";
        }).catch((err) => {
          console.warn("Failed to stop scanner on unmount:", err);
        });
      }
    };
  }, []);

  if (loading) return <div className="text-center mt-10">Checking session...</div>;

  return (
        <>
          <div className="receipt-scanning-top">
            {!scanning && (
              <button
                className="start-scan-btn btn btn-form-green"
                onClick={startScanner}
              >
                📷 Start Asset Scanning
              </button>
            )}
            <div id="qr-reader" className="receipt-qr-scanner" />
          </div>

          <div className="receipt-scanning-bottom">
            <h3>Requested Items:</h3>
            <ul>
              {requestedItems.map((item, idx) => {
                const scannedCount = scannedAssets.filter(
                  (a) => a.asset_type_ID === item.asset_type_ID
                ).length;
                return (
                  <li key={idx}>
                    <strong>{item.asset_type}</strong> — {scannedCount}/{item.quantity}
                  </li>
                );
              })}
            </ul>

            <h3>Scanned Assets:</h3>
            <ul>
              {scannedAssets.map((a, idx) => (
                <li key={idx}>{a.asset_name} ({a.kld_property_tag})</li>
              ))}
            </ul>

            {allItemsScanned && (
              <button
                className="btn btn-form-yellow"
                onClick={handleSave}
              >
                ✅ Save Scanned Items
              </button>
            )}
          </div>
        <Popups
          showResponse={showResponse}
          responseMessage={responseMessage}
          onCloseResponse={() => {
            setShowResponse(false);
            if (redirectAfterPopup) {
              navigate("/");
            }
          }}
        />
        </>
  );
};

export default BorrowReceipt;
