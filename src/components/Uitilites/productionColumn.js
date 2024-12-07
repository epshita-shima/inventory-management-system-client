/* eslint-disable jsx-a11y/anchor-is-valid */
export const getProductionColumns = ( finishGoodsInfo,itemSizeInfo,itemUnitInformation,permission) => [
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
    name: "Production Qty",
    selector: (row) => row.totalProductionQty,
    sortable: true,
    center: true,
    filterable: true,
  },
  {
    name: "Action",
    button: true,
    width: "150px",
    grow: 2,
    cell: (row) => (
      <div className="d-flex justify-content-between align-content-center position-relative">
        {permission?.isPDF && (
          <div className="table-head-icon d-flex">
            <div className="dropdown">
              <button
                className="btn btn-download dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Download
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
                style={{
                  zIndex: 1050,
                  position: "absolute",
                }}
              >
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={async () => {
                      // Your PDF logic here
                    }}
                  >
                    PDF
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => {
                      // Your Excel logic here
                    }}
                  >
                    Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    ),
  }
  
];