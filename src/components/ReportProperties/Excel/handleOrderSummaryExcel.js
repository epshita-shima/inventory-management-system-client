import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const handleOrderSummaryExcel = (data,paymentTypeInfo, companyinfo, reportTitle) => {
  console.log(data);
  const fileName = reportTitle?.toLowerCase().replace(/\s+/g, "");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Order Details Report");

  const columnsToInclude = [
    "date",
    "paymentType",
    "avgUnitPrice",
    "totalQty",
    "totalAmount",
  ];

  let dynamicColumns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Payment Type", key: "paymentType", width: 15 },
    { header: "Avg Unit Price", key: "avgUnitPrice", width: 20 },
    { header: "Total Deliver Qty", key: "totalQty", width: 20 },
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

  data.forEach((item) => {
    console.log(item)
    const paymentType=paymentTypeInfo.find((x)=>x._id==item.paymentId)
    const avgUnitPrice = item.grandAmount / item.grandQuantity;
    const values = {
      date: new Date(item.date).toLocaleDateString("en-CA"),
      paymentType:`${paymentType.paymentMode}`,
      avgUnitPrice: `${Math.round(avgUnitPrice) || ""}`,
      totalQty: `${item.grandQuantity || ""}`,
      totalAmount: item.grandAmount,
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

  const totalAmount = data.reduce(
    (totalAmt, item) => totalAmt + item.grandAmount,
    0
  );
  const totalQty = data.reduce(
    (totalQty, item) => totalQty + item.grandQuantity,
    0
  );

  const datas = {
    date: "",
    paymentType:'',
    avgUnitPrice: "Grand Total",
    totalQty: totalQty,
    totalAmount: totalAmount,
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

export default handleOrderSummaryExcel;
