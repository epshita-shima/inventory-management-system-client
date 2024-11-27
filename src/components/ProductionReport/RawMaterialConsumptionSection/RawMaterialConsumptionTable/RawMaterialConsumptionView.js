import React, { useEffect, useState } from "react";
import RawMaterialDetailsView from "../RawMaterialDetailsView/RawMaterialDetailsView";
import CommonParameterRawMaterial from "../CommonParameterRawMaterial/CommonParameterRawMaterial";
import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetAllRMItemInformationQuery } from "../../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { rawMaterialItemDropdown } from "../../../Common/CommonDropdown/CommonDropdown";
import { useLazyGetRawMaterialDetailsConsumptionReportQuery } from "../../../../redux/features/productionreport/productionreportApi";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";

const RawMaterialConsumptionView = ({ permission }) => {
  const [isRawMaterialDetails, setIsRawMaterialDetails] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: new Date(fromDate).toLocaleDateString("en-CA"),
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
    itemId: "",
    reportStatus: "",
  });
  const { data: itemUnitInformation } = useGetAllItemUnitQuery(undefined);
  const { data: rawMaterialDataInfo } =
    useGetAllRMItemInformationQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: finishGoodsItemInfo } =
    useGetAllItemInformationQuery(undefined);
  const { data: itemSizeInfo } = useGetAllItemSizeQuery(undefined);
  const [
    triggerRawMaterialDetailsReport,
    { data: rawMaterialConsumptionDetailsData },
  ] = useLazyGetRawMaterialDetailsConsumptionReportQuery();

  const itemsOptions = rawMaterialItemDropdown(rawMaterialDataInfo);
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
    if (updatedFilters.reportStatus === "rawmaterialconsumptiondetails") {
      await triggerRawMaterialDetailsReport(updatedFilters);
    }
  };

  console.log({ rawMaterialConsumptionDetailsData });
  console.log("isRawMaterialDetails", isRawMaterialDetails);
  return (
    <div>
      <div
        className="row px-5 mx-2"
        style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
      >
        <CommonParameterRawMaterial
          fromDate={fromDate}
          setFromDate={setFromDate}
          setFilters={setFilters}
          toDate={toDate}
          setToDate={setToDate}
          // clientInfoOptions={clientInfoOptions}
          filters={filters}
          // piInfoOptions={piInfoOptions}
          itemsOptions={itemsOptions}
          handleApplyFilters={handleApplyFilters}
          setIsRawMaterialDetails={setIsRawMaterialDetails}
          setIsTableDisplay={setIsTableDisplay}
        />

        {isRawMaterialDetails && (
          <RawMaterialDetailsView
            permission={permission}
            isTableDispaly={isTableDispaly}
            setIsTableDisplay={setIsTableDisplay}
            filteredDatas={rawMaterialConsumptionDetailsData}
            rawMaterialDataInfo={rawMaterialDataInfo}
            itemUnitInformation={itemUnitInformation}
            companyinfo={companyinfo}
            filters={filters}
            finishGoodsItemInfo={finishGoodsItemInfo}
            itemSizeInfo={itemSizeInfo}
          />
        )}
      </div>
    </div>
  );
};

export default RawMaterialConsumptionView;
