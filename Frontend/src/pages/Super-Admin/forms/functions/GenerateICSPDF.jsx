// src/pages/admin/functions/GenerateAccountabilityPDF.jsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// src/pages/admin/forms/functions/GenerateICSPDF.jsx
export async function generateICSPDF(user_ID) {
   try {
      // Fetch data from backend API
      const res = await fetch(`/api/User-Handlers/fetch_user_assets_ics.php?user_ID=${user_ID}`);
      const data = await res.json();
  
      if (data.status !== "success") {
        console.error("Error:", data.message);
        return null;
      }
  
      const { header, assets } = data;
  
      // Create PDF with Times font
      const doc = new jsPDF({ orientation: "portrait" });
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
  
      // Title
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("INVENTORY CUSTODIAN SLIP (ICS)", 105, 12, { align: "center" });
      doc.setFontSize(10);
  
      // Header layout (same style as Accountability)
      doc.setFont("times", "bold");
      doc.text(`Name:`, 14, 23);
      doc.text(`Department:`, 150, 23);
      doc.text(`Control No:`, 14, 31);
  
      doc.setFont("times", "normal");
      doc.text(`${header.full_name}`, 25, 23);
      doc.text(`${header.department}`, 171, 23);
      doc.text(`${header.control_no}`, 35, 31);
  
      // NEW: Total Asset
      const totalAssets = assets.length;
      doc.setFont("times", "bold");
      doc.text(`Total Assets:`, 14, 39);
      doc.setFont("times", "normal");
      doc.text(`${totalAssets}`, 38, 39);
  
      // ✅ Table setup (Date Transferred added back)
      const tableBody = assets.map((a) => [
        a.description,
        a.kld_property_tag,
        a.date_transferred 
          ? new Date(a.date_transferred).toLocaleDateString() 
          : "",
        a.amount ? a.amount.toString() : "" 
      ]);
  
      autoTable(doc, {
        startY: 45,
        head: [["Description", "KLD Property Tag", "Date Transferred", "Amount"]],
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
          0: { minCellWidth: 60, halign: "center" },
          1: { minCellWidth: 40, halign: "center" },
          2: { minCellWidth: 35, halign: "center" },
          3: { minCellWidth: 30, halign: "center" }
        }
      });
  
      // Return Blob
      const pdfBlob = doc.output("blob");
      return {
        url: URL.createObjectURL(pdfBlob),
        filename: `${header.control_no}.pdf`,
      };
  
    } catch (err) {
      console.error("Error generating PAR PDF:", err);
      return null;
    }
}
