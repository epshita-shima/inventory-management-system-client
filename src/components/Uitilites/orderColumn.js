export const getOrderColumns = ( finishGoodsInfo,itemSizeInfo,itemUnitInformation) => [
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
    selector: (row) => row.totalPiQuantity,
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "PI Rate in Avg",
    selector: (row) => Math.round(row.piRateinAvg),
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "PI Amount",
    selector: (row) => row.totalPiAmount,
    sortable: true,
    center: true,
    filterable: true,
  },
];