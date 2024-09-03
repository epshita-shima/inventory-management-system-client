import React, { useEffect, useRef, useState } from "react";
import InvoiceSingleEntry from "./InvoiceSingleEntry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { useNavigate, useParams } from "react-router-dom";
import InsertSalesManagement from "../Insert/InsertSalesManagement";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
import {
  finishGoodsWithSizeItemDropdown,
  paymentInfoDropdown,
} from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllItemUnitQuery } from "../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import {
  useCreateSerialNoMutation,
  useGetSerialNoQuery,
} from "../../../redux/api/apiSlice";
import {
  useGetSingleInvoiceQuery,
  useInsertInvoiceInformationMutation,
  useUpdateInvoiceInfoMutation,
} from "../../../redux/features/invoiceinformation/invoiceinfoApi";
import { useGetAllPaymentInformationQuery } from "../../../redux/features/paymnetinformation/paymentInfoApi";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import InvoiceCommonModal from "../../Common/CommonModal/InvoiceCommonModal";
import UpdateInvoiceDetails from "../Update/UpdateInvoiceDetails";
import InvoiceClientEntryModal from "../../Common/CommonModal/InvoiceClientEntryModal";
import InvoiceFinishGoodsItemsEntryModal from "../../Common/CommonModal/InvoiceFinishGoodsItemsEntryModal";

const SalesManagementCommonPart = () => {
  const { id } = useParams();
  const ArrayHelperRef = useRef();
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const makebyUser = getUserParse[0].username;
  const navigate = useNavigate();
  const [piDate, setPiDate] = useState(new Date());
  const [expireDate, setExpireDate] = useState(new Date());
  const { data: finishGoods } = useGetAllItemInformationQuery(undefined);
  const { data: unitInformation } = useGetAllItemUnitQuery(undefined);
  const [serialValue, setSerialValue] = useState([]);
  const { data: serialNo,refetch:serialRefetch } = useGetSerialNoQuery(undefined);
  const [insertInvoiceInfo] = useInsertInvoiceInformationMutation();
  const [createSerialNo] = useCreateSerialNoMutation();
  const { data: paymentTypeInfo } = useGetAllPaymentInformationQuery(undefined);
  const { data: sizeInfo } = useGetAllItemSizeQuery(undefined);
  const [acivePaymentModal, setAcivePaymentModal] = useState(false);
  const { data: getSingleInvoiceData } = useGetSingleInvoiceQuery(id);
  const [updateSingleInvoiceData, setUpdateSingleInvoiceData] = useState([]);
  const [updateInvoiceInfo] = useUpdateInvoiceInfoMutation();


  const initialValues = {
    piDate: piDate,
    expireDate: expireDate,
    invoiceNo: "",
    customerID: "",
    paymentId: "",
    currency: "",
    approveBy: "",
    approveDate: "",
    isApproved: false,
    specialApproveForDelivary: false,
    specialApproveBy: "",
    specialApproveDate: "",
    makeBy: makebyUser,
    updateBy: null,
    makeDate: new Date(),
    updateDate: null,
    detailsData: [
      {
        itemId: "",
        description: "",
        quantity: "",
        unitPrice: "",
        totalAmount: "",
      },
    ],
  };

  const paymentTypeOptions = paymentInfoDropdown(paymentTypeInfo);
  const finisGoodsOptions = finishGoodsWithSizeItemDropdown(
    finishGoods,
    sizeInfo
  );

  const areFieldsEmpty = () => {
    return updateSingleInvoiceData?.detailsData?.some(
      (field) => !field.description || !field.quantity || !field.unitPrice
    );
  };

  useEffect(() => {
    if (serialNo && serialNo.length > 0) {
      serialRefetch()
      const maxSerialNoObject = serialNo.reduce((max, current) => {
        if (current.type === "invoice") {
          // If max is undefined or current serialNo is greater, return current

          return max && current.serialNo > max.serialNo
            ? current
            : max || current;
        }
        return max;
      }, undefined);
      console.log(maxSerialNoObject);
      if (maxSerialNoObject) {
        setSerialValue(maxSerialNoObject);
      }
    }
    if (id) {
      setUpdateSingleInvoiceData(getSingleInvoiceData);
    }
  }, [serialNo, id, getSingleInvoiceData]);

  console.log(serialValue);
  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();
    const serialData = {
      serialNo: serialNo?.serialNo,
      type: "invoice",
      year: new Date().toLocaleDateString("en-CA"),
      makeby: makebyUser,
      updateby: "",
    };
    try {
      if (id) {
        const response = await updateInvoiceInfo(updateSingleInvoiceData);
        console.log(response);
        if (response?.data?.status === 200) {
          navigate("/main-view/invoice-list");
          swal("Done", "Data Update Successfully", "success");
          resetForm();
        } else if (response?.error?.status === 400) {
          swal("Not Possible!", response?.error?.data?.message, "error");
        }
      } else {
        const response = await insertInvoiceInfo(values);
        if (response?.data?.status === 200) {
          await createSerialNo(serialData);
          serialRefetch()
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
        overflow: "scroll",
        height: "calc(98vh - 120px)",
        zIndex: "9999",
      }}
    >
      <div class="">
        <div className="px-4 rounded-4">
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              customerID: Yup.string().required("Required"),
              paymentId: Yup.string().required("Required"),
              currency: Yup.string().required("Required"),
              detailsData: Yup.array().of(
                Yup.object().shape({
                  itemId: Yup.string().required("Required"),
                  description: Yup.string().required("Required"),
                  quantity: Yup.string().required("Required"),
                  unitPrice: Yup.string().required("Required"),
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
                    console.log(values);
                    return (
                      <div className="shadow-lg py-2 px-5">
                        <div class="container-fluid">
                          <div class="row justify-content-center">
                            <div class="col-12 col-md-12 col-lg-12 fixed-column py-2">
                              <div className="d-lg-flex justify-content-between align-items-center">
                                <h2
                                  style={{
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Invoice Insert Form
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
                                      navigate("/main-view/invoice-list");
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faArrowAltCircleLeft}
                                    ></FontAwesomeIcon>
                                    Back to ItemList
                                  </button>
                                </div>
                              </div>
                              {
                                <InvoiceSingleEntry
                                  id={id}
                                  makebyUser={makebyUser}
                                  values={values}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  errors={errors}
                                  paymentTypeOptions={paymentTypeOptions}
                                  setAcivePaymentModal={setAcivePaymentModal}
                                  updateSingleInvoiceData={
                                    updateSingleInvoiceData
                                  }
                                  setUpdateSingleInvoiceData={
                                    setUpdateSingleInvoiceData
                                  }
                                  serialValue={serialValue}
                                  piDate={piDate} 
                                  setPiDate={setPiDate}
                                  expireDate={expireDate}
                                  setExpireDate={setExpireDate}

                                ></InvoiceSingleEntry>
                              }
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
                                  <div className="d-lg-flex justify-content-between">
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
                                        fontWeight: 900,
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
                                      className="border-0 mt-sm-4 ms-lg-2 mt-lg-0"
                                      style={{
                                        // backgroundColor: "#00B987",
                                        backgroundColor: "#B8FEB3",
                                        color: "#000",
                                        fontWeight: 900,
                                        padding: "5px 10px",
                                        fontSize: "14px",
                                        borderRadius: "5px",
                                        width: "110px",
                                      }}
                                      onClick={() => {
                                        if (id) {
                                          setUpdateSingleInvoiceData((prev) => {
                                            const temp__details = [
                                              ...prev.detailsData,
                                            ];
                                            temp__details.push({
                                              itemId: "",
                                              description: "",
                                              quantity: "",
                                              unitPrice: "",
                                              totalAmount: "",
                                            });
                                            return {
                                              ...prev,
                                              detailsData: [...temp__details],
                                            };
                                          });
                                        }

                                        ArrayHelperRef.current.push({
                                          itemId: "",
                                          description: "",
                                          quantity: "",
                                          unitPrice: "",
                                          totalAmount: "",
                                        });
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faPlus}
                                        style={{ fontWeight: 900 }}
                                      ></FontAwesomeIcon>{" "}
                                      Add Row
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {id ? (
                                <UpdateInvoiceDetails
                                  finisGoodsOptions={finisGoodsOptions}
                                  touched={touched}
                                  errors={errors}
                                  makebyUser={makebyUser}
                                  updateSingleInvoiceData={
                                    updateSingleInvoiceData
                                  }
                                  setUpdateSingleInvoiceData={
                                    setUpdateSingleInvoiceData
                                  }
                                ></UpdateInvoiceDetails>
                              ) : (
                                <InsertSalesManagement
                                  details={details}
                                  touched={touched}
                                  errors={errors}
                                  arrayHelpers={arrayHelpers}
                                  finisGoodsOptions={finisGoodsOptions}
                                  setFieldValue={setFieldValue}
                                  serialValue={serialValue}
                                ></InsertSalesManagement>
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
      </div>
      <InvoiceCommonModal
        acivePaymentModal={acivePaymentModal}
        setAcivePaymentModal={setAcivePaymentModal}
      ></InvoiceCommonModal>
      <InvoiceClientEntryModal />
      <InvoiceFinishGoodsItemsEntryModal />
    </div>
  );
};

export default SalesManagementCommonPart;
