
import jsPDF from "jspdf";
import { addFooter } from "./footerUtility";

const downloadCombineReportPDF =(  companyinfo,
  reportTitle)=> {
  const doc = new jsPDF({ orientation: 'landscape' });
    doc.autoTable({
      html: "#my-combine-report-table",
      startY: 50,
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
        1: { cellWidth: 25 }, // Custom width for second column
        2: { cellWidth: 15 }, // Custom width for third column
        3: { cellWidth: 25 }, // Auto width for fourth column
        4: { cellWidth: 25 }, // Custom width for first column
        5: { cellWidth: 15 }, // Custom width for second column
        6: { cellWidth: 25 }, // Custom width for third column
        7: { cellWidth: 25 }, // Auto width for fourth column
        8: { cellWidth:15 }, // Auto width for fourth column
        9: { cellWidth: 25 }, // Auto width for fourth column
        10: { cellWidth: 25 }, // Auto width for fourth column
        11: { cellWidth: 15 }, // Auto width for fourth column
        12: { cellWidth: 25 }, // Auto width for fourth column
      },
      didParseCell: function (data) {
        const rowIndex = data.row.index;
        const totalRows = data.table.body.length;
        const colIndex = data.column.index;
        const totalCols = data.table.body[0].raw.length;
        const cellContent = data.cell.raw;
        // Extract text content from HTML string
        const cellContentText = String(cellContent || "").trim();

        const numericValue = parseFloat(cellContentText);
        const targetColumnIndex = 3;
        const textContent = cellContent?.innerText || cellContent?.textContent;
        console.log(textContent);
        const lastRowIndex = data.table.body.length;
        console.log('lastRowIndex=',lastRowIndex,"data.column.index=",data.column.index)
        if (!isNaN(numericValue) && colIndex === totalCols - 1) {
          if (numericValue < 0) {
            data.cell.styles.textColor = [255, 0, 0]; // Red text for negative values
            data.cell.text = `(${Math.abs(numericValue).toLocaleString()})`; // Format negative values
          } else {
            data.cell.text = numericValue.toLocaleString(); // Format positive numbers
          }
        }
        if (data.column.index === 2 && data.row.index === lastRowIndex) {
          data.cell.styles.fillColor = [255, 220, 220]; // Light red background
        }
        if (rowIndex === totalRows - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [138, 138, 138]; // Gray line color
          data.cell.styles.textColor = [255, 255, 255];
        }

        if (textContent?.trim().toLowerCase() === "datewise total") {
          Object.values(data.row.cells).forEach((cell) => {
            cell.styles = cell.styles || {};
            cell.styles.fontStyle = "bold";
            cell.styles.fillColor = [138, 138, 138]; // Gray line color
            cell.styles.textColor = [255, 255, 255];
          });
          // data.cell.styles.halign = "right";
        }
        if (textContent?.trim().toLowerCase() === "grand total"){
          data.cell.styles.halign = "right";
        }
        if (textContent?.trim().toLowerCase() === "rate"){
          Object.values(data.row.cells).forEach((cell) => {
            cell.styles = cell.styles || {};
            cell.styles.fillColor = [255, 220, 220]; // Gray line color
            // cell.styles.textColor = [255, 255, 255];
          });
        }
        if (colIndex === totalCols - 1) {
          // data.cell.styles.halign = "right";
        }
      },
    });

  addFooter(doc, companyinfo, reportTitle);

  doc.save(`${reportTitle}.pdf`);
};

export default downloadCombineReportPDF
