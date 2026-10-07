import React from 'react'
import { Pie } from 'react-chartjs-2'

const PIChart = ({rawMaterialData,backgroundColors,purchaseDetailsData}) => {
  const itemMap = new Map();
  const itemList = Array.isArray(rawMaterialData) ? rawMaterialData : [];
  const colorList = Array.isArray(backgroundColors) ? backgroundColors : [];
  const purchaseRows = Array.isArray(purchaseDetailsData)
    ? purchaseDetailsData
    : [];
  purchaseRows.forEach((entry) => {
    entry.detailsData?.forEach(({ itemId, amount }) => {
      itemMap.set(itemId, (itemMap.get(itemId) || 0) + amount);
    });
  });
  const aggregatedData = Array.from(itemMap, ([itemId, amount]) => ({
    itemId,
    amount,
  }));

  const labels = aggregatedData.map((row) => {
    const foundItem = itemList.find(
      (item) => String(item._id) === String(row.itemId)
    );
    return foundItem ? foundItem.itemName : `Unknown (${row.itemId})`;
  });
  const colors = labels.map(
    (_, index) => colorList[index % (colorList.length || 1)]
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
