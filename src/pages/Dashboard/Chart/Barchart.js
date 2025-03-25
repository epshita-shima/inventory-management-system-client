import React from "react";
import { Bar } from "react-chartjs-2";
export const Barchart = ({ salesSummaryData }) => {
  console.log(salesSummaryData);
  const dataBar = {
    labels: salesSummaryData?.monthlySalesData?.map((item) => item.month),
    datasets: [
      {
        label: "Sales Amount",
        data: salesSummaryData?.monthlySalesData?.map(
          (item) => item.totalMonthlyAmount
        ),
        backgroundColor: "#B8FEC5", // Blue
        borderColor: "#B8FEC5",
        borderWidth:
          salesSummaryData?.length > 0
            ? salesSummaryData?.monthlySalesData.map((val) =>
                Math.max(1, val / 10)
              )
            : 2,
        barThickness: 40,
        categoryPercentage: 1.0, // Align with label
        barPercentage: 0.6,
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const amount = tooltipItem.raw;
              const month = tooltipItem.label;
              const yearData =
                salesSummaryData?.monthlySalesData?.find(
                  (item) => item.month === month
                )?.detailsData || [];

              let tooltipText = [`${tooltipItem.dataset.label}: ${amount}tk`];

              yearData.forEach((detail) => {
                const yearMonth = Object.keys(detail)[0];
                const totalQty = detail[yearMonth]?.totalQty || 0;
                const totalAmount = detail[yearMonth]?.totalAmount || 0;

                tooltipText.push(
                  `${yearMonth}: Sales Amount ${totalAmount}tk, Qty: ${totalQty}`
                );
              });

              return tooltipText;
            },
          },
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
        mode: "index", // Show data for all datasets (Qty and Amount) at the same time
        intersect: false, // Hovering over the entire bar will show both datasets
        callbacks: {
          title: function (tooltipItem) {
            return tooltipItem[0].label; // Show the month as the tooltip title
          },
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`; // Show each dataset's value
          },
        },
      },
    },
    scales: {
      x: {
        offset: false,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return <Bar data={dataBar} options={options} />;
};
