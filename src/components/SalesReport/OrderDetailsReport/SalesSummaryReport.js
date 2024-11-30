/* eslint-disable jsx-a11y/anchor-is-valid */
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import React, { useMemo } from "react";
import { downloadSalesSummaryPDF } from "../../ReportProperties/PDF/handleSalesSummaryPDF";
import handleSalesReturnSummaryExcel from "../../ReportProperties/Excel/handleSalesSummaryExcel";
import handleSalesSummaryExcel from "../../ReportProperties/Excel/handleSalesSummaryExcel";

const SalesSummaryReport = ({
  permission,
  piInformation,
  doInformation,
  clientInformation,
  filteredDatas,
  isTableDispaly,
  companyinfo,
}) => {
  const reportTitle = "SALES SUMMARY";
  const [filterText, setFilterText] = React.useState("");

  console.log(filteredDatas);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const grandTotalAmount=filteredDatas?.reduce((sum,detail)=>sum+detail.totalDeliverAmount,0)
  const grandTotalDeliveredQty=filteredDatas?.reduce((sum,detail)=>sum+detail.totalDeliverQty,0)
  
  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Delivery Date",
      selector: (row) => row.deliverDate,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Avg Unit Price",
      selector: (row) => {
        const avgUnitPrice = row.totalDeliverAmount / row.totalDeliverQty;
        return Math.round(avgUnitPrice);
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Delivered Quantity",
      selector: (row) => row.totalDeliverQty,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => row.totalDeliverAmount,
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
  };

  const filteredItems = filteredDatas?.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );

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
                          downloadSalesSummaryPDF(
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
                        handleSalesSummaryExcel(
                          filteredDatas,
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
  }, [companyinfo, filteredDatas, reportTitle]);

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
                Sales Summary Report
              </h2>
            }
            columns={columns}
            data={filteredItems}
            defaultSortField="name"
            customStyles={customStyles}
            subHeaderComponent={subHeaderComponent}
            striped
            pagination
            subHeader
          />
        </div>
      )}

      <table id="my-sales-summary-table" className="d-none">
        <thead>
          <tr>
            <th>Delivery Date</th>
            <th>Avg Unit Price</th>
            <th>Delivered Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredDatas?.map((detail, detailIndex) => {
            const formattedDate = formatDate(detail.deliverDate);
            const avarageUnitPrice =
              detail.totalDeliverAmount / detail.totalDeliverQty;
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
                <td>{Math.round(avarageUnitPrice)}</td>
                <td>{detail.totalDeliverQty.toLocaleString()}</td>
                <td>{detail.totalDeliverAmount.toLocaleString()}</td>
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
              {grandTotalDeliveredQty != null
                ? grandTotalDeliveredQty?.toLocaleString()
                : 0} 
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalAmount != null
                ? grandTotalAmount?.toLocaleString()
                : 0} 
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SalesSummaryReport;
