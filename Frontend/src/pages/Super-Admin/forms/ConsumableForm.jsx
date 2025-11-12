import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import Popups from "/src/components/Popups.jsx";

const ConsumableForm = ({ fetchConsumables }) => {
  const [formData, setFormData] = useState({
    consumable_name: "",
    description: "",
    uom: "",
    quantity: "",
    price_amount: "",
    date_acquired: "",
  });

  const [consumableOptions, setConsumableOptions] = useState([]);

  const [showLoading, setShowLoading] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const res = await fetch("/api/dropdown_fetch.php");
        const data = await res.json();
        if (data.consumables) {
          setConsumableOptions(
            data.consumables.map((c) => ({
              value: c.consumable_name,
              label: `${c.consumable_name} (${c.kld_property_tag || "No Tag"})`,
              description: c.description || "",      
              uom: c.unit_of_measure || "",      
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch consumables:", err);
      }
    };
    loadOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConsumableSelect = (selected) => {
    if (selected) {
      const existing = consumableOptions.find(
        (opt) => opt.value === selected.value
      );

      if (existing) {
        // Existing consumable → prefill + disable
        setFormData({
          ...formData,
          consumable_name: existing.value,
          description: existing.description,
          uom: existing.uom,
        });
      } else {
        // New consumable → allow typing
        setFormData({
          ...formData,
          consumable_name: selected.value,
          description: "",
          uom: "",
        });
      }
    } else {
      setFormData({
        ...formData,
        consumable_name: "",
        description: "",
        uom: "",
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);

    try {
      const response = await fetch(
        "/api/Consumable-Handlers/insert_consumable.php",
        {
          method: "POST",
          body: new URLSearchParams(formData), // PHP reads as $_POST
        }
      );

      const result = await response.json();
      setShowLoading(false);
      setResponseTitle("✅ New Consumable Inserted");
      setResponseMessage(result.message || "Transaction complete.");
      setShowResponse(true);

      if (result.success) {
        // reset form
        setFormData({
          consumable_name: "",
          description: "",
          uom: "",
          quantity: "",
          price_amount: "",
          date_acquired: "",
        });

        if (fetchConsumables) fetchConsumables();
      }
    } catch (error) {
      setShowLoading(false);
      setResponseTitle("❌ Failed");
      setResponseMessage("Submission failed: " + error.message);
      setShowResponse(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">Consumable Name</label>
            <CreatableSelect
                options={consumableOptions}
                value={
                  formData.consumable_name
                    ? consumableOptions.find(
                        (opt) => opt.value === formData.consumable_name
                      ) || { value: formData.consumable_name, label: formData.consumable_name } // handle new entry
                    : null
                }
                onChange={handleConsumableSelect}
                placeholder="Select or new"
                isClearable
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
              disabled={
                !!consumableOptions.find((opt) => opt.value === formData.consumable_name)
              } 
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">UOM</label>
            <input
              type="text"
              className="form-control"
              name="uom"
              value={formData.uom}
              onChange={handleChange}
              disabled={
                !!consumableOptions.find((opt) => opt.value === formData.consumable_name)
              } 
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">Quantity</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
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
            />
          </div>
        </div>

        <div className="form-modal-footer">
          <button title="Save Consumable" type="submit" className="btn btn-form-green">
            Save
          </button>
        </div>
      </form>

      <Popups
        showLoading={showLoading}
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </>
  );
};

export default ConsumableForm;
