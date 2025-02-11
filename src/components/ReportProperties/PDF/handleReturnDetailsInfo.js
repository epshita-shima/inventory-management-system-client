import jsPDF from "jspdf";
import { addFooter } from "./footerUtility";
import {
  calculateGrandTotalReturnAmount,
  calculateGrandTotalReturnQty,
  calculateGrandTotalSalesQty,
} from "../../Uitilites/CalculationUtilities/calculation";
import { formatDate } from "../../Uitilites/DateUtilities";

const downloadReturnDetailsInfoPDF = async (companyinfo, reportTitle) => {
  const doc = new jsPDF();
  doc.autoTable({
    html: "#my-return-details-table",
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

const downloadGoupReturnDetailsPDF = (
  groupedData,
  filteredData,
  piInformation,
  finishGoodsItemInfo,
  itemSizeInfo,
  itemUnitInformation,
  clientInformation,
  companyinfo,
  reportTitle
) => {
  const doc = new jsPDF();
  const finalRows = [];
  const grandTotalReturnQty = calculateGrandTotalReturnQty(filteredData);
  const grandTotalReturnAmount = calculateGrandTotalReturnAmount(
    filteredData,
    piInformation
  );

  Object.keys(groupedData).forEach((key) => {
    const group = groupedData[key];
    const formattedDate = formatDate(group.returnDate);
    const rowSpan = group?.detailsData.length;

    const piNumber = piInformation.find((pi) => pi._id === group.piId);

    const dateWiseTotalQuantity = group.detailsData.reduce(
      (cur, acc) => cur + acc.returnQty,
      0
    );

    const dateWiseTotalAmount = group.detailsData.reduce((total, detail) => {
      const item = piNumber.detailsData.find(
        (item) => item.itemId === detail.itemId
      );
      const itemTotal = detail.returnQty * (item?.unitPrice || 0);
      return total + itemTotal;
    }, 0);

    // Iterate through the detailsData of the group
    group.detailsData.forEach((detail, detailIndex) => {
      const transferFrom = clientInformation
        ?.filter((client) => client._id === group.clientId)
        .map((filteredItem) => filteredItem.clientName)
        .join(", ");

      const transferTo = companyinfo?.companyinfo
        ?.filter((comapany) => comapany._id === group.transferToCompanyId)
        .map((filteredItem) => filteredItem.companyName)
        .join(", ");

      const itemNames = finishGoodsItemInfo.find(
        (item) => item._id === detail.itemId
      );
      const itemSize = itemSizeInfo.find(
        (size) => size._id === itemNames.sizeId
      );
      const itemUnit = itemUnitInformation.find(
        (unit) => unit._id === itemNames.unitId
      );
      const unitPrice = piNumber?.detailsData.find(
        (item) => item.itemId == detail.itemId
      );

      const calCulateAmount = unitPrice.unitPrice * detail.returnQty;
      const calculateAvgPrice = calCulateAmount / detail.returnQty;

      // Add table rows for each detail
      finalRows.push([
        detailIndex === 0 ? formattedDate : "",
        detailIndex === 0 ? transferFrom : "",
        detailIndex === 0 ? transferTo : "",
        detailIndex === 0 ? piNumber.invoiceNo : "",
        // `${itemNames.itemName} (${itemSize.sizeInfo})`,
        `${itemUnit?.unitInfo}`,
        detail.returnQty.toLocaleString(),
        calculateAvgPrice.toLocaleString(),
        calCulateAmount.toLocaleString(),
      ]);

      // After all details for this group, add the date-wise total row
      if (detailIndex === group.detailsData.length - 1) {
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
      content: grandTotalReturnQty.toLocaleString(),
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
      content: grandTotalReturnAmount.toLocaleString(),
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
        "Return Date",
        "Transfer Form",
        "Transfer To",
        "PI Number",
        "Unit",
        "Return Qty",
        "Unit Price",
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
      // Extract text content from HTML string
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
export { downloadReturnDetailsInfoPDF, downloadGoupReturnDetailsPDF };
