// AssetImportCsv.jsx
import React, { useImperativeHandle, forwardRef, useState } from "react";
import Popups from "/src/components/Popups.jsx";

const AssetImport = forwardRef(({ onImportSuccess }, ref) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showConfirmDone, setShowConfirmDone] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleImport = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("csvFile", file);
      setShowLoading(true);

      try {
        const response = await fetch(
          "/api/Assets-Handlers/import_asset_csv.php",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        setShowLoading(false);

        if (response.ok) {
          setShowConfirmDone(true);
            if (typeof onImportSuccess === "function") {
                onImportSuccess(); // ✅ reload table here
            }
        } else {
          setResponseMessage("Import failed: " + result.message);
          setShowResponse(true);
        }
      } catch (error) {
        setShowLoading(false);
        console.error("Error uploading file:", error);
        setResponseMessage("An error occurred during import.");
        setShowResponse(true);
      }
    };

    fileInput.click();
  };

  useImperativeHandle(ref, () => ({
    importCsv: handleImport,
  }));

  return (
    <Popups
      showLoading={showLoading}
      showConfirmDone={showConfirmDone}
      onConfirmDone={() => setShowConfirmDone(false)}
      showResponse={showResponse}
      responseMessage={responseMessage}
      onCloseResponse={() => setShowResponse(false)}
    />
  );
});

export default AssetImport;
