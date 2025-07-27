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
      return (
        sum + Number(detail.deliverQty) * Number(unitPrice?.unitPrice || 0)
      );
    }, 0);
    return totalQty + detailReturnQty;
  }, 0);
};

export const calculateGrandTotalReturnQty = (data) => {
 return data?.reduce((totalQty, detail) => {
    const detailReturnQty = detail.detailsData.reduce(
      (sum, item) => sum + Number(item.returnQty),
      0
    );

    return totalQty + Number(detailReturnQty);
  }, 0);
};

export const calculateGrandTotalReturnAmount = (data, piInformation) => {
  return data?.reduce((totalQty, detail) => {
    const detailReturnQty = detail.detailsData.reduce((sum, detail) => {
      const piNumber = piInformation?.find((pi) => pi._id === detail.piId);
      const unitPrice = piNumber?.detailsData.find(
        (item) => item.itemId === detail.itemId
      );
      return sum + detail.returnQty * unitPrice?.unitPrice;
    }, 0);
    return totalQty + detailReturnQty;
  }, 0);
};

export const calculateGrandTotalPIQty = (data) => {
  return data?.reduce((totalQty, detail) => {
     const detailPIQty = detail.detailsData.reduce(
       (sum, item) => sum + Number(item.quantity),
       0
     );
 
     return totalQty + Number(detailPIQty);
   }, 0);
 };
 
 export const calculateGrandTotalPIAmount = (data) => {
  return data?.reduce((totalAmount, detail) => {
     const detailPIAmount = detail.detailsData.reduce(
       (sum, item) => sum + Number(item.totalAmount),
       0
     );
 
     return totalAmount + Number(detailPIAmount);
   }, 0);
 };

export const calculateProductionQuantity=(data)=>{
  return data?.reduce((totalQuantity, item) => 
    totalQuantity + item.productionQty,0);

}

export const calculatePurchaseQuantity=(data)=>{
  return data.reduce((totalQuantity,details)=>{
    const detailsQty=details.detailsData.reduce((sum,item)=>sum+item.quantity,0)
    return totalQuantity + detailsQty
  },0)
}

export const calculatePurchaseAmount=(data)=>{
  return data.reduce((totalAmount,details)=>{
    const detailsAmount=details.detailsData.reduce((sum,item)=>sum+item.amount,0)
    return totalAmount + detailsAmount
  },0)
}