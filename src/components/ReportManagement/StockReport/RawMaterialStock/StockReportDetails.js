import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StockReportView from "./ReportView";
import { extractUserMenuListForCurrectMenu } from "../../../Uitilites/extractUserMenuListForCurrectMenu";

const StockReportDetails = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.length > 0) {
      const permissions =
        extractUserMenuListForCurrectMenu("raw-material-stock") ||
        extractUserMenuListForCurrectMenu("Stock Report");
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
      <div>
        <StockReportView permission={permission}></StockReportView>
      </div>
    );
}

export default StockReportDetails
