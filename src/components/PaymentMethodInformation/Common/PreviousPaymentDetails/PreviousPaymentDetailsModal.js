import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { Modal, Button } from "react-bootstrap";
import "./PreviousPaymentDetailsModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { useGetAllBankInformationQuery } from "../../../../redux/features/bankinformation/bankInfoAPi";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useUpdatePaymentReceiveInfoMutation } from "../../../../redux/features/paymentreceiveinfo/paymentreceiveApi";

const PreviousPaymentDetailsModal = ({
  show,
  handleClosePreviousPayment,
  detail,
  finishGoods,
  sizeInfo,
  setPreviousPaymentData,
  bankChequeDate,
  setBankChequeDate,
  makebyUser
}) => {
  const [itemSize, setItemSize] = useState([]);
  const [itemNameData, setItemNameData] = useState([]);
  const [bankName, setBankName] = useState([]);
  const [paymentReceivePreviousData,setPaymentReceivePreviousData]=useState([])
  const { data: bankInformation } = useGetAllBankInformationQuery(undefined);
  const initialValues = {
    detailsData: detail?.detailsData || [], // Initialize based on your details data
  };
  console.log(initialValues);
  const [updatePreviousPaymentReceiveData] =
    useUpdatePaymentReceiveInfoMutation();

  useEffect(() => {
    const accumulatedItemNameData = [];
    const accumulatedItemSizeData = [];
    const accumulatedBankData = [];
    detail?.detailsData?.forEach((detail) => {
      const matchedItem = finishGoods.filter(
        (item) => item._id === detail.itemId
      );
      accumulatedItemNameData.push(...matchedItem);
      const filteredSize = matchedItem.map((item) =>
        sizeInfo?.find((x) => x?._id === item.sizeId)
      );
      const filteredBank = bankInformation.filter(
        (item) => item?._id === detail.bankId
      );
      accumulatedBankData.push(...filteredBank);
      accumulatedItemSizeData.push(...filteredSize);
    });
    setBankName(accumulatedBankData);
    setItemNameData(accumulatedItemNameData);
    setItemSize(accumulatedItemSizeData);
    setPaymentReceivePreviousData(detail)
  }, [detail, finishGoods, sizeInfo, bankInformation]);

  console.log(paymentReceivePreviousData)
  const handleSubmit = (e, values) => {
    e.preventDefault();
    updatePreviousPaymentReceiveData(paymentReceivePreviousData);
    handleClosePreviousPayment();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting, }) => {
        setSubmitting(false);
      }}
      enableReinitialize={true}
    >
      {({ values, setFieldValue }) => (
        <Form id="updatepaymentreceive-form" 
         onSubmit={(e) => {
          handleSubmit(e, values);
        }}>
          <Modal
            style={{ opacity: show ? 1 : 0 }}
            show={show}
            onHide={handleClosePreviousPayment}
            className="custom-modal-previous-payment"
          >
            <Modal.Header closeButton>
              <Modal.Title>Previous Payment Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="table-responsive p-4">
                <table className="table w-full table-bordered">
                  <thead className="w-100">
                    <tr>
                      <th className="bg-white text-center">
                        Item Name With Description
                      </th>
                      <th className="bg-white text-center">Bank Name</th>
                      <th className="bg-white text-center">Cheque No</th>
                      <th className="bg-white text-center">Cheque Date</th>
                      <th className="bg-white text-center">Deposite Slip No</th>
                      <th className="bg-white text-center">Amount</th>
                      <th className="bg-white text-center">Rate</th>
                      <th className="bg-white text-center">Quantity</th>
                      <th className="bg-white text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paymentReceivePreviousData?.detailsData?.map((detailItem, index) => {
                      console.log(detailItem);
                      return (
                        <tr key={index}>
                          <td className="text-center align-middle">
                            <Field
                              name={`detailsData.${index}.itemName`}
                              value={`${itemNameData[index]?.itemName || ""} (${
                                itemSize[index]?.sizeInfo || "N/A"
                              })`}
                              type="text"
                              placeholder="Item Name"
                              disabled
                              className="form-control"
                            />
                          </td>
                          <td className="text-center align-middle">
                            <Field
                              name={`detailsData.${index}.bankName`}
                              value={`${bankName[index]?.bankName || ""}`}
                              type="text"
                              placeholder="Bank Name"
                              disabled
                              className="form-control"
                            />
                          </td>
                          <td className="text-center align-middle">
                            <Field
                              name={`detailsData.${index}.chequeNo`}
                              value={detailItem.chequeNo}
                              type="text"
                              placeholder="Cheque Number"
                              className="form-control"
                              onChange={(e) => {
                                setPaymentReceivePreviousData((prev) => {
                                  const temp_details = [...prev.detailsData];
                                  const newDetail = { ...temp_details[index] };
                                  newDetail["chequeNo"] =e.target.value;
                                
                                  temp_details[index] = newDetail;

                                  return {
                                    ...prev,
                                    detailsData: temp_details,
                                    updateBy: makebyUser,
                                    updateDate: new Date(),
                                  };
                                });
                                setFieldValue(
                                  `detailsData.${index}.chequeNo`,
                                  e.target.value
                                );
                              }}
                            />
                          </td>
                          <td className="text-center align-middle">
                            <DatePicker
                              dateFormat="y-MM-dd"
                              className="text-center custom-datepicker-payment-receive"
                              name={`detailsData.${index}.chequeDate`}
                              value={detail?.chequeDate}
                              calendarClassName="custom-calendar"
                              selected={
                                detail?.chequeDate
                                  ? detail?.chequeDate
                                  : bankChequeDate
                              }
                              required
                              onChange={(bankChequeDate) => {
                                setPaymentReceivePreviousData((prev) => {
                                  const temp_details = [...prev.detailsData];
                                  const newDetail = { ...temp_details[index] };
                                  newDetail["chequeDate"] = bankChequeDate.toLocaleDateString("en-CA");
                                
                                  temp_details[index] = newDetail;

                                  return {
                                    ...prev,
                                    detailsData: temp_details,
                                    updateBy: makebyUser,
                                    updateDate: new Date(),
                                  };
                                });
                                setBankChequeDate(
                                  bankChequeDate.toLocaleDateString("en-CA")
                                );
                                setFieldValue(
                                  `detailsData.${index}.chequeDate`,
                                  bankChequeDate.toLocaleDateString("en-CA")
                                );
                              }}
                            />
                          </td>
                          <td className="text-center align-middle">
                            <Field
                              name={`detailsData.${index}.depositeSlipNo`}
                              value={detailItem.depositeSlipNo}
                              type="text"
                              placeholder="Deposite Slip No"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue(
                                  `detailsData.${index}.depositeSlipNo`,
                                  e.target.value
                                );
                              }}
                            />
                          </td>
                          <td className="text-center align-middle">
                            <Field
                              name={`detailsData.${index}.amount`}
                              value={detailItem.amount}
                              type="number"
                              placeholder="Amount"
                              className="form-control"
                              onKeyUp={(e) => {
                                // Parse the amount and unit price values
                                const amountValue = parseFloat(e.target.value);
                                const unitPriceValue = parseFloat(
                                  detailItem.unitPrice
                                );
                                console.log(
                                  e.target.value,
                                  amountValue,
                                  unitPriceValue
                                );
                                // Check if the parsed values are valid numbers
                                if (
                                  !isNaN(amountValue) &&
                                  !isNaN(unitPriceValue) &&
                                  unitPriceValue > 0
                                ) {
                                  const calCulateTotalAmount =
                                    amountValue / unitPriceValue;

                                    setPaymentReceivePreviousData((prev) => {
                                      const temp_details = [...prev.detailsData];
                                      const newDetail = { ...temp_details[index] };
                                      newDetail["amount"] =  amountValue;
                                      newDetail["quantity"] =   calCulateTotalAmount;
                                      temp_details[index] = newDetail;
    
                                      return {
                                        ...prev,
                                        detailsData: temp_details,
                                        updateBy: makebyUser,
                                        updateDate: new Date(),
                                      };
                                    });
                                  setFieldValue(
                                    `detailsData.${index}.amount`,
                                    amountValue
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.quantity`,
                                    calCulateTotalAmount
                                  );

                                  console.log(
                                    "Calculated Total Amount:",
                                    calCulateTotalAmount
                                  );
                                } else {
                                  console.log(
                                    "Invalid values for amount or unit price"
                                  );
                                  // Handle the invalid case, for example by setting quantity to 0 or leaving it unchanged
                                  setFieldValue(
                                    `detailsData.${index}.quantity`,
                                    0
                                  );
                                }
                              }}
                              style={{ textAlign: "center" }}
                            />
                          </td>
                          <td className="text-center align-middle">
                            <Field
                              name={`detailsData.${index}.unitPrice`}
                              value={detailItem.unitPrice}
                              type="number"
                              disabled
                              placeholder="Rate"
                              className="form-control"
                              style={{ textAlign: "center" }}
                            />
                          </td>
                          <td className="text-center align-middle">
                            <Field
                              name={`detailsData.${index}.quantity`}
                              value={detailItem.quantity}
                              type="number"
                              disabled
                              placeholder="Quantity"
                              className="form-control"
                              style={{ textAlign: "center" }}
                            />
                          </td>
                          <td className="text-center align-middle">
                            <button
                              type="button"
                              className=" border-0 rounded  bg-transparent"
                              // onClick={() => {
                              //   arrayHelpers.remove(index, 1);
                              // }}
                            >
                              <FontAwesomeIcon
                                icon={faXmarkCircle}
                                className="text-danger fs-1"
                              ></FontAwesomeIcon>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button style={{backgroundColor:"red", border:"none"}} variant="secondary" onClick={handleClosePreviousPayment}>
                Close
              </Button>
              <Button style={{
                backgroundColor:"#2DDC1B",
                border:"none"

              }} form="updatepaymentreceive-form" type="submit" variant="primary">
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      )}
    </Formik>
  );
};

export default PreviousPaymentDetailsModal;
