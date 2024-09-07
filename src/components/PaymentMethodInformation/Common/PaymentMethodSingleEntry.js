import {
  faArrowAltCircleLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Select from "react-select";
import swal from "sweetalert";
import {
  clientInfoDropdown,
  invoiceListDropdown,
} from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";
import { useGetAllInvoiceInformationQuery } from "../../../redux/features/invoiceinformation/invoiceinfoApi";
import InsertPaymentMethodInformation from "../Insert/InsertPaymentMethodInformation";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useInsertPaymentReceiveInformationMutation } from "../../../redux/features/paymentreceiveinfo/paymentreceiveApi";

const PaymentMethodSingleEntry = () => {
  const ArrayHelperRef = useRef();
  const navigate = useNavigate();
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const makebyUser = getUserParse[0].username;
  const { data: clientInfo } = useGetAllClientInformationQuery();
  const { data: invoiceInformation } =
    useGetAllInvoiceInformationQuery(undefined);
  const { data: finishGoods } = useGetAllItemInformationQuery(undefined);
  const [paymentReceiveDate, setPaymentReceiveDate] = useState(new Date());
  const [isDisplay, setIsDisplay] = useState(false);
  const [bankChequeDate, setBankChequeDate] = useState(new Date());
  const [invoiveByInvoiceNumber, setInvoiveByInvoiceNumber] = useState([]);
  const [invoiceList, setInvoiceList] = useState([]);
  const clientDataOptions = clientInfoDropdown(clientInfo);
  const invoiceListOption = invoiceListDropdown(invoiceList);
  const [itemNameData, setItemNameData] = useState([]);
  const [itemSize, setItemSize] = useState([]);
  const [clientName, setClientName] = useState("");
  const [piNumber, setPINumber] = useState("");
  const { data: sizeInfo } = useGetAllItemSizeQuery(undefined);
  const [insertPaymentReceive] = useInsertPaymentReceiveInformationMutation();
  const [formValues, setFormValues] = useState({
    clientId: clientName,
    piNumber: piNumber,
    makeBy: makebyUser,
    updateBy: null,
    makeDate: new Date(),
    updateDate: null,
    detailsData: [
      {
        paymentReceiveDate: "",
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
  const paymentMethodOptions = [
    { value: "cash", label: "Cash" },
    { value: "bank-cash", label: "Bank-Cash" },
    { value: "bank-cheque", label: "Bank-Cheque" },
  ];
  const paymentStatusOptions = [
    { value: "cash", label: "Cash" },
    { value: "adjustment", label: "Adjustment" },
  ];
  const areFieldsEmpty = () => {
    return formValues?.detailsData?.some(
      (field) => !field.paymentMethod || !field.paymentStatus || !field.bankId || !field.depositeSlipNo
    );
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
      setFormValues((prevValues) => ({
        ...prevValues,
        detailsData: invoiveByInvoiceNumber.detailsData.map((detail) => {
          return {
            paymentReceiveDate: paymentReceiveDate || "",
            paymentMethod: "",
            paymentStatus: "",
            itemId: detail.itemId || "",
            amount: detail.totalAmount,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            bankId: "",
            chequeNo: "",
            chequeDate: "",
            depositeSlipNo: "",
            remarks: "",
          };
        }),
      }));
    }
  }, [invoiveByInvoiceNumber, paymentReceiveDate, finishGoods, sizeInfo]);

  console.log((formValues));
  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();
    const modelData = {
      clientId: clientName,
      piNumber: piNumber,
      makeBy: makebyUser,
      updateBy: null,
      makeDate: new Date(),
      updateDate: null,
      detailsData: [],
    };
    values.detailsData.map((item) => {
      modelData.detailsData.push({
        paymentReceiveDate: item.paymentReceiveDate,
        paymentMethod: item.paymentMethod,
        paymentStatus: item.paymentStatus,
        itemId: item.itemId,
        amount: item.amount,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        bankId: item.bankId,
        chequeNo: item.chequeNo,
        chequeDate: item.chequeDate,
        depositeSlipNo: item.depositeSlipNo,
        remarks: item.remarks,
      });
    });
    try {
      const response = await insertPaymentReceive(modelData);
      console.log(JSON.stringify(modelData));
      if (response?.data?.status === 200) {
        swal("Done", "Data Save Successfully", "success");
        resetForm();
      } else if (response?.error?.status === 400) {
        swal("Not Possible!", response?.error?.data?.message, "error");
      }
    } catch (err) {
      console.error(err);
      swal("Error", "An error occurred while creating the data", "error");
    }
  };

  return (
    <div
      className=" row mx-4"
      style={{ height: "calc(98vh - 120px)", overflowY: "hidden" }}
    >
      <div class="overflow-hidden">
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
                id="poupdate-form"
                onSubmit={(e) => {
                  handleSubmit(e, values, resetForm);
                }}
              >
                <FieldArray
                  name="detailsData"
                  render={(arrayHelpers) => {
                    ArrayHelperRef.current = arrayHelpers;
                    const details = values?.detailsData;
                    const totalAmount = values?.detailsData?.reduce(
                      (sum, item) => sum + item.amount,
                      0
                    );
                    const totalQuantity = values?.detailsData?.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );
                    console.log(values);
                    return (
                      <div className=" flex-1 items-center d-flex-nowrap mt-3 py-2 px-5">
                        <div>
                          <div className="d-flex justify-content-between align-items-center">
                            <h2
                              className="fs-sm fw-bold"
                              style={{ fontSize: "24px", fontWeight: "bold" }}
                            >
                              Payment Method Information
                            </h2>
                            <div>
                              <button
                                style={{
                                  backgroundColor: "#E55566",
                                  outline: "none",
                                  border: "none",
                                  color: "white",
                                  height: "25px",
                                }}
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

                          <div class="row row-cols-1  row-cols-md-2 row-cols-lg-4">
                            <div class="col col-md-6 col-lg-3">
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
                                    defaultValue={{
                                      label: "Select Client Name",
                                      value: 0,
                                    }}
                                    value={clientDataOptions?.filter(function (
                                      option
                                    ) {
                                      return option.value === clientName;
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
                                            invoice.customerID == e.value
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
                                        setPINumber('')
                                        setInvoiceList([]);
                                      }
                                      setClientName(e.value);
                                      setFieldValue("clientId", e.value);
                                      setFormValues((prevData) => ({
                                        ...prevData,
                                        clientId:e.value,
                                        detailsData: prevData?.detailsData?.map((item, idx) => {
                                          
                                          return item;
                                        }),
                                      }))
                                      // handleSelectSupplier(e, setFieldValue);
                                    }}
                                  ></Select>
                                </div>
                              </div>
                            </div>
                            <div class="col col-md-6 col-lg-3">
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
                                    defaultValue={{
                                      label: "Select PI Number",
                                      value: 0,
                                    }}
                                    value={invoiceListOption?.filter(function (
                                      option
                                    ) {
                                      return option?.value === piNumber;
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
                                      setPINumber(e.value);
                                      setFieldValue("piNumber", e.value);
                                      const invoiceListMatchingData =
                                        invoiceList.find(
                                          (data) => data._id == e.value
                                        );
                                      setInvoiveByInvoiceNumber(
                                        invoiceListMatchingData
                                      );
                                      setFormValues((prevData) => {
                                        console.log(prevData)
                                        return{
                                        ...prevData,
                                        piNumber:e.value
                                      }})
                                    }}
                                  ></Select>
                                </div>
                              </div>
                            </div>
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
                                    form="poupdate-form"
                                    className="border-0"
                                    style={{
                                      backgroundColor: areFieldsEmpty()
                                      ? "gray"
                                      : "#2DDC1B",
                                      color: "white",
                                      padding: "5px 10px",
                                      fontSize: "14px",
                                      borderRadius: "5px",
                                      width: "100px",
                                    }}
                                    disabled={ areFieldsEmpty()
                                      ? true
                                      : false}
                                  >
                                    Save
                                  </button>
                                  <div
                                    className="border-0 "
                                    style={{
                                      // backgroundColor: "#2DDC1B",
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
                                        amount: "",
                                        quantity: "",
                                        bankName: "",
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
                                      value={totalQuantity}
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
                                      value={totalAmount}
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

                            {
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
                              ></InsertPaymentMethodInformation>
                            }
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
    </div>
  );
};

export default PaymentMethodSingleEntry;
