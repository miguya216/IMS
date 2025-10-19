import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateTransferPDFPreview = (
  fromUser,
  toUser,
  assets,
  transferTypes,
  selectedTransferType,
  ptrNo = "" // optional
) => {
  const doc = new jsPDF({ orientation: "portrait" });
  doc.setFontSize(16).setFont("times", "bold");

  // Title
  doc.text(
    "PROPERTY TRANSFER REPORT",
    doc.internal.pageSize.getWidth() / 2,
    20,
    { align: "center" }
  );

  // Column positions
  const leftX = 14;
  const rightX = 120;
  const ptrvalueGap = 18;
  const valueGap = 35;
  let yLeft = 32; // start point for left column

  doc.setFontSize(12).setTextColor(0, 0, 0); // ensure black text

  // Left column
  doc.setFont("times", "bold").text("From Accountable:", leftX, yLeft);
  doc.setFont("times", "normal").text(fromUser, leftX + 38, yLeft);

  // Align PTR No to same y as From Accountable
  if (ptrNo) {
    doc.setFont("times", "bold").text("PTR No:", rightX, yLeft);
    doc.setFont("times", "normal").text(ptrNo, rightX + ptrvalueGap, yLeft);
  }

  yLeft += 8;
  doc.setFont("times", "bold").text("To Accountable:", leftX, yLeft);
  doc.setFont("times", "normal").text(toUser, leftX + 33, yLeft);

  // Align Date Transferred to same y as To Accountable
  doc.setFont("times", "bold").text("Date Transferred:", rightX, yLeft);
  doc
    .setFont("times", "normal")
    .text(new Date().toLocaleDateString(), rightX + valueGap, yLeft);

  // Table below header
  const tableData = assets.map((a) => [
    a.date_acquired,
    a.kld_property_tag,
    a.description,
    transferTypes.find(
      (t) => t.transfer_type_ID === parseInt(selectedTransferType)
    )?.transfer_type_name,
    a.condition_name,
  ]);

  autoTable(doc, {
    head: [
      [
        "Date Acquired",
        "Property No.",
        "Description",
        "Transfer Type",
        "Condition",
      ],
    ],
    body: tableData,
    startY: 50, // pushed down after header section
    tableWidth: "wrap",
    tableWidth: "auto",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineWidth: 0.5, // thicker grid
      lineColor: [0, 0, 0], // black borders
      halign: "center", // center-align all content
      textColor: [0, 0, 0], // black font
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineWidth: 0.5, // thicker header grid
      lineColor: [0, 0, 0],
      halign: "center", // header text centered
    },
    theme: "grid",
  });

  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
};
