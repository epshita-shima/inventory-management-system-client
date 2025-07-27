import React, { useEffect, useState } from 'react'
import FinishGoodsStockView from './FinishGoodsStockView';
import { useGetAllUserQuery } from '../../../../redux/features/user/userApi';
import { useNavigate } from 'react-router-dom';

const FinishGoodStockDetails = () => {
  const { data: user, isLoading:isUserloading } = useGetAllUserQuery(undefined);

  const [permission, setPermission] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.length > 0) {
      const getUserId = localStorage.getItem("user");
      const userSingleId = JSON.parse(getUserId);
      const userIdFromSession = userSingleId?._id;
      const permidionData = user?.filter(
        (user) => user._id ===userIdFromSession
      );
      const extractUserListForCurrentUser = (userData, userId) => {
        let userList = null;
        const currentUser = userData?.find((user) => user._id === userId);

        if (currentUser) {
          currentUser?.menulist?.forEach((menu) => {
            const userListSubMenu = menu?.items?.find(
              (subItem) => subItem?.label === "Stock Report"
            );
            if (userListSubMenu) {
              userList = userListSubMenu;
            } else {
              menu?.items?.forEach((subMenu) => {
                if (subMenu?.label === subMenu?.label) {
                  const userListSubMenu = subMenu?.items?.find(
                    (subItem) => subItem?.label === "Finish Goods Stock"
                  );
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
          className="btn"
          style={{ backgroundColor: "#2DDC1B", color: "white" }}
          type="button"
          disabled
        >
          <span
            className="spinner-grow spinner-grow-sm"
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
        <FinishGoodsStockView permission={permission}></FinishGoodsStockView>
      </div>
    );
}

export default FinishGoodStockDetails
