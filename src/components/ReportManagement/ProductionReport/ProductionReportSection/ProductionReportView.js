import React, { useEffect, useState } from "react";
import CommonProductionReportParameter from "../CommonProductionReportParameter/CommonProductionReportParameter";
// import { useLazyGetProductionDatewiseDetailsReportQuery, useLazyGetProductionDatewiseSummaryReportQuery } from "../../../redux/features/productionreport/productionreportApi";
import DatewiseProductionDetails from "../DatewiseProductionDetails/DatewiseProductionDetails";
import DatewiseProductionSummary from "../DatewiseProductionSummary/DatewiseProductionSummary";
// import { finishGoodsWithSizeItemDropdown, productionBatchDropdown } from "../../Common/CommonDropdown/CommonDropdown";
// import { useGetAllProductionInformationQuery } from "../../../../redux/features/productioninformation/productionApi";
import { useGetAllRMItemInformationQuery } from "../../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/finishgoodsinfoApi";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetAllProductionInformationQuery } from "../../../../redux/features/productioninformation/productionApi";
import { finishGoodsWithSizeItemDropdown, productionBatchDropdown } from "../../../Common/CommonDropdown/CommonDropdown";
import { useLazyGetProductionDatewiseDetailsReportQuery, useLazyGetProductionDatewiseSummaryReportQuery } from "../../../../redux/features/productionreport/productionreportApi";
import LoadingSpineer from "../../../Common/LoadingSpinner/LoadingSpineer";

const ProductionReportView = ({ permission }) => {
  const [
    isProductionDatewiseDetailsReport,
    setIsProductionDatewiseDetailsReport,
  ] = useState(false);
  const [
    isProductionDatewiseSummaryReport,
    setIsProductionDatewiseSummaryReport,
  ] = useState(false);
console.log('permission',permission)
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: new Date(fromDate).toLocaleDateString("en-CA"),
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
    productionItemName: "",
    batchNo: "",
    reportStatus: "",
  });
  const {data:productionAllData}=useGetAllProductionInformationQuery(undefined)
  const { data: itemUnitInformation } = useGetAllItemUnitQuery(undefined);
  const {data:rawMaterialDataInfo,isLoading:isRawItemInfoLoading}=useGetAllRMItemInformationQuery(undefined);
  const {data:finishGoodsItemInfo}=useGetAllItemInformationQuery(undefined);
  const {data:itemSizeInfo}=useGetAllItemSizeQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const [
    triggerDatewiseDetailsReport,
    { data: productionDatewiseDetailsData },
  ] = useLazyGetProductionDatewiseDetailsReportQuery();
  const [
    triggerDatewiseSummaryReport,
    { data: productionDatewiseSummaryData },
  ] = useLazyGetProductionDatewiseSummaryReportQuery();

  console.log('productionDatewiseDetailsData',productionDatewiseDetailsData)
  const itemsOptions = finishGoodsWithSizeItemDropdown(
    finishGoodsItemInfo,
    itemSizeInfo
  );

  const batchOptions =   productionBatchDropdown
  (
    productionAllData
  );

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
    if (updatedFilters.reportStatus === "datewiseproductiondetails") {
      await triggerDatewiseDetailsReport(updatedFilters);
    }
    else if(updatedFilters.reportStatus === "datewiseproductionsummary") {
      await triggerDatewiseSummaryReport(updatedFilters);
    }
   
  };

  return (
    <div   className="row px-5 mx-2"
    style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}>
      <LoadingSpineer isLoading={isRawItemInfoLoading}></LoadingSpineer>
      <div className={`${isRawItemInfoLoading ? 'd-none' : 'd-block'}`}>
        <CommonProductionReportParameter
          fromDate={fromDate}
          setFromDate={setFromDate}
          setFilters={setFilters}
          toDate={toDate}
          setToDate={setToDate}
          filters={filters}
          itemsOptions={itemsOptions}
          batchOptions={batchOptions}
          handleApplyFilters={handleApplyFilters}
          setIsProductionDatewiseDetailsReport={setIsProductionDatewiseDetailsReport}
          setIsProductionDatewiseSummaryReport={setIsProductionDatewiseSummaryReport}
          setIsTableDisplay={setIsTableDisplay}
        />

        {isProductionDatewiseDetailsReport && (
          <DatewiseProductionDetails
            permission={permission}
            isTableDispaly={isTableDispaly}
            setIsTableDisplay={setIsTableDisplay}
            filteredDatas={productionDatewiseDetailsData}
            finishGoodsItemInfo={finishGoodsItemInfo}
            rawMaterialDataInfo={rawMaterialDataInfo}
            itemUnitInformation={itemUnitInformation}
            itemSizeInfo={itemSizeInfo}
            companyinfo={companyinfo}
            filters={filters}
          />
        )}
        {isProductionDatewiseSummaryReport && (
          <DatewiseProductionSummary
            permission={permission}
            isTableDispaly={isTableDispaly}
            setIsTableDisplay={setIsTableDisplay}
            filteredDatas={productionDatewiseSummaryData?.finishGoodsProduction}
            finishGoodsItemInfo={finishGoodsItemInfo}
            rawMaterialDataInfo={rawMaterialDataInfo}
            itemUnitInformation={itemUnitInformation}
            itemSizeInfo={itemSizeInfo}
            companyinfo={companyinfo}
            filters={filters}
          />
        )}
      </div>
    </div>
  );
};

export default ProductionReportView;
