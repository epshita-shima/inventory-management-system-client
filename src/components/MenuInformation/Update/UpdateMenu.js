import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import {
  useGetAllMenuItemsQuery,
  useGetSingleMenuQuery,
  useUpdateNestedMenuMutation,
  useUpdateSingleProtionMenuMutation,
} from "../../../redux/features/menus/menuApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage, Form, Field, FieldArray, Formik } from "formik";
import "./UpdateMenu.css";
import swal from "sweetalert";
import LoadingSpineer from "../../Common/LoadingSpinner/LoadingSpineer";

const UpdateMenu = () => {
  const ArrayHelperRef = useRef();
  const { id } = useParams();
  const navigate = useNavigate();
  const [singleMenuData, setSingleMenuData] = useState([]);
  const [isUpdateAsChangeParent, setIsUpdateAsChangeParent] = useState(false);
  const [masterMenuData, setMasterMenuData] = useState([]);
  const { data: singleMenu } = useGetSingleMenuQuery(id);
  const [updateSingleMenus] = useUpdateNestedMenuMutation();
  const [updateSingleMenu] = useUpdateSingleProtionMenuMutation();
  const [isToggled, setIsToggled] = useState(false);
  const { data: menuItems,isMenuloading } = useGetAllMenuItemsQuery();

  const parentMenuFunction = (options) => {
    const parentMenuRecursive = (options, parentLabel) => {
      let result = [];
      options?.forEach((option) => {
        if (option.isParent == true) {
          result.push({
            value: option._id,
            label: option.label,
          });
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
  const parentMenuOptions = parentMenuFunction(menuItems);

  const menuTypeOptions = [
    { value: "child", label: "Child" },
    { value: "parent", label: "Parent" },
  ];

  useEffect(() => {
    const updatedSingleData = (data) => {
      const matchedData = data?.items?.find((items) => {
        if (items._id == id) {
          console.log("checked");
        } else {
          if (items.items.length > 0) {
            const matchingChild = items.items.find((x) => x._id == id);
            console.log(matchingChild);
            return matchingChild;
          }
        }
      });
      console.log(matchedData);
      if (matchedData?.items?.length > 0) {
        return matchedData;
      }
      return data;
    };

    const tableUpdatedData = updatedSingleData(singleMenu);
    console.log(JSON.stringify(tableUpdatedData));
    setSingleMenuData(tableUpdatedData);
  }, [id, singleMenu]);

  useEffect(() => {
    setMasterMenuData(singleMenu);
  }, [singleMenu]);

  useEffect(() => {
    setMasterMenuData((prevMasterData) => {
      const itemExists = prevMasterData?.items?.some(
        (item) => item._id === singleMenuData._id
      );
      console.log(itemExists);
      if (!itemExists) {
        return singleMenuData;
      } else {
        return {
          ...prevMasterData,
          items: prevMasterData?.items?.map((item) => {
            if (item._id === singleMenuData._id) {
              return { ...singleMenuData };
            } else {
              return item;
            }
          }),
        };
      }
    });
  }, [singleMenuData]);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const removeItem = (index) => {
    setSingleMenuData((prev) => {
      const temp__details = [...prev.items];
      if (temp__details.length > 1) temp__details.splice(index, 1);
      return {
        ...prev,
        items: [...temp__details],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdateAsChangeParent) {
      console.log(masterMenuData);
      const response = await updateSingleMenus({ masterMenuData, singleMenu });
      console.log(response);
      if (response.data.status === 200) {
        swal("Done", "Data Update Successfully", {
          icon: "success",
        });
        navigate("/main-view/menu-list");
      } else {
        swal("Error", "An error occurred while creating the data", "error");
      }
    } else {
console.log(masterMenuData)
      const response = await updateSingleMenu(masterMenuData);
      if (response.data.status === 200) {
        swal("Done", "Data Update Successfully", {
          icon: "success",
        });
        navigate("/main-view/menu-list");
      } else {
        swal("Error", "An error occurred while creating the data", "error");
      }
    }
  };

  return (
    <div
      className="container-fluid usercreation-table"
      style={{
        overflowY: "scroll",
        height: "500px",
      }}
    >
      {
        <LoadingSpineer isLoading={isMenuloading}></LoadingSpineer>
      }
      <div class="container overflow-hidden">
        <div className="shadow-lg mt-2 mt-sm-5 mt-md-5 mt-lg-5 p-5 rounded-4">
          <div className="d-flex justify-content-between align-items-center ">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon
                style={{
                  fontSize: "14px",
                  color: "#fff",
                  backgroundColor: "#00B987",
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
                Update Menu
              </span>
            </div>
          </div>
          <div>
            <div className="d-flex justify-content-between align-items-center w-75">
              <div className="w-50 mt-4">
                <label htmlFor="">Parent Name</label>
                <Select
                  class="form-select"
                  className="mb-3 mt-1"
                  aria-label="Default select example"
                  name="itemType"
                  options={parentMenuOptions}
                  value={parentMenuOptions?.find(
                    (x) => x.value === singleMenuData?._id
                  )}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#fff" : "#fff",
                      border: "1px solid #00B987",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#CBF3F0",
                      primary: "#00B987",
                    },
                  })}
                  onChange={(e) => {
                    console.log(e);
                    if (e.value === singleMenu._id) {
                      setIsUpdateAsChangeParent(false);
                    } else {
                      setIsUpdateAsChangeParent(true);
                    }
                    const updatedItems = singleMenuData.items.map((item) => {
                      return {
                        ...item,
                        trackId: e.value, // replace this with the new trackId value
                      };
                    });
                    setSingleMenuData((prev) => ({
                      ...prev, // Copy previous state
                      _id: e.value, // Update _id property with new value
                      label: e.label,
                      items: updatedItems,
                    }));
                    console.log(e.value);
                    // setChangingParentId(e.value);

                    // setSingleMenuData((prev) => ({
                    //   ...prev, // Copy previous state

                    // }));
                  }}
                ></Select>
              </div>
              <div className=" mt-4" style={{ width: "40%" }}>
                <label htmlFor="">Menu Type</label>
                <Select
                  class="form-select"
                  className="mb-3 mt-1"
                  aria-label="Default select example"
                  name="menuType"
                  options={menuTypeOptions}
                  isDisabled={singleMenuData?.items?.length > 0 ? true : false}
                  value={menuTypeOptions?.find(
                    (x) =>
                      x.value ===
                      `${
                        singleMenuData?.isParent === true ? "parent" : "child"
                      }`
                  )}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#fff" : "#fff",
                      border: "1px solid #00B987",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#CBF3F0",
                      primary: "#00B987",
                    },
                  })}
                  onChange={(e) => {
                    console.log(e);
                    if (e.value === "child") {
                      setSingleMenuData((prev) => ({
                        ...prev, // Copy previous state
                        isParent: false, // Update _id property with new value
                      }));
                    } else {
                      setSingleMenuData((prev) => ({
                        ...prev, // Copy previous state
                        isParent: true, // Update _id property with new value
                      }));
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
              style={{
                backgroundColor: "#00B987",
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
                backgroundColor: "#0A203F",
                color: "white",
                padding: "5px 10px",
                fontSize: "14px",
                borderRadius: "5px",
                marginLeft: "5px",
              }}
              onClick={() => {
                setSingleMenuData((prev) => {
                  const temp__details = [...prev.items];
                  temp__details.push({
                    label: "",
                    url: "",
                    permissions: [],
                    trackId: singleMenuData?._id,
                    items: [],
                    isParent: false,
                    isChecked: false,
                    isInserted: false,
                    isRemoved: false,
                    isUpdated: false,
                    isPDF: false,
                  });
                  return {
                    ...prev,
                    items: [...temp__details],
                  };
                });
              }}
            >
              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add Row
            </button>
          </div>
          <div className="mt-3">
            <Formik
              initialValues={{
                // parentmenu: parentMenuName,
                detailsData: [
                  {
                    // menu_type: menuType,
                    menu_name: "",
                  },
                ],
              }}
              onSubmit={(values, formik) => {
                formik.resetForm();
              }}
              render={({ values, setFieldValue }) => (
                <Form
                  id="menucreation-form"
                  onSubmit={(e) => {
                    handleSubmit(e, values);
                  }}
                >
                  <FieldArray
                    name="detailsData"
                    render={(arrayHelpers) => {
                      ArrayHelperRef.current = arrayHelpers;
                      return (
                        <div>
                          <div
                            className=" flex-1 items-center d-flex-nowrap"
                            style={{ height: "250px", overflowY: "auto" }}
                          >
                            <table className="table w-full table-bordered ">
                              <thead className="w-100">
                                <tr>
                                  <th className="bg-white text-center align-middle  ">
                                    Sl
                                  </th>

                                  <th className="bg-white text-center align-middle ">
                                    Menu Type
                                    <span className="text-danger fw-bold fs-2">
                                      *
                                    </span>
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

                              {singleMenuData?.items?.map((detail, index) => {
                                return (
                                  <tbody>
                                    <tr key={index}>
                                      <td className="bg-white text-center align-middle">
                                        {index + 1}
                                      </td>

                                      <td className="text-center align-middle toggle-part">
                                        <div className="toggle-container">
                                          <div
                                            className={`toggle-button ${
                                              detail.isParent ? "P" : "C"
                                            }`}
                                            onClick={() => {
                                              handleToggle();
                                              setSingleMenuData((prevState) => {
                                                console.log(prevState);
                                                const updatedItems = [
                                                  ...prevState.items,
                                                ]; // Create a new array
                                                updatedItems[index] = {
                                                  ...updatedItems[index],
                                                  isParent: isToggled,
                                                }; // Create a new object for the item with updated label
                                                return {
                                                  ...prevState,
                                                  items: updatedItems,
                                                }; // Return a new object with updated items array
                                              });
                                            }}
                                            style={{ color: "white" }}
                                          >
                                            {detail.isParent ? "P" : "C"}
                                            <div className="toggle-handle" />
                                          </div>
                                        </div>
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
                                          //   name={`detailsData.${index}.menu_name`}
                                          placeholder="Menu Name"
                                          value={detail?.label}
                                          style={{
                                            border: "1px solid #00B987",
                                            padding: "5px",
                                            width: "75%",
                                            borderRadius: "5px",
                                          }}
                                          onChange={(e) => {
                                            setSingleMenuData((prevState) => {
                                              const updatedItems = [
                                                ...prevState.items,
                                              ];
                                              updatedItems[index] = {
                                                ...updatedItems[index],
                                                label: e.target.value,
                                                url:
                                                  "/main-view/" +
                                                  e.target.value
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-"),
                                              };
                                              return {
                                                ...prevState,
                                                items: updatedItems,
                                              };
                                            });
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
                                            removeItem(index);
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
                              })}
                            </table>
                          </div>
                        </div>
                      );
                    }}
                  />
                </Form>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMenu;
