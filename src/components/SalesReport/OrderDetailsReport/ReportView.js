import React, { useEffect, useState } from "react";
import OrderDetailsReportTable from "./OrderDetailsReportTable";
import OrderSummaryReport from "./OrderSummaryReport";
import CommonParameter from "../CommonParameterDetails/CommonParameter";
import {
  clientInfoDropdown,
  finishGoodsWithSizeItemDropdown,
  invoiceListDropdown,
} from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";
import {
  useGetAllInvoiceInformationQuery,
} from "../../../redux/features/invoiceinformation/invoiceinfoApi";
import SalesSummaryReport from "./SalesSummaryReport";
import { useGetAllDelieryOrderInformationQuery } from "../../../redux/features/deliveryorderinformation/deliveryinfoApi";
import SalesDetailsReport from "./SalesDetailsReport";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import SalesReturnSummaryReport from "./SalesReturnSummaryReport";
import SalesReturnDetailsReport from "./SalesReturnDetailsReport";
import { useGetCompanyInfoQuery } from "../../../redux/features/companyinfo/compayApi";
import {
  useLazyGetCombineReportQuery,
  useLazyGetOrderDetailsReportQuery,
  useLazyGetOrderSummaryReportQuery,
  useLazyGetReturnDetailsReportQuery,
  useLazyGetReturnSummaryReportQuery,
  useLazyGetSalesDetailsReportQuery,
  useLazyGetSalesSummaryReportQuery,
} from "../../../redux/features/allreport/allreportApi";
import { useGetAllItemUnitQuery } from "../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import CombineReport from "./CombineReport";

const ReportView = ({ permission }) => {
  const [isOrderDetailsReport, setIsOrderDetailsReport] = useState(false);
  const [isOrderSumaryReport, setIsOrderSummmaryReport] = useState(false);
  const [isSalesDetailsReport, setIsSalesDetailsReport] = useState(false);
  const [isSalesSummaryReport, setIsSalesSummaryReport] = useState(false);
  const [isChangeItemName,setIsChangeItemName]=useState(false)
  const [isReturnDetailsReport, setIsReturnDetailsReport] =
    useState(false);
  const [isReturnSummaryReport, setIsReturnSummaryReport] =
    useState(false);
  const [isCombineReport, setIsCombineReport] =
    useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [executeQuery, setExecuteQuery] = useState(false);

  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);
  const { data: finishGoodsItemInfo } =
    useGetAllItemInformationQuery(undefined);
  const { data: itemSizeInfo } = useGetAllItemSizeQuery(undefined);
  const {data:itemUnitInformation}=useGetAllItemUnitQuery(undefined);
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

  const [triggerOrderDetailsReport, { data: orderDetailsData }] =
    useLazyGetOrderDetailsReportQuery();
  const [triggerOrderSummaryReport, { data: orderSummaryData }] =
    useLazyGetOrderSummaryReportQuery();
  const [triggerSalesDetailsReport, { data: salesDetailsData }] =
    useLazyGetSalesDetailsReportQuery();
  const [triggerSalesSummaryReport, { data: salesSummaryData }] =
    useLazyGetSalesSummaryReportQuery();
  const [triggerReturnDetailsReport, { data: returnDetailsData }] =
    useLazyGetReturnDetailsReportQuery();
  const [triggerReturnSummaryReport, { data: returnSummaryData }] =
    useLazyGetReturnSummaryReportQuery();
  const [triggerCombineReport, { data: combineReportData }] =
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
    <div>
      <div
        className="row px-5 mx-2"
        style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
      >
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
            finishGoodsItemInfo={finishGoodsItemInfo}
            itemSizeInfo={itemSizeInfo}
            companyinfo={companyinfo}
          />
        )}

        {isOrderSumaryReport && (
          <OrderSummaryReport
            permission={permission}
            isTableDispaly={isTableDispaly}
            setIsTableDisplay={setIsTableDisplay}
            filteredDatas={orderSummaryData}
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
            companyinfo={companyinfo}
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
          />
        )}
      </div>
    </div>
  );
};

export default ReportView;
