import React from "react";
import { Line } from "react-chartjs-2";

export const FinishGoodsPRoductionLine = ({finishGoodsProductionData,months,backgroundColors}) => {
  const itemNamesFinishGoods = [
    ...new Set(
      finishGoodsProductionData?.monthlyFinishGoodsProductionData
        ?.map((item) => item.itemName?.trim())
        ?.filter((name) => name)
    ),
  ];
  const uniqueItemNames = [...new Set(itemNamesFinishGoods)];

  const datasetsFinishGoodsProduction = uniqueItemNames?.map(
    (itemName, index) => {
      return {
        label: itemName,
        data: months.map(
          (month) =>
            finishGoodsProductionData?.monthlyFinishGoodsProductionData?.find(
              (item) => item.month === month && item.itemName === itemName
            )?.totalMonthlyQty || 0
        ),
        borderColor: backgroundColors[index % backgroundColors.length],
        backgroundColor: backgroundColors[index % backgroundColors.length],
        tension: 0.3, // Smooth curve
      };
    }
  );

  const dataFinishGoodsProductionLine = {
    labels: months,
    datasets: datasetsFinishGoodsProduction,
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
  return (
    <Line
      data={dataFinishGoodsProductionLine}
      options={optionsFinishProductionLine}
    />
  );
};
