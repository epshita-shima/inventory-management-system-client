/* eslint-disable jsx-a11y/anchor-is-valid */
import handleProductionDatewiseExcel from "../ReportProperties/Excel/handleProductionDatewiseExcel";
import { downloadProductionGroupedDetailsPDF } from "../ReportProperties/PDF/handleProductionDatewiseDetailsPDF";
import "./dropdownTableCustomDesign.css";
import { groupProductionDateByDetails } from "./reportDataGrouping";
export const getProductionColumns = (
  finishGoodsInfo,
  itemSizeInfo,
  itemUnitInformation,
  permission,
  triggerProductionReport,
  filters,
  companyinfo,
  reportOrderTitle
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
      <div className="d-flex justify-content-between align-content-center ">
        {permission?.isPDF && (
          <div className="table-head-icon d-flex">
            <div className="dropdown dropup">
              <button
                className="btn btn-download dropdown-toggle"
                type="button"
                id={`dropdownMenuButton1-${row.id}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Download
              </button>
              <ul
                className="dropdown-menu" // Align dropdown menu properly
                aria-labelledby={`dropdownMenuButton1-${row.id}`}
              >
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={async () => {
                      try {
                        const result = await triggerProductionReport(filters);
                        const filteredData = result?.data.filter((x) => {
                        
                          return x.productionItemName === row.itemId;
                        });
                        const groupData =
                          groupProductionDateByDetails(filteredData);
                        const convertGroupData = Object.values(groupData);
                        const itemNames = finishGoodsInfo.find(
                          (item) => item._id === row.itemId
                        );
                        const itemSize = itemSizeInfo.find(
                          (size) => size._id === itemNames.sizeId
                        );
                        const reportTitle = `PRODUCTION INFORMATION-${itemNames.itemName}(${itemSize.sizeInfo})`;
                        if (companyinfo?.length !== 0) {
                          downloadProductionGroupedDetailsPDF(
                            convertGroupData,
                            filteredData,
                            finishGoodsInfo,
                            itemSizeInfo,
                            itemUnitInformation,
                            { companyinfo },
                            reportTitle
                          );
                        }
                      } catch (error) {}
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
                      const result = await triggerProductionReport(filters);
                 
                      const filteredData = result?.data.filter((x) => {
                      
                        return x.productionItemName === row.itemId;
                      });
                    
                      const transformedProductionData = filteredData?.flatMap(
                        (piDetails) =>
                          piDetails.detailsData.map((detail) => ({
                            ...piDetails,
                            detailsData: detail,
                          }))
                      );
                      handleProductionDatewiseExcel(
                        transformedProductionData,
                        filteredData,
                        finishGoodsInfo,
                        itemSizeInfo,
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
