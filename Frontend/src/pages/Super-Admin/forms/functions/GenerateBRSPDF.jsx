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

export const generateBRSPDF = async (brsID) => {
  try {
    // Get header/footer image path
    const brandingRes = await fetch("/api/User-Handlers/settings/getBrandingImage.php");
    const brandingData = await brandingRes.json();
    const headerFooterPath = brandingData.header_footer_img_path;

    // Fetch BRS data
    const res = await fetch(`/api/Reservation-Borrowing-Handlers/fetch_brs_by_id.php?brs_ID=${brsID}`);
    const data = await res.json();

    if (!data.success) {
      console.error("Failed to fetch BRS data:", data.error);
      return null;
    }

    const header = data.reservation || {};
    const items = data.assets || [];

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Load header/footer image
    let headerFooterImg = null;
    if (headerFooterPath) {
      headerFooterImg = await getBase64FromUrl(`/${headerFooterPath}`);
    }

    // --- Utility Functions ---
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const datePart = dateString.split(" ")[0];
      const [year, month, day] = datePart.split("-");
      return `${day}/${month}/${year}`;
    };

    const drawLabelValue = (label, value, x, y, maxWidth = 70) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, x, y);
      const labelEndX = x + doc.getTextWidth(label) + 2;
      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(value || "", maxWidth);
      doc.text(splitText, labelEndX, y);
      return splitText.length;
    };

    // Background layer (z-index 0)
    const drawBackground = () => {
      if (!headerFooterImg) return;
      // draw image now on current page (this will be underneath any later drawings)
      doc.addImage(headerFooterImg, "PNG", 0, 0, pageWidth, pageHeight);
    };

     // --- OVERRIDE addPage so every time a new page is created we draw the bg first ---
    const originalAddPage = doc.addPage.bind(doc);
    doc.addPage = (...args) => {
      originalAddPage(...args);
      // draw background immediately on the newly created page
      drawBackground();
      return doc;
    };

    // Draw background on FIRST PAGE before anything else
    drawBackground();

    // --- Table and content ---
    // const checkBoxImg = new Image();
    // checkBoxImg.src = "/resources/imgs/check-box.png";
    // await new Promise((resolve) => (checkBoxImg.onload = resolve));
    const checkBoxImg = await getBase64FromUrl("/resources/imgs/check-box.png");

    autoTable(doc, {
      startY: 97, // pushed down for header
      margin: { top: 48, bottom: 20},
      head: [
        [
          { content: "Asset for Reservation / Borrowing", colSpan: 3, styles: { halign: "center", valign: "middle" } },
          { content: "Availability", colSpan: 2, styles: { halign: "center", valign: "middle" } },
          { content: "Issuance", colSpan: 3, styles: { halign: "center", valign: "middle" } },
        ],
        [
          { content: "Description", styles: { halign: "center" } },
          { content: "UOM", styles: { halign: "center" } },
          { content: "QTY", styles: { halign: "center" } },
          { content: "Yes", styles: { halign: "center" } },
          { content: "No", styles: { halign: "center" } },
          { content: "QTY", styles: { halign: "center" } },
          { content: "Borrow Remarks", styles: { halign: "center" } },
          { content: "Return Remarks", styles: { halign: "center" } },
        ],
      ],
      body: items.map((item) => [
        `${item.asset_type || ""} - ${item.brand_name || ""}`,
        item.UOM_brs || "",
        item.qty_brs || "",
        item.is_available === "yes" ? "img-yes" : "",
        item.is_available === "no" ? "img-no" : "",
        item.qty_issuance ?? "",
        item.borrow_asset_remarks || "",
        item.return_asset_remarks || "",
      ]),
      styles: {
        fillColor: false,
        font: "helvetica",
        fontSize: 9,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: false,
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      theme: "grid",

      // Foreground text
      didDrawPage: (dataArg) => {
        if (dataArg.pageNumber === 1) {
          const topOffset = 50; // shift down
          let y = topOffset;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.text("ASSET RESERVATION AND BORROWING FORM", pageWidth / 2, y, { align: "center" });

          doc.setFontSize(10);
          y += 10;

          // Borrower Info (Left)
          drawLabelValue("Borrower’s Name :", header.full_name || "", 15, y);
          y += 6;
          drawLabelValue("Institute/Unit :", header.unit_name || "", 15, y);
          y += 6;
          const linesUsed = drawLabelValue("Purpose :", header.purpose || "", 15, y, 120);
          y += linesUsed * 5.5;

          // BRS Info (Right)
          let yRight = topOffset + 10;
          drawLabelValue("BRS No :", header.brs_no || "", 135, yRight);
          yRight += 6;
          drawLabelValue("Date Requested :", formatDate(header.created_at), 135, yRight);
          yRight += 6;
          drawLabelValue("Date of Use :", formatDate(header.date_of_use), 135, yRight);
          yRight += 6;
          drawLabelValue("Time of Use :", header.time_of_use || "", 135, yRight);
          yRight += 6;
          drawLabelValue("Date of Return :", formatDate(header.date_of_return), 135, yRight);
          yRight += 6;
          drawLabelValue("Time of Return :", header.time_of_return || "", 135, yRight);
        }
      },

      willDrawCell: (data) => {
        if (data.cell.raw === "img-yes" || data.cell.raw === "img-no") {
          data.cell.text = [];
        }
      },
      didDrawCell: (data) => {
        if (data.cell.raw === "img-yes" || data.cell.raw === "img-no") {
          const cellWidth = data.cell.width;
          const cellHeight = data.cell.height;
          const imgSize = 4;
          const x = data.cell.x + (cellWidth - imgSize) / 2;
          const y = data.cell.y + (cellHeight - imgSize) / 2;
          doc.addImage(checkBoxImg, "PNG", x, y, imgSize, imgSize);
        }
      },
    });

    // --- Signature Table ---
    const nextY = doc.lastAutoTable.finalY + 3;
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
      margin: { top: 48, bottom: 20},
      head: signHead,
      body: signBody,
      theme: "grid",
      styles: {
        fillColor: false,
        font: "helvetica",
        fontSize: 9,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: false,
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });

    // --- Terms & Conditions ---
    const finalY = doc.lastAutoTable.finalY + 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const terms = [
      "Item/s above is/are accepted by me with the distinct understanding of the following:",
      "1. This is a property of Kolehiyo ng Lungsod ng Dasmariñas.",
      "2. I shall be accountable for any loss or damage of this item.",
      "3. I shall return the property in the date stated above.",
      "4. This is a shared unit and I have to report any damage immediately, otherwise I will be held liable.",
    ];
    let textY = finalY;
    terms.forEach((line) => {
      doc.text(line, 15, textY);
      textY += 5;
    });

    // Export
    const pdfBlob = doc.output("blob");
    return {
      url: URL.createObjectURL(pdfBlob),
      filename: `${header.brs_no || "BRS"}.pdf`,
    };
  } catch (err) {
    console.error("Error generating BRS PDF:", err);
    return null;
  }
};
