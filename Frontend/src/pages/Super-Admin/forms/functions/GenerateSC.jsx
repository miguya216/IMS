// src/pages/admin/functions/GenerateSC.jsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateConsumablePDF = async (consumableID) => {
  try {
    // Fetch data from PHP backend
    const res = await fetch(
      `/api/Consumable-Handlers/getStockCardRecord.php?consumable_ID=${consumableID}`
    );
    const data = await res.json();

    if (!data.success) {
      console.error("Failed to fetch stock card records:", data.error);
      return null;
    }

    const { data: records } = data;
    if (!records.length) return null;

    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("STOCK CARD REPORT", pageWidth / 2, 20, { align: "center" });

    // Header info
    const rec = records[0];
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    let yPos = 30;

    // Row 1: Property Tag (left) & Consumable (right)
    doc.setFont("times", "bold");
    doc.text(`Property Tag:`, 20, yPos);
    doc.setFont("times", "normal");
    doc.text(`${rec.kld_property_tag || "-"}`, 55, yPos);

    doc.setFont("times", "bold");
    doc.text(`Consumable:`, 130, yPos);
    doc.setFont("times", "normal");
    doc.text(`${rec.consumable_name || "-"}`, 157, yPos);

    yPos += 7;

    // Row 2: Description
    doc.setFont("times", "bold");
    doc.text(`Description:`, 20, yPos);
    doc.setFont("times", "normal");
    doc.text(`${rec.description || "-"}`, 55, yPos);

    yPos += 10;

    // Table (removed Ref Type)
    const tableHead = [
      ["Date", "Ref ID", "Qty In", "Qty Out", "Officer", "Balance", "Remarks"]
    ];

    const tableBody = records.map((r) => [
      r.record_date,
      r.reference_ID,
      r.quantity_in,
      r.quantity_out,
      r.officer_name || "-",
      r.balance,
      r.remarks || "-",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: tableHead,
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: false, textColor: 0 },
      bodyStyles: { textColor: 0 },
      margin: { left: 20, right: 20 },
      styles: {
        halign: "center",
        fontSize: 10,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
    });

    // Return PDF blob
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
