import React, { useEffect, useState } from "react";
import FinishGoodsDeliveryListData from "./FinishGoodsDeliveryListData";
import { useNavigate } from "react-router-dom";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";

const FinishGoodsDeliveryList = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    const permissions = extractUserMenuListForCurrectMenu("List Page");
    if (permissions) {
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <FinishGoodsDeliveryListData
        permission={permission}
      ></FinishGoodsDeliveryListData>
    </div>
  );
};

export default FinishGoodsDeliveryList;
