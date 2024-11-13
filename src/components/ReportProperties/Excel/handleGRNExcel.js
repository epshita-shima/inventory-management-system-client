import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const handleGRNDownload = (
  data,
  rawItemInfo,
  supplierInfo,
  purchaseInfoData,
  companyinfo,
  reportTitle
) => 
  {
  const fileName = reportTitle.toLowerCase().replace(/\s+/g, "");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("GRNlist Report");
  let totalReceivedQuantity = 0;
  let totalAmount = 0;

  const columnsToInclude = [
    "receiveDate",
    "supplierId",
    "supplierPoNo",
    "itemName",
    "grnSerialNo",
    "challanNo",
    "currency",
    "receiveQty",
    "unitPrice",
    "totalAmount",
  ];

  console.log(columnsToInclude)
  let dynamicColumns = [
    { header: "Receive Date", key: "receiveDate", width: 15 },
    { header: "Supplier Id", key: "supplierId", width: 15 },
    { header: "Supplier Po No", key: "supplierPoNo", width: 20 },
    { header: 'Item Name', key: 'itemName', width: 20 },
    { header: 'GRN SerialNo', key: 'grnSerialNo', width: 20 },
    { header: 'Challan No', key: 'challanNo', width: 20 },
    { header: 'Currency', key: 'currency', width: 20 },
    { header: 'Receive Qty', key: 'receiveQty', width: 20 },
    { header: 'Unit Price', key: 'unitPrice', width: 20 },
    { header: 'Total Amount', key: 'totalAmount', width: 20 },
  ];
  
  columnsToInclude.forEach((item, index) => {
    let customFieldName = item.replace(/\s/g, '_');
    let customFieldValue = item;
    const found = dynamicColumns.some(col => col.key === customFieldValue);
    
    if (!found) {
      dynamicColumns.push({
        header: item.field_name,
        key: customFieldName,
        width: 15
      });
    }
  });

  const headerLength =
  dynamicColumns.length > 0 ? Object.keys(dynamicColumns).length : 0;

  worksheet.mergeCells(`A1:${String.fromCharCode(65 + headerLength - 1)}1`);
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

  worksheet.mergeCells(`A2:${String.fromCharCode(65 + headerLength - 1)}2`);
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

  worksheet.mergeCells(`A3:${String.fromCharCode(65 + headerLength - 1)}3`);
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

  const headerRow = worksheet.addRow(dynamicColumns.map((item)=>item.header));

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

  // worksheet.columns = columnsToInclude.map((col) => ({
  //   header: col,
  //   key: col,
  //   width: 20,
  // }));


  data.forEach((item) => {
    totalReceivedQuantity += parseFloat(item.grandTotalReceivedQuantity);
    totalAmount += parseFloat(item.grandTotalAmount);
  });


  data.forEach((item) => {
    const itemName = rawItemInfo
      ?.filter((items) =>
        item?.detailsData?.some((detail) => detail?.itemId === items._id)
      )
      .map((filteredItem) => filteredItem.itemName)
      .join(", ");
    const supplierName = supplierInfo
      ?.filter((rawItem) => rawItem._id === item.supplierId)
      .map((filteredItem) => filteredItem.supplierName)
      .join(", ");
    const unitPrice = item.detailsData
      .map((detail) => detail.unitPrice)
      .join(", ");
    const currency = purchaseInfoData
      ?.filter((poItem) => poItem._id === item.pOSingleId)
      .map((filteredItem) => filteredItem.currencyId)
      .join(",");

    const values = {
      receiveDate: item.receiveDate,
      supplierId: supplierName,
      supplierPoNo: item.supplierPoNo,
      itemName: itemName,
      grnSerialNo: item.grnSerialNo,
      challanNo: item.challanNo,
      currency: currency,
      receiveQty: item.grandTotalReceivedQuantity,
      unitPrice: unitPrice,
      totalAmount: item.grandTotalAmount,
    };
 
  const singleRow = worksheet.addRow(dynamicColumns.map((col) =>
        values[col.key]
  ));
    singleRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { horizontal: "center" };
    });

    // worksheet.addRow(columnsToInclude.map((col) =>
    //     values[col]
    // ));
  });

  const datas = {
    receiveDate: "",
    supplierId: "",
    supplierPoNo: "",
    itemName: "",
    grnSerialNo: "",
    challanNo: "",
    currency: "Grand Total",
    receiveQty: totalReceivedQuantity,
    unitPrice: "",
    totalAmount: totalAmount,
  };
  const footerRow = worksheet.addRow(columnsToInclude.map((col) =>
    datas[col]
));
  footerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = { horizontal: "center" };
    cell.font = { bold: true };
  });
  
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  });
};

export default handleGRNDownload;
