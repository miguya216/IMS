import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getBase64FromUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generateAssetPDF = async (assetID) => {
  try {
    // Get header/footer image path
    const brandingRes = await fetch("/api/User-Handlers/settings/getBrandingImage.php");
    const brandingData = await brandingRes.json();
    const headerFooterPath = brandingData.header_footer_img_path;

    // Fetch property card records
    const response = await fetch(`/api/Assets-Handlers/getPropertyCardRecords.php?asset_ID=${assetID}`);
    if (!response.ok) throw new Error("Failed to fetch property card records");
    const data = await response.json();
    if (!data.length) return null;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Load image as Base64
    let headerFooterImg = null;
    if (headerFooterPath) {
      headerFooterImg = await getBase64FromUrl(`/${headerFooterPath}`);
    }

    // Asset Info
    const assetInfo = data[0];
    const tableColumn = ["Date", "Reference ID", "Officer", "Room", "Price", "Remarks"];
    const tableRows = data.map((record) => [
      record.record_date,
      record.reference_ID,
      record.officer_name || "N/A",
      record.room_number || "N/A",
      record.price_amount,
      record.remarks || "-",
    ]);

    autoTable(doc, {
      startY: 80,
      margin: { top: 48, bottom: 20 },
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: false, textColor: 0 },
      bodyStyles: { textColor: 0 },
      margin: { left: 10, right: 10 },
      styles: { fillColor: false, halign: "center", valign: "middle", fontSize: 10, lineWidth: 0.5, lineColor: [0, 0, 0] },

      // Draw image BEFORE content (background)
      willDrawPage: () => {
        if (headerFooterImg) {
          doc.addImage(headerFooterImg, "PNG", 0, 0, pageWidth, pageHeight);
        }
      },

      // Draw text AFTER background (foreground)
      didDrawPage: (dataArg) => {
        if (dataArg.pageNumber === 1) {
          // Adjust Y starting point
          const topOffset = 50; // shift everything down 45px
          let yPos = topOffset;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.text("PROPERTY CARD", pageWidth / 2, yPos, { align: "center" });

          doc.setFontSize(12);
          yPos += 10;

          doc.setFont("helvetica", "bold");
          doc.text("KLD Property Tag:", 10, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${assetInfo.kld_property_tag}`, 48, yPos);

          doc.setFont("helvetica", "bold");
          doc.text("Unit:", 128, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${assetInfo.unit_name}`, 138, yPos);

          yPos += 7;
          doc.setFont("helvetica", "bold");
          doc.text("Asset Classification:", 10, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${assetInfo.asset_classification || ""}`, 52, yPos);

          doc.setFont("helvetica", "bold");
          doc.text("Accounted to:", 128, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${assetInfo.responsible_user}`, 157, yPos);

          yPos += 7;
          doc.setFont("helvetica", "bold");
          doc.text("Description:", 10, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(
            `${assetInfo.asset_type || ""}${assetInfo.brand_name ? " - " + assetInfo.brand_name : ""}`,
            35,
            yPos
          );
        }
      },
      rowPageBreak: 'avoid',

    });

    // Export
    const pdfBlob = doc.output("blob");
    return {
      url: URL.createObjectURL(pdfBlob),
      filename: `PC-Asset-${assetID || "Test"}.pdf`,
    };
  } catch (err) {
    console.error("Error generating Asset PDF:", err);
    return null;
  }
};
