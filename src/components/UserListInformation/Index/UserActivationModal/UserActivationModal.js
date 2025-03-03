import React, { useEffect, useState } from "react";
import "./UserActivationModal.css";
import {
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "../../../../redux/features/user/userApi";
import swal from "sweetalert";
import getMakebyUser from "../../../Common/CommonMakeUser/CommonMakingUser";
const UserActivationModal = ({ userId }) => {
  const { data: singleUser } = useGetSingleUserQuery(userId);
  const [updateData] = useUpdateUserMutation();
  const [updateUserStatus, setUpdateUserStatus] = useState([]);

  useEffect(() => {
    setUpdateUserStatus(singleUser);
  }, [singleUser]);

  return (
    <div
      className="modal fade"
      id="exampleModalLong"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLongTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">
              User Information
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <ul className="list-group rounded-4">
              <li className="list-group-item active">User Information</li>
              <div className="mt-4 overflow-scroll">
                <table className="table">
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
                          className="form-control bg-light text-center"
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
                          className="form-control bg-light text-center"
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
                          className="form-control bg-light text-center"
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
                          onClick={async (e) => {
                            const { checked } = e.target;

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
          <div className="modal-footer">
            <button
              type="button"
              className="btn"
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
              className="btn"
              data-dismiss="modal"
              style={{
                background: "#2DDC1B",
                color: "white",
                fontSize: "16px",
                borderRadius: "10px",
                textTransform: "uppercase",
              }}
              onClick={async() => {
               const response= await updateData(updateUserStatus);
          
               if(response.data.success === true){
                swal("Done", `${response.data.message}`, "success");
               }
               else{
                swal("Sorry!", `${response.data.message}`, "error");
               }
               
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
