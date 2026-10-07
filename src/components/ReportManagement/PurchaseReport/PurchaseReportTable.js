import React, { useEffect, useState } from 'react'
import PurchaseReportView from './PurchaseReportView';
import { useNavigate } from 'react-router-dom';
import { extractUserMenuListForCurrectMenu } from '../../Uitilites/extractUserMenuListForCurrectMenu';

const PurchaseReportTable = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.length > 0) {
      const permissions = extractUserMenuListForCurrectMenu("Purchase Report");
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);
  
  return (
      <div>
        <PurchaseReportView permission={permission}></PurchaseReportView>
      </div>
    );
}

export default PurchaseReportTable
