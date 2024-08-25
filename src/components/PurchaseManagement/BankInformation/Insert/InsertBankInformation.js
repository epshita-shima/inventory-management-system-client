import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useRef } from "react";
import * as Yup from "yup";
import { useInsertBankInformationMutation } from "../../../../redux/features/bankinformation/bankInfoAPi";
import swal from "sweetalert";
import './InsertBankInformation.css'

const InsertBankInformation = () => {
  const ArrayHelperRef = useRef();
  const [insertBankingInfo, { isLoading }] = useInsertBankInformationMutation();
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const makebyUser = getUserParse[0].username;

  const initialValues = {
    detailsData: [
      {
        accountNumber: "",
        accountName: "",
        bankName: "",
        branchName: "",
        city: "",
        address:"",
        routingNumber: "",
        swiftCode: "",
        makeBy: makebyUser,
        updateBy: null,
        makeDate: new Date(),
        updateDate: null,
      },
    ],
  };

  const handleSubmit =async (e, values, resetForm) => {
    e.preventDefault();
    try {
      const response = await insertBankingInfo(values.detailsData);
      console.log(response?.error?.data?.message);
      if (response?.data?.status === 200) {
        swal("Done", "Data Save Successfully", "success");
        resetForm();
      } else if((response?.error?.status === 400)){
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
      // style={{
      //   overflowY: "scroll",
      //   height: "500px",
      // }}
    >
      <div class="overflow-hidden">
        <div className="shadow-lg mt-2 mt-sm-4 mt-md-4 mt-lg-4 p-4 rounded-4">
          <div className="mt-3">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                detailsData: Yup.array().of(
                  Yup.object().shape({
                    accountNumber: Yup.string().required("Required"),
                    accountName: Yup.string().required("Required"),
                    bankName: Yup.string().required("Required"),
                    branchName: Yup.string().required("Required"),
                    city: Yup.string().required("Required"),
                    address: Yup.string().required("Required"),
                    routingNumber: Yup.string().required("Required"),
                    swiftCode: Yup.string().required("Required"),
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
                  id="bankinfocreation-form"
                  onSubmit={(e) => {
                    handleSubmit(e, values, resetForm);
                  }}
                >
                  <div className="d-lg-flex align-items-center mb-4">
                    <button
                      type="submit"
                      form="bankinfocreation-form"
                      className="border-0 "
                      style={{
                        backgroundColor: isValid && dirty ? "#2DDC1B" : "gray",
                        color: "white",
                        padding: "5px 10px",
                        fontSize: "14px",
                        borderRadius: "5px",
                        width: "100px",
                      }}
                      disabled={!(isValid && dirty)}
                    >
                      {isLoading ? "Loading" : "Save"}
                    </button>
                    <div
                      className="border-0 mt-sm-2 mt-md-2 ms-lg-2 mt-lg-0"
                      style={{
                        backgroundColor: "#2DDC1B",
                        color: "#fff",
                        padding: "5px 10px",
                        fontSize: "14px",
                        borderRadius: "5px",
                        width:'100px'
                      }}
                      onClick={() => {
                        ArrayHelperRef.current.push({
                          accountNumber: "",
                          accountName: "",
                          bankName: "",
                          branchName: "",
                          city: "",
                          address:"",
                          routingNumber: "",
                          swiftCode: "",
                          makeBy: makebyUser,
                          updateBy: null,
                          makeDate: new Date(),
                          updateDate: null,
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add Row
                    </div>

                    <div className="d-flex mt-2 mb-4"></div>
                  </div>
                  <FieldArray
                    name="detailsData"
                    render={(arrayHelpers) => {
                      ArrayHelperRef.current = arrayHelpers;
                      const details = values.detailsData;
                      console.log(values);
                      return (
                        <div
                          className=" flex-1 items-center d-flex-nowrap insertbankinfo-responsive-custom"
                          // style={{ height: "400px", overflowY: "auto" }}

                        >
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead className="w-100">
                                <tr>
                                  <th
                                    className="bg-white text-center align-middle"
                                    style={{ width: "2%" }}
                                  >
                                    Sl
                                  </th>

                                  <th className="bg-white text-center align-middle ">
                                    Account Number
                                    <span className="text-danger fw-bold fs-2">
                                      *
                                    </span>
                                  </th>
                                  <th className="bg-white text-center align-middle ">
                                    Account Name
                                    <span className="text-danger fw-bold fs-2">
                                      *
                                    </span>
                                  </th>
                                  <th className="bg-white text-center align-middle ">
                                    Bank Name
                                    <span className="text-danger fw-bold fs-2">
                                      *
                                    </span>
                                  </th>
                                  <th className="bg-white text-center align-middle ">
                                    Branch Name
                                    <span className="text-danger fw-bold fs-2">
                                      *
                                    </span>
                                  </th>
                                  <th className="bg-white text-center align-middle ">
                                    City
                                    <span className="text-danger fw-bold fs-2">
                                      *
                                    </span>
                                  </th>
                                  <th className="bg-white text-center align-middle ">
                                  Address
                                    <span className="text-danger fw-bold fs-2">
                                      *
                                    </span>
                                  </th>
                                  <th className="bg-white text-center align-middle ">
                                    Routing No
                                    <span className="text-danger fw-bold fs-2">
                                      *
                                    </span>
                                  </th>
                                  <th className="bg-white text-center align-middle ">
                                    Swift Code
                                    <span className="text-danger fw-bold fs-2">
                                      *
                                    </span>
                                  </th>
                                  <th className="bg-white text-center align-middle ">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              {details && details.length > 0
                                ? details?.map((detail, index) => {
                                    return (
                                      <tbody>
                                        <tr key={index}>
                                          <td className="bg-white text-center align-middle">
                                            {index + 1}
                                          </td>
                                          <td className="text-center align-middle">
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.accountNumber`}
                                              placeholder="Account number"
                                              value={detail?.accountNumber}
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                              }}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  `detailsData.${index}.accountNumber`,
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            <br />
                                            {touched.detailsData?.[index]
                                              ?.accountNumber &&
                                              errors.detailsData?.[index]
                                                ?.accountNumber && (
                                                <div className="text-danger">
                                                  {
                                                    errors.detailsData[index]
                                                      .accountNumber
                                                  }
                                                </div>
                                              )}
                                          </td>
                                          <td className="text-center align-middle">
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.accountName`}
                                              placeholder="Account name"
                                              value={detail?.accountName}
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                              }}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  `detailsData.${index}.accountName`,
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            <br />
                                            {touched.detailsData?.[index]
                                              ?.accountName &&
                                              errors.detailsData?.[index]
                                                ?.accountName && (
                                                <div className="text-danger">
                                                  {
                                                    errors.detailsData[index]
                                                      .accountName
                                                  }
                                                </div>
                                              )}
                                          </td>
                                          <td className="text-center align-middle">
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.bankName`}
                                              placeholder="Bank Name"
                                              value={detail?.bankName}
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                              }}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  `detailsData.${index}.bankName`,
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            <br />
                                            {touched.detailsData?.[index]
                                              ?.bankName &&
                                              errors.detailsData?.[index]
                                                ?.bankName && (
                                                <div className="text-danger">
                                                  {
                                                    errors.detailsData[index]
                                                      .bankName
                                                  }
                                                </div>
                                              )}
                                          </td>
                                          <td className="text-center align-middle">
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.branchName`}
                                              placeholder="Branch Name"
                                              value={detail?.branchName}
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                              }}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  `detailsData.${index}.branchName`,
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            <br />
                                            {touched.detailsData?.[index]
                                              ?.branchName &&
                                              errors.detailsData?.[index]
                                                ?.branchName && (
                                                <div className="text-danger">
                                                  {
                                                    errors.detailsData[index]
                                                      .branchName
                                                  }
                                                </div>
                                              )}
                                          </td>

                                          <td className="text-center align-middle">
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.city`}
                                              placeholder="City"
                                              value={detail?.city}
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                              }}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  `detailsData.${index}.city`,
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            <br />
                                            {touched.detailsData?.[index]
                                              ?.city &&
                                              errors.detailsData?.[index]
                                                ?.city && (
                                                <div className="text-danger">
                                                  {
                                                    errors.detailsData[index]
                                                      .city
                                                  }
                                                </div>
                                              )}
                                          </td>
                                          <td className="text-center align-middle">
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.address`}
                                              placeholder="Address"
                                              value={detail?.address}
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                              }}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  `detailsData.${index}.address`,
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            <br />
                                            {touched.detailsData?.[index]
                                              ?.address &&
                                              errors.detailsData?.[index]
                                                ?.address && (
                                                <div className="text-danger">
                                                  {
                                                    errors.detailsData[index]
                                                      .address
                                                  }
                                                </div>
                                              )}
                                          </td>
                                          <td className="text-center align-middle">
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.routingNumber`}
                                              placeholder="Routing number"
                                              value={detail?.routingNumber}
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                              }}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  `detailsData.${index}.routingNumber`,
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            <br />
                                            {touched.detailsData?.[index]
                                              ?.routingNumber &&
                                              errors.detailsData?.[index]
                                                ?.routingNumber && (
                                                <div className="text-danger">
                                                  {
                                                    errors.detailsData[index]
                                                      .routingNumber
                                                  }
                                                </div>
                                              )}
                                          </td>
                                          <td className="text-center align-middle">
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.swiftCode`}
                                              placeholder="Swift code"
                                              value={detail?.swiftCode}
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                              }}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  `detailsData.${index}.swiftCode`,
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            <br />
                                            {touched.detailsData?.[index]
                                              ?.swiftCode &&
                                              errors.detailsData?.[index]
                                                ?.swiftCode && (
                                                <div className="text-danger">
                                                  {
                                                    errors.detailsData[index]
                                                      .swiftCode
                                                  }
                                                </div>
                                              )}
                                          </td>

                                          <td className="text-center align-middle">
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
                                      </tbody>
                                    );
                                  })
                                : null}
                            </table>
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
    </div>
  );
};

export default InsertBankInformation;
