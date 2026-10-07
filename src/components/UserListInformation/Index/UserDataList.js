import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UserListInfo from "./UserDataTable/UserListInfo";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";

const UserDataList = ({
  setChangePassword,
  setResetPassword,
  resetPassword,
  changePassword,
  setUserIdForChangePassowrd
}) => {
  const clickhandler = (name) => console.log("delete", name);
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.length > 0) {
      const permissions = extractUserMenuListForCurrectMenu("User Setting");
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <UserListInfo
        setChangePassword={setChangePassword}
        setResetPassword={setResetPassword}
        setUserIdForChangePassowrd={setUserIdForChangePassowrd}
        resetPassword={resetPassword}
        changePassword={changePassword}
        permission={permission}
        click={clickhandler}
      />
      {permission?.isInserted ? (
        <div
          className={`position-absolute`}
          style={{ right: "10%", bottom: "4%", zIndex: "9999" }}
        >
          <div className="">
            <a
              href="/main-view/create-user"
              target="_blank"
              className="text-white text-center d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: "#2DDC1B",
                height: "40px",
                width: "40px",
                borderRadius: "50px",
                border:'1px solid #fff'
              }}
            >
              <FontAwesomeIcon
                className="text-white fs-4"
                icon={faPlus}
              ></FontAwesomeIcon>
            </a>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default UserDataList;
