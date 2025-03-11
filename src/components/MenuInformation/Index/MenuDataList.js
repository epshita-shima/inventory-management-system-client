import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import MenuList from "./MenuTableData/MenuList";
import { useNavigate } from "react-router-dom";
import { useGetAllUserQuery } from "../../../redux/features/user/userApi";

const MenuDataList = () => {
  const clickhandler = (name) => console.log("delete", name);
  const { data: user } = useGetAllUserQuery(undefined);

  const [permission, setPermission] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.length > 0) {
      const getUserId = localStorage.getItem("user");
      const userSingleId = JSON.parse(getUserId);
      const userIdFromSession = userSingleId?._id;
      const permidionData = user?.filter(
        (user) => user._id === userIdFromSession
      );
      const extractUserListForCurrentUser = (userData, userId) => {
        let userList = null;

        // Find the user object matching the provided userId
        const currentUser = userData?.find((user) => user._id === userId);

        if (currentUser) {
          // Loop through the menus of the current user
          currentUser?.menulist?.forEach((menu) => {
            menu?.items?.forEach((subMenu) => {
              // Check if the subMenu is the "User Profile" menu
              if (subMenu?.label === "Menu Index") {
                // Find the "User List" sub-item
                const userListSubMenu = subMenu?.items.find(
                  (subItem) => subItem?.label === "Menu List"
                );
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

      var permission = extractUserListForCurrentUser(
        permidionData,
        userIdFromSession
      );
      setPermission(permission);
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <div>
        <MenuList permission={permission} click={clickhandler} />
        {permission?.isInserted && (
          <div
            className={`position-absolute`}
            style={{ right: "20%", bottom: "4%", zIndex: "9999" }}
          >
            <div className="">
              <a
                href="/main-view/create-menu"
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
        )}
      </div>
    </div>
  );
};

export default MenuDataList;
