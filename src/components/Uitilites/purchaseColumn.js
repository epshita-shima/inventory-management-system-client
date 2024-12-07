/* eslint-disable jsx-a11y/anchor-is-valid */
export const getPurchaseColumns = (rawMaterialInfo, itemUnitInformation,permission) => [
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
  {
    name: "Action",
    button: true,
    width: "150px",
    grow: 2,
    cell: (row) => (
      <div className="d-flex justify-content-between align-content-center">
        {permission?.isPDF && (
          <div className="table-head-icon d-flex">
            <div class="dropdown">
              <button
                class="btn btn-download dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Download
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={async() => {

                      // const filteredData = salesDetailsData
                      //   ?.map((salesData) => {
                      //     const matchedDetails =
                      //       salesData.detailsData?.filter(
                      //         (details) => details.itemId === row?.itemId
                      //       );

                      //     if (matchedDetails.length > 0) {
                      //       return {
                      //         ...salesData,
                      //         detailsData: matchedDetails,
                      //       };
                      //     }

                      //     return null;
                      //   })
                      //   .filter((item) => item !== null);

                      // const groupData = groupSalesDataByDetails(filteredData);
                      // const convertGroupData=Object.values(groupData)
                      // if (companyinfo?.length !== 0) {
                      //   downloadGoupSalesDetailsPDF(
                      //     groupData,
                      //     filteredData,
                      //     piInformation,
                      //     finishGoodsInfo,
                      //     itemSizeInfo,
                      //     clientInformation,
                      //     { companyinfo },
                      //     reportSalesTitle
                      //   );
                      // }
                    }}
                  >
                    PDF
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() => {
                      // const filteredData = salesDetailsData
                      //   ?.map((salesData) => {
                      //     const matchedDetails =
                      //       salesData.detailsData?.filter(
                      //         (details) => details.itemId === row?.itemId
                      //       );
                      //     if (matchedDetails.length > 0) {
                      //       return {
                      //         ...salesData,
                      //         detailsData: matchedDetails,
                      //       };
                      //     }
                      //     return null;
                      //   })
                      //   .filter((item) => item !== null);

                      // const transformedPIData = filteredData?.flatMap(
                      //   (piDetails) =>
                      //     piDetails.detailsData.map((detail) => ({
                      //       ...piDetails,
                      //       detailsData: detail,
                      //     }))
                      // );
                      // handleSalesDetailsExcel(
                      //   transformedPIData,
                      //   filteredData,
                      //   piInformation,
                      //   finishGoodsInfo,
                      //   itemSizeInfo,
                      //   clientInformation,
                      //   companyinfo,
                      //   reportSalesTitle
                      // );
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
  },
];