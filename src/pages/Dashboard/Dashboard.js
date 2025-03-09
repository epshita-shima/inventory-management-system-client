import React, { useState, useEffect } from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";
import { useGetAllFinishGoodsDeliveryInformationQuery } from "../../redux/features/finishgoodsdeliveryinfo/finishgoodsdeliveryApi";
import { useGetAllItemInformationQuery } from "../../redux/features/iteminformation/finishgoodsinfoApi";
import {
  finishGoodsWithSizeItemDropdown,
  rawMaterialItemDropdown,
} from "../../components/Common/CommonDropdown/CommonDropdown";
import { useGetAllItemSizeQuery } from "../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLazyGetSalesSummaryReportQuery } from "../../redux/features/salesreport/allreportApi";
import { Bar, Line, Pie } from "react-chartjs-2";
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
import { useLazyGetProductionDatewiseSummaryReportQuery, useLazyGetRawMaterialSummaryConsumptionReportQuery } from "../../redux/features/productionreport/productionreportApi";

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
  const { data: headingTotalInfo } = useGetAllHeadingTotalInfoQuery(undefined);
  const [
    triggerSalesSummaryReport,
    { data: salesSummaryData, isLoading: isSalesSummaryLoading },
  ] = useLazyGetSalesSummaryReportQuery();
  const [
    triggerPurchaseDetailsReport,
    { data: purchaseDetailsData, isLoading: isPurchaseDetailsLoading },
  ] = useLazyGetPurchaseDetailsReportQuery();
  const [triggerRawConsumptionSummaryReport, { data: rawConsumptionData }] =
    useLazyGetRawMaterialSummaryConsumptionReportQuery();
  const [triggerFinishGoodsProductionSummaryReport,{data:finishGoodsProductionData}] =
  useLazyGetProductionDatewiseSummaryReportQuery();

  function getBackDate(date, daysToSubtract) {
    const result = new Date(date);
    result.setDate(result.getDate() - daysToSubtract); // Subtract days
    return result.toLocaleDateString("en-CA"); // Format to "YYYY-MM-DD"
  }
console.log(finishGoodsProductionData)
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
  const [finishGoodsProductionFromDate, setFinishGoodsProductionFromDate] = useState(
    getBackDate(new Date(), 1)
  );
  const [finishGoodsProductionToDate, setFinishGoodsProductionToDate] = useState(new Date());

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
  const [finishGoodsProductionFilters, setFinishGoodsProductionFilters] = useState({
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
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        reportStatus: "",
      };
      triggerSalesSummaryReport(updatedFilters);
      return updatedFilters;
    });
    setPurchaseFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        reportStatus: "",
      };

      triggerPurchaseDetailsReport(updatedFilters);
      return updatedFilters;
    });
    setRawConsumptionFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        reportStatus: "",
      };

      triggerRawConsumptionSummaryReport(updatedFilters);
      return updatedFilters;
    });
    setFinishGoodsProductionFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        reportStatus: "",
      };

      triggerFinishGoodsProductionSummaryReport(updatedFilters);
      return updatedFilters;
    });
  }, []);

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


  const itemMap = new Map();

  purchaseDetailsData?.forEach((entry) => {
    entry.detailsData?.forEach(({ itemId, amount }) => {
      itemMap.set(itemId, (itemMap.get(itemId) || 0) + amount);
    });
  });

  const aggregatedData = Array.from(itemMap, ([itemId, amount]) => ({
    itemId,
    amount,
  }));

  const labels = aggregatedData?.map((itemId) => {
    const foundItem = rawMaterialData.find(
      (item) => String(item._id) === String(itemId.itemId)
    );
    console.log(foundItem);
    return foundItem ? foundItem.itemName : `Unknown (${itemId})`;
  });

  const backgroundColors = [
    "#2DDC1B",
    "#AEC536",
    "#849F1A",
    "#8F6239",
    "#55883B",
  ];
  const colors = labels.map(
    (_, index) => backgroundColors[index % backgroundColors.length]
  );

  const months =[
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
  const itemNames = [...new Set(rawConsumptionData?.monthlyRawConsumptionData?.map((item) => item.itemName))];
 

  const itemNamesFinishGoods = [...new Set(finishGoodsProductionData?.monthlyFinishGoodsProductionData?.map((item) => item.itemName?.trim())?.filter((name)=>name))];
  const uniqueItemNames = [...new Set(itemNamesFinishGoods)];
 console.log(uniqueItemNames)
  const datasets = itemNames?.map((itemName, index) => {
    return {
      label: itemName,
      data: months.map(
        (month) =>
          rawConsumptionData?.monthlyRawConsumptionData?.find((item) => item.month === month && item.itemName === itemName)?.totalMaterialUsed || 0
      ),
      borderColor: backgroundColors[index % backgroundColors.length],
      backgroundColor: backgroundColors[index % backgroundColors.length],
      tension: 0.3, 
    };
  });
 
  const datasetsFinishGoodsProduction = uniqueItemNames?.map((itemName, index) => {
    return {
      label: itemName,
      data: months.map(
        (month) =>
          finishGoodsProductionData?.monthlyFinishGoodsProductionData?.find((item) => item.month === month && item.itemName === itemName)?.totalMonthlyQty || 0
      ),
      borderColor: backgroundColors[index % backgroundColors.length],
      backgroundColor: backgroundColors[index % backgroundColors.length],
      tension: 0.3, // Smooth curve
    };
  });

  const dataLine = {
    labels: months,
    datasets: datasets,
   
  };

  const dataFinishGoodsProductionLine = {
    labels: months,
    datasets: datasetsFinishGoodsProduction,
   
  };

  const dataBar = {
    labels: salesSummaryData?.monthlySalesData?.map((item) => item.month),
    datasets: [
      {
        label: "Sales",
        data: salesSummaryData?.monthlySalesData?.map(
          (item) => item.totalMonthlyQty
        ),
        backgroundColor: "#B8FEC5", // Blue
        borderColor: "#B8FEC5",
        borderWidth:salesSummaryData?.length > 0 ?  salesSummaryData?.monthlySalesData.map((val) =>
          Math.max(1, val / 10)
        ) : 2,
      },
    ],
  };

  const dataPI = {
    labels: labels,
    datasets: [
      {
        data: aggregatedData?.map((item) => item.amount),
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const optionsLine = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          borderWidth: 2,
          color: "rgba(0,0,0,0.1)",
        },
        ticks: {
          padding: 10,
        },
        borderWidth: 5,
        borderColor: "#2DDC1B",
        width: "100%",
      },
      y: {
        grid: {
          borderWidth: 2,
          color: "rgba(0,0,0,0.1)",
        },
        ticks: {
          padding: 10,
        },
        borderWidth: 10,
        borderColor: "#2DDC1B",
      },
    },
  };
  const optionsFinishProductionLine = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          borderWidth: 2,
          color: "rgba(0,0,0,0.1)",
        },
        ticks: {
          padding: 10,
        },
        borderWidth: 5,
        borderColor: "#2DDC1B",
        width: "100%",
      },
      y: {
        grid: {
          borderWidth: 2,
          color: "rgba(0,0,0,0.1)",
        },
        ticks: {
          padding: 10,
        },
        borderWidth: 10,
        borderColor: "#2DDC1B",
      },
    },
  };

  const optionsPI = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="container-fluid">
      <div style={{ height: "80vh", overflowY: "scroll", overflowX: "hidden" }}>
        <div className="row text-center g-4">
          
          {/* Total Sales Card */}
          <div className="col-sm p-3 rounded shadow-sm" style={{ background: "#D6F5D6" }}>
            <h3 className="fw-bold">Total Sales</h3>
            <div className="row">
              <div className="col-md-6">
                <p className="text-muted">Quantity: {headingTotalInfo?.grandTotalSalesQuantity}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted">Amount: {headingTotalInfo?.grandTotalSalesAmount} TK</p>
              </div>
            </div>
          </div>
  
          {/* Total Purchase Card */}
          <div className="col-sm p-3 rounded shadow-sm text-black" style={{ background: "#B8FEB3" }}>
            <h3 className="fw-bold">Total Purchase</h3>
            <div className="row">
              <div className="col-md-6">
                <p className="text-muted">Quantity: {headingTotalInfo?.grandTotalPurchaseQty}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted">Amount: {headingTotalInfo?.grandTotalPurchaseAmount} TK</p>
              </div>
            </div>
          </div>
  
          {/* Finish Goods Production Card */}
          <div className="col-sm p-3 rounded shadow-sm" style={{ background: "#D6F5D6" }}>
            <h3 className="fw-bold">Finish Goods Production</h3>
            <div className="row">
              <div className="col-md-6">
                <p className="text-muted">Quantity: {headingTotalInfo?.grandTotalProductionItemQty}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted">Amount: $1,500,000</p>
              </div>
            </div>
          </div>
  
          {/* Raw Material Consumption Card */}
          <div className="col-sm p-3 rounded shadow-sm text-black" style={{ background: "#B8FEB3" }}>
            <h3 className="fw-bold">Raw Material Consumption</h3>
            <div className="row">
              <div className="col-md-6">
                <p className="text-muted">Quantity: {headingTotalInfo?.grandTotalRawConsumptionQty}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted">Amount: $1,500,000</p>
              </div>
            </div>
          </div>
  
        </div>
  
        {/* Charts Section */}
        <div className="row mt-4 g-4">
          
          {/* Sales Chart */}
          <div className="col-sm-6 shadow-sm p-4 d-flex flex-column">
            <h3 className="text-center fw-bold">Sales Information</h3>
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
            <div className="bg-light p-3 rounded shadow mt-4" style={{ width: "100%", height: "70%", margin: "auto" }}>
              <Bar data={dataBar} options={options} />
            </div>
          </div>
          <div className="col-sm-6 shadow-sm p-4 d-flex flex-column">
            <h3 className="text-center fw-bold">Purchase Information</h3>
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
           <div className="bg-light p-3 rounded shadow mt-4 d-flex justify-content-center align-items-center" style={{ width: "100%", height: "70%", margin: "auto" }}>
              <Pie data={dataPI} options={optionsPI} />
            </div>
          </div>
  
          {/* Purchase Chart */}
          <div className="col-sm-6 shadow-sm p-4 d-flex flex-column align-items-center">
            <h3 className="text-center fw-bold">Purchase Information</h3>
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
            <div className="bg-light p-3 rounded shadow mt-4 d-flex justify-content-center align-items-center" style={{ width: "100%", height: "70%", margin: "auto" }}>
            <Line data={dataLine} options={optionsLine} />
            </div>
          </div>
          <div className="col-sm-6 shadow-sm p-4 d-flex flex-column align-items-center">
            <h3 className="text-center fw-bold">Raw Material Consumption</h3>
            <FinishGoodsProductionLineChart
                handleApplyFinishGoodsProductionFilters={handleApplyFinishGoodsProductionFilters}
                productionOptions={productionOptions}
                filters={finishGoodsProductionFilters}
                fromDate={finishGoodsProductionFromDate}
                toDate={finishGoodsProductionToDate}
                setFilters={setFinishGoodsProductionFilters}
                setToDate={setFinishGoodsProductionToDate}
                setFromDate={setFinishGoodsProductionFromDate}
              ></FinishGoodsProductionLineChart>
            <div className="bg-light p-3 rounded shadow mt-4 d-flex justify-content-center align-items-center" style={{ width: "100%", height: "70%", margin: "auto" }}>
            <Line data={dataFinishGoodsProductionLine} options={optionsFinishProductionLine} />
            </div>
          </div>
  
        </div>
      </div>
    </div>
  );
  



};



export default Dashboard;
