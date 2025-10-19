import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateAssetPDF = async (assetID) => {
  try {
    const response = await fetch(`/api/Assets-Handlers/getPropertyCardRecords.php?asset_ID=${assetID}`);
    if (!response.ok) throw new Error("Failed to fetch property card records");

    const data = await response.json();
    if (!data.length) return null;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("times", "bold");

    // Centered Title
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text("PROPERTY CARD", pageWidth / 2, 20, { align: "center" });

    // Asset info header
    const assetInfo = data[0];
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    let yPos = 30;

    // Row 1: KLD Property Tag & Unit
    doc.setFont("times", "bold");
    doc.text(`KLD Property Tag:`, 20, yPos);
    doc.setFont("times", "normal");
    doc.text(`${assetInfo.kld_property_tag}`, 58, yPos);

    doc.setFont("times", "bold");
    doc.text(`Unit:`, 130, yPos);
    doc.setFont("times", "normal");
    doc.text(`${assetInfo.unit_name}`, 141, yPos);

    yPos += 7;

    // Row 2: Asset Type & Responsible User
    doc.setFont("times", "bold");
    doc.text(`Asset Type:`, 20, yPos);
    doc.setFont("times", "normal");
    doc.text(`${assetInfo.asset_type}`, 43, yPos);

    doc.setFont("times", "bold");
    doc.text(`Accounted to:`, 130, yPos);
    doc.setFont("times", "normal");
    doc.text(`${assetInfo.responsible_user}`, 157, yPos);

    yPos += 7;

    // Row 3: Brand
    doc.setFont("times", "bold");
    doc.text(`Brand:`, 20, yPos);
    doc.setFont("times", "normal");
    doc.text(`${assetInfo.brand_name}`, 35, yPos);

    yPos += 10;

    // Table (Removed Reference Type, thicker grid, centered)
    const tableColumn = ["Date", "Reference ID", "Officer", "Price", "Remarks"];
    const tableRows = data.map((record) => [
      record.record_date,
      record.reference_ID,
      record.officer_name || "N/A",
      record.price_amount,
      record.remarks || "-",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: false, textColor: 0 }, // no shading
      bodyStyles: { textColor: 0 }, // black text
      margin: { left: 20, right: 20 },
      tableWidth: "wrap",
      tableWidth: "auto",
      styles: { halign: "center", fontSize: 10, lineWidth: 0.5, lineColor: [0, 0, 0] }, 
    });

    const pdfBlob = doc.output("blob");
    return { url: URL.createObjectURL(pdfBlob), filename: `PC-Asset-${assetID || "Test"}.pdf` };
  } catch (err) {
    console.error("Error generating Asset PDF:", err);
    return null;
  }
};
