import jsPDF from "jspdf";
import { addFooter } from "./footerUtility";
import { formatDate } from "../../Uitilites/DateUtilities";

const downloadGoupPurchaseSummaryPDF = (
  filteredData,
  companyinfo,
  reportPurchaseTitle
) => {
  const doc = new jsPDF();
  const finalRows = [];

  const grandTotalPurchaseQty = filteredData.reduce(
    (sum, item) => sum + item.totalPurchaseQty,
    0
  );
  const grandTotalPurchaseAmount = filteredData.reduce(
    (sum, item) => sum + item.totalPurchaseAmount,0
  );

  filteredData.forEach((group, index) => {
    const formattedDate = formatDate(group.receiveDate);

    const row = [
      formattedDate,
      group.totalPurchaseQty.toLocaleString(),
      Math.round(group.totalPurchaseAmount / group.totalPurchaseQty),
      group.totalPurchaseAmount.toLocaleString(),
    ];

    finalRows.push(row);
  });

  finalRows.push([
    {
      content: "Grand Total",
      // colSpan: 1,
      styles: {
        halign: "right",
        fillColor: [138, 138, 138],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    },
    {
      content: grandTotalPurchaseQty.toLocaleString(),
      styles: {
        fillColor: [138, 138, 138],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
    },
    {
      content: "", // Empty cell for price
      styles: {
        fillColor: [138, 138, 138],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    },
    {
      content: grandTotalPurchaseAmount.toLocaleString(),
      styles: {
        fillColor: [138, 138, 138],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "right",
      },
    },
  ]);

  doc.autoTable({
    // html: "#my-deliver-details-table",
    head: [["Receive Date", "Quantity", "Avarage Rate", "Amount"]],
    body: finalRows,
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
      0: { cellWidth: "auto" },
      1: { cellWidth: "auto" },
      2: { cellWidth: "auto" },
      3: { cellWidth: "auto" },
      4: { cellWidth: "auto" },
      5: { cellWidth: "auto" },
      6: { cellWidth: "auto" },
      7: { cellWidth: "auto" },
      8: { cellWidth: "auto" },
      9: { cellWidth: "auto" },
    },
    didParseCell: function (data) {
      const rowIndex = data.row.index;
      const totalRows = data.table.body.length;
      const colIndex = data.column.index;
      const totalCols = data.table.body[0].raw.length;
      const rawRow = data.row.raw;
      const cellContent = data.cell.raw;
      const textContent = cellContent?.innerText || cellContent?.textContent;
      if (rowIndex === totalRows - 1) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [138, 138, 138]; // Gray line color
        data.cell.styles.textColor = [255, 255, 255];
      }

      if (rawRow.isTotalRow) {
        Object.values(data.row.cells).forEach((cell) => {
          cell.styles = cell.styles || {};
          cell.styles.fontStyle = "bold";
          cell.styles.fillColor = [138, 138, 138];
          cell.styles.textColor = [255, 255, 255];
        });
        data.cell.styles.halign = "right";
      }
      if (textContent?.trim().toLowerCase() === "grand total") {
        data.cell.styles.halign = "right";
      }
      if (colIndex === totalCols - 1) {
        data.cell.styles.halign = "right";
      }
    },
  });

  addFooter(doc, companyinfo, reportPurchaseTitle);
  doc.save(`${reportPurchaseTitle}.pdf`);
};
export { downloadGoupPurchaseSummaryPDF };
