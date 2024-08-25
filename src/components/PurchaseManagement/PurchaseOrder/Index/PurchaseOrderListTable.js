import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import PurchaseOderList from "./PurchaseOderInfoTable/PurchaseOderList";
import { useNavigate } from "react-router-dom";
import { useGetAllUserQuery } from "../../../../redux/features/user/userApi";

const PurchaseOrderListTable = () => {
  const clickhandler = (name) => console.log("delete", name);
  const { data: user, isUserloading } = useGetAllUserQuery(undefined);

  const [permission, setPermission] = useState();
  const navigate = useNavigate();

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

        // Find the user object matching the provided userId
        const currentUser = userData?.find((user) => user._id === userId);
        console.log(currentUser);
        if (currentUser) {
          // Loop through the menus of the current user
          currentUser?.menulist?.forEach((menu) => {
            menu?.items?.forEach((subMenu) => {
              // Check if the subMenu is the "User Profile" menu
              if (subMenu?.label === subMenu?.label) {
                // Find the "User List" sub-item
                const userListSubMenu = subMenu?.items?.find(
                  (subItem) => subItem?.label === "PO List"
                );
                console.log(userListSubMenu);
                if (userListSubMenu) {
                  // Set the user list property
                  userList = userListSubMenu;
                }
              }
            });
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
      <PurchaseOderList
        permission={permission}
        click={clickhandler}
      ></PurchaseOderList>
      {permission?.isInserted ? (
        <div
          className={`position-absolute`}
          style={{ right: "15%", bottom: "4%", zIndex: "9999" }}
        >
          <div className="">
            <a
              href="/main-view/create-po"
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

export default PurchaseOrderListTable;
