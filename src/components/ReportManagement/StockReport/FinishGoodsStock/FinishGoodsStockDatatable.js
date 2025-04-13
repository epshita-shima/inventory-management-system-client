/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import LoadingSpineer from "../../../Common/LoadingSpinner/LoadingSpineer";
import { useLazyGetProductionDatewiseDetailsReportQuery } from "../../../../redux/features/productionreport/productionreportApi";
import FinishGoodsStockProductionQtyModal from "./FinishGoodsStockProductionQtyModal";
import {
  useLazyGetReturnDetailsReportQuery,
  useLazyGetSalesDetailsReportQuery,
} from "../../../../redux/features/salesreport/allreportApi";
import FinishGoodsReturnQtyDetailsModal from "./FinishGoodsReturnQtyDetailsModal";
import FinishGoodsDeliveredQtyDetailsModal from "./FinishGoodsDeliveredQtyDetailsModal";
import downloadFinishGoodsStockReportPDF from "../../../ReportProperties/PDF/handleFinishGoodsStockReport";
import handleFinishGoodsStockReportExcel from "../../../ReportProperties/Excel/handleFinishGoodsStockReportExcel";

const FinishGoodsStockDatatable = ({
  finishItemInfo,
  finishGoodsStockReportData,
  itemSizeInfo,
  companyinfo,
  isTableDispaly,
  filterText,
  isFinishGoodsStockDataLoading,
  permission,
  rawMaterialItemInfo,
  itemUnitInfo,
  fromDate,
  toDate,
}) => {
  const reportTitle = "FINISH GOODS STOCK REPORT";
  const [productionSingleItemId, setProductionSingleItemId] = useState("");
  const [deliveredSingleItemId, setDeliveredSingleItemId] = useState("");
  const [returnSingleItemId, setReturnSingleItemId] = useState("");
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [triggerReturnDetailsReport, { data: returnDetailsData }] =
    useLazyGetReturnDetailsReportQuery();
  const [triggerDeliveredDetailsReport, { data: deliveredDetailsData }] =
    useLazyGetSalesDetailsReportQuery();
  const [
    triggerDatewiseFinishGoodProductionStockReport,
    { data: productionFinishGoodsData },
  ] = useLazyGetProductionDatewiseDetailsReportQuery();

  const handleRowClickForProduction = async (rowData) => {
    await triggerDatewiseFinishGoodProductionStockReport({
      fromDate: fromDate,
      toDate: toDate,
      productionItemName: rowData.itemId,
    });
    setProductionSingleItemId(rowData.itemId);

    rowData.productionQty !== 0
      ? setShowProductionModal(true)
      : setShowProductionModal(false);
  };

  const handleRowClickForDeliveredQty = async (rowData) => {
    await triggerDeliveredDetailsReport({
      fromDate: fromDate,
      toDate: toDate,
      itemId: rowData.itemId,
    });
    setDeliveredSingleItemId(rowData.itemId);

    rowData.deliveredQty !== 0
      ? setShowDeliveredModal(true)
      : setShowDeliveredModal(false);
  };

  const handleRowClickForReturnQty = async (rowData) => {
    await triggerReturnDetailsReport({
      fromDate: fromDate,
      toDate: toDate,
      itemId: rowData.itemId,
    });
    setReturnSingleItemId(rowData.itemId);

    rowData.returnQty !== 0
      ? setShowReturnModal(true)
      : setShowReturnModal(false);
  };

  const grandTotalProductionQuantity = finishGoodsStockReportData?.reduce(
    (sum, detail) => sum + detail.productionQty,
    0
  );
  const grandTotalDeliveredQuantity = finishGoodsStockReportData?.reduce(
    (sum, detail) => sum + detail.deliveredQty,
    0
  );
  const grandTotalReturnQuantity = finishGoodsStockReportData?.reduce(
    (sum, detail) => sum + detail.returnQty,
    0
  );
  const grandTotalStockInHand = finishGoodsStockReportData?.reduce(
    (sum, detail) => sum + detail.stockInHand,
    0
  );
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
      left: true,
      filterable: true,
      width: "230px",
    },
    {
      name: "Production Quantity",
      // selector: (row) => row.purchaseQuantity,
      sortable: true,
      center: true,
      filterable: true,
      cell: (row) => (
        <div
          className="card-body"
          data-toggle="modal"
          data-target="#exampleModalLabelFinshGoodProductionQty"
          onClick={() => handleRowClickForProduction(row)}
        >
          <a href="#" className="text-success fw-bold">
            {row.productionQty === 0 ? "-" : row.productionQty}
          </a>
        </div>
      ),
    },

    {
      name: "Delivered Quantity",
      sortable: true,
      center: true,
      filterable: true,
      cell: (row) => (
        <div
          className="card-body"
          data-toggle="modal"
          data-target="#exampleModalLabelFinshGoodDeliveredQty"
          onClick={() => handleRowClickForDeliveredQty(row)}
        >
          <a href="#" className="text-success fw-bold">
            {row.deliveredQty === 0 ? "-" : row.deliveredQty}
          </a>
        </div>
      ),
    },

    {
      name: "Return Quantity",
      sortable: true,
      center: true,
      filterable: true,
      cell: (row) => (
        <div
          className="card-body"
          data-toggle="modal"
          data-target="#exampleModalLabelFinshGoodReturnQty"
          onClick={() => handleRowClickForReturnQty(row)}
        >
          <a href="#" className="text-success fw-bold">
            {row.returnQty === 0 ? "-" : row.returnQty}
          </a>
        </div>
      ),
    },
    {
      name: "Stock In Hand",
      selector: (row) => (
        <span>{row.stockInHand === 0 ? "-" : row.stockInHand}</span>
      ),
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

  const subHeaderComponent = useMemo(() => {
    return (
      <div className="d-block d-sm-flex justify-content-between align-items-center mb-2">
        {finishGoodsStockReportData?.length > 0 && (
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
                          downloadFinishGoodsStockReportPDF(
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
                      handleFinishGoodsStockReportExcel(  finishGoodsStockReportData,
                        finishItemInfo,
                        itemSizeInfo,
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
  }, [companyinfo, finishGoodsStockReportData, finishItemInfo, itemSizeInfo]);

  return (
    <div className="mt-3">
      {isTableDispaly && (
        <>
          <LoadingSpineer
            isLoading={isFinishGoodsStockDataLoading}
          ></LoadingSpineer>
         
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
                 fixedHeader={true}
              fixedHeaderScrollHeight="calc(80vh - 120px)"
              />
            </>
        

          <table id="my-finish-goods-stock-table" className="d-none">
            <thead>
              <tr>
                <th>Sl.</th>
                <th>Item Name</th>
                <th>Production Quantity</th>
                <th>Delivered Quantity</th>
                <th>Return Quantity</th>
                <th>Stock In Hand</th>
              </tr>
            </thead>
            <tbody>
              {finishGoodsStockReportData?.map((detail, detailIndex) => {
                const itemNames = finishItemInfo?.find(
                  (item) => item._id === detail.itemId
                );
                const itemSize = itemSizeInfo.find(
                  (size) => size._id === itemNames?.sizeId
                );

                return (
                  <tr key={detail._id}>
                    <td>{detailIndex + 1}</td>
                    <td>{`${itemNames?.itemName} (${itemSize.sizeInfo})`}</td>
                    <td>{detail?.productionQty===0 ? "-": detail?.productionQty.toLocaleString()}</td>
                    <td>{detail.deliveredQty ===0 ? "-": detail.deliveredQty.toLocaleString()}</td>
                    <td>{detail.returnQty ===0 ? "-":detail.returnQty.toLocaleString()}</td>
                    <td>{detail.stockInHand ===0 ? "-":detail.stockInHand.toLocaleString()}</td>
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
                  {grandTotalProductionQuantity != null
                    ? grandTotalProductionQuantity?.toLocaleString()
                    : 0}
                </td>
               
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    border: "1px solid black",
                  }}
                >
                  {grandTotalDeliveredQuantity != null
                    ? grandTotalDeliveredQuantity?.toLocaleString()
                    : 0}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    border: "1px solid black",
                  }}
                >
                  {grandTotalReturnQuantity != null
                    ? grandTotalReturnQuantity?.toLocaleString()
                    : 0}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    border: "1px solid black",
                  }}
                >
                  {grandTotalStockInHand != null
                    ? grandTotalStockInHand?.toLocaleString()
                    : 0}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      {showProductionModal && (
        <FinishGoodsStockProductionQtyModal
          filteredDatas={productionFinishGoodsData}
          permission={permission}
          finishGoodsItemInfo={finishItemInfo}
          itemSizeInfo={itemSizeInfo}
          rawMaterialItemInfo={rawMaterialItemInfo}
          itemUnitInfo={itemUnitInfo}
          companyinfo={companyinfo}
          productionSingleItemId={productionSingleItemId}
        ></FinishGoodsStockProductionQtyModal>
      )}
      {showReturnModal && (
        <FinishGoodsReturnQtyDetailsModal
          filteredDatas={returnDetailsData}
          permission={permission}
          companyinfo={companyinfo}
          isTableDispaly={isTableDispaly}
          finishGoodsItemInfo={finishItemInfo}
          itemSizeInfo={itemSizeInfo}
          itemUnitInformation={itemUnitInfo}
          returnSingleItemId={returnSingleItemId}
        ></FinishGoodsReturnQtyDetailsModal>
      )}
      {showDeliveredModal && (
        <FinishGoodsDeliveredQtyDetailsModal
          permission={permission}
          companyinfo={companyinfo}
          filteredDatas={deliveredDetailsData}
          finishGoodsItemInfo={finishItemInfo}
          itemSizeInfo={itemSizeInfo}
          itemUnitInformation={itemUnitInfo}
          deliveredSingleItemId={deliveredSingleItemId}
        ></FinishGoodsDeliveredQtyDetailsModal>
      )}
    </div>
  );
};

export default FinishGoodsStockDatatable;
