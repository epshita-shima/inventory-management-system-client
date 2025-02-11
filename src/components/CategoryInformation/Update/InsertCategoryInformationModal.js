import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import swal from "sweetalert";
import { useInsertCategoryInfoMutation } from "../../../redux/features/categoryInfo/categoryInfoApi";
import getMakebyUser from "../../Common/CommonMakeUser/CommonMakingUser";

const InsertCategoryInformationModal = () => {
  const ArrayHelperRef = useRef();
  const makebyUser = getMakebyUser();
  const [existingUserRoles, setExistingUserRoles] = useState([]);
  const [insertCategoryInfo] = useInsertCategoryInfoMutation();
  const [categoryInfoData, setCategoryInfoData] = useState("");

  const initialValues = {
    detailsData: [
      {
        categoryInfo: "",
        makeBy: makebyUser,
        updateBy: null,
        makeDate: new Date(),
        updateDate: null,
      },
    ],
  };
  
  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();
    if (existingUserRoles.includes(categoryInfoData)) {
      alert("This size info already exists!");
      return;
    }
    try {
      const response = await insertCategoryInfo(values.detailsData);
      if (response.data.status === 200) {
        swal("Done", "Data Save Successfully", "success");
        resetForm();
      } else {
        swal("Error", "An error occurred while creating the data", "error");
      }
    } catch (err) {
      console.error(err);
      swal("Error", "An error occurred while creating the data", "error");
    }
  };

  return (
    <div
      class="modal fade"
      id="categoryInfoModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="categoryInfoModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="categoryInfoModalLabel">
              Category Info Entry
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body shadow-lg p-5 m-5">
            <div className="d-flex justify-content-end mb-2">
              <button
                className="border-0 "
                style={{
                  // backgroundColor: "#2DDC1B",
                  backgroundColor: "#2DDC1B",
                  color: "#fff",
                  padding: "5px 10px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  marginLeft: "5px",
                }}
                onClick={() => {
                  ArrayHelperRef.current.push({
                    categoryInfo: "",
                    makeBy: makebyUser,
                    updateBy: null,
                    makeDate: new Date(),
                    updateDate: null,
                  });
                }}
              >
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add Row
              </button>
            </div>

            <div className="w-100 ms-2">
              <Formik
                initialValues={initialValues}
                validationSchema={Yup.object({
                  detailsData: Yup.array().of(
                    Yup.object().shape({
                      categoryInfo: Yup.string().required("Required"),
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
                }) => (
                  <Form
                    id="categorycreation-form"
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
                            className=" flex-1 items-center d-flex-nowrap"
                            style={{ height: "200px", overflowY: "auto" }}
                          >
                            <table className="table w-full table-bordered">
                              <thead className="w-100">
                                <tr>
                                  <th className="bg-white text-center align-middle  ">
                                    Sl
                                  </th>

                                  <th className="bg-white text-center align-middle ">
                                    Category Info
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
                                ? details.map((detail, index) => {
                                    return (
                                      <tbody>
                                        <tr key={index}>
                                          <td className="bg-white text-center align-middle">
                                            {index + 1}
                                          </td>

                                          <td className="text-center align-middle">
                                            <Field
                                              type="text"
                                              name={`detailsData.${index}.categoryInfo`}
                                              placeholder="category info"
                                              value={detail?.categoryInfo}
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "75%",
                                                borderRadius: "5px",
                                              }}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  "categoryInfo",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            <br />
                                            {touched.detailsData?.[index]
                                              ?.categoryInfo &&
                                              errors.detailsData?.[index]
                                                ?.categoryInfo && (
                                                <div className="text-danger">
                                                  {
                                                    errors.detailsData[index]
                                                      .categoryInfo
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
                        );
                      }}
                    />
                    <div className="text-right mt-4">
                      <button
                        className="btn text-uppercase rounded-4"
                        data-dismiss="modal"
                        style={{
                          border: "1px solid #2DDC1B",
                          color: "#2DDC1B",
                          fontWeight: "700",
                          outline: "none",
                        }}
                      >
                        Cancle
                      </button>
                      <button
                        className="btn text-uppercase rounded-4 ms-4"
                        style={{
                          background: "#2DDC1B",
                          color: "#fff",
                          fontWeight: "700",
                          outline: "none",
                          border: "none",
                        }}
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
  );
};

export default InsertCategoryInformationModal;
