import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const handlePurchaseDatewiseReportExcel = (
  data,
  mainData,
  rawMaterialItemInfo,
  itemUnitInfo,
  supplierInformation,
  companyinfo,
  reportPurchaseTitle
) => {
  console.log(reportPurchaseTitle)
  const fileName = reportPurchaseTitle?.toLowerCase().replace(/\s+/g, "");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Order Details Report");

  const columnsToInclude = [
    "receiveDate",
    "supplierName",
    "supplierPoNo",
    "itemName",
    "unit",
    "quantity",
    "unitPrice",
    "amount",
  ];

  let dynamicColumns = [
    { header: "Receive Date", key: "receiveDate", width: 15 },
    { header: "Supplier Name", key: "supplierName", width: 15 },
    { header: "Po No", key: "supplierPoNo", width: 20 },
    { header: "Item Name", key: "itemName", width: 20 },
    { header: "Unit", key: "unit", width: 20 },
    { header: "Quantity", key: "quantity", width: 20 },
    { header: "Unit Price", key: "unitPrice", width: 20 },
    { header: "Amount", key: "amount", width: 20 },
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
  worksheet.getCell("A3").value = `${reportPurchaseTitle}`;
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
    const itemName = rawMaterialItemInfo?.filter(
      (items) => item?.detailsData?.itemId === items._id
    );
    const itemSize = itemUnitInfo.find(
      (size) => size._id === itemName[0]?.unitId
    );
    const supplierName = supplierInformation
      ?.filter((supplier) => supplier._id === item.supplierId)
      .map((filteredItem) => filteredItem.supplierName)
      .join(", ");

    const values = {
      receiveDate: new Date(item.receiveDate).toLocaleDateString("en-CA"),
      supplierName: supplierName,
      supplierPoNo: item.supplierPoNo,
      itemName: `${itemName[0]?.itemName || ""}`,
      unit: `${itemSize?.unitInfo || ""}`,
      quantity: item.detailsData.quantity,
      unitPrice: item.detailsData.unitPrice,
      amount: item.detailsData.amount,
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

    // worksheet.addRow(columnsToInclude.map((col) =>
    //     values[col]
    // ));
  });

  const totalQuantity= mainData.reduce((totalQty,item)=>{
    const detailsQty=item.detailsData.reduce((sum,detail)=>sum+detail.quantity,0);
    return totalQty +detailsQty
  },0)
  const totalAmount= mainData.reduce((totalAmt,item)=>{
    const detailsAmt=item.detailsData.reduce((sum,detail)=>sum+detail.amount,0);
    return totalAmt +detailsAmt
  },0)
  
  console.log(totalQuantity)

  const datas = {
    receiveDate: "",
    supplierName: "",
    supplierPoNo: "",
    itemName: "",
    unit:'Grand Total',
    quantity: totalQuantity,
    unitPrice: "",
    amount: totalAmount,
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


export default handlePurchaseDatewiseReportExcel
