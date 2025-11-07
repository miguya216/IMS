// src/components/forms/AssetFormDetail.jsx
import React, { useEffect, useState } from "react";

const AssetDetails = ({ assetID }) => {
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    if (assetID) {
      fetch(`/api/Assets-Handlers/fetch_asset_by_id.php?id=${assetID}`)
        .then((res) => res.json())
        .then((data) => setAsset(data))
        .catch((err) => console.error("Failed to fetch asset detail:", err));
    }
  }, [assetID]);

  if (!asset) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="row g-3">

        {/* KLD Property Tag */}
        <div className="col-md-4">
          <label className="form-label fw-bold">KLD Property Tag</label>
          <input type="text" className="form-control" value={asset.kld_property_tag || ""} readOnly />
        </div>

        {/* Property Tag */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Property Tag</label>
          <input type="text" className="form-control" value={asset.property_tag || ""} readOnly />
        </div>

        {/* Acquisition Source */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Acquisition Source</label>
          <input type="text" className="form-control" value={asset.a_source_name || ""} readOnly />
        </div>

        {/* Room */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Room</label>
          <input type="text" className="form-control" value={asset.room_number || ""} readOnly />
        </div>

        
        {/* Asset Condition */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Asset Condition</label>
          <input type="text" className="form-control" value={asset.asset_condition || ""} readOnly />
        </div>

        {/* Brand */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Brand</label>
          <input type="text" className="form-control" value={asset.brand_name || ""} readOnly />
        </div>

        {/* Asset Type */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Asset Type</label>
          <input type="text" className="form-control" value={asset.asset_type || ""} readOnly />
        </div>

         {/* Asset Type */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Asset Classification</label>
          <input type="text" className="form-control" value={asset.asset_classification || ""} readOnly />
        </div>


        {/* Responsible (User) */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Accounted to</label>
          <input type="text" className="form-control" value={asset.responsible || ""} readOnly />
        </div>

        {/* Unit */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Unit</label>
          <input type="text" className="form-control" value={asset.responsible_unit || ""} readOnly />
        </div>

        {/* Date Acquired */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Date Acquired</label>
          <input type="text" className="form-control" value={asset.date_acquired || ""} readOnly />
        </div>

        {/* Serviceable Year */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Serviceable Year</label>
          <input type="text" className="form-control" value={asset.serviceable_year || ""} readOnly />
        </div>

        {/* Price Amount */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Price Amount</label>
          <input type="text" className="form-control" value={asset.price_amount || ""} readOnly />
        </div>

        <div className="row g-2">
          {/* Barcode */}
          <div className="col-md-8">
            <label className="form-label fw-bold">Barcode</label>
            <div className="border p-2">
              <img
                src={`/${asset.barcode_image_path}`}
                alt="Barcode"
                style={{ width: "100%", maxWidth: "1000px", objectFit: "contain" }}
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
                style={{ width: "100%", maxWidth: "150px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;
