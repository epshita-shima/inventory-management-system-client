import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { Modal, Button } from "react-bootstrap";
import "./PreviousPaymentDetailsModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { useGetAllBankInformationQuery } from "../../../../redux/features/bankinformation/bankInfoAPi";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {
  useUpdatePreviousPaymentReceiveInfoMutation,
} from "../../../../redux/features/paymentreceiveinfo/paymentreceiveApi";
import swal from "sweetalert";
import Select from "react-select";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";

const PreviousPaymentDetailsModal = ({
  show,
  handleClosePreviousPayment,
  detail,
  finishGoods,
  sizeInfo,
  setPreviousPaymentData,
  bankChequeDate,
  setBankChequeDate,
  makebyUser,
  paymentStatusOptions,
  refetch,
  invoiceInformation,
  setshowPreviousPaymentDetailsButton
}) => {
  const [itemSize, setItemSize] = useState([]);
  const [itemNameData, setItemNameData] = useState([]);
  const [bankName, setBankName] = useState([]);
  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
  const [paymentReceivePreviousData, setPaymentReceivePreviousData] = useState(
    []
  );
  const [
    updatePreviousPaymentReceiveDataPaymentDetails,
    setUpdatePreviousPaymentReceiveDataPaymentDetails,
  ] = useState([]);
  const { data: bankInformation } = useGetAllBankInformationQuery(undefined);
  const [updatePreviousPaymentReceiveData] =
    useUpdatePreviousPaymentReceiveInfoMutation();
  const [isDeletePreviousPaymentData, setIsDeletePreviousPaymentData] =
    useState({});
console.log(detail)
  let serialNo = 1;
  const initialValues = {
    detailsData: detail?.detailsData || [], // Initialize based on your details data
  };
  const customerName = customerInfo?.find(
    (x) => x._id === detail?.[0]?.clientId
  );
  const clientNameValue = customerName ? customerName.clientName : "N/A";

  console.log(updatePreviousPaymentReceiveDataPaymentDetails);
 
  useEffect(() => {
    const accumulatedItemNameData = [];
    const accumulatedItemSizeData = [];
    const accumulatedBankData = [];

    detail?.forEach((detailItem) => {
      detailItem?.detailsData?.forEach((dataDetail) => {
        // Filter finishGoods by matching itemId
        const matchedItem = finishGoods.filter(
          (item) => item._id === dataDetail.itemId
        );

        // Accumulate matched items for item name data
        accumulatedItemNameData.push(...matchedItem);

        // Map matched items to their corresponding size from sizeInfo
        const filteredSize = matchedItem.map((item) =>
          sizeInfo?.find((x) => x?._id === item.sizeId)
        );
        accumulatedItemSizeData.push(...filteredSize);

        // Filter bank information based on bankId
        const filteredBank = bankInformation.filter(
          (bankItem) => bankItem?._id === dataDetail.bankId
        );
        accumulatedBankData.push(...filteredBank);
      });
    });

    // Set the state with the accumulated data
    setBankName(accumulatedBankData);
    console.log(accumulatedItemNameData)
    setItemNameData(accumulatedItemNameData);
    setItemSize(accumulatedItemSizeData);
    setPaymentReceivePreviousData(detail);
  }, [detail, finishGoods, sizeInfo, bankInformation]);

  const handleCheckboxChange = (index) => {
    setIsDeletePreviousPaymentData((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the state for the specific item
    }));
  };

  const handleSubmit = async (e, values) => {
    e.preventDefault();

    const filterPiData = invoiceInformation?.find(
      (item) => item.invoiceNo === paymentReceivePreviousData[0]?.piNumber
    );
    const totalPiAmount = filterPiData?.detailsData.reduce(
      (acc, item) => acc + item.totalAmount,
      0
    );

    const adjustQuantityItems = paymentReceivePreviousData?.map((payment) =>
      payment.detailsData.filter(
        (detailItem) => detailItem.paymentStatus === "adjustment"
      )
    );
    const flattenedAdjustQuantityItems = adjustQuantityItems
      ?.flat()
      .filter(Boolean);

    const totalAdjustmentAmount = flattenedAdjustQuantityItems?.reduce(
      (acc, item) => acc + (Number(item.amount) || 0),
      0
    );

    try {
      if (totalPiAmount < totalAdjustmentAmount) {
        swal(
          "Not Possible!",
          "Adjust amount is more than Paid amount",
          "warning"
        );
      } else {
        const response = await updatePreviousPaymentReceiveData(
          updatePreviousPaymentReceiveDataPaymentDetails
        );

        if (response?.data?.status === 200) {
          swal("Done", "Data Update Successfully", "success");
          handleClosePreviousPayment();
          refetch();
        } else if (response?.error?.status === 400) {
          swal("Not Possible!", response?.error?.data?.message, "error");
        }
      }
    } catch (err) {
      swal("Error", "An error occurred while creating the data", "error");
    }
  };
  let cumulativeIndex = 0
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
          id="updatepaymentreceive-form"
          onSubmit={(e) => {
            handleSubmit(e, values);
          }}
        >
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
                <div className="d-flex w-50">
                  <div>
                    <label htmlFor="">Client Name</label>
                    <Field
                      name="clientId"
                      value={clientNameValue}
                      type="text"
                      placeholder="Item Name"
                      disabled
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label htmlFor="">PI Number</label>
                    <Field
                      name="piNumber"
                      value={detail?.[0]?.piNumber}
                      type="text"
                      placeholder="Item Name"
                      disabled
                      className="form-control ms-2"
                    />
                  </div>
                </div>
                <table className="table w-full table-bordered mt-4">
                  <thead className="w-100">
                    <tr>
                      <th>Sl.</th>
                      <th className="bg-white text-center">
                        Item Name With Description Details
                      </th>
                      <th className="bg-white text-center">Bank Name</th>
                      <th className="bg-white text-center">Payment Type</th>
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
                    {paymentReceivePreviousData.map((payment, paymentIndex) =>
                      payment?.detailsData.map((detailItem, index) => {
                        const indexXlaculate = paymentIndex - index;
                        const currentIndex = cumulativeIndex; // Capture the current cumulative index
                        cumulativeIndex++;
                        return (
                          <tr key={`${paymentIndex}-${index}`}>
                            <td className="text-center align-middle">
                              {serialNo++}
                            </td>
                            <td className="text-center align-middle">
                              <Field
                                name={`detailsData.${index}.itemName`}
                                value={`${
                                  itemNameData[currentIndex]?.itemName || ""
                                } (${itemSize[currentIndex]?.sizeInfo || "N/A"})`}
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
                            <td className="text-center  align-items-center">
                              <div className="w-100">
                                <Select
                                  className="w-100"
                                  aria-label="Default select example"
                                  name="sizeinfo"
                                  options={paymentStatusOptions}
                                  defaultValue={{
                                    label: "Select Payment Type",
                                    value: 0,
                                  }}
                                  value={paymentStatusOptions?.filter(function (
                                    option
                                  ) {
                                    return (
                                      option.value === detailItem.paymentStatus
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
                                    setPaymentReceivePreviousData((prev) => {
                                      const temp_details = prev.map((item) => {
                                        const updatedDetailsData =
                                          item.detailsData.map((singleData) => {
                                            if (
                                              singleData._id === detailItem._id
                                            ) {
                                              return {
                                                ...singleData,
                                                paymentStatus: e.value,
                                              };
                                            }
                                            return singleData;
                                          });
                                        return {
                                          ...item,
                                          detailsData: updatedDetailsData,
                                          updateBy: makebyUser,
                                          updateDate: new Date(),
                                        };
                                      });

                                      return temp_details;
                                    });
                                    setUpdatePreviousPaymentReceiveDataPaymentDetails(
                                      (prevData) => {
                                        const existingIndex =
                                          prevData.findIndex(
                                            (item) =>
                                              item._id === detailItem._id
                                          );

                                        if (existingIndex > -1) {
                                          const updatedData = [...prevData];
                                          updatedData[existingIndex] = {
                                            ...detailItem,
                                            paymentStatus: e.value,
                                          };
                                          return updatedData;
                                        } else {
                                          return [
                                            ...prevData,
                                            {
                                              ...detailItem,
                                              paymentStatus: e.value,
                                            },
                                          ];
                                        }
                                      }
                                    );
                                    setFieldValue(
                                      `detailsData.${index}.paymentStatus`,
                                      e.value
                                    );
                                  }}
                                ></Select>
                              </div>
                            </td>
                            <td className="text-center align-middle">
                              <Field
                                name={`detailsData.${index}.chequeNo`}
                                value={detailItem.chequeNo}
                                type="text"
                                disabled={
                                  detailItem.paymentMethod === "bank-cash"
                                    ? true
                                    : false
                                }
                                placeholder="Cheque Number"
                                className="form-control"
                                onChange={(e) => {
                                  setPaymentReceivePreviousData((prev) => {
                                    const temp_details = prev.map((item) => {
                                      const updatedDetailsData =
                                        item.detailsData.map((singleData) => {
                                          if (
                                            singleData._id === detailItem._id
                                          ) {
                                            return {
                                              ...singleData,
                                              chequeNo: e.target.value,
                                            };
                                          }
                                          return singleData;
                                        });
                                      return {
                                        ...item,
                                        detailsData: updatedDetailsData,
                                        updateBy: makebyUser,
                                        updateDate: new Date(),
                                      };
                                    });

                                    return temp_details;
                                  });
                                  setUpdatePreviousPaymentReceiveDataPaymentDetails(
                                    (prevData) => {
                                      const existingIndex = prevData.findIndex(
                                        (item) => item._id === detailItem._id
                                      );

                                      if (existingIndex > -1) {
                                        const updatedData = [...prevData];
                                        updatedData[existingIndex] = {
                                          ...detailItem,
                                          chequeNo: e.target.value,
                                        };
                                        return updatedData;
                                      } else {
                                        return [
                                          ...prevData,
                                          {
                                            ...detailItem,
                                            chequeNo: e.target.value,
                                          },
                                        ];
                                      }
                                    }
                                  );
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
                                value={
                                  detailItem?.chequeDate
                                    ? detailItem?.chequeDate
                                    : bankChequeDate
                                }
                                disabled={
                                  detailItem.paymentMethod === "bank-cash"
                                    ? true
                                    : false
                                }
                                calendarClassName="custom-calendar"
                                selected={bankChequeDate}
                                required
                                onChange={(bankChequeDate) => {
                                  setPaymentReceivePreviousData((prev) => {
                                    const temp_details = prev.map((item) => {
                                      const updatedDetailsData =
                                        item.detailsData.map((singleData) => {
                                          if (
                                            singleData._id === detailItem._id
                                          ) {
                                            return {
                                              ...singleData,
                                              chequeDate:
                                                bankChequeDate.toLocaleDateString(
                                                  "en-CA"
                                                ),
                                            };
                                          }
                                          return singleData;
                                        });
                                      return {
                                        ...item,
                                        detailsData: updatedDetailsData,
                                        updateBy: makebyUser,
                                        updateDate: new Date(),
                                      };
                                    });

                                    return temp_details;
                                  });
                                  setUpdatePreviousPaymentReceiveDataPaymentDetails(
                                    (prevData) => {
                                      const existingIndex = prevData.findIndex(
                                        (item) => item._id === detailItem._id
                                      );

                                      if (existingIndex > -1) {
                                        const temp_details = [...prevData];
                                        temp_details[existingIndex] = {
                                          ...detailItem,
                                          chequeDate:
                                            bankChequeDate.toLocaleDateString(
                                              "en-CA"
                                            ),
                                        };
                                        return temp_details;
                                      } else {
                                        return [
                                          ...prevData,
                                          {
                                            ...detailItem,
                                            chequeDate:
                                              bankChequeDate.toLocaleDateString(
                                                "en-CA"
                                              ),
                                          },
                                        ];
                                      }
                                    }
                                  );
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
                                disabled
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
                                onChange={(e) => {
                                  const amountValue = parseFloat(
                                    e.target.value
                                  );
                                  const unitPriceValue = parseFloat(
                                    detailItem.unitPrice
                                  );

                                  if (
                                    !isNaN(amountValue) &&
                                    !isNaN(unitPriceValue) &&
                                    unitPriceValue > 0
                                  ) {
                                    const calCulateTotalAmount =
                                      amountValue / unitPriceValue;

                                    setPaymentReceivePreviousData((prev) => {
                                      const temp_details = prev.map((item) => {
                                        const updatedDetailsData =
                                          item.detailsData.map((singleData) => {
                                            if (
                                              singleData._id === detailItem._id
                                            ) {
                                              return {
                                                ...singleData,
                                                amount: amountValue,
                                                quantity:
                                                  Math.round(
                                                    calCulateTotalAmount * 100
                                                  ) / 100,
                                              };
                                            }
                                            return singleData;
                                          });
                                        return {
                                          ...item,
                                          detailsData: updatedDetailsData,
                                          updateBy: makebyUser,
                                          updateDate: new Date(),
                                        };
                                      });

                                      return temp_details;
                                    });

                                    setUpdatePreviousPaymentReceiveDataPaymentDetails(
                                      (prevData) => {
                                        const existingIndex =
                                          prevData.findIndex(
                                            (item) =>
                                              item._id === detailItem._id
                                          );

                                        if (existingIndex > -1) {
                                          const temp_details = [...prevData];
                                          temp_details[existingIndex] = {
                                            ...detailItem,
                                            amount: amountValue,
                                            quantity:
                                              Math.round(
                                                calCulateTotalAmount * 100
                                              ) / 100,
                                          };
                                          return temp_details;
                                        } else {
                                          return [
                                            ...prevData,
                                            {
                                              ...detailItem,
                                              amount: amountValue,
                                              quantity:
                                                Math.round(
                                                  calCulateTotalAmount * 100
                                                ) / 100,
                                            },
                                          ];
                                        }
                                      }
                                    );
                                    setFieldValue(
                                      `detailsData.${index}.amount`,
                                      amountValue
                                    );
                                    setFieldValue(
                                      `detailsData.${index}.quantity`,
                                      calCulateTotalAmount
                                    );
                                  } else {
                                    console.log(
                                      "Invalid values for amount or unit price"
                                    );

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
                              >
                                <input
                                  type="checkbox"
                                  name=""
                                  id=""
                                  data-toggle="tooltip"
                                  title="Delete item"
                                  checked={
                                    isDeletePreviousPaymentData[indexXlaculate]
                                  }
                                  className={`${
                                    isDeletePreviousPaymentData[indexXlaculate]
                                      ? "d-none"
                                      : "d-block"
                                  }`}
                                  onChange={() => {
                                    handleCheckboxChange(indexXlaculate);
                                  }}
                                />
                                {isDeletePreviousPaymentData[
                                  indexXlaculate
                                ] && (
                                  <FontAwesomeIcon
                                    onClick={() => {
                                      swal({
                                        title: "Are you sure?",
                                        text: "Once deleted, you will not be able to recover this data!",
                                        icon: "warning",
                                        buttons: true,
                                        dangerMode: true,
                                      }).then((willDelete) => {
                                        if (willDelete) {
                                          if (payment?.detailsData.length > 1) {
                                            setPaymentReceivePreviousData(
                                              (prevData) =>
                                                prevData.map((item) =>
                                                  item._id === payment._id
                                                    ? {
                                                        ...item,
                                                        detailsData:
                                                          item.detailsData.filter(
                                                            (detail) =>
                                                              detail._id !==
                                                              detailItem._id
                                                          ),
                                                      }
                                                    : item
                                                )
                                            );
                                            setUpdatePreviousPaymentReceiveDataPaymentDetails(
                                              (prevData) => {
                                                const existingIndex =
                                                  prevData.findIndex(
                                                    (item) =>
                                                      item._id ===
                                                      detailItem._id
                                                  );

                                                if (existingIndex > -1) {
                                                  const updatedData = [
                                                    ...prevData,
                                                  ];
                                                  updatedData[existingIndex] = {
                                                    ...detailItem,
                                                    isRemoveStatus: true,
                                                    isParent: false,
                                                  };
                                                  return updatedData;
                                                } else {
                                                  return [
                                                    ...prevData,
                                                    {
                                                      ...detailItem,
                                                      isRemoveStatus: true,
                                                      isParent: false,
                                                    },
                                                  ];
                                                }
                                              }
                                            );
                                            setIsDeletePreviousPaymentData(
                                              false
                                            );
                                          } else {
                                            setPaymentReceivePreviousData(
                                              (prevData) =>
                                                prevData.filter(
                                                  (item) =>
                                                    item._id !== payment._id
                                                )
                                            );
                                            setUpdatePreviousPaymentReceiveDataPaymentDetails(
                                              (prevData) => {
                                                const existingIndex =
                                                  prevData.findIndex(
                                                    (item) =>
                                                      item._id ===
                                                      detailItem._id
                                                  );
                                                console.log(existingIndex);
                                                if (existingIndex > -1) {
                                                  const updatedData = [
                                                    ...prevData,
                                                  ];
                                                  updatedData[existingIndex] = {
                                                    ...detailItem,
                                                    isRemoveStatus: true,
                                                    isParent: true,
                                                    parentId: payment._id,
                                                  };
                                                  console.log(updatedData);
                                                  return updatedData;
                                                } else {
                                                  return [
                                                    ...prevData,
                                                    {
                                                      ...detailItem,
                                                      isRemoveStatus: true,
                                                      isParent: true,
                                                      parentId: payment._id,
                                                    },
                                                  ];
                                                }
                                              }
                                            );
                                            setIsDeletePreviousPaymentData(
                                              false
                                            );
                                            setshowPreviousPaymentDetailsButton(false)
                                          }
                                        } else {
                                          setIsDeletePreviousPaymentData(false);
                                          setshowPreviousPaymentDetailsButton(true)
                                          swal("Your data is safe!");
                                        }
                                      });
                                    }}
                                    icon={faXmarkCircle}
                                    className="text-danger fs-1"
                                  ></FontAwesomeIcon>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{ backgroundColor: "red", border: "none" }}
                variant="secondary"
                onClick={()=>{
                  handleClosePreviousPayment()
                  

                }}
              >
                Close
              </Button>
              <Button
                style={{
                  backgroundColor: "#2DDC1B",
                  border: "none",
                }}
                form="updatepaymentreceive-form"
                type="submit"
                variant="primary"
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

export default PreviousPaymentDetailsModal;
