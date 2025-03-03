/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { formatDate } from "../../../Uitilites/DateUtilities";
import { downloadRawMaterailConsumptionDetailsPDF } from "../../../ReportProperties/PDF/handleRawMaterialConsumptionDetailsPDF";
import handleRawMaterialConsumptionDetails from "../../../ReportProperties/Excel/handleRawMaterialConsumptionDetails";

const ProductionConsumptionDetailsModal = ({
  productionSingleItemDetailsData,
  rawMaterialItem,
  companyinfo,
  itemUnitInfo,
  selectedRow,
}) => {
  const itemNames = rawMaterialItem?.find(
    (item) => item._id === selectedRow.itemId
  );
  const unitInfo = itemUnitInfo?.find((item) => item._id === itemNames.unitId);
  const reportTitleForSingle = `Itemwise Production Consumption of ${itemNames.itemName}(${unitInfo.unitInfo}) Details`;
  const [groupedData, setGroupedData] = useState({});

  const transformedProductionData = productionSingleItemDetailsData?.flatMap(
    (piDetails) =>
      piDetails.detailsData.map((detail) => ({
        ...piDetails,
        detailsData: detail,
      }))
  );

  console.log(transformedProductionData)
  const grandTotalProductionQuantity = productionSingleItemDetailsData?.reduce(
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
      const data = await groupData(productionSingleItemDetailsData);
      setGroupedData(data);
    };

    processData();
  }, [productionSingleItemDetailsData]);

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
      width: "200px",
    },
    {
      name: "Batch No",
      selector: (row) => row.batchNo,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Production Consumption",
      selector: (row) => row.detailsData.materialUsed,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },

    {
      name: "Item Name",
      selector: (row) => {
        const itemName = rawMaterialItem?.find(
          (x) => row?.detailsData.itemId === x._id
        );

        return itemName ? itemName?.itemName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Unit",
      selector: (row) => {
        const itemName = rawMaterialItem?.find(
          (x) => row?.detailsData.itemId === x._id
        );
        const itemUnit = itemUnitInfo?.find(
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
      selector: (row) => row.productionQty,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
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
        {productionSingleItemDetailsData?.length > 0 && (
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
                        console.log(companyinfo?.length !== 0);
                        if (companyinfo?.length !== 0 || undefined) {
                          downloadRawMaterailConsumptionDetailsPDF(
                            { companyinfo },
                            reportTitleForSingle
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
                          productionSingleItemDetailsData,
                          rawMaterialItem,
                          itemUnitInfo,
                          companyinfo,
                          reportTitleForSingle
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
  }, [
    companyinfo,
    itemUnitInfo,
    productionSingleItemDetailsData,
    rawMaterialItem,
    reportTitleForSingle,
    transformedProductionData,
  ]);

  return (
    <div>
      <div
        className="modal fade"
        id="exampleModalLabelProductionConsumptionDetails"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg fullscreen-modal" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="exampleModalLabelProductionConsumptionDetails"
              >
                {`Itemwise Production Consumption of ${itemNames.itemName}(${unitInfo.unitInfo}) Details`}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body w-100">
              <div
              // style={{ height: "calc(65vh - 120px)", width:'100%',overflowY: "scroll" }}
              >
                <DataTable
                  columns={columns}
                  data={transformedProductionData}
                  defaultSortField="name"
                  customStyles={customStyles}
                  striped
                  pagination
                  subHeader
                  subHeaderComponent={subHeaderComponent}
                />
              </div>
              <table
                id="my-raw-material-consumption-details-table"
                className="d-none"
              >
                <thead>
                  <tr>
                    <th>Production Date</th>
                    <th>Batch No</th>
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
console.log(batches)
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
                                {batch.detailsData.map(
                                  (detail, detailIndex) => {
                                

                                    return (
                                      <tr key={detail._id}>
                                        {/* Render Production Date only once per date */}
                                        {detailIndex === 0 &&
                                          batchIndex === 0 && (
                                            <td
                                              rowSpan={batches.reduce(
                                                (acc, curBatch) =>
                                                  acc +
                                                  curBatch.detailsData.length,
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


                                        <td>
                                          {detail?.materialUsed.toLocaleString()}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </React.Fragment>
                            );
                          })}

                          {/* Date-wise Total Row */}
                          <tr>
                            <td
                              colSpan={ 2 }
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
                      colSpan={2 }
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionConsumptionDetailsModal;
