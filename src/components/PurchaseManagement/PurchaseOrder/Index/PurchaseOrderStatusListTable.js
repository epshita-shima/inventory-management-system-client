import React, { useEffect, useState } from "react";
import PurchaseOrderApproveList from "./PurchaseOrderApproveTable/PurchaseOrderApproveList";
import { useGetAllUserQuery } from "../../../../redux/features/user/userApi";
import { useNavigate } from "react-router-dom";
import PurchaseOrderUnapproveList from "./PurchaseOrderUnapproveTable/PurchaseOrderUnapproveList";

const PurchaseOrderStatusListTable = ({
  showPurchaseApproveListData,
  purchaseFilterApproveAllData,
  showPurchaseUnApproveListData,
  purchaseFilterUnApproveAllData,
  setPurchaseFilterUnApproveAllData,
  purchaseInfoData,
  handleApproveData,
  fromDate,
  toDate,
  refetch,
  isPurchaseOrderLoading,
  permission
}) => {

  return (
    <div>
      {showPurchaseApproveListData && (
        <PurchaseOrderApproveList
          permission={permission}
          showPurchaseApproveListData={showPurchaseApproveListData}
          purchaseFilterApproveAllData={purchaseFilterApproveAllData}
          isPurchaseOrderLoading={isPurchaseOrderLoading}
        ></PurchaseOrderApproveList>
      )}
      {showPurchaseUnApproveListData && (
        <PurchaseOrderUnapproveList
          permission={permission}
          fromDate={fromDate}
          toDate={toDate}
          purchaseInfoData={purchaseInfoData}
          showPurchaseUnApproveListData={showPurchaseUnApproveListData}
          purchaseFilterUnApproveAllData={purchaseFilterUnApproveAllData}
          setPurchaseFilterUnApproveAllData={setPurchaseFilterUnApproveAllData}
          handleApproveData={handleApproveData}
          refetch={refetch}
          isPurchaseOrderLoading={isPurchaseOrderLoading}
        ></PurchaseOrderUnapproveList>
      )}
   
    </div>
  );
};

export default PurchaseOrderStatusListTable;
