/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo } from 'react'
import DataTable from "react-data-table-component";
import { downloadGoupPurchaseSummaryPDF } from '../../ReportProperties/PDF/handlePurchaseDatewiseSummary';
import handlePurchaseDatewiseSummaryExcel from '../../ReportProperties/Excel/handlePurchaseDatewiseSummaryExcel';
const PurchaseSummaryDataTable = ({filteredDatas,isTableDispaly,paymentTypeInfo,companyinfo}) => {

  const reportPurchaseTitle="PURCHASE SUMMARY INFORMATION"
  const columns = [
    {
      name: "Sl.",
      selector: (invoiceDetails, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Date",
      selector: (row) => new Date(row.receiveDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Total Quantity",
      selector: (row) => row.totalPurchaseQty,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Rate in Avarage",
      selector: (row) => Math.round(row.totalPurchaseAmount /row.totalPurchaseQty ),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => row.totalPurchaseAmount,
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
                          downloadGoupPurchaseSummaryPDF(filteredDatas,{ companyinfo }, reportPurchaseTitle);
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
                        handlePurchaseDatewiseSummaryExcel(
                            filteredDatas,
                          companyinfo,
                          reportPurchaseTitle
                        )
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
        <div style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}>
          <div className="shadow-lg">
            <DataTable
              title={
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  Purchase Summary Report
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
        </div>
      )}

      
    </div>
  )
}

export default PurchaseSummaryDataTable
