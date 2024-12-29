import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ProductionInfoList from "./ProductionInfoTable/ProductionInfoList";
import { useNavigate } from "react-router-dom";
import { useGetAllUserQuery } from "../../../redux/features/user/userApi";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";

const ProductionListTable = () => {
  const clickhandler = (name) => console.log("delete", name);
  const { data: user, isUserloading } = useGetAllUserQuery(undefined);

  const [permission, setPermission] = useState();
  const navigate = useNavigate();
  console.log(permission);
  useEffect(() => {
    if (localStorage.length > 0) {
      const getUserId = localStorage.getItem("user");
      const userSingleId = JSON.parse(getUserId);
      const userIdFromSession = userSingleId[0]?._id;
      const permidionData = user?.filter(
        (user) => user._id == userIdFromSession
      );
      const extractUserListForCurrentUser = (userData, userId) => {
        let userList = null;
        const currentUser = userData?.find((user) => user._id === userId);
        console.log(currentUser);
        if (currentUser) {
          currentUser?.menulist?.forEach((menu) => {
            const userListSubMenu = menu?.items?.find(
              (subItem) => subItem?.label === "Production List"
            );
            if (userListSubMenu) {
              userList = userListSubMenu;
            } else {
              menu?.items?.forEach((subMenu) => {
                if (subMenu?.label === subMenu?.label) {
                  const userListSubMenu = subMenu?.items?.find(
                    (subItem) => subItem?.label === "Production List"
                  );
                  console.log(userListSubMenu);
                  if (userListSubMenu) {
                    userList = userListSubMenu;
                  }
                }
              });
            }
          });
        }
        return userList;
      };

      var permissions = extractUserListForCurrentUser(
        permidionData,
        userIdFromSession
      );
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  if (isUserloading) {
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

  return (
    <div>
      <ProductionInfoList permission={permission}></ProductionInfoList>
      {permission?.isInserted ? (
        <div
          className={`position-absolute`}
          style={{ right: "15%", bottom: "4%", zIndex: "9999" }}
        >
          <div className="">
            <a
              href="/main-view/create-production"
              target="_blank"
              className="text-white text-center d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: "#2DDC1B",
                height: "40px",
                width: "40px",
                borderRadius: "50px",
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

export default ProductionListTable;
