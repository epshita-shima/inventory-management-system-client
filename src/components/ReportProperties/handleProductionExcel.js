import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const handleProductionExcel = (
  data,
  finishGoods,
  companyinfo,
  reportTitle
) => {
  const fileName = reportTitle?.toLowerCase().replace(/\s+/g, "");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("GRNlist Report");

  const columnsToInclude = [
    "productionDate",
    "batchNo",
    "totalBatch",
    "receipeQtyRatio",
    "productionItemName",
    "productionQty",
    "productionStart",
    "productionEnd",
    "totalHour",
    "wastageQty",
    "expectedProductionQtyPerBatch",
    "expectedProductionQty",
    // "productionStatus",
    // "itemId",
    // "receipe",
    // "materialUsed",
    // "asPerRatio",
    // "excess",
    // "less",
    // "consumptionStatus",
  ];


  let dynamicColumns = [
    { header: "Production Date", key: "productionDate", width: 15 },
    { header: "Batch No", key: "batchNo", width: 15 },
    { header: "Total Batch", key: "totalBatch", width: 20 },
    { header: 'Receipe Qty Ratio', key: 'receipeQtyRatio', width: 20 },
    { header: 'Production ItemName', key: 'productionItemName', width: 20 },
    { header: 'Production Qty', key: 'productionQty', width: 20 },
    { header: 'Production Start', key: 'productionStart', width: 20 },
    { header: 'Production End', key: 'productionEnd', width: 20 },
    { header: 'Total Hour', key: 'totalHour', width: 20 },
    { header: 'Wastage Qty', key: 'wastageQty', width: 20 },
    { header: 'Expected Production Qty(PerBatch)', key: 'expectedProductionQtyPerBatch', width: 20 },
    { header: 'Expected Production Qty', key: 'expectedProductionQty', width: 20 },
    // { header: 'Production Status', key: 'productionStatus', width: 20 },
    // { header: 'Item Id', key: 'itemId', width: 20 },
    // { header: 'Receipe', key: 'receipe', width: 20 },
    // { header: 'Material Used', key: 'materialUsed', width: 20 },
    // { header: 'As Per Ratio', key: 'asPerRatio', width: 20 },
    // { header: 'Excess', key: 'excess', width: 20 },
    // { header: 'Less', key: 'less', width: 20 },
    // { header: 'Consumption Status', key: 'consumptionStatus', width: 20 },
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
    const itemName = finishGoods
      ?.filter((items) => item?.productionItemName === items._id)
      .map((filteredItem) => filteredItem.itemName)
      .join(", ");
      
      console.log(itemName)
    const unitPrice = item.detailsData
      .map((detail) => detail.unitPrice)
      .join(", ");

    const values = {
      productionDate:item.productionDate,
      batchNo:item.batchNo,
      totalBatch:item.totalBatch,
      receipeQtyRatio:item.receipeQtyRatio,
      productionItemName:itemName,
      productionQty:item.productionQty,
      productionStart:item.productionStart,
      productionEnd:item.productionEnd,
      totalHour:item.totalHour,
      wastageQty:item.wastageQty,
      expectedProductionQtyPerBatch:item.expectedProductionQtyPerBatch,
      expectedProductionQty:item.expectedProductionQty,
      // productionStatus:item.productionStatus,
      // itemId:"",
      // receipe:"",
      // materialUsed:"",
      // asPerRatio:"",
      // excess:"",
      // less:"",
      // consumptionStatus:"",
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
    productionDate:"",
    batchNo:"",
    totalBatch:"",
    receipeQtyRatio:"",
    productionItemName:"",
    productionQty:"",
    productionStart:"",
    productionEnd:"",
    totalHour:"",
    wastageQty:"",
    expectedProductionQtyPerBatch:"",
    expectedProductionQty:"",
    // productionStatus:"",
    // itemId:"",
    // receipe:"",
    // materialUsed:"",
    // asPerRatio:"",
    // excess:"",
    // less:"",
    // consumptionStatus:"",
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

export default handleProductionExcel;
