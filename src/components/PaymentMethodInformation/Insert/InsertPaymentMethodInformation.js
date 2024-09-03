import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Select from "react-select";
import swal from "sweetalert";
import { clientInfoDropdown } from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";

const InsertPaymentMethodInformation = () => {
  const ArrayHelperRef = useRef();
  const navigate = useNavigate();
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const makebyUser = getUserParse[0].username;
  const {data:clientInfo}=useGetAllClientInformationQuery()
  const [paymentReceiveDate, setPaymentReceiveDate] = useState(new Date());
  const paymentMethodOptions = [
    { value: "cash", label: "Cash" },
    { value: "bank", label: "Bank" },
  ];
  const paymentStatusOptions = [
    { value: "cash", label: "Cash" },
    { value: "adjustment", label: "Adjustment" },
  ];
  const initialValues = {
    clientId: "",
    piNumber: "  ",
    makeBy: makebyUser,
    updateBy: null,
    makeDate: new Date(),
    updateDate: null,
    detailsData: [
      {
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
      },
    ],
  };

  const handleSubmit = () => {};
  const clientDataOptions=clientInfoDropdown(clientInfo)
  return (
    <div
      className=" row mx-4"
      style={{ height: "calc(98vh - 120px)", overflowY: "hidden" }}
    >
      <div class="overflow-hidden">
        <div className="shadow-lg  rounded-4">
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              challanNo: Yup.string().required("Required"),
              detailsData: Yup.array().of(
                Yup.object().shape({
                  itemId: Yup.string().required("Required"),
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
                id="poupdate-form"
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
                                  navigate("/main-view/grn-list");
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
                                        return (
                                          option.value === values.clientId
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
                                      // handleSelectSupplier(e, setFieldValue);
                                    }}
                                  ></Select>

                                  {touched.supplierId && errors.supplierId && (
                                    <div className="text-danger">
                                      {errors.supplierId}
                                    </div>
                                  )}
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
                                    //   options={pOOptionsData}
                                    //   isDisabled={
                                    //     pOOptionsData?.length === 0 ||
                                    //     pOOptionsData?.length === undefined
                                    //       ? true
                                    //       : false
                                    //   }
                                    defaultValue={{
                                      label: "Select PI Number",
                                      value: 0,
                                    }}
                                    //   value={
                                    //   pOOptionsData?.filter(function (
                                    //           option
                                    //         ) {
                                    //           return (
                                    //             option?.value ===
                                    //             values.supplierPoNo
                                    //           );
                                    //         })
                                    //   }
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
                                    onChange={(e) => {}}
                                  ></Select>

                                  {touched.supplierId && errors.supplierId && (
                                    <div className="text-danger">
                                      {errors.supplierId}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {details.length === 0 || (
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
                                    className="border-0 "
                                    style={{
                                      backgroundColor:
                                        isValid && dirty ? "#2DDC1B" : "gray",
                                      color: "white",
                                      padding: "5px 10px",
                                      fontSize: "14px",
                                      borderRadius: "5px",
                                      width: "100px",
                                    }}
                                    disabled={!(isValid && dirty)}
                                  >
                                    Save
                                  </button>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
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
                                      //   value={ totalGrandQuantity
                                      //   }
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
                                  <div style={{ display: "none" }}>
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
                                      //   value={ totalGrandAmount
                                      //   }
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

                            {/* <InsertGRNDetailsInfo
                                  details={details}
                                  values={values}
                                  rmItemInfo={rmItemInfo}
                                  setTotalGrandQuantity={setTotalGrandQuantity}
                                  setTotalGrandAmount={setTotalGrandAmount}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  errors={errors}
                                  purchaseOrderInfo={purchaseOrderInfo}
                                  totalGrandAmount={totalGrandAmount}
                                  totalGrandQuantity={totalGrandQuantity}
                                  arrayHelpers={arrayHelpers}
                                ></InsertGRNDetailsInfo> */}
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

export default InsertPaymentMethodInformation;
