// src/components/forms/AssetFormDetail.jsx
import React, { useEffect, useState } from 'react';
import Popups from "/src/components/Popups.jsx";

const AssetDetails = ({ assetID, fetchAssets }) => {
  const [asset, setAsset] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [originalAsset, setOriginalAsset] = useState(null); 
  const [isLocked, setIsLocked] = useState(false); 

const hasChanges = (a, b) => {
  if (!a || !b) return false;

  return (
    a.brand_ID !== b.brand_ID ||
    a.asset_condition_ID !== b.asset_condition_ID ||
    a.user_ID !== b.user_ID ||
    a.room_ID !== b.room_ID ||
    a.a_source_ID !== b.a_source_ID ||
    a.asset_classification_ID !== b.asset_classification_ID ||
    a.date_acquired !== b.date_acquired ||
    a.price_amount !== b.price_amount ||
    a.serviceable_year !== b.serviceable_year ||
    a.is_borrowable !== b.is_borrowable
  );
};

  const handleUpdate = () => {
      if (!/^\d{4}$/.test(asset.serviceable_year)) {
        setResponseTitle("⚠️ Invalid Year Format");
        setResponseMessage("Serviceable Year must be a 4-digit year (e.g., 2025).");
        setShowResponse(true);
        return;
      }

      if (!hasChanges(asset, originalAsset)) {
        setResponseTitle("⚠️ Invalid");
        setResponseMessage("No changes made.");
        setShowResponse(true);
        return;
      }

      fetch("/api/Assets-Handlers/update_asset.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(asset),
      })
        .then((res) => res.json())
        .then((data) => {
          setResponseTitle("✅ Update Success");
          setResponseMessage(data.message || "Asset updated successfully.");
          setShowResponse(true);
          fetchAssets();
        })
        .catch((err) => {
          console.error("Update failed:", err);
          setResponseTitle("❌ Failed");
          setResponseMessage("Update failed.");
          setShowResponse(true);
        });
    };


useEffect(() => {
    if (assetID) {
      fetch(`/api/Assets-Handlers/fetch_asset_by_id.php?id=${assetID}`)
        .then((res) => res.json())
        .then((data) => {
          setAsset(data);
          setOriginalAsset(data);
          // check if asset is locked (part of active RIS/BRS)
          return fetch("/api/Assets-Handlers/checkAssetLockStatus.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: [data.asset_ID] }),
          });
        })
        .then((res) => res?.json())
        .then((lockData) => {
          if (lockData?.hasLocked) setIsLocked(true);
          else setIsLocked(false);
        })
        .catch((err) => console.error("Failed to fetch asset detail or lock:", err));
    }
  }, [assetID]);

const [dropdowns, setDropdowns] = useState({
  brands: [],
  asset_types: [],
  asset_classifications: [],
  acquisition_sources: [],
  rooms: [],
  units: [],
  users: [],
  asset_conditions: [],
});

useEffect(() => {
  fetch("/api/dropdown_fetch.php")
    .then(res => res.json())
    .then(data => setDropdowns(data))
    .catch(err => console.error("Dropdown fetch failed:", err));
}, []);

  if (!asset) {
    return <p>Loading...</p>;
  }

   return (
    <div>
      <div className="row g-3">

        {/* KLD Property Tag */}
        <div className="col-md-4">
          <label className="form-label fw-bold">KLD Property Tag</label>
          <input type="text" className="form-control" value={asset.kld_property_tag} readOnly />
        </div>

        {/* Property Tag */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Property Tag</label>
          <input type="text" className="form-control" value={asset.property_tag} readOnly />
        </div>
        

        {/* Acquisition Source */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Acquisition Source</label>
          <select
            className="form-control"
            value={asset.a_source_ID || ''}
            onChange={(e) => setAsset(prev => ({ ...prev, a_source_ID: e.target.value }))}
          >
            {dropdowns.acquisition_sources.map(src => (
              <option key={src.a_source_ID} value={src.a_source_ID}>
                {src.a_source_name}
              </option>
            ))}
          </select>
        </div>

        {/* Room */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Room</label>
          <select
            className="form-control"
            value={asset.room_ID || ''}   // will default to '' if null
            onChange={(e) => setAsset(prev => ({ ...prev, room_ID: e.target.value }))}
          >
            {/* Default option */}
            <option value="">Select Room</option>

            {dropdowns.rooms?.map((room) => (
              <option key={room.room_ID} value={room.room_ID}>
                {room.room_number}
              </option>
            ))}
          </select>
        </div>

        {/* Asset Condition */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Asset Condition</label>
          <select
            className="form-control"
            value={asset.asset_condition_ID || ''}
            onChange={(e) =>
              setAsset((prev) => ({
                ...prev,
                asset_condition_ID: e.target.value,
              }))
            }
            disabled={isLocked} // disable if locked
          >
            {dropdowns.asset_conditions.map((c) => (
              <option key={c.asset_condition_ID} value={c.asset_condition_ID}>
                {c.condition_name}
              </option>
            ))}
          </select>
          {isLocked && (
            <small className="text-danger">
              Asset condition cannot be modified (linked to active RIS/BRS).
            </small>
          )}
        </div>


        <div className="col-md-4">
          <label className="form-label fw-bold">Borrowable</label>
          <select
            className="form-select"
            value={asset.is_borrowable || 'no'}
            onChange={(e) =>
              setAsset((prev) => ({ ...prev, is_borrowable: e.target.value }))
            }
          >
            <option value="yes">Yes, this is borrowable</option>
            <option value="no">No, this is not borrowable</option>
          </select>
        </div>

        {/* Brand */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Brand</label>
          <select className="form-control" value={asset.brand_ID || ''} onChange={(e) => setAsset(prev => ({ ...prev, brand_ID: e.target.value }))}>
            {dropdowns.brands.map(b => (
              <option key={b.brand_ID} value={b.brand_ID}>
                {b.brand_name}
              </option>
            ))}
          </select>
        </div>

        {/* Asset Type */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Asset Type</label>
          <input type="text" className="form-control" value={asset.asset_type || ''} readOnly />
        </div>

        {/* Asset Classification */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Asset Classification</label>
          <select
            className="form-control"
            value={asset.asset_classification_ID || ''}
            onChange={(e) =>
              setAsset((prev) => ({
                ...prev,
                asset_classification_ID: e.target.value,
              }))
            }
          >
            <option value="">Select Classification</option>
            {dropdowns.asset_classifications.map((cls) => (
              <option key={cls.asset_classification_ID} value={cls.asset_classification_ID}>
                {cls.asset_classification}
              </option>
            ))}
          </select>
        </div>


        {/* Responsible (User) */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Accounted to</label>
          <select
            className="form-control" value={asset.user_ID || ''} onChange={(e) =>setAsset((prev) => ({ ...prev, user_ID: e.target.value }))}
          >
            {dropdowns.users.map((user) => (
              <option key={user.user_ID} value={user.user_ID}>
                {user.full_name}
              </option>
            ))}
          </select>
        </div>

       {/* Unit */}
      <div className="col-md-4">
        <label className="form-label fw-bold">Unit</label>
        <input type="text" className="form-control" value={asset.responsible_unit || ''} readOnly /> 
      </div>

      {/* Date Acquired */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Date Acquired</label>
          <input
            type="date"
            className="form-control"
            value={asset.date_acquired || ''}
            onChange={(e) => setAsset(prev => ({ ...prev, date_acquired: e.target.value }))}
          />
        </div>

        {/* Serviceable Year */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Serviceable Year</label>
          <input
            type="number"
            className="form-control"
            value={asset.serviceable_year || ""}
            onChange={(e) =>
              setAsset((prev) => ({
                ...prev,
                serviceable_year: e.target.value,
              }))
            }
            min="1900"
            max="2099"
            step="1"
            placeholder="YYYY"
          />
        </div>

        {/* Price Amount */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Price Amount</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={asset.price_amount || ''}
            onChange={(e) => setAsset(prev => ({ ...prev, price_amount: e.target.value }))}
          />
        </div>
      </div>  
        <div className="row g-2 mt-3">
          {/* Barcode */}
          <div className="col-md-8">
            <label className="form-label fw-bold">Barcode</label>
            <div className="border p-2">
              <img
                src={`/${asset.barcode_image_path}`}
                alt="Barcode"
                style={{ width: '100%', maxWidth: '1000px', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* QR Code */}
          <div className="col-md-4">
            <label className="form-label fw-bold">QR Code</label>
            <div className="border p-2">
              <img
                src={`/${asset.qr_image_path}`}
                alt="QR Code"
                style={{ width: '100%', maxWidth: '150px' }}
              />
            </div>
          </div>
        
        </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button title='Update Asset' onClick={handleUpdate} className="btn btn-form-green">
          Update
        </button>
      </div>
      <Popups
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => {
          setShowResponse(false);
          if (fetchAssets) fetchAssets();                  
        }}
      />
    </div>
  );
};

export default AssetDetails;
