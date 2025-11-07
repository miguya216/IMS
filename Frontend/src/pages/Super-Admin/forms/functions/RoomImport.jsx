import React, { useImperativeHandle, forwardRef, useState } from "react";
import Popups from "/src/components/Popups.jsx";

const RoomImport = forwardRef(({ onImportSuccess }, ref) => {
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
        const response = await fetch("/api/Room-Handlers/import_room.php", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        setShowLoading(false);

        if (response.ok && result.status === "success") {
          setResponseMessage(result.message || "Rooms imported successfully.");

          // 🔹 Refresh parent table after successful import
          if (typeof onImportSuccess === "function") {
            onImportSuccess();
          }
        } else {
          setResponseMessage(
            "Import failed:<br>" + (result.message || "Unknown error")
          );
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

export default RoomImport;
