import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useGetAllUserQuery } from '../../../../redux/features/user/userApi';
import ConsumptionReportView from './ConsumptionReportView';

const ConsumptionReportMenuPermission = () => {
    const [permission, setPermission] = useState({});
    const navigate = useNavigate();
    const { data: users,isLoading: isUserloading } = useGetAllUserQuery(undefined);
  console.log(users)
    useEffect(()=>{
      if (localStorage.length > 0) {
        const getUser=localStorage.getItem("user");
        const formatUser=JSON.parse(getUser);
        const getUserId=formatUser?._id;

        const permissionUserExist=users?.filter((user)=>user._id === getUserId)
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
          permissionUserExist,
          getUserId
        );
        setPermission(permissions)
      }
      else{
        navigate('/')
      }
    },[navigate, users])

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
      <ConsumptionReportView ></ConsumptionReportView>
    </div>
  )
}

export default ConsumptionReportMenuPermission
