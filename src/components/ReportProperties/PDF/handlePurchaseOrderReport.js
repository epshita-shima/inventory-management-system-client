import jsPDF from "jspdf";
import { toWords } from "number-to-words";

const downloadPOPDF = async (
  data,
  rawMaterialItemInfo,
  bankInformation,
  paymentData,
  companyinfo,
  reportTitle
) => {

  const numberInWords = toWords(parseInt(data?.grandTotalAmount));
  const companyContact = companyinfo.companyinfo[0].companyContact;
  const companyEmail = companyinfo.companyinfo[0].companyEmail;
  const factoryAddress = companyinfo.companyinfo[0].footerAddress;
  const matchesPaymentType = paymentData?.find(
    (payment) => payment._id === data.paymentId
  );
  const phoneNumber = companyContact.split(",")[0].split(": ")[1].trim();
  const contactEmail = companyEmail.split(",")[0].split(": ")[1].trim();
  const factoryConvertAddress = factoryAddress.replace("Factory Address:", "");
  const filterBsnkInfo = (filterBsnkInfo) => {
    const matchData = filterBsnkInfo.find((item) => item._id == data.bankId);
    return matchData;
  };
  const filteredData = filterBsnkInfo(bankInformation);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formattedDate = formatDate(data.makeDate);
  const formattedDelivaryDate = formatDate(data.deliveryDate);

  const doc = new jsPDF();
  addFooterForPO(doc, companyinfo, reportTitle);

  doc.setFontSize(10);
  doc.setFont("times", "bold");
  const xCoordinate = 10; // X coordinate for the label
  const labelWidth = 30; // Width allocated for labels
  let textY = 35;

  doc.text("Supplier PO No", xCoordinate, textY);
  doc.text(`:${data.poNo}`, xCoordinate + labelWidth, textY);

  // PO Date
  doc.text("PO Date", xCoordinate, textY + 5);
  doc.text(`:${formattedDate}`, xCoordinate + labelWidth, textY + 5);

  doc.text("Delivery Date", xCoordinate, textY + 10);
  doc.text(`:${formattedDelivaryDate}`, xCoordinate + labelWidth, textY + 10);

  const vendorInfoHeaderY = textY + 20; // Adjust this value for spacing
  addVendorInformationHeader(doc, vendorInfoHeaderY);

  doc.setFontSize(10);
  doc.setFont("times", "bold");
  const additionalTextY = vendorInfoHeaderY + 10;
  doc.text("Company", xCoordinate, additionalTextY);
  doc.text(
    ":MSA Universal Textile Mill Limited",
    xCoordinate + labelWidth,
    additionalTextY
  );
  doc.text("Address", xCoordinate, additionalTextY + 5);
  doc.text(":N/A", xCoordinate + labelWidth, additionalTextY + 5);
  doc.text("Mobile", xCoordinate, additionalTextY + 10);
  doc.text(":+880", xCoordinate + labelWidth, additionalTextY + 10);
  doc.text("Email", xCoordinate, additionalTextY + 15);
  doc.text(
    ":msa.universal@gmail.com",
    xCoordinate + labelWidth,
    additionalTextY + 15
  );

  const shipInfoHeaderY = textY + 55;
  addShipInformationHeader(doc, shipInfoHeaderY);

  doc.setFontSize(10);
  doc.setFont("times", "bold");
  const additionalShipTextY = shipInfoHeaderY + 10;
  doc.text("Company", xCoordinate, additionalShipTextY);
  doc.text(
    `:${companyinfo.companyinfo[0]?.companyName}`,
    xCoordinate + labelWidth,
    additionalShipTextY
  );
  doc.text("Address", xCoordinate, additionalShipTextY + 5);
  doc.text(
    `:${factoryConvertAddress}`,
    xCoordinate + labelWidth,
    additionalShipTextY + 5
  );
  doc.text("Mobile", xCoordinate, additionalShipTextY + 10);
  doc.text(
    `:${phoneNumber}`,
    xCoordinate + labelWidth,
    additionalShipTextY + 10
  );
  doc.text("Email", xCoordinate, additionalShipTextY + 15);
  doc.text(
    `:${contactEmail}`,
    xCoordinate + labelWidth,
    additionalShipTextY + 15
  );

  const finalRows = data?.detailsData?.map((row, index) => [
    index + 1,
    rawMaterialItemInfo
      ?.filter((rawItem) => rawItem._id === row.itemId)
      .map((filteredItem) => filteredItem.itemName)
      .join(", "),
    row.itemDescription,
    row.quantity.toLocaleString(),
    row.unitPrice.toLocaleString(),
    row.totalAmount.toLocaleString(),
  ]);
  matchesPaymentType.paymentType === "cash"
    ? (textY = addTableContent(doc, finalRows, textY + 85))
    : (textY = addTableContent(doc, finalRows, textY + 90));
  // Add totals to the rows with colSpan

  function addTableContent(doc, finalRows, startY) {
    finalRows.push([
      {
        content: "Total",
        colSpan: 3,
        styles: { halign: "right", fontStyle: "bold" },
      },
      data.grandTotalQuantity.toLocaleString(), // Grand total quantity
      "", // Empty cell for Unit Price
      data.grandTotalAmount.toLocaleString(), // Grand total amount
    ]);
    finalRows.push([
      {
        content: `SAY IN WORDS (${
          matchesPaymentType.paymentType == "cash" ? "BDT" : "USD"
        }): ${
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
          "Item Name",
          "Item Description",
          "Quantity",
          "Unit Price",
          "Amount",
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
        // Check if it's the last row

        const rowIndex = data.row.index;
        const totalRows = data.table.body.length;
        const columnIndex = data.column.index;

        data.cell.styles.halign = "center";

        if (columnIndex === 3 || columnIndex === 5) {
          data.cell.styles.halign = "center";
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
    const conditionInfoHeaderY =
      matchesPaymentType.paymentType === "cash" ? textY + 5 : textY + 12;
    conditionInformationHeader(doc, conditionInfoHeaderY);

    doc.setFontSize(10);
    doc.setFont("times", "bold");
    const additionalConditionTextY = conditionInfoHeaderY + 12;
    doc.text("Product", xCoordinate, additionalConditionTextY);
    doc.text(
      ":Product should be supplied as per Described quality and approved sample",
      xCoordinate + labelWidth,
      additionalConditionTextY
    );
    doc.text("Quality &", xCoordinate, additionalConditionTextY + 5);
    doc.text("Quantity", xCoordinate, additionalConditionTextY + 10);
    doc.text(
      ":Standard Quality should be maintained. Deviation in Quality should not be accepted or tolerable. ",
      xCoordinate + labelWidth,
      additionalConditionTextY + 5
    );
    doc.text("Payment Terms", xCoordinate, additionalConditionTextY + 15);
    doc.text(
      `:${matchesPaymentType.paymentMode}`,
      xCoordinate + labelWidth,
      additionalConditionTextY + 15
    );
    doc.text("Packing", xCoordinate, additionalConditionTextY + 20);
    doc.text(
      ":In standard Packing System Should be Maintaine",
      xCoordinate + labelWidth,
      additionalConditionTextY + 20
    );
    doc.text("Remarks", xCoordinate, additionalConditionTextY + 25);
    doc.text(
      `:${data.remarks}`,
      xCoordinate + labelWidth,
      additionalConditionTextY + 25
    );

    if (matchesPaymentType.paymentType !== "cash") {
      let bankingInfoHeaderY = textY + 105;
      console.log(textY, pageHeight, bankingInfoHeaderY);
      if (bankingInfoHeaderY > pageHeight - 50) {
        doc.addPage();

        addFooterForPO(doc, companyinfo, reportTitle);
        bankingInfoHeaderY = 40; // Reset the Y position
      } else {
        bankingInfoHeaderY = textY + 60;
      }
      bankingInformationHeader(doc, bankingInfoHeaderY);

      doc.setFontSize(10);
      doc.setFont("times", "bold");
      const additionalBankingTextY = bankingInfoHeaderY + 13;
      doc.text("A/C Name", xCoordinate, additionalBankingTextY);
      doc.text(
        `:${filteredData.accountName}`,
        xCoordinate + labelWidth,
        additionalBankingTextY
      );
      doc.text("A/C Number", xCoordinate, additionalBankingTextY + 5);
      doc.text(
        `:${filteredData.accountNumber}`,
        xCoordinate + labelWidth,
        additionalBankingTextY + 5
      );
      doc.text("Bank Name", xCoordinate, additionalBankingTextY + 10);
      doc.text(
        `:${filteredData.bankName}`,
        xCoordinate + labelWidth,
        additionalBankingTextY + 10
      );
      doc.text("Address", xCoordinate, additionalBankingTextY + 15);
      doc.text(
        `:${filteredData.address}`,
        xCoordinate + labelWidth,
        additionalBankingTextY + 15
      );
      doc.text("Routing No", xCoordinate, additionalBankingTextY + 20);
      doc.text(
        `:${filteredData.routingNumber}`,
        xCoordinate + labelWidth,
        additionalBankingTextY + 20
      );
      doc.text("SWIFT Code", xCoordinate, additionalBankingTextY + 25);
      doc.text(
        `:${filteredData.swiftCode}`,
        xCoordinate + labelWidth,
        additionalBankingTextY + 25
      );
      const letterSpacing = 0.4;
      doc.setCharSpace(letterSpacing);
      doc.text("Thaking You", xCoordinate, additionalBankingTextY + 35);
      doc.text(
        `${companyinfo?.companyinfo[0].companyName}`,
        xCoordinate,
        additionalBankingTextY + 40
      );
    }

    if (matchesPaymentType.paymentType === "cash") {
      const letterSpacing = 0.4;
      doc.setCharSpace(letterSpacing);
      doc.text("Thaking You", xCoordinate, additionalConditionTextY + 32);
      doc.text(
        `${companyinfo?.companyinfo[0].companyName}`,
        xCoordinate,
        additionalConditionTextY + 38
      );
    }

    // Draw lines
    const footerY = doc.internal.pageSize.height - 35;

    // Draw lines
    const lineWidth = (doc.internal.pageSize.width - 30) / 3; // Divide the width by 3 sections
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

    // Add text centered below the lines
    const textYOffset = 5; // Y offset for the text to be placed below the lines

    // Calculate center positions
    const checkedByCenter = xCoordinate + lineWidth / 2;
    const preparedByCenter = xCoordinate + lineWidth + 5 + lineWidth / 2;
    const authorizedByCenter = xCoordinate + 2 * lineWidth + 10 + lineWidth / 2;

    // Add text centered under the lines
    doc.setFontSize(8);
    doc.text("Checked by", checkedByCenter, footerY + textYOffset, {
      align: "center",
    });
    doc.text("Prepared by", preparedByCenter, footerY + textYOffset, {
      align: "center",
    });
    doc.text("Authorized by", authorizedByCenter, footerY + textYOffset, {
      align: "center",
    });
  }
  doc.save(`${data.poNo}.pdf`);
};

const addVendorInformationHeader = (doc, startY) => {
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
    "VENDOR INFORMATION",
    pageWidth / 2,
    headerY + headerHeight + padding,
    {
      align: "center",
    }
  );
};

const addShipInformationHeader = (doc, startY) => {
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
  doc.text(" SHIP TO", pageWidth / 2, headerY + headerHeight + padding, {
    align: "center",
  });
};

const conditionInformationHeader = (doc, startY) => {
  const headerY = startY; // Starting Y position for the header
  const pageWidth = doc.internal.pageSize.width;
  const headerHeight = 2; // Height of the header
  const padding = 2; // Padding inside the header

  // Set background color for the header
  doc.setFillColor(210, 210, 210);
  doc.rect(10, headerY, pageWidth / 3, headerHeight + padding * 2, "F");

  // Add the centered text inside the header
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text("TERMS AND CONDITIONS", 10, headerY + headerHeight + padding, {
    align: "left",
  });
};

const bankingInformationHeader = (doc, startY) => {
  const headerY = startY; // Starting Y position for the header
  const pageWidth = doc.internal.pageSize.width;
  const headerHeight = 2; // Height of the header
  const padding = 2; // Padding inside the header

  // Set background color for the header
  doc.setFillColor(210, 210, 210);
  doc.rect(10, headerY, pageWidth / 3, headerHeight + padding * 2, "F");

  // Add the centered text inside the header
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text("BANKING INFORMATION", 10, headerY + headerHeight + padding, {
    align: "left",
  });
};

const addFooterForPO = (doc, companyinfo, reportTitle) => {
  const pageCount = doc.internal.getNumberOfPages(); // Get the total number of pages
  const detailsWidthPercentage = 0.8;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i); // Go to page i

    // Start Y position for content (table starts below header)
    // const contentStartY = headerHeight + spaceBetween;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    console.log(pageHeight);
    const headerY = 10;
    const footerY = pageHeight - 10;

    // Header content
    if (companyinfo && companyinfo?.companyinfo[0]) {
      if (companyinfo?.companyinfo[0]?.companyName) {
        var companyNameUpper =
          companyinfo?.companyinfo[0]?.companyName.toUpperCase();
      }
    }

    // const detailsX = logoWidth + 20;

    const companyDetailsWidth = pageWidth * detailsWidthPercentage;
    doc.setFont("times", "normal", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    // Set font to helvetica (or any other font you prefer)
    doc.text(companyNameUpper, doc.internal.pageSize.width / 2, headerY + 7, {
      align: "center",
      width: companyDetailsWidth,
    });

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

export { downloadPOPDF };
