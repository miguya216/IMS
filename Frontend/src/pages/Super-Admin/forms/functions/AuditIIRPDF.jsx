// src/pages/admin/forms/functions/AuditIIRPDF.jsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const AuditIIRPDF = async (iir_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch IIR data by ID
      const res = await fetch(
        `/api/Inventory-Inspection-Hanlders/fetch_iir_by_id.php?iir_id=${iir_id}`
      );
      const data = await res.json();

      if (!data.iir) {
        console.error("Failed to fetch IIR data:", data.error || "Unknown error");
        reject("Missing IIR data");
        return;
      }

      const header = data.iir;
      const assets = data.assets || [];

      // Initialize PDF
      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

      // ===== Title =====
      doc.setFontSize(16);
      doc.setFont("times", "bold");
      doc.text(
        "INVENTORY & INSPECTION REPORT",
        doc.internal.pageSize.getWidth() / 2,
        30,
        { align: "center" }
      );

      // ===== Header info =====
      doc.setFontSize(10);

      doc.setFont("times", "bold").text("Employee Name:", 40, 60);
      doc.setFont("times", "normal").text(header.officer_name || "", 118, 60);

      doc.setFont("times", "bold").text("Office / Unit:", 40, 80);
      doc.setFont("times", "normal").text(header.unit || "", 101, 80);

      doc.setFont("times", "bold").text("Role:", doc.internal.pageSize.getWidth() - 180, 60);
      doc.setFont("times", "normal").text(header.role || "", doc.internal.pageSize.getWidth() - 145, 60);

      doc.setFont("times", "bold").text("Room:", doc.internal.pageSize.getWidth() - 180, 80);
      doc.setFont("times", "normal").text(header.room_no || "", doc.internal.pageSize.getWidth() - 145, 80);

      // ===== Table header =====
      const head = [
        [
          { content: "Inventory", colSpan: 10, styles: { halign: "center", valign: "middle" } },
          { content: "Inspection & Disposal", colSpan: 5, styles: { halign: "center", valign: "middle" } }
        ],
        [
          { content: "Date Acquired", styles: { halign: "center", valign: "middle" } },
          { content: "Description", styles: { halign: "center", valign: "middle" } },
          { content: "Property No.", styles: { halign: "center", valign: "middle" } },
          { content: "Qty", styles: { halign: "center", valign: "middle" } },
          { content: "Unit Cost", styles: { halign: "center", valign: "middle" } },
          { content: "Total Cost", styles: { halign: "center", valign: "middle" } },
          { content: "Accumulated Depreciation", styles: { halign: "center", valign: "middle" } },
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

      // ===== Table body =====
      const body = assets.map(a => [
        a.date_acquired || "",
        `${a.asset_type || ""} / ${a.brand_name || ""}`,
        a.kld_property_tag || "",
        a.quantity || 0,
        a.unit_cost || 0,
        a.total_cost || 0,
        a.accumulated_depreciation || 0,
        a.accumulated_impairment_losses || 0,
        a.carrying_amount || 0,
        a.condition_name || "",
        a.sale || 0,
        a.transfer || 0,
        a.disposal || 0,
        a.damage || 0,
        a.others || ""
      ]);

      autoTable(doc, {
        startY: 100,
        head,
        body,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          halign: "center",
          textColor: [0, 0, 0],
        },
        theme: "grid",
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: 0,
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },
        margin: { top: 90, left: 30, right: 15, bottom: 20 }, // 🔹 tightened margins
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

      // ===== Return blob URL & filename =====
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const filename = `InventoryInspectionReport_${header.officer_name}_${header.room_no}.pdf`;

      resolve({ url: pdfUrl, filename });
    } catch (err) {
      console.error("Error generating IIR PDF:", err);
      reject(err);
    }
  });
};
