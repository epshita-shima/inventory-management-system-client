import React, { useState, useEffect } from "react";
import { useGetAllItemInformationQuery } from "../../redux/features/iteminformation/finishgoodsinfoApi";
import {
  finishGoodsWithSizeItemDropdown,
  rawMaterialItemDropdown,
} from "../../components/Common/CommonDropdown/CommonDropdown";
import { useGetAllItemSizeQuery } from "../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useLazyGetSalesSummaryReportQuery } from "../../redux/features/salesreport/allreportApi";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import FinishGoodsProductionLineChart from "./FinishGoodsProductionLineChart/FinishGoodsProductionLineChart";
import { useGetAllHeadingTotalInfoQuery } from "../../redux/features/dashboardchart/dashboardchartApi";
import SalesDataBarChart from "./SalesDataBarChart/SalesDataBarChart";
import { useLazyGetPurchaseDetailsReportQuery } from "../../redux/features/purchasereport/purchasereportApi";
import PurchaseDataPIChart from "./PurchaseDataPIChart/PurchaseDataPIChart";
import { useGetAllRMItemInformationQuery } from "../../redux/features/iteminformation/rmItemInfoApi";
import RawConsumptionLineChat from "./RawConsumptionLineChart/RawConsumptionLineChat";
import {
  useLazyGetProductionDatewiseSummaryReportQuery,
  useLazyGetRawMaterialSummaryConsumptionReportQuery,
} from "../../redux/features/productionreport/productionreportApi";
import { Barchart } from "./Chart/Barchart";
import PIChart from "./Chart/PIChart";
import { RawMaterialConsumptionLine } from "./Chart/RawMaterialConsumptionLine";
import { FinishGoodsPRoductionLine } from "./Chart/FinishGoodsPRoductionLine";
import LoadingSpineer from "../../components/Common/LoadingSpinner/LoadingSpineer";
ChartJS.register(
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const {
    data: headingTotalInfo,
    isLoading: headingDataLoading,
    error,
  } = useGetAllHeadingTotalInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [triggerSalesSummaryReport, { data: salesSummaryData }] =
    useLazyGetSalesSummaryReportQuery();
  const [triggerPurchaseDetailsReport, { data: purchaseDetailsData }] =
    useLazyGetPurchaseDetailsReportQuery();
  const [triggerRawConsumptionSummaryReport, { data: rawConsumptionData }] =
    useLazyGetRawMaterialSummaryConsumptionReportQuery();
  const [
    triggerFinishGoodsProductionSummaryReport,
    { data: finishGoodsProductionData },
  ] = useLazyGetProductionDatewiseSummaryReportQuery();

  function getBackDate(date, daysToSubtract) {
    const result = new Date(date);
    result.setDate(result.getDate() - daysToSubtract); // Subtract days
    return result.toLocaleDateString("en-CA"); // Format to "YYYY-MM-DD"
  }
  console.log(finishGoodsProductionData);
  const [fromDate, setFromDate] = useState(getBackDate(new Date(), 1));
  const [toDate, setToDate] = useState(new Date());
  const [purchaseFromDate, setPurchaseFromDate] = useState(
    getBackDate(new Date(), 1)
  );
  const [purchaseToDate, setPurchaseToDate] = useState(new Date());
  const [rawConsumptionFromDate, setRawConsumptionFromDate] = useState(
    getBackDate(new Date(), 1)
  );
  const [rawConsumptionToDate, setRawConsumptionToDate] = useState(new Date());
  const [finishGoodsProductionFromDate, setFinishGoodsProductionFromDate] =
    useState(getBackDate(new Date(), 1));
  const [finishGoodsProductionToDate, setFinishGoodsProductionToDate] =
    useState(new Date());

  const [filters, setFilters] = useState({
    fromDate: fromDate,
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
    itemId: "",
    reportStatus: "",
  });
  const [purchaseFilters, setPurchaseFilters] = useState({
    fromDate: purchaseFromDate,
    toDate: new Date(purchaseToDate).toLocaleDateString("en-CA"),
    itemId: "",
    reportStatus: "",
  });
  const [rawConsumptionFilters, setRawConsumptionFilters] = useState({
    fromDate: purchaseFromDate,
    toDate: new Date(purchaseToDate).toLocaleDateString("en-CA"),
    itemId: "",
    reportStatus: "",
  });
  const [finishGoodsProductionFilters, setFinishGoodsProductionFilters] =
    useState({
      fromDate: finishGoodsProductionFromDate,
      toDate: new Date(finishGoodsProductionToDate).toLocaleDateString("en-CA"),
      productionItemName: "",
      reportStatus: "",
    });
  const { data: rawMaterialData } = useGetAllRMItemInformationQuery(undefined);
  const { data: finishGoods } = useGetAllItemInformationQuery(undefined);
  const { data: itemSizeInfo } = useGetAllItemSizeQuery(undefined);
  const productionOptions = finishGoodsWithSizeItemDropdown(
    finishGoods,
    itemSizeInfo
  );
  const purchaseOptions = rawMaterialItemDropdown(rawMaterialData);

  useEffect(() => {
    if (error) {
      console.error("Error fetching heading total info:", error);
    }
  }, [error]);

  useEffect(() => {
    const updatedFilters = {
      ...filters,
      reportStatus: "",
    };

    const updatedPurchaseFilters = {
      ...purchaseFilters,
      reportStatus: "",
    };
    const updatedRawConsumptionFilters = {
      ...rawConsumptionFilters,
      reportStatus: "",
    };
    const updatedFiltersFinishProduction = {
      ...finishGoodsProductionFilters,
      reportStatus: "",
    };
    const fetchRawConsuptionReport = async () => {
      await triggerRawConsumptionSummaryReport(updatedRawConsumptionFilters);
    };

    const fetchSalesSummaryReport = async () => {
      await triggerSalesSummaryReport(updatedFilters);
    };

    const fetchPurchaseReport = async () => {
      await triggerPurchaseDetailsReport(updatedPurchaseFilters);
    };

    const fetchFinishGoodsReport = async () => {
      await triggerFinishGoodsProductionSummaryReport(
        updatedFiltersFinishProduction
      );
    };
    fetchRawConsuptionReport();
    fetchFinishGoodsReport();
    fetchPurchaseReport();
    fetchSalesSummaryReport();
  }, [
    filters,
    finishGoodsProductionFilters,
    purchaseFilters,
    rawConsumptionFilters,
    triggerFinishGoodsProductionSummaryReport,
    triggerPurchaseDetailsReport,
    triggerRawConsumptionSummaryReport,
    triggerSalesSummaryReport,
  ]);

  const handleApplyFilters = async (updatedFilters) => {
    await triggerSalesSummaryReport(updatedFilters);
  };

  const handleApplyPurchaseFilters = async (updatedFilters) => {
    console.log(updatedFilters);
    await triggerPurchaseDetailsReport(updatedFilters);
  };
  const handleApplyRawConsumptionFilters = async (updatedFilters) => {
    console.log(updatedFilters);
    await triggerRawConsumptionSummaryReport(updatedFilters);
  };
  const handleApplyFinishGoodsProductionFilters = async (updatedFilters) => {
    console.log(updatedFilters);
    await triggerFinishGoodsProductionSummaryReport(updatedFilters);
  };

  const backgroundColors = [
    "#2DDC1B",
    "#AEC536",
    "#849F1A",
    "#8F6239",
    "#55883B",
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="container-fluid">
      <LoadingSpineer isLoading={headingDataLoading}></LoadingSpineer>
      <div style={{ height: "80vh", overflowY: "scroll", overflowX: "hidden" }}>
        <div className="row text-center g-4">
          {/* Total Sales Card */}
          <div
            className="col-sm p-3 rounded shadow-sm"
            style={{ background: "#D6F5D6" }}
          >
            <h3 className="fw-bold fs-3">Total Purchase</h3>
            <div className="row">
              <div className="col-md-6">
                <p className="text-muted">
                  Quantity: {headingTotalInfo?.grandTotalPurchaseQty}
                </p>
              </div>
              <div className="col-md-6">
                <p className="text-muted">
                  Amount: {headingTotalInfo?.grandTotalPurchaseAmount} TK
                </p>
              </div>
            </div>
          </div>

          {/* Total Purchase Card */}
          <div
            className="col-sm p-3 rounded shadow-sm text-black"
            style={{ background: "#B8FEB3" }}
          >
            <h3 className="fw-bold fs-3">Raw Material Consumption</h3>
            <div className="row">
              <div className="col-md-6">
                <p className="text-muted">
                  Quantity: {headingTotalInfo?.grandTotalRawConsumptionQty}
                </p>
              </div>
              <div className="col-md-6">
                {/* <p className="text-muted">Amount: $1,500,000</p> */}
              </div>
            </div>
          </div>

          {/* Finish Goods Production Card */}
          <div
            className="col-sm p-3 rounded shadow-sm"
            style={{ background: "#D6F5D6" }}
          >
            <h3 className="fw-bold fs-3">Finish Goods Production</h3>
            <div className="row">
              <div className="col-md-6 ">
                <p className="text-muted ">
                  Quantity: {headingTotalInfo?.grandTotalProductionItemQty}
                </p>
              </div>
              <div className="col-md-6">
                {/* <p className="text-muted">Amount: $1,500,000</p> */}
              </div>
            </div>
          </div>

          {/* Raw Material Consumption Card */}
          <div
            className="col-sm p-3 rounded shadow-sm text-black"
            style={{ background: "#B8FEB3" }}
          >
            <h3 className="fw-bold fs-3">Total Sales</h3>
            <div className="row">
              <div className="col-md-6">
                <p className="text-muted">
                  Quantity: {headingTotalInfo?.grandTotalSalesQuantity}
                </p>
              </div>
              <div className="col-md-6">
                <p className="text-muted">
                  Amount: {headingTotalInfo?.grandTotalSalesAmount} TK
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row  g-4">
          {/* Purchase Chart */}
          <div className="col-sm-6 shadow-sm d-flex flex-column">
            <h3 className="fs-3 text-center fw-bold">Purchase Information</h3>
            <PurchaseDataPIChart
              handleApplyPurchaseFilters={handleApplyPurchaseFilters}
              purchaseOptions={purchaseOptions}
              filters={purchaseFilters}
              fromDate={purchaseFromDate}
              toDate={purchaseToDate}
              setFilters={setPurchaseFilters}
              setToDate={setPurchaseToDate}
              setFromDate={setPurchaseFromDate}
            ></PurchaseDataPIChart>
            <div
              className="bg-light p-3 rounded shadow my-4 d-flex justify-content-center align-items-center"
              style={{ width: "100%", height: "70%", margin: "auto" }}
            >
              <PIChart
                rawMaterialData={rawMaterialData}
                purchaseDetailsData={purchaseDetailsData}
                backgroundColors={backgroundColors}
              ></PIChart>
            </div>
          </div>

          {/* raw material conxumption chart */}
          <div className="col-sm-6 shadow-sm d-flex flex-column align-items-center">
            <h3 className="text-center fw-bold fs-3">Raw Material Consumption</h3>
            <RawConsumptionLineChat
              handleApplyFilters={handleApplyRawConsumptionFilters}
              purchaseOptions={purchaseOptions}
              filters={rawConsumptionFilters}
              fromDate={rawConsumptionFromDate}
              toDate={rawConsumptionToDate}
              setFilters={setRawConsumptionFilters}
              setToDate={setRawConsumptionToDate}
              setFromDate={setRawConsumptionFromDate}
            ></RawConsumptionLineChat>
            <div
              className="bg-light rounded shadow my-4 d-flex justify-content-center align-items-center"
              style={{ width: "100%", height: "70%", margin: "auto" }}
            >
              <RawMaterialConsumptionLine
                rawConsumptionData={rawConsumptionData}
                months={months}
                backgroundColors={backgroundColors}
              ></RawMaterialConsumptionLine>
            </div>
          </div>
          {/* Finish goods productions Chart */}
          <div className="col-sm-6 shadow-sm d-flex flex-column align-items-center">
            <h3 className="text-center fw-bold fs-3">Finish Goods Production</h3>
            <FinishGoodsProductionLineChart
              handleApplyFinishGoodsProductionFilters={
                handleApplyFinishGoodsProductionFilters
              }
              productionOptions={productionOptions}
              filters={finishGoodsProductionFilters}
              fromDate={finishGoodsProductionFromDate}
              toDate={finishGoodsProductionToDate}
              setFilters={setFinishGoodsProductionFilters}
              setToDate={setFinishGoodsProductionToDate}
              setFromDate={setFinishGoodsProductionFromDate}
            ></FinishGoodsProductionLineChart>
            <div
              className="bg-light rounded shadow my-4 d-flex justify-content-center align-items-center"
              style={{ width: "100%", height: "70%", margin: "auto" }}
            >
              <FinishGoodsPRoductionLine
                finishGoodsProductionData={finishGoodsProductionData}
                months={months}
                backgroundColors={backgroundColors}
              ></FinishGoodsPRoductionLine>
            </div>
          </div>
          {/* Sales Chart */}
          <div className="col-sm-6 shadow-sm d-flex flex-column">
            <h3 className="text-center fw-bold fs-3">Sales Information</h3>
            <SalesDataBarChart
              handleApplyFilters={handleApplyFilters}
              productionOptions={productionOptions}
              filters={filters}
              fromDate={fromDate}
              toDate={toDate}
              setFilters={setFilters}
              setToDate={setToDate}
              setFromDate={setFromDate}
            ></SalesDataBarChart>
            <div
              className="bg-light rounded shadow my-4 "
              style={{ width: "100%", height: "70%", margin: "0 auto" }}
            >
              <Barchart salesSummaryData={salesSummaryData}></Barchart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
