import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const handleReturnDetailsExcel = (
  data,
  mainData,
  finishGoodsInfo,
  itemSizeInfo,
  clientInformation,
  companyinfo,
  reportTitle
) => {
  const fileName = reportTitle?.toLowerCase().replace(/\s+/g, "");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("GRNlist Report");

  const columnsToInclude = [
    "returnDate",
    "transferFrom",
    "transferTo",
    "piNo",
    "itemName",
    "returnQty",
    "unitPrice",
    "totalAmount",
  ];

  console.log(columnsToInclude);
  let dynamicColumns = [
    { header: "Return Date", key: "piDate", width: 15 },
    { header: "Transfer From", key: "transferFrom", width: 15 },
    { header: "Transfer To", key: "transferTo", width: 20 },
    { header: "PI Number", key: "piNo", width: 20 },
    { header: "Item Name", key: "itemName", width: 20 },
    { header: "ReturnQuantity", key: "returnQty", width: 20 },
    { header: "Unit Price", key: "unitPrice", width: 20 },
    { header: "Total Amount", key: "totalAmount", width: 20 },
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


  data?.forEach((item) => {
    const itemName = finishGoodsInfo?.filter(
      (items) => item?.detailsData?.itemId === items._id
    );

    const itemSize = itemSizeInfo.find(
      (size) => size._id === itemName[0]?.sizeId
    );

    const transferFrom = clientInformation
      ?.filter((client) => client._id === item.transferFromClientId)
      .map((filteredItem) => filteredItem.clientName)
      .join(", ");

    const transferTo = companyinfo
      ?.filter((company) => company._id === item.transferToCompanyId)
      .map((filteredItem) => filteredItem.companyName)
      .join(", ");

    const values = {
      returnDate: new Date(item.piDate).toLocaleDateString("en-CA"),
      transferFrom: transferFrom,
      transferTo: transferTo,
      invoiceNo: item.invoiceNo,
      itemName: `${itemName[0]?.itemName || ""} (${itemSize?.sizeInfo || ""})`,
      returnQty: item.detailsData.returnQty,
      // unitPrice: item.detailsData.unitPrice,
      // totalAmount: item.detailsData.totalAmount,
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

 
const totalQuantity= mainData.reduce((totalQty,item)=>{
  const detailsQty=item.detailsData.reduce((sum,detail)=>sum+detail.returnQty,0);
  return totalQty +detailsQty
},0)

// const totalAmount= mainData.reduce((totalAmt,item)=>{
//   const detailsAmt=item.detailsData.reduce((sum,detail)=>sum+detail.totalAmount,0);
//   return totalQuantity +detailsAmt
// },0)
  
// console.log(totalQuantity)

  const datas = {
    piDate: "",
    clientName: "",
    invoiceNo: "",
    itemName: "Grand Total",
    quantity: totalQuantity,
    unitPrice: "",
    // totalAmount: totalAmount,
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

export default handleReturnDetailsExcel
