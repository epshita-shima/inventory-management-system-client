import jsPDF from "jspdf";
import { addFooter } from "./footerUtility";
import { calculatePurchaseAmount, calculatePurchaseQuantity } from "../../Uitilites/CalculationUtilities/calculation";
import { formatDate } from "../../Uitilites/DateUtilities";

const downloadGoupPurchaseDetailsPDF = (
  groupedData,
  filteredData,
  finishGoodsItemInfo,
  itemUnitInformation,
  supplierInformation,
  companyinfo,
  reportPurchaseTitle
) => {

  const doc = new jsPDF();
  const finalRows = [];

  const grandTotalPurchaseQty = calculatePurchaseQuantity(filteredData);
  const grandTotalPurchaseAmount = calculatePurchaseAmount(filteredData);

  Object.keys(groupedData).forEach((key) => {
    const groups = groupedData[key];
    const rowSpan = groups.reduce(
      (total, item) => total + item.detailsData.length,
      0
    );

    const dateWiseTotalQuantity = groups.reduce(
      (totalQty, item) =>
        totalQty +
        item.detailsData.reduce(
          (itemTotal, detail) => itemTotal + detail.quantity,
          0
        ),
      0
    );

    const dateWiseTotalAmount = groups.reduce(
      (totalQty, item) =>
        totalQty +
        item.detailsData.reduce(
          (itemTotal, detail) => itemTotal + detail.amount,
          0
        ),
      0
    );

    if (Array.isArray(groups)) {
      groups.forEach((group, index) => {
        group.detailsData.forEach((detail, detailIndex) => {
          const formattedDate = detailIndex === 0 ? formatDate(group.receiveDate) : "";
          const supplierName = supplierInformation?.filter((supplier) => supplier._id === group.supplierId)
          .map((filteredItem) => filteredItem.supplierName)
          .join(", ");
      
          const itemNames = finishGoodsItemInfo?.find(
            (item) => item._id === detail.itemId
          );
          const itemUnit = itemUnitInformation?.find(
            (size) => size._id === itemNames?.unitId
          );
          const row = [
            formattedDate,
            supplierName ?supplierName : 'N/A' , 
            group.supplierPoNo, 
            `${itemNames?.itemName}`, 
            `${itemUnit?.unitInfo}`,
            detail.quantity.toLocaleString(), 
            detail.unitPrice.toLocaleString(), 
            detail.amount.toLocaleString(), 
          ];
    
          finalRows.push(row);
        
          if (detailIndex === 0 && index === 0) {
            finalRows[finalRows.length - 1][0] = {
              content: formattedDate,
              rowSpan: rowSpan,
            };
          }
          else{
            finalRows[finalRows.length - 1][0] = supplierName;
            finalRows[finalRows.length - 1][1] = group.supplierPoNo;
            finalRows[finalRows.length - 1][2] =  `${itemNames?.itemName}`;
            finalRows[finalRows.length - 1][3] =  `${itemUnit?.unitInfo}`;
            finalRows[finalRows.length - 1][4] = detail.quantity.toLocaleString();
            finalRows[finalRows.length - 1][5] = detail.unitPrice.toLocaleString();
            finalRows[finalRows.length - 1][6] = detail.amount.toLocaleString();
          }

          if (index === rowSpan - 1) {
            finalRows.push([
              {
                content: "Datewise Total",
                colSpan: 5,
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
              {
                content: "", // Empty cell for price
                styles: {
                  fillColor: [138, 138, 138],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                },
              },
              {
                content: dateWiseTotalAmount.toLocaleString(),
                styles: {
                  fillColor: [138, 138, 138],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  halign: "right",
                },
              },
            ]);
          }
        });
      });
    } else {
      console.log("Group is not an array. Check its structure!");
    }

  });

  finalRows.push([
    {
      content: "Grand Total",
      colSpan: 5,
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
    head: [
      [
        "Receive Date",
        "Supplier Name",
        "PO NO",
        "Item Name",
        "Unit",
        "Quantity",
        "Rate",
        "Amount",
      ],
    ],
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
const downloadGoupPurchaseItemWisePDF = (
  groupedData,
  filteredData,
  finishGoodsItemInfo,
  itemUnitInformation,
  supplierInformation,
  companyinfo,
  reportPurchaseTitle
) => {

  const doc = new jsPDF();
  const finalRows = [];

  const grandTotalPurchaseQty = calculatePurchaseQuantity(filteredData);
  const grandTotalPurchaseAmount = calculatePurchaseAmount(filteredData);

  Object.keys(groupedData).forEach((key) => {
    const groups = groupedData[key];
    const rowSpan = groups.reduce(
      (total, item) => total + item.detailsData.length,
      0
    );

    const dateWiseTotalQuantity = groups.reduce(
      (totalQty, item) =>
        totalQty +
        item.detailsData.reduce(
          (itemTotal, detail) => itemTotal + detail.quantity,
          0
        ),
      0
    );

    const dateWiseTotalAmount = groups.reduce(
      (totalQty, item) =>
        totalQty +
        item.detailsData.reduce(
          (itemTotal, detail) => itemTotal + detail.amount,
          0
        ),
      0
    );

    if (Array.isArray(groups)) {
      groups.forEach((group, index) => {
        group.detailsData.forEach((detail, detailIndex) => {
          const formattedDate = detailIndex === 0 ? formatDate(group.receiveDate) : "";
          const supplierName = supplierInformation?.filter((supplier) => supplier._id === group.supplierId)
          .map((filteredItem) => filteredItem.supplierName)
          .join(", ");
      
          const row = [
            formattedDate,
            supplierName, 
            group.supplierPoNo, 
            detail.quantity.toLocaleString(), 
            detail.unitPrice.toLocaleString(), 
            detail.amount.toLocaleString(), 
          ];
    
          finalRows.push(row);
        
          if (detailIndex === 0 && index === 0) {
            finalRows[finalRows.length - 1][0] = {
              content: formattedDate,
              rowSpan: rowSpan,
            };
          }
          else{
            finalRows[finalRows.length - 1][0] = supplierName;
            finalRows[finalRows.length - 1][1] = group.supplierPoNo;
            finalRows[finalRows.length - 1][2] = detail.quantity.toLocaleString();
            finalRows[finalRows.length - 1][3] = detail.unitPrice.toLocaleString();
            finalRows[finalRows.length - 1][4] = detail.amount.toLocaleString();
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
              {
                content: "", // Empty cell for price
                styles: {
                  fillColor: [138, 138, 138],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                },
              },
              {
                content: dateWiseTotalAmount.toLocaleString(),
                styles: {
                  fillColor: [138, 138, 138],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  halign: "right",
                },
              },
            ]);
          }
        });
      });
    } else {
      console.log("Group is not an array. Check its structure!");
    }

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
    head: [
      [
        "Receive Date",
        "Supplier Name",
        "PO NO",
        "Quantity",
        "Rate",
        "Amount",
      ],
    ],
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


export {downloadGoupPurchaseDetailsPDF,downloadGoupPurchaseItemWisePDF}