import DataTable from "react-data-table-component";
import React from 'react'

const CombineReport = ({permission,filteredDatas,filterText,piInformation,clientInformation,companyInformation,isTableDispaly}) => {
  console.log(filteredDatas) 

  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },

    {
      name: "Return Date",
      selector: (row) => new Date(row.date).toLocaleDateString('en-CA'),
      sortable: true,
      center: true,
      filterable: true,
      width:'150px'
    },

    {
      name: "PI Quantity",
      selector: (row) =>  row.totalQuantity,
      sortable: true,
      center: true,
      filterable: true,
      width:'150px'
    },
    {
      name: "PI Unit Price",
      selector: (row) =>  row.piUnitPrice,
      sortable: true,
      center: true,
      filterable: true,
      width:'150px'
    },
    {
      name: "PI Amount",
      selector: (row) =>  row.totalPiAmount,
      sortable: true,
      center: true,
      filterable: true,
      width:'150px'
    },
    
    {
      name: "Delivered Quantity",
      selector: (row) =>(
        <span>
        {row.totalDeliveredQty === 0 ? `-` : row.totalDeliveredQty}
      </span>
        ),
      sortable: true,
      center: true,
      filterable: true,
      width:'200px'
    },
    {
      name: "Avarage Delivered Unitprice",
      selector: (row) =>(
        <span>
        {row.deliveredAvgUnitPrice === 0 || row.deliveredAvgUnitPrice ===null ? `-` : row.deliveredAvgUnitPrice}
      </span>
        ),
      sortable: true,
      center: true,
      filterable: true,
      width:'220px'
    },
    {
      name: "Delivered Amount",
      selector: (row) =>(
        <span>
        {row.totalDeliveredAmount === 0 || row.totalDeliveredAmount === null ? `-` : row.totalDeliveredAmount}
      </span>
        ),
      sortable: true,
      center: true,
      filterable: true,
      width:'200px'
    },
    {
      name: "Return Quantity",
      selector: (row) =>(
        <span>
        {row.totalReturnQty === 0 ? `-` : row.totalReturnQty}
      </span>
      )
        ,
      sortable: true,
      center: true,
      filterable: true,
      width:'200px'
    },
    {
      name: "Avarage Return Unitprice",
      selector: (row) =>(
        <span>
        {row.returnAvgUnitPrice === 0 || row.returnAvgUnitPrice ===null ? `-` : row.returnAvgUnitPrice}
      </span>
      )
        ,
      sortable: true,
      center: true,
      filterable: true,
      width:'220px'
    },
    {
      name: "Net Quantity",
      selector: (row) => (
        <span style={{ color: row.netQuantity < 0 ? "red" : "inherit" }}>
          {row.netQuantity < 0 ? `(${Math.abs(row.netQuantity)})` : row.netQuantity}
        </span>
      ),
      sortable: true,
      center: true,
      filterable: true,
      width:'200px'
    },
    {
      name: "Avarage Net Unitprice",
      selector: (row) => (
        <span style={{ color: row.netAvgUnitPrice === 0 || row.netAvgUnitPrice === null ? "red" : "inherit" }}>
          {row.netAvgUnitPrice < 0 ? `(${Math.abs(row.netAvgUnitPrice)})` : row.netAvgUnitPrice}
        </span>
      ),
      sortable: true,
      center: true,
      filterable: true,
      width:'200px'
    },
    {
      name: "Net Amount",
      selector: (row) => (
        <span style={{ color: row.totalNetAmount < 0 || row.totalNetAmount === null ? "red" : "inherit" }}>
          {row.totalNetAmount < 0 ? `(${Math.abs(row.totalNetAmount)})` : row.totalNetAmount}
        </span>
      ),
      sortable: true,
      center: true,
      filterable: true,
      width:'200px'
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
                  Sales Return Summary Report
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
        ) : null}
      </div>
    
  )
}

export default CombineReport
