import React, { useEffect, useState } from "react";
import { useGetAllUserQuery } from "../../../../redux/features/user/userApi";
import { useNavigate } from "react-router-dom";
import PurchaseOrderApproveForm from "./PurchaseOrderApproveForm";

const PurchaseStatusList = () => {
  const clickhandler = (name) => console.log("delete", name);
  const { data: user, isLoading: isUserLoading } =
    useGetAllUserQuery(undefined);

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
              if (subMenu?.label === "Purchase Order") {
                // Find the "User List" sub-item
                const userListSubMenu = subMenu?.items.find(
                  (subItem) => subItem?.label === "PO Approval"
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

  // if (isUserLoading) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center">
  //       <button
  //         className="btn"
  //         style={{ backgroundColor: "#2DDC1B", color: "white" }}
  //         type="button"
  //         disabled
  //       >
  //         <span
  //           className="spinner-grow spinner-grow-sm"
  //           role="status"
  //           aria-hidden="true"
  //         ></span>
  //         Loading...
  //       </button>
  //     </div>
  //   );
  // }
  return (
    <div>
      <PurchaseOrderApproveForm permission={permission} />
    </div>
  );
};

export default PurchaseStatusList;
