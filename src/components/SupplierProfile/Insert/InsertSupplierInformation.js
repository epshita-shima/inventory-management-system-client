import {
  faArrowAltCircleLeft,
  faPlus,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import "./InsertSupplierInformation";
import {
  useGetSingleSupplierInfoQuery,
  useInsertSupplierInformationMutation,
  useUpdateSupplierDetailsInfoMutation,
} from "../../../redux/features/supplierInformation/supplierInfoApi";
import swal from "sweetalert";
import { useGetAllCFTInfosQuery } from "../../../redux/features/cftinformation/cftInfosApi";
const InsertSupplierInformation = () => {
  const ArrayHelperRef = useRef();
  const navigate = useNavigate();
  const { id } = useParams();
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const makebyUser = getUserParse[0].username;
  const updatebyUser = getUserParse[0].username;
  const [insertSupplierInfo] = useInsertSupplierInformationMutation();
  const { data: singleSupplierInfo } = useGetSingleSupplierInfoQuery(id);
  const [updateSupplierInfo] = useUpdateSupplierDetailsInfoMutation();
  const [supplierData, setSupplierData] = useState([]);

  useEffect(() => {
    if (id) {
      setSupplierData(singleSupplierInfo);
    }
  }, [id, singleSupplierInfo]);

  const initialValues = {
    detailsData: [
      {
        supplierName: "",
        supplierShortName:'',
        email: "",
        mobileNo: "",
        contactPerson: "",
        binNo: "",
        tradeLicenceNo: "",
        tinNo: "",
        address: "",
        isActive: true,
        supplierApproveStatus: false,
        supplierApproveDate: null,
        isAccountPostingStatus: false,
        vocuherNo: null,
        voucherDate: null,
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
      if (id) {
        const response = await updateSupplierInfo(supplierData);
        console.log(response.data.status);
        if (response.data.status === 200) {
          swal("Done", "Data Save Successfully", "success");
         navigate('/main-view/supplier-list')
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while creating the data",
            "error"
          );
        }
      } else {
        const response = await insertSupplierInfo(values.detailsData);
        console.log(response.data.status);
        if (response.data.status === 200) {
          swal("Done", "Data Save Successfully", "success");
          resetForm();
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while creating the data",
            "error"
          );
        }
      }
    } catch (err) {
      console.error(err);
      swal("Relax!", "An problem occurred while creating the data", "error");
    }
  };

  return (
    <div
      className=" row px-lg-4 mx-lg-4"
      // style={{
      //   overflowY: "scroll",
      //   height: "calc(80vh - 120px)",
      // }}
    >
      <div class="">
        <div className="">
          <div className="d-flex justify-content-between align-items-center ">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon
                style={{
                  fontSize: "14px",
                  color: "#000",
                  // backgroundColor: "#00B987",
                  backgroundColor: "#2DDC1B",
                  borderRadius: "50px",
                  padding: "3px",
                }}
                icon={faPlus}
              />
              &nbsp;
              <span
                style={{
                  color: "#000",
                  fontWeight: "700",
                  letterSpacing: ".5px",
                }}
              >
                {id
                  ? "Update  Supplier Information"
                  : "Create Supplier Information"}
              </span>
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
                  navigate("/main-view/supplier-list");
                }}
              >
                <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>
                Back to SupplierList
              </button>
            </div>
          </div>
          <div>
            <div></div>
          </div>

          <div className="mt-3">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                detailsData: Yup.array().of(
                  Yup.object().shape({
                    supplierName: Yup.string().required("Required"),
                    supplierShortName: Yup.string().required("Required"),
                    email: Yup.string().required("Required"),
                    mobileNo: Yup.string()
                      .required("Required")
                      .min(11, "must be at least 11 characters long"),
                    contactPerson: Yup.string().required("Required"),
                    binNo: Yup.string().required("Required"),
                    tradeLicenceNo: Yup.string().required("Required"),
                    tinNo: Yup.string().required("Required"),
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
                  id="itemcreation-form"
                  onSubmit={(e) => {
                    handleSubmit(e, values, resetForm);
                  }}
                >
                  {/* <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex mt-4 mb-4">
                    </div>
                  </div> */}

                  <FieldArray
                    name="detailsData"
                    render={(arrayHelpers) => {
                      ArrayHelperRef.current = arrayHelpers;
                      const details = values.detailsData;
                      return (
                        <div className="row shadow-lg pt-lg-5 pb-3 w-lg-75 d-flex justify-content-center mx-auto rounded-4">
                          <div className="col-md-12">
                            {details && details.length > 0
                              ? details.map((detail, index) => {
                                  console.log(detail);
                                  return (
                                    <div key={index}>
                                      <div>
                                        <div className="col-md-12 col-lg-6 col-xl-6">
                                          <div className="mb-2">
                                            <label htmlFor="supplierName">
                                              Supplier Name
                                            </label>
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.supplierName`}
                                              placeholder="Supplier Name"
                                              value={
                                                id
                                                  ? supplierData?.supplierName
                                                  : detail?.supplierName
                                              }
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                                height: "38px",
                                              }}
                                              onChange={(e) => {
                                                if (id) {
                                                  setSupplierData(
                                                    (prevData) => ({
                                                      ...prevData,
                                                      supplierName:
                                                        e.target.value,
                                                      updateBy: updatebyUser,
                                                      updateDate: new Date(),
                                                    })
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `detailsData.${index}.supplierName`,
                                                    e.target.value
                                                  );
                                                }
                                              }}
                                            />
                                            <br />
                                            {id
                                              ? ""
                                              : touched.detailsData?.[index]
                                                  ?.supplierName &&
                                                errors.detailsData?.[index]
                                                  ?.supplierName && (
                                                  <div className="text-danger">
                                                    {
                                                      errors.detailsData[index]
                                                        .supplierName
                                                    }
                                                  </div>
                                                )}
                                          </div>
                                          <div className="mb-2">
                                            <label htmlFor="supplierShortName">
                                              Supplier Short Name
                                            </label>
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.supplierShortName`}
                                              placeholder="Supplier short name"
                                              value={
                                                id
                                                  ? supplierData?.supplierShortName
                                                  : detail?.supplierShortName
                                              }
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                                height: "38px",
                                              }}
                                              onChange={(e) => {
                                                if (id) {
                                                  setSupplierData(
                                                    (prevData) => ({
                                                      ...prevData,
                                                      supplierShortName:
                                                        e.target.value,
                                                      updateBy: updatebyUser,
                                                      updateDate: new Date(),
                                                    })
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `detailsData.${index}.supplierShortName`,
                                                    e.target.value
                                                  );
                                                }
                                              }}
                                            />
                                            <br />
                                            {id
                                              ? ""
                                              : touched.detailsData?.[index]
                                                  ?.supplierShortName &&
                                                errors.detailsData?.[index]
                                                  ?.supplierShortName && (
                                                  <div className="text-danger">
                                                    {
                                                      errors.detailsData[index]
                                                        .supplierShortName
                                                    }
                                                  </div>
                                                )}
                                          </div>
                                          <div className="mb-2">
                                            <label htmlFor="email">Email</label>
                                            <Field
                                              type="email"
                                              name={`detailsData.${index}.email`}
                                              placeholder="Email"
                                              value={
                                                id
                                                  ? supplierData?.email
                                                  : detail?.email
                                              }
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                                height: "38px",
                                              }}
                                              onChange={(e) => {
                                                if (id) {
                                                  setSupplierData(
                                                    (prevData) => ({
                                                      ...prevData,
                                                      email: e.target.value,
                                                      updateBy: updatebyUser,
                                                      updateDate: new Date(),
                                                    })
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `detailsData.${index}.email`,
                                                    e.target.value
                                                  );
                                                }
                                              }}
                                            />
                                            <br />
                                            {id
                                              ? ""
                                              : touched.detailsData?.[index]
                                                  ?.email &&
                                                errors.detailsData?.[index]
                                                  ?.email && (
                                                  <div className="text-danger">
                                                    {
                                                      errors.detailsData[index]
                                                        .email
                                                    }
                                                  </div>
                                                )}
                                          </div>

                                          <div className="mb-2">
                                            <label htmlFor="mobileNo">
                                              Mobile Number
                                            </label>
                                            <Field
                                              type="number"
                                              name={`detailsData.${index}.mobileNo`}
                                              placeholder="Mobile Number"
                                              value={
                                                id
                                                  ? supplierData?.mobileNo
                                                  : detail?.mobileNo
                                              }
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                                height: "38px",
                                                marginBottom: "5px",
                                              }}
                                              onChange={(e) => {
                                                if (id) {
                                                  setSupplierData(
                                                    (prevData) => ({
                                                      ...prevData,
                                                      mobileNo: e.target.value,
                                                      updateBy: updatebyUser,
                                                      updateDate: new Date(),
                                                    })
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `detailsData.${index}.mobileNo`,
                                                    e.target.value
                                                  );
                                                }
                                              }}
                                            />
                                            <br />
                                            {id
                                              ? ""
                                              : touched.detailsData?.[index]
                                                  ?.mobileNo &&
                                                errors.detailsData?.[index]
                                                  ?.mobileNo && (
                                                  <div className="text-danger">
                                                    {
                                                      errors.detailsData[index]
                                                        .mobileNo
                                                    }
                                                  </div>
                                                )}
                                          </div>

                                          <div>
                                            <label htmlFor="conatctPerson">
                                              Contact Person
                                            </label>
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.contactPerson`}
                                              placeholder="Contact Person"
                                              value={
                                                id
                                                  ? supplierData?.contactPerson
                                                  : detail?.contactPerson
                                              }
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                                height: "38px",
                                                marginBottom: "5px",
                                              }}
                                              onChange={(e) => {
                                                if (id) {
                                                  setSupplierData(
                                                    (prevData) => ({
                                                      ...prevData,
                                                      contactPerson:
                                                        e.target.value,
                                                      updateBy: updatebyUser,
                                                      updateDate: new Date(),
                                                    })
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `detailsData.${index}.contactPerson`,
                                                    e.target.value
                                                  );
                                                }
                                              }}
                                            />
                                            <br />
                                            {id
                                              ? ""
                                              : touched.detailsData?.[index]
                                                  ?.contactPerson &&
                                                errors.detailsData?.[index]
                                                  ?.contactPerson && (
                                                  <div className="text-danger">
                                                    {
                                                      errors.detailsData[index]
                                                        .contactPerson
                                                    }
                                                  </div>
                                                )}
                                          </div>
                                        </div>

                                        <div className="col-md-12 col-lg-6 col-xl-6">
                                          <div className="mb-2">
                                            <label htmlFor="conatctPerson">
                                              Bin Number
                                            </label>
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.binNo`}
                                              placeholder="Bin Number"
                                              value={
                                                id
                                                  ? supplierData?.binNo
                                                  : detail?.binNo
                                              }
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                                height: "38px",
                                              }}
                                              onChange={(e) => {
                                                if (id) {
                                                  setSupplierData(
                                                    (prevData) => ({
                                                      ...prevData,
                                                      binNo: e.target.value,
                                                      updateBy: updatebyUser,
                                                      updateDate: new Date(),
                                                    })
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `detailsData.${index}.binNo`,
                                                    e.target.value
                                                  );
                                                }
                                              }}
                                            />
                                            <br />
                                            {id
                                              ? ""
                                              : touched.detailsData?.[index]
                                                  ?.binNo &&
                                                errors.detailsData?.[index]
                                                  ?.binNo && (
                                                  <div className="text-danger">
                                                    {
                                                      errors.detailsData[index]
                                                        .binNo
                                                    }
                                                  </div>
                                                )}
                                          </div>

                                          <div className="mb-2">
                                            <label htmlFor="tradeLicenceNo">
                                              Trade Licence No
                                            </label>
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.tradeLicenceNo`}
                                              placeholder="Trade Licence No"
                                              value={
                                                id
                                                  ? supplierData?.tradeLicenceNo
                                                  : detail?.tradeLicenceNo
                                              }
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                                height: "38px",
                                              }}
                                              onChange={(e) => {
                                                if (id) {
                                                  setSupplierData(
                                                    (prevData) => ({
                                                      ...prevData,
                                                      tradeLicenceNo:
                                                        e.target.value,
                                                      updateBy: updatebyUser,
                                                      updateDate: new Date(),
                                                    })
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `detailsData.${index}.tradeLicenceNo`,
                                                    e.target.value
                                                  );
                                                }
                                              }}
                                            />
                                            <br />
                                            {id
                                              ? ""
                                              : touched.detailsData?.[index]
                                                  ?.tradeLicenceNo &&
                                                errors.detailsData?.[index]
                                                  ?.tradeLicenceNo && (
                                                  <div className="text-danger">
                                                    {
                                                      errors.detailsData[index]
                                                        .tradeLicenceNo
                                                    }
                                                  </div>
                                                )}
                                          </div>

                                          <div className="mb-2">
                                            <label htmlFor="tradeLicenceNo">
                                              TIN Number
                                            </label>
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.tinNo`}
                                              placeholder="Tin No"
                                              value={
                                                id
                                                  ? supplierData?.tinNo
                                                  : detail?.tinNo
                                              }
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                                height: "38px",
                                              }}
                                              onChange={(e) => {
                                                if (id) {
                                                  setSupplierData(
                                                    (prevData) => ({
                                                      ...prevData,
                                                      tinNo: e.target.value,
                                                      updateBy: updatebyUser,
                                                      updateDate: new Date(),
                                                    })
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `detailsData.${index}.tinNo`,
                                                    e.target.value
                                                  );
                                                }
                                              }}
                                            />
                                            <br />
                                            {id
                                              ? ""
                                              : touched.detailsData?.[index]
                                                  ?.tinNo &&
                                                errors.detailsData?.[index]
                                                  ?.tinNo && (
                                                  <div className="text-danger">
                                                    {
                                                      errors.detailsData[index]
                                                        .tinNo
                                                    }
                                                  </div>
                                                )}
                                          </div>

                                          <div className="mb-2">
                                            {" "}
                                            <label htmlFor="address">
                                              Address
                                            </label>
                                            <textarea
                                              type="textarea"
                                              name={`detailsData.${index}.address`}
                                              placeholder="Address"
                                              value={
                                                id
                                                  ? supplierData?.address
                                                  : detail?.address
                                              }
                                              rows="4"
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "100%",
                                                borderRadius: "5px",
                                              }}
                                              onChange={(e) => {
                                                if (id) {
                                                  setSupplierData(
                                                    (prevData) => ({
                                                      ...prevData,
                                                      address: e.target.value,
                                                      updateBy: updatebyUser,
                                                      updateDate: new Date(),
                                                    })
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `detailsData.${index}.address`,
                                                    e.target.value
                                                  );
                                                }
                                              }}
                                            />
                                            {id
                                              ? ""
                                              : touched.detailsData?.[index]
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
                                          </div>
                                        </div>
                                      </div> 
                                      <div className="col-md-12 mt-3">
                                        <div className="d-flex justify-content-center">
                                          <button
                                            type="submit"
                                            form="itemcreation-form"
                                            className="border-0 "
                                            style={{
                                              backgroundColor: id
                                                ? "#2DDC1B"
                                                : isValid && dirty
                                                ? "#2DDC1B"
                                                : "gray",
                                              color: "white",
                                              padding: "5px 10px",
                                              fontSize: "14px",
                                              borderRadius: "5px",
                                              width: "25%",
                                            }}
                                            disabled={
                                              id ? false : !(isValid && dirty)
                                            }
                                          >
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              : null}
                            {/* </tbody>
                              </table> */}
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

export default InsertSupplierInformation;
