/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";

import { useGetAllUserQuery } from "../../../../redux/features/user/userApi";
import { useNavigate } from "react-router-dom";
import DeliveryOrderApproveListData from "./DeliveryOrderApproveListData";
import { extractUserMenuListForCurrectMenu } from "../../../Uitilites/extractUserMenuListForCurrectMenu";

const DeliveryOrderApproveList = () => {
    const { data: user, isUserloading } = useGetAllUserQuery(undefined);
    const [permission, setPermission] = useState({});
    const navigate = useNavigate();

     useEffect(() => {
        if (!isUserloading && user) {
          const permissions = extractUserMenuListForCurrectMenu(user, "Approve List");
          if (permissions) {
            setPermission(permissions);
          } else {
            navigate("/");
          }
        }
      }, [user, navigate, isUserloading]);

    
    return (
        <div>
         <DeliveryOrderApproveListData permission={permission}></DeliveryOrderApproveListData>
        </div>
      );
};

export default DeliveryOrderApproveList;
