/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {  useMemo} from "react";
import DataTable from "react-data-table-component";
import { useGetAllPaymentInformationQuery } from "../../../../redux/features/paymnetinformation/paymentInfoApi";
import { downloadSalesSummaryPDF } from "../../../ReportProperties/PDF/handleSalesSummaryPDF";
import handleOrderSummaryExcel from "../../../ReportProperties/Excel/handleOrderSummaryExcel";
import { formatDate } from "../../../Uitilites/DateUtilities";
import LoadingSpineer from "../../../Common/LoadingSpinner/LoadingSpineer";

const OrderSummaryReport = ({
  permission,
  isTableDispaly,
  filteredDatas,
  companyinfo,
  isOrderSummaryLoading
}) => {
  const { data: paymentTypeInfo } = useGetAllPaymentInformationQuery(undefined);
  const reportTitle = "ORDER SUMMARYF";
  const grandTotalQuantity = filteredDatas?.reduce(
    (sum, details) => sum + details.grandQuantity,
    0
  );
  const grandTotalAmount = filteredDatas?.reduce(
    (sum, details) => sum + details.grandAmount,
    0
  );

  const columns = [
    {
      name: "Sl.",
      selector: (invoiceDetails, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Payment Type",
      selector: (row) => {
        const paymnetInfo = paymentTypeInfo?.find(
          (type) => type._id == row.paymentId
        );
        return paymnetInfo ? paymnetInfo.paymentMode : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Quantity",
      selector: (row) => row.grandQuantity,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Rate in Avarage",
      selector: (row) => row.averageRate,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => row.grandAmount,
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
                          downloadSalesSummaryPDF({ companyinfo }, reportTitle);
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
                        handleOrderSummaryExcel(
                          filteredDatas,
                          paymentTypeInfo,
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
  }, [companyinfo, filteredDatas, paymentTypeInfo]);
  
  return (
    <div >
      <LoadingSpineer isLoading={isOrderSummaryLoading}></LoadingSpineer>
      {isTableDispaly && (
        <div className={`${isOrderSummaryLoading ? 'd-none' : 'd-block'}`} style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}>
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
                  Order Summary Report
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

      <table id="my-sales-summary-table" className="d-none">
        <thead>
          <tr>
            <th>PI Date</th>
            <th>Payment Type</th>
            <th>Avg Unit Price</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredDatas?.map((detail, detailIndex) => {
            const formattedDate = formatDate(detail.date);
            const avarageUnitPrice = detail.grandAmount / detail.grandQuantity;
            const paymentType = paymentTypeInfo?.find(
              (x) => x._id === detail.paymentId
            );
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
                <td>{paymentType?.paymentMode}</td>
                <td>{Math.round(avarageUnitPrice)}</td>
                <td>{detail.grandQuantity.toLocaleString()}</td>
                <td>{detail.grandAmount.toLocaleString()}</td>
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
              {grandTotalQuantity != null
                ? grandTotalQuantity?.toLocaleString()
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

export default OrderSummaryReport;
