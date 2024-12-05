import React, { useEffect, useState } from "react";
import CommonParameterForCombineReport from "./CommonParameterForCombineReport";
import CombineDataTableReport from "./CombineDataTableReport";
import { useLazyGetManagementCombineReportQuery } from "../../../redux/features/combinereport/combinereportApi";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetAllItemUnitQuery } from "../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useLazyGetSalesDetailsReportQuery } from "../../../redux/features/salesreport/allreportApi";
import {useGetCompanyInfoQuery} from "../../../redux/features/companyinfo/compayApi";
import { useGetAllInvoiceInformationQuery } from "../../../redux/features/invoiceinformation/invoiceinfoApi";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";

const CombineReportView = ({ permission }) => {
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

  const [triggerCombineReport, { data: combineReportData }] =
    useLazyGetManagementCombineReportQuery();

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      // trigger(filters);
      setExecuteQuery(false);
    }
  }, [executeQuery]);
  const [triggerSalesDetailsReport, { data: salesDetailsData }] =
    useLazyGetSalesDetailsReportQuery();
  const handleApplyFilters = async (updatedFilters) => {
    console.log(updatedFilters);
    setExecuteQuery(true);
    await triggerCombineReport(updatedFilters);
    await triggerSalesDetailsReport(updatedFilters);
  };
  console.log(salesDetailsData);

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
        permission={permission}
        salesDetailsData={salesDetailsData}
        companyinfo={companyinfo}
        piInformation={piInformation}
        clientInformation={clientInformation}
      ></CombineDataTableReport>
      {/* } */}
    </div>
  );
};

export default CombineReportView;
