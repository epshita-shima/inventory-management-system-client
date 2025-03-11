import React from 'react'
import { Pie } from 'react-chartjs-2'

const PIChart = ({rawMaterialData,backgroundColors,purchaseDetailsData}) => {
  const itemMap = new Map();
  purchaseDetailsData?.forEach((entry) => {
    entry.detailsData?.forEach(({ itemId, amount }) => {
      itemMap.set(itemId, (itemMap.get(itemId) || 0) + amount);
    });
  });
console.log(purchaseDetailsData)
  const aggregatedData = Array.from(itemMap, ([itemId, amount]) => ({
    itemId,
    amount,
  }));

  console.log(aggregatedData)
  const labels = aggregatedData?.map((itemId) => {
    const foundItem = rawMaterialData.find(
      (item) => String(item._id) === String(itemId.itemId)
    );
    console.log(foundItem);
    return foundItem ? foundItem.itemName : `Unknown (${itemId})`;
  });
  console.log(labels)
  const colors = labels.map(
    (_, index) => backgroundColors[index % backgroundColors.length]
  );

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
  const optionsPI = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };
  return  <Pie data={dataPI} options={optionsPI} />
}

export default PIChart
