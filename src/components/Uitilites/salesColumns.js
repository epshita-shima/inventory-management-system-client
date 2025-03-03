import { groupSalesDataByDetails } from "./reportDataGrouping";
import {
  downloadGoupSalesDetailsPDF,
} from "../ReportProperties/PDF/handleDeliverDetailsReport";
import handleSalesDetailsExcel from "../ReportProperties/Excel/handleSalesDetailsExcel";

/* eslint-disable jsx-a11y/anchor-is-valid */
export const getSalesColumns = (
  finishGoodsInfo,
  itemSizeInfo,
  itemUnitInformation,
  permission,
  triggerSalesDetailsReport,
  filters,
  companyinfo,
  piInformation,
  reportSalesTitle,
  clientInformation,
  dropdownMenuStyles
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
    name: "Delivered Qty",
    selector: (row) => row.totalSalesQuantity,
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "SalesRate in Avg",
    selector: (row) => Math.round(row.salesRateinAvg),
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "Sales Amount",
    selector: (row) => row.totalSalesAmount,
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
            <div className="dropdown  dropup">
              <button
                className="btn btn-download dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Download
              </button>
              <ul className="dropdown-menu" data-bs-display="static" aria-labelledby="dropdownMenuButton1" style={dropdownMenuStyles}>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={async () => {
                      const result = await triggerSalesDetailsReport(filters);
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

                      const groupData = groupSalesDataByDetails(filteredData);
                      const itemNames = finishGoodsInfo.find(
                        (item) => item._id === row.itemId
                      );
                      const itemSize = itemSizeInfo.find(
                        (size) => size._id === itemNames.sizeId
                      );
                      const reportTitle = `SALES INFORMATION-${itemNames.itemName}(${itemSize.sizeInfo})`;
                      if (companyinfo?.length !== 0) {
                        downloadGoupSalesDetailsPDF(
                          groupData,
                          filteredData,
                          piInformation,
                          finishGoodsInfo,
                          itemSizeInfo,
                          itemUnitInformation,
                          clientInformation,
                          { companyinfo },
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
                    className="dropdown-item"
                    href="#"
                    onClick={async () => {
                      const result = await triggerSalesDetailsReport(filters);
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
                      handleSalesDetailsExcel(
                        transformedPIData,
                        filteredData,
                        piInformation,
                        finishGoodsInfo,
                        itemSizeInfo,
                        itemUnitInformation,
                        clientInformation,
                        companyinfo,
                        reportSalesTitle
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
