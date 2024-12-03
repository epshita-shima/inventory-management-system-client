import jsPDF from "jspdf";
import { toWords } from "number-to-words";
import { formatDate } from "../../Uitilites/DateUtilities";

const downloadInvoicePDF = async (
  data,
  finishGoodsItemInfo,
  customerInfo,
  unitInfo,
  sizeInfo,
  paymentData,
  reportImage,
  signature,
  companyinfo,
  reportTitle
) => {
  console.log(data);
  const customerFilterData = customerInfo.filter(
    (x) => x._id === data.customerID
  );
  const calculateTotalQuantity = data.detailsData.reduce((subTotal, item) => {
    return subTotal + item.quantity;
  }, 0);
  const calculateTotalAmount = data.detailsData.reduce((subTotal, item) => {
    return subTotal + item.totalAmount;
  }, 0);
  const matchesPaymentType = paymentData?.find(
    (payment) => payment._id === data.paymentId
  );
  console.log(matchesPaymentType);
  const numberInWords = toWords(parseInt(calculateTotalAmount));
  const companyContact = companyinfo.companyinfo[0].companyContact;
  const companyEmail = companyinfo.companyinfo[0].companyEmail;
  const factoryAddress = companyinfo.companyinfo[0].footerAddress;

  const phoneNumber = companyContact.split(",")[0].split(": ")[1].trim();
  const contactEmail = companyEmail.split(",")[0].split(": ")[1].trim();
  const factoryConvertAddress = factoryAddress.replace("Factory Address:", "");


  const formattedExpireDate = formatDate(data.expireDate);
  const formattedDelivaryDate = formatDate(data.piDate);

  const doc = new jsPDF();
  addFooterForPO(doc, companyinfo, reportTitle, reportImage);

  doc.setFontSize(10);
  doc.setFont("times", "bold");
  const xCoordinate = 10; // X coordinate for the label
  const labelWidth = 30; // Width allocated for labels
  let textY = 35;

  doc.text("Date", xCoordinate, textY);
  doc.text(`: ${formattedDelivaryDate}`, xCoordinate + labelWidth, textY);

  // PO Date
  doc.text("Expire Date", xCoordinate, textY + 5);
  doc.text(`: ${formattedExpireDate}`, xCoordinate + labelWidth, textY + 5);

  doc.text("Invoice No", xCoordinate, textY + 10);
  doc.text(`: ${data.invoiceNo}`, xCoordinate + labelWidth, textY + 10);

  const customerInfoHeaderY = textY + 20; // Adjust this value for spacing
  addCustomerInformationHeader(doc, customerInfoHeaderY);

  doc.setFontSize(10);
  doc.setFont("times", "bold");
  const additionalTextY = customerInfoHeaderY + 10;
  doc.text("Customer Name", xCoordinate, additionalTextY);
  doc.text(
    `: ${customerFilterData[0].contactPerson}`,
    xCoordinate + labelWidth,
    additionalTextY
  );
  doc.text("Company Name", xCoordinate, additionalTextY + 5);
  doc.text(
    `: ${customerFilterData[0].clientName}`,
    xCoordinate + labelWidth,
    additionalTextY + 5
  );
  doc.text("Address", xCoordinate, additionalTextY + 10);
  doc.text(
    `: ${customerFilterData[0].address}`,
    xCoordinate + labelWidth,
    additionalTextY + 10
  );
  doc.text("Mobile No", xCoordinate, additionalTextY + 15);
  doc.text(
    `: ${customerFilterData[0].mobileNo}`,
    xCoordinate + labelWidth,
    additionalTextY + 15
  );

  const finalRows = data?.detailsData?.map((row, index) => [
    index + 1,
    finishGoodsItemInfo
      ?.filter((rawItem) => rawItem._id === row.itemId)
      .map((filteredItem) =>
        sizeInfo
          .filter((x) => x._id == filteredItem.sizeId)
          .map((size) => {
            return `${filteredItem.itemName} (Size: ${size.sizeInfo})`;
          })
      )
      .join(", "),
    finishGoodsItemInfo
      ?.filter((rawItem) => rawItem._id === row.itemId)
      .map((filteredItem) =>
        unitInfo
          .filter((x) => x._id == filteredItem.unitId)
          .map((unit) => unit.unitInfo)
      )
      .join(", "),
    row.quantity.toLocaleString(),
    data.currency,
    row.unitPrice.toLocaleString(),
    row.totalAmount.toLocaleString(),
  ]);
  textY = addTableContent(doc, finalRows, textY + 50);
  // Add totals to the rows with colSpan

  function addTableContent(doc, finalRows, startY) {
    finalRows.push([
      {
        content: "Total",
        colSpan: 3,
        styles: { halign: "right", fontStyle: "bold" },
      },
      calculateTotalQuantity.toLocaleString(),
      "",
      "",
      calculateTotalAmount.toLocaleString(),
    ]);
    finalRows.push([
      {
        content: `SAY IN WORDS : ${
          numberInWords.charAt(0).toUpperCase() + numberInWords.slice(1)
        } only`,
        colSpan: 6,
        styles: { halign: "left", fontStyle: "bold" },
      },
    ]);
    doc.autoTable({
      head: [
        [
          "Sl.",
          "Item Name With Description",
          "Unit",
          "Quantity",
          "Currency",
          "Unit Price",
          "Total Amount",
        ],
      ],
      body: finalRows,
      startY: startY,
      margin: { top: 50, bottom: 32, left: 10, right: 10 },
      headerStyles: {
        fillColor: [128, 128, 128], // Change the color here, e.g., red
        textColor: [255, 255, 255], // Header text color
      },
      theme: "grid",
      tableWidth: "auto",
      tableLineWidth: 0.5, // Border width for the whole table
      styles: {
        lineColor: [0, 0, 0], // Color for all borders
        textColor: [0, 0, 0],
        font: "times", // All text color
        fontSize: 10,
      },
      didParseCell: function (data) {
        const rowIndex = data.row.index;
        const totalRows = data.table.body.length;
        const columnIndex = data.column.index;

        data.cell.styles.halign = "center";

        if (columnIndex === 3) {
          data.cell.styles.halign = "center";
        }
        if (columnIndex === 6) {
          data.cell.styles.halign = "right";
        }

        if (columnIndex === 1) {
          data.cell.styles.halign = "left";
        }

        if (rowIndex === totalRows - 1) {
          data.cell.styles.fontStyle = "bold";
        }

        if (rowIndex === totalRows - 2) {
          data.cell.styles.fontStyle = "bold";
        }

        if (rowIndex === totalRows - 2 && columnIndex === 0) {
          data.cell.styles.halign = "right";
          data.cell.styles.fontStyle = "bold";
        }

        if (rowIndex === totalRows - 1) {
          data.cell.styles.halign = "left";
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fontSize = "11";
        }
      },
    });
    return doc.previousAutoTable.finalY;
  }
  addContent(doc, xCoordinate, labelWidth, textY);

  function addContent(doc, xCoordinate, labelWidth, textY) {
    const pageHeight = doc.internal.pageSize.getHeight();

    const conditionInfoHeaderY = textY + 12;
    conditionInformationHeader(doc, conditionInfoHeaderY);
    doc.setFontSize(10);
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.setFont("times", "bold");
    const additionalConditionTextY = conditionInfoHeaderY + 12;

    doc.text("Payment Terms", xCoordinate, additionalConditionTextY);
    doc.text(
      `: ${matchesPaymentType.paymentMode}`,
      xCoordinate + labelWidth,
      additionalConditionTextY
    );
    doc.text("Carrying", xCoordinate, additionalConditionTextY + 5);
    doc.text(
      ": All Carrying, Loading & unloading cost will bear by the Seller.",
      xCoordinate + labelWidth,
      additionalConditionTextY + 5
    );

    doc.text(
      " I certify the above to be true and correct to the best of my knowledge.",
      xCoordinate,
      additionalConditionTextY + 20
    );
    // Draw lines
    const footerY = doc.internal.pageSize.height - 55;
    const lineWidth = (doc.internal.pageSize.width - 30) / 4;
    // Position image above the line with some spacing
    // Assuming an initial X coordinate for the line

    const imgWidth = 30; // Width of the image in the PDF
    const imgHeight = 20;
    const imageX = doc.internal.pageSize.width - 15 - imgWidth;
    console.log(imageX);
    const footerImageY = footerY - imgHeight - 3;
    // Draw lines
    // Divide the width by 3 sections
    doc.line(xCoordinate, footerY, xCoordinate + lineWidth, footerY); // Checked by line
    doc.line(
      xCoordinate + lineWidth + 5,
      footerY,
      xCoordinate + 2 * lineWidth + 5,
      footerY
    ); // Prepared by line
    doc.line(
      xCoordinate + 2 * lineWidth + 10,
      footerY,
      xCoordinate + 3 * lineWidth + 10,
      footerY
    ); // Authorized by line
    doc.addImage(signature, "PNG", imageX, footerImageY, imgWidth, imgHeight);
    doc.line(
      xCoordinate + 3 * lineWidth + 15,
      footerY,
      xCoordinate + 4 * lineWidth + 15,
      footerY
    ); // Authorized by line

    // Add text centered below the lines
    const textYOffset = 5; // Y offset for the text to be placed below the lines

    // Calculate center positions
    const checkedByCenter = xCoordinate + lineWidth / 2;
    const preparedByCenter = xCoordinate + lineWidth + 5 + lineWidth / 2;
    const verifiedByCenter = xCoordinate + 2 * lineWidth + 10 + lineWidth / 2;
    const authorizedByCenter = xCoordinate + 3 * lineWidth + 15 + lineWidth / 2;

    // Add text centered under the lines
    doc.setFontSize(8);
    doc.text("Accounts", checkedByCenter, footerY + textYOffset, {
      align: "center",
    });
    doc.text("Project Director", preparedByCenter, footerY + textYOffset, {
      align: "center",
    });
    doc.text("Verified by", verifiedByCenter, footerY + textYOffset, {
      align: "center",
    });
    doc.text("Authorized by", authorizedByCenter, footerY + textYOffset, {
      align: "center",
    });
    const footer2Y = doc.internal.pageSize.height - 40;
    const footer3Y = doc.internal.pageSize.height - 35;
    const checkedByCenter2 = xCoordinate + lineWidth / 2;
    // doc.line(xCoordinate, footer2Y, xCoordinate + lineWidth, footer2Y);
    doc.setFontSize(8);
    doc.text("Accepted By", checkedByCenter2, footer2Y + textYOffset, {
      align: "center",
    });
    doc.text(
      `${customerFilterData[0].clientName}`,
      checkedByCenter2,
      footer3Y + textYOffset,
      {
        align: "center",
      }
    );
  }
  const pdfDataUrl = doc.output("datauristring");
  const pdfWindow = window.open();
  pdfWindow.document.write(
    `<iframe width='100%' height='100%' src='${pdfDataUrl}'></iframe>`
  );
  doc.save(`${data.invoiceNo}.pdf`);
};

const addCustomerInformationHeader = (doc, startY) => {
  const headerY = startY; // Starting Y position for the header
  const pageWidth = doc.internal.pageSize.width;
  const headerHeight = 2; // Height of the header
  const padding = 2; // Padding inside the header

  // Set background color for the header
  doc.setFillColor(210, 210, 210);
  doc.rect(10, headerY, pageWidth - 20, headerHeight + padding * 2, "F");

  // Add the centered text inside the header
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text(
    "CUSTOMER INFORMATION",
    pageWidth / 2,
    headerY + headerHeight + padding,
    {
      align: "center",
    }
  );
};

const conditionInformationHeader = (doc, startY) => {
  const headerY = startY; // Starting Y position for the header
  const pageWidth = doc.internal.pageSize.width;
  const headerHeight = 2; // Height of the header
  const padding = 2; // Padding inside the header

  // Set background color for the header
  doc.setFillColor(210, 210, 210);
  doc.rect(10, headerY, pageWidth / 2, headerHeight + padding * 2, "F");

  // Add the centered text inside the header
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text(
    "TERMS OF SALES AND OTHER CONDITIONS",
    10,
    headerY + headerHeight + padding,
    {
      align: "left",
    }
  );
};

const addFooterForPO = (doc, companyinfo, reportTitle, reportImage) => {
  const pageCount = doc.internal.getNumberOfPages(); // Get the total number of pages
  const detailsWidthPercentage = 0.8;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i); // Go to page i

    // Start Y position for content (table starts below header)
    // const contentStartY = headerHeight + spaceBetween;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const headerY = 10;
    const footerY = pageHeight - 10;
    const imgWidth = 20; // Width of the image in the PDF
    const imgHeight = 15; // Height of the image in the PDF

    // Header content
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.companyName) {
        var companyNameUpper =
          companyinfo?.companyinfo[0]?.companyName.toUpperCase();
      }
    }

    const companyDetailsWidth = pageWidth * detailsWidthPercentage;
    const imageX =
      doc.internal.pageSize.width / 2 - companyDetailsWidth / 2 - 10;
    doc.setFont("times", "normal", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    // Set font to helvetica (or any other font you prefer)
    doc.text(companyNameUpper, doc.internal.pageSize.width / 2, headerY + 7, {
      align: "center",
      width: companyDetailsWidth,
    });
    doc.addImage(reportImage, "PNG", imageX, headerY, imgWidth, imgHeight);
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text(`${reportTitle}`, doc.internal.pageSize.width / 2, headerY + 16, {
      align: "center",
      width: companyDetailsWidth,
    });

    // body content

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
    doc.text("Copyright@2024", 10, footerY, { align: "left" });

    doc.setLineWidth(0.5); // Calculate Y position for top line in footer
    doc.line(10, footerY - 15, doc.internal.pageSize.width - 10, footerY - 15); // Draw line above footer

    doc.setFontSize(10);
    doc.setFont("times", "normal");
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.footerAddress) {
        doc.text(
          companyinfo?.companyinfo[0]?.footerAddress,
          pageWidth - 57,
          footerY - 10,
          {
            align: "right",
          }
        );
      }
      if (companyinfo?.companyinfo[0]?.footerContact) {
        doc.text(
          companyinfo?.companyinfo[0]?.footerContact,
          pageWidth - 130,
          footerY - 5,
          {
            align: "right",
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

export { downloadInvoicePDF };
