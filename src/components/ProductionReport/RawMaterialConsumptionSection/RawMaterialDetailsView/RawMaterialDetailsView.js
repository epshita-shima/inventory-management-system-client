/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { downloadProductionPDFPERBatch } from "../../../ReportProperties/PDF/HeaderFooter";
import { downloadRawMaterailConsumptionDetailsPDF } from "../../../ReportProperties/PDF/handleRawMaterialConsumptionDetailsPDF";
const RawMaterialDetailsView = ({
  permission,
  isTableDispaly,
  setIsTableDisplay,
  filteredDatas,
  rawMaterialDataInfo,
  itemUnitInformation,
  finishGoodsItemInfo,
  itemSizeInfo,
  companyinfo,
}) => {
  const reportTitle = "RAW MATERIAL CONSUMPTION-(Datewise Details)";
  const reportTitleForSingle = "RAW MATERIAL CONSUMPTION";
  const [groupedData, setGroupedData] = useState({});
  const transformedProductionData = filteredDatas?.flatMap((piDetails) =>
    piDetails.detailsData.map((detail) => ({
      ...piDetails,
      detailsData: detail,
    }))
  );
  console.log(filteredDatas);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const grandTotalProductionQuantity = filteredDatas?.reduce((totalMaterialUsed, item) =>
  {
    const detailsMaterialUsed = item.detailsData.reduce(
      (sum, detail) => sum + Number(detail.materialUsed),
      0
    );
    return totalMaterialUsed + detailsMaterialUsed;
  }
  ,0);

  useEffect(() => {
    const groupData = (data) => {
      return data?.reduce((acc, row) => {
        // Use only `finishGoodsDeliveryDate` and `piNo` for grouping
        const key = `${new Date(row.productionDate).toLocaleDateString(
          "en-CA"
        )}`;

        if (!acc[key]) {
          // Initialize with row data and an empty detailsData array
          acc[key] = {
            ...row,
            detailsData: [],
          };
        }

        row.detailsData.forEach((detail) => {
          // Check if the item already exists in the detailsData array
          const existingDetail = acc[key].detailsData.find(
            (d) => d.itemId === detail.itemId
          );
          console.log(existingDetail);
          if (existingDetail) {
            // If it exists, add to the existing materialUsed
            existingDetail.materialUsed += Number(detail.materialUsed);
          } else {
            // If it doesn’t exist, add the detail to detailsData
            acc[key].detailsData.push({
              ...detail,
              materialUsed: Number(detail.materialUsed),
            });
          }
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
      name: "Item Name",
      selector: (row) => {
        const itemName = rawMaterialDataInfo?.find(
          (x) => row?.detailsData.itemId == x._id
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
          (x) => row?.detailsData.itemId == x._id
        );
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
      <div className="d-block d-sm-flex justify-content-between align-items-center">
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
                      class="dropdown-item"
                      href="#"
                      onClick={() => {
                        // handleProductionDatewiseExcel(
                        //   transformedProductionData,
                        //   filteredDatas,
                        //   finishGoodsItemInfo,
                        //   itemSizeInfo,
                        //   companyinfo,
                        //   reportTitle
                        // );
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
  }, [companyinfo, filteredDatas]);

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
                Datewise Details Report
              </h2>
            }
            subHeaderComponent={subHeaderComponent}
            columns={columns}
            data={transformedProductionData}
            defaultSortField="name"
            customStyles={customStyles}
            striped
            pagination
            subHeader
          />

          <table id="my-raw-material-consumption-details-table" className="d-none">
            <thead>
              <tr>
                <th>Production Date</th>
                <th>Item Name</th>
                <th>Unit</th>
                <th>Material Used</th>
              </tr>
            </thead>
            <tbody>
              {groupedData &&
              typeof groupedData === "object" &&
              Object.keys(groupedData)?.length > 0 ? (
                Object.keys(groupedData)?.map((key) => {
                  const group = groupedData[key];
                  const formattedDate = formatDate(group.productionDate);
                  const rowSpan = group?.detailsData?.length;

                  const dateWiseTotalMaterialUsed = group.detailsData.reduce(
                    (cur, acc) => cur + acc.materialUsed,
                    0
                  );

                  return (
                    <>
                      {group?.detailsData.map((detail, detailIndex) => {
                        const itemNames = rawMaterialDataInfo?.find(
                          (item) => item._id === detail.itemId
                        );

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

                            <td>{`${itemNames.itemName}`}</td>
                            <td>{itemUnit.unitInfo}</td>
                            <td>{detail.materialUsed.toLocaleString()}</td>
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
                    </>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              )}

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
