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

export const generateTransferPDFPreview = async (
  fromUser,
  toUser,
  assets,
  transferTypes,
  selectedTransferType,
  ptrNo = "" // optional
) => {
  try {
    // Fetch header/footer image
    const brandingRes = await fetch("/api/User-Handlers/settings/getBrandingImage.php");
    const brandingData = await brandingRes.json();
    const headerFooterPath = brandingData.header_footer_img_path;

    // Create jsPDF doc
    const doc = new jsPDF({ orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Load image as Base64
    let headerFooterImg = null;
    if (headerFooterPath) {
      headerFooterImg = await getBase64FromUrl(`/${headerFooterPath}`);
    }

    // Precompute table data
    const tableData = assets.map((a) => [
      a.date_acquired,
      a.kld_property_tag,
      a.description,
      transferTypes.find((t) => t.transfer_type_ID === parseInt(selectedTransferType))?.transfer_type_name || "",
      a.condition_name,
    ]);

    // Apply background + content layering
    autoTable(doc, {
      startY: 70,
      head: [["Date Acquired", "Property No.", "Description", "Transfer Type", "Condition"]],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.4,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
        halign: "center",
        valign: "middle"
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },

      // Draw header/footer background first
      willDrawPage: () => {
        if (headerFooterImg) {
          doc.addImage(headerFooterImg, "PNG", 0, 0, pageWidth, pageHeight);
        }
      },

      // Draw text afterward
      didDrawPage: (dataArg) => {
        const topOffset = 45; // push content down from top header image
        let yPos = topOffset;

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("PROPERTY TRANSFER REPORT", pageWidth / 2, yPos, { align: "center" });

        yPos += 10;
        const leftX = 14;
        const rightX = 120;
        const ptrvalueGap = 18;
        const valueGap = 35;

        doc.setFontSize(12).setTextColor(0, 0, 0);

        // Left column
        doc.setFont("helvetica", "bold");
        doc.text("From Accountable:", leftX, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(fromUser || "-", leftX + 39, yPos);

        if (ptrNo) {
          doc.setFont("helvetica", "bold");
          doc.text("PTR No:", rightX, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(ptrNo, rightX + ptrvalueGap, yPos);
        }

        yPos += 8;
        doc.setFont("helvetica", "bold");
        doc.text("To Accountable:", leftX, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(toUser || "-", leftX + 34, yPos);

        doc.setFont("helvetica", "bold");
        doc.text("Date Transferred:", rightX, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(new Date().toLocaleDateString(), rightX + valueGap, yPos);
      },
    });

    // Output PDF blob
    const pdfBlob = doc.output("blob");
    return URL.createObjectURL(pdfBlob);
  } catch (err) {
    console.error("Error generating Transfer PDF:", err);
    return null;
  }
};
