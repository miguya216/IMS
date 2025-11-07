import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper: convert image URL to Base64
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

export const generateRISPDF = async (risID) => {
  try {
    // Fetch RIS data
    const res = await fetch(`/api/RIS-Handlers/fetch_RIS_by_id.php?ris_ID=${risID}`);
    const data = await res.json();
    if (data.status !== "success") {
      console.error("Failed to fetch RIS data:", data.message);
      return null;
    }

    const header = data.header;
    const items = data.items || [];
    const consumables = data.consumables || [];

    // Fetch header/footer branding
    const brandingRes = await fetch("/api/User-Handlers/settings/getBrandingImage.php");
    const brandingData = await brandingRes.json();
    const headerFooterPath = brandingData.header_footer_img_path;

    const doc = new jsPDF({ orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Load image as Base64
    let headerFooterImg = null;
    if (headerFooterPath) {
      headerFooterImg = await getBase64FromUrl(`/${headerFooterPath}`);
    }

    // Function to draw background
    const drawBackground = () => {
      if (headerFooterImg) {
        doc.addImage(headerFooterImg, "PNG", 0, 0, pageWidth, pageHeight);
      }
    };

    // Main table data
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

    // --- Unified table head ---
    const tableHead = [
      [
        { content: "Requisition", colSpan: 4, styles: { halign: "center", fontStyle: "bold" } },
        { content: "Issuance", colSpan: 2, styles: { halign: "center", fontStyle: "bold" } },
      ],
      ["Property No.", "UOM", "Description", "Qty", "Qty", "Remarks"],
    ];

    autoTable(doc, {
      startY: 78, // shift content down to clear header area
      head: tableHead,
      body: allRows,
      theme: "grid",
      styles: {
        halign: "center",
        font: "helvetica",
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.5,
        textColor: 0,
        lineColor: 0,
      },
      headStyles: { textColor: 0, lineColor: 0, lineWidth: 0.6, fillColor: false },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 15 },
        2: { cellWidth: 72 },
        3: { cellWidth: 15 },
        4: { cellWidth: 15 },
        5: { cellWidth: 40 },
      },

      // 🪄 Background (z-index 0)
      willDrawPage: () => {
        drawBackground();
      },

      // 🪄 Foreground text (z-index 1)
      didDrawPage: (dataArg) => {
        if (dataArg.pageNumber === 1) {
          let y = 48; // start lower than before

          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.text(
            "REQUISITION AND ISSUE SLIP",
            pageWidth / 2,
            y,
            { align: "center" }
          );

          doc.setFontSize(12);
          y += 12;

          // --- Header Section ---
          doc.setFont("helvetica", "bold");
          doc.text("RIS Type:", 14, y);
          doc.text("RIS No:", 140, y);
          doc.setFont("helvetica", "normal");
          doc.text(header.ris_type || "", 35, y);
          doc.text(header.ris_no || "", 156, y);
          y += 7;

          doc.setFont("helvetica", "bold");
          doc.text("Office / Unit:", 14, y);
          doc.text("Date:", 140, y);
          doc.setFont("helvetica", "normal");
          doc.text(header.office_unit || "", 40, y);

          if (header.created_at) {
            const [year, month, day] = header.created_at.split(" ")[0].split("-");
            doc.text(`${day}/${month}/${year}`, 151, y);
          }
        }
      },
    });

    // --- Signature Table ---
    const nextY = doc.lastAutoTable.finalY + 1;
    const signHead = [
      [
        { content: "", styles: { halign: "center" } },
        { content: "Requested", styles: { halign: "center" } },
        { content: "Endorsed", styles: { halign: "center" } },
        { content: "Approved", styles: { halign: "center" } },
        { content: "Issued", styles: { halign: "center" } },
        { content: "Received", styles: { halign: "center" } },
      ],
    ];

    const signBody = [
      [{ content: "Signature", styles: { halign: "left" } }, "", "", "", "", ""],
      [{ content: "Printed Name", styles: { halign: "left" } }, "", "", "", "", ""],
      [{ content: "Institute / Unit", styles: { halign: "left" } }, "", "", "", "", ""],
      [{ content: "Designation", styles: { halign: "left" } }, "", "", "", "", ""],
      [{ content: "Date", styles: { halign: "left" } }, "", "", "", "", ""],
    ];

    autoTable(doc, {
      startY: nextY,
      head: signHead,
      body: signBody,
      styles: {
        font: "helvetica",
        fontSize: 9,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: "center",
        valign: "middle"
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      theme: "grid",
    });

    // Output as Blob
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
