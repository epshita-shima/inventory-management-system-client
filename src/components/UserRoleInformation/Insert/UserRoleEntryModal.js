import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import {
  useAddNewUserRoleMutation,
  useGetUserRoleQuery,
} from "../../../redux/features/userrole/userroleApi";
import swal from "sweetalert";

const UserRoleEntryModal = () => {
  const [createUserRole] = useAddNewUserRoleMutation();
  const [existingUserRoles, setExistingUserRoles] = useState([]);
  const { data: userRoles, error, isLoading } = useGetUserRoleQuery(undefined);

  const [userRoleName, setUserRoleName] = useState("");

  useEffect(() => {
    if (userRoles) {
      setExistingUserRoles(userRoles.map((role) => role.name));
    }
  }, [userRoles]);
  const handleUserRoleHandle = () => {
    if (existingUserRoles.includes(userRoleName)) {
      alert("User role already exists!");
      return;
    }
    try {
      // Call the mutation to create a new user role
      const userRoleFormData = {
        makeby: "",
        updateby: "",
        userrolename: userRoleName,
      };

      createUserRole(userRoleFormData);
      swal("Done", "Save Successfully", "success");
      // Clear the input field after successful creation
      setUserRoleName("");
    } catch (error) {
      console.error("Error creating user role:", error);
    }
  };

  return (
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              User Entry
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
            <div className="w-100 ms-2">
              <Form submit={handleUserRoleHandle}>
                <Form.Label htmlFor="inputPassword5" className="text-dark">
                  User Roll
                </Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="User's roll"
                    name="userroll"
                    required
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={userRoleName}
                    onChange={(e) => setUserRoleName(e.target.value)}
                    style={{ border: "1px solid #2DDC1B" ,borderRadius:'5px'}}
                  />
                </InputGroup>
              </Form>
            </div>
          </div>
          <div class="modal-footer">
            <button
              className="btn text-uppercase rounded-4"
              data-dismiss="modal"
              style={{
                border: "1px solid #2DDC1B",
                color: "#2DDC1B",
                fontWeight: "700",
                outline: "none",
              }}
              onClick={()=>setUserRoleName('')}
            >
              Cancle
            </button>
            <button
              className="btn text-uppercase rounded-4"
              style={{
                background: "#2DDC1B",
                color: "#fff",
                fontWeight: "700",
                outline: "none",
                border: "none",
              }}
              onClick={handleUserRoleHandle}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoleEntryModal;
