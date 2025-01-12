import React, { useState } from "react";
import "./UserActivationModal.css";
import { useGetSingleUserQuery, useUpdateUserMutation } from "../../../../redux/features/user/userApi";
import swal from "sweetalert";
import getMakebyUser from "../../../Common/CommonMakeUser/CommonMakingUser";
const UserActivationModal = ({userId}) => {
  const { data: singleUser } = useGetSingleUserQuery(userId);
  const [updateData] = useUpdateUserMutation();
  const [ updateUserStatus,setUpdateUserStatus]=useState([])

  return (
    <div
      class="modal fade"
      id="exampleModalLong"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLongTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              User Information
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
          <div class="modal-body">
            <ul class="list-group rounded-4">
              <li class="list-group-item active">User Information</li>
              <div className="mt-4">
                <table class="table">
                  <thead>
                    <tr>
                      <th className="text-center" scope="col">
                        Sl.
                      </th>
                      <th className="text-center" scope="col">
                        Full Name
                      </th>
                      <th className="text-center" scope="col">
                        User Name
                      </th>
                      <th className="text-center" scope="col">
                        Mobile No
                      </th>
                      <th className="text-center" scope="col">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center align-middle">
                      <td className="align-middle">1</td>
                      <td>
                        <input
                          type="text"
                          class="form-control bg-light text-center"
                          placeholder=""
                          aria-label=""
                          readOnly
                          value={singleUser?.firstname}
                          aria-describedby="basic-addon1"
                        />
                        
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control bg-light text-center"
                          placeholder=""
                          aria-label=""
                          value={singleUser?.lastname}
                          readOnly
                          aria-describedby="basic-addon1"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control bg-light text-center"
                          placeholder=""
                          aria-label=""
                          value={singleUser?.mobileNo}
                          readOnly
                          aria-describedby="basic-addon1"
                        />
                      </td>
                      <td className="align-middle ">
                        <input
                          type="checkbox"
                          checked={updateUserStatus?.isactive}
                          aria-label="Checkbox for following text input"
                          onClick={async(e)=>{
                            const {checked}=e.target
                       
                            setUpdateUserStatus((prevData) => ({
                              ...prevData,
                              isactive: checked,
                              updateBy: getMakebyUser(),
                              updateDate: new Date(),
                            }));
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ul>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn"
              data-dismiss="modal"
              style={{
                background: "transparent",
                color: "#2DDC1B",
                fontSize: "16px",
                borderRadius: "10px",
                border: "2px solid #2DDC1B",
                textTransform: "uppercase",
              }}
            >
              Cancle
            </button>
            <button
              type="button"
              class="btn"
              data-dismiss="modal"
              style={{
                background: "#2DDC1B",
                color: "white",
                fontSize: "16px",
                borderRadius: "10px",
                textTransform: "uppercase",
              }}
              onClick={()=>{
               updateData(updateUserStatus);
                swal("Done", "Update Successfully", "success");
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivationModal;
