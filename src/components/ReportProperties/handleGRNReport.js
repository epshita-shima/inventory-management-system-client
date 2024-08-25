import jsPDF from "jspdf";

const downloadGRNPDF = async (
  data,
  supplierInfo,
  rawItemInfo,
  fromDate,
  toDate,
  companyinfo,
  reportTitle
) => {
  const doc = new jsPDF();

  doc.setFontSize(10);
  doc.setFont("times", "bold");
  const xCoordinate = 10; // X coordinate for the label
  const labelWidth = 30; // Width allocated for labels
  let textY = 35;

  textY = addTableContent(doc, textY + 10);
  // Add totals to the rows with colSpan

  function addTableContent(doc, startY) {
    function extractTextFromHtml(htmlString) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlString;
      return tempDiv.textContent || tempDiv.innerText || "";
    }
    doc.autoTable({
      html: "#my-grn-table",
      startY: startY,
      margin: { top: 50, bottom: 32, left: 10, right: 10 },
      headerStyles: {
        fillColor: [128, 128, 128],
        textColor: [255, 255, 255],
        halign: "center",
      },
      theme: "grid",
      tableWidth: "auto",
      tableLineWidth: 0.5,
      styles: {
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
        font: "times",
        fontSize: 10,
        textAlign: "center",
        halign: "center",
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: "auto" }, // Custom width for first column
        1: { cellWidth: "auto" }, // Custom width for second column
        2: { cellWidth: 25 }, // Custom width for third column
        3: { cellWidth: "auto" }, // Auto width for fourth column
        4: { cellWidth: "auto" }, // Custom width for first column
        5: { cellWidth: "auto" }, // Custom width for second column
        6: { cellWidth: "auto" }, // Custom width for third column
        7: { cellWidth: "auto" }, // Auto width for fourth column
        8: { cellWidth: "auto" }, // Auto width for fourth column
        9: { cellWidth: 25 }, // Auto width for fourth column
      },
      didParseCell: function (data) {
        const rowIndex = data.row.index;
        const totalRows = data.table.body.length;
        const colIndex = data.column.index;
        const totalCols = data.table.body[0].raw.length;
        const cellContent = data.cell.raw;
        // Extract text content from HTML string
        const textContent = cellContent.innerText || cellContent.textContent;
        console.log(textContent);
        if (rowIndex === totalRows - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [138, 138, 138]; // Gray line color
          data.cell.styles.textColor = [255, 255, 255];
        }

        if (textContent.trim().toLowerCase() === "datewise total") {
          Object.values(data.row.cells).forEach((cell) => {
            cell.styles = cell.styles || {};
            cell.styles.fontStyle = "bold";
            cell.styles.fillColor = [138, 138, 138]; // Gray line color
            cell.styles.textColor = [255, 255, 255];
          });
          data.cell.styles.halign = "right";
        }
        if (textContent.trim().toLowerCase() === "grand total"){
          data.cell.styles.halign = "right";
         
        }
        if (colIndex === totalCols - 1) {
          data.cell.styles.halign = "right";
        }

      },

      didDrawPage: (data) => {
        addFooterForPO(doc, companyinfo, reportTitle, fromDate, toDate);
      },
    });
    return doc.previousAutoTable.finalY;
  }
  addContent(doc, xCoordinate, labelWidth, textY);

  function addContent(doc, xCoordinate, labelWidth, textY) {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const footerY = pageHeight - 35;

    const sections = 4;

    const sectionWidth = (pageWidth - 35) / sections;
    const margin = 5;

    const boxHeight = 6; // Define the height of each section's box

    for (let i = 0; i < sections; i++) {
      const startX = xCoordinate + i * (sectionWidth + margin);
      const endX = startX + sectionWidth;

      doc.line(startX, footerY, endX, footerY);

      doc.line(startX, footerY + boxHeight, endX, footerY + boxHeight);

      doc.line(startX, footerY, startX, footerY + boxHeight);

      doc.line(endX, footerY, endX, footerY + boxHeight);
    }

    const textYOffset = boxHeight / 2 + 1;

    const labels = [
      "Prepared By",
      "Checked By",
      "Store In - Charge",
      "Approved By",
    ];

    doc.setFontSize(8);
    for (let i = 0; i < sections; i++) {
      const startX = xCoordinate + i * (sectionWidth + margin);
      const centerX = startX + sectionWidth / 2;
      doc.text(labels[i], centerX, footerY + textYOffset, {
        align: "center",
      });
    }
  }

  // Save the PDF
  doc.save(`${reportTitle}.pdf`);
};

const addFooterForPO = (doc, companyinfo, reportTitle, fromDate, toDate) => {
  const pageCount = doc.internal.getNumberOfPages(); // Get the total number of pages
  const detailsWidthPercentage = 0.8;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const headerY = 10;
    const footerY = pageHeight - 20; // Adjusted to give space for the footer

    // Header content
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.companyName) {
        var companyNameUpper =
          companyinfo?.companyinfo[0]?.companyName.toUpperCase();
      }
      if (companyinfo?.companyinfo[0]?.companyAddress) {
        var companyAddressUpper =
          companyinfo?.companyinfo[0]?.companyAddress.toUpperCase();
      }
    }

    const companyDetailsWidth = pageWidth * detailsWidthPercentage;
    doc.setFont("times", "normal", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);

    doc.text(companyNameUpper, pageWidth / 2, headerY + 7, {
      align: "center",
      maxWidth: companyDetailsWidth,
    });
    doc.setFont("times", "normal", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    doc.text(companyAddressUpper, pageWidth / 2, headerY + 14, {
      align: "center",
      maxWidth: companyDetailsWidth,
    });

    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text(reportTitle, pageWidth / 2, headerY + 21, {
      align: "center",
      maxWidth: companyDetailsWidth,
    });

    if (fromDate && toDate) {
      doc.setFontSize(11);
      doc.setFont("times", "bold");
      doc.text(
        `AS OF DATED ${fromDate} TO ${toDate}`,
        pageWidth / 2,
        headerY + 28,
        {
          align: "center",
          maxWidth: companyDetailsWidth,
        }
      );
    }

    // Footer content
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("Page " + i + " of " + pageCount, pageWidth - 20, footerY, {
      align: "right",
    });

    // Software generated report aligned to the center
    doc.text("Software Generated report", pageWidth / 2, footerY, {
      align: "center",
    });

    // Copyright aligned to the left
    doc.text("Copyright@2024", 10, footerY, {
      align: "left",
    });

    doc.setLineWidth(0.5); // Calculate Y position for top line in footer
    doc.line(10, footerY - 7, pageWidth - 10, footerY - 7); // Draw line above footer

    doc.setFontSize(10);
    doc.setFont("times", "normal");

    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    doc.text(
      `Date: ${dateStr}  Time: ${timeStr}`,
      pageWidth - 20,
      footerY + 8,
      {
        align: "right",
      }
    );
  }
};

export { downloadGRNPDF };
