
const supplierDropdown=(options)=>{
    let result = [];
    options?.forEach((option) => {
      result.push({
        value: option._id,
        label: option.supplierName,
        sortName:option.supplierShortName
      });
    });
    return result;
}
const rawMaterialItemDropdown=(options)=>{
    let result = [];
    options?.forEach((option) => {
      result.push({
        value: option._id,
        label: option.itemName,
        productionQtyPerBatch:option?.productionQtyPerBatch
      });
    });
    return result;
}
const paymentInfoDropdown=(options)=>{
    let result = [];
    options?.forEach((option) => {
      result.push({
        value: option._id,
        label: option.paymentMode,
      });
    });
    return result;
}
const bankInformationDropdown=(options)=>{
    let result = [];
    options?.forEach((option) => {
      result.push({
        value: option._id,
        label: option.bankName + '-' + option.branchName + '-' + option.routingNumber,
      });
    });
    return result;
}


export {supplierDropdown,rawMaterialItemDropdown,paymentInfoDropdown,bankInformationDropdown}