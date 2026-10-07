import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { extractUserMenuListForCurrectMenu } from '../../../Uitilites/extractUserMenuListForCurrectMenu';

const PurchaseOrderApproveList = () => {
    const [permission, setPermission] = useState({});
    const navigate = useNavigate();
    
    useEffect(() => {
        const permissions = extractUserMenuListForCurrectMenu("PO Approval");
        if (permissions) {
          setPermission(permissions);
        } else {
          navigate("/");
        }
    }, [navigate]);
  
  return (
    <div>
      <PurchaseOrderApproveList permission={permission}></PurchaseOrderApproveList>
    </div>
  )
}

export default PurchaseOrderApproveList
