/* eslint-disable jsx-a11y/anchor-is-valid */
import { downloadGoupOrderDetailsPDF } from "../ReportProperties/PDF/handleOrderDetailsAllReport";
import handleOrderDetailsExcel from "./../ReportProperties/Excel/handleOrderDetailsExcel";
import {
  groupOrderDateByDetails,
} from "./reportDataGrouping";
export const getOrderColumns = (
  finishGoodsInfo,
  itemSizeInfo,
  itemUnitInformation,
  permission,
  triggerOrderDetailsReport,
  piInformation,
  clientInformation,
  companyinfo,
  reportOrderTitle,
  filters
) => [
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
      const itemSize = itemSizeInfo?.find(
        (size) => size._id == itemName?.sizeId
      );
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
      const itemUnit = itemUnitInformation?.find(
        (size) => size._id == itemName?.unitId
      );
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
            <div class="dropdown dropup">
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
                    onClick={async () => {
                      const result = await triggerOrderDetailsReport(filters);
                      const filteredData = result?.data
                        ?.map((salesData) => {
                          const matchedDetails = salesData.detailsData?.filter(
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
                      const convertGroupData = Object.values(groupData);
                      const itemNames = finishGoodsInfo.find(
                        (item) => item._id === row.itemId
                      );
                      const itemSize = itemSizeInfo.find(
                        (size) => size._id === itemNames.sizeId
                      );
                      const reportTitle = `ORDER INFORMATION-${itemNames.itemName}(${itemSize.sizeInfo})`;
                      if (companyinfo?.length !== 0) {
                        downloadGoupOrderDetailsPDF(
                          convertGroupData,
                          filteredData,
                          finishGoodsInfo,
                          itemSizeInfo,
                          itemUnitInformation,
                          clientInformation,
                          {companyinfo},
                          reportTitle
                        );
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
                    onClick={async() => {
                      const result = await triggerOrderDetailsReport(filters);
                      const filteredData = result.data
                        ?.map((salesData) => {
                          const matchedDetails = salesData.detailsData?.filter(
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
                        itemUnitInformation,
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
