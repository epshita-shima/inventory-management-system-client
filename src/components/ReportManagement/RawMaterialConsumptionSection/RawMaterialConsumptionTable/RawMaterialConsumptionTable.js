import React, { useEffect, useState } from 'react'
import RawMaterialConsumptionView from './RawMaterialConsumptionView';
import { useNavigate } from 'react-router-dom';
import { extractUserMenuListForCurrectMenu } from '../../../Uitilites/extractUserMenuListForCurrectMenu';

const RawMaterialConsumptionTable = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.length > 0) {
      const permissions = extractUserMenuListForCurrectMenu("Raw Material consumption");
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);
  return (
      <div>
        <RawMaterialConsumptionView  permission={permission}></RawMaterialConsumptionView>
      </div>
    );
}

export default RawMaterialConsumptionTable
