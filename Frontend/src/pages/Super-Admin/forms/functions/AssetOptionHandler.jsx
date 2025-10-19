// AssetOptionHandler.jsx

const AssetOptionHandler = ({
  setFormData,
  setShowNew,
  setBrandLocked,
  setResponsibleLocked,
}) => {
  const handleDropdownChange = (e, field) => {
    const value = e.target.value;

    const clearDependentField = (dependentField, lockSetter) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        [`new_${field}`]: "",
        [dependentField]: "",
        [`new_${dependentField}`]: "",
      }));
      setShowNew((prev) => ({
        ...prev,
        [field]: false,
        [dependentField]: false,
      }));
      lockSetter(true);
    };

    if (field === "brand") {
      if (value === "add-new") {
        setFormData((prev) => ({
          ...prev,
          brand: "",
          new_brand: "",
        }));
        setShowNew((prev) => ({ ...prev, brand: true }));
        setBrandLocked(false);
      } else if (value === "") {
        setFormData((prev) => ({
          ...prev,
          brand: "",
          new_brand: "",
          asset_type: "",
          new_asset_type: "",
        }));
        setShowNew((prev) => ({
          ...prev,
          brand: false,
          asset_type: false,
        }));
        setBrandLocked(false);
      } else {
        clearDependentField("asset_type", setBrandLocked);
      }
    } else if (field === "responsible") {
      if (value === "add-new") {
        setFormData((prev) => ({
          ...prev,
          responsible: "",
          first_name: "",
          middle_name: "",
          last_name: "",
        }));
        setShowNew((prev) => ({ ...prev, responsible: true }));
        setResponsibleLocked(false);
      } else if (value === "") {
        setFormData((prev) => ({
          ...prev,
          responsible: "",
          first_name: "",
          middle_name: "",
          last_name: "",
          unit: "",
          new_unit: "",
        }));
        setShowNew((prev) => ({
          ...prev,
          responsible: false,
          unit: false,
        }));
        setResponsibleLocked(false);
      } else {
        clearDependentField("unit", setResponsibleLocked);
      }
    } else {
      if (value === "add-new") {
        setFormData((prev) => ({
          ...prev,
          [field]: "",
          [`new_${field}`]: "",
        }));
        setShowNew((prev) => ({ ...prev, [field]: true }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          [`new_${field}`]: "",
        }));
        setShowNew((prev) => ({ ...prev, [field]: false }));
      }
    }
  };

  const handleAddNewClick = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: "",
      [`new_${field}`]: "",
    }));
    setShowNew((prev) => ({ ...prev, [field]: true }));
  };

  return { handleDropdownChange, handleAddNewClick };
};

export default AssetOptionHandler;
