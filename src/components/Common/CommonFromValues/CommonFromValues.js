const getInitialFormValues = (clientName, piNumber, makebyUser, paymentReceiveDate) => ({
  clientId: clientName || '', // Fallback to empty string if undefined
  piNumber: piNumber || '',
  makeBy: makebyUser || '',
  updateBy: null,
  makeDate: new Date(),
  updateDate: null,
  detailsData: [
    {
      paymentReceiveDate: paymentReceiveDate || new Date(),
      paymentMethod: "",
      paymentStatus: "",
      itemId: "",
      amount: "",
      quantity: "",
      unitPrice: "",
      bankId: "",
      chequeNo: "",
      chequeDate: "",
      depositeSlipNo: "",
      remarks: "",
    },
  ],
});

export default getInitialFormValues;
