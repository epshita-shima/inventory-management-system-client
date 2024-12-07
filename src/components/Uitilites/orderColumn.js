/* eslint-disable jsx-a11y/anchor-is-valid */
import handleOrderDetailsExcel from './../ReportProperties/Excel/handleOrderDetailsExcel';
import { groupOrderDateByDetails, groupSalesDataByDetails } from './salesDetailsDataGrouping';
export const getOrderColumns = ( finishGoodsInfo,itemSizeInfo,itemUnitInformation,permission,orderDetailsData,piInformation,clientInformation,companyinfo,reportOrderTitle) => [
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

                      const filteredData = orderDetailsData
                        ?.map((salesData) => {
                          const matchedDetails =
                            salesData.detailsData?.filter(
                              (details) => details.itemId === row?.itemId
                            );

                          if (matchedDetails.length > 0) {
                            return {
                              ...salesData,
                              detailsData: matchedDetails,
                            };
                          }

                          return null;
                        })
                        .filter((item) => item !== null);

                      const groupData = groupOrderDateByDetails(filteredData);
                      const convertGroupData=Object.values(groupData)
                      if (companyinfo?.length !== 0) {
                        // downloadGoupSalesDetailsPDF(
                        //   convertGroupData,
                        //   filteredData,
                        //   piInformation,
                        //   finishGoodsInfo,
                        //   itemSizeInfo,
                        //   clientInformation,
                        //   { companyinfo },
                        //   reportSalesTitle
                        // );
                      }
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
                      const filteredData = orderDetailsData
                        ?.map((salesData) => {
                          const matchedDetails =
                            salesData.detailsData?.filter(
                              (details) => details.itemId === row?.itemId
                            );
                          if (matchedDetails.length > 0) {
                            return {
                              ...salesData,
                              detailsData: matchedDetails,
                            };
                          }
                          return null;
                        })
                        .filter((item) => item !== null);

                      const transformedPIData = filteredData?.flatMap(
                        (piDetails) =>
                          piDetails.detailsData.map((detail) => ({
                            ...piDetails,
                            detailsData: detail,
                          }))
                      );

                      handleOrderDetailsExcel(
                        transformedPIData,
                        filteredData,
                        finishGoodsInfo,
                        itemSizeInfo,
                        clientInformation,
                        companyinfo,
                        reportOrderTitle
                      );
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