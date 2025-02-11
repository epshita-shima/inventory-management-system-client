import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const handleInvoiceExcel = (
  data,
  customerInfo,
  companyinfo,
  reportTitle
) => {
  const fileName = reportTitle?.toLowerCase().replace(/\s+/g, "");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("GRNlist Report");

  const columnsToInclude = [
    "piDate",
    "invoiceNo",
    "customerID",
    "quantity",
    "totalAmount",
  ];


  let dynamicColumns = [
    { header: "PI Date", key: "piDate", width: 15 },
    { header: "Invoice No", key: "invoiceNo", width: 15 },
    { header: "Customer Name", key: "customerID", width: 20 },
    { header: 'Total Quantity', key: 'quantity', width: 20 },
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
    const customerName = customerInfo
      ?.filter((items) => item?.customerID === items._id)
      .map((filteredItem) => filteredItem.clientName)
      .join(", ");
      
 
    const totalQuantity = item.detailsData.reduce((subTotal, item) => {
        return subTotal + item.quantity;
      }, 0)
    const totalAmount = item.detailsData.reduce((subTotal, item) => {
        return subTotal + item.totalAmount;
      }, 0)

    const values = {
      piDate:new Date(item.piDate).toLocaleDateString("en-CA"),
      invoiceNo:item.invoiceNo,
      customerID:customerName,
      quantity:totalQuantity,
      totalAmount:totalAmount,
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
    piDate:"",
    invoiceNo:"",
    customerID:"",
    quantity:"",
    totalAmount:"",
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

export default handleInvoiceExcel;
