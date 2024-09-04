import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import React, { useState } from "react";
import Select from "react-select";
import PaymentOptionInBankModal from "../Common/PaymentOptionInBank/PaymentOptionInBankModal";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./InsertPaymentMethodInformation.css";

const InsertPaymentMethodInformation = ({
  details,
  setFieldValue,
  touched,
  errors,
  arrayHelpers,
  paymentStatusOptions,
  paymentMethodOptions,
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  console.log(show);
  const handlePaymentMethodChange = (e, index) => {
    const paymentMethod = e.value;
    setFieldValue(`detailsData.${index}.paymentMethod`, paymentMethod);

    if (paymentMethod === "bank-cash") {
      // Trigger modal when "Bank" is selected
      // const bankPaymentModal = (document.getElementById('bankPaymentOptionModal'));
      // bankPaymentModal.show();
      setShow(true);
    }
  };
  return (
    <div
      className="shadow-lg p-4 grninsertdata-main-view"
      // style={{ height: "300px", overflowY: "auto" }}
    >
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-md-12 col-lg-12 fixed-column py-2">
            <div class="table-responsive">
              <table className="table table-bordered">
                <thead className="w-100">
                  <tr>
                    <th className="bg-white text-center  align-items-center">
                      Sl
                    </th>
                    <th
                      className="bg-white text-center  align-items-center"
                      style={{ width: "25%" }}
                    >
                      Payment Method
                    </th>
                    <th
                      className="bg-white text-center  align-items-center"
                      style={{ width: "25%" }}
                    >
                      Payment Status
                    </th>
                    <th className="bg-white text-center  align-items-center ">
                      Quantity
                    </th>
                    <th className="bg-white text-center  align-items-center ">
                      Amount
                    </th>
                    <th className="bg-white text-center  align-items-center ">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {details && details.length > 0
                    ? details.map((detail, index) => {
                        // const matchingItem = rmItemInfo?.find(
                        //   (item) => item._id === detail.itemId
                        // );

                        // const matchPONO = purchaseOrderInfo?.find(
                        //   (item) => item.poNo === values.supplierPoNo
                        // );

                        // const itemIdToCalculate = matchingItem._id;
                        // const totalQuantity = grnInfoData?.reduce((acc, cur) => {
                        //   const itemQuantity = cur.detailsData
                        //     .filter(
                        //       (item) =>
                        //         item.itemId === itemIdToCalculate &&
                        //         item.pOSingleId === matchPONO._id
                        //     )
                        //     .reduce(
                        //       (itemAcc, itemCur) => itemAcc + itemCur.quantity,
                        //       0
                        //     );
                        //   return acc + itemQuantity;
                        // }, 0);

                        // console.log(totalQuantity);
                        return (
                          <tr key={index}>
                            <td className="text-center  align-middle">
                              {index + 1}
                            </td>
                            <td className="text-center  align-items-center">
                              <div className="w-100">
                                <Select
                                  className="w-100"
                                  aria-label="Default select example"
                                  name="sizeinfo"
                                  options={paymentMethodOptions}
                                  defaultValue={{
                                    label: "Select Payment Method",
                                    value: 0,
                                  }}
                                  value={paymentMethodOptions?.filter(function (
                                    option
                                  ) {
                                    return (
                                      option.value === detail.paymentMethod
                                    );
                                  })}
                                  styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      width: "100%",
                                      borderColor: state.isFocused
                                        ? "#fff"
                                        : "#fff",
                                      border: "1px solid #2DDC1B",
                                    }),
                                    menu: (provided) => ({
                                      ...provided,
                                      zIndex: 9999,
                                      height: "auto",
                                      // overflowY: "scroll",
                                    }),
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  menuPosition="fixed"
                                  menuPortalTarget={document.body}
                                  theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                      ...theme.colors,
                                      primary25: "#B8FEB3",
                                      primary: "#2DDC1B",
                                    },
                                  })}
                                  onChange={(e) => {
                                    // swal({
                                    //   title: "Sorry!",
                                    //   text: "This Client has no PI.",
                                    //   icon: "warning",
                                    //   button: "OK",
                                    // });
                                    handlePaymentMethodChange(e, index);
                                    setFieldValue(
                                      `detailsData.${index}.paymentMethod`,
                                      e.value
                                    );
                                    if (detail.paymentMethod) {
                                    }
                                  }}
                                ></Select>
                                {
                                  <Modal
                                    style={{ opacity: show ? 1 : 0 }}
                                    show={show}
                                    onHide={handleClose}
                                    className="custom-modal"
                                  >
                                    <Modal.Header closeButton>
                                      <Modal.Title>
                                        Bank Information For Cash
                                      </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <div class="table-responsive">
                                        <table className="table table-bordered">
                                          <thead className="w-100">
                                            <tr>
                                              <th
                                                className="bg-white text-center  align-items-center"
                                                style={{ width: "25%" }}
                                              >
                                                Bank Name
                                              </th>
                                              <th
                                                className="bg-white text-center  align-items-center"
                                                style={{ width: "25%" }}
                                              >
                                                Check No
                                              </th>
                                              <th
                                                className="bg-white text-center  align-items-center"
                                                style={{ width: "25%" }}
                                              >
                                                Check Date
                                              </th>
                                              <th
                                                className="bg-white text-center  align-items-center "
                                                style={{ width: "25%" }}
                                              >
                                                Deposite Slip No
                                              </th>
                                            </tr>
                                          </thead>

                                          <tbody>
                                            <tr>
                                              <td className="text-center  align-middle">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.bankName`}
                                                  placeholder="Bank Name"
                                                  value={detail.bankName}
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "5px",
                                                    width: "100%",
                                                    borderRadius: "5px",
                                                    height: "38px",
                                                    marginBottom: "5px",
                                                    textAlign: "center",
                                                  }}
                                                  onKeyUp={(e) => {}}
                                                />
                                                <br />
                                                {/* {touched.detailsData?.[index]?.quantity &&
                                        errors.detailsData?.[index]
                                          ?.quantity && (
                                          <div className="text-danger">
                                            {errors.detailsData[index].quantity}
                                          </div>
                                        )} */}
                                              </td>
                                              <td className="text-center  align-items-center">
                                                <Field
                                                  type="text"
                                                  // name={`detailsData.${index}.quantity`}
                                                  placeholder="Check Number"
                                                  value={detail.checkNo}
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "5px",
                                                    width: "100%",
                                                    borderRadius: "5px",
                                                    height: "38px",
                                                    marginBottom: "5px",
                                                    textAlign: "center",
                                                  }}
                                                  onKeyUp={(e) => {}}
                                                />
                                                <br />
                                                {/* {touched.detailsData?.[index]?.quantity &&
                                        errors.detailsData?.[index]
                                          ?.quantity && (
                                          <div className="text-danger">
                                            {errors.detailsData[index].quantity}
                                          </div>
                                        )} */}
                                              </td>

                                              <td className="text-center  align-items-center">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.checkDate`}
                                                  placeholder="Check Date"
                                                  value={detail.checkDate}
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "5px",
                                                    width: "100%",
                                                    borderRadius: "5px",
                                                    height: "38px",
                                                    marginBottom: "5px",
                                                    textAlign: "center",
                                                  }}
                                                  onKeyUp={(e) => {}}
                                                />
                                                <br />
                                                {/* {touched.detailsData?.[index]?.quantity &&
                                        errors.detailsData?.[index]
                                          ?.quantity && (
                                          <div className="text-danger">
                                            {errors.detailsData[index].quantity}
                                          </div>
                                        )} */}
                                              </td>
                                              <td className="text-center  align-items-center">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.depositeSlipNo`}
                                                  placeholder="Deposite Slip No"
                                                  value={detail.depositeSlipNo}
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
                                                <br />
                                                {/* {touched.detailsData?.[index]?.quantity &&
                                        errors.detailsData?.[index]
                                          ?.quantity && (
                                          <div className="text-danger">
                                            {errors.detailsData[index].quantity}
                                          </div>
                                        )} */}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button
                                        variant="secondary"
                                        onClick={handleClose}
                                      >
                                        Close
                                      </Button>
                                      <Button
                                        variant="primary"
                                        onClick={handleClose}
                                      >
                                        Save
                                      </Button>
                                    </Modal.Footer>
                                  </Modal>
                                }
                              </div>
                            </td>
                            <td className="text-center  align-items-center">
                              <div className="w-100">
                                <Select
                                  className="w-100"
                                  aria-label="Default select example"
                                  name="sizeinfo"
                                  options={paymentStatusOptions}
                                  defaultValue={{
                                    label: "Select Payment Status",
                                    value: 0,
                                  }}
                                  value={paymentStatusOptions?.filter(function (
                                    option
                                  ) {
                                    return (
                                      option.value === detail.paymentStatus
                                    );
                                  })}
                                  styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      width: "100%",
                                      borderColor: state.isFocused
                                        ? "#fff"
                                        : "#fff",
                                      border: "1px solid #2DDC1B",
                                    }),
                                    menu: (provided) => ({
                                      ...provided,
                                      zIndex: 9999,
                                      height: "auto",
                                      // overflowY: "scroll",
                                    }),
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  menuPosition="fixed"
                                  menuPortalTarget={document.body}
                                  theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                      ...theme.colors,
                                      primary25: "#B8FEB3",
                                      primary: "#2DDC1B",
                                    },
                                  })}
                                  onChange={(e) => {
                                    // swal({
                                    //   title: "Sorry!",
                                    //   text: "This Client has no PI.",
                                    //   icon: "warning",
                                    //   button: "OK",
                                    // });
                                    setFieldValue(
                                      `detailsData.${index}.paymentStatus`,
                                      e.value
                                    );
                                  }}
                                ></Select>

                                {touched.supplierId && errors.supplierId && (
                                  <div className="text-danger">
                                    {errors.supplierId}
                                  </div>
                                )}
                              </div>
                              <br />
                              {touched.detailsData?.[index]?.itemId &&
                                errors.detailsData?.[index]?.itemId && (
                                  <div className="text-danger">
                                    {errors.detailsData[index].itemId}
                                  </div>
                                )}
                            </td>
                            <td className="text-center  align-items-center">
                              <Field
                                type="text"
                                name={`detailsData.${index}.quantity`}
                                placeholder="Quantity"
                                value={detail.quantity}
                                style={{
                                  border: "1px solid #2DDC1B",
                                  padding: "5px",
                                  width: "100%",
                                  borderRadius: "5px",
                                  height: "38px",
                                  marginBottom: "5px",
                                  textAlign: "center",
                                }}
                                onKeyUp={(e) => {}}
                              />
                              <br />
                              {touched.detailsData?.[index]?.quantity &&
                                errors.detailsData?.[index]?.quantity && (
                                  <div className="text-danger">
                                    {errors.detailsData[index].quantity}
                                  </div>
                                )}
                            </td>
                            <td className="text-center  align-items-center">
                              <Field
                                type="text"
                                name={`detailsData.${index}.quantity`}
                                placeholder="Quantity"
                                value={detail.quantity}
                                style={{
                                  border: "1px solid #2DDC1B",
                                  padding: "5px",
                                  width: "100%",
                                  borderRadius: "5px",
                                  height: "38px",
                                  marginBottom: "5px",
                                  textAlign: "center",
                                }}
                                onKeyUp={(e) => {}}
                              />
                              <br />
                              {touched.detailsData?.[index]?.quantity &&
                                errors.detailsData?.[index]?.quantity && (
                                  <div className="text-danger">
                                    {errors.detailsData[index].quantity}
                                  </div>
                                )}
                            </td>
                            <td className="text-center  align-middle">
                              <button
                                type="button"
                                className=" border-0 rounded  bg-transparent"
                                onClick={() => {
                                  arrayHelpers.remove(index, 1);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faXmarkCircle}
                                  className="text-danger fs-1"
                                ></FontAwesomeIcon>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertPaymentMethodInformation;
