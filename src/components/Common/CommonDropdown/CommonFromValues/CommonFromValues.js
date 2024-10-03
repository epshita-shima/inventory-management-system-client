const getInitialFormValues = (clientName, piNumber, makebyUser, paymentReceiveDate) => ({
  clientId: clientName || '', 
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
      piDetailsId:'',
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
