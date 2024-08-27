import {
  faArrowAltCircleLeft,
  faPlus,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useRef } from "react";
import * as Yup from "yup";
import Select from "react-select";
import { useInsertPaymentInformationMutation } from "../../../redux/features/paymnetinformation/paymentInfoApi";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const InsertPaymentOption = () => {
  const ArrayHelperRef = useRef();
  const navigate = useNavigate();
  const [insertPaymentInfo, { isLoading }] =
    useInsertPaymentInformationMutation();
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const makebyUser = getUserParse[0].username;

  const paymentTypeOptions = [
    { value: "cash", label: "Cash" },
    { value: "lcatsight", label: "LC At Sight" },
    { value: "test", label: "test" },
  ];
  console.log('paymentTypeOptions',paymentTypeOptions)
  const initialValues = {
    detailsData: [
      {
        paymentMode: "",
        paymentType: "",
        makeBy: makebyUser,
        updateBy: null,
        makeDate: new Date(),
        updateDate: null,
      },
    ],
  };

  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();

    try {
      const response = await insertPaymentInfo(values.detailsData);
      console.log(response?.error?.data?.message);
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
    <div className=" row px-lg-4 mx-lg-4">
      <div class="overflow-hidden">
        <div className="shadow-lg mt-2 mt-sm-4 mt-md-4 mt-lg-4 p-4 rounded-4">
          <div className="mt-3">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                detailsData: Yup.array().of(
                  Yup.object().shape({
                    paymentMode: Yup.string().required("Required"),
                    paymentType: Yup.string().required("Required"),
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
                  id="paymnetinfocreation-form"
                  onSubmit={(e) => {
                    handleSubmit(e, values, resetForm);
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex  align-items-center">
                      <button
                        type="submit"
                        form="paymnetinfocreation-form"
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
                        {isLoading ? "Loading" : "Save"}
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
                            paymentMode: "",
                            paymentType: "",
                            makeBy: makebyUser,
                            updateBy: null,
                            makeDate: new Date(),
                            updateDate: null,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add
                        Row
                      </div>
                    </div>
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
                          navigate("/main-view/payment-list");
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faArrowAltCircleLeft}
                        ></FontAwesomeIcon>
                        Back to ItemList
                      </button>
                    </div>
                  </div>
                  <FieldArray
                    name="detailsData"
                    render={(arrayHelpers) => {
                      ArrayHelperRef.current = arrayHelpers;
                      const details = values.detailsData;

                      return (
                        <div
                          className=" flex-1 items-center d-flex-nowrap"
                          style={{ height: "400px", overflowY: "auto" }}
                        >
                          <table className="table w-full table-bordered">
                            <thead className="w-100">
                              <tr>
                                <th className="bg-white text-center align-middle">
                                  Sl
                                </th>

                                <th className="bg-white text-center align-middle ">
                                  Payment Mode
                                  <span className="text-danger fw-bold fs-2">
                                    *
                                  </span>
                                </th>
                                <th className="bg-white text-center align-middle ">
                                  Payment Type
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
                                        <td className="bg-white text-center align-items-center">
                                          {index + 1}
                                        </td>

                                        <td className="text-center align-items-center">
                                          <Field
                                            type="text"
                                            name={`detailsData.${index}.paymentMode`}
                                            placeholder="Payment mode"
                                            value={detail?.paymentMode}
                                            style={{
                                              border: "1px solid #2DDC1B",
                                              padding: "5px",
                                              width: "100%",
                                              borderRadius: "5px",
                                              height: "38px",
                                            }}
                                            onClick={(e) => {
                                              setFieldValue(
                                                `detailsData.${index}.paymentMode`,
                                                e.target.value
                                              );
                                            }}
                                          />
                                          <br />
                                          {touched.detailsData?.[index]
                                            ?.paymentType &&
                                            errors.detailsData?.[index]
                                              ?.paymentType && (
                                              <div className="text-danger">
                                                {
                                                  errors.detailsData[index]
                                                    .paymentType
                                                }
                                              </div>
                                            )}
                                        </td>
                                        <td className="text-center align-items-center">
                                          <div className="w-100">
                                            <Select
                                              class="form-select"
                                              className="w-100"
                                              aria-label="Default select example"
                                              name={`detailsData.${index}.paymentType`}
                                              options={paymentTypeOptions}
                                              defaultValue={{
                                                label: "Select payment type",
                                                value: 0,
                                              }}
                                              styles={{
                                                control: (
                                                  baseStyles,
                                                  state
                                                ) => ({
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
                                                setFieldValue(
                                                  `detailsData.${index}.paymentType`,
                                                  e.value
                                                );
                                              }}
                                            ></Select>
                                          </div>
                                          <br />
                                          {touched.detailsData?.[index]
                                            ?.paymentType &&
                                            errors.detailsData?.[index]
                                              ?.paymentType && (
                                              <div className="text-danger">
                                                {
                                                  errors.detailsData[index]
                                                    .paymentType
                                                }
                                              </div>
                                            )}
                                        </td>
                                        <td className="text-center align-items-center">
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

export default InsertPaymentOption;
