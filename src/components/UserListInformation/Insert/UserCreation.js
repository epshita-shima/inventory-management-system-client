/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  faArrowAltCircleLeft,
  faExclamationCircle,
  faPlus,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import Select from "react-select";
import "./UserCreation.css";
import UserRoleEntryModal from "../../UserRoleInformation/Insert/UserRoleEntryModal";
import { useGetUserRoleQuery } from "../../../redux/features/userrole/userroleApi";
import { useGetAllMenuItemsQuery } from "../../../redux/features/menus/menuApi";

import { useCreateUserMutation } from "../../../redux/features/user/userApi";
import swal from "sweetalert";
import TreeView from "./TreeView";

import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateSerialNoMutation,
  useGetSerialNoQuery,
} from "../../../redux/features/serialgenerate/serialApi";
import getMakebyUser from "../../Common/CommonMakeUser/CommonMakingUser";
import "../../../buttonStyle/style.css";

const UserCreation = () => {
  const { id } = useParams();
  var [isUpdate] = useState(id ? true : false);
  const [clickedCheckboxes, setClickedCheckboxes] = useState([]);

  const [serialValue, setSerialValue] = useState([]);

  const {
    data: userRoleData,
    isError: userRoleIsError,
    isLoading: userRoleIsLoading,
  } = useGetUserRoleQuery();
  const {
    data: menuItems,
    isError: menuItemsIsError,
    isLoading: menuItemsIsLoading,
  } = useGetAllMenuItemsQuery();

  const { data: serialNo, refetch: serialRefetch } =
    useGetSerialNoQuery(undefined);
  const [createSerialNo] = useCreateSerialNoMutation();
  const [createNewUser] = useCreateUserMutation();
  const navigate = useNavigate();
  const makebyUser = getMakebyUser();

  useEffect(() => {
    if (serialNo && serialNo.length > 0) {
      const maxSerialNoObject = serialNo?.reduce((max, current) => {
        return current.serialNo > max.serialNo ? current : max;
      });
      setSerialValue(maxSerialNoObject);
    }
  }, [serialNo]);

  const [password, setPassword] = useState("LC00");
  const [validated, setValidated] = useState(false);
  const parentIds = [];
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    mobileNo: "",
    password: "LC00",
    hashPassword: "LC00",
    roleId: "",
    username: "",
    isactive: true,
    menulist: [],
  });

  useEffect(() => {
    if (localStorage.length > 0) {
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (menuItemsIsLoading) {
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
  function mergePermissions(mainData, permissionsData) {
    function mergeDropdownPermissions(mainDropdown, permissionsDropdown) {
      if (!mainDropdown || !permissionsDropdown.length === 0) {
        return [];
      }
      return mainDropdown.map((mainItem) => {
        const permissionsItem = permissionsDropdown?.find(
          (permItem) => permItem && permItem._id === mainItem._id
        );
        if (permissionsItem) {
          // Merge permissions for the current items item
          return { ...mainItem, ...permissionsItem };
        }
        if (mainItem.items && permissionsItem && permissionsItem.items) {
          // If items items exist in both datasets, merge permissions recursively
          return {
            ...mainItem,
            items: mergeDropdownPermissions(
              mainItem.items,
              permissionsItem.items
            ),
          };
        }
        return mainItem;
      });
    }

    return mainData?.map((mainItem) => {
      const permissionsItem = permissionsData?.find((permItem) =>
        permItem.parentIds.reduce((acc, key) => {
          return key === mainItem._id;
        }, {})
      );
      if (permissionsItem && mainItem.items && permissionsItem.items) {
        return {
          ...mainItem,
          items: mergeDropdownPermissions(mainItem.items, permissionsItem),
        };
      }
      return mainItem;
    });
  }

  const mergedData = mergePermissions(menuItems, formData?.menulist);

  const mergedArray = mergedData?.map((dataItem) => {
    const mergeCheckboxIntoDropdown = (items, clickedCheckboxes) => {
      return items?.map((item) => {
        const clickedCheckbox = clickedCheckboxes.find(
          (checkbox) => checkbox.childId === item._id
        );
        const isChecked = clickedCheckbox ? clickedCheckbox.isChecked : false;
        const isInserted = clickedCheckbox ? clickedCheckbox.isInserted : false;
        const isUpdated = clickedCheckbox ? clickedCheckbox.isUpdated : false;
        const isPDF = clickedCheckbox ? clickedCheckbox.isPDF : false;
        const del = clickedCheckbox ? clickedCheckbox.isRemoved : false;
        const parentIds = clickedCheckbox ? clickedCheckbox.parentIds : [];
        const trackId = parentIds[1] || parentIds[0] || dataItem._id;
        const id = item._id;
        // Recursively merge checkboxes into nested items
        const mergedItems = mergeCheckboxIntoDropdown(
          item?.items,
          clickedCheckboxes
        );

        const anyChildChecked = mergedItems?.some((child) => child.isChecked);
        const parentIsChecked = anyChildChecked || isChecked || false;

        return {
          ...item,
          trackId,
          isChecked: parentIsChecked,
          isInserted,
          isUpdated,
          isPDF,
          isRemoved: del,
          parentIds,
          id,
          items: mergedItems,
        };
      });
    };

    // Filter clicked checkboxes for the current dataItem
    const clickedCheckboxe = clickedCheckboxes.filter((checkbox) =>
      checkbox.parentIds.includes(dataItem._id)
    );

    // Check if any immediate child item is checked
    const anyImmediateChildChecked = clickedCheckboxe.some(
      (checkbox) => checkbox.isChecked
    );

    // Set the isChecked field for the top parent
    const topParentIsChecked = anyImmediateChildChecked || dataItem.isChecked;

    return {
      ...dataItem,
      isChecked: topParentIsChecked,
      items: mergeCheckboxIntoDropdown(dataItem?.items || [], clickedCheckboxe), // Use empty array if items is undefined
    };
  });

  const filterCheckedItems = (data) =>
    data
      ?.filter((item) => item.isChecked)
      .map((item) => ({
        ...item,
        items: filterCheckedItems(item.items || []),
      }));

  const filteredData = filterCheckedItems(mergedArray);

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const dataWithoutMenulistId = {
      ...formData,
      username: formData.firstname + "-0" + serialValue?.serialNo,
      menulist: filteredData?.map((item) => {
        const { _id, items, ...itemWithoutId } = item;

        const dropdownWithoutIds = items?.map((d) => {
          const { _id, ...dropdownItemWithoutId } = d;
          return {
            ...dropdownItemWithoutId,
            id: _id,
          };
        });

        return {
          ...itemWithoutId,
          id: _id,
          items: dropdownWithoutIds,
        };
      }),
    };
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);

    const serialData = {
      serialNo: serialNo?.serialNo,
      type: "user",
      year: new Date().toLocaleDateString("en-CA"),
      makeby: makebyUser,
      updateby: "",
    };
    // Check if any field is empty
    const isEmpty = Object.values(dataWithoutMenulistId).some(
      (value) => value === "" || value?.length === 0
    );

    if (isEmpty) {
      swal("Not possible", "Please fill up form correctly", "warning");
      return;
    } else {
      const responseSerial = await createSerialNo(serialData);
      const responseUser = await createNewUser(dataWithoutMenulistId);

      if (
        responseSerial.data.status === 201 &&
        responseUser.data?.status === 200
      ) {
        swal("Done", "Data Save Successfully", "success");
        navigate("/main-view/user-list");
        serialRefetch();
      } else {
        swal("Error", "An error occurred while creating the user", "error");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const options = userRoleData?.map(({ _id, userrolename }) => ({
    value: _id,
    label: userrolename,
  }));

  return (
    <div
      className="container-fluid p-0 m-0 usercreation-table"
      style={{
        overflowY: "scroll",
        height: "500px",
      }}
    >
      <div class="container">
        <div className="shadow-lg mt-2 mt-sm-5 mt-md-5 mt-lg-5 p-5 rounded-4">
          <div className="d-flex justify-content-between align-items-center border-bottom">
            <p>
              <FontAwesomeIcon
                style={{ fontSize: "20px", color: "#2DDC1B" }}
                icon={faUserAlt}
              />
              <FontAwesomeIcon
                style={{ fontSize: "14px", color: "#2DDC1B" }}
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
                Add user(s)
              </span>
            </p>

            <button
              className="customBackToListButton"
              onClick={() => {
                navigate("/main-view/user-list");
              }}
            >
              <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>{" "}
              Back to menulist
            </button>

            {/* <p style={{ fontSize: "20px", color: "red" }}>
              <FontAwesomeIcon icon={faExclamationCircle}></FontAwesomeIcon>
            </p> */}
          </div>
          <div className="mt-5">
            <Form validated={validated} onSubmit={handleCreateUser}>
              <div className="d-sm-block d-md-flex d-lg-flex justify-content-between align-items-center">
                <div className="w-100">
                  <div>
                    <Form.Group controlId="formInput">
                      <Form.Control
                        type="text"
                        name="firstname"
                        placeholder="User's first name"
                        className="input-with-bottom-border"
                        value={formData.firstname}
                        onChange={(e) => handleChange(e)}
                        isInvalid={validated && formData.firstname === ""}
                      />
                      <Form.Control.Feedback className="mt-2" type="invalid">
                        Please provide a firstname.
                      </Form.Control.Feedback>
                      {validated && formData.lastname === "" && (
                        <div style={{ height: "0px" }}></div>
                      )}
                    </Form.Group>
                  </div>
                  {/* <div className="">
                  {validated && formData.firstname === '' && <p className="text-danger ">{`Firstname is required.`}</p>}
                  </div> */}
                </div>

                <div className="w-100 ms-sm-2  ms-md-2  ms-lg-2 mt-2 mt-sm-0">
                  <div>
                    <Form.Group controlId="formInput">
                      <Form.Control
                        type="text"
                        name="lastname"
                        placeholder="User's last name"
                        className="input-with-bottom-border"
                        value={formData.lastname}
                        onChange={handleChange}
                        isInvalid={validated && formData.lastname === ""}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a lastname.
                      </Form.Control.Feedback>
                      {validated && formData.lastname === "" && (
                        <div style={{ height: "0px" }}></div>
                      )}
                    </Form.Group>
                  </div>
                </div>
                <div className="w-100 ms-sm-2  ms-md-2  ms-lg-2 mt-2 mt-sm-0">
                  <Form.Group controlId="formInput">
                    <Form.Control
                      type="text"
                      name="mobileNo"
                      placeholder="Mobile no"
                      className="input-with-bottom-border"
                      value={formData.mobileNo}
                      onChange={handleChange}
                      isInvalid={validated && formData.lastname === ""}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a mobile.
                    </Form.Control.Feedback>
                    {/* {validated && formData.lastname === '' && <div style={{ height: '20px' }}></div>} */}
                  </Form.Group>
                </div>
                <div className="w-100 ms-sm-2  ms-md-2  ms-lg-2 mt-2 mt-sm-0">
                  <Form.Group controlId="formInput">
                    <Form.Control
                      type="text"
                      placeholder="Password"
                      className="input-with-bottom-border"
                      value={password}
                      style={{ background: "transparent" }}
                      isInvalid={validated && formData.password === ""}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a password.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="d-flex justify-content-between align-items-center w-100 ms-sm-2  ms-md-2  ms-lg-2 mt-2 mt-sm-0">
                  <div className="w-100">
                    <Select
                      class="form-select"
                      className=" mb-3"
                      aria-label="Default select example"
                      name="itemType"
                      options={options}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: state.isFocused ? "#fff" : "#fff",
                          border: "none",
                          borderBottom: "1px solid #2DDC1B",
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
                      value={options?.find((x) => x.value == formData.roleId)}
                      // style={{ border: "1px solid #2DDC1B" }}
                      // value={typeOption.find((x)=>x.value==itemInformation.itemType)}
                      onChange={(e) => {
                        setFormData({ ...formData, roleId: e.value });
                      }}
                    ></Select>

                    <div className="">
                      {validated && formData.roleId === "" && (
                        <p className="text-danger ">{`User role is required.`}</p>
                      )}
                    </div>
                  </div>
                  <div className="ms-2">
                    <FontAwesomeIcon
                      className="border align-middle text-center p-2 fs-3 rounded-5 text-light"
                      style={{ background: "#2DDC1B" }}
                      icon={faPlus}
                      data-toggle="modal"
                      data-target="#exampleModal"
                    />
                  </div>
                </div>
              </div>
            </Form>
          </div>
          <div className="mt-5">
            <h4 className="fw-bold ">Select Menu</h4>
            {
              <TreeView
                isUpdate={isUpdate}
                data={mergedData}
                // userUPdateData={userUPdateData}
                clickedCheckboxes={clickedCheckboxes}
                setClickedCheckboxes={setClickedCheckboxes}
                parentIds={parentIds}
              />
            }
          </div>
        </div>

        <div className="d-flex justify-content-end mt-5">
          <div className="d-flex justify-content-end">
            <button
              className="btn text-uppercase rounded-4"
              style={{
                border: "1px solid #2DDC1B",
                color: "#2DDC1B",
                fontWeight: "700",
                outline: "none",
              }}
            >
              Reset
            </button>
            &nbsp;&nbsp;&nbsp;
            <button
              className="btn text-uppercase rounded-4"
              style={{
                background: "#2DDC1B",
                color: "#fff",
                fontWeight: "700",
                outline: "none",
                border: "none",
              }}
              onClick={handleCreateUser}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <UserRoleEntryModal></UserRoleEntryModal>
    </div>
  );
};

export default UserCreation;
