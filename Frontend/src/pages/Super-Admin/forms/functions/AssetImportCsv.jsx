import React, { useImperativeHandle, forwardRef, useState } from "react";
import Popups from "/src/components/Popups.jsx";

const AssetImport = forwardRef(({ onImportSuccess }, ref) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showConfirmDone, setShowConfirmDone] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
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
          const formattedMessage =
            result.summary +
            (result.errors?.length
              ? "<br><strong>Errors:</strong><br>" + result.errors.join("<br>")
              : "");
          setResponseTitle("✅ Importing Complete");
          setResponseMessage(formattedMessage);

          // 🔹 Call parent refresh after successful import
          if (typeof onImportSuccess === "function") {
            onImportSuccess();
          }
        } else {
          setResponseTitle("❌ Failed");
          setResponseMessage("Import failed:<br>" + (result.summary || result.message));
        }

        setShowConfirmDone(true);
      } catch (error) {
        setShowLoading(false);
        console.error("Error uploading file:", error);
        setResponseTitle("❌ Failed");
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
      confirmDoneBody={responseMessage}
      confirmDoneHtml={true} // allow HTML for this page
      onConfirmDone={() => setShowConfirmDone(false)}

      responseTitle={responseTitle}
      responseMessage={responseMessage}
    />
  );
});

export default AssetImport;
