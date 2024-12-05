/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "./CombineReportDataTable.css";
import DataTable from "react-data-table-component";
import { getPurchaseColumns } from "../../Uitilites/purchaseColumn";
import { getSalesColumns } from "../../Uitilites/salesColumns";
import { getProductionColumns } from "../../Uitilites/productionColumn";
import { getOrderColumns } from "../../Uitilites/orderColumn";
import { getReturnColumns } from "../../Uitilites/returnColumn";
import SalesDetailsTable from "../../Uitilites/ReportTable/SalesDetailsTable";
import {
  calculateGrandTotalSalesAmount,
  calculateGrandTotalSalesQty,
} from "../../Uitilites/CalculationUtilities/calculation";
import { formatDate } from "../../Uitilites/DateUtilities";
import { groupSalesDataByDetails } from "../../Uitilites/salesDetailsDataGrouping";
import downloadSalesDetailsPDF, {
  downloadGoupSalesDetailsPDF,
} from "../../ReportProperties/PDF/handleDeliverDetailsReport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
const CombineDataTableReport = ({
  combineReportData,
  rawMaterialInfo,
  itemUnitInformation,
  finishGoodsInfo,
  itemSizeInfo,
  permission,
  salesDetailsData,
  companyinfo,
  piInformation,
  clientInformation,
}) => {
  const reportTitle = "DELIVERY ORDER INFORMATION";
  const [salesDetailsGroupData, setSalesDetailsGroupData] = useState({});
  console.log(salesDetailsGroupData);

  const salesColumns = [
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
        return itemName
          ? `${itemName?.itemName} (${itemSize.sizeInfo})`
          : "N/A";
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
      width: "100px",
      grow: 2,
      cell: (row) => (
        <div className="d-flex justify-content-between align-content-center">
          {permission?.isPDF ? (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Report View"
              style={{
                color: "orange",
                border: "2px solid orange",
                padding: "3px",
                borderRadius: "5px",
              }}
              onClick={() => {
                const filteredData = salesDetailsData
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
// const convertGroupData=Object.values(groupData)
                if (
                  companyinfo?.length !== 0 &&
                  salesDetailsGroupData.length !== 0
                ) {
                  downloadGoupSalesDetailsPDF(
                    groupData,
                    filteredData,
                    piInformation,
                    finishGoodsInfo,
                    itemSizeInfo,
                    clientInformation,
                    { companyinfo },
                    reportTitle
                  );
                }
              }}
            >
              <FontAwesomeIcon icon={faFilePdf}></FontAwesomeIcon>
            </a>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];
  const purchaseColumns = getPurchaseColumns(
    rawMaterialInfo,
    itemUnitInformation
  );
  const productionColumns = getProductionColumns(
    finishGoodsInfo,
    itemSizeInfo,
    itemUnitInformation
  );
  const orderColumns = getOrderColumns(
    finishGoodsInfo,
    itemSizeInfo,
    itemUnitInformation
  );
  const returnColumns = getReturnColumns(
    finishGoodsInfo,
    itemSizeInfo,
    itemUnitInformation
  );

  const customStyles = {
    table: {
      style: {
        margin: "0", // Remove table margin
        padding: "0", // Remove table padding
        borderSpacing: "0",
      },
    },
    rows: {
      style: {
        textAlign: "center",
        padding: "0",
      },
    },
    headCells: {
      style: {
        margin: "0", // Ensure no margin
        padding: "8px", // Add padding for aesthetics
        backgroundColor: "#B8FEB3",
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: "0.8px",
      },
    },
    cells: {
      style: {
        padding: "8px",
        borderRight: "1px solid gray",
      },
    },
    headRow: {
      style: {
        padding: "0px",
      },
    },
    header: {
      style: {
        margin: "0",
        padding: "0", // Adjust padding for header
      },
    },
  };

  // useEffect(()=>{
  //   if(salesDetailsGroupData.length !==0){
  //     const grandTotalDeliverQty = calculateGrandTotalSalesQty(
  //       salesDetailsGroupData
  //     );
  //     const grandTotalDeliverAmount = calculateGrandTotalSalesAmount(
  //       salesDetailsGroupData,
  //       piInformation
  //     );
  //   }

  // },[salesDetailsGroupData,piInformation])

  return (
    <div>
      <div className="accordion" id="managementAccordion">
        {/* Purchase Management */}
        <div className="accordion-item ">
          <h2 className="accordion-header centered-header" id="headingPurchase">
            <button
              className="accordion-button accordion-fontsize"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapsePurchase"
              aria-expanded="true"
              aria-controls="collapsePurchase"
            >
              Purchase Information
            </button>
          </h2>
          <div
            id="collapsePurchase"
            className="accordion-collapse collapse show"
            aria-labelledby="headingPurchase"
            data-bs-parent="#managementAccordion"
          >
            <div className="accordion-body">
              <DataTable
                columns={purchaseColumns}
                data={combineReportData?.groupedPurchaseResult}
                defaultSortField="itemName"
                customStyles={customStyles}
                striped
                pagination
                subHeader
              />
            </div>
          </div>
        </div>

        {/* Production Management */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingProduction">
            <button
              className="accordion-button collapsed accordion-fontsize"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseProduction"
              aria-expanded="false"
              aria-controls="collapseProduction"
            >
              Production Information
            </button>
          </h2>
          <div
            id="collapseProduction"
            className="accordion-collapse collapse"
            aria-labelledby="headingProduction"
            data-bs-parent="#managementAccordion"
          >
            <div className="accordion-body">
              <DataTable
                columns={productionColumns}
                data={combineReportData?.groupedProductionResult}
                defaultSortField="itemName"
                customStyles={customStyles}
                striped
                pagination
                subHeader
              />
            </div>
          </div>
        </div>

        {/* Sales Management */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingSales">
            <button
              className="accordion-button collapsed accordion-fontsize"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSales"
              aria-expanded="false"
              aria-controls="collapseSales"
            >
              Sales Information
            </button>
          </h2>
          <div
            id="collapseSales"
            className="accordion-collapse collapse"
            aria-labelledby="headingSales"
            data-bs-parent="#managementAccordion"
          >
            <div className="accordion-body">
              <DataTable
                columns={salesColumns}
                data={combineReportData?.groupedSalesResult}
                defaultSortField="itemName"
                customStyles={customStyles}
                striped
                pagination
                subHeader
              />
              {salesDetailsGroupData.length != 0 && (
                <SalesDetailsTable
                  groupedData={salesDetailsGroupData}
                  formatDate={formatDate}
                  piInformation={piInformation}
                  finishGoodsItemInfo={finishGoodsInfo}
                  itemSizeInfo={itemSizeInfo}
                  clientInformation={clientInformation}
                  // grandTotalDeliverQty={grandTotalDeliverQty}
                  // grandTotalDeliverAmount={grandTotalDeliverAmount}
                />
              )}
            </div>
          </div>
        </div>

        {/* Order Management */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOrder">
            <button
              className="accordion-button collapsed accordion-fontsize"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOrder"
              aria-expanded="false"
              aria-controls="collapseOrder"
            >
              Order Information
            </button>
          </h2>
          <div
            id="collapseOrder"
            className="accordion-collapse collapse"
            aria-labelledby="headingOrder"
            data-bs-parent="#managementAccordion"
          >
            <div className="accordion-body">
              <DataTable
                columns={orderColumns}
                data={combineReportData?.groupedOrderResult}
                defaultSortField="itemName"
                customStyles={customStyles}
                striped
                pagination
                subHeader
              />
            </div>
          </div>
        </div>

        {/* Return Management */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingReturn">
            <button
              className="accordion-button collapsed accordion-fontsize"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseReturn"
              aria-expanded="false"
              aria-controls="collapseReturn"
            >
              Return Information
            </button>
          </h2>
          <div
            id="collapseReturn"
            className="accordion-collapse collapse"
            aria-labelledby="headingReturn"
            data-bs-parent="#managementAccordion"
          >
            <div className="accordion-body">
              <DataTable
                columns={returnColumns}
                data={combineReportData?.groupedReturnResult}
                defaultSortField="itemName"
                customStyles={customStyles}
                striped
                pagination
                subHeader
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombineDataTableReport;
