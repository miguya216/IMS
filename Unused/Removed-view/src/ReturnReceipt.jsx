import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Popups from "/src/components/Popups.jsx";
import { useNavigate, useParams } from "react-router-dom";

const ReturnReceipt = () => {
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
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [custodianVerified, setCustodianVerified] = useState(false);
  const [conditions, setConditions] = useState([]);


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
          fetch("/api/dropdown_fetch.php")
            .then((res) => res.json())
            .then((options) => {
              if (options.asset_conditions) {
                setConditions(options.asset_conditions); // use condition_name or condition_ID as needed
              } else {
                showPopup("No asset conditions found.");
              }
            })
            .catch(() => {
              showPopup("Failed to fetch asset conditions.");
            });
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
          const isAssetScan = !allItemsScannedNow(); // If not yet complete, it's an asset
          const isCustodianScan = allItemsScannedNow(); // Once done, expect custodian scan

          if (isAssetScan) {
            handleAssetScan(scannedText);
          } else {
            handleCustodianScan(scannedText);
          }
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

  const handleAssetScan = async (qrValue) => {
  if (scannedRef.current[qrValue]) {
    showPopup("⚠️ This asset has already been scanned.");
    return; // ✅ no restart here
  }

  try {
    const res = await fetch("/api/Borrowing-Process/validate_return_asset.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ kld_property_tag: qrValue, token }),
    });

    const result = await res.json();

    if (!result.success) {
      showPopup(result.message || "Invalid asset.");
    } else {
      const asset = { ...result.asset, new_condition: result.asset.asset_condition };
      scannedRef.current[qrValue] = true;
      setScannedAssets((prev) => [...prev, asset]);
      showPopup(`✅ Scanned: ${asset.asset_type} - ${asset.kld_property_tag}`);
    }
  } catch (err) {
    showPopup("Error validating scanned asset.");
  }
};

const lastScannedCountRef = useRef(0);

useEffect(() => {
  if (scannedAssets.length > lastScannedCountRef.current) {
    lastScannedCountRef.current = scannedAssets.length;
    restartScanner();
  }
}, [scannedAssets]);


  const handleCustodianScan = async (scannedKLD_ID) => {
    if (!allItemsScannedNow()) {
      showPopup("🔄 Still expecting asset QR codes.");
      restartScanner();
      return;
    }

    try {
      const items = scannedAssets.map(({ asset_ID, new_condition }) => ({
        asset_ID,
        condition: new_condition,
      }));

      const res = await fetch("/api/Borrowing-Process/verify_custodian.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token,
          kld_id: scannedKLD_ID,
          items,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCustodianVerified(true);
        showPopup(data.message || "✅ Return completed.");
        setRedirectAfterPopup(true);
      } else {
        showPopup(data.message || "❌ Custodian verification failed.");
      }
    } catch (err) {
      showPopup("Server error during verification & save.");
    } finally {
      restartScanner();
    }
  };

const allItemsScannedNow = () => {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) return false;
  if (scannedAssets.length === 0) return false;

  return requestedItems.every((req) => {
    const count = scannedAssets.filter(
      (a) => a.asset_type_ID == req.asset_type_ID
    ).length;
    return count >= req.quantity;
  });
};

  const handleConditionChange = (index, value) => {
    setScannedAssets((prev) => {
      const updated = [...prev];
      updated[index].new_condition = value;
      return updated;
    });
  };

const allItemsScanned = (
  Array.isArray(requestedItems) &&
  requestedItems.length > 0 &&
  scannedAssets.length > 0 &&
  requestedItems.every((req) => {
    const count = scannedAssets.filter(
      (a) => a.asset_type_ID === req.asset_type_ID
    ).length;
    return count >= req.quantity;
  })
);


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
            📷 Start Scanning
          </button>
        )}
        <div id="qr-reader" className="receipt-qr-scanner" />
      </div>

      <div className="receipt-scanning-bottom">
          {!custodianVerified && allItemsScanned && (
            <p className="text-blue-500 font-medium">
              ✅ All assets scanned. Please scan the <strong>Custodian QR</strong> to finalize return.
            </p>
          )}
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
            <li key={idx}>
              {a.asset_name} ({a.kld_property_tag}) —
              <select
                value={a.new_condition}
                onChange={(e) => handleConditionChange(idx, e.target.value)}
                className="form-control"
              >
                {conditions.map((cond) => (
                  <option key={cond.asset_condition_ID} value={cond.condition_name}>
                    {cond.condition_name}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>

      
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

export default ReturnReceipt;