import jsPDF from "jspdf";

const downloadPDF = (companyinfo, reportTitle) => {
  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const doc = new jsPDF();
  doc.autoTable({
    html: "#my-table",
    startY: 50,
    margin: { top: 50, bottom: 32 },
    headerStyles: {
      fillColor: [128, 128, 128], // Change the color here, e.g., red
      textColor: [255, 255, 255], // Header text color
    },
    theme: "grid",
    tableLineWidth: 0.5, // Border width for the whole table
    styles: {
      lineColor: [0, 0, 0], // Color for all borders
      textColor: [0, 0, 0],
      font: "times", // All text color
      fontSize: 10,
    },
    didParseCell: function (data) {
      data.cell.styles.halign = "center"; // Align all cell content to center
    },
  });

  // Add footer text to each page
  addFooter(doc, companyinfo, reportTitle);

  // Save the PDF
  doc.save(`${fileName}.pdf`);
};

const downloadProductionPDF = (companyinfo, reportTitle, fromDate, toDate) => {
  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const doc1 = new jsPDF();
  doc1.autoTable({
    html: "#production-table",
    startY: fromDate && toDate ? 55 : 50,
    margin: { top: 50, bottom: 32 },
    headerStyles: {
      fillColor: [128, 128, 128], // Change the color here, e.g., red
      textColor: [255, 255, 255], // Header text color
    },
    theme: "grid",
    tableLineWidth: 0.5, // Border width for the whole table
    styles: {
      lineColor: [0, 0, 0], // Color for all borders
      textColor: [0, 0, 0],
      font: "times", // All text color
      fontSize: 10,
      // overflow: 'linebreak',
      // cellWidth: 'wrap',
    },
    columnStyles: {
      0: { cellWidth: "auto" }, // Example for the first column
      1: { cellWidth: "auto" }, // Example for the second column
      // You can specify auto or a specific width for each column
    },
    didParseCell: function (data) {
      data.cell.styles.halign = "center"; // Align all cell content to center
    },
  });

  // Add footer text to each page
  addFooter(doc1, companyinfo, reportTitle, fromDate, toDate);

  // Save the PDF
  doc1.save(`${fileName}.pdf`);
};

const downloadHeadingProductionPDF = (data, companyinfo, reportTitle) => {
  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const doc1 = new jsPDF();
  const finalRows = data?.map((row, index) => [
    index + 1,
    row.productionDate,
    row.batchNo,
    row.totalBatch,
    row.productionQty,
  ]);
  doc1.autoTable({
    head: [
      ["Sl.", "Production Date", "Batch No", "Total Batch", "Production Qty"],
    ],
    body: finalRows,
    startY: 55,
    margin: { top: 50, bottom: 32 },
    headerStyles: {
      fillColor: [128, 128, 128], // Change the color here, e.g., red
      textColor: [255, 255, 255], // Header text color
    },
    theme: "grid",
    tableLineWidth: 0.5, // Border width for the whole table
    styles: {
      lineColor: [0, 0, 0], // Color for all borders
      textColor: [0, 0, 0],
      font: "times", // All text color
      fontSize: 10,
      // overflow: 'linebreak',
      // cellWidth: 'wrap',
    },
    columnStyles: {
      0: { cellWidth: "auto" }, // Example for the first column
      1: { cellWidth: "auto" }, // Example for the second column
      // You can specify auto or a specific width for each column
    },
    didParseCell: function (data) {
      data.cell.styles.halign = "center"; // Align all cell content to center
    },
  });

  // Add footer text to each page
  addFooter(doc1, companyinfo, reportTitle);

  // Save the PDF
  doc1.save(`${fileName}.pdf`);
};

const downloadInvoiceSingleDataPDF = (
  data,
  customerInfo,
  companyinfo,
  reportTitle
) => {
  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const doc1 = new jsPDF();
  const finalRows = data?.map((row, index) => [
    index + 1,
    new Date(row.piDate).toLocaleDateString("en-CA"),
    row.invoiceNo,
    customerInfo
      ?.filter((rawItem) => rawItem._id === row.customerID)
      .map((filteredItem) => filteredItem.clientName)
      .join(", "),
    row.detailsData.reduce((subTotal, item) => {
      return subTotal + item.quantity;
    }, 0),
    row.detailsData.reduce((subTotal, item) => {
      return subTotal + item.totalAmount;
    }, 0),
  ]);
  doc1.autoTable({
    head: [
      [
        "Sl.",
        "PI Date",
        "Invoice No",
        "Client Name",
        "Total Quantity",
        "Total Amount",
      ],
    ],
    body: finalRows,
    startY: 55,
    margin: { top: 50, bottom: 32 },
    headerStyles: {
      fillColor: [128, 128, 128], // Change the color here, e.g., red
      textColor: [255, 255, 255], // Header text color
    },
    theme: "grid",
    tableLineWidth: 0.5, // Border width for the whole table
    styles: {
      lineColor: [0, 0, 0], // Color for all borders
      textColor: [0, 0, 0],
      font: "times", // All text color
      fontSize: 10,
      // overflow: 'linebreak',
      // cellWidth: 'wrap',
    },
    columnStyles: {
      0: { cellWidth: "auto" }, // Example for the first column
      1: { cellWidth: "auto" }, // Example for the second column
      // You can specify auto or a specific width for each column
    },
    didParseCell: function (data) {
      data.cell.styles.halign = "center"; // Align all cell content to center
    },
  });

  // Add footer text to each page
  addFooter(doc1, companyinfo, reportTitle);

  // Save the PDF
  doc1.save(`${fileName}.pdf`);
};

const downloadProductionPDFPERBatch = (
  data,
  finishGoods,
  rawItemInfo,
  companyinfo,
  reportTitle
) => {
  const itemNames = finishGoods?.find(
    (item) => data?.productionItemName === item._id
  );

  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  // First table
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return date.toLocaleString("en-US", options);
  };
  const formatDate1 = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  const checkExcessOrLessProductionQty = data?.productionStatus === "Less";

  const formattedProductionDate = formatDate1(data.productionDate);
  const formatteProductionStartDate = formatDate(data.productionStart);
  const formattedPRoductionEndDate = formatDate(data.productionEnd);
  const xCoordinate = 20;
  const labelWidth = 40;
  const labelWidth2 = 80;
  const extraSpace = 25;
  const textY = 60;

  // Left side text
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Batch No", xCoordinate, textY);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(`:${data.batchNo}`, xCoordinate + labelWidth, textY);
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Production Date", xCoordinate, textY + 5);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(`:${formattedProductionDate}`, xCoordinate + labelWidth, textY + 5);
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Production Start", xCoordinate, textY + 10);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(
    `:${formatteProductionStartDate}`,
    xCoordinate + labelWidth,
    textY + 10
  );
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Production End", xCoordinate, textY + 15);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(
    `:${formattedPRoductionEndDate}`,
    xCoordinate + labelWidth,
    textY + 15
  );
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Total Hour", xCoordinate, textY + 20);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(`:${data.totalHour}`, xCoordinate + labelWidth, textY + 20);
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Total Batch", xCoordinate, textY + 25);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(`:${data.totalBatch}`, xCoordinate + labelWidth, textY + 25);

  // Right side text
  const rightXCoordinate = pageWidth - xCoordinate - labelWidth2; // X-coordinate for the right side
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Production Item Name", rightXCoordinate, textY);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(
    `:${itemNames?.itemName}`,
    rightXCoordinate + labelWidth + extraSpace,
    textY
  );

  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Production Qty", rightXCoordinate, textY + 5);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(
    `:${data.productionQty}`,
    rightXCoordinate + labelWidth + extraSpace,
    textY + 5
  );

  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Wastage Qty", rightXCoordinate, textY + 10);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(
    `:${data.wastageQty}`,
    rightXCoordinate + labelWidth + extraSpace,
    textY + 10
  );

  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Expected Production Qty (Per Batch)", rightXCoordinate, textY + 15);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(
    `:${data.expectedProductionQtyPerBatch}`,
    rightXCoordinate + labelWidth + extraSpace,
    textY + 15
  );

  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Expected Production Qty", rightXCoordinate, textY + 20);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(
    `:${data.expectedProductionQty}`,
    rightXCoordinate + labelWidth + extraSpace,
    textY + 20
  );

  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Excess Or Less Production Qty", rightXCoordinate, textY + 25);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  if (checkExcessOrLessProductionQty) {
    doc.setTextColor(255, 0, 0); // Set color to red (RGB: 255, 0, 0)
  } else {
    doc.setTextColor(0, 0, 0); // Set color to black (RGB: 0, 0, 0)
  }
  doc.text(
    `: ${
      checkExcessOrLessProductionQty
        ? `(${data.excessOrLessProductionQty})`
        : data.excessOrLessProductionQty
    }`,
    rightXCoordinate + labelWidth + extraSpace,
    textY + 25
  );

  // Calculate the position for the second table
  const finalY = doc.previousAutoTable.finalY || 80;

  // Second table
  const finalRows = data?.detailsData?.map((row, index) => [
    index + 1,
    rawItemInfo
      ?.filter((rawItem) => rawItem._id === row.itemId)
      .map((filteredItem) => filteredItem.itemName)
      .join(", "),
    row.receipe,
    row.materialUsed,
    row.asPerRatio,
    row.excess,
    row.less,
  ]);
  doc.autoTable({
    head: [
      [
        "Sl.",
        "Item Name",
        "Receipe",
        "Material Used",
        "As Per Ratio",
        "Excess",
        "Less",
      ],
    ],
    body: finalRows,
    startY: finalY + 10, // Start the second table a bit below the first one
    margin: { top: 50, bottom: 32 },
    headerStyles: {
      fillColor: [128, 128, 128], // Header background color
      textColor: [255, 255, 255], // Header text color
    },
    theme: "grid",
    tableLineWidth: 0.5, // Border width for the whole table
    styles: {
      lineColor: [0, 0, 0], // Color for all borders
      textColor: [0, 0, 0],
      font: "times", // Font
      fontSize: 10,
      overflow: "linebreak",
      cellWidth: "wrap",
    },
    columnStyles: {
      0: { cellWidth: "auto" }, // Example for the first column
      1: { cellWidth: "auto" }, // Example for the second column
    },
    didParseCell: function (data) {
      data.cell.styles.halign = "center"; // Align all cell content to center
    },
  });

  // Add footer text to each page
  addFooter1(doc, companyinfo, reportTitle);

  // Save the PDF
  doc.save(`${fileName}.pdf`);
};

const downloadPaymentReceivedPDF = (
  row,
  data,
  customerInfo,
  finishGoods,
  invoiceData,
  itemsizeinfo,
  bankInformation,
  companyinfo,
  reportTitle
) => {
  console.log(data);
  const customerName = customerInfo?.find((x) => x._id === row?.clientId);
  const currency = invoiceData?.find((x) => x.invoiceNo === row?.piNumber);
  const itemNames = finishGoods?.find(
    (rawItem) => rawItem._id === row.detail.itemId
  );
  const filteredItemSize = itemsizeinfo?.find(
    (x) => x?._id === itemNames?.sizeId
  );

  const matchPI = invoiceData?.find((x) => x.invoiceNo === row?.piNumber);

  // const totalNetQuantity=
  const filterIPQuantity = matchPI.detailsData.find((item) =>
    row.detailsData.some((row) => row.itemId === item.itemId)
  );

  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const doc = new jsPDF({
    orientation: "landscape",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  const formatDate1 = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const xCoordinate = 20;
  const labelWidth = 40;

  const textY = 60;

  // Left side text
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Client Name", xCoordinate, textY);
  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.text(`:${customerName.clientName}`, xCoordinate + labelWidth, textY);
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("PI Number", xCoordinate, textY + 6);
  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.text(`:${row.piNumber}`, xCoordinate + labelWidth, textY + 6);
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Item Name", xCoordinate, textY + 12);
  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.text(
    `:${itemNames.itemName} (${filteredItemSize?.sizeInfo || "N/A"})`,
    xCoordinate + labelWidth,
    textY + 12
  );
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Currency", xCoordinate, textY + 18);
  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.text(`:${currency.currency}`, xCoordinate + labelWidth, textY + 18);
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("PI Quantity", xCoordinate, textY + 24);
  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.text(
    `:${filterIPQuantity.quantity.toLocaleString()}`,
    xCoordinate + labelWidth,
    textY + 24
  );
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("PI Amount", xCoordinate, textY + 30);
  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.text(
    `:${filterIPQuantity.totalAmount.toLocaleString()}`,
    xCoordinate + labelWidth,
    textY + 30
  );

  // Calculate the position for the second table
  const finalY = doc.previousAutoTable.finalY || 90;
  const flattenedRows = data.flat();
  const formatDate = (adjustDate) => {
    const date = new Date(adjustDate);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  const totaladjustmentItemsQuantity = flattenedRows.reduce(
    (accumulator, row) => {
      return row.paymentStatus === "adjustment"
        ? accumulator + row.quantity
        : accumulator;
    },
    0
  );
  const totaladjustmentItemsAmount = flattenedRows.reduce(
    (accumulator, row) => {
      return row.paymentStatus === "adjustment"
        ? accumulator + row.amount
        : accumulator;
    },
    0
  );
  const totalCashItemsQuantity = flattenedRows.reduce((accumulator, row) => {
    return row.paymentStatus === "cash"
      ? accumulator + row.quantity
      : accumulator;
  }, 0);

  const totalCashItemsAmount = flattenedRows.reduce((accumulator, row) => {
    return row.paymentStatus === "cash"
      ? accumulator + row.amount
      : accumulator;
  }, 0);

  const totalNetQuantity =
    totalCashItemsQuantity - totaladjustmentItemsQuantity;
  const totalNetAmount = totalCashItemsAmount - totaladjustmentItemsAmount;

  const finalRows = data?.map((rows, index) => {
    console.log(rows);
    const cashItemQuantity = rows.map((row) => {
      return row.paymentStatus === "cash" ? row.quantity : 0;
    });
    const cashItemAmount = rows.map((row) => {
      return row.paymentStatus === "cash" ? row.amount : 0;
    });

    const adjustmentItemsAmount = rows.map((row) => {
      return row.paymentStatus === "adjustment" ? row.amount : 0;
    });

    const adjustmentItemsQuantity = rows.map((row) => {
      return row.paymentStatus === "adjustment" ? row.quantity : 0;
    });
    const adjustDates = rows
      .filter((row) => row.paymentStatus === "adjustment")
      .map((row) => row.paymentReceiveDate);
    const formattedDates = adjustDates.map((adjustDate) =>
      formatDate(adjustDate)
    );
    const cashPaymentDates = rows
      .filter((row) => row.paymentStatus === "cash")
      .map((row) => row.paymentReceiveDate);
    const formattedCashPaymentDates = cashPaymentDates.map((adjustDate) =>
      formatDate(adjustDate) 
    );

    const paymentStatus = rows.map((row) => {
      return row.paymentStatus;
    });
    const depositeSlipNo = rows.map((row) => {
      return row.depositeSlipNo ? row.depositeSlipNo : "N/A" ;
    });
    const chequeNo = rows.map((row) => {
      return row.chequeNo ? row.chequeNo : "N/A";
    });

    const matchedBankNames = rows.map((bankinfo) => {
      const matchedBank = bankInformation.find(
        (bank) => bank._id === bankinfo.bankId
      );
      return matchedBank ? matchedBank.bankName : "N/A";
    });

    const netQuantity = cashItemQuantity - adjustmentItemsQuantity;
    const netAmount = cashItemAmount - adjustmentItemsAmount;

    return [
      index + 1,
      matchedBankNames ? matchedBankNames : "Cash",
      paymentStatus ? paymentStatus : "N/A",
      chequeNo ? chequeNo : "N/A",
      depositeSlipNo ? depositeSlipNo : "N/A",
      formattedCashPaymentDates ? formattedCashPaymentDates : "N/A",
      cashItemQuantity == 0 ? "-" : cashItemQuantity,
      cashItemAmount == 0 ? "-" : cashItemAmount,
      formattedDates ? formattedDates : "N/A",
      adjustmentItemsQuantity == 0 ? "-" : adjustmentItemsQuantity,
      adjustmentItemsAmount == 0 ? "-" : adjustmentItemsAmount,
      netQuantity < 0 ? `(${Math.abs(netQuantity)})` : netQuantity,
      netAmount < 0 ? `(${Math.abs(netAmount)})` : netAmount,
    ];
  });

  finalRows.push([
    {
      content: "Total",
      colSpan:6,
      styles: { halign: "right", fontStyle: "bold" },
    },
    totalCashItemsQuantity.toLocaleString(),
    totalCashItemsAmount.toLocaleString(),
    "",
    totaladjustmentItemsQuantity.toLocaleString(),
    totaladjustmentItemsAmount.toLocaleString(),
    totalNetQuantity.toLocaleString(),
    totalNetAmount.toLocaleString(),
  ]);
  doc.autoTable({
    head: [
      [
        "Sl.",
        "Bank Name",
        "Payment Status",
        "Cheque No",
        "Deposite Slip No",
        "Payment Paid Date",
        "Paid Quantity",
        "Paid Amount",
        "Adjust Payment Date",
        "Adjust Quantity",
        "Adjust Amount",
        "Net Quantity",
        "Net Amount",
      ],
    ],

    body: finalRows,
    startY: finalY + 10,
    margin: { top: 50, bottom: 32 },
    headerStyles: {
      fillColor: [128, 128, 128],
      textColor: [255, 255, 255],
    },
    theme: "grid",
    tableLineWidth: 0.5,
    styles: {
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
      font: "times",
      fontSize: 8,
      overflow: "linebreak",
      cellWidth: "wrap",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: "auto" },
    },
    didParseCell: function (data) {
      data.cell.styles.halign = "center";
      const lastRowIndex = data.table.body.length - 1;
  
      if (data.row.index === lastRowIndex) {
        // Right-align and make the font bold for the last row
        // data.cell.styles.halign = "right";
        data.cell.styles.fontSize = 10;
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // Add footer text to each page
  addFooterForPaymentReceive(doc, companyinfo, reportTitle);

  // Save the PDF
  doc.save(`${fileName}.pdf`);
};
const downloadPaymentReceivedAllSelectedPIPDF = (
  row,
  data,
  customerInfo,
  finishGoods,
  invoiceData,
  itemsizeinfo,
  companyinfo,
  reportTitle
) => {
  const customerName = customerInfo?.find((x) => x._id === row?.clientId);
  const currency = invoiceData?.find((x) => x.invoiceNo === row?.piNumber);

  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const doc = new jsPDF({
    orientation: "landscape",
  });
  const pageWidth = doc.internal.pageSize.getWidth();

  const formatDate1 = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formattedProductionDate = formatDate1(data.productionDate);

  const xCoordinate = 20;
  const labelWidth = 40;

  const textY = 60;

  // Left side text
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("Client Name", xCoordinate, textY);
  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.text(`:${customerName.clientName}`, xCoordinate + labelWidth, textY);
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.text("PI Number", xCoordinate, textY + 7);
  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.text(`:${row.piNumber}`, xCoordinate + labelWidth, textY + 7);

  // Calculate the position for the second table
  const finalY = doc.previousAutoTable.finalY || 65;
  const flattenedRows = data.flat();
  const totaladjustmentItemsQuantity = flattenedRows.reduce(
    (accumulator, row) => {
      return row.paymentStatus === "adjustment"
        ? accumulator + row.quantity
        : accumulator;
    },
    0
  );
  const totaladjustmentItemsAmount = flattenedRows.reduce(
    (accumulator, row) => {
      return row.paymentStatus === "adjustment"
        ? accumulator + row.amount
        : accumulator;
    },
    0
  );
  // const totalIPQuantity = currency.detailsData.reduce((accumulator, item) => {
  //   const matchingRow = data.some((row) => row.itemId === item.itemId);
  //   return matchingRow.reduce((accumulator, row) => {
  //     return  accumulator + row.quantity;
  //   }, 0);
  // }, 0);
  const findPI = invoiceData?.filter((x) => x.invoiceNo === row?.piNumber);
  console.log(findPI);
  const totalIPAmount = currency.detailsData.reduce((accumulator, item) => {
    const matchingRow = flattenedRows.filter(
      (row) => row.itemId === item.itemId
    );
    console.log(matchingRow);
    return matchingRow ? accumulator + (item.totalAmount || 0) : accumulator;
  }, 0);
  console.log(currency);
  const finalRows = data?.map((rows, index) => {
    console.log(rows);
    const itemNames = rows.map((row) => {
      const matchedItem = finishGoods?.find(
        (rawItem) => rawItem._id === row.itemId
      );
      const filteredItemSize = itemsizeinfo?.find(
        (x) => x?._id === matchedItem?.sizeId
      );
      return matchedItem
        ? `${matchedItem.itemName} (${filteredItemSize?.sizeInfo || "N/A"})`
        : "Item Not Found";
    });
    const cashItemQuantity = rows.map((row) => {
      return row.paymentStatus === "cash" ? row.amount : 0;
    });
    const cashItemAmount = rows.map((row) => {
      return row.paymentStatus === "cash" ? row.amount : 0;
    });
    const adjustmentItemsAmount = rows.map((row) => {
      return row.paymentStatus === "adjustment" ? row.amount : 0;
    });

    const adjustmentItemsQuantity = rows.map((row) => {
      return row.paymentStatus === "adjustment" ? row.quantity : 0;
    });

    const netQuantity = cashItemQuantity - adjustmentItemsQuantity;
    const netAmount = cashItemAmount - adjustmentItemsAmount;
    const matchPI = invoiceData?.find((x) => x.invoiceNo === row?.piNumber);
    console.log(cashItemAmount);
    // const totalNetQuantity=
    const filterIPQuantity = matchPI.detailsData.find((item) =>
      rows.some((row) => row.itemId === item.itemId)
    );
    const totalCashItemQuantity = Object.keys(cashItemQuantity).reduce(
      (sum, key) => {
        return sum + cashItemQuantity[key][0]; // Summing each value in the array
      },
      0
    );

    console.log(totalCashItemQuantity);
    return [
      index + 1,
      itemNames,
      currency.currency,
      filterIPQuantity?.quantity === 0
        ? "-"
        : (filterIPQuantity?.quantity).toLocaleString(),
      filterIPQuantity?.totalAmount === 0
        ? "-"
        : (filterIPQuantity?.totalAmount).toLocaleString(),
      cashItemQuantity == 0 ? "-" : cashItemQuantity,
      cashItemAmount == 0 ? "-" : cashItemAmount,
      adjustmentItemsQuantity == 0 ? "-" : adjustmentItemsQuantity,
      adjustmentItemsAmount == 0 ? "-" : adjustmentItemsAmount,
      netQuantity < 0 ? `(${Math.abs(netQuantity)})` : netQuantity,
      netAmount,
    ];
  });

  finalRows.push([
    {
      content: "Total",
      colSpan: 3,
      styles: { halign: "right", fontStyle: "bold" },
    },
    "",
    "",
    "",
    "",
    totaladjustmentItemsQuantity,
    totaladjustmentItemsAmount,
  ]);
  doc.autoTable({
    // head: [
    //   [
    //     "Sl.",
    //     "Item Name",
    //     "Currency",
    //     "PI Quantity",
    //     "PI Amount",
    //     "Paid Quantity",
    //     "Paid Amount",
    //     "Adjust Quantity",
    //     "Adjust Amount",
    //     "Net Quantity",
    //     "Net Amount",
    //   ],
    // ],
    html: "#my-paymnet-receive-table",
    // body: finalRows,
    startY: finalY + 10, // Start the second table a bit below the first one
    margin: { top: 50, bottom: 32 },
    headerStyles: {
      fillColor: [128, 128, 128], // Header background color
      textColor: [255, 255, 255], // Header text color
    },
    theme: "grid",
    tableLineWidth: 0.5, // Border width for the whole table
    styles: {
      lineColor: [0, 0, 0], // Color for all borders
      textColor: [0, 0, 0],
      font: "times", // Font
      fontSize: 10,
      overflow: "linebreak",
      cellWidth: "wrap",
    },
    columnStyles: {
      0: { cellWidth: "auto" }, // Example for the first column
      1: { cellWidth: "auto" }, // Example for the second column
    },
    didParseCell: function (data) {
      data.cell.styles.halign = "center";
      // Align all cell content to center
    },
  });

  // Add footer text to each page
  addFooterForPaymentReceive(doc, companyinfo, reportTitle);

  // Save the PDF
  doc.save(`${fileName}.pdf`);
};

const downloadAllPDF = (companyinfo, reportTitle) => {
  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const doc = new jsPDF();

  doc.autoTable({
    html: "#my-table2",
    startY: 50,
    margin: { top: 50, bottom: 32 },
    headerStyles: {
      fillColor: [128, 128, 128],
      textColor: [255, 255, 255],
    },
    theme: "grid",
    tableLineWidth: 0.5,
    styles: {
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
      font: "times",
      fontSize: 10,
    },
    didParseCell: function (data) {
      data.cell.styles.halign = "center";
    },
  });

  addFooter(doc, companyinfo, reportTitle);

  doc.save(`${fileName}.pdf`);
};

const downloadInactivePDF = (companyinfo, reportTitle) => {
  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const doc = new jsPDF();
  console.log(companyinfo);
  doc.autoTable({
    html: "#my-tableInactive",
    startY: 50,
    margin: { top: 50, bottom: 32 },
    headerStyles: {
      fillColor: [128, 128, 128], // Change the color here, e.g., red
      textColor: [255, 255, 255], // Header text color
    },
    theme: "grid",
    tableLineWidth: 0.5, // Border width for the whole table
    styles: {
      lineColor: [0, 0, 0], // Color for all borders
      textColor: [0, 0, 0],
      font: "times", // All text color
      fontSize: 10,
    },
    didParseCell: function (data) {
      data.cell.styles.halign = "center"; // Align all cell content to center
    },
  });

  // Add footer text to each page
  addFooter(doc, companyinfo, reportTitle);

  // Save the PDF
  doc.save(`${fileName}.pdf`);
};

const getBase64Image = (imgUrl, callback) => {
  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous"); // Allow cross-origin image loading
  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const fixedWidth = 300;
    const fixedHeight = 300;

    canvas.width = fixedWidth;
    canvas.height = fixedHeight;

    // Draw image onto canvas
    ctx.drawImage(this, 0, 0, fixedWidth, fixedHeight);

    const dataURL = canvas.toDataURL("image/png");
    callback(dataURL);
  };
  img.src = imgUrl;
};

const downloadImage = async (data, companyinfo, reportTitle) => {
  console.log(data);
  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const doc = new jsPDF();
  const processedData = await Promise.all(
    data.map((item) => {
      return new Promise((resolve) => {
        getBase64Image(
          `${process.env.REACT_APP_BASE_URL}/${item?.image}`,
          (base64Image) => {
            resolve({
              image: base64Image,
              makeDate: new Date(item.makeDate).toLocaleDateString("en-CA"),
            });
          }
        );
      });
    })
  );

  const finalRows = processedData.map((row, index) => [
    index + 1,
    row.makeDate,
    { content: "", image: row.image, width: 60, height: 40 },
  ]);

  doc.autoTable({
    head: [["Sl.", "Make Date", "Image"]],
    body: finalRows,
    startY: 50,
    margin: { top: 50, bottom: 32 },
    headerStyles: {
      fillColor: [128, 128, 128],
      textColor: [255, 255, 255],
    },
    theme: "grid",
    tableLineWidth: 0.5,
    styles: {
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
      font: "times",
      fontSize: 10,

      valign: "middle",
      halign: "center",
    },

    columnStyles: {
      0: { cellPadding: 2, cellWidth: 10 },
      // 1: { cellPadding: 2, cellWidth: 40 },
      2: {
        cellPadding: { top: 15, right: 5, bottom: 15, left: 5 },
        cellWidth: 60,
      },
    },

    didParseCell: function (data) {
      data.cell.styles.halign = "center";
    },

    didDrawCell: function (data) {
      console.log(data.cell.minWidth);
      if (data.column.index === 2 && data.cell.section === "body") {
        const imageSize = 30;
        const cellHeight = data.cell.height;
        const cellPaddingTop = data.cell.styles.cellPadding.top || 0;
        const cellPaddingBottom = data.cell.styles.cellPadding.bottom || 0;
        const imageMargin =
          (cellHeight - imageSize - cellPaddingTop - cellPaddingBottom) / 2;
        doc.addImage(
          data.cell.raw.image,
          "PNG",
          data.cell.x + 10,
          data.cell.y + cellPaddingTop + imageMargin,
          imageSize,
          imageSize
        );
      }
    },
  });

  addFooter(doc, companyinfo, reportTitle);

  doc.save(`${fileName}.pdf`);
};

const downloadAllImage = async (data, companyinfo, reportTitle) => {
  console.log(data);
  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const doc = new jsPDF();
  const processedData = await Promise.all(
    data.map((item) => {
      return new Promise((resolve) => {
        getBase64Image(
          `${process.env.REACT_APP_BASE_URL}/${item?.image}`,
          (base64Image) => {
            resolve({
              image: base64Image,
              makeDate: new Date(item.makeDate).toLocaleDateString("en-CA"),
              status: item.status,
            });
          }
        );
      });
    })
  );

  const finalRows = processedData.map((row, index) => [
    index + 1,
    row.makeDate,
    { content: "", image: row.image, width: 60, height: 40 },
    row?.status,
  ]);

  doc.autoTable({
    head: [["Sl.", "Make Date", "Image", "Status"]],
    body: finalRows,
    startY: 50,
    margin: { top: 50, bottom: 32 },
    headerStyles: {
      fillColor: [128, 128, 128],
      textColor: [255, 255, 255],
    },
    theme: "grid",
    tableLineWidth: 0.5,
    styles: {
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
      font: "times",
      fontSize: 10,

      valign: "middle",
      halign: "center",
    },

    columnStyles: {
      0: { cellPadding: 2, cellWidth: 10 },
      // 1: { cellPadding: 2, cellWidth: 40 },
      2: {
        cellPadding: { top: 15, right: 5, bottom: 15, left: 5 },
        cellWidth: 60,
      },
    },

    didParseCell: function (data) {
      data.cell.styles.halign = "center";
    },

    didDrawCell: function (data) {
      console.log(data.cell.minWidth);
      if (data.column.index === 2 && data.cell.section === "body") {
        const imageSize = 30;
        const cellHeight = data.cell.height;
        const cellPaddingTop = data.cell.styles.cellPadding.top || 0;
        const cellPaddingBottom = data.cell.styles.cellPadding.bottom || 0;
        const imageMargin =
          (cellHeight - imageSize - cellPaddingTop - cellPaddingBottom) / 2;
        doc.addImage(
          data.cell.raw.image,
          "PNG",
          data.cell.x + 10,
          data.cell.y + cellPaddingTop + imageMargin,
          imageSize,
          imageSize
        );
      }
    },
  });

  addFooter(doc, companyinfo, reportTitle);

  doc.save(`${fileName}.pdf`);
};

const addFooter = (doc, companyinfo, reportTitle, fromDate, toDate) => {
  const pageCount = doc.internal.getNumberOfPages(); // Get the total number of pages
  const logoWidthPercentage = 0.15; // 15% of page width for the logo
  const detailsWidthPercentage = 0.8;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i); // Go to page i
    const headerHeight = 35; // Adjust this value according to your header height
    // Set space between elements
    const spaceBetween = 15; // Adjust this value as needed

    // Start Y position for content (table starts below header)
    const contentStartY = headerHeight + spaceBetween;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const headerY = 10;
    const footerY = pageHeight - 10;

    // Header content

    // const logoWidth = pageWidth * logoWidthPercentage;
    // const logoHeight = logoWidth * (40 / 40);
    // doc.addImage(logoImage, 'PNG', 10, headerY, logoWidth,logoHeight);
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.companyName) {
        var companyNameUpper =
          companyinfo?.companyinfo[0]?.companyName.toUpperCase();
      }
    }

    // const detailsX = logoWidth + 20;

    const companyDetailsWidth = pageWidth * detailsWidthPercentage;
    doc.setFont("times", "italic");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    // Set font to helvetica (or any other font you prefer)
    doc.text(companyNameUpper, doc.internal.pageSize.width / 2, headerY + 7, {
      align: "center",
      width: companyDetailsWidth,
    });
    doc.setLineWidth(0.5);
    doc.line(
      10,
      contentStartY,
      doc.internal.pageSize.width - 10,
      contentStartY
    ); // Change 10 to your left margin and right margin respectively

    doc.setFont("normal"); // Reset font style
    doc.setFontSize(10); // Reset font size
    // doc.setFont("helvetica");
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.companyAddress) {
        doc.text(
          companyinfo?.companyinfo[0]?.companyAddress,
          doc.internal.pageSize.width / 2,
          headerY + 14,
          { align: "center", width: companyDetailsWidth }
        );
      }
      if (companyinfo?.companyinfo[0].companyContact) {
        doc.text(
          companyinfo?.companyinfo[0]?.companyContact,
          doc.internal.pageSize.width / 2,
          headerY + 19,
          { align: "center", width: companyDetailsWidth }
        );
      }
      if (companyinfo?.companyinfo[0].companyEmail) {
        doc.text(
          companyinfo?.companyinfo[0]?.companyEmail,
          doc.internal.pageSize.width / 2,
          headerY + 24,
          { align: "center", width: companyDetailsWidth }
        );
      }
    }

    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text(`${reportTitle}`, doc.internal.pageSize.width / 2, headerY + 32, {
      align: "center",
      width: companyDetailsWidth,
    });
    if (fromDate && toDate) {
      doc.setFontSize(11);
      doc.setFont("times", "bold");
      doc.text(
        `AS OF DATED ${fromDate} TO ${toDate}`,
        doc.internal.pageSize.width / 2,
        headerY + 36,
        {
          align: "center",
          maxWidth: companyDetailsWidth,
        }
      );
    }
    // Footer content
    doc.setFontSize(10);
    doc.setFont("times", "italic");
    doc.text("Page " + i + " of " + pageCount, pageWidth - 20, footerY, {
      align: "right",
    });

    // Software generated report aligned to the center
    doc.text("Software Generated report", pageWidth / 2, footerY, {
      align: "center",
    });

    // Copyright aligned to the left
    doc.text("Copyright@2024", 20, footerY, { align: "left" });

    doc.setLineWidth(0.5); // Calculate Y position for top line in footer
    doc.line(10, footerY - 15, doc.internal.pageSize.width - 10, footerY - 15); // Draw line above footer
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.footerAddress) {
        doc.text(
          companyinfo?.companyinfo[0]?.footerAddress,
          pageWidth / 2,
          footerY - 10,
          {
            align: "center",
          }
        );
      }
      if (companyinfo?.companyinfo[0]?.footerContact) {
        doc.text(
          companyinfo?.companyinfo[0]?.footerContact,
          pageWidth / 2,
          footerY - 5,
          {
            align: "center",
          }
        );
      }
    }
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

const addFooter1 = (doc, companyinfo, reportTitle) => {
  const pageCount = doc.internal.getNumberOfPages(); // Get the total number of pages
  const logoWidthPercentage = 0.15; // 15% of page width for the logo
  const detailsWidthPercentage = 0.8;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i); // Go to page i
    const headerHeight = 35; // Adjust this value according to your header height
    // Set space between elements
    const spaceBetween = 15; // Adjust this value as needed

    // Start Y position for content (table starts below header)
    const contentStartY = headerHeight + spaceBetween;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const headerY = 10;
    const footerY = pageHeight - 10;

    // Header content

    // const logoWidth = pageWidth * logoWidthPercentage;
    // const logoHeight = logoWidth * (40 / 40);
    // doc.addImage(logoImage, 'PNG', 10, headerY, logoWidth,logoHeight);
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.companyName) {
        var companyNameUpper =
          companyinfo?.companyinfo[0]?.companyName.toUpperCase();
      }
    }

    // const detailsX = logoWidth + 20;

    const companyDetailsWidth = pageWidth * detailsWidthPercentage;
    doc.setFont("times", "italic");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    // Set font to helvetica (or any other font you prefer)
    doc.text(companyNameUpper, doc.internal.pageSize.width / 2, headerY + 7, {
      align: "center",
      width: companyDetailsWidth,
    });
    doc.setLineWidth(0.5);
    doc.line(
      10,
      contentStartY,
      doc.internal.pageSize.width - 10,
      contentStartY
    ); // Change 10 to your left margin and right margin respectively

    doc.setFont("normal"); // Reset font style
    doc.setFontSize(10); // Reset font size
    // doc.setFont("helvetica");
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.companyAddress) {
        doc.text(
          companyinfo?.companyinfo[0]?.companyAddress,
          doc.internal.pageSize.width / 2,
          headerY + 14,
          { align: "center", width: companyDetailsWidth }
        );
      }
      if (companyinfo?.companyinfo[0].companyContact) {
        doc.text(
          companyinfo?.companyinfo[0]?.companyContact,
          doc.internal.pageSize.width / 2,
          headerY + 19,
          { align: "center", width: companyDetailsWidth }
        );
      }
      if (companyinfo?.companyinfo[0].companyEmail) {
        doc.text(
          companyinfo?.companyinfo[0]?.companyEmail,
          doc.internal.pageSize.width / 2,
          headerY + 24,
          { align: "center", width: companyDetailsWidth }
        );
      }
    }

    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text(
      `${reportTitle} - BATCH WAYS`,
      doc.internal.pageSize.width / 2,
      headerY + 35,
      {
        align: "center",
        width: companyDetailsWidth,
      }
    );

    // Footer content
    doc.setFontSize(10);
    doc.setFont("times", "italic");
    doc.text("Page " + i + " of " + pageCount, pageWidth - 20, footerY, {
      align: "right",
    });

    // Software generated report aligned to the center
    doc.text("Software Generated report", pageWidth / 2, footerY, {
      align: "center",
    });

    // Copyright aligned to the left
    doc.text("Copyright@2024", 20, footerY, { align: "left" });

    doc.setLineWidth(0.5); // Calculate Y position for top line in footer
    doc.line(10, footerY - 15, doc.internal.pageSize.width - 10, footerY - 15); // Draw line above footer
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.footerAddress) {
        doc.text(
          companyinfo?.companyinfo[0]?.footerAddress,
          pageWidth / 2,
          footerY - 10,
          {
            align: "center",
          }
        );
      }
      if (companyinfo?.companyinfo[0]?.footerContact) {
        doc.text(
          companyinfo?.companyinfo[0]?.footerContact,
          pageWidth / 2,
          footerY - 5,
          {
            align: "center",
          }
        );
      }
    }
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
const addFooterForPaymentReceive = (doc, companyinfo, reportTitle) => {
  const pageCount = doc.internal.getNumberOfPages(); // Get the total number of pages
  const logoWidthPercentage = 0.15; // 15% of page width for the logo
  const detailsWidthPercentage = 0.8;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i); // Go to page i
    const headerHeight = 35; // Adjust this value according to your header height
    // Set space between elements
    const spaceBetween = 15; // Adjust this value as needed

    // Start Y position for content (table starts below header)
    const contentStartY = headerHeight + spaceBetween;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const headerY = 10;
    const footerY = pageHeight - 10;

    // Header content

    // const logoWidth = pageWidth * logoWidthPercentage;
    // const logoHeight = logoWidth * (40 / 40);
    // doc.addImage(logoImage, 'PNG', 10, headerY, logoWidth,logoHeight);
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.companyName) {
        var companyNameUpper =
          companyinfo?.companyinfo[0]?.companyName.toUpperCase();
      }
    }

    // const detailsX = logoWidth + 20;

    const companyDetailsWidth = pageWidth * detailsWidthPercentage;
    doc.setFont("times", "italic");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    // Set font to helvetica (or any other font you prefer)
    doc.text(companyNameUpper, doc.internal.pageSize.width / 2, headerY + 7, {
      align: "center",
      width: companyDetailsWidth,
    });
    doc.setLineWidth(0.5);
    doc.line(
      10,
      contentStartY,
      doc.internal.pageSize.width - 10,
      contentStartY
    ); // Change 10 to your left margin and right margin respectively

    doc.setFont("normal"); // Reset font style
    doc.setFontSize(10); // Reset font size
    // doc.setFont("helvetica");
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.companyAddress) {
        doc.text(
          companyinfo?.companyinfo[0]?.companyAddress,
          doc.internal.pageSize.width / 2,
          headerY + 14,
          { align: "center", width: companyDetailsWidth }
        );
      }
      if (companyinfo?.companyinfo[0].companyContact) {
        doc.text(
          companyinfo?.companyinfo[0]?.companyContact,
          doc.internal.pageSize.width / 2,
          headerY + 19,
          { align: "center", width: companyDetailsWidth }
        );
      }
      if (companyinfo?.companyinfo[0].companyEmail) {
        doc.text(
          companyinfo?.companyinfo[0]?.companyEmail,
          doc.internal.pageSize.width / 2,
          headerY + 24,
          { align: "center", width: companyDetailsWidth }
        );
      }
    }

    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text(`${reportTitle}`, doc.internal.pageSize.width / 2, headerY + 35, {
      align: "center",
      width: companyDetailsWidth,
    });

    // Footer content
    doc.setFontSize(10);
    doc.setFont("times", "italic");
    doc.text("Page " + i + " of " + pageCount, pageWidth - 20, footerY, {
      align: "right",
    });

    // Software generated report aligned to the center
    doc.text("Software Generated report", pageWidth / 2, footerY, {
      align: "center",
    });

    // Copyright aligned to the left
    doc.text("Copyright@2024", 20, footerY, { align: "left" });

    doc.setLineWidth(0.5); // Calculate Y position for top line in footer
    doc.line(10, footerY - 15, doc.internal.pageSize.width - 10, footerY - 15); // Draw line above footer
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.footerAddress) {
        doc.text(
          companyinfo?.companyinfo[0]?.footerAddress,
          pageWidth / 2,
          footerY - 10,
          {
            align: "center",
          }
        );
      }
      if (companyinfo?.companyinfo[0]?.footerContact) {
        doc.text(
          companyinfo?.companyinfo[0]?.footerContact,
          pageWidth / 2,
          footerY - 5,
          {
            align: "center",
          }
        );
      }
    }
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

export {
  downloadPDF,
  downloadAllPDF,
  downloadInactivePDF,
  downloadImage,
  downloadAllImage,
  downloadProductionPDF,
  downloadProductionPDFPERBatch,
  downloadPaymentReceivedPDF,
  downloadHeadingProductionPDF,
  downloadInvoiceSingleDataPDF,
};
