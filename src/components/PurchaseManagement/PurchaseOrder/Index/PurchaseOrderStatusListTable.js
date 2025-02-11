import React, { useEffect, useState } from "react";
import PurchaseOrderApproveList from "./PurchaseOrderApproveTable/PurchaseOrderApproveList";
import { useGetAllUserQuery } from "../../../../redux/features/user/userApi";
import { useNavigate } from "react-router-dom";
import PurchaseOrderUnapproveList from "./PurchaseOrderUnapproveTable/PurchaseOrderUnapproveList";

const PurchaseOrderStatusListTable = ({
  showPurchaseApproveListData,
  purchaseFilterApproveAllData,
  showPurchaseUnApproveListData,
  purchaseFilterUnApproveAllData,
  setPurchaseFilterUnApproveAllData,
  purchaseInfoData,
  handleApproveData,
  fromDate,
  toDate,
  refetch,
  isPurchaseOrderLoading,
  permission
}) => {
  // const clickhandler = (name) => console.log("delete", name);
  // const { data: user } = useGetAllUserQuery(undefined);

  // const [permission, setPermission] = useState();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (localStorage.length > 0) {
  //     const getUserId = localStorage.getItem("user");
  //     const userSingleId = JSON.parse(getUserId);
  //     const userIdFromSession = userSingleId[0]?._id;
  //     const permidionData = user?.filter(
  //       (user) => user._id === userIdFromSession
  //     );
  //     const extractUserListForCurrentUser = (userData, userId) => {
  //       let userList = null;

  //       // Find the user object matching the provided userId
  //       const currentUser = userData?.find((user) => user._id === userId);

  //       if (currentUser) {
  //         // Loop through the menus of the current user
  //         currentUser?.menulist?.forEach((menu) => {
  //           menu?.items?.forEach((subMenu) => {
  //             // Check if the subMenu is the "User Profile" menu
  //             if (subMenu?.label === subMenu?.label) {
  //               // Find the "User List" sub-item
  //               const userListSubMenu = subMenu?.items?.find(
  //                 (subItem) => subItem?.label === "PO List"
  //               );
  //               if (userListSubMenu) {
  //                 // Set the user list property
  //                 userList = userListSubMenu;
  //               }
  //             }
  //           });
  //         });
  //       }
  //       return userList;
  //     };

  //     var permissions = extractUserListForCurrentUser(
  //       permidionData,
  //       userIdFromSession
  //     );
  //     setPermission(permissions);
  //   } else {
  //     navigate("/");
  //   }
  // }, [user, navigate]);

  return (
    <div>
      {showPurchaseApproveListData && (
        <PurchaseOrderApproveList
          permission={permission}
          // click={clickhandler}
          showPurchaseApproveListData={showPurchaseApproveListData}
          purchaseFilterApproveAllData={purchaseFilterApproveAllData}
          isPurchaseOrderLoading={isPurchaseOrderLoading}
        ></PurchaseOrderApproveList>
      )}
      {showPurchaseUnApproveListData && (
        <PurchaseOrderUnapproveList
          permission={permission}
          fromDate={fromDate}
          toDate={toDate}
          purchaseInfoData={purchaseInfoData}
          showPurchaseUnApproveListData={showPurchaseUnApproveListData}
          purchaseFilterUnApproveAllData={purchaseFilterUnApproveAllData}
          setPurchaseFilterUnApproveAllData={setPurchaseFilterUnApproveAllData}
          handleApproveData={handleApproveData}
          refetch={refetch}
          isPurchaseOrderLoading={isPurchaseOrderLoading}
        ></PurchaseOrderUnapproveList>
      )}
   
    </div>
  );
};

export default PurchaseOrderStatusListTable;
