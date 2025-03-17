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
import "./InserRmItemInfo.css";
import InsertUnitInfoModal from "./../../../UnitInformation/Insert/InsertUnitInfoModal";
import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useNavigate } from "react-router-dom";
import { useGetAllCategoryInfoQuery } from "../../../../redux/features/categoryInfo/categoryInfoApi";
import { useInsertRMItemInformationMutation } from "../../../../redux/features/iteminformation/rmItemInfoApi";
import getMakebyUser from "../../../Common/CommonMakeUser/CommonMakingUser";
import InsertCategoryInformationModal from "../../../CategoryInformation/Update/InsertCategoryInformationModal";
import "../../../../buttonStyle/style.css";
import { categoryInfoConvertSelectOption, itemUnitConvertSelectOption } from "../../../Common/CommonDropdown/CommonDropdown";

const InsertRmItemInfo = () => {
  const ArrayHelperRef = useRef();
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const { data: categoryInfoData } = useGetAllCategoryInfoQuery(undefined);
  const { data: itemUnitData } = useGetAllItemUnitQuery(undefined);
  const [insertRMIteminfoData, { isLoading }] =
    useInsertRMItemInformationMutation();
  const navigate = useNavigate();
  const makebyUser = getMakebyUser();

  const categoryInfoConvertedOptions =
    categoryInfoConvertSelectOption(categoryInfoData);

  const itemUnitConvertedOptions = itemUnitConvertSelectOption(itemUnitData);

  const initialValues = {
    detailsData: [
      {
        categoryId: "",
        itemName: "",
        unitId: "",
        openingStock: "",
        description: "",
        itemStatus: true,
        cftDeclaration: false,
        openingDate: startDate,
        ladgerApproveStatus: false,
        ladgerApproveDate: null,
        vocuherNo: null,
        voucherDate: null,
        makeBy: makebyUser,
        updateBy: null,
        makeDate: new Date(),
        updateDate: null,
      },
    ],
  };

  const itemStatusOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const cftPerDeclerationOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();
    try {
      const response = await insertRMIteminfoData(values.detailsData);
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
    } catch (err) {
      console.error(err);
      swal("Relax!", "An problem occurred while creating the data", "error");
    }
  };

  return (
    <div
      className=" row px-4 mx-4"
      style={{
        height: "calc(98vh - 120px)",
        overflowY: "scroll",
      }}
    >
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
              Create (Raw Material) Item Info
            </span>
          </div>
          <div>
            <button
              className="customBackToListButton"
              onClick={() => {
                navigate("/main-view/raw-material-item-list");
              }}
            >
              <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>{" "}
              Back to ItemList
            </button>
          </div>
        </div>
        <div>
          <div className="text-right"></div>
        </div>

        <div className="mt-3">
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              detailsData: Yup.array().of(
                Yup.object().shape({
                  categoryId: Yup.string().required("Required"),
                  itemName: Yup.string().required("Required"),
                  unitId: Yup.string().required("Required"),
                  openingStock: Yup.string().required("Required"),
                  description: Yup.string().required("Required"),
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
                  <div className="">
                    <label htmlFor="">Opening Stock Date</label>
                    <DatePicker
                      dateFormat="y-MM-dd"
                      className="text-center custom-datepicker ms-lg-2 ms-lg-2"
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
                  <div className="d-sm-block d-lg-flex mt-4 mb-4">
                    <button
                      type="submit"
                      form="itemcreation-form"
                      className="border-0 "
                      style={{
                        backgroundColor: isValid && dirty ? "#2DDC1B" : "gray",
                        color: "white",
                        padding: "5px 10px",
                        fontSize: "14px",
                        borderRadius: "5px",
                        width: "100px",
                      }}
                      disabled={!(isValid && dirty) || isLoading}
                    >
                      {isLoading ? " Saving" : " Save"}
                    </button>
                    <div
                      className="border-0 mt-sm-2 mt-md-2 mt-lg-0 ms-sm-0 ms-lg-2"
                      style={{
                        // backgroundColor: "#00B987",
                        backgroundColor: "#2DDC1B",
                        color: "black",
                        padding: "5px 10px",
                        fontSize: "14px",
                        borderRadius: "5px",
                        width: "100px",
                      }}
                      onClick={() => {
                        ArrayHelperRef.current.push({
                          categoryId: "",
                          itemName: "",
                          unitId: "",
                          openingStock: 0,
                          description: "",
                          itemStatus: true,
                          cftDeclaration: false,
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
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add Row
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
                        style={{
                          maxWidth: "100%",
                          overflowX: "auto",
                          display: "block",
                        }}
                      >
                        <table
                          className="table table-bordered"
                          style={{
                            width: "100%",
                            tableLayout: "fixed",
                            minWidth: "2000px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                className="bg-white text-center align-middle"
                                style={{ width: "5%" }}
                              >
                                Sl
                              </th>

                              <th
                                className="bg-white text-center align-middle"
                                style={{ width: "20%" }}
                              >
                                Category Info
                                <span className="text-danger fw-bold fs-2">
                                  *
                                </span>
                              </th>
                              <th
                                className="bg-white text-center align-middle"
                                style={{ width: "20%" }}
                              >
                                Item Name
                                <span className="text-danger fw-bold fs-2">
                                  *
                                </span>
                              </th>
                              <th
                                className="bg-white text-center align-middle"
                                style={{ width: "15%" }}
                              >
                                Unit
                                <span className="text-danger fw-bold fs-2">
                                  *
                                </span>
                              </th>
                              <th
                                className="bg-white text-center align-middle"
                                style={{ width: "20%" }}
                              >
                                Opening Stock
                                <span className="text-danger fw-bold fs-2">
                                  *
                                </span>
                              </th>
                              <th
                                className="bg-white text-center align-middle"
                                style={{ width: "20%" }}
                              >
                                Item Description
                                <span className="text-danger fw-bold fs-2">
                                  *
                                </span>
                              </th>
                              <th
                                className="bg-white text-center align-middle"
                                style={{ width: "15%" }}
                              >
                                Item Status
                                <span className="text-danger fw-bold fs-2">
                                  *
                                </span>
                              </th>
                              <th
                                className="bg-white text-center align-middle"
                                style={{ width: "15%" }}
                              >
                                CFT per Dcleration
                                <span className="text-danger fw-bold fs-2">
                                  *
                                </span>
                              </th>
                              <th
                                className="bg-white text-center align-middle"
                                style={{ width: "5%" }}
                              >
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
                                      <td className="text-center align-middle">
                                        <div className="d-flex justify-content-between mt-2">
                                          <div className="w-100">
                                            <Select
                                              class="form-select"
                                              className=" mb-3"
                                              aria-label="Default select example"
                                              name="categoryInfo"
                                              options={
                                                categoryInfoConvertedOptions
                                              }
                                              value={categoryInfoConvertedOptions.filter(
                                                (x) =>
                                                  x.value === detail.categoryId
                                              )}
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
                                                  height: "200px",
                                                  overflowY: "scroll",
                                                }),
                                                menuPortal: (base) => ({
                                                  ...base,
                                                  zIndex: 9999,
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
                                              menuPosition="fixed"
                                              menuPortalTarget={document.body}
                                              onChange={(e) => {
                                                setFieldValue(
                                                  `detailsData.${index}.categoryId`,
                                                  e.value
                                                );
                                              }}
                                            ></Select>

                                            {touched.detailsData?.[index]
                                              ?.categoryId &&
                                              errors.detailsData?.[index]
                                                ?.categoryId && (
                                                <div className="text-danger">
                                                  {
                                                    errors.detailsData[index]
                                                      .categoryId
                                                  }
                                                </div>
                                              )}
                                          </div>
                                          <div className="ms-2 mt-2">
                                            <FontAwesomeIcon
                                              className="border align-middle text-center p-2 fs-3 rounded-5 text-light"
                                              style={{
                                                background: "#2DDC1B",
                                              }}
                                              icon={faPlus}
                                              data-toggle="modal"
                                              data-target="#categoryInfoModal"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                      <td className="text-center align-middle">
                                        <Field
                                          type="text"
                                          name={`detailsData.${index}.itemName`}
                                          placeholder="item name"
                                          value={detail?.itemName}
                                          style={{
                                            border: "1px solid #2DDC1B",
                                            padding: "5px",
                                            width: "100%",
                                            borderRadius: "5px",
                                            textAlign: "center",
                                            height: "38px",
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
                                              className=" mb-3"
                                              aria-label="Default select example"
                                              name="unitinfo"
                                              options={itemUnitConvertedOptions}
                                              value={itemUnitConvertedOptions.filter(
                                                (x) => x.value === detail.unitId
                                              )}
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
                                                  height: "200px",
                                                  overflowY: "scroll",
                                                }),
                                                menuPortal: (base) => ({
                                                  ...base,
                                                  zIndex: 9999,
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
                                              menuPosition="fixed"
                                              menuPortalTarget={document.body}
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
                                            padding: "5px",
                                            width: "100%",
                                            borderRadius: "5px",
                                            textAlign: "center",
                                            height: "38px",
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
                                          type="textarea"
                                          name={`detailsData.${index}.description`}
                                          placeholder="description"
                                          value={detail?.description}
                                          style={{
                                            border: "1px solid #2DDC1B",
                                            padding: "5px",
                                            width: "100%",
                                            borderRadius: "5px",
                                            textAlign: "center",
                                            height: "38px",
                                          }}
                                          onClick={(e) => {
                                            setFieldValue(
                                              `detailsData.${index}.description`,
                                              e.target.value
                                            );
                                          }}
                                        />
                                        {touched.detailsData?.[index]
                                          ?.description &&
                                          errors.detailsData?.[index]
                                            ?.description && (
                                            <div className="text-danger">
                                              {
                                                errors.detailsData[index]
                                                  .description
                                              }
                                            </div>
                                          )}
                                      </td>
                                      <td className="text-center align-middle">
                                        {/* <div className="form-check">
                                            <input
                                              type="checkbox"
                                              id="flexCheckDefault"
                                              checked={detail.itemStatus}
                                              onClick={(e) => {
                                                setFieldValue(
                                                  `detailsData.${index}.itemStatus`,
                                                  e.target.checked
                                                );
                                              }}
                                            />
                                          </div> */}
                                        <div className="d-flex justify-content-between mt-2">
                                          <div className="w-100">
                                            <Select
                                              class="form-select"
                                              className=" mb-3"
                                              aria-label="Default select example"
                                              name="categoryInfo"
                                              options={itemStatusOptions}
                                              value={itemStatusOptions.find(
                                                (x) =>
                                                  String(x.value) ===
                                                  String(detail.itemStatus)
                                              )}
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
                                                  height: "90px",
                                                  overflowY: "scroll",
                                                }),
                                                menuPortal: (base) => ({
                                                  ...base,
                                                  zIndex: 9999,
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
                                              menuPosition="fixed"
                                              menuPortalTarget={document.body}
                                              onChange={(e) => {
                                                if (e.value === "true") {
                                                  setFieldValue(
                                                    `detailsData.${index}.itemStatus`,
                                                    true
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `detailsData.${index}.itemStatus`,
                                                    false
                                                  );
                                                }
                                              }}
                                            ></Select>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="text-center align-middle">
                                        <div className="w-100 d-flex justify-content-between mt-2">
                                          <div className="w-100">
                                            <Select
                                              class="form-select"
                                              className=" mb-3"
                                              aria-label="Default select example"
                                              name="unitinfo"
                                              options={cftPerDeclerationOptions}
                                              value={cftPerDeclerationOptions.find(
                                                (x) =>
                                                  String(x.value) ===
                                                  String(detail.cftDeclaration)
                                              )}
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
                                                  height: "80px",
                                                  overflowY: "scroll",
                                                }),
                                                menuPortal: (base) => ({
                                                  ...base,
                                                  zIndex: 9999,
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
                                              menuPosition="fixed"
                                              menuPortalTarget={document.body}
                                              onChange={(e) => {
                                                if (e.value === "true") {
                                                  setFieldValue(
                                                    `detailsData.${index}.cftDeclaration`,
                                                    true
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `detailsData.${index}.cftDeclaration`,
                                                    false
                                                  );
                                                }
                                              }}
                                            ></Select>
                                          </div>
                                        </div>
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
                                  );
                                })
                              : null}
                          </tbody>
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

      <InsertCategoryInformationModal></InsertCategoryInformationModal>
      <InsertUnitInfoModal></InsertUnitInfoModal>
    </div>
  );
};

export default InsertRmItemInfo;
