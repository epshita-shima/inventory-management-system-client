export const getPurchaseColumns = (rawMaterialInfo, itemUnitInformation) => [
  {
    name: "Sl.",
    selector: (row, index) => index + 1,
    center: true,
    width: "60px",
  },

  {
    name: "Item Name",
    selector: (row) => row.itemName,
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "Unit",
    selector: (row) => {
      const itemName = rawMaterialInfo?.find((x) => row?.itemId == x._id);
      const itemUnit = itemUnitInformation?.find((size) => size._id == itemName?.unitId);
      return itemName ? `${itemUnit?.unitInfo}` : "N/A";
    },
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "Purchase Qty",
    selector: (row) => row.totalPurchaseQuantity,
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "Purchase Rate in Avg",
    selector: (row) => Math.round(row.purchaseRateinAvg),
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "Purchase Amount",
    selector: (row) => row.totalPurchaseAmount,
    sortable: true,
    center: true,
    filterable: true,
  },
];