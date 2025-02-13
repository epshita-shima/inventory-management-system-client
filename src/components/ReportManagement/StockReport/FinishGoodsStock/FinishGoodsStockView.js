import React, { useEffect, useState } from "react";
import CommonParameterFinishGoods from "./CommonParameterFinishGoods";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/finishgoodsinfoApi";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useLazyGetFinishgGoodsStockReportQuery } from "../../../../redux/features/stockreport/stockreportApi";
import FinishGoodsStockDatatable from "./FinishGoodsStockDatatable";

const FinishGoodsStockView = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: new Date(fromDate).toLocaleDateString("en-CA"),
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
  });
  const [filterText, setFilterText] = useState("");
  const { data: itemSizeInfo } = useGetAllItemSizeQuery(undefined);
  const { data: finishItemInfo } = useGetAllItemInformationQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);

  const [
    triggerFinishGoodsStockReport,
    {
      data: finishGoodsStockReportData,
      isLoading: isFinishGoodsStockDataLoading,
    },
  ] = useLazyGetFinishgGoodsStockReportQuery();

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      setExecuteQuery(false);
    }
  }, [executeQuery]);

  const handleApplyFilters = async (updatedFilters) => {
    setExecuteQuery(true);
    await triggerFinishGoodsStockReport(updatedFilters);
  };


  return (
    <div className="row px-5 mx-2">
      {
        <CommonParameterFinishGoods
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          handleApplyFilters={handleApplyFilters}
          filters={filters}
          setFilters={setFilters}
          setIsTableDisplay={setIsTableDisplay}
        />
      }
      {isTableDispaly && (
        <FinishGoodsStockDatatable
          finishItemInfo={finishItemInfo}
          itemSizeInfo={itemSizeInfo}
          finishGoodsStockReportData={finishGoodsStockReportData}
          isTableDispaly={isTableDispaly}
          filterText={filterText}
          isFinishGoodsStockDataLoading={isFinishGoodsStockDataLoading}
          companyinfo={companyinfo}
        ></FinishGoodsStockDatatable>
      )}
    </div>
  );
};

export default FinishGoodsStockView;
