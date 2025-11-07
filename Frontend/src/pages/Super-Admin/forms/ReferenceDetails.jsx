import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Pagination from "/src/components/Pagination.jsx";
import Popups from "/src/components/Popups.jsx";

const ReferenceDetails = ({ type, columns, idField, nameField, assetTypeField }) => {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editAssetType, setEditAssetType] = useState("");
  const [assetTypes, setAssetTypes] = useState([]);
  const [responseTitle, setResponseTitle] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // NEW: confirmation state for saving changes
  const [showConfirmYesNo, setShowConfirmYesNo] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`/api/Reference-Data/fetch_ref_data.php?action=${type}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setCurrentPage(1);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [type]);

  useEffect(() => {
    if (type === "brand") {
      fetch("/api/Reference-Data/fetch_ref_data.php?action=asset_type")
        .then((res) => res.json())
        .then((data) => setAssetTypes(data))
        .catch((err) => console.error("Error fetching asset types:", err));
    }
  }, [type]);

  const handleEdit = (item) => {
    setEditingId(item[idField]);
    setEditValue(item[nameField]);
    if (type === "brand") {
      setEditAssetType(item[assetTypeField]);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
    setEditAssetType("");
  };

  // ask user before saving
  const handleSaveClick = () => {
    setShowConfirmYesNo(true);
  };

  // actual save logic
  const handleSaveConfirmed = async () => {
    setShowConfirmYesNo(false);

    const payload = {
      selectedType: type,
      newValue: editValue,
      referenceID: editingId,
    };
    if (type === "brand") {
      payload.asset_type_ID = editAssetType;
    }

    try {
      const res = await fetch("/api/Reference-Data/update_reference.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      const formattedMessage = result.message.replace(/_/g, " ");
      setResponseTitle("✅ Update Success");
      setResponseMessage(formattedMessage);
      setShowResponse(true);

      if (result.success) {
        setEditingId(null);
        setEditValue("");
        setEditAssetType("");
        const updated = await fetch(`/api/Reference-Data/fetch_ref_data.php?action=${type}`);
        const json = await updated.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // helper to format labels
  const formatLabel = (label) =>
    label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());


  return (
    <div className="custom-table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            {columns.map((col) => (
              <th key={col}>{formatLabel(col)}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((item, index) => {
            const isEditing = item[idField] === editingId;
            return (
              <tr key={item[idField]}>
                <td data-label="#">{indexOfFirstItem + index + 1}</td>

                {/* First column: Name field */}
                <td data-label={formatLabel(`${type} Name`)}>
                  {isEditing ? (
                    <Form.Control
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      size="sm"
                    />
                  ) : (
                    item[nameField]
                  )}
                </td>

                {/* Second column for Brand only: Asset Type */}
                {type === "brand" && (
                  <td data-label={formatLabel("Asset Type")}>
                    {isEditing ? (
                      <Form.Select
                        value={editAssetType}
                        onChange={(e) => setEditAssetType(e.target.value)}
                        size="sm"
                      >
                        <option value="">Select Asset Type</option>
                        {assetTypes.map((at) => (
                          <option key={at.asset_type_ID} value={at.asset_type_ID}>
                            {at.asset_type}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      item.asset_type
                    )}
                  </td>
                )}

                {/* Actions */}
                <td data-label="Actions">
                  {isEditing ? (
                    <>
                      <button onClick={handleSaveClick} className="btn btn-form-green me-1">Save</button>
                      <button onClick={handleCancel} className="btn btn-form-red me-1">Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(item)} className="btn btn-form-yellow">Edit</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <Popups
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
      <Popups
        showConfirmYesNo={showConfirmYesNo}
        confirmYesNoTitle="⚠️ Confirm Changes"
        confirmYesNoBody="If you change this reference data, all other records that use it will also be updated. Do you want to proceed?"
        confirmYesLabel="Yes, Save"
        confirmNoLabel="Cancel"
        onConfirmYes={handleSaveConfirmed}
        onConfirmNo={() => setShowConfirmYesNo(false)}
      />
    </div>
  );
};

export default ReferenceDetails;
