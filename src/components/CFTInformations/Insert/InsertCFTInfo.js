import {
  faArrowAltCircleLeft,
  faPlus,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, ErrorMessage, FieldArray, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Select from "react-select";
import { MakeBy } from "./../../Common/ListHeadingModal/MakeByPermission/MakeBy";
import {
  useGetAllCFTInfosQuery,
  useInsertCFTInfoMutation,
} from "../../../redux/features/cftinformation/cftInfosApi";
import "./InsertCFTInfo.css";
import { rawMaterialItemDropdown, rawMaterialItemDropdownForCFT } from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import getMakebyUser from "../../Common/CommonMakeUser/CommonMakingUser";
import '../../../buttonStyle/style.css'

const InsertCFTInfo = () => {
  const navigate = useNavigate();
  const ArrayHelperRef = useRef();
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const { data: itemInfo } = useGetAllRMItemInformationQuery(undefined);
  const [insertCFTInfos, { isLoading }] = useInsertCFTInfoMutation();
  const { data: allCFTInfoData } = useGetAllCFTInfosQuery(undefined);
  const makebyUser = getMakebyUser();

  const rawMaterialItemOptionsForCFT = rawMaterialItemDropdownForCFT(itemInfo);
  console.log(rawMaterialItemOptionsForCFT)
  const initialValues = {
    detailsData: [
      {
        itemId: "",
        cftPerKg: "",
        image: "",
      },
    ],
    openingDate: startDate,
    isActive: true,
    closingDate: null,
    makeBy: makebyUser,
    makeDate: new Date(),
    updateBy: "",
    updateDate: "",
  };

  const handleChange = (setFieldValue, index, newValue) => {
    setFieldValue(`detailsData.${index}.itemId`, newValue);
  };

  const handleSubmit = async (e, values) => {
    e.preventDefault();
    const payload = [
      {
        openingDate: values.openingDate,
        isActive: values.isActive,
        closingDate: values.closingDate,
        makeBy: values.makeBy,
        makeDate: values.makeDate,
        updateBy: values.updateBy,
        updateDate: values.updateDate,
        detailsData: values.detailsData,
      },
    ];

    try {
      const matchData = allCFTInfoData.find((x) => x.isActive == true);
      if (matchData) {
        swal("Not Possible!", "Plase Close the Active CFT", "error");
      } else if (matchData == undefined) {
        const response = await insertCFTInfos(payload);

        if (response.data.status === 200) {
          swal("Done", "Data Save Successfully", "success");
          navigate("/main-view/cft-info-list");
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
    }
  };

  return (
    <div
      className=" row px-4 mx-4"
      style={{
        overflowY: "hidden",
        height: "calc(98vh - 120px)",
      }}
    >
      <div className="overflow-hidden">
        <div className="shadow-lg p-5 rounded-4">
          <div className="d-flex justify-content-between align-items-center ">
            <div className="d-flex align-items-center">
              <span
                style={{
                  color: "#000",
                  fontWeight: "700",
                  letterSpacing: ".5px",
                  fontSize:'20px'
                }}
              >
                Create CFT Info
              </span>
            </div>
            <div>
              <button
               className="customBackToListButton"
                onClick={() => {
                  navigate("/main-view/finish-goods-item-list");
                }}
              >
                <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>{" "}
                Back to ItemList
              </button>
            </div>
          </div>
          <div></div>

          <div className="mt-3">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                detailsData: Yup.array().of(
                  Yup.object().shape({
                    itemId: Yup.string().required("Required"),
                    cftPerKg: Yup.string().required("Required"),
                    // image: Yup.string().required("Required")
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
                  <div className="d-lg-flex justify-content-between align-items-center">
                    <div className="mt-2 mb-4">
                      <label htmlFor="">Opening Date</label>
                      <DatePicker
                        dateFormat="y-MM-dd"
                        className="text-center custom-datepicker ms-2"
                        //   value={isEdit ? updateOpeningStore?.OpeningDate : startDate}
                        calendarClassName="custom-calendar"
                        selected={startDate}
                        required
                        onChange={(startDate) => {
                          if (startDate > new Date()) {
                            swal({
                              title: "Select Valid Date",
                              text: "Date should be equal or earlier than today",
                              icon: "warning",
                              button: "OK",
                            });
                          } else {
                            setStartDate(startDate.toLocaleDateString("en-CA"));
                            setFieldValue(
                              startDate.toLocaleDateString("en-CA")
                            );
                          }
                        }}
                      />
                    </div>
                    <div className="d-flex mt-2 mb-4">
                      <button
                        type="submit"
                        form="itemcreation-form"
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

                      <div
                        className="border-0 "
                        style={{
                          // backgroundColor: "#00B987",
                          backgroundColor: "#2DDC1B",
                          color: "black",
                          padding: "5px 10px",
                          fontSize: "14px",
                          borderRadius: "5px",
                          marginLeft: "5px",
                        }}
                        onClick={() => {
                          ArrayHelperRef.current.push({
                            itemId: "",
                            cftPerKg: "",
                            image: ""
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add
                        Row
                      </div>
                    </div>
                  </div>
                  <FieldArray
                    name="detailsData"
                    render={(arrayHelpers) => {
                      ArrayHelperRef.current = arrayHelpers;
                      const details = values.detailsData;
                      return (
                        <div
                          className=" flex-1 items-center d-flex-nowrap py-2"
                          // style={{height: "calc(75vh - 120px)", overflowY: "auto" }}
                        >
                          <div className="container-fluid">
                            <div className="row justify-content-center">
                              <div className="col-12 col-md-12 col-lg-12 fixed-column py-2">
                                <div className="table-responsive table-responsive-custom">
                                  <table className="table w-full table-bordered">
                                    <thead className="w-100">
                                      <tr>
                                        <th className="bg-white text-center align-middle  ">
                                          Sl
                                        </th>

                                        <th className="bg-white text-center align-middle ">
                                          Item Name
                                          <span className="text-danger fw-bold fs-2">
                                            *
                                          </span>
                                        </th>

                                        <th className="bg-white text-center align-middle ">
                                          CFT Per Kg
                                          <span className="text-danger fw-bold fs-2">
                                            *
                                          </span>
                                        </th>

                                        <th className="bg-white text-center align-middle ">
                                          Upload Image
                                          <span className="text-danger fw-bold fs-2">
                                            *
                                          </span>
                                        </th>
                                        <th className="bg-white text-center align-middle ">
                                          Action
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {details && details.length > 0
                                        ? details.map((detail, index) => {
                                            return (
                                              <tr key={index}>
                                                <td className="text-center align-middle">
                                                  {index + 1}
                                                </td>
                                                <td>
                                                  <div className="w-100 d-flex justify-content-between mt-2">
                                                    <div className="w-100">
                                                      <Select
                                                        class="form-select"
                                                        className="w-100 mb-3"
                                                        aria-label="Default select example"
                                                        name={`detailsData.${index}.itemId`}
                                                        options={
                                                          rawMaterialItemOptionsForCFT
                                                        }
                                                        defaultValue={{
                                                          label: "Select Size",
                                                          value: 0,
                                                        }}
                                                        // value={rawMaterialItemOptions.find(
                                                        //   (x) =>
                                                        //     x.value == values.detailsData[index].sizeId
                                                        // )}
                                                        value={rawMaterialItemOptionsForCFT?.filter(
                                                          function (option) {
                                                            return (
                                                              option.value ===
                                                              values
                                                                .detailsData[
                                                                index
                                                              ].itemId
                                                            );
                                                          }
                                                        )}
                                                        styles={{
                                                          control: (baseStyles, state) => ({
                                                            ...baseStyles,
                                                            width: "100%",
                                                            borderColor: state.isFocused ? "#fff" : "#fff",
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
                                                          handleChange(
                                                            setFieldValue,
                                                            index,
                                                            e.value
                                                          );
                                                        }}
                                                      ></Select>

                                                      {touched.detailsData?.[
                                                        index
                                                      ]?.sizeId &&
                                                        errors.detailsData?.[
                                                          index
                                                        ]?.sizeId && (
                                                          <div className="text-danger">
                                                            {
                                                              errors
                                                                .detailsData[
                                                                index
                                                              ].sizeId
                                                            }
                                                          </div>
                                                        )}
                                                    </div>
                                                    <div className="ms-2 mt-2">
                                                      <FontAwesomeIcon
                                                        className="border align-middle text-center p-2 fs-3 rounded-5 text-light "
                                                        style={{
                                                          background: "#2DDC1B",
                                                        }}
                                                        icon={faPlus}
                                                        data-toggle="modal"
                                                        data-target="#exampleModal1"
                                                      />
                                                    </div>
                                                  </div>
                                                </td>

                                                <td className="text-center align-middle">
                                                  <Field
                                                    type="text"
                                                    name={`detailsData.${index}.cftPerKg`}
                                                    placeholder="CFT Per Kg"
                                                    value={detail?.cftPerKg}
                                                    style={{
                                                      border:
                                                        "1px solid #2DDC1B",
                                                      padding: "4px",
                                                      width: "95%",
                                                      height: "38px",
                                                      borderRadius: "5px",
                                                      textAlign: "center",
                                                    }}
                                                    onClick={(e) => {
                                                      setFieldValue(
                                                        `detailsData.${index}.cftPerKg`,
                                                        e.target.value
                                                      );
                                                    }}
                                                  />
                                                  <br />
                                                  <span className="text-danger">
                                                    <ErrorMessage
                                                      name={`detailsData.${index}.menu_name`}
                                                    />
                                                  </span>
                                                </td>
                                                <td className="text-center d-flex justify-content-center align-items-center border-0">
                                                  <input
                                                    type="file"
                                                    name={`detailsData[${index}].image`}
                                                    onChange={(event) => {
                                                      setFieldValue(
                                                        `detailsData[${index}].image`,
                                                        event.currentTarget
                                                          .files[0]
                                                      );
                                                    }}
                                                  />
                                                  <br />
                                                  <span className="text-danger">
                                                    <ErrorMessage
                                                      name={`detailsData.${index}.image`}
                                                    />
                                                  </span>
                                                </td>
                                                <td className="text-center align-middle">
                                                  <button
                                                    type="button"
                                                    className=" border-0 rounded  bg-transparent"
                                                    onClick={() => {
                                                      arrayHelpers.remove(
                                                        index,
                                                        1
                                                      );
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faXmarkCircle}
                                                      className="text-danger fs-1"
                                                    ></FontAwesomeIcon>
                                                  </button>
                                                </td>
                                              </tr>
                                            );
                                          })
                                        : null}
                                    </tbody>
                                  </table>
                                </div>
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
    </div>
  );
};

export default InsertCFTInfo;
