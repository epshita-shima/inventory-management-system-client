/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import DataTable from "react-data-table-component";
import React, { useMemo, useState } from "react";
import ProductionConsumptionModal from "./ProductionConsumptionModal";
import { useLazyGetRawMaterialDetailsConsumptionReportQuery } from "../../../redux/features/productionreport/productionreportApi";

import { useLazyGetPurchaseSummaryReportQuery } from "../../../redux/features/purchasereport/purchasereportApi";
import PurchaseQuantityModal from "./PurchaseQuantityModal";
import LoadingSpineer from "../../Common/LoadingSpinner/LoadingSpineer";

const StockReportDataTable = ({
  rawMaterialStockReportData,
  filterText,
  isTableDispaly,
  companyInfo,
  itemSizeInfo,
  rawMaterialItem,
  setFilterText,
  itemUnitInfo,
  isRawMaterialStockDataLoading,
}) => {
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

  console.log("purchaseItemDetailsData", purchaseItemDetailsData);

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
          class="card-body"
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
      selector: (row) => <span>0</span>,
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
          class="card-body"
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
        {/* {
          groupedResult?.length > 0 && (  <div className="d-flex justify-content-end align-items-center">
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
                    onClick={() => {
                      // if (companyinfo?.length !== 0 || undefined) {
                      //   downloadCombineReportPDF({ companyinfo }, reportTitle);
                      // }
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
                
                    }}
                  >
                    Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>)
        } */}
      </div>
    );
  }, []);

  return (
    <div>
      {isTableDispaly && (
        <>
          <LoadingSpineer
            isLoading={isRawMaterialStockDataLoading}
          ></LoadingSpineer>
          <div
            // className={`${isRawMaterialStockDataLoading ? 'd-none' : 'd-block'} mt-4`}
            style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}
          >
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
        </>
      )}
      {showProductionModal && (
        <ProductionConsumptionModal
          show={showProductionModal}
          rawMaterialItem={rawMaterialItem}
          companyinfo={companyInfo}
          productionSingleItemId={productionSingleItemId}
          productionItemDetailsData={productionItemDetailsData}
          itemUnitInfo={itemUnitInfo}
        ></ProductionConsumptionModal>
      )}
      {showPurchaseModal && (
        <PurchaseQuantityModal
          purchaseSingleItemId={purchaseSingleItemId}
          filteredDatas={purchaseItemDetailsData}
          companyinfo={companyInfo}
          rawMaterialItem={rawMaterialItem}
          itemUnitInfo={itemUnitInfo}
        ></PurchaseQuantityModal>
      )}
    </div>
  );
};

export default StockReportDataTable;
