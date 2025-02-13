/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import LoadingSpineer from "../../../Common/LoadingSpinner/LoadingSpineer";
import { useGetProductionItemwiseDetailsReportQuery, useLazyGetProductionDatewiseDetailsReportQuery } from "../../../../redux/features/productionreport/productionreportApi";
import FinishGoodsStockModal from "./FinishGoodsStockModal";

const FinishGoodsStockDatatable = ({
  finishItemInfo,
  finishGoodsStockReportData,
  itemSizeInfo,
  companyinfo,
  isTableDispaly,
  filterText,
  isFinishGoodsStockDataLoading,
}) => {
  //   const [productionSingleItemId, setProductionSingleItemId] = useState("");
  const [showProductionModal, setShowProductionModal] = useState(false);
  //   const [selectedRow, setSelectedRow] = useState(null);
    const [
      triggerDatewiseFinishGoodProductionStockReport,
      { data: productionFinishGoodsData },
    ] = useLazyGetProductionDatewiseDetailsReportQuery();

  const handleRowClickForProduction = async (rowData) => {
    // await triggerDatewiseDetailsProductionStockReport({
    //   itemId: rowData.itemId,
    // });
    // setSelectedRow(rowData);
    // setProductionSingleItemId(rowData.itemId);
    setShowProductionModal(true); // Show modal when a row is clicked
  };

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
        const itemName = finishItemInfo?.find((x) => row.itemId === x._id);
        const itemSize = itemSizeInfo.find(
          (size) => size._id === itemName?.sizeId
        );
        return itemName
          ? `${itemName.itemName} (${itemSize?.sizeInfo})`
          : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Production Quantity",
      // selector: (row) => row.purchaseQuantity,
      sortable: true,
      center: true,
      filterable: true,
      cell: (row) => (
        <div
          class="card-body"
          data-toggle="modal"
          data-target="#exampleModalLabelFinsh"
          onClick={() => handleRowClickForProduction(row)}
        >
          <a href="#" className="text-success fw-bold">
            {row.productionQty}
          </a>
        </div>
      ),
    },

    {
      name: "Delivered Quantity",
      selector: (row) => row.deliveredQty,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Return Quantity",
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
          // onClick={() => handleRowClickForReturnQty(row)}
        >
          <a href="#" className="text-success fw-bold">
            {row.returnQty}
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

  const filteredItems = finishGoodsStockReportData?.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );

  return (
    <div>
      {isTableDispaly && (
        <>
          <LoadingSpineer
            isLoading={isFinishGoodsStockDataLoading}
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
                striped
                pagination
                subHeader
              />
            </>
          </div>
        </>
      )}
      {showProductionModal && <FinishGoodsStockModal></FinishGoodsStockModal>}
    </div>
  );
};

export default FinishGoodsStockDatatable;
