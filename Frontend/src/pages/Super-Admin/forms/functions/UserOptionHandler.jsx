import { useEffect, useState } from "react";


export const useUserFormHandler = ({ onClose, setShowLoading, setShowResponse, setResponseMessage }) => {
     
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    unit: "",
    role: "",
    kld_id: "",
    kld_email: "",
    password: "",
    new_unit: "",
    new_role: "",
  });

  const [showNew, setShowNew] = useState({ unit: false, role: false });
  const [showAccountFields, setShowAccountFields] = useState(false);

  const [dropdownOptions, setDropdownOptions] = useState({
    units: [],
    roles: [],
  });

  // Fetch unit and role from backend
  useEffect(() => {
    fetch("/api/dropdown_fetch.php")
      .then((res) => res.json())
      .then((data) => {
        setDropdownOptions({
          units: data.units?.map((u) => ({ id: u.unit_ID, name: u.unit_name })) || [],
          roles: data.roles?.map((r) => ({ id: r.role_ID, name: r.role_name })) || [],
        });
      })
      .catch((error) => console.error("Dropdown fetch failed:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (showNew[field]) {
      setShowNew((prev) => ({ ...prev, [field]: false }));
      setFormData((prev) => ({ ...prev, [`new_${field}`]: "" }));
    }
  };

  const handleAddNewClick = (field) => {
    setShowNew((prev) => {
      const newShow = !prev[field];
      if (!newShow) {
        setFormData((prevData) => ({ ...prevData, [`new_${field}`]: "" }));
      }
      return { ...prev, [field]: newShow };
    });
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleToggleAccount = () => {
    setShowAccountFields((prev) => !prev);
  };

  const renderNewInput = (field, label) => {
    if (!showNew[field]) return null;
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

   const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true); 

    try {
      const response = await fetch(
        "/api/User-Handlers/insert_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        setResponseMessage("User inserted successfully!");
        setShowResponse(true);
      } else if (result.message === "duplicate") {
        setResponseMessage("User already exists.");
        setShowResponse(true);
      } else {
        console.error("Insert failed:", result.message);
        setResponseMessage("Failed to insert user.");
        setShowResponse(true);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setResponseMessage("Something went wrong during submission.");
      setShowResponse(true);
    } finally {
      setShowLoading(false);
    }
    
  };

  return {
    formData,
    showNew,
    showAccountFields,
    handleChange,
    handleDropdownChange,
    setFormData,
    setShowAccountFields,
    handleAddNewClick,
    handleToggleAccount,
    renderNewInput,
    handleSubmit,
    dropdownOptions,
  };
};
