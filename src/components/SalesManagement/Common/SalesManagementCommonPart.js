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
import { useNavigate } from "react-router-dom";
import InsertSalesManagement from "../Insert/InsertSalesManagement";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
import {
  finishGoodsDropdown,
  unitInformationDropdown,
} from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllItemUnitQuery } from "../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import {
  useCreateSerialNoMutation,
  useGetSerialNoQuery,
} from "../../../redux/api/apiSlice";
import { useInsertInvoiceInformationMutation } from "../../../redux/features/invoiceinformation/invoiceinfoApi";
const SalesManagementCommonPart = () => {
  const ArrayHelperRef = useRef();
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const makebyUser = getUserParse[0].username;
  const navigate = useNavigate();
  const { data: finishGoods } = useGetAllItemInformationQuery(undefined);
  const { data: unitInformation } = useGetAllItemUnitQuery(undefined);
  const [serialValue, setSerialValue] = useState([]);
  const { data: serialNo } = useGetSerialNoQuery(undefined);
  const [insertInvoiceInfo] = useInsertInvoiceInformationMutation();
  const [createSerialNo] = useCreateSerialNoMutation();
  const initialValues = {
    PIDate: "",
    expireDate: "",
    invoiceNo: "",
    customerID: "",
    currency: "",
    makeBy: makebyUser,
    updateBy: null,
    makeDate: new Date(),
    updateDate: null,
    detailsData: [
      {
        itemId: "",
        description: "",
        unitId: "",
        quantity: "",
        unitPrice: "",
        totalAmount: "",
      },
    ],
  };
  const finisGoodsOptions = finishGoodsDropdown(finishGoods);
  const unitInfoOptions = unitInformationDropdown(unitInformation);
  useEffect(() => {
    if (serialNo && serialNo.length > 0) {
      const maxSerialNoObject = serialNo.reduce((max, current) => {
        if (current.type === "invoice") {
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
  }, [serialNo]);

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
      const response = await insertInvoiceInfo(values);
      if (response?.data?.status === 200) {
        await createSerialNo(serialData);
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
              detailsData: Yup.array().of(
                Yup.object().shape({
                  itemId: Yup.string().required("Required"),
                  description: Yup.string().required("Required"),
                  unitId: Yup.string().required("Required"),
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
                                  values={values}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  errors={errors}
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
                                        backgroundColor:
                                          isValid && dirty ? "#2DDC1B" : "gray",
                                        color: "white",
                                        padding: "5px 10px",
                                        fontSize: "14px",
                                        fontWeight: 900,
                                        borderRadius: "5px",
                                        width: "100px",
                                      }}
                                      disabled={!(isValid && dirty)}
                                    >
                                      Save
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
                                        ArrayHelperRef.current.push({
                                          itemId: "",
                                          receipe: "",
                                          materialUsed: "",
                                          asPerRatio: "",
                                          excess: "",
                                          less: "",
                                          consumptionStatus: "",
                                          receipeLabelData: "",
                                          singleValueCFTPerKg: "",
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
                              {
                                <InsertSalesManagement
                                  details={details}
                                  touched={touched}
                                  errors={errors}
                                  arrayHelpers={arrayHelpers}
                                  finisGoodsOptions={finisGoodsOptions}
                                  setFieldValue={setFieldValue}
                                  unitInfoOptions={unitInfoOptions}
                                  serialValue={serialValue}
                                ></InsertSalesManagement>
                              }
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
    </div>
  );
};

export default SalesManagementCommonPart;
