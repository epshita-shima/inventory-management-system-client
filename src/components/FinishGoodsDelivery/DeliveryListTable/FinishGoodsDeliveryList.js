import React, { useEffect, useState } from "react";
import FinishGoodsDeliveryListData from "./FinishGoodsDeliveryListData";
import { useGetAllUserQuery } from "../../../redux/features/user/userApi";
import { useNavigate } from "react-router-dom";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";

const FinishGoodsDeliveryList = () => {
  const { data: user, isUserloading } = useGetAllUserQuery(undefined);
  const [permission, setPermission] = useState({});
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

  return (
    <div>
      <FinishGoodsDeliveryListData
        permission={permission}
      ></FinishGoodsDeliveryListData>
    </div>
  );
};

export default FinishGoodsDeliveryList;
