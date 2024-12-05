export const calculateGrandTotalSalesQty = (data) => {
  return data?.reduce((totalQty, item) => {
    const detailsQty = item.detailsData.reduce(
      (sum, detail) => sum + Number(detail.deliverQty),
      0
    );
    return totalQty + detailsQty;
  }, 0);
};

export const calculateGrandTotalSalesAmount = (data, piInformation) => {
  return data?.reduce((totalQty, detail) => {
    const detailReturnQty = detail.detailsData.reduce((sum, detail) => {
      const piNumber = piInformation?.find((pi) => pi._id === detail.piId);
      const unitPrice = piNumber?.detailsData.find(
        (item) => item.itemId === detail.itemId
      );
      return sum + Number(detail.deliverQty) * Number(unitPrice?.unitPrice || 0);
    }, 0);
    return totalQty + detailReturnQty;
  }, 0);
};