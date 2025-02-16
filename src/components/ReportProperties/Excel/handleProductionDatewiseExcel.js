import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const handleProductionDatewiseExcel = (
  mainData,
  finishGoodsInfo,
  itemSizeInfo,
  companyinfo,
  reportTitle
) => {
  const fileName = reportTitle?.toLowerCase().replace(/\s+/g, "");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Order Details Report");

  const columnsToInclude = [
    "productionDate",
    "batchNo",
    "itemName",
    "productionQty",
  ];

  let dynamicColumns = [
    { header: "Production Date", key: "productionDate", width: 15 },
    { header: "Batch No", key: "batchNo", width: 15 },
    { header: "Item Name", key: "itemName", width: 20 },
    { header: "Production Quantity", key: "productionQty", width: 20 },
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


  mainData.forEach((item) => {
    const itemName = finishGoodsInfo?.filter(
      (items) => item?.productionItemName === items._id
    );
    const itemSize = itemSizeInfo.find(
      (size) => size._id === itemName[0]?.sizeId
    );
    const values = {
      productionDate: new Date(item.productionDate).toLocaleDateString("en-CA"),
      batchNo: item.batchNo,
      itemName: `${itemName[0]?.itemName || ""} (${itemSize?.sizeInfo || ""})`,
      productionQty: item.productionQty,
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


  const productionQty= mainData.reduce((totalQty,item)=>totalQty+item.productionQty,0);
  const datas = {
    productionDate: "",
    batchNo: "",
    itemName: "Grand Total",
    productionQty: productionQty,
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

export default handleProductionDatewiseExcel;
