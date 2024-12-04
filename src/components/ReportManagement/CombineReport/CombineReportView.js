import React, { useEffect, useState } from "react";
import CommonParameterForCombineReport from "./CommonParameterForCombineReport";
import CombineDataTableReport from "./CombineDataTableReport";
import { useLazyGetManagementCombineReportQuery } from "../../../redux/features/combinereport/combinereportApi";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetAllItemUnitQuery } from "../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";

const CombineReportView = ({ permission}) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: new Date(fromDate).toLocaleDateString("en-CA"),
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
  });
const {data:rawMaterialInfo}=useGetAllRMItemInformationQuery(undefined)
const {data:itemUnitInformation}=useGetAllItemUnitQuery(undefined)
const {data:finishGoodsInfo}=useGetAllItemInformationQuery(undefined)
const {data:itemSizeInfo}=useGetAllItemSizeQuery(undefined)
  const [
    triggerCombineReport,
    { data: combineReportData },
  ] = useLazyGetManagementCombineReportQuery();

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      // trigger(filters);
      setExecuteQuery(false);
    }
  }, [executeQuery]);

  const handleApplyFilters = async (updatedFilters) => {
    console.log(updatedFilters)
    setExecuteQuery(true);
    await triggerCombineReport(updatedFilters);
  };

  return (
    <div
      className="row px-5 mx-2"
      style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
      {
        <CommonParameterForCombineReport
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          handleApplyFilters={handleApplyFilters}
          filters={filters}
          setFilters={setFilters}
        />
      }
      {/* {isTableDispaly &&  */}
      <CombineDataTableReport 
      combineReportData={combineReportData}
      rawMaterialInfo={rawMaterialInfo}
      itemUnitInformation={itemUnitInformation}
      finishGoodsInfo={finishGoodsInfo}
      itemSizeInfo={itemSizeInfo}
      permission={ permission}
      ></CombineDataTableReport>
      {/* } */}
    </div>
  );
};

export default CombineReportView;
