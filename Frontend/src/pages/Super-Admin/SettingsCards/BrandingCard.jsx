// src/pages/Super-admin/SettingsCards/BrandingSettingsCard.jsx
import { useState, useEffect } from "react";
import Popups from "/src/components/Popups";

const BrandingSettingsCard = ({ onRefreshLogs }) => {
  /** -------------------------------
   *  STATE MANAGEMENT
   *  ------------------------------- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [brandingInfo, setBrandingInfo] = useState({
    emailSender: "",
    headerFooterImgPath: "",
  });
  const[imgFullPath, setImgFullPath] = useState(null);

  const [tempBrandingInfo, setTempBrandingInfo] = useState({ ...brandingInfo });

  // Popup states
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  /** -------------------------------
   *  FETCH EXISTING BRANDING INFO
   *  ------------------------------- */
  useEffect(() => {
    fetchBrandingInfo();
  }, []);


    const fetchBrandingInfo = async () => {
      try {
        const response = await fetch(
          "/api/User-Handlers/settings/admin_get_branding_info.php",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch branding info");

        const data = await response.json();
        if (!data.error) {
          setBrandingInfo(data);
          setTempBrandingInfo(data);
        }
      } catch (error) {
        console.error("Error fetching branding info:", error);
      }
    };
    
    useEffect(() => {
      fetchHeaderFooter();
    }, []);

    const fetchHeaderFooter = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "/api/User-Handlers/settings/getPdfHeaderFooterPortrait.php"
        );
        const data = await response.json();

        if (data.success) {
          const imgPath = data.header_footer_img_path;
          console.log("📄 Header/Footer image path:", imgPath);
          setImgFullPath(imgPath);
        } else {
          setError(data.message || "Failed to load header/footer image.");
        }
      } catch (err) {
        setError("Error fetching header/footer image: " + err.message);
      } finally {
        setLoading(false);
      }
    };

  /** -------------------------------
   *  FORM HANDLERS
   *  ------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempBrandingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setTempBrandingInfo(brandingInfo);
    setIsEditing(false);
  };

  const handleSaveClick = () => setShowConfirm(true);

  /** -------------------------------
   *  SAVE EMAIL SENDER
   *  ------------------------------- */
  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setShowLoading(true);

    try {
      const response = await fetch(
        "/api/User-Handlers/settings/admin_update_branding_info.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(tempBrandingInfo),
        }
      );

      const updatedData = await response.json();

      if (!updatedData.error) {
        setBrandingInfo(updatedData);
        setIsEditing(false);
        setResponseTitle("✅ Success");
        setResponseMessage("Branding settings updated successfully.");

        setTimeout(() => {
          onRefreshLogs?.();
          setShowResponse(false);
        }, 1000);
      } else {
        throw new Error(updatedData.error || "Failed to update branding info.");
      }
    } catch (error) {
      console.error("Error updating branding info:", error);
      setResponseTitle("❌ Network Error");
      setResponseMessage("Unable to update branding settings, please try again.");
    } finally {
      setShowLoading(false);
      setShowResponse(true);
    }
  };

  /** -------------------------------
   *  UPLOAD HEADER/FOOTER IMAGE
   *  ------------------------------- */
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setShowLoading(true);

    try {
      const response = await fetch(
        "/api/User-Handlers/settings/admin_upload_branding_image.php",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.error) {
        setBrandingInfo((prev) => ({
          ...prev,
          headerFooterImgPath: data.headerFooterImgPath,
        }));

        setResponseTitle("✅ Success");
        setResponseMessage("Header/Footer image uploaded successfully.");
      } else {
        throw new Error(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setResponseTitle("❌ Error");
      setResponseMessage(error.message);
    } finally {
      setShowLoading(false);
      setShowResponse(true);
    }
  };

  /** -------------------------------
   *  RENDER
   *  ------------------------------- */
  return (
    <div className="card shadow">
      <div className="card-body">
        <h4 className="card-title">Branding Settings</h4>

        <div className="ps-3 mt-3">

          {/* ------------------- Email Sender ------------------- */}
          <div className="row">
            <div className="col-md-6">
              <label><strong>IMS Email Sender</strong></label>

              {isEditing ? (
                <input
                  type="email"
                  name="emailSender"
                  value={tempBrandingInfo.emailSender}
                  onChange={handleChange}
                  className="form-control mt-2 mb-2"
                  placeholder="Enter sender email"
                />
              ) : (
                <p>{brandingInfo.emailSender}</p>
              )}
            </div>
          </div>

          {/* ------------------- Buttons ------------------- */}
          <div className="col-md-6 mb-5">
            {isEditing ? (
              <>
                <button
                  className="btn btn-form-green me-2"
                  onClick={handleSaveClick}
                >
                  Save
                </button>
                <button
                  className="btn btn-form-red"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="btn btn-form-yellow"
                onClick={() => setIsEditing(true)}
              >
                Edit Email Sender
              </button>
            )}
          </div>

          {/* ------------------- Header/Footer Upload ------------------- */}
          <div className="row align-items-end">
            <div className="col-md-3 mb-3">
                <label><strong>Header/Footer Image for PDF</strong></label>

                {loading ? (
                  <>
                  <p>loading...</p>
                      <img 
                        src="/resources/imgs/loading.gif"
                        alt="Loading..." 
                        style={{ width: "80px", height: "80px" }} 
                      />
                  </>
                ) : (
                  <img
                    src={`/${imgFullPath}`}
                    alt="Header/Footer Portrait"
                    style={{ width: "100%", maxWidth: 250, borderRadius: "8px" }}
                  />
                )}
              </div>
            <div className="col-md-3 mb-3">
              <input
                type="file"
                id="headerFooterUpload"
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                onChange={handleUploadImage}
              />

              <button
                className="btn btn-form-blue mt-1"
                onClick={() =>
                  document.getElementById("headerFooterUpload").click()
                }
              >
                Upload New Image
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ------------------- Popups ------------------- */}
      <Popups
        showConfirmYesNo={showConfirm}
        confirmYesNoTitle="⚠️ Confirm Update"
        confirmYesNoBody="Are you sure you want to update branding settings?"
        confirmYesLabel="Yes, Update"
        confirmNoLabel="Cancel"
        onConfirmYes={handleConfirmSave}
        onConfirmNo={() => setShowConfirm(false)}
        showLoading={showLoading}
        loadingText="Updating branding settings..."
        showResponse={showResponse}
        responseTitle={responseTitle}
        responseMessage={responseMessage}
        onCloseResponse={() => setShowResponse(false)}
      />
    </div>
  );
};

export default BrandingSettingsCard;
