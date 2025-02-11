import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const handelCombineReportExcel = (data, companyinfo, reportTitle) => {
  const fileName = reportTitle?.toLowerCase().replace(/\s+/g, "");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Combine Report");
  
  const columnsToInclude = [
    "date",
    "totalPIQuantity",
    "piUnitPrice",
    "totalPiAmount",
    "totalDeliveredQty",
    "deliveredAvgUnitPrice",
    "totalDeliveredAmount",
    "totalReturnQty",
    "returnAvgUnitPrice",
    "totalReturnAmount",
    "netQuantity",
    "netAvgUnitPrice",
    "totalNetAmount",
  ];

  let dynamicColumns = [
    { header: "PI Date", key: "date", width: 15 },
    { header: "PI Quantity", key: "totalPIQuantity", width: 15 },
    { header: "PI Unitprice", key: "piUnitPrice", width: 15 },
    { header: "Total PI Amount", key: "totalPiAmount", width: 15 },
    { header: "Delivered Quantity", key: "totalDeliveredQty", width: 20 },
    { header: "Delivered Unitprice", key: "deliveredAvgUnitPrice", width: 20 },
    { header: "Delivered Amount", key: "totalDeliveredAmount", width: 20 },
    { header: "Return Quantity", key: "totalReturnQty", width: 20 },
    { header: "Return Unitprice", key: "returnAvgUnitPrice", width: 20 },
    { header: "Return Amount", key: "totalReturnAmount", width: 20 },
    { header: "Net Quantity", key: "netQuantity", width: 20 },
    { header: "Net Unitprice", key: "netAvgUnitPrice", width: 20 },
    { header: "Net Amount", key: "totalNetAmount", width: 20 },
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
    const values = {
      date: new Date(item.date).toLocaleDateString("en-CA"),
      totalPIQuantity: item.totalPIQuantity,
      piUnitPrice: item.piUnitPrice,
      totalPiAmount: item.totalPiAmount,
      totalDeliveredQty: `${item.totalDeliveredQty ===0 ? `-` : item.totalDeliveredQty}`,
      deliveredAvgUnitPrice: `${item.deliveredAvgUnitPrice ===0 ? `-` : item.deliveredAvgUnitPrice}`,
      totalDeliveredAmount: `${item.totalDeliveredAmount ===0 ? `-` : item.totalDeliveredAmount}`,
      totalReturnQty:`${ item.totalReturnQty ===0 ? '-' :  item.totalReturnQty}`,
      returnAvgUnitPrice: `${item.returnAvgUnitPrice === 0 ? "-":item.returnAvgUnitPrice}`,
      totalReturnAmount: `${item.totalReturnAmount === 0 ? '-' : item.totalReturnAmount}`,
      netQuantity: `${
        item.netQuantity < 0
          ? `(${Math.abs(item.netQuantity)})`
          : item.netQuantity
      }`,
      netAvgUnitPrice: item.netAvgUnitPrice,
      totalNetAmount: `${item.totalNetAmount <0 ? `(${Math.abs(item.totalNetAmount)})` : item.totalNetAmount}`,
      
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

  const totalPIQuantity = data.reduce((total, details) => {
    return total + details.totalPIQuantity;
  }, 0);
  const grandTotalPIAmount = data.reduce((total, details) => {
    return total + details.totalPiAmount;
  }, 0);
  const grandTotalDeliveredQty = data.reduce((total, details) => {
    return total + details.totalDeliveredQty;
  }, 0);
  const grandTotalDeliveredAmount= data.reduce((total, details) => {
    return total + details.totalDeliveredAmount;
  }, 0);
  const grandTotalReturnQty= data.reduce((total, details) => {
    return total + details.totalReturnQty;
  }, 0);
  const grandTotalReturnAmount= data.reduce((total, details) => {
    return total + details.totalReturnAmount;
  }, 0);
  const grandTotalNetQty= data.reduce((total, details) => {
    return total + details.netQuantity;
  }, 0);
  const grandTotalNetAmount= data.reduce((total, details) => {
    return total + details.totalNetAmount;
  }, 0);

  const datas = {
    date:  "Grand Total",
    totalPIQuantity:totalPIQuantity,
    piUnitPrice:'',
    totalPiAmount:grandTotalPIAmount,
    totalDeliveredQty:grandTotalDeliveredQty,
    deliveredAvgUnitPrice:"",
    totalDeliveredAmount:grandTotalDeliveredAmount,
    totalReturnQty:grandTotalReturnQty,
    returnAvgUnitPrice:'',
    totalReturnAmount:grandTotalReturnAmount,
    netQuantity:grandTotalNetQty,
    netAvgUnitPrice:'',
    totalNetAmount:grandTotalNetAmount,
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

export default handelCombineReportExcel;
