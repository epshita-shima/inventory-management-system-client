import handleReturnDetailsExcel from "../ReportProperties/Excel/handleReturnDetailsExcel";
import { downloadGoupReturnDetailsPDF } from "../ReportProperties/PDF/handleReturnDetailsInfo";
import { groupReturnDateByDetails } from "./reportDataGrouping";

/* eslint-disable jsx-a11y/anchor-is-valid */
export const getReturnColumns = (
  finishGoodsInfo,
  itemSizeInfo,
  itemUnitInformation,
  permission,
  triggerReturnDetailsReport,
  filters,
  companyinfo,
  piInformation,
  clientInformation,
  reportReturnTitle
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
                    onClick={async () => {
                      const result = await triggerReturnDetailsReport(filters);

                      const filteredData = result.data
                        ?.map((returnData) => {
                          console.log(returnData);
                          const matchedDetails = returnData.detailsData?.filter(
                            (details) => details.itemId === row?.itemId
                          );
                          console.log(matchedDetails);
                          if (matchedDetails.length > 0) {
                            return {
                              ...returnData,
                              detailsData: matchedDetails,
                            };
                          }

                          return null;
                        })
                        .filter((item) => item !== null);

                      if (!filteredData || filteredData.length === 0) {
                        console.error("No filtered data available");
                        return;
                      }

                      const groupData = groupReturnDateByDetails(filteredData);
                      const convertGroupData = Object.values(groupData);
                      const itemNames = finishGoodsInfo.find(
                        (item) => item._id === row.itemId
                      );
                      const itemSize = itemSizeInfo.find(
                        (size) => size._id === itemNames.sizeId
                      );
                      const reportTitle = `RETURN INFORMATION-${itemNames.itemName}(${itemSize.sizeInfo})`;
                      if (companyinfo?.length !== 0) {
                        downloadGoupReturnDetailsPDF(
                          convertGroupData,
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
                    class="dropdown-item"
                    href="#"
                    onClick={async () => {
                      const result = await triggerReturnDetailsReport(filters);
                      const filteredData = result.data
                        ?.map((returnData) => {
                          const matchedDetails = returnData.detailsData?.filter(
                            (details) => details.itemId === row?.itemId
                          );
                          if (matchedDetails.length > 0) {
                            return {
                              ...returnData,
                              detailsData: matchedDetails,
                            };
                          }
                          return null;
                        })
                        .filter((item) => item !== null);
                      const transformedData = filteredData?.flatMap(
                        (piDetails) =>
                          piDetails.detailsData.map((detail) => ({
                            ...piDetails,
                            detailsData: detail,
                          }))
                      );
                      handleReturnDetailsExcel(
                        transformedData,
                        filteredData,
                        piInformation,
                        finishGoodsInfo,
                        itemSizeInfo,
                        clientInformation,
                        companyinfo,
                        reportReturnTitle
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
