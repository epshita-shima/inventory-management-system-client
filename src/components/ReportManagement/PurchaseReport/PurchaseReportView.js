import React, { useEffect, useState } from "react";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetAllItemUnitQuery } from "../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/finishgoodsinfoApi";
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
import {
  useLazyGetPurchaseDetailsReportQuery,
  useLazyGetPurchaseSummaryReportQuery,
} from "../../../redux/features/purchasereport/purchasereportApi";
import { useGetAllBankInformationQuery } from "../../../redux/features/bankinformation/bankInfoAPi";
import { useGetAllPaymentInformationQuery } from "../../../redux/features/paymnetinformation/paymentInfoApi";
import PurchaseSummaryDataTable from "./PurchaseSummaryDataTable";
import LoadingSpineer from "../../Common/LoadingSpinner/LoadingSpineer";

const PurchaseReportView = ({ permission }) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [isPurchaseDetails, setIsPurchaseDetails] = useState(false);
  const [isPurchaseSummary, setIsPurchaseSummary] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: new Date(fromDate).toLocaleDateString("en-CA"),
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
    itemId: "",
    supplierId: "",
    poId: "",
    reportStatus: "",
  });
  const { data: rawMaterialInfo, isLoading: isRawItemLoading } =
    useGetAllRMItemInformationQuery(undefined);
  const { data: itemUnitInformation } = useGetAllItemUnitQuery(undefined);
  const { data: finishGoodsInfo } = useGetAllItemInformationQuery(undefined);
  const { data: itemSizeInfo } = useGetAllItemSizeQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: piInformation } = useGetAllInvoiceInformationQuery(undefined);
  const { data: supplierInfo } = useGetAllSupplierInformationQuery(undefined);
  const { data: purchaseInfoData } =
    useGetAllPurchaseOrderInformationQuery(undefined);
  const { data: bankInformation } = useGetAllBankInformationQuery(undefined);
  const { data: paymentData } = useGetAllPaymentInformationQuery(undefined);
  const itemsOptions = rawMaterialWithUnitDropdown(
    rawMaterialInfo,
    itemUnitInformation
  );
  const supplierOptions = supplierDropdown(supplierInfo);
  const purchaseOptions = poInfoDropdown(purchaseInfoData);

  const [
    triggerPurchaseDetailsReport,
    { data: purchaseDetailsData, isLoading: isPurchaseDetailsLoading },
  ] = useLazyGetPurchaseDetailsReportQuery();

  const [
    triggerPurchaseSummaryReport,
    { data: purchaseSummaryData, isLoading: isPurchaseSummaryLoading },
  ] = useLazyGetPurchaseSummaryReportQuery();

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      setExecuteQuery(false);
    }
  }, [executeQuery]);

  const handleApplyFilters = async (updatedFilters) => {
    setExecuteQuery(true);
    setFilters((prevFilters) => ({
      ...prevFilters,
      reportStatus: "",
    }));

    if (updatedFilters.reportStatus === "purchasedetailsreport") {
      await triggerPurchaseDetailsReport(updatedFilters);
    }
    if (updatedFilters.reportStatus === "purchasesummaryreport") {
      await triggerPurchaseSummaryReport(updatedFilters);
    }
  };

  return (
    <div
      className="row px-5 mx-2"
      style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
      <LoadingSpineer isLoading={isRawItemLoading}></LoadingSpineer>
      <div className={`${isRawItemLoading ? "d-none" : "d-block"}`}>
        {
          <CommonPurchaseParameter
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            handleApplyFilters={handleApplyFilters}
            filters={filters}
            setFilters={setFilters}
            setIsPurchaseDetails={setIsPurchaseDetails}
            setIsPurchaseSummary={setIsPurchaseSummary}
            setIsTableDisplay={setIsTableDisplay}
            itemsOptions={itemsOptions}
            supplierOptions={supplierOptions}
            purchaseOptions={purchaseOptions}
          ></CommonPurchaseParameter>
        }

        {isPurchaseDetails && (
          <PurchaseReportDataTable
            rawMaterialInfo={rawMaterialInfo}
            itemUnitInformation={itemUnitInformation}
            finishGoodsInfo={finishGoodsInfo}
            itemSizeInfo={itemSizeInfo}
            permission={permission}
            filteredDatas={purchaseDetailsData}
            companyinfo={companyinfo}
            piInformation={piInformation}
            supplierInfo={supplierInfo}
            bankInformation={bankInformation}
            paymentData={paymentData}
            filters={filters}
            isTableDispaly={isTableDispaly}
            isPurchaseDetailsLoading={isPurchaseDetailsLoading}
          ></PurchaseReportDataTable>
        )}

        {isPurchaseSummary && (
          <PurchaseSummaryDataTable
            filteredDatas={purchaseSummaryData}
            isTableDispaly={isTableDispaly}
            paymentTypeInfo={paymentData}
            companyinfo={companyinfo}
            isPurchaseSummaryLoading={isPurchaseSummaryLoading}
          ></PurchaseSummaryDataTable>
        )}
      </div>
    </div>
  );
};

export default PurchaseReportView;
