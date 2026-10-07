/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import DeliveryOrderApproveListData from "./DeliveryOrderApproveListData";
import { extractUserMenuListForCurrectMenu } from "../../../Uitilites/extractUserMenuListForCurrectMenu";

const DeliveryOrderApproveList = () => {
    const [permission, setPermission] = useState({});
    const navigate = useNavigate();

     useEffect(() => {
          const permissions = extractUserMenuListForCurrectMenu("Approve List");
          if (permissions) {
            setPermission(permissions);
          } else {
            navigate("/");
          }
      }, [navigate]);

    
    return (
        <div>
         <DeliveryOrderApproveListData permission={permission}></DeliveryOrderApproveListData>
        </div>
      );
};

export default DeliveryOrderApproveList;
