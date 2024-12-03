import React from "react";
import "./CombineReportDataTable.css";
import DataTable from "react-data-table-component";
const CombineDataTableReport = ({
  combineReportData,
  rawMaterialInfo,
  itemUnitInformation,
}) => {
  const tranformPurchaseData = combineReportData?.purchaseData?.flatMap(
    (piDetails) =>
      piDetails.detailsData.map((detail) => ({
        ...piDetails,
        detailsData: detail,
      }))
  );

  const purchaseColumns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },

    {
      name: "Item Name",
      selector: (row) => {
        const itemName = rawMaterialInfo?.find(
          (x) => row?.detailsData.itemId == x._id
        );

        return itemName ? ` ${itemName?.itemName}` : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Unit",
      selector: (row) => {
        const itemName = rawMaterialInfo?.find(
          (x) => row?.detailsData.itemId == x._id
        );
        const itemUnit = itemUnitInformation?.find(
          (size) => size._id == itemName?.unitId
        );
        return itemName ? ` ${itemUnit?.unitInfo}` : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Purchase Qty",
      selector: (row) => row.detailsData.quantity,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Purcchase Rate in Avg",
      selector: (row) => {
        const calAvgRate = row.detailsData.amount / row.detailsData.quantity;
        return Math.round(calAvgRate);
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Purchase Amount",
      selector: (row) => row.detailsData.amount,
      sortable: true,
      center: true,
      filterable: true,
    },
  ];

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
        padding:"0"
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

  return (
    <div
      // className="container-fluid"
      style={{ height: "calc(75vh - 120px)", overflowY: "scroll" }}
    >
      {/* <h2 className="text-center">Management Dashboard</h2> */}
      <div className="accordion" id="managementAccordion">
        {/* Purchase Management */}
        <div className="accordion-item ">
          <h2 className="accordion-header" id="headingPurchase">
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
                data={tranformPurchaseData}
                defaultSortField="name"
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
              Monitor production processes, manage workflows, and track
              inventory usage.
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
              Oversee sales activities, customer interactions, and revenue
              tracking.
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
              Manage customer orders, shipping, and delivery schedules.
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
              Track returns, handle refunds, and manage reverse logistics.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombineDataTableReport;
