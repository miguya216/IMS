import { useEffect, useState } from "react";

const ConsumableDetails = ({ consumableId }) => {
  const [formData, setFormData] = useState({
    kld_property_tag: "",
    consumable_name: "",
    description: "",
    unit_of_measure: "",
    total_quantity: "",
    price_amount: "",
    date_acquired: "",
    barcode_image_path: "",
    qr_image_path: "",
  });

  useEffect(() => {
    if (consumableId) {
      fetch(`/api/Consumable-Handlers/fetch_consumable_by_id.php?id=${consumableId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setFormData(data.data);
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [consumableId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/Consumable-Handlers/update_consumable.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consumableId, ...formData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Consumable updated!");
        } else {
          alert("Error updating consumable");
        }
      });
  };

  return (
      <>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label fw-bold">KLD Property Tag</label>
          <input
            type="text"
            className="form-control"
            name="kld_property_tag"
            value={formData.kld_property_tag}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">Consumable Name</label>
          <input
            type="text"
            className="form-control"
            name="consumable_name"
            value={formData.consumable_name}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">Description</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">UOM</label>
          <input
            type="text"
            className="form-control"
            name="unit_of_measure"
            value={formData.unit_of_measure}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">Quantity</label>
          <input
            type="number"
            className="form-control"
            name="total_quantity"
            value={formData.total_quantity}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">Price Amount</label>
          <input
            type="number"
            className="form-control"
            name="price_amount"
            value={formData.price_amount}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">Date Acquired</label>
          <input
            type="date"
            className="form-control"
            name="date_acquired"
            value={formData.date_acquired}
            onChange={handleChange}
            required
            readOnly
          />
        </div>

        {/* Barcode */}
        <div className="row g-1">
           {formData.barcode_image_path && (
              <div className="col-md-8">
                <label className="form-label fw-bold">Barcode</label>
                <div className="border p-2">
                  <img
                    src={`/${formData.barcode_image_path}`}
                    alt="Barcode"
                    style={{ width: "100%", maxWidth: "1000px", objectFit: "contain" }}
                  />
                </div>
              </div>
            )}

              {/* QR Code */}
          {formData.qr_image_path && (
            <div className="col-md-4">
              <label className="form-label fw-bold">QR Code</label>
              <div className="border p-2">
                <img
                  src={`/${formData.qr_image_path}`}
                  alt="QR Code"
                  style={{ width: "100%", maxWidth: "150px" }}
                />
              </div>
            </div>
          )}
        </div> 
      </div>

      {/* Temporarily hide Update button */}
      {/* <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="submit" className="btn btn-form-green">
          Update
        </button>
      </div> */}
      </>
  );
};

export default ConsumableDetails;
