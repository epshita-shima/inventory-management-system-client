import React, { useEffect, useState } from 'react'
import ProductionReportView from './ProductionReportView';
import { useNavigate } from 'react-router-dom';
import { extractUserMenuListForCurrectMenu } from '../../../Uitilites/extractUserMenuListForCurrectMenu';

const ProductionReportTable = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.length > 0) {
      const permissions = extractUserMenuListForCurrectMenu("Finish Goods");
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);
 
  return (
      <div>
        <ProductionReportView  permission={permission}></ProductionReportView>
      </div>
    );
}

export default ProductionReportTable
