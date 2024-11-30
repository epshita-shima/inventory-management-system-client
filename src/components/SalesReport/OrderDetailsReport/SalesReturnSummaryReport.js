/* eslint-disable jsx-a11y/anchor-is-valid */
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataTable from "react-data-table-component";
import React, { useMemo } from 'react'
import { downloadSalesSummaryPDF } from '../../ReportProperties/PDF/handleSalesSummaryPDF';
import handleSalesReturnSummaryExcel from '../../ReportProperties/Excel/handleSalesReturnSummaryExcel';

const SalesReturnSummaryReport = ({permission,filteredDatas,filterText,piInformation,clientInformation,companyInformation,isTableDispaly,companyinfo}) => {
console.log(filteredDatas) 
const reportTitle="RETURN SUMMARY"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};


const grandTotalAmount=filteredDatas?.reduce((sum,detail)=>sum+detail.totalReturnAmount,0)
const grandTotalReturnQty=filteredDatas?.reduce((sum,detail)=>sum+detail.totalReturnQty,0)

  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },

    {
      name: "Return Date",
      selector: (row) => new Date(row.returnDate).toLocaleDateString('en-CA'),
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Total Return Qty",
      selector: (row) =>  row.totalReturnQty,
      sortable: true,
      center: true,
      filterable: true,
    },
    
    {
      name: "Avg Unit Price",
      selector: (row) => {
       const unitPrice=row.totalReturnAmount /  row.totalReturnQty
       
        return  Math.round(unitPrice);
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Return Amount",
      selector: (row) =>row.totalReturnAmount,
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
                        handleSalesReturnSummaryExcel(
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
                 Return Summary Report
                </h2>
              }
              columns={columns}
              data={filteredDatas}
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
            <th>Return Date</th>
            <th>Avg Unit Price</th>
            <th>Delivered Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredDatas?.map((detail, detailIndex) => {
            const formattedDate = formatDate(detail.returnDate);
            const avarageUnitPrice =
              detail.totalReturnAmount / detail.totalReturnQty;
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
                <td>{detail.totalReturnQty.toLocaleString()}</td>
                <td>{detail.totalReturnAmount.toLocaleString()}</td>
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
              {grandTotalReturnQty != null
                ? grandTotalReturnQty?.toLocaleString()
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
    
  )
}

export default SalesReturnSummaryReport
