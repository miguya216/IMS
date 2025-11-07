// src/pages/admin/forms/functions/AssetDetailsPDF.jsx
import jsPDF from "jspdf";

export const generateAssetDetailsPDF = async () => {
  try {
    const response = await fetch("/api/Assets-Handlers/export_assets.php");
    const assets = await response.json();

    if (!assets || assets.length === 0) {
      console.error("No assets found for PDF generation");
      return null;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const columnWidth = pageWidth / 2;
    const startX = [10, columnWidth + 10]; // padding at edges
    let currentY = [10, 10];
    let currentColumn = 0;
    let stickersInColumn = [0, 0]; // left, right

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const d = new Date(dateString);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };


    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const x = startX[currentColumn];
      let y = currentY[currentColumn];
      const stickerStartY = y;

      // --- Barcode ---
      if (asset.barcode_path) {
        try {
          const barcodeImg = await loadImage(resolvePath(asset.barcode_path));
          doc.addImage(barcodeImg, "PNG", x + 5, y + 5, 180, 35);
        } catch (e) {
          console.warn("Barcode missing for:", asset.kld_property_tag, e);
        }
      }

      // --- QR ---
      if (asset.qr_code_path) {
        try {
          const qrImg = await loadImage(resolvePath(asset.qr_code_path));
          doc.addImage(qrImg, "PNG", x + 195, y + 5, 65, 65);
        } catch (e) {
          console.warn("QR missing for:", asset.kld_property_tag, e);
        }
      }

      y += 70;

      // --- Text details (labels bold, values normal) ---
    doc.setFontSize(9);

    y = addLabeledText(doc, "Property Tag:", asset.property_tag || "", x + 5, y, columnWidth - 25);
    y = addLabeledText(doc, "KLD Tag:", asset.kld_property_tag || "", x + 5, y, columnWidth - 25);
    y = addLabeledText(doc, "Asset Classification:", asset.asset_classification || "", x + 5, y, columnWidth - 25);
    y = addLabeledText(doc, "Acquisition Source:", asset.acquisition_source || "", x + 5, y, columnWidth - 25);
    y = addLabeledText(doc, "Brand/Type:", asset.brand_asset_type || "", x + 5, y, columnWidth - 25);
    y = addLabeledText(doc, "Accounted To:", asset.accounted_to || "", x + 5, y, columnWidth - 25);
    y = addLabeledText(
      doc,
      "Date Acquired:",
      formatDate(asset.date_acquired),
      x + 5,
      y,
      columnWidth - 25
    );

    y = addLabeledText(
      doc,
      "Price Amount:",
      asset.price_amount
        ? `PHP${Number(asset.price_amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : "",
      x + 5,
      y,
      columnWidth - 25
    );


      y += 15;

      // --- Draw bounding box ---
      const stickerHeight = y - stickerStartY;
      doc.setLineWidth(0.5);
      doc.rect(x, stickerStartY, columnWidth - 20, stickerHeight);

      currentY[currentColumn] = y + 15;
      stickersInColumn[currentColumn]++;

      // Switch column
      currentColumn = currentColumn === 0 ? 1 : 0;

      // If both columns filled → new page
      if (stickersInColumn[0] >= 4 && stickersInColumn[1] >= 4) {
        doc.addPage();
        currentY = [10, 10];
        stickersInColumn = [0, 0];
        currentColumn = 0;
      }
    }

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    return {
      url: pdfUrl,
      filename: `Asset_Stickers_${Date.now()}.pdf`,
    };
  } catch (err) {
    console.error("Error generating Asset Stickers PDF:", err);
    return null;
  }
};

// --- Helpers ---
const resolvePath = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return "/" + path.replace(/^\/+/, "");
};

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

// Draw bold label + normal value with wrapping
const addLabeledText = (doc, label, value, x, y, maxWidth) => {
  if (!label && !value) return y;

  // Draw label
  doc.setFont("helvetica", "bold");
  doc.text(label, x, y);

  // Measure label width
  const labelWidth = doc.getTextWidth(label);

  // Wrap value
  doc.setFont("helvetica", "normal");
  const valueLines = doc.splitTextToSize(value, maxWidth - labelWidth - 2);

  // Draw value (aligned with label baseline)
  doc.text(valueLines, x + labelWidth + 2, y);

  // Advance Y by number of lines
  return y + valueLines.length * 12;
};
