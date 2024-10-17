const getInitialDOFormValues = (piNumber, makebyUser) => ({
  piNumber: piNumber || "",
  doNo: "",
  mushokChallanNo: "",
  deliveryChallanNo: "",
  shipmentNo: "",
  approveStatus: "",
  approveBy: "",
  approveDate: "",
  makeBy: makebyUser || "",
  updateBy: null,
  makeDate: new Date(),
  updateDate: null,
  detailsData: [
    {
      piNumber: "",
      piDetailsId: "",
      itemId: "",
      previousDelivaryQty: "",
      dueQty: "",
      deliverQty: "",
    },
  ],
});

export default getInitialDOFormValues;
