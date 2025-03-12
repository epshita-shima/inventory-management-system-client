import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ProductionInfoList from "./ProductionInfoTable/ProductionInfoList";
import { useNavigate } from "react-router-dom";
import { useGetAllUserQuery } from "../../../redux/features/user/userApi";

const ProductionListTable = () => {
  const { data: user, isLoading:isUserloading } = useGetAllUserQuery(undefined);

  const [permission, setPermission] = useState({});
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
        const currentUser = userData?.find((user) => user._id === userId);
        if (!currentUser?.menulist) return null;
      
        for (const menu of currentUser.menulist) {
          // Try to find in first-level items
          const directMatch = menu?.items?.find(item => item?.label === "Production List");
          if (directMatch) return directMatch;
      
          // Try to find in second-level (nested) items if any
          for (const subMenu of menu?.items || []) {
            const nestedMatch = subMenu?.items?.find(
              (subItem) => subItem?.label === "Production List"
            );
            if (nestedMatch) return nestedMatch;
          }
        }
      
        return null;
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


  return (
    <div className={`${isUserloading ? 'd-none' : 'd-block'}`}>
      <ProductionInfoList permission={permission}></ProductionInfoList>
      {permission?.isInserted ? (
        <div
          className={`position-absolute`}
          style={{ right: "10%", bottom: "4%", zIndex: "9999" }}
        >
          <div className="">
            <a
              href="/main-view/create-production"
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

export default ProductionListTable;
