/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {  useMemo } from "react";

import DataTable from "react-data-table-component";
import { downloadProductionDatewiseSummaryPDF } from "../../../ReportProperties/PDF/handlePRoductionDatewiseSummaryPDF";
import handleProductionDatewiseSummaryExcel from '.././../../ReportProperties/Excel/handleProductionDatewiseSummaryExcel';
import { formatDate } from "../../../Uitilites/DateUtilities";

const DatewiseProductionSummary = ({
  permission,
  isTableDispaly,
  setIsTableDisplay,
  filteredDatas,
  finishGoodsItemInfo,
  itemSizeInfo,
  rawMaterialDataInfo,
  itemUnitInformation,
  companyinfo,
  filters
}) => {

  let reportTitle = "";

  if (filters?.fromDate !=='' && filters?.productionItemName !== '' && filters.batchNo ==='') {
      reportTitle = `PRODUCTION INFORMATION-(Item-wise Summary)`;
  } else if (filters?.fromDate !=='' && filters?.batchNo !== '') {
      reportTitle = `PRODUCTION INFORMATION-(Batch-wise Summary)`;
  } else if (filters.fromDate !=='') {
      reportTitle = 'PRODUCTION INFORMATION-(Date-wise Summary)';
  }

  const grandTotalProductionQuantity = filteredDatas?.reduce((totalQuantity, item) => 
    totalQuantity + item.totalProductionQty,0);


  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },

    {
      name: "Production Date",
      selector: (row) => new Date(row.date).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Item Name",
      selector: (row) => {
        const itemName = finishGoodsItemInfo?.find(
          (x) => row?.productionItemName === x._id
        );

        const itemSize = itemSizeInfo?.find(
          (size) => size._id === itemName?.sizeId
        );
        return itemName
          ? itemName?.itemName + ` (${itemSize?.sizeInfo})`
          : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Unit",
      selector: (row) => {
        const itemName = finishGoodsItemInfo?.find(
          (x) => row?.productionItemName === x._id
        );
        const itemUnit = itemUnitInformation?.find(
          (size) => size._id === itemName?.unitId
        );
        return itemName ? ` (${itemUnit?.unitInfo})` : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Production Quantity",
      selector: (row) => row.totalProductionQty,
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

  const subHeaderComponent = useMemo(() => {
    return (
      <div className="d-block d-sm-flex justify-content-between align-items-center mb-2">
        {filteredDatas?.length > 0 && (
          <div className="d-flex justify-content-end align-items-center">
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
                        if (companyinfo?.length !== 0 || undefined) {
                          downloadProductionDatewiseSummaryPDF(
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
                      onClick={() => {
                        handleProductionDatewiseSummaryExcel(
                          filteredDatas,
                          finishGoodsItemInfo,
                          itemSizeInfo,
                          itemUnitInformation,
                          companyinfo,
                          reportTitle
                        );
                      }}
                    >
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
  }, [companyinfo, filteredDatas, finishGoodsItemInfo, itemSizeInfo, itemUnitInformation,reportTitle]);

  return (
    <div>
      {isTableDispaly && (
        <div
          className=" "
          style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}
        >
          <DataTable
            title={
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Datewise Summary Report
              </h2>
            }
            subHeaderComponent={subHeaderComponent}
            columns={columns}
            data={filteredDatas}
            defaultSortField="name"
            customStyles={customStyles}
            striped
            pagination
            subHeader
          />

          <table id="my-production-datewise-summary-table" className="d-none">
            <thead>
              <tr>
                <th>Production Date</th>
                <th>Item Name</th>
                <th>Unit</th>
                <th>Production Qty</th>
              </tr>
            </thead>
            <tbody>
              {filteredDatas?.map((detail, detailIndex) => {
                const itemNames = finishGoodsItemInfo?.find(
                  (item) => item._id === detail.productionItemName
                );
                const itemSize = itemSizeInfo.find(
                  (size) => size._id === itemNames?.sizeId
                );

                const itemUnit = itemUnitInformation.find(
                  (size) => size._id === itemNames?.unitId
                );

                const formattedDate = formatDate(detail.date);
                
                return (
                  <tr key={detail._id}>
                      <td
                        style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {formattedDate}
                      </td>
                    <td>{`${itemNames.itemName} (${itemSize.sizeInfo})`}</td>
                    <td>{itemUnit?.unitInfo}</td>
                    <td>{detail.totalProductionQty.toLocaleString()}</td>
                  </tr>
                );
              })}

              <tr>
                <td
                  colSpan={3}
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
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DatewiseProductionSummary;
