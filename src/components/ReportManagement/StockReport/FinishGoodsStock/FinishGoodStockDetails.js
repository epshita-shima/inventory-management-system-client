import React, { useEffect, useState } from 'react'
import FinishGoodsStockView from './FinishGoodsStockView';
import { useNavigate } from 'react-router-dom';
import { extractUserMenuListForCurrectMenu } from '../../../Uitilites/extractUserMenuListForCurrectMenu';

const FinishGoodStockDetails = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.length > 0) {
      const permissions =
        extractUserMenuListForCurrectMenu("Finish Goods Stock") ||
        extractUserMenuListForCurrectMenu("Stock Report");
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
      <div>
        <FinishGoodsStockView permission={permission}></FinishGoodsStockView>
      </div>
    );
}

export default FinishGoodStockDetails
