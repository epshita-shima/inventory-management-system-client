const supplierDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label: option.supplierName,
      sortName: option.supplierShortName,
    });
  });
  return result;
};
const rawMaterialItemDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label: option.itemName,
      productionQtyPerBatch: option?.productionQtyPerBatch,
    });
  });
  return result;
};
const finishGoodsWithSizeItemDropdown = (options, sizeInfo) => {
  let result = [];
  options?.forEach((option) => {
    const filteredSize = sizeInfo?.find((x) => x?._id == option.sizeId);
    result.push({
      value: option._id,
      label: option.itemName + ` (${filteredSize?.sizeInfo})`,
      productionQtyPerBatch: option?.productionQtyPerBatch,
    });
  });
  return result;
};
const finishGoodsDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label: option.itemName ,
    });
  });
  return result;
};
const paymentInfoDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label: option.paymentMode,
    });
   
  });
  console.log(result)
  return result;

};
const bankInformationDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label:
        option.bankName + "-" + option.branchName + "-" + option.routingNumber,
    });
  });
  return result;
};
const clientInfoDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label:
        option.clientName,
      clientShortName:
        option.clientShortName,
    });
  });
  return result;
};
const userInfoDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label:
        option.username,
    });
  });
  return result;
};
const invoiceListDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label:
        option.invoiceNo,
    });
  });
  return result;
};
const unitInformationDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label:
        option.unitInfo
    });
  });
  return result;
};
const paymnetInformationDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label:
        option.paymentMode
    });
  });
  return result;
};

export {
  supplierDropdown,
  rawMaterialItemDropdown,
  paymentInfoDropdown,
  bankInformationDropdown,
  finishGoodsWithSizeItemDropdown,
  clientInfoDropdown,
  invoiceListDropdown,
  finishGoodsDropdown,
  unitInformationDropdown,
  userInfoDropdown,
  paymnetInformationDropdown
};
