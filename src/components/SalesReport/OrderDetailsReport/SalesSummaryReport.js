/* eslint-disable jsx-a11y/anchor-is-valid */
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataTable from "react-data-table-component";
import React from 'react'

const SalesSummaryReport = ({permission,piInformation,doInformation,clientInformation,filteredDatas,isTableDispaly}) => {
 console.log(JSON.stringify(filteredDatas))
  const [filterText, setFilterText] = React.useState("");
  // const groupedData = filteredDatas?.reduce((acc, item) => {
  //   // Create a unique key based on itemId, paymentId, and date
  //   const key = `${item.itemId}-${item.paymentId}-${item.date}`;
  //     // Check if the group already exists in the accumulator
  //   if (!acc[key]) {
  //     // If not, initialize a new group
  //     acc[key] = {
  //       itemId: item.itemId,
  //       paymentId: item.paymentId,
  //       date: item.date,
  //       totalDeliverQty: 0,
  //       totalAmount: 0
  //     };
  //   }
  //   const deliverQty = Number(item.totalDeliverQty) || 0;
  //   const amount = Number(item.totalAmount) || 0;
  //   // Add the values to the group
  //   acc[key].totalDeliverQty += deliverQty;
  //   acc[key].totalAmount += amount;
  
  //   return acc;
  // }, {});
  
  // console.log( Object.values(groupedData))
  // const result = Object.values(groupedData);
  
  // console.log(result);
 
 
  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Delivery Date",
      selector: (row) => row.date,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Unit Price",
      selector: (row) => row.unitPrice,
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
      selector: (row) => row.totalAmount,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Action",
      button: true,
      width: "150px",
      grow: 2,
      cell: (row) => (
        <div className="d-flex justify-content-between align-content-center">
           {permission?.isPDF && (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="PDF Item"
              style={{
                color: "orange",
                border: "2px solid orange",
                padding: "3px",
                borderRadius: "5px",
              }}
              onClick={() => {
                // downloadDeliveryOrderPDF(
                //   row,
                //   transformedDOData,
                //   invoiceInformation,
                //   clientInformation,
                //   finishGoodsInfo,
                //   itemsizeinfo,
                //   { companyinfo },
                //   reportTitle
                // );
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
  };

  const filteredItems = filteredDatas?.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );

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
                  Sales Summary Report
                </h2>
              }
              columns={columns}
              data={filteredItems}
              defaultSortField="name"
              customStyles={customStyles}
              striped
              pagination
              subHeader
            />
          </div>
        ) : null}
      </div>
    
  )
}

export default SalesSummaryReport
