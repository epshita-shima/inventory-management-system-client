import {
  faArrowAltCircleLeft,
  faPlus,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import swal from "sweetalert";
import Select from "react-select";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "./InsertFgItemInfo.css";
import InsertItemSizeInfoModal from "../../../SizeInformation/Insert/InsertItemSizeInfoModal";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import InsertUnitInfoModal from "./../../../UnitInformation/Insert/InsertUnitInfoModal";
import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useInsertItemInformationMutation } from "../../../../redux/features/iteminformation/iteminfoApi";
import { useNavigate } from "react-router-dom";
const InsertFgItemInfo = () => {
  const ArrayHelperRef = useRef();
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  // const [selectedSizeValue, setSelectedSizeValue] = useState(null);
  // const [selectedUnitValue, setSelectedUnitValue] = useState(null);
  const { data: itemSize } = useGetAllItemSizeQuery(undefined);
  const { data: itemUnitData } = useGetAllItemUnitQuery(undefined);
  const [insertIteminfo] = useInsertItemInformationMutation();
  const navigate = useNavigate();
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const makebyUser = getUserParse[0].username;

  const itemSizeConvertSelectOption = (options) => {
    let result = [];
    options?.forEach((option) => {
      result.push({
        value: option._id,
        label: option.sizeInfo,
      });
    });
    return result;
  };

  const itemSizeConvertedOptions = itemSizeConvertSelectOption(itemSize);

  const itemUnitConvertSelectOption = (options) => {
    let result = [];
    options?.forEach((option) => {
      result.push({
        value: option._id,
        label: option.unitInfo,
      });
    });
    return result;
  };

  const itemUnitConvertedOptions = itemUnitConvertSelectOption(itemUnitData);

  const initialValues = {
    detailsData: [
      {
        itemName: "",
        sizeId: "",
        unitId: "",
        openingStock: "",
        itemStatus: true,
        productionQtyPerBatch: '',
        openingDate: startDate,
        ladgerApproveStatus: false,
        ladgerApproveDate: null,
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
  const handleChange = (setFieldValue, index, newValue) => {
    setFieldValue(`detailsData.${index}.sizeId`, newValue);
  };
  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();
    console.log(values.detailsData);
    resetForm();
    try {
      const response = await insertIteminfo(values.detailsData);
      if (response.data.status === 200) {
        swal("Done", "Data Save Successfully", "success");
        resetForm({
          values: {
            detailsData: [
              {
                itemName: "",
                sizeId: "",
                unitId: "",
                openingStock: "",
                productionQtyPerBatch: ""
              },
            ],
          },
        });
      } else {
        swal(
          "Not Possible!",
          "An problem occurred while creating the data",
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      swal("Relax!", "An problem occurred while creating the data", "error");
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
      <div class="overflow-hidden">
        <div className="shadow-lg p-5 rounded-4">
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
                Create Finish Goods Item Info
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
                    itemName: Yup.string().required("Required"),
                    sizeId: Yup.string().required("Required"),
                    unitId: Yup.string().required("Required"),
                    openingStock: Yup.string().required("Required"),
                    productionQtyPerBatch: Yup.string().required("Required")
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
                      <label htmlFor="">Opening Stock Date</label>
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
                          console.log("ArrayHelperRef ");
                          ArrayHelperRef.current.push({
                            itemName: "",
                            sizeId: "",
                            unitId: "",
                            openingStock: "",
                            openingDate: startDate,
                            itemStatus: true,
                            productionQtyPerBatch: '',
                            ladgerApproveStatus: false,
                            ladgerApproveDate: null,
                            vocuherNo: null,
                            voucherDate: null,
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
                          <div class="container-fluid ">
                            <div class="row justify-content-center">
                              <div class="col-12 col-md-12 col-lg-12 fixed-column py-2">
                                <div
                                  class="table-responsive table-responsive-custom"

                                >
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
                                          Size Info
                                          <span className="text-danger fw-bold fs-2">
                                            *
                                          </span>
                                        </th>
                                        <th className="bg-white text-center align-middle ">
                                          Unit
                                          <span className="text-danger fw-bold fs-2">
                                            *
                                          </span>
                                        </th>
                                        <th className="bg-white text-center align-middle ">
                                          Opening Stock
                                          <span className="text-danger fw-bold fs-2">
                                            *
                                          </span>
                                        </th>

                                        <th className="bg-white text-center align-middle ">
                                          Production Qty(Per Batch)
                                          <span className="text-danger fw-bold fs-2">
                                            *
                                          </span>
                                        </th>
                                        {/* <th className="bg-white text-center align-middle ">
                                  Item Status
                                  <span className="text-danger fw-bold fs-2">
                                    *
                                  </span>
                                </th> */}
                                        <th className="bg-white text-center align-middle ">
                                          Action
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {details && details.length > 0
                                        ? details.map((detail, index) => {
                                          console.log(detail.sizeId);
                                          return (
                                            <tr key={index}>
                                              <td className="text-center align-middle">
                                                {index + 1}
                                              </td>

                                              <td className="text-center align-middle">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.itemName`}
                                                  placeholder="item name"
                                                  value={detail?.itemName}
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "4px",
                                                    width: "95%",
                                                    height: '38px',
                                                    borderRadius: "5px",
                                                    textAlign: 'center'
                                                  }}
                                                  onClick={(e) => {
                                                    setFieldValue(
                                                      `detailsData.${index}.itemName`,
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                                <br />
                                                {touched.detailsData?.[index]
                                                  ?.itemName &&
                                                  errors.detailsData?.[index]
                                                    ?.itemName && (
                                                    <div className="text-danger">
                                                      {
                                                        errors.detailsData[index]
                                                          .itemName
                                                      }
                                                    </div>
                                                  )}
                                              </td>

                                              <td>
                                                <div className="w-100 d-flex justify-content-between mt-2">
                                                  <div className="w-100">
                                                    <Select
                                                      class="form-select"
                                                      className="w-100 mb-3"
                                                      aria-label="Default select example"
                                                      name="sizeinfo"
                                                      options={
                                                        itemSizeConvertedOptions
                                                      }
                                                      defaultValue={{
                                                        label: "Select Size",
                                                        value: 0,
                                                      }}
                                                      // value={itemSizeConvertedOptions.find(
                                                      //   (x) =>
                                                      //     x.value == values.detailsData[index].sizeId
                                                      // )}
                                                      value={itemSizeConvertedOptions.filter(function (option) {
                                                        return option.value === values.detailsData[index].sizeId;
                                                      })}
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
                                                          // height:'200px',
                                                          //  overflowY:'scroll'
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
                                                        handleChange(setFieldValue,
                                                          index,
                                                          e.value)
                                                      }}
                                                    ></Select>

                                                    {touched.detailsData?.[index]
                                                      ?.sizeId &&
                                                      errors.detailsData?.[index]
                                                        ?.sizeId && (
                                                        <div className="text-danger">
                                                          {
                                                            errors.detailsData[index]
                                                              .sizeId
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

                                              <td>
                                                <div className="w-100 d-flex justify-content-between mt-2">
                                                  <div className="w-100">
                                                    <Select
                                                      class="form-select"
                                                      className=" mb-3"
                                                      aria-label="Default select example"
                                                      name="unitinfo"
                                                      options={
                                                        itemUnitConvertedOptions
                                                      }
                                                      defaultValue={{
                                                        label: "Select Unit",
                                                        value: 0,
                                                      }}
                                                      value={itemUnitConvertedOptions.filter(
                                                        (x) =>
                                                          x.value ==
                                                          values.detailsData[index]
                                                            .unitId
                                                      )}
                                                      styles={{
                                                        control: (
                                                          baseStyles,
                                                          state
                                                        ) => ({
                                                          ...baseStyles,
                                                          borderColor: state.isFocused
                                                            ? "#fff"
                                                            : "#fff",
                                                          border: "1px solid #2DDC1B",
                                                        }),
                                                        menu: (provided) => ({
                                                          ...provided,
                                                          zIndex: 9999,
                                                          // height:'200px',
                                                          //  overflowY:'scroll'
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
                                                          `detailsData.${index}.unitId`,
                                                          e.value
                                                        );
                                                      }}
                                                    ></Select>
                                                  </div>
                                                  <div className="ms-2 mt-2">
                                                    <FontAwesomeIcon
                                                      className="border align-middle text-center p-2 fs-3 rounded-5 text-light"
                                                      style={{
                                                        background: "#2DDC1B",
                                                      }}
                                                      icon={faPlus}
                                                      data-toggle="modal"
                                                      data-target="#exampleModal3"
                                                    />
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="text-center align-middle">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.openingStock`}
                                                  placeholder="opening stock"
                                                  value={detail?.openingStock}
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "4px",
                                                    width: "95%",
                                                    height: '38px',
                                                    borderRadius: "5px",
                                                    textAlign: 'center'
                                                  }}
                                                  onClick={(e) => {
                                                    setFieldValue(
                                                      `detailsData.${index}.openingStock`,
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



                                              <td className="text-center align-middle">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.productionQtyPerBatch`}
                                                  placeholder="production qty per batch"
                                                  value={detail?.productionQtyPerBatch}
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "4px",
                                                    width: "95%",
                                                    height: '38px',
                                                    borderRadius: "5px",
                                                    textAlign: 'center'
                                                  }}
                                                  onClick={(e) => {
                                                    setFieldValue(
                                                      `detailsData.${index}.productionQtyPerBatch`,
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                                <br />
                                                <span className="text-danger">
                                                  <ErrorMessage
                                                    name={`detailsData.${index}.productionQtyPerBatch`}
                                                  />
                                                </span>
                                              </td>
                                              {/* <td className="text-center align-middle">
                                          <div class="form-check">
                                            <input
                                              type="checkbox"
                                              id="flexCheckDefault"
                                              name={`detailsData.${index}.itemStatus`}
                                              checked={detail.itemStatus}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  `detailsData.${index}.itemStatus`,
                                                  e.target.checked
                                                );
                                              }}
                                            />
                                          </div>
                                        </td> */}
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
      <InsertItemSizeInfoModal></InsertItemSizeInfoModal>
      <InsertUnitInfoModal></InsertUnitInfoModal>
    </div>
  );
};

export default InsertFgItemInfo;
