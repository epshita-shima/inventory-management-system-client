import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const handleSalesDetailsExcel = ( 
  data,
  mainData,
  piInformation,
  finishGoodsInfo,
  itemSizeInfo,
  itemUnitInformation,
  clientInformation,
  companyinfo,
  reportTitle) => {
  const fileName = reportTitle?.toLowerCase().replace(/\s+/g, "");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("GRNlist Report");

  const columnsToInclude = [
    "finishGoodsDeliveryDate",
    "clientName",
    "piNo",
    "itemName",
    "currency",
    "unit",
    "deliverQty",
    "unitPrice",
    "totalAmount",
  ];

  let dynamicColumns = [
    { header: "Return Date", key: "finishGoodsDeliveryDate", width: 15 },
    { header: "Client Name", key: "clientName", width: 15 },
    { header: "PI Number", key: "piNo", width: 20 },
    { header: "Item Name", key: "itemName", width: 20 },
    { header: "Currency", key: "currency", width: 20 },
    { header: "Unit", key: "unit", width: 20 },
    { header: "ReturnQuantity", key: "deliverQty", width: 20 },
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
    const itemUnit = itemUnitInformation.find(
      (unit) => unit._id === itemName[0]?.unitId
    );

    const clientName = clientInformation
      ?.filter((client) => client._id === item.clientId)
      .map((filteredItem) => filteredItem.clientName)
      .join(", ");

    const findInvoice = piInformation.find((piData) => piData._id === item.piId);
    const unitPrice = findInvoice?.detailsData.find(
      (unit) => unit.itemId === item?.detailsData?.itemId
    );

    const totalAmount=unitPrice?.unitPrice * item.detailsData.deliverQty;
    const avarageUbitPrice = totalAmount / item.detailsData.deliverQty;

    const values = {
      finishGoodsDeliveryDate: new Date(item.finishGoodsDeliveryDate).toLocaleDateString("en-CA"),
      clientName: clientName,
    
      piNo: findInvoice?.invoiceNo,
      itemName: `${itemName[0]?.itemName || ""} (${itemSize?.sizeInfo || ""})`,
      currency: findInvoice?.currency,
      unit:`${itemUnit?.unitInfo}`,
      deliverQty: item.detailsData.deliverQty,
      unitPrice: avarageUbitPrice,
      totalAmount: unitPrice?.unitPrice * item.detailsData.deliverQty,
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

  const totalQuantity = mainData.reduce((totalQty, item) => {
    const detailsQty = item.detailsData.reduce(
      (sum, detail) => sum + Number(detail.deliverQty),
      0
    );
    return totalQty + detailsQty;
  }, 0);

  const grandTotalDeliverAmount = mainData?.reduce((totalQty, detail) => {
    const detailReturnQty = detail.detailsData.reduce((sum, detail) => {
      const piNumber = piInformation?.find((pi) => pi._id === detail.piId);
      const unitPrice = piNumber?.detailsData.find(
        (item) => item.itemId === detail.itemId
      );
      return sum + (Number(detail.deliverQty) * Number(unitPrice?.unitPrice));
    }, 0);
    return totalQty + detailReturnQty;
  }, 0);

  const datas = {
    finishGoodsDeliveryDate: "",
    clientName: "",
    piNo: "",
    itemName:"",
    currency: "",
    unit:'Grand Total',
    deliverQty: totalQuantity,
    unitPrice: "",
    totalAmount: grandTotalDeliverAmount,
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

export default handleSalesDetailsExcel
