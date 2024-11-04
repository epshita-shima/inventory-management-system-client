/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'

import { useGetAllClientInformationQuery } from '../../../redux/features/clientinformation/clientInfoApi';

import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { useGetAllPaymentInformationQuery } from '../../../redux/features/paymnetinformation/paymentInfoApi';

const OrderSummaryReport = ({ permission ,isTableDispaly,filteredDatas}) => {
  const {data:paymentTypeInfo}=useGetAllPaymentInformationQuery(undefined)
  const [filterText, setFilterText] = React.useState("");

  const { data: customerInfo } = useGetAllClientInformationQuery(undefined)

  console.log(filteredDatas)
  // const { grandQuantity, grandAmount } = filteredDatas?.reduce(
  //   (acc, detail) => {
  //     // Accumulate quantity and totalAmount for each matched item in detailsData
  //     detail.detailsData.forEach((item) => {
  //       acc.grandQuantity += item.quantity || 0;
  //       acc.grandAmount += item.totalAmount || 0;
  //     });
  //     return acc;
  //   },
  //   { grandQuantity: 0, grandAmount: 0 } // Initial accumulator values
  // );

  // const summaryData = [
  //   {
  //     grandQuantity,
  //     grandAmount,
  //     averageRate: grandQuantity ? Math.round(grandAmount / grandQuantity) : 0,
  //   },
  // ];

  const columns = [
    {
      name: "Sl.",
      selector: (invoiceDetails, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Date",
      selector:(row) => row.date,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Payment Type",
      selector:(row) => row.paymentType,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Quantity",
      selector:(row) => row.grandQuantity,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Rate in Avarage",
      selector: (row) =>row.averageRate,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Amount",
      selector:(row) => row.grandAmount,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Action",
      button: true,
      width: "100px",
      grow: 2,
      cell: (invoiceDetails) => (
        <div className="d-flex justify-content-between align-content-center">
          {permission?.isPDF ? (
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
                // downloadInvoicePDF(
                //   invoiceDetails,
                //   finishGoodsData,
                //   customerInfo,
                //   unitInfo,
                //   sizeInfo,
                //   paymentInfo,
                //   base64Logo,
                //   signature,
                //   { companyinfo },
                //   reportTitle
                // );
              }}
            >
              <FontAwesomeIcon icon={faFilePdf}></FontAwesomeIcon>
            </a>
          ) : (
            ""
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


  return (
    <div
      // className="row px-5 mx-2"
      // style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >


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
                  Order Summary Report
                </h2>
              }
              columns={columns}
              data={filteredDatas}
              defaultSortField="name"
              customStyles={customStyles}
              striped
              pagination
              subHeader
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderSummaryReport
