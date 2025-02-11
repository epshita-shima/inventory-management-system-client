import React, { useEffect, useState } from "react";
import OrderDetailsReportTable from "./OrderDetailsReportTable";
import OrderSummaryReport from "./OrderSummaryReport";
import CommonParameter from "../CommonParameterDetails/CommonParameter";
import {
  clientInfoDropdown,
  finishGoodsWithSizeItemDropdown,
  invoiceListDropdown,
} from "../../../Common/CommonDropdown/CommonDropdown";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import { useGetAllInvoiceInformationQuery } from "../../../../redux/features/invoiceinformation/invoiceinfoApi";
import SalesSummaryReport from "./SalesSummaryReport";
import { useGetAllDelieryOrderInformationQuery } from "../../../../redux/features/deliveryorderinformation/deliveryinfoApi";
import SalesDetailsReport from "./SalesDetailsReport";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/finishgoodsinfoApi";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import SalesReturnSummaryReport from "./SalesReturnSummaryReport";
import SalesReturnDetailsReport from "./SalesReturnDetailsReport";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import {
  useLazyGetCombineReportQuery,
  useLazyGetOrderDetailsReportQuery,
  useLazyGetOrderSummaryReportQuery,
  useLazyGetReturnDetailsReportQuery,
  useLazyGetReturnSummaryReportQuery,
  useLazyGetSalesDetailsReportQuery,
  useLazyGetSalesSummaryReportQuery,
} from "../../../../redux/features/salesreport/allreportApi";
import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import CombineReport from "./CombineReport";
import LoadingSpineer from "../../../Common/LoadingSpinner/LoadingSpineer";

const ReportView = ({ permission }) => {
  const [isOrderDetailsReport, setIsOrderDetailsReport] = useState(false);
  const [isOrderSumaryReport, setIsOrderSummmaryReport] = useState(false);
  const [isSalesDetailsReport, setIsSalesDetailsReport] = useState(false);
  const [isSalesSummaryReport, setIsSalesSummaryReport] = useState(false);
  const [isChangeItemName, setIsChangeItemName] = useState(false);
  const [isReturnDetailsReport, setIsReturnDetailsReport] = useState(false);
  const [isReturnSummaryReport, setIsReturnSummaryReport] = useState(false);
  const [isCombineReport, setIsCombineReport] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [executeQuery, setExecuteQuery] = useState(false);

  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const { data: clientInformation, isLoading: isClientInfoLoading } =
    useGetAllClientInformationQuery(undefined);
  const { data: finishGoodsItemInfo } =
    useGetAllItemInformationQuery(undefined);
  const { data: itemSizeInfo } = useGetAllItemSizeQuery(undefined);
  const { data: itemUnitInformation } = useGetAllItemUnitQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: doInformation } =
    useGetAllDelieryOrderInformationQuery(undefined);
  const { data: piInformation } = useGetAllInvoiceInformationQuery(undefined);
  const { data: companyInformation } = useGetCompanyInfoQuery(undefined);
  const [filters, setFilters] = useState({
    fromDate: new Date(fromDate).toLocaleDateString("en-CA"),
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
    itemId: "",
    clientId: "",
    piId: "",
    reportStatus: "",
  });

  const clientInfoOptions = clientInfoDropdown(clientInformation);
  const piInfoOptions = invoiceListDropdown(piInformation);
  const itemsOptions = finishGoodsWithSizeItemDropdown(
    finishGoodsItemInfo,
    itemSizeInfo
  );

  const [triggerOrderDetailsReport, { data: orderDetailsData ,isLoading:isOderDetailsLoading}] =
    useLazyGetOrderDetailsReportQuery();
  const [triggerOrderSummaryReport, { data: orderSummaryData ,isLoading:isOrderSummaryLoading}] =
    useLazyGetOrderSummaryReportQuery();
  const [triggerSalesDetailsReport, { data: salesDetailsData,isLoading:isSalesDetailsLoading }] =
    useLazyGetSalesDetailsReportQuery();
  const [triggerSalesSummaryReport, { data: salesSummaryData,isLoading:isSalesSummaryLoading }] =
    useLazyGetSalesSummaryReportQuery();
  const [triggerReturnDetailsReport, { data: returnDetailsData,isLoading:isReturnDetailsLoading}] =
    useLazyGetReturnDetailsReportQuery();
  const [triggerReturnSummaryReport, { data: returnSummaryData,isLoading:isReturnSummaryLoading }] =
    useLazyGetReturnSummaryReportQuery();
  const [triggerCombineReport, { data: combineReportData,isLoading:isCombineLoading }] =
    useLazyGetCombineReportQuery();

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      // trigger(filters);
      setExecuteQuery(false);
    }
  }, [executeQuery]);

  const handleApplyFilters = async (updatedFilters) => {
    setExecuteQuery(true);
    setFilters((prevFilters) => ({
      ...prevFilters,
      reportStatus: "",
    }));
    if (updatedFilters.reportStatus === "orderdetailsreport") {
      await triggerOrderDetailsReport(updatedFilters);
    } else if (updatedFilters.reportStatus === "ordersummaryreport") {
      await triggerOrderSummaryReport(updatedFilters);
    } else if (updatedFilters.reportStatus === "salesdetailsreport") {
      await triggerSalesDetailsReport(updatedFilters);
    } else if (updatedFilters.reportStatus === "salessummaryreport") {
      await triggerSalesSummaryReport(updatedFilters);
    } else if (updatedFilters.reportStatus === "returndetailsreport") {
      await triggerReturnDetailsReport(updatedFilters);
    } else if (updatedFilters.reportStatus === "returnsummaryreport") {
      await triggerReturnSummaryReport(updatedFilters);
    } else if (updatedFilters.reportStatus === "combinereport") {
      await triggerCombineReport(updatedFilters);
    }
  };

  return (
    <div
      className="row px-5 mx-2"
      style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
      <LoadingSpineer isLoading={isClientInfoLoading}></LoadingSpineer>
      <div className={`${isClientInfoLoading ? 'd-none' : 'd-block'}`}>
        <CommonParameter
          setIsChangeItemName={setIsChangeItemName}
          isChangeItemName={isChangeItemName}
          fromDate={fromDate}
          setFromDate={setFromDate}
          setFilters={setFilters}
          toDate={toDate}
          setToDate={setToDate}
          clientInfoOptions={clientInfoOptions}
          filters={filters}
          piInfoOptions={piInfoOptions}
          itemsOptions={itemsOptions}
          handleApplyFilters={handleApplyFilters}
          setIsOrderDetailsReport={setIsOrderDetailsReport}
          setIsOrderSummmaryReport={setIsOrderSummmaryReport}
          setIsSalesSummaryReport={setIsSalesSummaryReport}
          setIsSalesDetailsReport={setIsSalesDetailsReport}
          setIsReturnSummaryReport={setIsReturnSummaryReport}
          setIsReturnDetailsReport={setIsReturnDetailsReport}
          setIsCombineReport={setIsCombineReport}
          setIsTableDisplay={setIsTableDisplay}
        />

        {isOrderDetailsReport && (

          <OrderDetailsReportTable
            permission={permission}
            isTableDispaly={isTableDispaly}
            setIsTableDisplay={setIsTableDisplay}
            filteredDatas={orderDetailsData}
            isOderDetailsLoading={isOderDetailsLoading}
            finishGoodsItemInfo={finishGoodsItemInfo}
            itemSizeInfo={itemSizeInfo}
            itemUnitInformation={itemUnitInformation}
            companyinfo={companyinfo}
          />
        )}

        {isOrderSumaryReport && (
          <OrderSummaryReport
            permission={permission}
            isTableDispaly={isTableDispaly}
            setIsTableDisplay={setIsTableDisplay}
            filteredDatas={orderSummaryData}
            isOrderSummaryLoading={isOrderSummaryLoading}
            companyinfo={companyinfo}
          />
        )}

        {isSalesDetailsReport && (
          <SalesDetailsReport
            permission={permission}
            isTableDispaly={isTableDispaly}
            setIsTableDisplay={setIsTableDisplay}
            filteredDatas={salesDetailsData}
            clientInformation={clientInformation}
            piInformation={piInformation}
            doInformation={doInformation}
            finishGoodsItemInfo={finishGoodsItemInfo}
            itemSizeInfo={itemSizeInfo}
            itemUnitInformation={itemUnitInformation}
            companyinfo={companyinfo}
            isSalesDetailsLoading={isSalesDetailsLoading}
          />
        )}
        {isSalesSummaryReport && (
          <SalesSummaryReport
            permission={permission}
            isTableDispaly={isTableDispaly}
            setIsTableDisplay={setIsTableDisplay}
            filteredDatas={salesSummaryData}
            clientInformation={clientInformation}
            piInformation={piInformation}
            doInformation={doInformation}
            companyinfo={companyinfo}
            isSalesSummaryLoading={isSalesSummaryLoading}
          />
        )}
        {isReturnDetailsReport && (
          <SalesReturnDetailsReport
            permission={permission}
            isTableDispaly={isTableDispaly}
            setIsTableDisplay={setIsTableDisplay}
            filteredDatas={returnDetailsData}
            clientInformation={clientInformation}
            piInformation={piInformation}
            doInformation={doInformation}
            companyInformation={companyInformation}
            finishGoodsItemInfo={finishGoodsItemInfo}
            itemSizeInfo={itemSizeInfo}
            itemUnitInformation={itemUnitInformation}
            companyinfo={companyinfo}
            isReturnDetailsLoading={isReturnDetailsLoading}
          />
        )}
        {isReturnSummaryReport && (
          <SalesReturnSummaryReport
            permission={permission}
            isTableDispaly={isTableDispaly}
            setIsTableDisplay={setIsTableDisplay}
            filteredDatas={returnSummaryData}
            clientInformation={clientInformation}
            piInformation={piInformation}
            doInformation={doInformation}
            companyinfo={companyinfo}
            isReturnSummaryLoading={isReturnSummaryLoading}
          />
        )}
        {isCombineReport && (
          <CombineReport
            permission={permission}
            isTableDispaly={isTableDispaly}
            setIsTableDisplay={setIsTableDisplay}
            filteredCombineData={combineReportData}
            clientInformation={clientInformation}
            piInformation={piInformation}
            doInformation={doInformation}
            companyinfo={companyinfo}
            isCombineLoading={isCombineLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ReportView;
