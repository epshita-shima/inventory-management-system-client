/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  faExclamationCircle,
  faPlus,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import swal from "sweetalert";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleUserQuery,
  useUpdateMultipleUserFieldMutation,
} from "../../../redux/features/user/userApi";
import { useGetUserRoleQuery } from "../../../redux/features/userrole/userroleApi";
import UserRoleEntryModal from "../../UserRoleInformation/Insert/UserRoleEntryModal";
import TreeSingleUserView from "./TreeSingleUserView";
import { useGetAllMenuItemsQuery } from "../../../redux/features/menus/menuApi";

const SingleUserDisplay = () => {
  const { id } = useParams();
  var [isUpdate] = useState(id ? true : false);
  const [singleUserData, setSingleUserData] = useState([]);
  const { data: singleUser, isLoading: singleUSerLoading } =
    useGetSingleUserQuery(id);
  const [updateUser] = useUpdateMultipleUserFieldMutation();
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
  const navigate = useNavigate();
  console.log(JSON.stringify(singleUser));
  console.log(menuItems);
  useEffect(() => {
    setSingleUserData(singleUser);
  }, [singleUser]);

  const [validated, setValidated] = useState(false);
  const parentIds = [];

  useEffect(() => {
    if (localStorage.length > 0) {
    } else {
      navigate("/");
    }
  }, [navigate]);

  const updateDropdownList = (updatedChild, menuList) => {
    return menuList?.map((item) => {
      console.log(item.trackId === updatedChild.parentIds);
      if (item.trackId === updatedChild.parentIds) {
        // If the current item matches the parent ID of the updated child
        console.log("cant find parent");
        return {
          ...item,
          items: updateDropdownListRecursive(updatedChild, item.items),
        };
      } else if (item.items && item.items.length > 0) {
        // If the current item has items items, recursively call updateDropdownList on them
        console.log("cant find drpdown");
        return {
          ...item,
          items: updateDropdownList(updatedChild, item.items),
        };
      }
      return item; // Return unchanged item
    });
  };

  const updateDropdownListRecursive = (updatedChild, dropdownList) => {
    console.log(updatedChild);
    return dropdownList.map((child) => {
      console.log(child, updatedChild);
      if (child.trackId === updatedChild.trackId) {
        // If the current child matches the updated child, update it
        console.log(child);
        console.log(updatedChild);
        return { ...child, ...updatedChild };
      } else if (child.items && child.items.length > 0) {
        // If the current child has items items, recursively call updateDropdownListRecursive on them
        console.log("parent child");
        return {
          ...child,
          items: updateDropdownListRecursive(updatedChild, child.items),
        };
      }
      return child; // Return unchanged child
    });
  };
  const updateMenuItem = (menuItemID, updatedValues) => {
    console.log(menuItemID, updatedValues);
    const updatedMenuList = [...singleUserData.menulist];
    const updatedMenuLists = updateDropdownList(menuItemID, updatedMenuList);
    setSingleUserData((prevList) => {
      return { ...prevList, menulist: updatedMenuLists };
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(singleUserData));
    // try {
    //   await updateUser(singleUserData);
    //   // Data has been successfully updated
    //   swal("Done", "Data Update Successfully", "success");
    //   navigate("/main-view/user-setting");
    // } catch (error) {
    //   // An error occurred while updating data
    //   swal("Not possible", "Try again", "warning");
    // }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // if (isUpdate) {
    //   // if (!(name in singleUserData)) {

    //   //   return;
    //   // }
    //   // setSingleUserData({
    //   //   ...singleUserData,
    //   //   [name]: value,
    //   // });
    // } else {
    //   // if (!(name in formData)) {
    //   //   console.error(`Field "${name}" does not exist in formData state.`);
    //   //   return;
    //   // }
    setSingleUserData({
      ...singleUserData,
      [name]: value,
    });
    // }
  };

  const options = userRoleData?.map(({ _id, userrolename }) => ({
    value: _id,
    label: userrolename,
  }));

  // Example usage:

  return (
    <div
    className="container-fluid p-0 m-0 usercreation-table"
    style={{
      overflowY: "scroll",
      height: "500px",
    }}
    >
      <div class="container">
        <div className="shadow-lg mt-5 p-5 rounded-4">
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
                Update user
              </span>
            </p>
            <p style={{ fontSize: "20px", color: "red" }}>
              <FontAwesomeIcon icon={faExclamationCircle}></FontAwesomeIcon>
            </p>
          </div>
          <div className="mt-5">
            <Form validated={validated} onSubmit={handleUpdateUser}>
              <div className="d-sm-block d-md-flex d-lg-flex justify-content-between align-items-centerd-flex justify-content-between align-items-center">
                <div className="w-100">
                  <div>
                    <Form.Group controlId="formInput">
                      <Form.Control
                        type="text"
                        name="firstname"
                        placeholder="User's first name"
                        className="input-with-bottom-border"
                        value={singleUserData?.firstname}
                        onChange={(e) => handleChange(e)}
                        isInvalid={
                          validated && singleUserData?.firstname === ""
                        }
                      />
                      <Form.Control.Feedback className="mt-2" type="invalid">
                        Please provide a firstname.
                      </Form.Control.Feedback>
                      {validated && singleUserData?.lastname === "" && (
                        <div style={{ height: "0px" }}></div>
                      )}
                    </Form.Group>
                  </div>
                </div>

                <div className="w-100 ms-sm-2  ms-md-2  ms-lg-2 mt-2 mt-sm-0">
                  <div>
                    <Form.Group controlId="formInput">
                      <Form.Control
                        type="text"
                        name="lastname"
                        placeholder="User's last name"
                        className="input-with-bottom-border"
                        value={singleUserData?.lastname}
                        onChange={handleChange}
                        isInvalid={validated && singleUserData?.lastname === ""}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a lastname.
                      </Form.Control.Feedback>
                      {validated && singleUserData?.lastname === "" && (
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
                      value={singleUserData?.mobileNo}
                      onChange={handleChange}
                      isInvalid={validated && singleUserData?.mobileNo === ""}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a mobile.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="w-100 ms-sm-2  ms-md-2  ms-lg-2 mt-2 mt-sm-0">
                  <Form.Group controlId="formInput">
                    <Form.Control
                      type="text"
                      placeholder="Password"
                      className="input-with-bottom-border"
                      value={singleUserData?.password}
                      style={{ background: "transparent" }}
                      isInvalid={validated && singleUserData?.password === ""}
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
                      value={options?.find(
                        (x) => x.value == singleUserData?.roleId
                      )}
                      // style={{ border: "1px solid #00B987" }}
                      // value={typeOption.find((x)=>x.value==itemInformation.itemType)}
                      onChange={(e) => {
                        setSingleUserData({
                          ...singleUserData,
                          // eslint-disable-next-line no-useless-computed-key
                          ["roleId"]: e.value,
                        });
                      }}
                    ></Select>

                    <div className="">
                      {validated && singleUserData.roleId === "" && (
                        <p className="text-danger ">{`User role is required.`}</p>
                      )}
                    </div>
                  </div>
                  <div className=" ms-2">
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
            <h4 className="fw-bold">Select Menu</h4>
            {
              <TreeSingleUserView
                singleUserData={singleUserData?.menulist}
                // singleUserData={menuItems}
                setSingleUserData={setSingleUserData}
                parentIds={parentIds}
                updateMenuItem={updateMenuItem}
                updateDropdownList={updateDropdownList}
              />
            }
          </div>
        </div>

        <div className="d-flex justify-content-end mt-5">
          <div className="d-flex justify-content-end">
            <button
              className="btn text-uppercase rounded-4"
              style={{
                border: "1px solid#2DDC1B",
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
              onClick={handleUpdateUser}
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

export default SingleUserDisplay;
