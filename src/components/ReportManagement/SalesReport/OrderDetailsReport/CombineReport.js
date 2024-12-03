/* eslint-disable jsx-a11y/anchor-is-valid */
import DataTable from "react-data-table-component";
import React, { useMemo } from "react";
import downloadCombineReportPDF from "../../../ReportProperties/PDF/handleCombineReportPDF";
import handelCombineReportExcel from "../../../ReportProperties/Excel/handelCombineReportExcel";
import { formatDate } from "../../../Uitilites/DateUtilities";

const CombineReport = ({
  permission,
  filteredCombineData,
  filterText,
  piInformation,
  clientInformation,
  companyInformation,
  isTableDispaly,
  companyinfo,
  itemSizeInfo,
}) => {
  const { groupedResult, orderInfo } = filteredCombineData || {};
  const reportTitle = "COMBINE REPORT (SALES)";

  const grandTotalPIQty = groupedResult?.reduce(
    (sum, detail) => sum + detail.totalPIQuantity,
    0
  );
  const grandTotalPIAmount = groupedResult?.reduce(
    (sum, detail) => sum + detail.totalPiAmount,
    0
  );
  const grandTotalDeliveredQty = groupedResult?.reduce(
    (sum, detail) => sum + detail.totalDeliveredQty,
    0
  );
  const grandTotalDeliveredAmount = groupedResult?.reduce(
    (sum, detail) => sum + detail.totalDeliveredAmount,
    0
  );
  const grandTotalReturnQty = groupedResult?.reduce(
    (sum, detail) => sum + detail.totalReturnQty,
    0
  );
  const grandTotalReturnAmount = groupedResult?.reduce(
    (sum, detail) => sum + detail.totalReturnAmount,
    0
  );
  const grandTotalNetQty = groupedResult?.reduce(
    (sum, detail) => sum + detail.netQuantity,
    0
  );
  const grandTotalNetAmount = groupedResult?.reduce(
    (sum, detail) => sum + detail.totalNetAmount,
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
      name: "Return Date",
      selector: (row) => new Date(row.date).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
      width: "150px",
    },

    {
      name: "PI Quantity",
      selector: (row) => row.totalPIQuantity,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "PI Unit Price",
      selector: (row) => row.piUnitPrice,
      sortable: true,
      center: true,
      filterable: true,
      width: "150px",
    },
    {
      name: "PI Amount",
      selector: (row) => row.totalPiAmount,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },

    {
      name: "Delivered Quantity",
      selector: (row) => (
        <span>{row.totalDeliveredQty === 0 ? `-` : row.totalDeliveredQty}</span>
      ),
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Avg Delivered Unitprice",
      selector: (row) => (
        <span>
          {row.deliveredAvgUnitPrice === 0 || row.deliveredAvgUnitPrice === null
            ? `-`
            : row.deliveredAvgUnitPrice}
        </span>
      ),
      sortable: true,
      center: true,
      filterable: true,
      width: "220px",
    },
    {
      name: "Delivered Amount",
      selector: (row) => (
        <span>
          {row.totalDeliveredAmount === 0 || row.totalDeliveredAmount === null
            ? `-`
            : row.totalDeliveredAmount}
        </span>
      ),
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Return Quantity",
      selector: (row) => (
        <span>{row.totalReturnQty === 0 ? `-` : row.totalReturnQty}</span>
      ),
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Avg Return Unitprice",
      selector: (row) => (
        <span>
          {row.returnAvgUnitPrice === 0 || row.returnAvgUnitPrice === null
            ? `-`
            : row.returnAvgUnitPrice}
        </span>
      ),
      sortable: true,
      center: true,
      filterable: true,
      width: "220px",
    },
    {
      name: "Net Quantity",
      selector: (row) => (
        <span style={{ color: row.netQuantity < 0 ? "red" : "inherit" }}>
          {row.netQuantity < 0
            ? `(${Math.abs(row.netQuantity)})`
            : row.netQuantity}
        </span>
      ),
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Avg Net Unitprice",
      selector: (row) => (
        <span
          style={{
            color:
              row.netAvgUnitPrice === 0 || row.netAvgUnitPrice === null
                ? "red"
                : "inherit",
          }}
        >
          {row.netAvgUnitPrice < 0
            ? `(${Math.abs(row.netAvgUnitPrice)})`
            : row.netAvgUnitPrice}
        </span>
      ),
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Net Amount",
      selector: (row) => (
        <span
          style={{
            color:
              row.totalNetAmount < 0 || row.totalNetAmount === null
                ? "red"
                : "inherit",
          }}
        >
          {row.totalNetAmount < 0
            ? `(${Math.abs(row.totalNetAmount)})`
            : row.totalNetAmount}
        </span>
      ),
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
      <div className="d-block d-sm-flex justify-content-between align-items-center">
        {
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
                      if (companyinfo?.length !== 0 || undefined) {
                        downloadCombineReportPDF({ companyinfo }, reportTitle);
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
                      const calculateInvoiceMetrics = (data) => {
                        const grouped = {};
                      
                        data?.forEach((entry) => {
                          const { piDate, invoiceNo, detailsData } = entry;
                      
                          if (!grouped[invoiceNo]) {
                            grouped[invoiceNo] = {
                              piDate,
                              invoiceNo,
                              totalQuantity: 0,
                              totalPiAmount: 0,
                              totalDeliveredQty: 0,
                              totalDeliveredAmount: 0,
                              totalReturnAmount: 0,
                              totalReturnQty: 0,
                              totalNetQty: 0,
                              piUnitPrice: 0,
                              deliveredAvgUnitprice: 0,
                              returnAvgUnitPrice: 0,
                              totalNetAmount: 0,
                              netAvgUnitPrice: 0,
                            };
                          }
                      
                          detailsData?.forEach(
                            ({
                              quantity,
                              unitPrice,
                              deliveredQty,
                              returnQty,
                            }) => {
                              grouped[invoiceNo].totalQuantity += quantity;
                              grouped[invoiceNo].totalDeliveredQty += deliveredQty;
                              grouped[invoiceNo].totalReturnQty += returnQty;
                              grouped[invoiceNo].totalNetQty += deliveredQty - returnQty;
                      
                              grouped[invoiceNo].totalPiAmount += Number(quantity) * Number(unitPrice);
                      
                              grouped[invoiceNo].piUnitPrice = Math.round(
                                grouped[invoiceNo].totalPiAmount /
                                  grouped[invoiceNo].totalQuantity
                              );
                      
                              grouped[invoiceNo].totalDeliveredAmount += deliveredQty * unitPrice;
                              grouped[invoiceNo].totalReturnAmount += returnQty * unitPrice;
                      
                              grouped[invoiceNo].deliveredAvgUnitprice = 
                              grouped[invoiceNo].totalDeliveredQty > 0
                                ? Math.round(grouped[invoiceNo].totalDeliveredAmount / grouped[invoiceNo].totalDeliveredQty)
                                : 0;
                      
                              grouped[invoiceNo].returnAvgUnitPrice = grouped[invoiceNo].totalReturnQty > 0 ? Math.round(
                                grouped[invoiceNo].totalReturnAmount /
                                  grouped[invoiceNo].totalReturnQty
                              ):0;
                      
                              grouped[invoiceNo].date = piDate;
                      
                              grouped[invoiceNo].totalNetQty = (grouped[invoiceNo].totalQuantity -
                                grouped[invoiceNo].totalDeliveredQty) + grouped[invoiceNo].totalReturnQty;
                      
                              grouped[invoiceNo].totalNetAmount = grouped[invoiceNo].totalNetQty * grouped[invoiceNo].piUnitPrice;
                      
                              grouped[invoiceNo].netAvgUnitPrice = Math.round(
                                grouped[invoiceNo].totalNetAmount /
                                  grouped[invoiceNo].totalNetQty
                              );
                            }
                          );
                        });
                      
                        // Convert grouped object to an array
                        return Object.values(grouped);
                      };
                      
                      const calculatedData = calculateInvoiceMetrics(orderInfo);

                      handelCombineReportExcel(
                        groupedResult,
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
        </div>)
        }
      
      </div>
    );
  }, [companyinfo, orderInfo,groupedResult]);

  return (
    <div>
      {isTableDispaly ? (
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
                Combine Report
              </h2>
            }
            columns={columns}
            data={groupedResult}
            defaultSortField="name"
            customStyles={customStyles}
            subHeaderComponent={subHeaderComponent}
            striped
            pagination
            subHeader
          />
        </div>
      ) : null}

      <table id="my-combine-report-table" className="d-none">
        <thead>
          <tr>
            <th>Date</th>
            <th>PI Quantity</th>
            <th>Rate In Avg</th>
            <th>PI Amount</th>
            <th>Delivered Quantity</th>
            <th>Rate In Avg</th>
            <th>Delivered Amount</th>
            <th>Return Quantity</th>
            <th>Rate In Avg</th>
            <th>Return Amount</th>
            <th>Net Quantity</th>
            <th>Rate In Avg</th>
            <th>Net Amount</th>
          </tr>
        </thead>
        <tbody>
          <>
            {groupedResult?.map((detail, detailIndex) => {
              const formatedDate = formatDate(detail.date);

              return (
                <tr key={detail._id}>
                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    {formatedDate}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    {detail.totalPIQuantity.toLocaleString()}
                  </td>

                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    {detail.piUnitPrice}
                  </td>

                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    {detail.totalPiAmount.toLocaleString()}
                  </td>
                  <td>
                    {detail.totalDeliveredQty === 0 ||
                    detail.totalDeliveredQty === null
                      ? `-`
                      : detail.totalDeliveredQty.toLocaleString()}
                  </td>
                  <td>
                    {detail.deliveredAvgUnitPrice === 0 ||
                    detail.deliveredAvgUnitPrice === null
                      ? `-`
                      : detail.deliveredAvgUnitPrice.toLocaleString()}
                  </td>
                  <td>
                    {detail.totalDeliveredAmount === 0 ||
                    detail.totalDeliveredAmount === null
                      ? `-`
                      : detail.totalDeliveredAmount.toLocaleString()}
                  </td>
                  <td>
                    {detail.totalReturnQty === 0 ||
                    detail.totalReturnQty === null
                      ? `-`
                      : detail.totalReturnQty.toLocaleString()}
                  </td>
                  <td>
                    {detail.returnAvgUnitPrice === 0 ||
                    detail.returnAvgUnitPrice === null
                      ? `-`
                      : detail.returnAvgUnitPrice.toLocaleString()}
                  </td>
                  <td>
                    {detail.totalReturnAmount === 0 ||
                    detail.totalReturnAmount === null
                      ? `-`
                      : detail.totalReturnAmount.toLocaleString()}
                  </td>
                  <td
                    style={{
                      color: detail.netQuantity < 0 ? "red" : "inherit",
                    }}
                  >
                    {detail.netQuantity < 0
                      ? `(${Math.abs(detail.netQuantity).toLocaleString()})`
                      : detail.netQuantity.toLocaleString()}
                  </td>
                  <td>{detail.netAvgUnitPrice}</td>
                  <td
                    style={{
                      color: detail.totalNetAmount < 0 ? "red" : "inherit",
                    }}
                  >
                    {detail.totalNetAmount < 0
                      ? `(${Math.abs(detail.totalNetAmount).toLocaleString()})`
                      : detail.totalNetAmount.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </>

          <tr>
            <td
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
              {grandTotalPIQty != null ? grandTotalPIQty.toLocaleString() : 0}
            </td>
            <td></td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalPIAmount != null
                ? grandTotalPIAmount.toLocaleString()
                : 0}
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalDeliveredQty != null
                ? grandTotalDeliveredQty.toLocaleString()
                : 0}
            </td>
            <td></td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalDeliveredAmount != null
                ? grandTotalDeliveredAmount.toLocaleString()
                : 0}
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalReturnQty != null
                ? grandTotalReturnQty.toLocaleString()
                : 0}
            </td>
            <td></td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalReturnAmount != null
                ? grandTotalReturnAmount.toLocaleString()
                : 0}
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalNetQty != null ? grandTotalNetQty.toLocaleString() : 0}
            </td>
            <td></td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalNetAmount != null
                ? grandTotalNetAmount.toLocaleString()
                : 0}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CombineReport;
