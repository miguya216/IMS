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

export const generateConsumablePDF = async (consumableID) => {
  try {
    // Get header/footer image path
    const brandingRes = await fetch("/api/User-Handlers/settings/getBrandingImage.php");
    const brandingData = await brandingRes.json();
    const headerFooterPath = brandingData.header_footer_img_path;

    // Fetch stock card records
    const res = await fetch(
      `/api/Consumable-Handlers/getStockCardRecord.php?consumable_ID=${consumableID}`
    );
    const data = await res.json();
    if (!data.success) return null;

    const { data: records } = data;
    if (!records.length) return null;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Load image as Base64
    let headerFooterImg = null;
    if (headerFooterPath) {
      headerFooterImg = await getBase64FromUrl(`/${headerFooterPath}`);
    }

    const rec = records[0];

    autoTable(doc, {
      startY: 75, 
      margin: { top: 48, bottom: 20},
      head: [["Date", "Ref ID", "Qty In", "Qty Out", "Officer", "Balance", "Remarks"]],
      body: records.map((r) => [
        r.record_date,
        r.reference_ID,
        r.quantity_in,
        r.quantity_out,
        r.officer_name || "-",
        r.balance,
        r.remarks || "-",
      ]),
      theme: "grid",
      headStyles: { fillColor: false, textColor: 0 },
      bodyStyles: { textColor: 0 },
      margin: { left: 10, right: 10 },
      styles: { fillColor: false, halign: "center", valign: "middle", fontSize: 10, lineWidth: 0.5, lineColor: [0, 0, 0] },

      // Draw background before content
      willDrawPage: () => {
        if (headerFooterImg) {
          doc.addImage(headerFooterImg, "PNG", 0, 0, pageWidth, pageHeight);
        }
      },

      // Draw title + header info after background
      didDrawPage: (dataArg) => {
        if (dataArg.pageNumber === 1) {
          const topOffset = 50;
          let yPos = topOffset;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.text("STOCK CARD REPORT", pageWidth / 2, yPos, { align: "center" });

          yPos += 10;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("Property Tag:", 10, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${rec.kld_property_tag || "-"}`, 39, yPos);

          doc.setFont("helvetica", "bold");
          doc.text("Consumable:", 128, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${rec.consumable_name || "-"}`, 156, yPos);

          yPos += 7;
          doc.setFont("helvetica", "bold");
          doc.text("Description:", 10, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${rec.description || "-"}`, 37, yPos);
        }
      },
      rowPageBreak: 'avoid',
    });

    // Export PDF
    const pdfBlob = doc.output("blob");
    return {
      url: URL.createObjectURL(pdfBlob),
      filename: `SC-Consumable-${consumableID || "Test"}.pdf`,
    };
  } catch (err) {
    console.error("Error generating Consumable PDF:", err);
    return null;
  }
};
