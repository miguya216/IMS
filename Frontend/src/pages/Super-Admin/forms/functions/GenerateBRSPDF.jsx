import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateBRSPDF = async (brsID) => {
  try {
    const res = await fetch(`/api/Reservation-Borrowing-Handlers/fetch_brs_by_id.php?brs_ID=${brsID}`);
    const data = await res.json();

    if (!data.success) {
      console.error("Failed to fetch BRS data:", data.error);
      return null;
    }

    const header = data.reservation || {};
    const items = data.assets || [];

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "normal");

    // --- Title ---
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("ASSET RESERVATION AND BORROWING FORM", 105, 15, { align: "center" });

    doc.setFontSize(10);

    function formatDate(dateString) {
      if (!dateString) return "";
      const datePart = dateString.split(" ")[0]; // in case it includes time
      const [year, month, day] = datePart.split("-");
      return `${day}/${month}/${year}`;
    }

    function drawLabelValue(label, value, x, y, maxWidth = 70) {
      doc.setFont("times", "bold");
      doc.text(label, x, y);
      const labelEndX = x + doc.getTextWidth(label) + 2;
      doc.setFont("times", "normal");

      const splitText = doc.splitTextToSize(value || "", maxWidth);
      doc.text(splitText, labelEndX, y);
      return splitText.length;
    }

    // --- Borrower Info (Left) ---
    let y = 25;
    drawLabelValue("Borrower’s Name :", header.full_name || "", 15, y);
    y += 6;
    drawLabelValue("Institute/Unit :", header.unit_name || "", 15, y);
    y += 6;
    const linesUsed = drawLabelValue("Purpose :", header.purpose || "", 15, y, 120);
    y += linesUsed * 5.5;

    // --- BRS Info (Right) ---
    let yRight = 25;
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


    // --- Table Title ---
    y += 15;

    // --- Table Header (2 Rows) ---
    const head = [
      [
        { content: "Asset for Reservation / Borrowing", colSpan: 3, styles: { halign: "center", valign: "middle" } },
        { content: "Availability", colSpan: 2, styles: { halign: "center", valign: "middle" } },
        { content: "Issuance", colSpan: 3, styles: { halign: "center", valign: "middle" } }, // now has 3 columns
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
    ];

    // --- Table Body (Items) ---
    const body = items.map((item) => [
      `${item.asset_type || ""} - ${item.brand_name || ""}`,
      item.UOM_brs || "",
      item.qty_brs || "",
      item.is_available === "yes" ? "img-yes" : "",
      item.is_available === "no" ? "img-no" : "",
      item.qty_issuance || "",
      item.borrow_asset_remarks || "",
      item.return_asset_remarks || "",
    ]);


    // --- Preload image ---
    const checkBoxImg = new Image();
    checkBoxImg.src = "/resources/imgs/check-box.png"; // must be inside public/
    await new Promise((resolve) => {
      checkBoxImg.onload = resolve; // wait until image is fully loaded
    });

    // --- Generate Table ---
    autoTable(doc, {
      startY: y + 3,
      head: head,
      body: body,
      styles: {
        font: "times",
        fontSize: 9,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        fontStyle: "bold",
      },
      theme: "grid",

      willDrawCell: (data) => {
        // Clear text before it's drawn
        if (data.cell.raw === "img-yes" || data.cell.raw === "img-no") {
          data.cell.text = []; // prevent any text drawing
        }
      },
      didDrawCell: (data) => {
        // Now safely draw the image after clearing the text
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

    const nextY = doc.lastAutoTable.finalY + 1;

    // --- Signature Table (6 Columns) ---
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
        font: "times",
        fontSize: 9,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: "center",
        valign: "middle",
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

    // --- Terms and Conditions ---
    const finalY = doc.lastAutoTable.finalY + 6;
    doc.setFont("times", "normal");
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
