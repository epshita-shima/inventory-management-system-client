import jsPDF from "jspdf";
import { addFooter } from "./footerUtility";
import { formatDate } from "../../Uitilites/DateUtilities";
import {
  calculateGrandTotalPIAmount,
  calculateGrandTotalPIQty,
} from "../../Uitilites/CalculationUtilities/calculation";

const downloadOrderDetailsAllDataPDF = async (companyinfo, reportTitle) => {
  const doc = new jsPDF();
  doc.autoTable({
    html: "#my-order-details-table",
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
      if (textContent?.trim().toLowerCase() === "grand total") {
        data.cell.styles.halign = "right";
      }
      if (colIndex === totalCols - 1) {
        data.cell.styles.halign = "right";
      }
    },
  });

  addFooter(doc, companyinfo, reportTitle);
  doc.save(`${reportTitle}.pdf`);
};

const downloadGoupOrderDetailsPDF = (
  groupedData,
  filteredData,
  finishGoodsItemInfo,
  itemSizeInfo,
  itemUnitInformation,
  clientInformation,
  companyinfo,
  reportOrderTitle
) => {
  console.log({ groupedData });
  console.log({ filteredData });
  const doc = new jsPDF();
  const finalRows = [];
  const grandTotalPIQty = calculateGrandTotalPIQty(filteredData);
  const grandTotalPIAmount = calculateGrandTotalPIAmount(filteredData);

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
          (itemTotal, detail) => itemTotal + detail.totalAmount,
          0
        ),
      0
    );

    if (Array.isArray(groups)) {
      groups.forEach((group, index) => {
        group.detailsData.forEach((detail, detailIndex) => {
          console.log(group.detailsData.length);
          const formattedDate = detailIndex === 0 ? formatDate(group.piDate) : "";
          const clientName = clientInformation?.filter((client) => client._id === group.customerID)
          .map((filteredItem) => filteredItem.clientName)
          .join(", ");
      
          const itemNames = finishGoodsItemInfo.find(
            (item) => item._id === detail.itemId
          );
          const itemSize = itemSizeInfo.find(
            (size) => size._id === itemNames.sizeId
          );
          const itemUnit = itemUnitInformation.find(
            (size) => size._id === itemNames.unitId
          );
          const row = [
            formattedDate,
            clientName, 
            group.invoiceNo, 
            `${itemUnit.unitInfo}`, 
            detail.quantity.toLocaleString(), 
            detail.unitPrice.toLocaleString(), 
            detail.totalAmount.toLocaleString(), 
          ];
    
          finalRows.push(row);
        
          if (detailIndex === 0 && index === 0) {
            finalRows[finalRows.length - 1][0] = {
              content: formattedDate,
              rowSpan: rowSpan,
            };
          }
          else{
            finalRows[finalRows.length - 1][0] = clientName;
            finalRows[finalRows.length - 1][1] = group.invoiceNo;
            finalRows[finalRows.length - 1][2] =  `${itemUnit.unitInfo}`;
            finalRows[finalRows.length - 1][3] = detail.quantity.toLocaleString();
            finalRows[finalRows.length - 1][4] = detail.unitPrice.toLocaleString();
            finalRows[finalRows.length - 1][5] = detail.totalAmount.toLocaleString();
          }

          if (index === rowSpan - 1) {
            finalRows.push([
              {
                content: "Datewise Total",
                colSpan: 4,
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
      colSpan: 4,
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
    {
      content: "", // Empty cell for price
      styles: {
        fillColor: [138, 138, 138],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    },
    {
      content: grandTotalPIAmount.toLocaleString(),
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
        "PI Date",
        "Client Name",
        "Invoice No",
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

  addFooter(doc, companyinfo, reportOrderTitle);
  doc.save(`${reportOrderTitle}.pdf`);
};

export { downloadOrderDetailsAllDataPDF, downloadGoupOrderDetailsPDF };
