import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import React, { useState } from "react";
import Select from "react-select";
import PaymentOptionInBankModal from "../Common/PaymentOptionInBank/PaymentOptionInBankModal";
import { useGetAllBankInformationQuery } from "../../../redux/features/bankinformation/bankInfoAPi";
import { bankInformationDropdown } from "../../Common/CommonDropdown/CommonDropdown";

const UpdatePaymentMethodInformation = ({
  id,
  updatePaymentReceiveInformation,
  setUpdatePaymentReceiveInformation,
  paymentMethodOptions,
  paymentStatusOptions,
  itemNameOptions,
  makebyUser,
  invoiveByInvoiceNumber,
  bankChequeDate,
  setBankChequeDate
}) => {
  const [show, setShow] = useState(false);
  const [bankInCheque, setBankInCheque] = useState(false);
  const { data: bankInformation } = useGetAllBankInformationQuery(undefined);

  const bankInfoOptions = bankInformationDropdown(bankInformation);
  const handleClose = () => setShow(false);

  const handlePaymentMethodChange = (e, index) => {
    const paymentMethod = e.value;
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

  const handleCloseModal = (index) => {
    const newOpenModals = [...openModals];
    newOpenModals[index] = false; // Close the modal for the specific row
    setOpenModals(newOpenModals);
  };
  return (
    <div className="">
      <table className="table table-bordered">
        <thead className="w-100">
          <tr>
            <th className="bg-white text-center  align-items-center">Sl</th>
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
              Amount
            </th>
            <th className="bg-white text-center  align-items-center ">
              Unit Price
            </th>
            <th className="bg-white text-center  align-items-center ">
              Quantity
            </th>
            <th className="bg-white text-center  align-items-center ">
             Remarks
            </th>
            <th className="bg-white text-center  align-items-center ">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {updatePaymentReceiveInformation &&
          updatePaymentReceiveInformation?.detailsData?.length > 0
            ? updatePaymentReceiveInformation?.detailsData?.map(
                (detail, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center  align-middle">{index + 1}</td>
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
                              return option.value === detail.paymentMethod;
                            })}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                width: "100%",
                                borderColor: state.isFocused ? "#fff" : "#fff",
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
                              handlePaymentMethodChange(e, index);
                              setUpdatePaymentReceiveInformation((prev) => {
                                const temp_details = [...prev.detailsData];
                                const newDetail = { ...temp_details[index] };
                                newDetail["paymentMethod"] = e.value;
                                temp_details[index] = newDetail;
                                return {
                                  ...prev,
                                  detailsData: temp_details,
                                  updateBy: makebyUser,
                                  updateDate: new Date(),
                                };
                              });
                            }}
                          ></Select>
                        </div>
                      </td>
                      {openModals[index] && (
                      <PaymentOptionInBankModal
                      id={id}
                        detail={detail}
                        show={openModals[index]}
                        handleClose={() => handleCloseModal(index)}
                        index={index}
                        bankInfoOptions={bankInfoOptions}
                        bankChequeDate={bankChequeDate}
                        setBankChequeDate={setBankChequeDate}
                        bankInCheque={bankInCheque}
                        setUpdatePaymentReceiveInformation={setUpdatePaymentReceiveInformation}
                        makebyUser={makebyUser}
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
                              return option.value === detail.paymentStatus;
                            })}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                width: "100%",
                                borderColor: state.isFocused ? "#fff" : "#fff",
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
                              setUpdatePaymentReceiveInformation((prev) => {
                                const temp_details = [...prev.detailsData];
                                const newDetail = { ...temp_details[index] };
                                newDetail["paymentStatus"] = e.value;
                                temp_details[index] = newDetail;
                                return {
                                  ...prev,
                                  detailsData: temp_details,
                                  updateBy: makebyUser,
                                  updateDate: new Date(),
                                };
                              });
                            }}
                          ></Select>
                        </div>
                      </td>
                      <td className="text-center  align-items-center">
                        <div className="w-100">
                          <Select
                            className="w-100"
                            aria-label="Default select example"
                            name="sizeinfo"
                            options={itemNameOptions}
                            defaultValue={{
                              label: "Select Payment Method",
                              value: 0,
                            }}
                            value={itemNameOptions?.filter(function (option) {
                              return option.value === detail.itemId;
                            })}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                width: "100%",
                                borderColor: state.isFocused ? "#fff" : "#fff",
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
                              const filterInvoice =
                                invoiveByInvoiceNumber?.detailsData?.find(
                                  (item) => item.itemId === e.value
                                );
                                const calculateQuantity=detail.amount/filterInvoice?.unitPrice
                              setUpdatePaymentReceiveInformation((prev) => {
                                const temp_details = [...prev.detailsData];
                                const newDetail = { ...temp_details[index] };
                                newDetail["itemId"] = e.value;
                                newDetail["unitPrice"] =
                                  filterInvoice?.unitPrice;
                                newDetail["quantity"] =
                                Math.round(calculateQuantity * 100) / 100
                                temp_details[index] = newDetail;
                                return {
                                  ...prev,
                                  detailsData: temp_details,
                                  updateBy: makebyUser,
                                  updateDate: new Date(),
                                };
                              });
                            }}
                          ></Select>
                        </div>
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
                          onChange={(e) => {
                            const calCulateTotalAmount =
                              parseFloat(e.target.value) / detail.unitPrice;
                            console.log(calCulateTotalAmount);
                            setUpdatePaymentReceiveInformation((prev) => {
                              const temp_details = [...prev.detailsData];
                              const newDetail = { ...temp_details[index] };
                              newDetail["amount"] = parseFloat(e.target.value);
                              newDetail["quantity"] = parseFloat(calCulateTotalAmount.toFixed(2));
                              temp_details[index] = newDetail;
                              return {
                                ...prev,
                                detailsData: temp_details,
                                updateBy: makebyUser,
                                updateDate: new Date(),
                              };
                            });
                          }}
                        />
                      </td>
                      <td className="text-center  align-items-center">
                        <Field
                          type="number"
                          name={`detailsData.${index}.unitPrice`}
                          placeholder="Unit price"
                          value={detail.unitPrice}
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
                        <br />
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
                            setUpdatePaymentReceiveInformation((prev) => {
                              const temp_details = [...prev.detailsData];
                              const newDetail = { ...temp_details[index] };
                              newDetail["remarks"] = e.target.value;
                              temp_details[index] = newDetail;
                              return {
                                ...prev,
                                detailsData: temp_details,
                                updateBy: makebyUser,
                                updateDate: new Date(),
                              };
                            });
                          }}
                        />
                      </td>
                      <td className="text-center  align-middle">
                        <button
                          type="button"
                          className=" border-0 rounded  bg-transparent"
                          onClick={() => {
                            setUpdatePaymentReceiveInformation((prev) => {
                              const temp__details = [...prev.detailsData];
                              if (temp__details.length > 1)
                                temp__details.splice(index, 1);

                              return {
                                ...prev,
                                detailsData: [...temp__details],
                                updateBy: makebyUser,
                                updateDate: new Date(),
                              };
                            });
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
                }
              )
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default UpdatePaymentMethodInformation;
