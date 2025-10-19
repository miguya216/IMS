// src/pages/admin/functions/GenerateAccountabilityPDF.jsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateAccountabilityPDF = async (user_ID) => {
  try {
    const res = await fetch(`/api/User-Handlers/fetch_user_assets_for_pdf.php?user_ID=${user_ID}`);
    const data = await res.json();

    if (data.status !== "success") {
      console.error("Failed to fetch data:", data.message);
      return null;
    }

    const { header, assets } = data;

    const doc = new jsPDF({ orientation: "portrait" });
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // black font

    // Title
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("ACCOUNTABILITY FORM", 105, 12, { align: "center" });
    doc.setFontSize(10);

    // Header layout with bold labels
    doc.setFont("times", "bold");
    doc.text(`Name:`, 14, 23);
    doc.text(`Department:`, 150, 23);
    doc.text(`Position:`, 14, 31);
    doc.text(`Control No:`, 150, 31);

    doc.setFont("times", "normal");
    doc.text(`${header.full_name}`, 25, 23);
    doc.text(`${header.department}`, 171, 23);
    doc.text(`${header.position}`, 28, 31);
    doc.text(`${header.control_no}`, 170, 31);

    // NEW: Total Asset under Position
    const totalAssets = assets.length;
    doc.setFont("times", "bold");
    doc.text(`Total Assets:`, 14, 39);
    doc.setFont("times", "normal");
    doc.text(`${totalAssets}`, 34, 39);

    // Table setup (removed numbering column)
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
      startY: 45,
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
        lineWidth: 0.3
      },
      headStyles: { 
        fontStyle: "bold",
        fillColor: [255,255,255],
        textColor: [0,0,0],
        lineColor: [0,0,0],
        lineWidth: 0.3,
        halign: "center"
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
      }
    });

        // Add declaration below the table
    let finalY = doc.lastAutoTable.finalY + 10;

    doc.setFont("times", "normal");
    doc.setFontSize(9);
    const declaration = `Item/s above is/are accepted by me with the distinct understanding of the following:
    1. This is a property of Kolehiyo ng Lungsod ng Dasmariñas.
    2. This is to be used only by assigned staff/individual as required in the performance duties.
    3. This is to be returned to the company upon demand or in the event of resignation or termination.
    4. I shall be accountable for any loss or damage of this items/s.
    5. I shall be audited anytime by the Cost Controller / Property Custodian.
    6. This is a shared unit and I have to report any damage immediately, otherwise I will held liable.`;

    // Wrap text to fit page width
    const wrappedDeclaration = doc.splitTextToSize(declaration, 180);
    doc.text(wrappedDeclaration, 14, finalY);


    // Signatures
    finalY += 30;
    doc.setFont("times", "normal");
    doc.text("Accepted by:", 20, finalY);
    doc.text("Issued by:", 100, finalY);
    doc.text("Noted by:", 160, finalY);

    // Signature lines
    finalY += 10;
    doc.text("__________________________", 20, finalY);
    doc.text("_____________________", 100, finalY);
    doc.text("___________________", 160, finalY);

    // Labels under signature lines
    finalY += 5;
    doc.setFont("times", "bold");
    doc.text("Signature over printed name/date", 20, finalY);
    doc.text("Cost Control", 100, finalY);
    doc.text("Comptroller", 160, finalY);


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
