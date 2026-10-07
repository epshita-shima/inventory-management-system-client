import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PurchaseOrderApproveForm from "./PurchaseOrderApproveForm";
import { extractUserMenuListForCurrectMenu } from "../../../Uitilites/extractUserMenuListForCurrectMenu";

const PurchaseStatusList = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.length > 0) {
      const permissions = extractUserMenuListForCurrectMenu("PO Approval");
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <PurchaseOrderApproveForm permission={permission} />
    </div>
  );
};

export default PurchaseStatusList;
