import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import swal from "sweetalert";
const RequireAuth = ({ children }) => {
  const getUserFromSession = localStorage.getItem("user");
  const accessToken = localStorage.getItem("accesstoken");
  const getUser = JSON.parse(getUserFromSession);
  const location = useLocation();

  if (!getUser || !accessToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  const extractUrlsAndIsChecked = (userData) => {
    const urlsAndIsChecked = [];

    userData?.menulist?.forEach((menuItem) => {
      // Recursively traverse nested items
      const traverseItems = (items) => {
        items.forEach((item) => {
          urlsAndIsChecked.push({
            id: item.id,
            url: item.url,
            isChecked: item.isChecked,
            isInserted: item.isInserted,
            isUpdated: item.isUpdated,
            isPDF: item.isPDF,
            isRemoved: item.isRemoved,
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
  const currentUrl = window.location.href;
  const pathname = new URL(currentUrl).pathname;

  const matchUrlWithData = (data, url) => {
    const splitUrl = url.substr(1).split("/");
    const mainView = splitUrl[0];
    const getParentMenu = splitUrl[1];
    const childMenuName = splitUrl[2];

    for (const item of data) {
      if (item.url === url) {
        return item;
      } else if (item?.url === `/${mainView}/${getParentMenu}`) {
        if (childMenuName.includes("update")) {
          return item.isUpdated
            ? { status: "success", message: "Update action is allowed" }
            : null;
        } else {
          return null;
        }
      }
    }
    return null;
  };

  const matchedItem = matchUrlWithData(data, pathname);

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
