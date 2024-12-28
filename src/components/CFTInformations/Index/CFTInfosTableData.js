import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import CFTInfosList from "./CFTInfoTable/CFTInfosList";
import { useGetAllUserQuery } from "../../../redux/features/user/userApi";
import { useNavigate } from "react-router-dom";
import { useGetAllCFTInfosQuery } from "../../../redux/features/cftinformation/cftInfosApi";

const CFTInfosTableData = () => {
  const clickhandler = (name) => console.log("delete", name);
  const { data: user, isUserloading } = useGetAllUserQuery(undefined);
  const {
    data: cftInfosData,
    isLoading:isCFTInfoloading,
    refetch,
  } = useGetAllCFTInfosQuery(undefined);
  const [permission, setPermission] = useState();
  const navigate = useNavigate();
console.log({cftInfosData})
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
                  (subItem) => subItem?.label === "CFT Info List"
                );
                console.log(userListSubMenu)
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
      console.log(permissions)
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  if (isCFTInfoloading) {
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
      <CFTInfosList
        permission={permission}
        cftInfosData={cftInfosData}
        click={clickhandler}
        refetch={refetch}
      />
      {permission?.isInserted ? (
        <div
          className={`position-absolute`}
          style={{ right: "20%", bottom: "4%", zIndex: "9999" }}
        >
          <div className="">
            <a
              href="/main-view/create-cft-infos"
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

export default CFTInfosTableData;
