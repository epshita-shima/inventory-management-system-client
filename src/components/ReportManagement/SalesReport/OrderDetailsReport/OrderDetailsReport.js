import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ReportView from './ReportView';
import { extractUserMenuListForCurrectMenu } from '../../../Uitilites/extractUserMenuListForCurrectMenu';

const OrderDetailsReport = () => {
    const [permission, setPermission] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
      if (localStorage.length > 0) {
        const permissions = extractUserMenuListForCurrectMenu("Sales Report");
        setPermission(permissions);
      } else {
        navigate("/");
      }
    }, [navigate]);

    return (
        <div>
          <ReportView  permission={permission}></ReportView>
        </div>
      );
}

export default OrderDetailsReport
