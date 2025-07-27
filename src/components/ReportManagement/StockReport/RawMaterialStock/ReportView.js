import { useEffect, useState } from "react";
import CommonParameter from "./CommonParameter";
import { useLazyGetRawMaterialStockReportQuery } from "../../../../redux/features/stockreport/stockreportApi";
import StockReportDataTable from "./StockReportDataTable";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetAllRMItemInformationQuery } from "../../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";

const StockReportView = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: new Date(fromDate).toLocaleDateString("en-CA"),
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
  });
  const [filterText, setFilterText] = useState("");
  const {data:itemSizeInfo}=useGetAllItemSizeQuery(undefined);
  const {data:rawMaterialItem}=useGetAllRMItemInformationQuery(undefined)
  const {data:companyinfo}=useGetCompanyInfoQuery(undefined);
  const {data:itemUnitInfo}=useGetAllItemUnitQuery(undefined)
  const [
    triggerStockReport,
    {
      data: rawMaterialStockReportData,
      isLoading: isRawMaterialStockDataLoading,
    },
  ] = useLazyGetRawMaterialStockReportQuery();

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      setExecuteQuery(false);
    }
  }, [executeQuery]);

  const handleApplyFilters = async (updatedFilters) => {
    setExecuteQuery(true);
    await triggerStockReport(updatedFilters);
  };

  return (
    <div className="row px-5 mx-2">
      {
        <CommonParameter
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
        <StockReportDataTable
          rawMaterialStockReportData={rawMaterialStockReportData}
          isRawMaterialStockDataLoading={isRawMaterialStockDataLoading}
          filterText={filterText}
          setFilterText={setFilterText}
          itemSizeInfo={itemSizeInfo}
          rawMaterialItem={rawMaterialItem}
          companyinfo={companyinfo}
          itemUnitInfo={itemUnitInfo}
          isTableDispaly={isTableDispaly}
        ></StockReportDataTable>
      )}
    </div>
  );
};
export default StockReportView;
