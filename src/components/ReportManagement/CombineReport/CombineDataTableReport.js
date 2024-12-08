/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "./CombineReportDataTable.css";
import DataTable from "react-data-table-component";
import { getPurchaseColumns } from "../../Uitilites/purchaseColumn";
import { getSalesColumns } from "../../Uitilites/salesColumns";
import { getProductionColumns } from "../../Uitilites/productionColumn";
import { getOrderColumns } from "../../Uitilites/orderColumn";
import { getReturnColumns } from "../../Uitilites/returnColumn";
import { useLazyGetProductionDatewiseDetailsReportQuery } from "../../../redux/features/productionreport/productionreportApi";
import { useLazyGetOrderDetailsReportQuery } from "../../../redux/features/salesreport/allreportApi";

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
  returnDetailsData,
  filters
}) => {
  console.log(filters)
  const reportSalesTitle = "DELIVERY ORDER INFORMATION";
  const reportReturnTitle = "RETURN INFORMATION";
  const reportOrderTitle = "ORDER INFORMATION";
  const [triggerProductionReport, { data: productionDetailsData }] =
  useLazyGetProductionDatewiseDetailsReportQuery();
  const [triggerOrderDetailsReport, { data: orderDetailsData }] =
  useLazyGetOrderDetailsReportQuery();

  const salesColumns = getSalesColumns(
    finishGoodsInfo,
    itemSizeInfo,
    itemUnitInformation,
    permission,
    salesDetailsData,
    companyinfo,
    piInformation,
    reportSalesTitle,
    clientInformation
  );

  const purchaseColumns = getPurchaseColumns(
    rawMaterialInfo,
    itemUnitInformation,
    permission
  );

  const productionColumns = getProductionColumns(
    finishGoodsInfo,
    itemSizeInfo,
    itemUnitInformation,
    permission,
    triggerProductionReport,
    filters
  ); 

  const orderColumns = getOrderColumns(
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
  );

  const returnColumns = getReturnColumns(
    finishGoodsInfo,
    itemSizeInfo,
    itemUnitInformation,
    permission,
    returnDetailsData,
    companyinfo,
    piInformation,
    clientInformation,
    reportReturnTitle
  );

  const customStyles = {
    table: {
      style: {
        margin: "0",
        padding: "0",
        borderSpacing: "0",
        overflow: 'visible'
      },
    },
    rows: {
      style: {
        textAlign: "center",
        padding: "0",
        overflow: 'visible',
      },
    },
    headCells: {
      style: {
        margin: "0",
        padding: "8px",
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
        padding: "0",
      },
    },
  };

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
