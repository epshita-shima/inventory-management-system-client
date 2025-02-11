import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const handelPaymentReceiveExcel = (
  data,
  customerInfo,
  invoiceData,
  itemsizeinfo,
  finishGoods,
  companyinfo,
  reportTitle
) => {
  const fileName = reportTitle?.toLowerCase().replace(/\s+/g, "");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("GRNlist Report");

  const columnsToInclude = [
    "clientId",
    "piNumber",
    "itemId",
    "currecncy",
    "piQuantity",
    "piAmount",
    "paidQuantity",
    "paidAmount",
    "adjustQuantity",
    "adjustAmount",
    "netQuantity",
    "netAmount",
  ];

  let dynamicColumns = [
    { header: "Client Name", key: "clientId", width: 15 },
    { header: "PI Number", key: "piNumber", width: 15 },
    { header: "Item Name", key: "itemId", width: 20 },
    { header: "Currency", key: "currency", width: 20 },
    { header: "PI Quantity", key: "piQuantity", width: 20 },
    { header: "PI Amount", key: "piAmount", width: 20 },
    { header: "Paid Quantity", key: "paidQuantity", width: 20 },
    { header: "Paid Amount", key: "paidAmount", width: 20 },
    { header: "Adjust Quantity", key: "adjustQuantity", width: 20 },
    { header: "Adjust Amount", key: "adjustAmount", width: 20 },
    { header: "Net Quantity", key: "netQuantity", width: 20 },
    { header: "Net Amount", key: "netAmount", width: 20 },
  ];

  columnsToInclude.forEach((item, index) => {
    let customFieldName = item.replace(/\s/g, "_");
    let customFieldValue = item;
    const found = dynamicColumns.some((col) => col.key === customFieldValue);

    if (!found) {
      dynamicColumns.push({
        header: item.field_name,
        key: customFieldName,
        width: 15,
      });
    }
  });

  const headerLength =
    dynamicColumns.length > 0 ? Object.keys(dynamicColumns).length : 0;

  worksheet.mergeCells(`A1:${String.fromCharCode(65 + headerLength - 2)}1`);
  worksheet.getCell("A1").value = `${companyinfo[0].companyName}`;
  worksheet.getCell("A1").font = {
    family: 2,
    size: 14,
    bold: true,
  };
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A1").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  worksheet.mergeCells(`A2:${String.fromCharCode(65 + headerLength - 2)}2`);
  worksheet.getCell("A2").value = `${companyinfo[0].companyAddress}`;
  worksheet.getCell("A2").alignment = { horizontal: "center" };
  worksheet.getCell("A2").font = {
    family: 2,
    size: 12,
    bold: true,
  };
  worksheet.getCell("A2").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  worksheet.mergeCells(`A3:${String.fromCharCode(65 + headerLength - 2)}3`);
  worksheet.getCell("A3").value = `${reportTitle}`;
  worksheet.getCell("A3").alignment = { horizontal: "center" };
  worksheet.getCell("A3").font = {
    family: 2,
    size: 12,
    bold: true,
  };

  worksheet.getCell("A3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  const headerRow = worksheet.addRow(dynamicColumns.map((item) => item.header));

  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = { horizontal: "center" };
    cell.font = { bold: true };
  });

  function formatNumber(value) {
    if (value < 0) {
      return `(${Math.abs(value).toLocaleString()})`;
    } else {
      return value.toLocaleString();
    }
  }

  data.forEach((item) => {
    const customerName = customerInfo?.find((x) => x._id === item?.clientId);
    const piCurrency = invoiceData?.find((x) => x._id === item?.piNumber);
    item.detailsData.map((singleItem) => {
      const itemNames = finishGoods?.find(
        (rawItem) => rawItem._id === singleItem.itemId
      );
      const filteredItemSize = itemsizeinfo?.find(
        (x) => x?._id === itemNames?.sizeId
      );

      const matchPI = invoiceData?.find((x) => x._id === item?.piNumber);
      const filterIPQuantity = matchPI?.detailsData.find(
        (item) => item.itemId === singleItem.itemId
      );

      const values = {
        clientId: customerName.clientName,
        piNumber: item.piNumber,
        itemId: `${itemNames.itemName}` + `(${filteredItemSize.sizeInfo})`,
        currency: piCurrency.currency,
        piQuantity: filterIPQuantity.quantity.toLocaleString(),
        piAmount: filterIPQuantity.totalAmount.toLocaleString(),
        paidQuantity:
          singleItem.paymentStatus === "cash" ? singleItem.quantity.toLocaleString() : "-",
        paidAmount:
          singleItem.paymentStatus === "cash" ? singleItem.amount.toLocaleString() : "-",
        adjustAmount:
          singleItem.paymentStatus === "adjustment" ? singleItem.quantity.toLocaleString() : "-",
        adjustQuantity:
          singleItem.paymentStatus === "adjustment" ? singleItem.amount.toLocaleString() : "-",
        netQuantity: formatNumber(
          (singleItem.paymentStatus === "cash" ? singleItem.quantity : 0) -
            (singleItem.paymentStatus === "adjustment"
              ? singleItem.quantity
              : 0)
        ),

        netAmount: formatNumber(
          (singleItem.paymentStatus === "cash" ? singleItem.amount : 0) -
            (singleItem.paymentStatus === "adjustment" ? singleItem.amount : 0)
        ),
      };

      const singleRow = worksheet.addRow(
        dynamicColumns.map((col) => values[col.key])
      );
      singleRow.eachCell((cell,colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        
        if ([6, 8, 10, 12].includes(colNumber)) {
        cell.alignment = {
            horizontal: "right", 
        };
    } else {
        cell.alignment = {
            horizontal: "center",
        };
    }
      });
    });
  });
  const totalPaidQuantity = data.reduce((total, data) => {
    const paidQuantity = data.detailsData.reduce((sum, item) => {
      // Only add the quantity if the paymentStatus is "cash"
      return item.paymentStatus === "cash" ? sum + item.quantity : sum;
    }, 0);

    return total + paidQuantity;
  }, 0);
  const totalPaidAmount = data.reduce((total, data) => {
    const paidAmount = data.detailsData.reduce((sum, item) => {
      // Only add the quantity if the paymentStatus is "cash"
      return item.paymentStatus === "cash" ? sum + item.amount : sum;
    }, 0);

    return total + paidAmount;
  }, 0);
  const totalAdjustQuantity = data.reduce((total, data) => {
    const paidQuantity = data.detailsData.reduce((sum, item) => {
      // Only add the quantity if the paymentStatus is "cash"
      return item.paymentStatus === "adjustment" ? sum + item.quantity : sum;
    }, 0);

    return total + paidQuantity;
  }, 0);
  const totalAdjustAmount = data.reduce((total, data) => {
    const paidAmount = data.detailsData.reduce((sum, item) => {
      // Only add the quantity if the paymentStatus is "cash"
      return item.paymentStatus === "adjustment" ? sum + item.amount : sum;
    }, 0);

    return total + paidAmount;
  }, 0);

  const totalNetQuantity = totalPaidQuantity - totalAdjustQuantity;
  const totalNetAmount = totalPaidAmount - totalAdjustQuantity;
    const lastRowNumber = worksheet.lastRow.number + 1; 

  const datas = {
    clientId: "",
    piNumber: "",
    currency: "",
    itemId: "",
    piQuantity: "",
    piAmount: "Grand Total",
    paidQuantity: totalPaidQuantity.toLocaleString(),
    paidAmount: totalPaidAmount.toLocaleString(),
    adjustAmount: totalAdjustQuantity.toLocaleString(),
    adjustQuantity: totalAdjustAmount.toLocaleString(),
    netQuantity: totalNetQuantity.toLocaleString(),
    netAmount: totalNetAmount.toLocaleString(),
  };

  const footerRow = worksheet.addRow(columnsToInclude.map((col) => datas[col]));
  worksheet.mergeCells(`A${lastRowNumber}:E${lastRowNumber}`);
  footerRow.eachCell((cell,colNumber) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    if ([6, 8, 10, 12].includes(colNumber)) { 
        cell.alignment = {
            horizontal: "right", 
        };
    } else {
        cell.alignment = {
            horizontal: "center", 
        };
    }
    cell.font = { bold: true };
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  });
};

export default handelPaymentReceiveExcel;
