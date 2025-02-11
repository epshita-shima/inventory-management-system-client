export const groupSalesDataByDetails = (data) => {
  return data?.reduce((acc, row) => {
    // Use only `finishGoodsDeliveryDate` and `piNo` for grouping
    const key = `${new Date(row.finishGoodsDeliveryDate).toLocaleDateString(
      "en-CA"
    )}-${row.transferFromClientId}-${row.transferToCompanyId}-${row.piId}`;

    if (!acc[key]) {
      // Initialize with row data and an empty detailsData array
      acc[key] = {
        ...row,
        detailsData: [],
      };
    }

    row.detailsData.forEach((detail) => {
      // Check if the item already exists in the detailsData array
      const existingDetail = acc[key].detailsData.find(
        (d) => d.itemId === detail.itemId
      );

      if (existingDetail) {
        // If it exists, add to the existing deliverQty
        existingDetail.deliverQty += Number(detail.deliverQty);
      } else {
        // If it doesn’t exist, add the detail to detailsData
        acc[key].detailsData.push({
          ...detail,
          deliverQty: Number(detail.deliverQty),
        });
      }
    });

    return acc;
  }, {});
};

export const groupReturnDateByDetails = (data) => {
  return data?.reduce((acc, row) => {
    // Use only `returnDate` and `piNo` for grouping
    const key = `${new Date(row.returnDate).toLocaleDateString("en-CA")}-${
      row.transferFromClientId
    }-${row.transferToCompanyId}-${row.piId}`;

    if (!acc[key]) {
      // Initialize with row data and an empty detailsData array
      acc[key] = {
        ...row,
        detailsData: [],
      };
    }

    row.detailsData.forEach((detail) => {
      // Check if the item already exists in the detailsData array
      const existingDetail = acc[key].detailsData.find(
        (d) => d.itemId === detail.itemId
      );

      if (existingDetail) {
        // If it exists, add to the existing returnQty
        existingDetail.returnQty += Number(detail.returnQty);
      } else {
        // If it doesn’t exist, add the detail to detailsData
        acc[key].detailsData.push({
          ...detail,
          returnQty: Number(detail.returnQty),
        });
      }
    });

    return acc;
  }, {});
};

export const groupProductionDateByDetails = (data) => {
  return data?.reduce((acc, row) => {
    const key = new Date(row.productionDate).toLocaleDateString("en-CA");
    if (!acc[key]) {
      acc[key] = {
        mainData: [],
      };
    }
    acc[key].mainData.push({ ...row });

    return acc;
  }, {});
};

export const groupOrderDateByDetails = (data) => {
  return data?.reduce((acc, row) => {
    const key = `${row.piDate}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {});
};

export const groupPurchaseDateByDetails = (data) => {
  return data?.reduce((acc, row) => {
    const key = `${row.receiveDate}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {});
};
