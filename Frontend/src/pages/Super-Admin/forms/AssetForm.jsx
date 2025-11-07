// AssetForm.jsx
import React, { useState, useEffect } from "react";
import Popups from "/src/components/Popups.jsx";
import AssetOptionHandler from "/src/pages/Super-admin/forms/functions/AssetOptionHandler.jsx";

const AssetForm = ({ fetchAssets }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [brandLocked, setBrandLocked] = useState(false);
  const [responsibleLocked, setResponsibleLocked] = useState(false);

  const [formData, setFormData] = useState({
    property_tag: "",
    asset_condition: "", new_asset_condition: "",
    brand: "", new_brand: "",
    asset_type: "", new_asset_type: "",
    asset_classification: "", new_asset_classification: "",
    acquisition_source: "", new_acquisition_source: "",
    room: "", new_room: "",
    responsible: "", first_name: "", middle_name: "", last_name: "",
    unit: "", new_unit: "",
    date_acquired: "",
    serviceable_year: "",  
    price_amount: "" 
  });

  const [showNew, setShowNew] = useState({
    asset_condition: false,
    brand: false,
    asset_type: false,
    asset_classification: false,
    acquisition_source: false,
    room: false,
    responsible: false,
    unit: false,
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    asset_conditions: [],
    brands: [],
    asset_types: [],
    asset_classifications: [],
    acquisition_sources: [], 
    rooms: [],
    users: [],
    units: [],
  });

  const { handleDropdownChange, handleAddNewClick } = AssetOptionHandler({
    setFormData,
    setShowNew,
    setBrandLocked,
    setResponsibleLocked,
  });

  useEffect(() => {
    fetch("/api/dropdown_fetch.php")
      .then((res) => res.json())
      .then((data) => {
        setDropdownOptions({
          asset_conditions: data?.asset_conditions || [],
          brands: data?.brands || [],
          asset_types: data?.asset_types || [],
          asset_classifications: data?.asset_classifications || [],
          acquisition_sources: data?.acquisition_sources || [],
          rooms: data?.rooms || [],
          users: data?.users || [],
          units: data?.units || [],
        });
      })
      .catch((error) => {
        console.error("Dropdown fetch failed:", error);
        setDropdownOptions({
          asset_conditions: [],
          brands: [],
          asset_types: [],
          asset_classifications: [],
          acquisition_sources: [],
          rooms: [],
          users: [],
          units: [],
        });
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  setShowLoading(true);

  // Validate Serviceable Year
  if (!/^\d{4}$/.test(formData.serviceable_year)) {
    setShowLoading(false);
    setResponseTitle("⚠️ Invalid Year Format");
    setResponseMessage("Serviceable Year must be a 4-digit year (e.g., 2025).");
    setShowResponse(true);
    return;
  }

  const prepareField = (field) => ({
    existing_id: formData[field],
    new_value: formData[`new_${field}`]?.trim() || ""
  });

  const responsibleField = {
    existing_id: formData.responsible,
    new_value: {
      first_name: formData.first_name.trim(),
      middle_name: formData.middle_name.trim(),
      last_name: formData.last_name.trim()
    }
  };

  const payload = {
    property_tag: formData.property_tag.trim(),
    asset_condition: prepareField("asset_condition"),
    brand: prepareField("brand"),
    asset_type: prepareField("asset_type"),
    asset_classification: prepareField("asset_classification"),
    acquisition_source: prepareField("acquisition_source"),
    room: prepareField("room"),
    unit: prepareField("unit"),
    responsible: responsibleField,
    date_acquired: formData.date_acquired,
    serviceable_year: formData.serviceable_year,
    price_amount: formData.price_amount,
    response_for_this_log: "Admin"
  };

  fetch("/api/Assets-Handlers/insert_asset.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      setShowLoading(false);
      setResponseTitle("✅ New Asset Inserted");
      setResponseMessage(data.message || "Successfully submitted.");
      setShowResponse(true);
      fetchAssets();
    })
    .catch((error) => {
      setShowLoading(false);
      setResponseTitle("❌ Registration Success");
      setResponseMessage("Submission failed: " + error.message);
      setShowResponse(true);
    });
};


  const dropdownFields = [
    {
      label: "Asset Condition",
      field: "asset_condition",
      options: dropdownOptions.asset_conditions,
      valueKey: "asset_condition_ID",
      labelKey: "condition_name",
    },
    {
      label: "Brand",
      field: "brand",
      options: dropdownOptions.brands,
      valueKey: "brand_ID",
      labelKey: "brand_name",
    },
    {
      label: "Asset Type",
      field: "asset_type",
      options: dropdownOptions.asset_types,
      valueKey: "asset_type_ID",
      labelKey: "asset_type",
      disabled: brandLocked,
    },
    {
      label: "Asset Classification",
      field: "asset_classification",
      options: dropdownOptions.asset_classifications,
      valueKey: "asset_classification_ID",
      labelKey: "asset_classification",
    },
    {
      label: "Acquisition Source", 
      field: "acquisition_source",
      options: dropdownOptions.acquisition_sources,
      valueKey: "a_source_ID",
      labelKey: "a_source_name",
    },
    {
      label: "Room Assigned",
      field: "room",
      options: dropdownOptions.rooms,
      valueKey: "room_ID",
      labelKey: "room_number",
    },
    {
      label: "Accounted to",
      field: "responsible",
      options: dropdownOptions.users,
      valueKey: "user_ID",
      labelKey: "full_name",
    },
    {
      label: "Unit / Institute",
      field: "unit",
      options: dropdownOptions.units,
      valueKey: "unit_ID",
      labelKey: "unit_name",
      disabled: responsibleLocked,
    },
  ];

  const renderNewInput = (field, label) => {
    if (!showNew[field]) return null;

    if (field === "responsible") {
      return (
        <>
          <input type="text" name="first_name" className="form-control mt-2" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
          <input type="text" name="middle_name" className="form-control mt-2" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} />
          <input type="text" name="last_name" className="form-control mt-2" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
        </>
      );
    }

    return (
      <input
        type="text"
        className="form-control mt-2"
        placeholder={`New ${label}`}
        name={`new_${field}`}
        value={formData[`new_${field}`]}
        onChange={handleChange}
      />
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          <div className="col-md-4">
            <label className="form-label fw-bold">Property Tag</label>
            <input 
            type="text" 
            className="form-control" 
            name="property_tag" 
            value={formData.property_tag} 
            onChange={handleChange} 
            required />
          </div>

          {dropdownFields.map(({ label, field, options, valueKey, labelKey, disabled }) => (
            <div key={field} className="col-md-4">
              <label className="form-label fw-bold">{label}</label>
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  name={field}
                  value={formData[field]}
                  onChange={(e) => handleDropdownChange(e, field)}
                  disabled={disabled}
                  required={!showNew[field]}
                >
                  <option value="">Select</option>
                  {Array.isArray(options) && options.length > 0 ? (
                    options.map((opt) => (
                      <option key={opt[valueKey]} value={opt[valueKey]}>
                        {opt[labelKey]}
                      </option>
                    ))
                  ) : (
                    <option disabled value="">No options available</option>
                  )}
                </select>
                <button
                  title={`Add new ${label}`}
                  type="button"
                  className="btn btn-form-green"
                  onClick={() => handleAddNewClick(field)}
                  disabled={disabled}
                >
                  +
                </button>
              </div>
              {renderNewInput(field, label)}
            </div>
          ))}

        <div className="col-md-4">
          <label className="form-label fw-bold">Date Acquired</label>
          <input
            type="date"
            className="form-control"
            name="date_acquired"
            value={formData.date_acquired}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Serviceable Year</label>
          <input
            type="number"
            className="form-control"
            name="serviceable_year"
            value={formData.serviceable_year}
            onChange={handleChange}
            min="1900"
            max="2099"
            step="1"
            placeholder="YYYY"
            required
          />
        </div>


        <div className="col-md-4">
          <label className="form-label fw-bold">Price Amount</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="price_amount"
            value={formData.price_amount}
            onChange={handleChange}
            required
          />
        </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button title="Save Asset" type="submit" className="btn btn-form-green">Save</button>
        </div>
      </form>

      <Popups
        showLoading={showLoading}
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => {
          setShowResponse(false);
          if (fetchAssets) fetchAssets();                  
        }}
      />
    </>
  );
};

export default AssetForm;
