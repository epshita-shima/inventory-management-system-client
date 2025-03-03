import React, { useEffect, useState } from 'react'
import RawMaterialConsumptionView from './RawMaterialConsumptionView';
import { useNavigate } from 'react-router-dom';
import { useGetAllUserQuery } from '../../../../redux/features/user/userApi';

const RawMaterialConsumptionTable = () => {
  const { data: user, isLoading:isUserloading } = useGetAllUserQuery(undefined);

  const [permission, setPermission] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.length > 0) {
      const getUserId = localStorage.getItem("user");
      const userSingleId = JSON.parse(getUserId);
      const userIdFromSession = userSingleId?._id;
      const permidionData = user?.filter(
        (user) => user._id == userIdFromSession
      );
      console.log('permidionData',permidionData)
      const extractUserListForCurrentUser = (userData, userId) => {
      
        const currentUser = userData?.find((user) => user._id === userId);

        const findMenuItem = (menuList, targetLabel) => {
          for (const menu of menuList) {
            if (menu.label === targetLabel) {
              return menu;
            }
            if (menu.items && menu.items.length > 0) {
              const foundItem = findMenuItem(menu.items, targetLabel);
              if (foundItem) return foundItem;
            }
          }
          return null;
        };
        
        // Usage
        const userList = currentUser?.menulist ? findMenuItem(currentUser.menulist, "Raw Material consumption") : null;
        console.log(userList)
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
        <RawMaterialConsumptionView  permission={permission}></RawMaterialConsumptionView>
      </div>
    );
}

export default RawMaterialConsumptionTable
