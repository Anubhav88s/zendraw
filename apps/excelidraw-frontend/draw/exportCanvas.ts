import jsPDF from "jspdf";

/**
 * Export the canvas content as a PDF file.
 * Captures the current state of the canvas and places it
 * into a landscape A4 PDF, preserving the aspect ratio.
 */
export function exportCanvasAsPDF(canvas: HTMLCanvasElement, filename?: string) {
  const dataUrl = canvas.toDataURL("image/png", 1.0);

  const pdf = new jsPDF("landscape", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Calculate dimensions to fit canvas while preserving aspect ratio
  const canvasAspect = canvas.width / canvas.height;
  const pageAspect = pageWidth / pageHeight;

  let imgWidth: number;
  let imgHeight: number;
  let offsetX = 0;
  let offsetY = 0;

  if (canvasAspect > pageAspect) {
    // Canvas is wider than page — fit to width
    imgWidth = pageWidth;
    imgHeight = pageWidth / canvasAspect;
    offsetY = (pageHeight - imgHeight) / 2;
  } else {
    // Canvas is taller — fit to height
    imgHeight = pageHeight;
    imgWidth = pageHeight * canvasAspect;
    offsetX = (pageWidth - imgWidth) / 2;
  }

  pdf.addImage(dataUrl, "PNG", offsetX, offsetY, imgWidth, imgHeight);

  const name = filename || `zendraw-${new Date().toISOString().slice(0, 10)}`;
  pdf.save(`${name}.pdf`);
}

/**
 * Export the canvas content as a PNG image file.
 */
export function exportCanvasAsPNG(canvas: HTMLCanvasElement, filename?: string) {
  const name = filename || `zendraw-${new Date().toISOString().slice(0, 10)}`;

  const link = document.createElement("a");
  link.download = `${name}.png`;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}
