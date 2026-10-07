import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ConsumptionReportView from './ConsumptionReportView';
import { extractUserMenuListForCurrectMenu } from '../../../Uitilites/extractUserMenuListForCurrectMenu';

const ConsumptionReportMenuPermission = () => {
    const [permission, setPermission] = useState({});
    const navigate = useNavigate();
    useEffect(()=>{
      if (localStorage.length > 0) {
        const permissions = extractUserMenuListForCurrectMenu("Finish Goods");
        setPermission(permissions)
      }
      else{
        navigate('/')
      }
    },[navigate])

  return (
    <div>
      <ConsumptionReportView ></ConsumptionReportView>
    </div>
  )
}

export default ConsumptionReportMenuPermission
