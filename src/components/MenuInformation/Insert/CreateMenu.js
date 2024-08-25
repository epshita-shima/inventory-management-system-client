import {
  faArrowAltCircleLeft,
  faPlus,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  useGetAllMenuItemsQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
} from "../../../redux/features/menus/menuApi";
import "./CreateMenu.css";
import * as Yup from "yup";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const CreateMenu = () => {
  const { data: menuItems, isMenuloading } = useGetAllMenuItemsQuery();
  const ArrayHelperRef = useRef();
  const [parentMenuName, setParentMenuName] = useState("");
  const [menuType, setMenuType] = useState("");
  const [createMenus] = useCreateMenuMutation();
  const [updateMenu] = useUpdateMenuMutation();
  const navigate = useNavigate();
  const [selectedTopParentValue, setSelectedTopParentValue] = useState(null);
  useEffect(() => {
    if (localStorage.length > 0) {
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (isMenuloading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <button
          class="btn"
          style={{ backgroundColor: "#2DDC1B", color: "white" }}
          type="button"
          disabled
        >
          <span
            class="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Loading...
        </button>
      </div>
    );
  }

  console.log(parentMenuName);

  const menuTypeOptions = [
    { value: "child", label: "Child" },
    { value: "parent", label: "Parent" },
  ];

  const initialValues = {
    parentmenu: parentMenuName,
    detailsData: [
      {
        menu_type: menuType,
        menu_name: "",
      },
    ],
  };
  const parentMenuOptions = (options) => {
    const parentMenuRecursive = (options, parentLabel) => {
      let result = [];
      options?.forEach((option) => {
        if (option.isParent == true) {
          result.push({
            value: option._id,
            label: option.label,
          });
        } else {
          // result.push({
          //   value: option._id,
          //   label: parentLabel ? `${parentLabel} > ${option.label}` : option.label,
          // });
        }
        if (option.items && option.items.length > 0) {
          result = result.concat(
            parentMenuRecursive(option.items, option.label)
          );
        }
      });
      return result;
    };
    return parentMenuRecursive(options);
  };
  const parentOptions = parentMenuOptions(menuItems);
  console.log(parentOptions);

  const flattenOptionsData = (options) => {
    const parentMenuRecursive = (options, parentLabel) => {
      let result = [];
      options?.forEach((option) => {
        if (option.isParent == true) {
          result.push({
            value: option._id,
            label: option.label,
            trackId: option.trackId,
            isParent: option.isParent,
            isInserted: option.isInserted,
            isUpdated: option.isUpdated,
            isPDF: option.isPDF,
            isRemoved: option.isRemoved,
            isChecked: option.isChecked,
            url: option.url,
            permissions: option.permissions,
            children: option.children,
          });
        } else {
        }
        if (option.items && option.items.length > 0) {
          result = result.concat(
            parentMenuRecursive(option.items, option.label)
          );
        }
      });
      return result;
    };
    return parentMenuRecursive(options);
  };
  const flattenedOptionsData = flattenOptionsData(menuItems);

  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();

    const modelMenuInsert = {
      children: [],
      label: parentMenuName.label,
      url: "#",
      permissions: parentMenuName.permissions,
      items: [],
      isParent: parentMenuName.isParent,
      _id: parentMenuName.value,
      trackId: parentMenuName.trackId,
      isInserted: parentMenuName.isInserted,
      isUpdated: parentMenuName.isUpdated,
      isPDF: parentMenuName.isPDF,
      isRemoved: parentMenuName.isRemoved,
      isChecked: parentMenuName.isChecked,
    };

    try {
      values.detailsData.forEach((item) => {
        if (item.menu_name == "") {
          swal("Not Possible!", "Data Not Found", {
            icon: "warning",
          });
          setSelectedTopParentValue(null);
          setMenuType("");
          return;
        } else if (menuType == "child" && parentMenuName.value == undefined) {
          swal("Not possible", "Please select parent name", "warning");
        }
      });

      if (parentMenuName) {
        var errorCount = 0;
        values.detailsData.forEach((item) => {
          if (item.menu_name == "") {
            errorCount++;
          }
          const convertmenuName = item?.menu_name
            .toLowerCase()
            .replace(/\s+/g, "-");

          modelMenuInsert.items.push({
            children: [],
            label: item.menu_name,
            url: `${
              menuType == "parent" ? "#" : `/main-view/${convertmenuName}`
            }`,
            permissions: [],
            items: [],
            trackId: parentMenuName.value,
            isParent: menuType == "parent" ? true : false,
            isInserted: false,
            isUpdated: false,
            isPDF: false,
            isRemoved: false,
            isChecked: false,
          });
        });
        console.log(errorCount);
        console.log(JSON.stringify(modelMenuInsert));
        if (errorCount == 0) {
          try {
            const response = await updateMenu(modelMenuInsert);
            console.log(response.data.status);
            if (response.data.status === 200) {
              swal("Done", "Data Updated Successfully", "success");
              resetForm({
                values: {
                  parentmenu: "",
                  detailsData: [
                    {
                      menu_type: "",
                      menu_name: "",
                    },
                  ],
                },
              });
              setSelectedTopParentValue(null);
              setMenuType("");
            } else {
              swal(
                "Error",
                "An error occurred while updating the data",
                "error"
              );
            }
          } catch (err) {
            console.error(err);
            swal("Error", "An error occurred while updating the data", "error");
          }
        } else {
          swal("Not Possible!", "Data Not Found", {
            icon: "warning",
          });
          setMenuType("");
          setSelectedTopParentValue(null);
        }
      } else {
        values.detailsData.forEach((item) => {
          if (item.menu_name == "") {
            swal("Not Possible!", "Data Not Found", {
              icon: "warning",
            });
            setMenuType("");
            setSelectedTopParentValue(null);
          } else {
            if (menuType == "child" && parentMenuName.value == undefined) {
              swal(
                "Not Possible!",
                "Please select parent name because you are select menu type as a child",
                {
                  icon: "warning",
                }
              );
            } else {
              function convertToMenuItem(data) {
                const { parentmenu, detailsData } = data;
                console.log(detailsData);
                const menuItems = detailsData?.map((item) => {
                  const convertmenuName = item?.menu_name
                    .toLowerCase()
                    .replace(/\s+/g, "-");

                  return {
                    children: [],
                    label: item.menu_name,
                    url: `${
                      menuType == "parent"
                        ? "#"
                        : `/main-view/${convertmenuName}`
                    }`,
                    permissions: [],
                    items: [],
                    isParent: menuType == "parent" ? true : false,
                    isInserted: false,
                    isUpdated: false,
                    isPDF: false,
                    isRemoved: false,
                    isChecked: false,
                  };
                });
                return {
                  parentmenu,
                  menuItems,
                };
              }

              const convertedData = convertToMenuItem(values);
              swal({
                title: "Are you sure these menus are top parent?",
                text: "It will show as a top heading because you did not select any parent.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              }).then(async (willDelete) => {
                if (willDelete) {
                  const response = await createMenus(
                    convertedData.menuItems
                  ).unwrap();
                  console.log(response);
                  if (response.status === 200) {
                    swal("Done", "Data Save Successfully", {
                      icon: "success",
                    });
                    resetForm({
                      values: {
                        parentmenu: "",
                        detailsData: [
                          {
                            menu_type: "",
                            menu_name: "",
                          },
                        ],
                      },
                    });
                    setSelectedTopParentValue(null);
                    setMenuType("");
                  } else {
                    swal(
                      "Error",
                      "An error occurred while creating the data",
                      "error"
                    );
                  }
                } else {
                  swal(" Cancel! Saving data ");
                }
              });
            }
          }
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      swal("Error", "Failed to save data. Please try again later.", "error");
    }
  };

  return (
    <div
      className=" row px-4 mx-4"
      style={{
        height: "calc(98vh - 120px)",
        overflowY: "hidden",
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
                Create Menu
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
                  navigate("/main-view/menu-list");
                }}
              >
                <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>{" "}
                Back to menulist
              </button>
            </div>
          </div>
          <div>
            <div className="d-lg-flex justify-content-between align-items-center w-75">
              <div className="w-lg-100 w-md-100 w-50 mt-4">
                <label htmlFor="">Parent Name</label>
                <Select
                  class="form-select"
                  className="mb-3 mt-1"
                  aria-label="Default select example"
                  name="itemType"
                  options={parentOptions}
                  value={
                    selectedTopParentValue != null
                      ? parentOptions?.find(
                          (x) => x.value === selectedTopParentValue
                        )
                      : ""
                  }
                  onChange={(e) => {
                    setSelectedTopParentValue(e.value);
                    const filterData = flattenedOptionsData.find(
                      (x) => x.value == e.value
                    );
                    console.log(filterData);
                    setParentMenuName(filterData);
                  }}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#fff" : "#fff",
                      border: "1px solid #2DDC1B",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      // primary25: "#CBF3F0",
                      // primary: "#00B987",
                      primary25: "#B8FEB3",
                      primary: "#2DDC1B",
                    },
                  })}
                ></Select>
              </div>
              <div className="mt-4 w-lg-40 w-md-100 w-sm-50">
                <label htmlFor="">Menu Type</label>
                <Select
                  class="form-select"
                  className="mb-3 mt-1"
                  aria-label="Default select example"
                  name="menuType"
                  options={menuTypeOptions}
                  value={
                    menuType !== ""
                      ? menuTypeOptions?.find((x) => x.value === menuType)
                      : null
                  }
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#fff" : "#fff",
                      border: "1px solid #2DDC1B",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#B8FEB3",
                      // primary25: "#CBF3F0",
                      // primary: "#00B987",
                      primary: "#2DDC1B",
                    },
                  })}
                  onChange={(e) => {
                    console.log(e);
                    if (e.value == "child") {
                      setMenuType(e.value);
                    } else {
                      setMenuType(e.value);
                    }
                  }}
                ></Select>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              type="submit"
              form="menucreation-form"
              className="border-0 "
              disabled={menuType == "" && parentMenuName.value == undefined}
              style={{
                backgroundColor: `${
                  menuType === "" && parentMenuName.value === undefined
                    ? "gray"
                    : "#2DDC1B"
                }`,
                color: "white",
                padding: "5px 10px",
                fontSize: "14px",
                borderRadius: "5px",
                width: "100px",
              }}
            >
              Save
            </button>
            <button
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
                  menu_type: menuType,
                  menu_name: "",
                });
              }}
            >
              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add Row
            </button>
          </div>
          <div className="mt-3">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                detailsData: Yup.array().of(
                  Yup.object().shape({
                    menu_type: Yup.string().required("Required"),
                    menu_name: Yup.string().required("Required"),
                  })
                ),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                resetForm({ values: initialValues });
                setSubmitting(false);
              }}
            >
              {({ values, resetForm, setFieldValue, isSubmitting }) => (
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
                        // className=" flex-1 items-center d-flex-nowrap table-responsive-custom"
                        // style={{
                        //   height: "calc(60vh - 120px)",overflowY: "auto" }}
                        >
                          <div class="container-fluid">
                            <div class="row justify-content-center">
                              <div class="col-12 col-md-12 col-lg-12 fixed-column py-2">
                                <div class="table-responsive table-responsive-design">
                                  <table className="table table-bordered">
                                    <thead >
                                      <tr>
                                        <th className="bg-white text-center align-middle  ">
                                          Sl
                                        </th>

                                        <th className="bg-white text-center align-middle ">
                                          Menu Name
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
                                          console.log(detail);
                                          return (
                                            <tbody>
                                              <tr key={index}>
                                                <td className="bg-white text-center align-middle">
                                                  {index + 1}
                                                </td>

                                                <td className="text-center align-middle">
                                                  <Field
                                                    type="text"
                                                    name={`detailsData.${index}.menu_name`}
                                                    placeholder="Parent / Child"
                                                    value={detail?.menu_name}
                                                    style={{
                                                      border:
                                                        "1px solid #2DDC1B",
                                                      padding: "5px",
                                                      width: "75%",
                                                      borderRadius: "5px",
                                                    }}
                                                    onClick={(e) => {
                                                      if (menuType == "") {
                                                        swal(
                                                          "Not possible",
                                                          "Please select menu type",
                                                          "warning"
                                                        );
                                                      } else {
                                                        if (
                                                          menuType == "parent"
                                                        ) {
                                                          setFieldValue(
                                                            `detailsData.${index}.menu_name`,
                                                            e.target.value
                                                          );
                                                          setFieldValue(
                                                            `detailsData.${index}.menu_type`,
                                                            true
                                                          );
                                                        } else {
                                                          setFieldValue(
                                                            `detailsData.${index}.menu_name`,
                                                            e.target.value
                                                          );
                                                          setFieldValue(
                                                            `detailsData.${index}.menu_type`,
                                                            false
                                                          );
                                                        }
                                                      }
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
                                            </tbody>
                                          );
                                        })
                                      : null}
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

export default CreateMenu;
