/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import DataTable from "react-data-table-component";
import React, { useMemo, useState } from "react";
import ProductionConsumptionModal from "./ProductionConsumptionModal";
import { useLazyGetRawMaterialDetailsConsumptionReportQuery } from "../../../../redux/features/productionreport/productionreportApi";

import { useLazyGetPurchaseSummaryReportQuery } from "../../../../redux/features/purchasereport/purchasereportApi";

import LoadingSpineer from "../../../Common/LoadingSpinner/LoadingSpineer";
import PurchaseQuantityModal from "./PurchaseQuantityModal";
import downloadRawStockReportPDF from "../../../ReportProperties/PDF/handleRawMaterialStockPReport";
import handleRaxMaterialStockReportExcel from "../../../ReportProperties/Excel/handleRaxMaterialStockReportExcel";

const StockReportDataTable = ({
  rawMaterialStockReportData,
  filterText,
  isTableDispaly,
  companyinfo,
  itemSizeInfo,
  rawMaterialItem,
  setFilterText,
  itemUnitInfo,
  isRawMaterialStockDataLoading,
}) => {
  const reportTitle = "RAW MATERIAL STOCK REPORT";
  const [productionSingleItemId, setProductionSingleItemId] = useState("");
  const [purchaseSingleItemId, setPurchaseSingleItemId] = useState("");
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [showPurchaseModal, setShowPruchaseModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [
    triggerDatewiseDetailsProductionStockReport,
    { data: productionItemDetailsData },
  ] = useLazyGetRawMaterialDetailsConsumptionReportQuery();
  const [
    triggerDatewiseDetailsPurchaseStockReport,
    { data: purchaseItemDetailsData },
  ] = useLazyGetPurchaseSummaryReportQuery();

  const handleRowClickForProduction = async (rowData) => {
    await triggerDatewiseDetailsProductionStockReport({
      itemId: rowData.itemId,
    });
    setSelectedRow(rowData);
    setProductionSingleItemId(rowData.itemId);
    setShowProductionModal(true); // Show modal when a row is clicked
  };

  const handleRowClickForPurchase = async (rowData) => {
    await triggerDatewiseDetailsPurchaseStockReport({ itemId: rowData.itemId });
    setSelectedRow(rowData);
    setPurchaseSingleItemId(rowData.itemId);
    setShowPruchaseModal(true); // Show modal when a row is clicked
  };

  const handleCloseModal = () => {
    setShowProductionModal(false);
  };

  const grandTotalPurchaseQuantity = rawMaterialStockReportData?.reduce(
    (sum, detail) => sum + detail.purchaseQuantity,
    0
  );
  console.log(grandTotalPurchaseQuantity);
  const grandTotalProductionConsumption = rawMaterialStockReportData?.reduce(
    (sum, detail) => sum + detail.productionConsumption,
    0
  );
  console.log(grandTotalPurchaseQuantity);
  const grandTotalStockInhand = rawMaterialStockReportData?.reduce(
    (sum, detail) => sum + detail.stockInHand,
    0
  );
  console.log(grandTotalPurchaseQuantity);

  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Item Name",
      selector: (row) => {
        const itemName = rawMaterialItem?.find((x) => row.itemId === x._id);
        return itemName ? itemName.itemName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Purchase Quantity",
      // selector: (row) => row.purchaseQuantity,
      sortable: true,
      center: true,
      filterable: true,
      cell: (row) => (
        <div
          className="card-body"
          data-toggle="modal"
          data-target="#exampleModalLabelPurchaseRaw"
          onClick={() => handleRowClickForPurchase(row)}
        >
          <a href="#" className="text-success fw-bold">
            {" "}
            {row.purchaseQuantity}
          </a>
        </div>
      ),
    },

    {
      name: "Purchase Return Qty",
      selector: (row) => <span>-</span>,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Production Consumption",
      // selector: (row) => (row.purchaseConsumption
      // ),
      sortable: true,
      center: true,
      filterable: true,
      cell: (row) => (
        <div
          className="card-body"
          data-toggle="modal"
          data-target="#exampleModalLabelRaw"
          onClick={() => handleRowClickForProduction(row)}
        >
          <a href="#" className="text-success fw-bold">
            {row.productionConsumption}
          </a>
        </div>
      ),
    },
    {
      name: "Stock In Hand",
      selector: (row) => row.stockInHand,
      sortable: true,
      center: true,
      filterable: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        textAlign: "center",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#B8FEB3",
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: "0.8px",
      },
    },
    cells: {
      style: {
        borderRight: "1px solid gray",
      },
    },
    headRow: {
      style: {
        paddingTop: "0px",
      },
    },
    header: {
      style: {
        marginTop: "8px",
      },
    },
  };

  const filteredItems = rawMaterialStockReportData?.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );
  const subHeaderComponent = useMemo(() => {
    return (
      <div className="d-block d-sm-flex justify-content-between align-items-center mb-2">
        {rawMaterialStockReportData?.length > 0 && (
          <div className="d-flex justify-content-end align-items-center">
            <div className="table-head-icon d-flex">
              <div className="dropdown">
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
                      onClick={() => {
                        if (companyinfo?.length !== 0 || undefined) {
                          downloadRawStockReportPDF(
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
                    <a className="dropdown-item" href="#" onClick={() => {
                      handleRaxMaterialStockReportExcel(  rawMaterialStockReportData,
                        rawMaterialItem,
                        itemUnitInfo,
                        companyinfo,
                        reportTitle)
                    }}>
                      Excel
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [companyinfo, itemUnitInfo, rawMaterialItem, rawMaterialStockReportData]);

  return (
    <div className="mt-3">
      {isTableDispaly && (
        <>
          <LoadingSpineer
            isLoading={isRawMaterialStockDataLoading}
          ></LoadingSpineer>
          <div style={{ height: "calc(80vh - 120px)", overflowY: "scroll" }}>
            <>
              <DataTable
                columns={columns}
                data={filteredItems}
                defaultSortField="name"
                customStyles={customStyles}
                subHeaderComponent={subHeaderComponent}
                striped
                pagination
                subHeader
              />
            </>
          </div>
          <table id="my-raw-material-stock-table" className="d-none">
            <thead>
              <tr>
                <th>Sl.</th>
                <th>Item Name</th>
                <th>Purchase Quantity</th>
                <th>Purchase Return Qty</th>
                <th>Production Consumption</th>
                <th>Stock In Hand</th>
              </tr>
            </thead>
            <tbody>
              {rawMaterialStockReportData?.map((detail, detailIndex) => {
                const itemNames = rawMaterialItem?.find(
                  (item) => item._id === detail.itemId
                );
                const itemUnit = itemUnitInfo.find(
                  (size) => size._id === itemNames?.unitId
                );

                return (
                  <tr key={detail._id}>
                    {/* <td
                                  style={{
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  {formattedDate}
                                </td> */}
                                <td>{detailIndex+1}</td>
                    <td >{`${itemNames?.itemName} (${itemUnit.unitInfo})`}</td>
                    <td>{detail?.purchaseQuantity.toLocaleString()}</td>
                    <td>-</td>
                    <td>{detail.productionConsumption.toLocaleString()}</td>
                    <td>{detail.stockInHand.toLocaleString()}</td>
                  </tr>
                );
              })}

              <tr>
                <td
                  colSpan={2}
                  style={{
                    textAlign: "right",
                    fontWeight: "bold",
                    padding: "8px",
                    border: "1px solid black",
                  }}
                >
                  Grand Total
                </td>
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    border: "1px solid black",
                  }}
                >
                  {grandTotalPurchaseQuantity != null
                    ? grandTotalPurchaseQuantity?.toLocaleString()
                    : 0}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    border: "1px solid black",
                  }}
                >
                  -
                </td>
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    border: "1px solid black",
                  }}
                >
                  {grandTotalProductionConsumption != null
                    ? grandTotalProductionConsumption?.toLocaleString()
                    : 0}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    border: "1px solid black",
                  }}
                >
                  {grandTotalStockInhand != null
                    ? grandTotalStockInhand?.toLocaleString()
                    : 0}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      {showProductionModal && (
        <ProductionConsumptionModal
          show={showProductionModal}
          rawMaterialItem={rawMaterialItem}
          companyinfo={companyinfo}
          productionSingleItemId={productionSingleItemId}
          productionItemDetailsData={productionItemDetailsData}
          itemUnitInfo={itemUnitInfo}
        ></ProductionConsumptionModal>
      )}
      {showPurchaseModal && (
        <PurchaseQuantityModal
          purchaseSingleItemId={purchaseSingleItemId}
          filteredDatas={purchaseItemDetailsData}
          companyinfo={companyinfo}
          rawMaterialItem={rawMaterialItem}
          itemUnitInfo={itemUnitInfo}
        ></PurchaseQuantityModal>
      )}
    </div>
  );
};

export default StockReportDataTable;
