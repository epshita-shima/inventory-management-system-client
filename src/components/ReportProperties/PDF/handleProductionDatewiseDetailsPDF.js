import jsPDF from "jspdf";
import { addFooter } from "./footerUtility";
import { formatDate } from "../../Uitilites/DateUtilities";
import { calculateProductionQuantity } from "../../Uitilites/CalculationUtilities/calculation";

const downloadProductionDatewiseDetailsInfoPDF = async (
  companyinfo,
  reportTitle
) => {
  const doc = new jsPDF();
  doc.autoTable({
    html: "#my-production-datewise-details-table",
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
    },
    didParseCell: function (data) {
      const rowIndex = data.row.index;
      const totalRows = data.table.body.length;
      const cellContent = data.cell.raw;
      // Extract text content from HTML string
      const textContent = cellContent?.innerText || cellContent?.textContent;

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
      if (textContent?.trim().toLowerCase() === "grand total") {
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

const downloadProductionGroupedDetailsPDF = async (
  groupedData,
  filteredData,
  finishGoodsItemInfo,
  itemSizeInfo,
  itemUnitInformation,
  companyinfo,
  reportProductionTitle
) => {
  const doc = new jsPDF();
  const finalRows = [];
  const grandTotalPIQty = calculateProductionQuantity(filteredData);

  Object.keys(groupedData)?.forEach((key) => {
    const group = groupedData[key];
    const rowSpan = group?.mainData.length;
    const dateWiseTotalQuantity = group.mainData.reduce(
      (totalQty, item) => totalQty + item.productionQty,
      0
    );

    group.mainData.forEach((detail, index) => {
      const itemNames = finishGoodsItemInfo?.find(
        (item) => item._id === detail.productionItemName
      );

      const formattedDate = formatDate(detail.productionDate);
      const itemUnit = itemUnitInformation.find(
        (size) => size._id === itemNames?.unitId
      );

      if (index === 0) {
        // First row of the group with `rowSpan` on the first column
        finalRows.push([
          { content: formattedDate, rowSpan: rowSpan },
          detail.batchNo,
          // `${itemNames.itemName} (${itemSize.sizeInfo})`,
          itemUnit.unitInfo,
          detail.productionQty,
        ]);
      } else {
        // Subsequent rows without the first column data
        finalRows.push([
          detail.batchNo,
          // `${itemNames.itemName} (${itemSize.sizeInfo})`,
          itemUnit.unitInfo,
          detail.productionQty,
        ]);
      }

      if (index === rowSpan - 1) {
        finalRows.push([
          {
            content: "Datewise Total",
            colSpan: 3,
            styles: {
              halign: "right",
              fillColor: [138, 138, 138],
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },
          },

          {
            content: dateWiseTotalQuantity.toLocaleString(),
            styles: {
              fillColor: [138, 138, 138],
              textColor: [255, 255, 255],
              fontStyle: "bold",
              halign: "center",
            },
          },
        ]);
      }
    });
  });

  finalRows.push([
    {
      content: "Grand Total",
      colSpan: 3,
      styles: {
        halign: "right",
        fillColor: [138, 138, 138],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    },
    {
      content: grandTotalPIQty.toLocaleString(),
      styles: {
        fillColor: [138, 138, 138],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
    },
  ]);

  doc.autoTable({
    // html: "#my-deliver-details-table",
    head: [["Production Date", "Batch",  "Unit", "Production Qty"]],
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
    },
  });

  addFooter(doc, companyinfo, reportProductionTitle);
  doc.save(`${reportProductionTitle}.pdf`);
};

export {
  downloadProductionDatewiseDetailsInfoPDF,
  downloadProductionGroupedDetailsPDF,
};
