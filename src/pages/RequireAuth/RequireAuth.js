import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import swal from "sweetalert";
const RequireAuth = ({ children }) => {
  const getUserFromSession = localStorage.getItem("user");
  const getUser = JSON.parse(getUserFromSession);
  const location = useLocation();
  const extractUrlsAndIsChecked = (userData) => {
    console.log({ userData });
    const urlsAndIsChecked = [];

    userData?.menulist?.forEach((menuItem) => {
      // Recursively traverse nested items
      const traverseItems = (items) => {
        items.forEach((item) => {
          urlsAndIsChecked.push({ url: item.url, 
            isChecked: item.isChecked,
            isInserted:item.isInserted,
            isUpdate:item.isUpdate,
            isPDF:item.isPDF,
            isRemoved:item.isRemoved,
           });

          // If the item has nested items, traverse them
          if (item.items && item.items.length > 0) {
            traverseItems(item.items);
          }
        });
      };

      traverseItems(menuItem.items);
    });

    return urlsAndIsChecked;
  };

  const data = extractUrlsAndIsChecked(getUser);
console.log('data',data)
  const currentUrl = window.location.href;
  const pathname = new URL(currentUrl).pathname;

  const matchUrlWithData = (data, url) => {
    for (const item of data) {
      console.log()
      if (item?.url === url) {
        console.log('item?.url',item?.url, 'url:',url)
        return item;
      }
    }
    return null;
  };

  const matchedItem = matchUrlWithData(data, pathname);
console.log(matchedItem)

  if (!getUser || !matchedItem) {
    swal(
      "Sorry!",
      "You do not have permission to access this page!",
      "warning"
    );
    return <Navigate to="/main-view" state={{ from: location }} replace />;
  }
  return children;
};

export default RequireAuth;
