import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateIIRPDF = async ({ employeeName, role, room, unit, assets, reportDate }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

      // Utility: Format number with commas and two decimals
      const formatNumber = (num) => {
        const n = parseFloat(num);
        return isNaN(n) ? "0.00" : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };

      // ===== Title =====
      doc.setFontSize(16);
      doc.setFont("times", "bold");
      doc.text("INVENTORY & INSPECTION REPORT", doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });

      // ===== Top info =====
      doc.setFontSize(10);
      doc.setFont("times", "bold").text("Employee Name:", 40, 60);
      doc.setFont("times", "normal").text(employeeName, 118, 60);

      doc.setFont("times", "bold").text("Office / Unit:", 40, 80);
      doc.setFont("times", "normal").text(unit, 101, 80);

      doc.setFont("times", "bold").text("Role:", doc.internal.pageSize.getWidth() - 180, 60);
      doc.setFont("times", "normal").text(role, doc.internal.pageSize.getWidth() - 155, 60);

      doc.setFont("times", "bold").text("Room:", doc.internal.pageSize.getWidth() - 180, 80);
      doc.setFont("times", "normal").text(room, doc.internal.pageSize.getWidth() - 150, 80);

      doc.setFont("times", "bold").text("Date:", 40, 100);
      doc.setFont("times", "normal").text(reportDate, 65, 100);

      // ===== Table header =====
      const head = [
        [
          { content: "Inventory", colSpan: 10, styles: { halign: "center", valign: "middle" } },
          { content: "Inspection & Disposal", colSpan: 5, styles: { halign: "center", valign: "middle" } },
        ],
        [
          { content: "Date Acquired", styles: { halign: "center" } },
          { content: "Description", styles: { halign: "center" } },
          { content: "Property No.", styles: { halign: "center" } },
          { content: "Qty", styles: { halign: "center" } },
          { content: "Unit Cost", styles: { halign: "center" } },
          { content: "Total Cost", styles: { halign: "center" } },
          { content: "Accumulated Depreciation", styles: { halign: "center" } },
          { content: "Accumulated Impairment Losses", styles: { halign: "center" } },
          { content: "Carrying Amount", styles: { halign: "center" } },
          { content: "Condition / Remarks", styles: { halign: "center" } },
          { content: "Sale", styles: { halign: "center" } },
          { content: "Transfer", styles: { halign: "center" } },
          { content: "Disposal", styles: { halign: "center" } },
          { content: "Damage", styles: { halign: "center" } },
          { content: "Others", styles: { halign: "center" } },
        ],
      ];

      // ===== Table body =====
      const body = assets.map((a) => [
        a.date_acquired || "",
        `${a.asset_type || ""} / ${a.brand_name || ""}`,
        a.kld_property_tag || "",
        formatNumber(a.quantity || 0),
        formatNumber(a.unitCostInput || 0),
        formatNumber(a.totalCostInput || 0),
        formatNumber(a.accumulatedDepreciation || 0),
        formatNumber(a.accumulatedImpairment || 0),
        formatNumber(a.carryingAmount || 0),
        a.conditionName || "",
        formatNumber(a.sale || 0),
        formatNumber(a.transfer || 0),
        formatNumber(a.disposal || 0),
        formatNumber(a.damage || 0),
        a.others || "",
      ]);

      autoTable(doc, {
        startY: 120,
        head,
        body,
        styles: {
          fillColor: false,
          fontSize: 8,
          cellPadding: 2,
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          halign: "center",
          textColor: [0, 0, 0],
        },
        theme: "grid",
        headStyles: {
          fillColor: false,
          textColor: 0,
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },
        margin: { bottom: 15, left: 30},
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
        },
        rowPageBreak: 'avoid',
      });

       // ===== Signatory Section =====
      let finalY = doc.lastAutoTable.finalY || 120;
      const signatoryHeight = 180;
      const pageHeight = doc.internal.pageSize.getHeight();

      // Check if the signatory section fits on the current page
      if (finalY + signatoryHeight > pageHeight - 15) {
        doc.addPage(); // Add a new page if not enough space
        finalY = 30;   // Start from top margin
      }

      const tableX = 30;
      const totalWidth = doc.internal.pageSize.getWidth() - 62; // left + right margins
      const leftWidth = totalWidth * (10 / 15);
      const rightWidth = totalWidth * (5 / 15);

      // Draw the boxes
      doc.setLineWidth(0.5);
      doc.rect(tableX, finalY, leftWidth, signatoryHeight);
      doc.rect(tableX + leftWidth, finalY, rightWidth, signatoryHeight);


      // Left column content
      let y = finalY + 20;
      doc.setFont("times", "normal").setFontSize(9);
      const leftText = "I HEREBY request inspection and disposition, pursuant to Section 79 of PD 1445, of the property enumerated above.";
      doc.text(leftText, tableX + 10, y, { maxWidth: leftWidth - 20, align: "left" });

      y += 40;
      doc.text("Requested by:", tableX + 10, y);
      y += 35;
      doc.line(tableX + 10, y, tableX + leftWidth / 2 - 20, y);
      doc.text("(Signature over Printed Name of Accountable Officer)", tableX + 10, y + 12);
      doc.line(tableX + 10, y + 25, tableX + leftWidth / 2 - 20, y + 25);
      doc.text("(Designation of Accountable Officer)", tableX + 10, y + 37);

      y += 65;
      doc.text("Approved by:", tableX + leftWidth / 2 + 10, finalY + 60);
      doc.line(tableX + leftWidth / 2 + 10, finalY + 95, tableX + leftWidth - 20, finalY + 95);
      doc.text("(Signature over Printed Name of)", tableX + leftWidth / 2 + 10, finalY + 108);
      doc.line(tableX + leftWidth / 2 + 10, finalY + 122, tableX + leftWidth - 20, finalY + 122);
      doc.text("(Designation of Authorized Official)", tableX + leftWidth / 2 + 10, finalY + 135);

      // Right column content
      let xRight = tableX + leftWidth + 10;
      y = finalY + 20;

      const rightTop = "I CERTIFY that I have inspected each and every article enumerated in this report, and that the disposition made thereof was, in my judgment, the best for the public interest.";
      doc.text(rightTop, xRight, y, { maxWidth: rightWidth - 20, align: "left" });
      y += 48;
      doc.line(xRight, y, xRight + rightWidth - 20, y);
      doc.text("(Signature over Printed Name of Inspection Officer)", xRight, y + 12);

      y += 45;
      const rightBottom = "I CERTIFY that I have witnessed the disposition of the articles enumerated on this report this ____ day of _______________, ____.";
      doc.text(rightBottom, xRight, y, { maxWidth: rightWidth - 20, align: "left" });
      y += 45;
      doc.line(xRight, y, xRight + rightWidth - 20, y);
      doc.text("(Signature over Printed Name of Witness)", xRight, y + 12);

      // ===== Export PDF =====
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