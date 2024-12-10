import React, { useEffect, useState } from "react";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetAllItemUnitQuery } from "../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetCompanyInfoQuery } from "../../../redux/features/companyinfo/compayApi";
import { useGetAllInvoiceInformationQuery } from "../../../redux/features/invoiceinformation/invoiceinfoApi";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";
import CommonPurchaseParameter from "./CommonPurchaseParameter";
import PurchaseReportDataTable from "./PurchaseReportDataTable";
import {
  poInfoDropdown,
  rawMaterialWithUnitDropdown,
  supplierDropdown,
} from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllSupplierInformationQuery } from "../../../redux/features/supplierInformation/supplierInfoApi";
import { useGetAllPurchaseOrderInformationQuery } from "../../../redux/features/purchaseorderinformation/purchaseOrderInfoApi";

const PurchaseReportView = ({ permission }) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: new Date(fromDate).toLocaleDateString("en-CA"),
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
  });
  const { data: rawMaterialInfo } = useGetAllRMItemInformationQuery(undefined);
  const { data: itemUnitInformation } = useGetAllItemUnitQuery(undefined);
  const { data: finishGoodsInfo } = useGetAllItemInformationQuery(undefined);
  const { data: itemSizeInfo } = useGetAllItemSizeQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: piInformation } = useGetAllInvoiceInformationQuery(undefined);
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);
  const { data: supplierInfo } = useGetAllSupplierInformationQuery(undefined);
  const { data: purchaseInfoData } =
    useGetAllPurchaseOrderInformationQuery(undefined);
  const itemsOptions = rawMaterialWithUnitDropdown(
    rawMaterialInfo,
    itemUnitInformation
  );
  const supplierOptions = supplierDropdown(supplierInfo);
  const purchaseOptions = poInfoDropdown(purchaseInfoData);

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      setExecuteQuery(false);
    }
  }, [executeQuery]);

  const handleApplyFilters = async (updatedFilters) => {
    console.log(updatedFilters);
    setExecuteQuery(true);
    // await triggerCombineReport(updatedFilters);
  };

  return (
    <div
      className="row px-5 mx-2"
      style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
      <h2>Hello</h2>
      {
        <CommonPurchaseParameter
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        handleApplyFilters={handleApplyFilters}
        filters={filters}
        setFilters={setFilters}
        setIsTableDisplay={setIsTableDisplay}
        itemsOptions={itemsOptions}
        supplierOptions={supplierOptions}
        purchaseOptions={purchaseOptions}
        ></CommonPurchaseParameter>
      }
      {/* {
        <CommonPurchaseParameter
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          handleApplyFilters={handleApplyFilters}
          filters={filters}
          setFilters={setFilters}
          setIsTableDisplay={setIsTableDisplay}
          itemsOptions={itemsOptions}
          supplierOptions={supplierOptions}
          purchaseOptions={purchaseOptions}
        />
      } */}
      {/* {isTableDispaly && 
      <PurchaseReportDataTable
        rawMaterialInfo={rawMaterialInfo}
        itemUnitInformation={itemUnitInformation}
        finishGoodsInfo={finishGoodsInfo}
        itemSizeInfo={itemSizeInfo}
        permission={permission}
        companyinfo={companyinfo}
        piInformation={piInformation}
        clientInformation={clientInformation}
        filters={filters}
      ></PurchaseReportDataTable>
      } */}
    </div>
  );
};

export default PurchaseReportView;
