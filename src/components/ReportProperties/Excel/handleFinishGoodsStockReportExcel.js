import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const handleFinishGoodsStockReportExcel = (
  data,
  finishItemInfo,
  itemSizeInfo,
  companyinfo,
  reportTitle
) => {
  const fileName = reportTitle?.toLowerCase().replace(/\s+/g, "");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Order Summary Report");

  const columnsToInclude = [
    "itemName",
    "productionQuantity",
    "deliveredQuantity",
    "returnQuantity",
    "stockInHand",
  ];

  let dynamicColumns = [
    { header: "Item Name", key: "itemName", width: 15 },
    { header: "Production Quantity", key: "productionQuantity", width: 20 },
    { header: "Delivered Quantity", key: "deliveredQuantity", width: 15 },
    { header: "Return Quantity", key: "returnQuantity", width: 20 },
    { header: "Stock In Hand", key: "stockInHand", width: 20 },
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

  data.forEach((item) => {
    const itemName = finishItemInfo?.filter(
      (items) => item?.itemId === items._id
    );

    const itemSize = itemSizeInfo.find(
      (size) => size._id === itemName[0]?.sizeId
    );
    const values = {
      itemName: `${itemName[0]?.itemName || ""} (${itemSize?.sizeInfo || ""})`,
      productionQuantity: item.productionQty,
      deliveredQuantity: item.deliveredQty,
      returnQuantity: item.returnQty,
      stockInHand: item.stockInHand,
    };

    const singleRow = worksheet.addRow(
      dynamicColumns.map((col) => values[col.key])
    );
    singleRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { horizontal: "center" };
    });
  });

  const totalProductionQty = data.reduce(
    (totalQty, item) => totalQty + item.productionQty,
    0
  );
  const totalDeliveredQty = data.reduce(
    (totalQty, item) => totalQty + item.deliveredQty,
    0
  );
  const totalReturnQty = data.reduce(
    (totalQty, item) => totalQty + item.returnQty,
    0
  );
  const totalStockInHand = data.reduce(
    (totalQty, item) => totalQty + item.stockInHand,
    0
  );
  const datas = {
    itemName: "Grand Total",
    productionQuantity: totalProductionQty,
    deliveredQuantity: totalDeliveredQty,
    returnQuantity: totalReturnQty,
    stockInHand: totalStockInHand,
  };

  const footerRow = worksheet.addRow(columnsToInclude.map((col) => datas[col]));
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

export default handleFinishGoodsStockReportExcel;
