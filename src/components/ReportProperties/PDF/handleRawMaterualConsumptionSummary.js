import jsPDF from "jspdf";
import { addFooter } from "./footerUtility";

const downloadRawMaterialConsumptionSummaryPDF = async (
  companyinfo,
  reportTitle
) => {
  const doc = new jsPDF();
    doc.autoTable({
      html: "#my-raw-material-consumption-summary-table",
      startY:50,
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
        0: { cellWidth: "auto" }, 
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" }, 
        3: { cellWidth: "auto" }, 
        4: { cellWidth: "auto" } 
      },
      didParseCell: function (data) {
        const rowIndex = data.row.index;
        const totalRows = data.table.body.length;
        const colIndex = data.column.index;
        const totalCols = data.table.body[0].raw.length;
        const cellContent = data.cell.raw;
        // Extract text content from HTML string
        const textContent = cellContent?.innerText || cellContent?.textContent;
        console.log(textContent);
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
          data.cell.styles.halign = "right";
        }
        if (textContent?.trim().toLowerCase() === "grand total"){
          data.cell.styles.halign = "right";
         
        }
        // if (colIndex === totalCols - 1) {
        //   data.cell.styles.halign = "right";
        // }

      },
    });
   
  addFooter(doc, companyinfo, reportTitle);
  doc.save(`${reportTitle}.pdf`);
};

export { downloadRawMaterialConsumptionSummaryPDF };