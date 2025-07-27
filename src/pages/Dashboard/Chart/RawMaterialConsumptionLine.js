import React from 'react'
import { Line } from 'react-chartjs-2';

export const RawMaterialConsumptionLine = ({rawConsumptionData,months,backgroundColors}) => {
  const itemNames = [
    ...new Set(
      rawConsumptionData?.monthlyRawConsumptionData?.map(
        (item) => item.itemName
      )
    ),
  ];
  const datasets = itemNames?.map((itemName, index) => {
    return {
      label: itemName,
      data: months.map(
        (month) =>
          rawConsumptionData?.monthlyRawConsumptionData?.find(
            (item) => item.month === month && item.itemName === itemName
          )?.totalMaterialUsed || 0
      ),
      borderColor: backgroundColors[index % backgroundColors.length],
      backgroundColor: backgroundColors[index % backgroundColors.length],
      tension: 0.3,
    };
  });

  const dataLine = {
    labels: months,
    datasets: datasets,
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
  return         <Line data={dataLine} options={optionsLine} />
}

