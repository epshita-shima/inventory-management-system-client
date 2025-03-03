import React, { useEffect, useState } from "react";
import FinishGoodsDeliveryListData from "./FinishGoodsDeliveryListData";
import { useGetAllUserQuery } from "../../../redux/features/user/userApi";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";

const FinishGoodsDeliveryList = () => {
  const { data: user, isUserloading } = useGetAllUserQuery(undefined);
  const [permission, setPermission] = useState();
  const navigate = useNavigate();


  useEffect(() => {
    if (!isUserloading && user) {
      const permissions = extractUserMenuListForCurrectMenu(user, "List Page");
      if (permissions) {
        setPermission(permissions);
      } else {
        navigate("/");
      }
    }
  }, [user, navigate, isUserloading]);

  // if (isUserloading) {
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
      <FinishGoodsDeliveryListData
        permission={permission}
      ></FinishGoodsDeliveryListData>
    </div>
  );
};

export default FinishGoodsDeliveryList;
