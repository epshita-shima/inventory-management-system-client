import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Formik, Form, FieldArray } from "formik";
import React, { useRef, useState } from "react";
import swal from "sweetalert";
import * as Yup from "yup";
import { useInsertItemUnitMutation } from "../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import getMakebyUser from "../../Common/CommonMakeUser/CommonMakingUser";

const InsertUnitInfoModal = () => {
  const ArrayHelperRef = useRef();
  const [existingUserRoles, setExistingUserRoles] = useState([]);
  const [unitInfoData, setUnitInfoData] = useState("");
  const [insertunitinfo]=useInsertItemUnitMutation()
  const makebyUser = getMakebyUser();
  const initialValues = {
    detailsData: [
      {
        unitInfo: "",
        makeBy: makebyUser,
        updateBy: null,
        makeDate: new Date(),
        updateDate: null,
      },
    ],
  };

  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();
    if (existingUserRoles.includes(unitInfoData)) {
      alert("This size info already exists!");
      return;
    }
    try {
      const response = await insertunitinfo(values.detailsData);

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
      className="modal fade"
      id="exampleModal3"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel3"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel3">
              Unit Entry
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body shadow-lg p-5 m-5">
            <div className="d-flex justify-content-end mb-2">
              <button
                className="border-0 "
                style={{
                  // backgroundColor: "#2DDC1B",
                  backgroundColor: "#2DDC1B",
                  color: "black",
                  padding: "5px 10px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  marginLeft: "5px",
                }}
                onClick={() => {
                  ArrayHelperRef.current.push({
                    unitInfo: "",
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
                      unitInfo: Yup.string().required("Required"),
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
                  errors,
                  touched,
                }) => (
                  <Form
                    id="menucreation-form"
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
                                    Unit Info
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
                                              name={`detailsData.${index}.unitInfo`}
                                              placeholder="unit info"
                                              value={detail?.unitInfo}
                                              required
                                              style={{
                                                border: "1px solid #2DDC1B",
                                                padding: "5px",
                                                width: "75%",
                                                borderRadius: "5px",
                                              }}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  "unitInfo",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            <br />
                                            {touched.detailsData?.[index]
                                              ?.unitInfo &&
                                              errors.detailsData?.[index]
                                                ?.unitInfo && (
                                                <div className="text-danger">
                                                  {
                                                    errors.detailsData[index]
                                                      .unitInfo
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
          <div className="modal-footer"></div>
        </div>
      </div>
    </div>
  );
};

export default InsertUnitInfoModal;
