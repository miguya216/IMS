import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateRISPDF = async (risID) => {
  try {
    const res = await fetch(`/api/RIS-Handlers/fetch_RIS_by_id.php?ris_ID=${risID}`);
    const data = await res.json();

    if (data.status !== "success") {
      console.error("Failed to fetch RIS data:", data.message);
      return null;
    }

    const header = data.header;
    const items = data.items || [];
    const consumables = data.consumables || [];

    const doc = new jsPDF({ orientation: "portrait" });
    doc.setFontSize(16);

    // Title
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(
      "REQUISITION AND ISSUE SLIP",
      doc.internal.pageSize.getWidth() / 2,
      15,
      { align: "center" }
    );
    doc.setFontSize(12); // reset font size after title

    let y = 25; // moved down to avoid overlap with title

    // Header Section
    doc.setFont("times", "bold");
    doc.text("RIS Type:", 14, y);
    doc.text("RIS No:", 140, y);

    doc.setFont("times", "normal");
    doc.text(header.ris_type, 34, y);
    doc.text(header.ris_no, 156, y);
    y += 7;

    doc.setFont("times", "bold");
    doc.text("Office / Unit:", 14, y);
    doc.setFont("times", "normal");
    doc.text(header.office_unit, 39, y);
    y += 8;

    // ---------- Unified Table (Assets + Consumables) ----------
    const allRows = [
      ...items.map((item) => [
        item.asset_property_no || "",
        item.UOM || "",
        item.asset_description || "",
        item.quantity_requisition,
        item.quantity_issuance || "",
        item.ris_remarks || "",
      ]),
      ...consumables.map((c) => [
        c.kld_property_tag || "",
        c.UOM || "",
        `${c.consumable_name}${c.consumable_description ? " - " + c.consumable_description : ""}`,
        c.quantity_requisition,
        c.quantity_issuance ?? "",
        c.ris_remarks || "",
      ]),
    ];

    if (allRows.length > 0) {
      const tableHead = [
        [
          { content: "Requisition", colSpan: 4, styles: { halign: "center", fontStyle: "bold" } },
          { content: "Issuance", colSpan: 2, styles: { halign: "center", fontStyle: "bold" } },
        ],
        ["Property No.", "UOM", "Description", "Quantity", "Quantity", "Remarks"],
      ];

      autoTable(doc, {
        head: tableHead,
        body: allRows,
        startY: y,
        styles: {
          halign: "center",
          font: "times",
          fontSize: 9,
          cellPadding: 3,
          lineWidth: 0.6,
          textColor: 0,
          lineColor: 0,
        },
        headStyles: { textColor: 0, lineColor: 0, lineWidth: 0.6, fillColor: false },
        theme: "grid",
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 15 },
          2: { cellWidth: 60 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 40 },
        },
      });
    }

    const pdfBlob = doc.output("blob");
    return {
      url: URL.createObjectURL(pdfBlob),
      filename: `${header.ris_no}.pdf`,
    };
  } catch (err) {
    console.error("Error generating RIS PDF:", err);
    return null;
  }
};
