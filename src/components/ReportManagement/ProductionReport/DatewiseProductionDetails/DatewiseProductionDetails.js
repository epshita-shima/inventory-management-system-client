/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import { downloadProductionPDFPERBatch } from "../../../ReportProperties/PDF/HeaderFooter";
import { downloadProductionDatewiseDetailsInfoPDF } from "../../../ReportProperties/PDF/handleProductionDatewiseDetailsPDF";
import handleProductionDatewiseExcel from './../../../ReportProperties/Excel/handleProductionDatewiseExcel';
import { formatDate } from "../../../Uitilites/DateUtilities";
import { groupProductionDateByDetails } from "../../../Uitilites/reportDataGrouping";
import { calculateProductionQuantity } from "../../../Uitilites/CalculationUtilities/calculation";

const DatewiseProductionDetails = ({
  permission,
  isTableDispaly,
  setIsTableDisplay,
  filteredDatas,
  finishGoodsItemInfo,
  itemSizeInfo,
  rawMaterialDataInfo,
  itemUnitInformation,
  companyinfo,
}) => {
  const reportTitle = "PRODUCTION INFORMATION-(Datewise Details)";
  const [groupedData, setGroupedData] = useState({});
  const transformedProductionData = filteredDatas?.flatMap((piDetails) =>
    piDetails.detailsData.map((detail) => ({
      ...piDetails,
      detailsData: detail,
    }))
  );

  const grandTotalProductionQuantity = calculateProductionQuantity(filteredDatas)

  useEffect(() => {
    const processData = async () => {
      const data = await groupProductionDateByDetails(filteredDatas);
      setGroupedData(data);
    };
    processData();
  }, [filteredDatas]);

  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },

    {
      name: "Production Date",
      selector: (row) =>
        new Date(row.productionDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Batch No",
      selector: (row) => row.batchNo,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Item Name",
      selector: (row) => {
        const itemName = finishGoodsItemInfo?.find(
          (x) => row?.productionItemName == x._id
        );
        console.log("row.detailsData", row.detailsData.itemId);
        const itemSize = itemSizeInfo?.find(
          (size) => size._id == itemName?.sizeId
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
          (x) => row?.productionItemName == x._id
        );
        const itemUnit = itemUnitInformation?.find(
          (size) => size._id == itemName?.unitId
        );
        return itemName
          ? ` (${itemUnit?.unitInfo})`
          : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Production Quantity",
      selector: (row) => row.productionQty,
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
          {permission?.isPDF && (
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
                const singleReturnData = filteredDatas.find(
                  (returnItem) => returnItem._id == row._id
                );
                console.log(singleReturnData);
                downloadProductionPDFPERBatch(
                  singleReturnData,
                  finishGoodsItemInfo,
                  itemSizeInfo,
                  rawMaterialDataInfo,
                  { companyinfo },
                  reportTitle
                );
              }}
            >
              <FontAwesomeIcon icon={faFilePdf}></FontAwesomeIcon>
            </a>
          )}
        </div>
      ),
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
                          downloadProductionDatewiseDetailsInfoPDF(
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
                        handleProductionDatewiseExcel(
                          transformedProductionData,
                          filteredDatas,
                          finishGoodsItemInfo,
                          itemSizeInfo,
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
  }, [companyinfo, filteredDatas, finishGoodsItemInfo, itemSizeInfo, transformedProductionData]);

  return (
    <div>
      {isTableDispaly && (
        <div
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
            //     Datewise Details
            //   </h2>
            // }
            subHeaderComponent={subHeaderComponent}
            columns={columns}
            data={transformedProductionData}
            defaultSortField="name"
            customStyles={customStyles}
            striped
            pagination
            subHeader
          />

          <table id="my-production-datewise-details-table" className="d-none">
            <thead>
              <tr>
                <th>Production Date</th>
                <th>Batch</th>
                <th>Item Name</th>
                <th>Unit</th>
                <th>Production Qty</th>
              </tr>
            </thead>
            <tbody>
              {groupedData &&
              typeof groupedData === "object" &&
              Object.keys(groupedData).length > 0 ? (
                Object.keys(groupedData)?.map((key) => {
                  const group = groupedData[key];
                  const rowSpan = group?.mainData.length;
                  const dateWiseTotalProductionQty = group.mainData.reduce(
                    (total, detail) => total + detail.productionQty,
                    0
                  );
                  return (
                    <>
                      {group?.mainData.map((detail, detailIndex) => {
                        const itemNames = finishGoodsItemInfo?.find(
                          (item) => item._id === detail.productionItemName
                        );
                        console.log(itemNames);
                        const itemSize = itemSizeInfo.find(
                          (size) => size._id === itemNames?.sizeId
                        );
                        const formattedDate = formatDate(detail.productionDate);
                        const itemUnit = itemUnitInformation.find(
                          (size) => size._id === itemNames?.unitId
                        );
                        return (
                          <tr key={detail._id}>
                            {detailIndex === 0 && (
                              <td
                                rowSpan={rowSpan}
                                style={{
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                }}
                              >
                                {formattedDate}
                              </td>
                            )}

                            <td>
                              {detail.batchNo}
                            </td>
                            <td >{`${itemNames.itemName} (${itemSize.sizeInfo})`}</td>
                            <td>{itemUnit?.unitInfo}</td>
                            <td>{detail.productionQty.toLocaleString()}</td>
                          </tr>
                        );
                      })}

                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            textAlign: "right",
                            fontWeight: "bold",
                            padding: "8px",
                            border: "1px solid black",
                          }}
                        >
                          Datewise Total
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                            border: "1px solid black",
                          }}
                        >
                          {dateWiseTotalProductionQty.toLocaleString()}
                        </td>
                      </tr>
                    </>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              )}

              <tr>
                <td
                  colSpan={4}
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
                ? grandTotalProductionQuantity.toLocaleString()
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

export default DatewiseProductionDetails;
