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
      cftDeclaration:option.cftDeclaration
    });
  });
  return result;
};
const rawMaterialItemDropdownForCFT = (options) => {
  return options?.reduce((acc, option) => {
    if (option.cftDeclaration === true) {
      acc.push({
        value: option._id,
        label: option.itemName,
        productionQtyPerBatch: option?.productionQtyPerBatch,
        cftDeclaration: option.cftDeclaration
      });
    }
    return acc;
  }, []);
};
const finishGoodsWithSizeItemDropdown = (options, sizeInfo) => {
  let result = [];
  options?.forEach((option) => {
    const filteredSize = sizeInfo?.find((x) => x?._id === option.sizeId);
    result.push({
      value: option._id,
      label: option.itemName + ` (${filteredSize?.sizeInfo})`,
      productionQtyPerBatch: option?.productionQtyPerBatch,
    });
  });
  return result;
};

const rawMaterialWithUnitDropdown = (options, unitInfo) => {
  let result = [];
  options?.forEach((option) => {
    const filteredUnit = unitInfo?.find((x) => x?._id === option.unitId);
    result.push({
      value: option._id,
      label: option.itemName + ` (${filteredUnit?.unitInfo})`,
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

const deliveryOrderDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label:
        option.doNo
    });
  });
  return result;
};

const productionBatchDropdown = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label:
        option.batchNo
    });
  });
  return result;
};

const poInfoDropdown=(options)=>{
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label:
        option.poNo
    });
  });
  return result;
}

const itemUnitConvertSelectOption = (options) => {
  let result = [];
  options?.forEach((option) => {
    result.push({
      value: option._id,
      label: option.unitInfo,
    });
  });
  return result;
};
  const categoryInfoConvertSelectOption = (options) => {
    let result = [];
    options?.forEach((option) => {
      result.push({
        value: option._id,
        label: option.categoryInfo,
      });
    });
    return result;
  };
  const itemSizeConvertSelectOption = (options) => {
    let result = [];
    options?.forEach((option) => {
      result.push({
        value: option._id,
        label: option.sizeInfo,
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
  paymnetInformationDropdown,
  deliveryOrderDropdown,
  rawMaterialWithUnitDropdown,
  productionBatchDropdown,
  poInfoDropdown,rawMaterialItemDropdownForCFT,
  itemUnitConvertSelectOption,
  categoryInfoConvertSelectOption,
  itemSizeConvertSelectOption
};
