import React, { useEffect, useRef, useState } from "react";
import { useGetAllSupplierInformationQuery } from "../../../../redux/features/supplierInformation/supplierInfoApi";
import { useGetAllRMItemInformationQuery } from "../../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetAllPaymentInformationQuery } from "../../../../redux/features/paymnetinformation/paymentInfoApi";
import { useGetAllBankInformationQuery } from "../../../../redux/features/bankinformation/bankInfoAPi";
import {
  useCreateSerialNoMutation,
  useGetSerialNoQuery,
} from "../../../../redux/api/apiSlice";
import {
  useGetSinglePurchaseOrderInformationQuery,
  useInsertPurchaseOrderInformationMutation,
  useUpdatePurchaseOrderInformationMutation,
} from "../../../../redux/features/purchaseorderinformation/purchaseOrderInfoApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  bankInformationDropdown,
  paymentInfoDropdown,
  rawMaterialItemDropdown,
  supplierDropdown,
} from "../../../Common/CommonDropdown/CommonDropdown";
import swal from "sweetalert";
import { Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import SupplierInsertModal from "../../../Common/CommonModal/SupplierInsertModal";
import InsertPurchaseOrder from "../Insert/InsertPurchaseOrder";
import PurchaseOrderSingleInfo from "./PurchaseOrderSingleInfo";
import "../Insert/InsertPurchaseOrder.css";
import UpdatePurchaseOrderInfo from "../Update/UpdatePurchaseOrderInfo";
import { useGetAllGRNInformationQuery } from "../../../../redux/features/goodsreceivenoteinfo/grninfoApi";

const CommonPurchaseOrderInfo = () => {
  const { id } = useParams();
  console.log(id);
  const ArrayHelperRef = useRef();
  const navigate = useNavigate();
  const [activeSupplierModal, setActiveSupplierModal] = useState(false);
  const [activeItemInfoModal, setActiveItemInfoModal] = useState(false);
  const [acivePaymentModal, setAcivePaymentModal] = useState(false);
  const [aciveBankInfoModal, setAciveBankInfoModal] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [purchaseOrderAllInformation, setPurchaseOrderAllInformation] =
    useState([]);
  const { data: supplierInfo, isLoading } =
    useGetAllSupplierInformationQuery(undefined);
  const { data: itemInfo } = useGetAllRMItemInformationQuery(undefined);
  const { data: paymentTypeInfo } = useGetAllPaymentInformationQuery(undefined);
  const { data: bankInfo } = useGetAllBankInformationQuery(undefined);
  const { data: purchaseOderInfo, isPurchaseLoading } =
    useGetSinglePurchaseOrderInformationQuery(id);
  const [totalGrandQuantity, setTotalGrandQuantity] = useState(0);
  const [totalGrandTotalAmount, setTotalGrandTotalAmount] = useState(0);
  const [serialValue, setSerialValue] = useState([]);
  const { data: serialNo } = useGetSerialNoQuery(undefined);

  const [createSerialNo] = useCreateSerialNoMutation();
  const [insertPurchaseOrderInfo] = useInsertPurchaseOrderInformationMutation();
  const [updatePurchaseOrderInfo] = useUpdatePurchaseOrderInformationMutation();
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const makebyUser = getUserParse[0].username;

  const supplierOptions = supplierDropdown(supplierInfo);
  const rawMaterialItemOptions = rawMaterialItemDropdown(itemInfo);
  const paymentTypeOptions = paymentInfoDropdown(paymentTypeInfo);
  const bankInfoOptions = bankInformationDropdown(bankInfo);

  const initialValues = {
    poNo: "",
    supplierId: "",
    currencyId: "",
    paymentId: "",
    bankId: "",
    deliveryDate: new Date().toLocaleDateString("en-CA"),
    grandTotalAmount: totalGrandTotalAmount,
    grandTotalQuantity: totalGrandQuantity,
    approveStatus: false,
    approveBy: "n/a",
    approveDate: "n/a",
    makeBy: makebyUser,
    updateBy: null,
    makeDate: new Date(),
    updateDate: null,
    detailsData: [
      {
        itemId: "",
        itemDescription: "",
        quantity: "",
        unitPrice: "",
        totalAmount: "",
      },
    ],
  };

  const currencyOptions = [
    {
      value: "BDT",
      label: "BDT",
    },
    {
      value: "USD",
      label: "USD",
    },
  ];

  useEffect(() => {
    if (serialNo && serialNo.length > 0) {
      const maxSerialNoObject = serialNo.reduce((max, current) => {
        if (current.type === "po") {
          // If max is undefined or current serialNo is greater, return current
          return max && current.serialNo > max.serialNo
            ? current
            : max || current;
        }
        return max;
      }, undefined);
      if (maxSerialNoObject) {
        setSerialValue(maxSerialNoObject);
      }
    }

    if (id) {
      setPurchaseOrderAllInformation(purchaseOderInfo);
    }
  }, [id, serialNo, purchaseOderInfo]);

  if (isPurchaseLoading) {
    return <p>loading</p>;
  }
  const areFieldsEmpty = () => {
    return purchaseOrderAllInformation?.detailsData?.some(
      (field) =>
        !field.itemId ||
        !field.itemDescription ||
        !field.quantity ||
        !field.unitPrice ||
        !field.totalAmount
    );
  };

  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();
    const serialData = {
      serialNo: serialNo?.serialNo,
      type: "po",
      year: new Date().toLocaleDateString("en-CA"),
      makeby: makebyUser,
      updateby: "",
    };
    try {
      if (id) {
        const response = await updatePurchaseOrderInfo(
          purchaseOrderAllInformation
        );
        console.log(response);
        if (response?.data?.status === 200) {
          navigate("/main-view/po-list");
          swal("Done", "Data Save Successfully", "success");
          resetForm();
        } else if (response?.error?.status === 400) {
          swal("Not Possible!", response?.error?.data?.message, "error");
        }
      } else {
        const response = await insertPurchaseOrderInfo(values);
        if (response?.data?.status === 200) {
          await createSerialNo(serialData);
          swal("Done", "Data Save Successfully", "success");
          resetForm();
        } else if (response?.error?.status === 400) {
          swal("Not Possible!", response?.error?.data?.message, "error");
        }
      }
    } catch (err) {
      console.error(err);
      swal("Error", "An error occurred while creating the data", "error");
    }
  };

  return (
    <div
      className=" row px-4 mx-4"
      style={{
        overflow: "hidden",
        height: "calc(98vh - 120px)",
        zIndex: "9999",
      }}
    >
      <div class="">
        <div className="px-4 rounded-4">
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              detailsData: Yup.array().of(
                Yup.object().shape({
                  itemId: Yup.string().required("Required"),
                  itemDescription: Yup.string().required("Required"),
                  quantity: Yup.string().required("Required"),
                  unitPrice: Yup.string().required("Required"),
                  totalAmount: Yup.string().required("Required"),
                })
              ),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              resetForm({ values: initialValues });
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
                id="pocreation-form"
                onSubmit={(e) => {
                  handleSubmit(e, values, resetForm);
                }}
              >
                <FieldArray
                  name="detailsData"
                  render={(arrayHelpers) => {
                    ArrayHelperRef.current = arrayHelpers;
                    const details = values.detailsData;
                    return (
                      <div
                        className=" shadow-lg py-2 px-5"
                        // style={{
                        //   overflowY: "hidden",
                        //   height: "calc(95vh - 120px)",
                        //   zIndex: "9999",
                        // }}
                      >
                        <div class="container-fluid">
                          <div class="row justify-content-center">
                            <div class="col-12 col-md-12 col-lg-12 fixed-column py-2">
                            <div className="d-flex justify-content-between align-items-center">
                          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
                            Purchase Order Form
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
                                navigate("/main-view/po-list");
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faArrowAltCircleLeft}
                              ></FontAwesomeIcon>
                              Back to ItemList
                            </button>
                          </div>
                        </div>

                        <PurchaseOrderSingleInfo
                          id={id}
                          supplierOptions={supplierOptions}
                          values={values}
                          setFieldValue={setFieldValue}
                          serialValue={serialValue}
                          touched={touched}
                          errors={errors}
                          setActiveSupplierModal={setActiveSupplierModal}
                          setAcivePaymentModal={setAcivePaymentModal}
                          setActiveItemInfoModal={setActiveItemInfoModal}
                          setAciveBankInfoModal={setAciveBankInfoModal}
                          paymentTypeOptions={paymentTypeOptions}
                          bankInfoOptions={bankInfoOptions}
                          startDate={startDate}
                          setStartDate={setStartDate}
                          currencyOptions={currencyOptions}
                          purchaseOrderAllInformation={
                            purchaseOrderAllInformation
                          }
                          setPurchaseOrderAllInformation={
                            setPurchaseOrderAllInformation
                          }
                          makebyUser={makebyUser}
                        ></PurchaseOrderSingleInfo>

                        <div>
                          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                            Details Information
                          </h2>
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="d-flex justify-content-between">
                              <button
                                type="submit"
                                form="pocreation-form"
                                className="border-0 "
                                style={{
                                  backgroundColor: id
                                    ? areFieldsEmpty()
                                      ? "gray"
                                      : "#2DDC1B"
                                    : isValid && dirty
                                    ? "#2DDC1B"
                                    : "gray",
                                  color: "white",
                                  padding: "5px 10px",
                                  fontSize: "14px",
                                  borderRadius: "5px",
                                  width: "100px",
                                }}
                                disabled={
                                  id
                                    ? areFieldsEmpty()
                                      ? true
                                      : false
                                    : !(isValid && dirty)
                                }
                              >
                                {id ? "Update" : "Save"}
                              </button>
                              <div
                                className="border-0 "
                                style={{
                                  // backgroundColor: "#00B987",
                                  backgroundColor: "#B8FEB3",
                                  color: "#000",
                                  padding: "5px 10px",
                                  fontSize: "14px",
                                  borderRadius: "5px",
                                  marginLeft: "5px",
                                  width: "100px",
                                }}
                                onClick={() => {
                                  if (id) {
                                    setPurchaseOrderAllInformation((prev) => {
                                      const temp__details = [
                                        ...prev.detailsData,
                                      ];
                                      temp__details.push({
                                        itemId: "",
                                        itemDescription: "",
                                        quantity: "",
                                        unitPrice: "",
                                        totalAmount: "",
                                      });
                                      return {
                                        ...prev,
                                        detailsData: [...temp__details],
                                      };
                                    });
                                  } else {
                                    ArrayHelperRef.current.push({
                                      itemId: "",
                                      itemDescription: "",
                                      quantity: "",
                                      unitPrice: "",
                                      totalAmount: "",
                                    });
                                  }
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                ></FontAwesomeIcon>
                                Add Row
                              </div>
                            </div>
                            <div className="d-lg-flex justify-content-between align-items-center">
                              <div>
                                <label
                                  htmlFor="grandTotalQuantity"
                                  style={{ fontSize: "16px" }}
                                >
                                  Grand Total Quantity
                                </label>
                                <Field
                                  type="text"
                                  name={`grandTotalQuantity`}
                                  placeholder="Grand Total Quantity"
                                  disabled
                                  value={
                                    id
                                      ? purchaseOrderAllInformation?.grandTotalQuantity
                                      : totalGrandQuantity
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
                              <div className="mt-md-2">
                                <label
                                  htmlFor="grandTotalAmount"
                                  style={{ fontSize: "16px" }}
                                >
                                  Grand Total Amount
                                </label>
                                <Field
                                  type="text"
                                  name={`grandTotalAmount`}
                                  placeholder="Grand Total Amount"
                                  disabled
                                  value={
                                    id
                                      ? purchaseOrderAllInformation?.grandTotalAmount
                                      : totalGrandTotalAmount
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
                          <UpdatePurchaseOrderInfo
                            arrayHelpers={arrayHelpers}
                            purchaseOrderAllInformation={
                              purchaseOrderAllInformation
                            }
                            setPurchaseOrderAllInformation={
                              setPurchaseOrderAllInformation
                            }
                            setTotalGrandQuantity={setTotalGrandQuantity}
                            setTotalGrandTotalAmount={setTotalGrandTotalAmount}
                            rawMaterialItemOptions={rawMaterialItemOptions}
                            setFieldValue={setFieldValue}
                            setActiveItemInfoModal={setActiveItemInfoModal}
                            setAcivePaymentModal={setAcivePaymentModal}
                            setActiveSupplierModal={setActiveSupplierModal}
                            setAciveBankInfoModal={setAciveBankInfoModal}
                            touched={touched}
                            errors={errors}
                            totalGrandQuantity={totalGrandQuantity}
                            totalGrandTotalAmount={totalGrandTotalAmount}
                            makebyUser={makebyUser}
                          ></UpdatePurchaseOrderInfo>
                        ) : (
                          <InsertPurchaseOrder
                            details={details}
                            setTotalGrandQuantity={setTotalGrandQuantity}
                            setTotalGrandTotalAmount={setTotalGrandTotalAmount}
                            rawMaterialItemOptions={rawMaterialItemOptions}
                            setFieldValue={setFieldValue}
                            setActiveItemInfoModal={setActiveItemInfoModal}
                            setAcivePaymentModal={setAcivePaymentModal}
                            setActiveSupplierModal={setActiveSupplierModal}
                            setAciveBankInfoModal={setAciveBankInfoModal}
                            touched={touched}
                            errors={errors}
                            totalGrandQuantity={totalGrandQuantity}
                            totalGrandTotalAmount={totalGrandTotalAmount}
                            arrayHelpers={arrayHelpers}
                          ></InsertPurchaseOrder>
                        )}
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    );
                  }}
                />
              </Form>
            )}
          </Formik>
        </div>
        <SupplierInsertModal
          activeSupplierModal={activeSupplierModal}
          setActiveSupplierModal={setActiveSupplierModal}
          activeItemInfoModal={activeItemInfoModal}
          setActiveItemInfoModal={setActiveItemInfoModal}
          acivePaymentModal={acivePaymentModal}
          setAcivePaymentModal={setAcivePaymentModal}
          aciveBankInfoModal={aciveBankInfoModal}
          setAciveBankInfoModal={setAciveBankInfoModal}
        ></SupplierInsertModal>
      </div>
    </div>
  );
};

export default CommonPurchaseOrderInfo;
