/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { downloadRawMaterialConsumptionSummaryPDF } from "../../../ReportProperties/PDF/handleRawMaterualConsumptionSummary";
import handleRawMaterialConsumptionSummaryExcel from "../../../ReportProperties/Excel/handleRawMaterialConsumptionSummaryExcel";
import { formatDate } from "../../../Uitilites/DateUtilities";
const RawMaterialConsumptionSummaryView = ({
  permission,
  isTableDispaly,
  setIsTableDisplay,
  filteredDatas,
  rawMaterialDataInfo,
  itemUnitInformation,
  finishGoodsItemInfo,
  itemSizeInfo,
  companyinfo,
  filters
}) => {
  let reportTitle;
  if (filters.itemId !== "") {
    const itemNames = rawMaterialDataInfo?.find(
      (item) => item._id === filters.itemId
    );

    const itemUnit = itemUnitInformation.find(
      (size) => size._id === itemNames?.unitId
    );
    reportTitle = `RAW MATERIAL CONSUMPTION-${itemNames?.itemName} (${itemUnit.unitInfo})`;
  } else {
    reportTitle = "RAW MATERIAL CONSUMPTION-(Datewise Summary)";
  }


  const grandTotalMaterialUsed = filteredDatas?.reduce(
    (totalMaterialUsed, item) => totalMaterialUsed + item.totalMaterialUsed,
    0
  );

  console.log(filteredDatas);

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
        const itemName = rawMaterialDataInfo?.find((x) => row?.itemId == x._id);

        return itemName ? itemName?.itemName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Unit",
      selector: (row) => {
        const itemName = rawMaterialDataInfo?.find((x) => row?.itemId == x._id);
        const itemUnit = itemUnitInformation?.find(
          (size) => size._id == itemName?.unitId
        );
        return itemName ? ` (${itemUnit?.unitInfo})` : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Production Quantity",
      selector: (row) => row.totalMaterialUsed,
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
                          downloadRawMaterialConsumptionSummaryPDF(
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
                        handleRawMaterialConsumptionSummaryExcel(
                          filteredDatas,
                          rawMaterialDataInfo,
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
  }, [companyinfo, filteredDatas, itemUnitInformation, rawMaterialDataInfo, reportTitle]);

  return (
    <div>
      {isTableDispaly && (
        <div
          className=" "
          style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}
        >
          <DataTable
            // title={
            //   <h2
            //     style={{
            //       fontSize: "24px",
            //       fontWeight: "bold",
            //       color: "#000",
            //     }}
            //   >
            //     Datewise Summary Report
            //   </h2>
            // }
            subHeaderComponent={subHeaderComponent}
            columns={columns}
            data={filteredDatas}
            defaultSortField="name"
            customStyles={customStyles}
            striped
            pagination
            subHeader
          />
        </div>
      )}

      <table id="my-raw-material-consumption-summary-table" className="d-none">
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
            const itemNames = rawMaterialDataInfo?.find(
              (item) => item._id === detail.itemId
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
                <td>{`${itemNames.itemName}`}</td>
                <td>{itemUnit?.unitInfo}</td>
                <td>{detail.totalMaterialUsed.toLocaleString()}</td>
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
              {grandTotalMaterialUsed != null
                ? grandTotalMaterialUsed?.toLocaleString()
                : 0}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RawMaterialConsumptionSummaryView;
