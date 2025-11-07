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

    // 🪄 Shift all content down by this offset to clear header/footer
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
      startY: topOffset + 35, // table starts below header info
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
        fontSize: 8,
        cellPadding: 3,
        textColor: [0,0,0],
        lineColor: [0,0,0],
        lineWidth: 0.3,
        font: "helvetica"
      },
      headStyles: { 
        fontStyle: "bold",
        fillColor: [255,255,255],
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

          doc.setFontSize(10);
          yPos += 10;

          doc.setFont("helvetica", "bold");
          doc.text(`Name:`, 14, yPos);
          doc.text(`Department:`, 150, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${header.full_name}`, 35, yPos);
          doc.text(`${header.department}`, 171, yPos);

          yPos += 8;
          doc.setFont("helvetica", "bold");
          doc.text(`Position:`, 14, yPos);
          doc.text(`Control No:`, 150, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${header.position}`, 35, yPos);
          doc.text(`${header.control_no}`, 171, yPos);

          yPos += 8;
          doc.setFont("helvetica", "bold");
          doc.text(`Total Assets:`, 14, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${assets.length}`, 38, yPos);
        }
      }
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
    doc.text(wrappedDeclaration, 14, finalY);

    // Signatures
    finalY += 30;
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
