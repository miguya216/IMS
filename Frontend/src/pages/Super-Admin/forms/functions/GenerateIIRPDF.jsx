import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateIIRPDF = async ({ employeeName, role, room, unit, assets }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

      // Title
      doc.setFontSize(16);
      doc.setFont("times", "bold");
      doc.text(
        "INVENTORY & INSPECTION REPORT",
        doc.internal.pageSize.getWidth() / 2,
        30,
        { align: "center" }
      );

      // Top info
      doc.setFontSize(10);
      doc.setFont("times", "bold").text("Employee Name:", 40, 60);
      doc.setFont("times", "normal").text(employeeName, 118, 60);

      doc.setFont("times", "bold").text("Office / Unit:", 40, 80);
      doc.setFont("times", "normal").text(unit, 101, 80);

      doc.setFont("times", "bold").text("Role:", doc.internal.pageSize.getWidth() - 180, 60);
      doc.setFont("times", "normal").text(role, doc.internal.pageSize.getWidth() - 145, 60);

      doc.setFont("times", "bold").text("Room:", doc.internal.pageSize.getWidth() - 180, 80);
      doc.setFont("times", "normal").text(room, doc.internal.pageSize.getWidth() - 145, 80);

// Table header
const head = [
  [
    { content: "Inventory", colSpan: 10, styles: { halign: "center", valign: "middle" } }, // 🔹 colSpan +1
    { content: "Inspection & Disposal", colSpan: 5, styles: { halign: "center", valign: "middle" } }
  ],
  [
    { content: "Date Acquired", styles: { halign: "center", valign: "middle" } },
    { content: "Description", styles: { halign: "center", valign: "middle" } },
    { content: "Property No.", styles: { halign: "center", valign: "middle" } },
    { content: "Qty", styles: { halign: "center", valign: "middle" } },
    { content: "Unit Cost", styles: { halign: "center", valign: "middle" } },
    { content: "Total Cost", styles: { halign: "center", valign: "middle" } },
    { content: "Accumulated Depreciation", styles: { halign: "center", valign: "middle" } }, // 🔹 added
    { content: "Accumulated Impairment Losses", styles: { halign: "center", valign: "middle" } },
    { content: "Carrying Amount", styles: { halign: "center", valign: "middle" } },
    { content: "Condition / Remarks", styles: { halign: "center", valign: "middle" } },
    { content: "Sale", styles: { halign: "center", valign: "middle" } },
    { content: "Transfer", styles: { halign: "center", valign: "middle" } },
    { content: "Disposal", styles: { halign: "center", valign: "middle" } },
    { content: "Damage", styles: { halign: "center", valign: "middle" } },
    { content: "Others", styles: { halign: "center", valign: "middle" } },
  ]
];

// Table body
const body = assets.map(a => [
  a.date_acquired || "",
  `${a.asset_type || ""} / ${a.brand_name || ""}`,
  a.kld_property_tag || "",
  a.quantity || 0,
  a.unitCostInput || 0,
  a.totalCostInput || 0,
  a.accumulatedDepreciation || 0,   // 🔹 now included
  a.accumulatedImpairment || 0,
  a.carryingAmount || 0,
  a.conditionName || "",
  a.sale || 0,
  a.transfer || 0,
  a.disposal || 0,
  a.damage || 0,
  a.others || ""
]);

autoTable(doc, {
  startY: 100,
  head: head,
  body: body,
  styles: {
    fontSize: 8,
    cellPadding: 2,
    lineWidth: 0.5,
    lineColor: [0, 0, 0],
    halign: "center",
    textColor: [0, 0, 0]
  },
  theme: "grid",
  headStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.5,
    lineColor: [0, 0, 0]
  },
  margin: { top: 90, left: 30, right: 15, bottom: 20 }, // tighter margins
  tableWidth: "auto", 
  columnStyles: {
    0: { cellWidth: 60 },
    1: { cellWidth: 110 },
    2: { cellWidth: 60 },
    3: { cellWidth: 25 },
    4: { cellWidth: 45 },
    5: { cellWidth: 45 },
    6: { cellWidth: 60 },
    7: { cellWidth: 60 },
    8: { cellWidth: 55 },
    9: { cellWidth: 55 },
    10: { cellWidth: 35 },
    11: { cellWidth: 35 },
    12: { cellWidth: 45 },
    13: { cellWidth: 45 },
    14: { cellWidth: 45 },
  }
});



      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const filename = `InventoryInspectionReport_${employeeName}_${room}.pdf`;

      resolve({ url: pdfUrl, filename });
    } catch (err) {
      console.error("Error generating PDF:", err);
      reject(err);
    }
  });
};
