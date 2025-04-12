import React, { useEffect, useState } from 'react'
import ProductionReportView from './ProductionReportView';

import { useNavigate } from 'react-router-dom';
import { useGetAllUserQuery } from '../../../../redux/features/user/userApi';

const ProductionReportTable = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();
  const { data: user,isLoading: isUserloading } = useGetAllUserQuery(undefined);


  useEffect(() => {
    if (localStorage.length > 0) {
      const getUserId = localStorage.getItem("user");
      const userSingleId = JSON.parse(getUserId);
      const userIdFromSession = userSingleId?._id;
      const permidionData = user?.filter(
        (user) => user._id === userIdFromSession
      );

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
        const userList = currentUser?.menulist ? findMenuItem(currentUser.menulist, "Finish Goods") : null;
        console.log(userList)
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
        <ProductionReportView  permission={permission}></ProductionReportView>
      </div>
    );
}

export default ProductionReportTable
