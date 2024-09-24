import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import swal from "sweetalert";

const SpecialDelivaryModal = ({
  show,
  setShow,
  row,
  handleClose,
  finishGoodsData,
  sizeInfo,
  setFormValues,
  formValues,
  filters,
  makebyUser,
  selectedData,
  approveStatus,
  insertPaymentReceive,
  navigate
}) => {
  const itemName = finishGoodsData.find(
    (item) => item._id == row.detailsData.itemId
  );
  const sizeDetails = sizeInfo.find((size) => size._id == itemName.sizeId);
  const initialValues =  formValues ;
  const handleSubmit = async (e,values) => {
    e.preventDefault()
    console.log(formValues)
    console.log(selectedData);
    const response = await approveStatus(selectedData);
    if (response?.data?.status === 200) {
      const response = await insertPaymentReceive(formValues);
      if (response?.data?.status === 200) {
        navigate("/main-view/invoice-list");
        swal("Done", "PI Approve Successfully", "success");
      } else if (response?.error?.status === 400) {
        swal("Not Possible!", response?.error?.data?.message, "error");
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
      }}
      enableReinitialize={true}
    >
      {({ values, setFieldValue }) => (
        <Form
          id="specialpaymentreceive-form"
          onSubmit={(e) => {
            handleSubmit(e, values);
          }}
        >
          <Modal
            style={{ opacity: show ? 1 : 0 }}
            show={show}
            onHide={handleClose}
            className="custom-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Special Approve For LC</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row row-cols-1 justify-content-center  row-cols-md-2 row-cols-lg-4">
                <div className={`col col-md-6`}>
                  <label
                    htmlFor="bankId"
                    className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
                  >
                    Item Name
                  </label>
                  <Field
                    type="number"
                    name={`detailsData.itemid`}
                    placeholder={
                      itemName.itemName + ` (${sizeDetails.sizeInfo})`
                    }
                    value={itemName.itemName}
                    disabled
                    style={{
                      border: "1px solid #2DDC1B",
                      padding: "5px",
                      width: "100%",
                      borderRadius: "5px",
                      height: "38px",
                      marginBottom: "5px",
                      textAlign: "center",
                    }}
                    onKeyUp={(e) => {
                      // setFieldValue(
                      //   `detailsData.${index}.quantity`,
                      //   parseFloat(e.target.value)
                      // );
                    }}
                  />
                </div>
                <div className={`col col-md-6 `}>
                  <label
                    htmlFor="depositeSlipNo"
                    className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
                  >
                    Amount
                  </label>

                  <Field
                    type="text"
                    name={`detailsData.amount`}
                    placeholder="Amount"
                    value={formValues.detailsData[0].amount}
                    style={{
                      border: "1px solid #2DDC1B",
                      padding: "5px",
                      width: "100%",
                      borderRadius: "5px",
                      height: "38px",
                      marginBottom: "5px",
                      textAlign: "center",
                    }}
                    onChange={(e) => {
                      const calCulateTotalAmount =
                        parseFloat(e.target.value) / row.detailsData.unitPrice;
                      
                      setFormValues((prev) => {
                        const temp_details = [...prev.detailsData];
                        const newDetail = {
                          ...temp_details[0],
                        };
                        newDetail["itemId"] = row.detailsData.itemId;
                        newDetail["paymentStatus"] = "cash";
                        newDetail["paymentMethod"] = "cash";
                        newDetail["unitPrice"] = row.detailsData.unitPrice;
                        newDetail["amount"] = e.target.value;
                        newDetail["quantity"] = calCulateTotalAmount.toFixed(2);
                        newDetail["paymentReceiveDate"] = new Date().toLocaleDateString('en-CA');
                       
                        temp_details[0] = newDetail;
                        return {
                          ...prev,
                          clientId: filters.customerID,  // Assuming you are getting clientId from filters
                          piNumber: filters.piNumber, 
                          makeBy:makebyUser,
                          detailsData: [...temp_details],
                        };
                      });
                    }}
                  />
                </div>
                <div className={`col col-md-6`}>
                  <label
                    htmlFor="bankId"
                    className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
                  >
                    Unit Price
                  </label>
                  <Field
                    type="number"
                    name={`detailsData.itemid`}
                    placeholder={row.detailsData.unitPrice}
                    value={row.detailsData.unitPrice}
                    disabled
                    style={{
                      border: "1px solid #2DDC1B",
                      padding: "5px",
                      width: "100%",
                      borderRadius: "5px",
                      height: "38px",
                      marginBottom: "5px",
                      textAlign: "center",
                    }}
                    onKeyUp={(e) => {
                      const calCulateTotalAmount =
                        parseFloat(e.target.value) / row.detail.unitPrice;
                      console.log(parseFloat(calCulateTotalAmount.toFixed(2)));

                      // setFieldValue(
                      //   `detailsData.${index}.quantity`,
                      //   parseFloat(e.target.value)
                      // );
                    }}
                  />
                </div>
                <div className={`col col-md-6`}>
                  <label
                    htmlFor="depositeSlipNo"
                    className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
                  >
                    Quantity
                  </label>

                  <Field
                    type="text"
                    name={`detailsData.quantity`}
                    placeholder="Quantity"
                      value={isNaN(formValues.detailsData[0].quantity) ? 0:formValues.detailsData[0].quantity }
                    disabled
                    style={{
                      border: "1px solid #2DDC1B",
                      padding: "5px",
                      width: "100%",
                      borderRadius: "5px",
                      height: "38px",
                      marginBottom: "5px",
                      textAlign: "center",
                    }}
                    onChange={(e) => {}}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{ backgroundColor: "red", border: "none" }}
                variant="secondary"
                onClick={() => {
                  handleClose();
                }}
              >
                Close
              </Button>
              <Button

                style={{ backgroundColor: "#2DDC1B", border: "none" }}
                variant="primary"
                 form="specialpaymentreceive-form"
                type="submit"
                onClick={handleClose}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      )}
    </Formik>
  );
};

export default SpecialDelivaryModal;
