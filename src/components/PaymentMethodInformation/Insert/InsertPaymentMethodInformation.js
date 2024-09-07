import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import PaymentOptionInBankModal from "../Common/PaymentOptionInBank/PaymentOptionInBankModal";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./InsertPaymentMethodInformation.css";
import { useGetAllBankInformationQuery } from "../../../redux/features/bankinformation/bankInfoAPi";
import { bankInformationDropdown } from "../../Common/CommonDropdown/CommonDropdown";

const InsertPaymentMethodInformation = ({
  details,
  setFieldValue,
  touched,
  errors,
  arrayHelpers,
  paymentStatusOptions,
  paymentMethodOptions,
  bankChequeDate,
  setBankChequeDate,
  itemNameData,
  itemSize,
  setFormValues
}) => {
  const [show, setShow] = useState(false);
  const [bankInCheque, setBankInCheque] = useState(false);
  const { data: bankInformation } = useGetAllBankInformationQuery(undefined);

  const bankInfoOptions = bankInformationDropdown(bankInformation);
  const handleClose = () => setShow(false);

  const handlePaymentMethodChange = (e, index) => {
    const paymentMethod = e.value;
    setFieldValue(`detailsData.${index}.paymentMethod`, paymentMethod);
    if (paymentMethod === "bank-cheque") {
      const newOpenModals = [...openModals];
      newOpenModals[index] = true; // Set the modal open for the specific row
      setOpenModals(newOpenModals);
      setShow(true);
      setBankInCheque(true);
    }
    if (paymentMethod === "bank-cash") {
      const newOpenModals = [...openModals];
      newOpenModals[index] = true; // Set the modal open for the specific row
      setOpenModals(newOpenModals);
      setShow(true);
      setBankInCheque(false);
    }
  };
  const [openModals, setOpenModals] = useState([]); // Track open modals for each detail

  // Function to handle modal open/close
  const handleOpenModal = (index) => {};

  const handleCloseModal = (index) => {
    const newOpenModals = [...openModals];
    newOpenModals[index] = false; // Close the modal for the specific row
    setOpenModals(newOpenModals);
  };
console.log(itemNameData)
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
                      style={{ width: "15%" }}
                    >
                      Payment Method
                    </th>
                    <th
                      className="bg-white text-center  align-items-center"
                      style={{ width: "15%" }}
                    >
                      Payment Status
                    </th>
                    <th
                      className="bg-white text-center  align-items-center"
                      style={{ width: "20%" }}
                    >
                      Item Name
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
                        console.log(detail);
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
                                    setFormValues((prev) => {
                                      const temp_details = [...prev.detailsData];
                                      const newDetail = { ...temp_details[index] };
                                      newDetail["paymentMethod"] = e.value;
                                      temp_details[index] = newDetail;
                                      return {
                                        ...prev,
                                        detailsData: [...temp_details],
                                        
                                      };
                                    });
                                    if (detail.paymentMethod) {
                                    }
                                  }}
                                ></Select>
                              </div>
                            </td>
                            {openModals[index] && (
                              <PaymentOptionInBankModal
                                detail={detail}
                                show={openModals[index]} // Pass row-specific modal visibility
                                handleClose={() => handleCloseModal(index)} // Close modal for this specific row
                                index={index}
                                bankInfoOptions={bankInfoOptions}
                                setFieldValue={setFieldValue}
                                bankChequeDate={bankChequeDate}
                                setBankChequeDate={setBankChequeDate}
                                bankInCheque={bankInCheque}
                                setFormValues={setFormValues}
                              />
                            )}
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
                                    setFormValues((prev) => {
                                      const temp_details = [...prev.detailsData];
                                      const newDetail = { ...temp_details[index] };
                                      newDetail["paymentStatus"] = e.value;
              
                                      temp_details[index] = newDetail;
                                      return {
                                        ...prev,
                                        detailsData: [...temp_details],
                                      };
                                    });
                                  }}
                                ></Select>

                                {touched.paymentStatus &&
                                  errors.paymentStatus && (
                                    <div className="text-danger">
                                      {errors.paymentStatus}
                                    </div>
                                  )}
                              </div>
                            </td>
                            <td className="text-center  align-items-center">
                              <Field
                                type="text"
                                name={`detailsData.${index}.itemId`}
                                placeholder="Item Name"
                                value={`${itemNameData[index]?.itemName || ''} (${itemSize[index]?.sizeInfo || 'N/A'})`}
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
                               
                              />
                            </td>
                            <td className="text-center  align-items-center">
                              <Field
                                type="number"
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
                                onKeyUp={(e) => {
                                  const calCulateTotalAmount =
                                    parseFloat(e.target.value) *
                                    detail.unitPrice;
                                  console.log(calCulateTotalAmount);
                                  setFieldValue(
                                    `detailsData.${index}.amount`,
                                    calCulateTotalAmount
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.quantity`,
                                    parseFloat(e.target.value)
                                  );
                                }}
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
                                type="number"
                                name={`detailsData.${index}.amount`}
                                placeholder="Amount"
                                value={detail.amount}
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
                                  setFieldValue(
                                    `detailsData.${index}.amount`,
                                    parseFloat(e.target.value)
                                  );
                                }}
                              />
                              <br />
                              {touched.detailsData?.[index]?.amount &&
                                errors.detailsData?.[index]?.amount && (
                                  <div className="text-danger">
                                    {errors.detailsData[index].amount}
                                  </div>
                                )}
                            </td>
                            <td className="text-center  align-items-center">
                              <textarea
                                type="text"
                                name={`detailsData.${index}.remarks`}
                                placeholder="Remarks"
                                value={detail.remarks}
                                style={{
                                  border: "1px solid #2DDC1B",
                                  padding: "5px",
                                  width: "100%",
                                  borderRadius: "5px",
                                  height: "38px",
                                  marginBottom: "5px",
                                  textAlign: "left",
                                }}
                                onChange={(e) => {
                                  setFieldValue(
                                    `detailsData.${index}.remarks`,
                                   e.target.value
                                  );
                                }}
                              />
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
