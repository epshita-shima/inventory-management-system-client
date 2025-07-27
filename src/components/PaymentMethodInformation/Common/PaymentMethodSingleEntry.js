import {
  faArrowAltCircleLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Select from "react-select";
import swal from "sweetalert";
import {
  clientInfoDropdown,
  finishGoodsWithSizeItemDropdown,
  invoiceListDropdown,
} from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";
import { useGetAllInvoiceInformationQuery } from "../../../redux/features/invoiceinformation/invoiceinfoApi";
import InsertPaymentMethodInformation from "../Insert/InsertPaymentMethodInformation";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/finishgoodsinfoApi";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import {
  useGetAllPaymentReceiveInformationQuery,
  useGetSinglePaymentReceiveQuery,
  useInsertPaymentReceiveInformationMutation,
  useUpdatePaymentReceiveInfoMutation,
} from "../../../redux/features/paymentreceiveinfo/paymentreceiveApi";
import PreviousPaymentDetailsModal from "./PreviousPaymentDetails/PreviousPaymentDetailsModal";
import UpdatePaymentMethodInformation from "../Update/UpdatePaymentMethodInformation";
import getInitialFormValues from "../../Common/CommonDropdown/CommonFromValues/CommonFromValues";
import getMakebyUser from "../../Common/CommonMakeUser/CommonMakingUser";
import '../../../buttonStyle/style.css';

const PaymentMethodSingleEntry = () => {
  const { id } = useParams();
  const ArrayHelperRef = useRef();
  const navigate = useNavigate();
  const makebyUser = getMakebyUser();
  const { data: clientInfo,isLoading:isLoadingClientInfo } = useGetAllClientInformationQuery();
  const { data: invoiceInformation } =
    useGetAllInvoiceInformationQuery(undefined);
  const { data: finishGoods } = useGetAllItemInformationQuery(undefined);
  const [paymentReceiveDate] = useState(new Date());
  const [isDisplay, setIsDisplay] = useState(false);
  const [bankChequeDate, setBankChequeDate] = useState(new Date());
  const [invoiveByInvoiceNumber, setInvoiveByInvoiceNumber] = useState([]);
  const [previousPaymentData, setPreviousPaymentData] = useState([]);
  const [
    showPreviousPaymentDetailsButton,
    setshowPreviousPaymentDetailsButton,
  ] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);
  const clientDataOptions = clientInfoDropdown(clientInfo);
  const invoiceListOption = invoiceListDropdown(invoiceList);
  const [itemNameData, setItemNameData] = useState([]);
  const [itemSize, setItemSize] = useState([]);
  const [clientName, setClientName] = useState("");
  const [piNumber, setPINumber] = useState("");
  const { data: sizeInfo } = useGetAllItemSizeQuery(undefined);
  const { data: paymnetReceiveData, refetch } =
    useGetAllPaymentReceiveInformationQuery(undefined);
  const [insertPaymentReceive] = useInsertPaymentReceiveInformationMutation();
  const [updatePaymentReceivedInfo] = useUpdatePaymentReceiveInfoMutation();
  const [show, setShow] = useState(false);
  const { data: getSinglePaymentReceiveInfo } =
    useGetSinglePaymentReceiveQuery(id);
  const [updatePaymentReceiveInformation, setUpdatePaymentReceiveInformation] =
    useState([]);

  const handleCloseModal = () => setShow(false);
  const [formValues, setFormValues] = useState((getInitialFormValues(clientName,piNumber,makebyUser,paymentReceiveDate)));

  const paymentMethodOptions = [
    {value: "cash", label: "Cash"},
    { value: "bank-cash", label: "Bank-Cash" },
    { value: "bank-cheque", label: "Bank-Cheque" },
  ];

  const paymentStatusOptions = [
    { value: "cash", label: "Cash" },
    { value: "advance", label: "Advance" },
    { value: "adjustment", label: "Adjustment" },
  ];

  const areFieldsEmpty = () => {
    return formValues?.detailsData?.some((field) => {
      const isCommonFieldEmpty = !field.paymentMethod || !field.paymentStatus || !field.itemId || !field.amount;

      const isBankCashFieldEmpty = field.paymentMethod === 'bank-cash' && (!field.bankId || !field.depositeSlipNo);
  
      const isBankChequeFieldEmpty = field.paymentMethod === 'bank-cheque' && (!field.bankId || !field.chequeNo || !field.chequeDate || !field.depositeSlipNo);
  
      return isCommonFieldEmpty || isBankCashFieldEmpty || isBankChequeFieldEmpty;
    });
  };

  useEffect(() => {
      if (clientName !== "" && piNumber !== "") {
        setIsDisplay(true);
      } else {
        setIsDisplay(false);
      }
    
  }, [piNumber, clientName]);

  useEffect(() => {
    if (invoiveByInvoiceNumber?.detailsData?.length > 0) {
      const accumulatedItemNameData = [];
      const accumulatedItemSizeData = [];
      invoiveByInvoiceNumber.detailsData.forEach((detail) => {
        const matchedItem = finishGoods?.filter(
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
    }
  }, [invoiveByInvoiceNumber, paymentReceiveDate, finishGoods, sizeInfo]);

  useEffect(() => {
    if (id) {
      const matchedInvoice = invoiceInformation?.filter(
        (invoice) =>
          invoice.customerID === getSinglePaymentReceiveInfo?.clientId
      );
      setInvoiceList(matchedInvoice);
      const invoiceListMatchingData = matchedInvoice?.find(
        (data) => data.invoiceNo === getSinglePaymentReceiveInfo?.piNumber
      );
      setInvoiveByInvoiceNumber(invoiceListMatchingData);
    }
    setUpdatePaymentReceiveInformation(getSinglePaymentReceiveInfo);
  }, [getSinglePaymentReceiveInfo, id, invoiceInformation]);

  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();
    if (id) {
      try {
        const response = await updatePaymentReceivedInfo(
          updatePaymentReceiveInformation
        );
        if (response?.data?.status === 200) {
          swal("Done", "Data Update Successfully", "success");
        } else if (response?.error?.status === 400) {
          swal("Not Possible!", response?.error?.data?.message, "error");
        }
      } catch (err) {
        swal("Error", "An error occurred while creating the data", "error");
      }
    } else {
      const modelData = {
        clientId: clientName,
        piNumber: piNumber,
        makeBy: makebyUser,
        updateBy: null,
        makeDate: new Date(),
        updateDate: null,
        detailsData: [],
      };
      values.detailsData.forEach((item) => {
        modelData.detailsData.push({
          paymentReceiveDate: item.paymentReceiveDate
            ? item.paymentReceiveDate
            : paymentReceiveDate,
          paymentMethod: item.paymentMethod,
          paymentStatus: item.paymentStatus,
          itemId: item.itemId,
          piDetailsId:item.piDetailsId,
          amount: item.amount,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          bankId: item.bankId,
          chequeNo: item.chequeNo ? item.chequeNo : "N/A",
          chequeDate: item.chequeDate ? item.chequeDate : "N/A",
          depositeSlipNo: item.depositeSlipNo,
          remarks: item.remarks,
        });
      });
      const filterPiData = invoiceInformation?.find(
        (item) => item._id === modelData.piNumber
      );
      const totalPiAmount = filterPiData?.detailsData.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      const adjustQuantityItems = modelData.detailsData.filter(
        (item) => item.paymentStatus === "adjustment"
      );

      const totalAdjustmentAmount = adjustQuantityItems.reduce(
        (acc, item) => acc + item.amount,
        0
      );

      const previousAdjustPayment = previousPaymentData
        .map((items) => {
          const filterAdjustPayment = items.detailsData.filter(
            (item) => item.paymentStatus === "adjustment"
          );
          const calculateAdjustAmount = filterAdjustPayment.reduce(
            (acc, item) => acc + item.amount,
            0
          );
          return calculateAdjustAmount;
        })
        .reduce((acc, amount) => acc + amount, 0);
      const totalPreviousAdjustPayment =
        previousAdjustPayment + totalAdjustmentAmount;

      try {
        if (totalPreviousAdjustPayment < totalPiAmount) {
          const response = await insertPaymentReceive(modelData);
          if (response?.data?.status === 200) {
            swal("Done", "Data Save Successfully", "success");
            // navigate("/main-view/payment-received-list");
            setFormValues((prev) => ({
              ...prev, // Spread the previous state to keep existing values
              clientId: "",
              piNumber: "",
              makeBy: "",
              updateBy: null,
              makeDate: "",
              updateDate: null,
              detailsData: [
                {
                  paymentReceiveDate: "",
                  paymentMethod: "",
                  paymentStatus: "",
                  itemId: "",
                  piDetailsId:"",
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
            }));
            setClientName("");
            setPINumber("");
            setshowPreviousPaymentDetailsButton(false);
          } else if (response?.error?.status === 400) {
            swal("Not Possible!", response?.error?.data?.message, "error");
          }
        } else {
          swal(
            "Not Possible!",
            "Adjust amount is more than Paid amount",
            "warning"
          );
        }
      } catch (err) {
        console.error(err);
        swal("Error", "An error occurred while creating the data", "error");
      }
    }
  };

  const itemNameOptions = finishGoodsWithSizeItemDropdown(
    itemNameData,
    sizeInfo
  );

  return (
    <div
      className= {`row mx-4 `}
      style={{ height: "calc(98vh - 120px)", overflowY: "hidden" }}
    >
      {/* <LoadingSpineer isLoading={isLoadingClientInfo}></LoadingSpineer> */}
      <div className={`overflow-hidden ${isLoadingClientInfo ? 'd-none' : 'd-block'}`}>
        <div className="shadow-lg  rounded-4">
          <Formik
            initialValues={formValues}
            enableReinitialize={true}
            validationSchema={Yup.object({
              challanNo: Yup.string().required("Required"),
              detailsData: Yup.array().of(
                Yup.object().shape({
                  paymentMethod: Yup.string().required("Required"),
                  paymentStatus: Yup.string().required("Required"),
                  quantity: Yup.string().required("Required"),
                  unitPrice: Yup.string().required("Required"),
                })
              ),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              resetForm({ values: formValues });
              setSubmitting(false);
            }}
          >
            {({
              values,
              resetForm,
              setFieldValue,
              isSubmitting,
              errors,
              touched,
              isValid,
              dirty,
            }) => (
              <Form
                id="insertpaymentreceive-form"
                onSubmit={(e) => {
                  handleSubmit(e, values, resetForm);
                }}
              >
                <FieldArray
                  name="detailsData"
                  render={(arrayHelpers) => {
                    ArrayHelperRef.current = arrayHelpers;
                    const details = values?.detailsData;

                    const totalAmount = id
                      ? updatePaymentReceiveInformation?.detailsData?.reduce(
                          (sum, item) => sum + item.amount,
                          0
                        )
                      : values?.detailsData?.reduce(
                          (sum, item) => sum + item.amount,
                          0
                        );
                    const totalQuantity = id
                      ? updatePaymentReceiveInformation?.detailsData?.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )
                      : values?.detailsData?.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        );

                    return (
                      <div className=" flex-1 items-center d-flex-nowrap mt-3 py-2 px-5">
                        <div>
                          <div className="d-flex justify-content-between align-items-center">
                            <h2
                              className="fs-sm fw-bold"
                              style={{ fontSize: "24px", fontWeight: "bold" }}
                            >
                              Insert Payment Method Information
                            </h2>
                            <div>
                              <button
                               className="customBackToListButton"
                                onClick={() => {
                                  navigate("/main-view/payment-received-list");
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faArrowAltCircleLeft}
                                ></FontAwesomeIcon>
                                Back to ItemList
                              </button>
                            </div>
                          </div>

                          <div className="row row-cols-1  row-cols-md-2 row-cols-lg-4">
                            <div className="col col-md-6 col-lg-3">
                              <label
                                htmlFor="supplierId"
                                className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
                              >
                                Client Name
                              </label>
                              <div className="w-100 d-flex justify-content-between mt-2">
                                <div className="w-100">
                                  <Select
                                    class="form-select"
                                    className="w-100 mb-3"
                                    aria-label="Default select example"
                                    name="sizeinfo"
                                    options={clientDataOptions}
                                    isDisabled={id ? true : false}
                                    defaultValue={{
                                      label: "Select Client Name",
                                      value: 0,
                                    }}
                                    value={
                                      id
                                        ? clientDataOptions?.filter(function (
                                            option
                                          ) {
                                            return (
                                              option.value ===
                                              updatePaymentReceiveInformation?.clientId
                                            );
                                          })
                                        : clientDataOptions?.filter(function (
                                            option
                                          ) {
                                            return option.value === clientName;
                                          })
                                    }
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
                                      }),
                                    }}
                                    theme={(theme) => ({
                                      ...theme,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#B8FEB3",
                                        primary: "#2DDC1B",
                                      },
                                    })}
                                    onChange={(e) => {
                                        const matchedInvoice =
                                          invoiceInformation?.filter(
                                            (invoice) =>
                                              invoice.customerID === e.value &&
                                              invoice.isApproved === true && invoice.paymentId === "667d2b983e37e91c4e1f3a1f"
                                          );
                                        if (matchedInvoice?.length > 0) {
                                          setInvoiceList(matchedInvoice);
                                        } else {
                                          setIsDisplay(false);
                                          swal({
                                            title: "Sorry!",
                                            text: "This Client has no PI.",
                                            icon: "warning",
                                            button: "OK",
                                          });
                                          setPINumber("");
                                          setInvoiceList([]);
                                        }
                                        setClientName(e.value);
                                        setFieldValue("clientId", e.value);
                                        setFormValues((prevData) => ({
                                          ...prevData,
                                          clientId: e.value,
                                          detailsData:
                                            prevData?.detailsData?.map(
                                              (item, idx) => {
                                                return item;
                                              }
                                            ),
                                        }));
                                      

                                      // handleSelectSupplier(e, setFieldValue);
                                    }}
                                  ></Select>
                                </div>
                              </div>
                            </div>
                            <div className="col col-md-6 col-lg-3">
                              <label
                                htmlFor="supplierId"
                                className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
                              >
                                PI Number
                              </label>

                              <div className="w-100 d-flex justify-content-between mt-2">
                                <div className="w-100">
                                  <Select
                                    class="form-select"
                                    className="w-100 mb-3"
                                    aria-label="Default select example"
                                    name="supplierpono"
                                    options={invoiceListOption}
                                    isDisabled={id ? true : false}
                                    defaultValue={{
                                      label: "Select PI Number",
                                      value: 0,
                                    }}
                                    value={
                                      id
                                        ? invoiceListOption?.filter(function (
                                            option
                                          ) {
                                            return (
                                              option?.value ===
                                              updatePaymentReceiveInformation?.piNumber
                                            );
                                          })
                                        : invoiceListOption?.filter(function (
                                            option
                                          ) {
                                            return option?.value === piNumber;
                                          })
                                    }
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
                                      }),
                                    }}
                                    theme={(theme) => ({
                                      ...theme,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#B8FEB3",
                                        primary: "#2DDC1B",
                                      },
                                    })}
                                    onChange={(e) => {
                                      if (id) {
                                        setPINumber(e.value);
                                        setFieldValue("piNumber", e.value);
                                        const filterPaymentData =
                                          paymnetReceiveData?.find(
                                            (data) => data.piNumber === e.value
                                          );
                                        if (filterPaymentData !== undefined) {
                                          setPreviousPaymentData(
                                            filterPaymentData
                                          );
                                          setshowPreviousPaymentDetailsButton(
                                            true
                                          );
                                        } else {
                                          setPreviousPaymentData([]);
                                          setshowPreviousPaymentDetailsButton(
                                            false
                                          );
                                        }
                                        const invoiceListMatchingData =
                                          invoiceList.find(
                                            (data) => data._id === e.value
                                          );
                                        setInvoiveByInvoiceNumber(
                                          invoiceListMatchingData
                                        );
                                        setUpdatePaymentReceiveInformation(
                                          (prevData) => {
                                            return {
                                              ...prevData,
                                              piNumber: e.value,
                                            };
                                          }
                                        );
                                      } else {
                                        setPINumber(e.value);
                                        setFieldValue("piNumber", e.value);
                                        const filterPaymentData =
                                          paymnetReceiveData?.filter(
                                            (data) =>
                                              data.piNumber === e.value &&
                                              data.clientId === clientName
                                          );
                                        if (filterPaymentData !== undefined) {
                                          setPreviousPaymentData(
                                            filterPaymentData
                                          );
                                         
                                          setshowPreviousPaymentDetailsButton(
                                            true
                                          );
                                        } else {
                                          setPreviousPaymentData([]);
                                         
                                          setshowPreviousPaymentDetailsButton(
                                            false
                                          );
                                        }
                                        const invoiceListMatchingData =
                                          invoiceList.find(
                                            (data) => data._id === e.value
                                          );
                                        setInvoiveByInvoiceNumber(
                                          invoiceListMatchingData
                                        );
                                        setFormValues((prevData) => {
                                          return {
                                            ...prevData,
                                            piNumber: e.value,
                                          };
                                        });
                                      }
                                    }}
                                  ></Select>
                                </div>
                              </div>
                            </div>
                            {showPreviousPaymentDetailsButton &&
                            previousPaymentData.length > 0 ? (
                              <div className="col col-md-6 col-lg-2 mt-2">
                                <button
                                  type="button"
                                  className="border-0 "
                                  style={{
                                    backgroundColor: "#2DDC1B",
                                    color: "white",
                                    padding: "5px 10px",
                                    fontSize: "14px",
                                    borderRadius: "5px",
                                    width: "100%",
                                    height: "38px",
                                    marginTop: "25px",
                                  }}
                                  onClick={() => setShow(true)}
                                >
                                  Previous Payment Details
                                </button>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        {isDisplay && (
                          <>
                            <div>
                              <h2
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                }}
                              >
                                Details Information
                              </h2>
                              <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex justify-content-between">
                                  <button
                                    type="submit"
                                    form="insertpaymentreceive-form"
                                    className="border-0"
                                    style={{
                                      backgroundColor: id
                                        ? "#2DDC1B"
                                        : areFieldsEmpty()
                                        ? "gray"
                                        : "#2DDC1B",
                                      color: "white",
                                      padding: "5px 10px",
                                      fontSize: "14px",
                                      borderRadius: "5px",
                                      width: "100px",
                                    }}
                                    disabled={
                                      id
                                        ? false
                                        : areFieldsEmpty()
                                        ? true
                                        : false
                                    }
                                  >
                                    {id ? "Update" : "Save"}
                                  </button>
                                  <div
                                    className="border-0 "
                                    style={{
                                      backgroundColor: "#B8FEB3",
                                      color: "#000",
                                      padding: "5px 10px",
                                      fontSize: "14px",
                                      borderRadius: "5px",
                                      marginLeft: "5px",
                                    }}
                                    onClick={() => {
                                      ArrayHelperRef.current.push({
                                        paymentReceiveDate: paymentReceiveDate,
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
                                      });
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faPlus}
                                    ></FontAwesomeIcon>{" "}
                                    Add Row
                                  </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <label
                                      htmlFor="grandTotalQuantity"
                                      style={{ fontSize: "16px" }}
                                    >
                                      Total Quantity
                                    </label>
                                    <Field
                                      type="text"
                                      name={`totalQuantity`}
                                      placeholder="Total Quantity"
                                      disabled
                                      value={
                                        Math.round(totalQuantity * 100) / 100
                                      }
                                      style={{
                                        border: "1px solid #2DDC1B",
                                        padding: "5px",
                                        width: "50%",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        marginLeft: "10px",
                                        height: "38px",
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="grandTotalAmount"
                                      style={{ fontSize: "16px" }}
                                    >
                                      Total Amount
                                    </label>
                                    <Field
                                      type="text"
                                      name={`grandTotalAmount`}
                                      placeholder="Total Amount"
                                      disabled
                                      value={
                                        Math.round(totalAmount * 100) / 100
                                      }
                                      style={{
                                        border: "1px solid #2DDC1B",
                                        padding: "5px",
                                        width: "50%",
                                        borderRadius: "5px",
                                        marginLeft: "10px",
                                        textAlign: "center",
                                        height: "38px",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {id ? (
                              <UpdatePaymentMethodInformation
                                id={id}
                                updatePaymentReceiveInformation={
                                  updatePaymentReceiveInformation
                                }
                                setUpdatePaymentReceiveInformation={
                                  setUpdatePaymentReceiveInformation
                                }
                                paymentMethodOptions={paymentMethodOptions}
                                paymentStatusOptions={paymentStatusOptions}
                                itemNameOptions={itemNameOptions}
                                makebyUser={makebyUser}
                                invoiveByInvoiceNumber={invoiveByInvoiceNumber}
                                bankChequeDate={bankChequeDate}
                                setBankChequeDate={setBankChequeDate}
                              ></UpdatePaymentMethodInformation>
                            ) : (
                              <InsertPaymentMethodInformation
                                details={details}
                                setFieldValue={setFieldValue}
                                touched={touched}
                                errors={errors}
                                arrayHelpers={arrayHelpers}
                                paymentMethodOptions={paymentMethodOptions}
                                paymentStatusOptions={paymentStatusOptions}
                                bankChequeDate={bankChequeDate}
                                setBankChequeDate={setBankChequeDate}
                                itemNameData={itemNameData}
                                itemSize={itemSize}
                                setFormValues={setFormValues}
                                itemNameOptions={itemNameOptions}
                                invoiceInformation={invoiceInformation}
                                invoiveByInvoiceNumber={invoiveByInvoiceNumber}
                              ></InsertPaymentMethodInformation>
                            )}
                          </>
                        )}
                      </div>
                    );
                  }}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {previousPaymentData && (
        <PreviousPaymentDetailsModal
          invoiceInformation={invoiceInformation}
          paymentStatusOptions={paymentStatusOptions}
          setshowPreviousPaymentDetailsButton={setshowPreviousPaymentDetailsButton}
          makebyUser={makebyUser}
          detail={previousPaymentData}
          setPreviousPaymentData={setPreviousPaymentData}
          finishGoods={finishGoods}
          sizeInfo={sizeInfo}
          show={show} 
          handleClosePreviousPayment={() => handleCloseModal()} 
          bankChequeDate={bankChequeDate}
          setBankChequeDate={setBankChequeDate}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default PaymentMethodSingleEntry;
