import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import {
  useGetAllUserQuery,
  useUpdateUserPasswordMutation,
} from "../../redux/features/user/userApi";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import "./ChangePasswordModal.css";

const ChangePasswordModal = ({
  menuListData,
  singleUserData,
  setSingleUserData,
  resetPassword,
  changePassword,
}) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const navigate = useNavigate();
  const [updateUserPassword] = useUpdateUserPasswordMutation();
  const queryParams = new URLSearchParams(window.location.search);
  const reset = queryParams.get("reset");
  const change = queryParams.get("change");
  const { data: users } = useGetAllUserQuery(undefined);

  const userIdForChangePassowrd = queryParams.get("userId");

  useEffect(() => {
    const filteredUser = users?.filter(
      (user) => user._id == userIdForChangePassowrd
    );
    if (!userIdForChangePassowrd) {
      setSingleUserData(menuListData);
    } else {
      setSingleUserData(filteredUser);
    }
  }, [setSingleUserData, userIdForChangePassowrd, users]);

  const handleChangePassword = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (!userIdForChangePassowrd) {
      setSingleUserData((prev) => {
        const temp_data = prev;
        console.log(temp_data);
        temp_data["password"] = value;
        return temp_data;
      });
    } else {
      setSingleUserData((prev) => {
        const temp_data = [...prev];
        console.log(temp_data[0]);
        if (temp_data[0]) {
          temp_data[0] = { ...temp_data[0], password: value };
        }
        return temp_data;
      });
    }
  };

  const handleSaveChangePassword = async (e) => {
    e.preventDefault();
    try {

      if(!userIdForChangePassowrd){
        const response = await updateUserPassword(singleUserData);
        if (response.data.status === "success") {
          swal("Done", `${response.data.message}`, "success");
          navigate("/");
          localStorage.clear()
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      }
      else{
        const response = await updateUserPassword(singleUserData[0]);
        if (response.data.status === "success") {
          swal("Done", `${response.data.message}`, "success");
          navigate("/main-view/user-setting");
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      }
  
    } catch (error) {
      console.error("Error updating password:", error); // Handle any errors
    }
  };

  return (
    <div
      className="row w-100"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "10%",
      }}
    >
      <div className="col-11 mt-4 p-5">
        <h4
          style={{
            borderBottom: "1px solid gray",
            paddingBottom: "5px",
            color: "#23302C",
            fontWeight: "bold",
          }}
        >
          {reset === "true" ? "Reset Password" : ""}
          {change === "true" ? "Change Password" : ""}
        </h4>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="shadow-lg col-10 card mt-4 p-5 col-sm-8 col-md-8 col-lg-8">
            <Form onSubmit={handleSaveChangePassword}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label style={{ color: "#23302C" }}>
                  New Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  placeholder="Enter password"
                  onChange={(e) => handleChangePassword(e)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label style={{ color: "#23302C" }}>
                  Confirm Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Password"
                  onChange={(e) => handleChangePassword(e)}
                />
                {passwordMismatch && (
                  <p style={{ color: "red" }}>Passwords do not match</p>
                )}
              </Form.Group>

              <div className="d-flex justify-content-between mt-5">
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    backgroundColor: "#2DDC1B",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                  onClick={() => {
                    navigate("/main-view/user-list");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="btn-disabled"
                  disabled={
                    formData.newPassword !== formData.confirmPassword ||
                    formData.newPassword === "" ||
                    formData.confirmPassword === ""
                  }
                  style={{
                    backgroundColor: "#2DDC1B",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
