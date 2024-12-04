export const getReturnColumns = ( finishGoodsInfo,itemSizeInfo,itemUnitInformation) => [
  {
    name: "Sl.",
    selector: (row, index) => index + 1,
    center: true,
    width: "60px",
  },

  {
    name: "Item Name",
    selector: (row) => {
      const itemName = finishGoodsInfo?.find((x) => row?.itemId == x._id);
      const itemSize = itemSizeInfo?.find((size) => size._id == itemName?.sizeId);
      return itemName ? `${itemName?.itemName} (${itemSize.sizeInfo})` : "N/A";
    },
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "Unit",
    selector: (row) => {
      const itemName = finishGoodsInfo?.find((x) => row?.itemId == x._id);
      const itemUnit = itemUnitInformation?.find((size) => size._id == itemName?.unitId);
      return itemName ? `${itemUnit?.unitInfo}` : "N/A";
    },
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "PI Quantity",
    selector: (row) => row.totalReturnQuantity,
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "PI Rate in Avg",
    selector: (row) => Math.round(row.returnRateinAvg),
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "PI Amount",
    selector: (row) => row.totalReturnAmount,
    sortable: true,
    center: true,
    filterable: true,
  },
];