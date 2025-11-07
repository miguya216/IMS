// src/pages/admin/forms/functions/ConsumableImport.jsx
import React, { useImperativeHandle, forwardRef, useState } from "react";
import Popups from "/src/components/Popups.jsx";

const ConsumableImport = forwardRef(({ onImportSuccess }, ref) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showConfirmDone, setShowConfirmDone] = useState(false);
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
          "/api/Consumable-Handlers/import_consumable_csv.php",
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
          setResponseMessage(formattedMessage);

          // refresh parent
          if (typeof onImportSuccess === "function") {
            onImportSuccess();
          }
        } else {
          setResponseMessage("Import failed:<br>" + (result.summary || result.message));
        }

        setShowConfirmDone(true);
      } catch (error) {
        setShowLoading(false);
        console.error("Error uploading file:", error);
        setResponseMessage("An error occurred during import.");
        setShowConfirmDone(true);
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
      confirmDoneHtml={true}
      onConfirmDone={() => setShowConfirmDone(false)}
    />
  );
});

export default ConsumableImport;
