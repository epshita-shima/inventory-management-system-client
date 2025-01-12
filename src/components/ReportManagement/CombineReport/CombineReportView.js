import React, { useEffect, useState } from "react";
import CommonParameterForCombineReport from "./CommonParameterForCombineReport";
import CombineDataTableReport from "./CombineDataTableReport";
import { useLazyGetManagementCombineReportQuery } from "../../../redux/features/combinereport/combinereportApi";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetAllItemUnitQuery } from "../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/finishgoodsinfoApi";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetCompanyInfoQuery } from "../../../redux/features/companyinfo/compayApi";
import { useGetAllInvoiceInformationQuery } from "../../../redux/features/invoiceinformation/invoiceinfoApi";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";
import { useGetAllSupplierInformationQuery } from "../../../redux/features/supplierInformation/supplierInfoApi";
import LoadingSpineer from "../../Common/LoadingSpinner/LoadingSpineer";

const CombineReportView = ({ permission, dropdownMenuStyles }) => {
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
  const { data: supplierInformation } =
    useGetAllSupplierInformationQuery(undefined);

  const [
    triggerCombineReport,
    { data: combineReportData, isLoading: isCombineDataLoading },
  ] = useLazyGetManagementCombineReportQuery();

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      setExecuteQuery(false);
    }
  }, [executeQuery]);

  const handleApplyFilters = async (updatedFilters) => {
    setExecuteQuery(true);
    await triggerCombineReport(updatedFilters);
  };

  return (
    <div className="row px-5 mx-2">
      {
        <CommonParameterForCombineReport
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
      <LoadingSpineer isLoading={isCombineDataLoading}></LoadingSpineer>
      <div className={`${isCombineDataLoading ? "d-none" : "d-block"}`}>
        {isTableDispaly && (
          <CombineDataTableReport
            combineReportData={combineReportData}
            rawMaterialInfo={rawMaterialInfo}
            itemUnitInformation={itemUnitInformation}
            finishGoodsInfo={finishGoodsInfo}
            itemSizeInfo={itemSizeInfo}
            permission={permission}
            companyinfo={companyinfo}
            piInformation={piInformation}
            clientInformation={clientInformation}
            supplierInformation={supplierInformation}
            filters={filters}
            dropdownMenuStyles={dropdownMenuStyles}
          ></CombineDataTableReport>
        )}
      </div>
    </div>
  );
};

export default CombineReportView;
