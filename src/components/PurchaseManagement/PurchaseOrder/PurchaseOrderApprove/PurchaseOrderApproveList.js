import React, { useEffect, useState } from 'react'
import { useGetAllUserQuery } from '../../../../redux/features/user/userApi';
import { useNavigate } from 'react-router-dom';
import { extractUserMenuListForCurrectMenu } from '../../../Uitilites/extractUserMenuListForCurrectMenu';

const PurchaseOrderApproveList = () => {
    const { data: user, isUserloading } = useGetAllUserQuery(undefined);
  
    const [permission, setPermission] = useState();
    const navigate = useNavigate();
    useEffect(() => {
      if (!isUserloading && user) {
        const permissions = extractUserMenuListForCurrectMenu(user, "PO Approval");
        if (permissions) {
          setPermission(permissions);
        } else {
          navigate("/");
        }
      }
    }, [user, navigate, isUserloading]);
  
  return (
    <div>
      <PurchaseOrderApproveList permission={permission}></PurchaseOrderApproveList>
    </div>
  )
}

export default PurchaseOrderApproveList
