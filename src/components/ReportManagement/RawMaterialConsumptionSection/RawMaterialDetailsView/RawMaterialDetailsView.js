/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { downloadProductionPDFPERBatch } from "../../../ReportProperties/PDF/HeaderFooter";
import { downloadRawMaterailConsumptionDetailsPDF } from "../../../ReportProperties/PDF/handleRawMaterialConsumptionDetailsPDF";
import handleRawMaterialConsumptionDetails from "../../../ReportProperties/Excel/handleRawMaterialConsumptionDetails";
import { formatDate } from "../../../Uitilites/DateUtilities";
const RawMaterialDetailsView = ({
  permission,
  isTableDispaly,
  filteredDatas,
  rawMaterialDataInfo,
  itemUnitInformation,
  finishGoodsItemInfo,
  itemSizeInfo,
  companyinfo,
  filters,
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
    reportTitle = "RAW MATERIAL CONSUMPTION-(Datewise Details)";
  }

  const reportTitleForSingle = "RAW MATERIAL CONSUMPTION";
  const [groupedData, setGroupedData] = useState({});
  const transformedProductionData = filteredDatas?.flatMap((piDetails) =>
    piDetails.detailsData.map((detail) => ({
      ...piDetails,
      detailsData: detail,
    }))
  );
console.log('transformedProductionData',transformedProductionData)

  const grandTotalProductionQuantity = filteredDatas?.reduce(
    (totalMaterialUsed, item) => {
      const detailsMaterialUsed = item.detailsData.reduce(
        (sum, detail) => sum + Number(detail.materialUsed),
        0
      );
      return totalMaterialUsed + detailsMaterialUsed;
    },
    0
  );

  useEffect(() => {
    const groupData = (data) => {
      return data?.reduce((acc, row) => {
        // Group by productionDate
        const key = new Date(row.productionDate).toLocaleDateString("en-CA");

        if (!acc[key]) {
          acc[key] = []; // Initialize an array for each date
        }

        // Push the batch and its detailsData as a separate object
        acc[key].push({
          batchNo: row.batchNo,
          detailsData: row.detailsData,
        });

        return acc;
      }, {});
    };

    const processData = async () => {
      const data = await groupData(filteredDatas);
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
        const itemName = rawMaterialDataInfo?.find(
          (x) => row?.detailsData.itemId === x._id
        );

        return itemName ? itemName?.itemName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Unit",
      selector: (row) => {
        const itemName = rawMaterialDataInfo?.find(
          (x) => row?.detailsData.itemId === x._id
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
       selector: (row) => row?.detailsData?.materialUsed,
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
                  (returnItem) => returnItem._id === row._id
                );
                downloadProductionPDFPERBatch(
                  singleReturnData,
                  finishGoodsItemInfo,
                  itemSizeInfo,
                  rawMaterialDataInfo,
                  { companyinfo },
                  reportTitleForSingle
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
                          downloadRawMaterailConsumptionDetailsPDF(
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
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                       
                        handleRawMaterialConsumptionDetails(
                          transformedProductionData,
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
  }, [companyinfo, filteredDatas, itemUnitInformation, rawMaterialDataInfo, reportTitle, transformedProductionData]);

  return (
    <div>
      {isTableDispaly && (
        <div
          className=" "
          style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}
        >
          <DataTable
            subHeaderComponent={subHeaderComponent}
            columns={columns}
            data={transformedProductionData}
            defaultSortField="name"
            customStyles={customStyles}
            striped
            pagination
            subHeader
          />

          <table
            id="my-raw-material-consumption-details-table"
            className="d-none"
          >
            <thead>
              <tr>
                <th>Production Date</th>
                <th>Batch No</th>
                {
                  filters.itemId ? '' :  <th>Item Name</th>
                }
               {
                filters.itemId ? '' : <th>Unit</th>
               }
               
                <th>Production Consumption</th>
              </tr>
            </thead>
            <tbody>
              {groupedData &&
              typeof groupedData === "object" &&
              Object.keys(groupedData)?.length > 0 ? (
                Object.keys(groupedData)?.map((dateKey) => {
                  const batches = groupedData[dateKey]; // Get batches for this date
                  const formattedDate = formatDate(dateKey); // Format the date key

                  // Calculate total material used for the entire date
                  const dateWiseTotalMaterialUsed = batches.reduce(
                    (total, batch) =>
                      total +
                      batch.detailsData.reduce(
                        (batchTotal, detail) =>
                          batchTotal + detail.materialUsed,
                        0
                      ),
                    0
                  );

                  return (
                    <React.Fragment key={dateKey}>
                      {batches.map((batch, batchIndex) => {
                        const rowSpan = batch.detailsData?.length || 1;

                        return (
                          <React.Fragment key={batch.batchNo}>
                            {batch.detailsData.map((detail, detailIndex) => {
                              const itemNames = rawMaterialDataInfo?.find(
                                (item) => item._id === detail.itemId
                              );

                              const itemUnit = itemUnitInformation.find(
                                (size) => size._id === itemNames?.unitId
                              );

                              return (
                                <tr key={detail._id}>
                                  {/* Render Production Date only once per date */}
                                  {detailIndex === 0 && batchIndex === 0 && (
                                    <td
                                      rowSpan={batches.reduce(
                                        (acc, curBatch) =>
                                          acc + curBatch.detailsData.length,
                                        0
                                      )}
                                      style={{
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      {formattedDate}
                                    </td>
                                  )}

                                  {/* Render Batch No only once per batch */}
                                  {detailIndex === 0 && (
                                    <td
                                      rowSpan={rowSpan}
                                      style={{
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      {batch.batchNo}
                                    </td>
                                  )}

                                  {/* Render Item Details */}
                                  {filters.itemId ? (
                                    ""
                                  ) : (
                                    <td>{`${
                                      itemNames?.itemName || "Unknown Item"
                                    }`}</td>
                                  )}
                                  {filters.itemId ? (
                                    ""
                                  ) : (
                                    <td>{itemUnit?.unitInfo || "N/A"}</td>
                                  )}

                                  <td>
                                    {detail.materialUsed.toLocaleString()}
                                  </td>
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}

                      {/* Date-wise Total Row */}
                      <tr>
                        <td
                          colSpan={filters.itemId ? 2:4}
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
                          {dateWiseTotalMaterialUsed.toLocaleString()}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              )}

              {/* Grand Total Row */}
              <tr>
                <td
                  colSpan={filters.itemId ? 2:4}
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

export default RawMaterialDetailsView;
