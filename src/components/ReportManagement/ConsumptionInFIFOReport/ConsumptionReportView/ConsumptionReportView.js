import React, { useState } from "react";
import CommonParameter from "../CommonParameter/CommonParameter";
import { useGetAllRMItemInformationQuery } from "../../../../redux/features/iteminformation/rmItemInfoApi";
import { rawMaterialItemDropdown } from "../../../Common/CommonDropdown/CommonDropdown";
import { useLazyGetConsumptionReportQuery } from "../../../../redux/features/consumptionfiforeport/consumpreportApi";
import ConsumptionDataTable from "./ConsumptionDataTable";

const ConsumptionReportView = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showTable,setShowTable]=useState(false)
  const { data: rawMaterialItemList } =
    useGetAllRMItemInformationQuery(undefined);
  const itemOptions = rawMaterialItemDropdown(rawMaterialItemList);

  const [filters, setFilters] = useState({
    fromDate: new Date(fromDate).toLocaleDateString("en-CA"),
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
    itemId: "",
    reportStatus: "",
  });
  const [trigerConsumptionData, { data: consumptionDetails }] =
    useLazyGetConsumptionReportQuery();

  const hangleGetConsumptionData = async (updatedFilters) => {
    console.log(updatedFilters);
    await trigerConsumptionData(updatedFilters);
  };


  return (
    <div  className="row px-5 mx-2"
    // style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
      <CommonParameter
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        itemsOptions={itemOptions}
        filters={filters}
        setFilters={setFilters}
        hangleGetConsumptionData={hangleGetConsumptionData}
        consumptionData={consumptionDetails}
        setShowTable={setShowTable}
        showTable={showTable}
      ></CommonParameter>
      <ConsumptionDataTable
        consumptionData={consumptionDetails}
        rawMaterialList={rawMaterialItemList}
        showTable={showTable}
      ></ConsumptionDataTable>
    </div>
  );
};

export default ConsumptionReportView;
