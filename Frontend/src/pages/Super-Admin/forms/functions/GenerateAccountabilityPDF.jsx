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

export const generateAccountabilityPDF = async (user_ID) => {
  try {
    // Load header/footer image
    const brandingRes = await fetch("/api/User-Handlers/settings/getBrandingImage.php");
    const brandingData = await brandingRes.json();
    const headerFooterPath = brandingData.header_footer_img_path;

    let headerFooterImg = null;
    if (headerFooterPath) {
      headerFooterImg = await getBase64FromUrl(`/${headerFooterPath}`);
    }

    // Fetch user assets
    const res = await fetch(`/api/User-Handlers/fetch_user_assets_for_pdf.php?user_ID=${user_ID}`);
    const data = await res.json();

    if (data.status !== "success") {
      console.error("Failed to fetch data:", data.message);
      return null;
    }

    const { header, assets } = data;
    const doc = new jsPDF({ orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Function to draw background
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

    // Shift all content down by this offset to clear header/footer
    const topOffset = 50;

    // Table data
    const tableBody = assets.map((asset) => [
      asset.date_acquired,
      asset.item,
      asset.property_no,
      asset.property_tag,
      asset.quantity,
      asset.price_amount,
      asset.serviceable_year || ""
    ]);

    autoTable(doc, {
      startY: topOffset + 35, 
      margin: { top: 48, bottom: 20},
      head: [[
        "Date",
        "Item",
        "Property No.",
        "Serial No.",
        "Qty",
        "Unit Cost",
        "Serviceable Year"
      ]],
      body: tableBody,
      styles: { 
        fillColor: false,
        fontSize: 8,
        cellPadding: 3,
        textColor: [0,0,0],
        lineColor: [0,0,0],
        lineWidth: 0.3,
        font: "helvetica"
      },
      headStyles: { 
        fontStyle: "bold",
        fillColor: false,
        textColor: [0,0,0],
        lineColor: [0,0,0],
        lineWidth: 0.3,
        halign: "center",
        valign: "middle"
      },
      theme: "grid",
      columnStyles: {
        0: { minCellWidth: 20, halign: "center" },  
        1: { minCellWidth: 50, halign: "center" },  
        2: { minCellWidth: 25, halign: "center" },  
        3: { minCellWidth: 25, halign: "center" },  
        4: { minCellWidth: 12, halign: "center" },  
        5: { minCellWidth: 20, halign: "center" },  
        6: { minCellWidth: 25, halign: "center" }   
      },

      // Background image before content
      willDrawPage: () => {
        if (headerFooterImg) {
          doc.addImage(headerFooterImg, "PNG", 0, 0, pageWidth, pageHeight);
        }
      },

      // Header info on first page
      didDrawPage: (dataArg) => {
        if (dataArg.pageNumber === 1) {
          let yPos = topOffset;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("ACCOUNTABILITY FORM", pageWidth / 2, yPos, { align: "center" });

          yPos += 10;

          doc.setFont("helvetica", "bold");
          doc.text(`Name:`, 14, yPos);
          doc.text(`Department:`, 145, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${header.full_name}`, 28, yPos);
          doc.text(`${header.department}`, 171, yPos);

          yPos += 8;
          doc.setFont("helvetica", "bold");
          doc.text(`Position:`, 14, yPos);
          doc.text(`Control No:`, 145, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${header.position}`, 33, yPos);
          doc.text(`${header.control_no}`, 169, yPos);

          yPos += 8;
          doc.setFont("helvetica", "bold");
          doc.text(`Total Assets:`, 14, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${assets.length}`, 42, yPos);
        }
      },
      rowPageBreak: 'avoid',
    });

    // Add declaration below table
    let finalY = doc.lastAutoTable.finalY + 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const declaration = `Item/s above is/are accepted by me with the distinct understanding of the following:
      1. This is a property of Kolehiyo ng Lungsod ng Dasmariñas.
      2. This is to be used only by assigned staff/individual as required in the performance duties.
      3. This is to be returned to the company upon demand or in the event of resignation or termination.
      4. I shall be accountable for any loss or damage of this items/s.
      5. I shall be audited anytime by the Cost Controller / Property Custodian.
      6. This is a shared unit and I have to report any damage immediately, otherwise I will held liable.`;

    const wrappedDeclaration = doc.splitTextToSize(declaration, 180);

    // Estimate height of declaration
    const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor; // in units
    const declarationHeight = wrappedDeclaration.length * lineHeight;

    // Estimate height of signature block
    const signatureHeight = 30 + 10 + 5; // spacing + lines + labels

    const totalHeightNeeded = declarationHeight + signatureHeight;

    // If not enough space, add new page
    if (finalY + totalHeightNeeded > doc.internal.pageSize.getHeight() - 20) { // bottom margin
      doc.addPage();
      finalY = 50; // topOffset to clear header
    }

    // Draw declaration
    doc.text(wrappedDeclaration, 14, finalY);

    // Signatures
    finalY += declarationHeight + 10;
    doc.setFont("helvetica", "normal");
    doc.text("Accepted by:", 20, finalY);
    doc.text("Issued by:", 100, finalY);
    doc.text("Noted by:", 160, finalY);

    finalY += 10;
    doc.text("__________________________", 20, finalY);
    doc.text("_____________________", 100, finalY);
    doc.text("___________________", 160, finalY);

    finalY += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Signature over printed name/date", 20, finalY);
    doc.text("Cost Control", 100, finalY);
    doc.text("Comptroller", 160, finalY);


    // Export PDF
    const pdfBlob = doc.output("blob");
    return {
      url: URL.createObjectURL(pdfBlob),
      filename: `AccountabilityForm_${header.control_no}.pdf`,
    };

  } catch (err) {
    console.error("Error generating Accountability PDF:", err);
    return null;
  }
};
