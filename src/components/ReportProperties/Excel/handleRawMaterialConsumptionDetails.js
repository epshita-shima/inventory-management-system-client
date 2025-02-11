import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const handleRawMaterialConsumptionDetails = (
  data,
  mainData,
  rawMaterialDataInfo,
  itemUnitInformation,
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
    "unit",
    "materialUsed",
  ];

  let dynamicColumns = [
    { header: "Production Date", key: "productionDate", width: 15 },
    { header: "Batch No", key: "batchNo", width: 15 },
    { header: "Item Name", key: "itemName", width: 20 },
    { header: "Unit", key: "unit", width: 20 },
    { header: "Material Used", key: "materialUsed", width: 20 },
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
    const itemName = rawMaterialDataInfo?.filter(
      (items) => item?.detailsData.itemId === items._id
    );
    const itemSize = itemUnitInformation.find(
      (size) => size._id === itemName[0]?.unitId
    );
    const values = {
      productionDate: new Date(item.productionDate).toLocaleDateString("en-CA"),
      batchNo: item.batchNo,
      itemName: `${itemName[0]?.itemName || ""}`,
      unit: `${itemSize.unitInfo || ""}`,
      materialUsed: item.detailsData.materialUsed,
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

  const materialUsed = mainData.reduce((totalQty, item) => {
    const totalMaterialUsed = item.detailsData.reduce(
      (sum, detail) => (sum + detail.materialUsed),0
    );
    return totalQty + totalMaterialUsed;
  }, 0);

  const datas = {
    productionDate: "",
    batchNo: "",
    itemName: "",
    unit:"Grand Total",
    materialUsed: materialUsed,
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

export default handleRawMaterialConsumptionDetails;
