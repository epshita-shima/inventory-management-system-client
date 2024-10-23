import React, { useState } from "react";
import DeliverReturnSinglePart from "./DeliverReturnSinglePart";
import { Field, FieldArray, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import swal from "sweetalert";
import { useGetAllInvoiceInformationQuery } from "../../../redux/features/invoiceinformation/invoiceinfoApi";
import { invoiceListDropdown } from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllDelieryOrderInformationAfterDeliverQuery } from "../../../redux/features/deliveryorderinformation/deliveryinfoApi";

const DeliverReturnCommonPart = () => {
  const { data: invoiceInformation } =
    useGetAllInvoiceInformationQuery(undefined);

  const { data: deliveryOrderDataInformation } =
    useGetAllDelieryOrderInformationAfterDeliverQuery(undefined);

  const [returnDate, setReturnDate] = useState(new Date());
  const initialValues = {
    returnDate: "",
    piId: "",
    doId: "",
    transferFromClientId: "",
    transferToCompanyId: "",
    detailsData: [{}],
  };

  const piNumberOptions = invoiceListDropdown(invoiceInformation);
  console.log(piNumberOptions);

  const handleSubmit = (e) => {
    e.preventDefault();
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
              driverName: Yup.string().required("Required"),
              driverContactNo: Yup.string()
                .required("Required")
                .min(11, "Must be at least 11 characters long")
                .max(11, "Must be at most 11 characters long")
                .matches(/^[0-9]+$/, "Must be a valid phone number"),
              truckNo: Yup.string().required("Required"),
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
                    const details = values.detailsData;

                    return (
                      <div className=" shadow-lg py-2 px-5">
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
                                  Sales Return Insert Form
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
                                      //   navigate('/main-view/list-page');
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
                                <DeliverReturnSinglePart
                                  values={values}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  errors={errors}
                                  returnDate={returnDate}
                                  setReturnDate={setReturnDate}
                                  piNumberOptions={piNumberOptions}
                                  deliveryOrderDataInformation={
                                    deliveryOrderDataInformation
                                  }
                                ></DeliverReturnSinglePart>
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
                                  </div>
                                  <div>
                                    <label htmlFor="totalDeliverQty">
                                      Total Deliver Qty
                                    </label>
                                    <Field
                                      type="text"
                                      name={`totalDeliverQty`}
                                      placeholder="Total Deliver Qty"
                                      //   value={totalDeliverQtyCalculate}
                                      disabled
                                      style={{
                                        border: "1px solid #2DDC1B",
                                        padding: "5px",
                                        width: "60%",
                                        borderRadius: "5px",
                                        height: "38px",
                                        textAlign: "center",
                                        marginLeft: "5px",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {
                                // <DeliverReturnSinglePart></DeliverReturnSinglePart>
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

export default DeliverReturnCommonPart;
