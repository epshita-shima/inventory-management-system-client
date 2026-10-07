import React, { useEffect, useState } from "react";
import CombineReportView from "./CombineReportView";
import { useNavigate } from "react-router-dom";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";

const CombineReportTable = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();

  const dropdownMenuStyles = {
    position: "relative",
    inset: "0px auto auto 0px",
    margin: "0px",
    transform: "translate3d(-32.5px, -20px, 0px)",
  };

  useEffect(() => {
    if (localStorage.length > 0) {
      const permissions = extractUserMenuListForCurrectMenu("Combine Report");
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <CombineReportView
        dropdownMenuStyles={dropdownMenuStyles}
        permission={permission}
      ></CombineReportView>
    </div>
  );
};

export default CombineReportTable;
