import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { Modal, Button } from "react-bootstrap";
import "./PreviousPaymentDetailsModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { useGetAllBankInformationQuery } from "../../../../redux/features/bankinformation/bankInfoAPi";

const PreviousPaymentDetailsModal = ({
  show,
  handleClosePreviousPayment,
  detail,
  finishGoods,
  sizeInfo
}) => {
    const [itemSize, setItemSize] = useState([]);
    const [itemNameData,setItemNameData]=useState([])
    const { data: bankInformation } = useGetAllBankInformationQuery(undefined);
   
    const initialValues = {
      detailsData: detail?.detailsData || [], // Initialize based on your details data
    };
    useEffect(()=>{
        const accumulatedItemNameData = [];
      const accumulatedItemSizeData = [];
      detail?.detailsData?.forEach((detail) => {
        const matchedItem = finishGoods.filter(
          (item) => item._id === detail.itemId
        );
        accumulatedItemNameData.push(...matchedItem);
        const filteredSize = matchedItem.map((item) =>
          sizeInfo?.find((x) => x?._id === item.sizeId)
        );
        accumulatedItemSizeData.push(...filteredSize);

      });
      setItemNameData(accumulatedItemNameData);
      setItemSize(accumulatedItemSizeData);
    },[detail,finishGoods,sizeInfo])


  const handleSubmit = (values) => {
    console.log(values); // Handle form submission logic here
    handleClosePreviousPayment();
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ getFieldProps }) => (
        <Form>
          <Modal
            style={{ opacity: show ? 1 : 0 }}
            show={show}
            onHide={handleClosePreviousPayment}
            className="custom-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Bank Information For Cash</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <colgroup>
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="bg-white text-center">Item Name</th>
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
                    {detail?.detailsData?.map((detailItem, index) => {
                      
                      return (
                        <tr key={index}>
                          <td
                            className="text-center align-middle"
                            style={{ width: "25%" }}
                          >
                            <Field
                              name={`detailsData.${index}.itemName`}
                              value={`${itemNameData[index]?.itemName || ''} (${itemSize[index]?.sizeInfo || 'N/A'})`}
                              type="text"
                              placeholder="Item Name"
                              disabled
                              className="form-control"
                            />
                          </td>
                          <td className="text-center align-middle">
                            <Field
                              name={`detailsData.${index}.bankName`}
                              value={detailItem.bankId}
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
                            />
                          </td>
                          <td className="text-center align-middle">
                            <Field
                              name={`detailsData.${index}.chequeDate`}
                              value={detailItem.chequeDate}
                              type="text"
                              placeholder="Cheque Date"
                              className="form-control"
                            />
                          </td>
                          <td className="text-center align-middle">
                            <Field
                              name={`detailsData.${index}.depositeSlipNo`}
                              value={detailItem.depositeSlipNo}
                              type="text"
                              placeholder="Deposite Slip No"
                              className="form-control"
                            />
                          </td>
                          <td className="text-center align-middle">
                            <Field
                              name={`detailsData.${index}.amount`}
                              value={detailItem.amount}
                              type="number"
                              placeholder="Amount"
                              className="form-control"
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
              <Button variant="secondary" onClick={handleClosePreviousPayment}>
                Close
              </Button>
              <Button type="submit" variant="primary">
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
