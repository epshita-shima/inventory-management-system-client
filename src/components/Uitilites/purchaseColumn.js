import {downloadGoupPurchaseItemWisePDF } from "../ReportProperties/PDF/handlePurchaseDatewiseDetailsPDF";
import { groupPurchaseDateByDetails } from "./reportDataGrouping";
import handlePurchaseDatewiseReportExcel from './../ReportProperties/Excel/handlePurchaseDatewiseReportExcel';
import './dropdownTableCustomDesign.css'

/* eslint-disable jsx-a11y/anchor-is-valid */

export const getPurchaseColumns = (
  triggerPurchaseReport,
  reportPurchaseTitle,
  rawMaterialInfo,
  itemUnitInformation,
  permission,
  filters,
  companyinfo,
  supplierInformation
) => [
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
            <div className="dropdown dropup">
              <button
                className="btn btn-download dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Download
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={async () => {
                      const result = await triggerPurchaseReport(filters);
                      const filteredData = result.data
                        ?.map((purchaseData) => {
                          const matchedDetails =
                            purchaseData.detailsData?.filter(
                              (details) => details.itemId === row?.itemId
                            );

                          if (matchedDetails.length > 0) {
                            return {
                              ...purchaseData,
                              detailsData: matchedDetails,
                            };
                          }

                          return null;
                        })
                        .filter((item) => item !== null);
                        const itemNames = rawMaterialInfo.find(
                          (item) => item._id === row.itemId
                        );
                        const itemUnit = itemUnitInformation.find(
                          (size) => size._id === itemNames.unitId
                        );
                        const reportTitle = `PURCHASE INFORMATION-${row.itemName}(${itemUnit?.unitInfo})`;
                      const groupData =
                        groupPurchaseDateByDetails(filteredData);
                      // const convertGroupData=Object.values(groupData)
                      if (companyinfo?.length !== 0) {
                        downloadGoupPurchaseItemWisePDF(
                          groupData,
                          filteredData,
                          rawMaterialInfo,
                          itemUnitInformation,
                          supplierInformation,
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
                    className="dropdown-item"
                    href="#"
                    onClick={async() => {
                      const result=await triggerPurchaseReport(filters)
                      const filteredData = result.data
                        ?.map((purchaseData) => {
                          const matchedDetails =
                            purchaseData.detailsData?.filter(
                              (details) => details.itemId === row?.itemId
                            );
                          if (matchedDetails.length > 0) {
                            return {
                              ...purchaseData,
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
                      handlePurchaseDatewiseReportExcel(
                        transformedPIData,
                        filteredData,
                        rawMaterialInfo,
                        itemUnitInformation,
                        supplierInformation,
                        companyinfo,
                        reportPurchaseTitle
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
