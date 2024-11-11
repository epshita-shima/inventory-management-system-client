/* eslint-disable jsx-a11y/anchor-is-valid */
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataTable from "react-data-table-component";
import React from 'react'

const SalesReturnSummaryReport = ({permission,filteredDatas,filterText,piInformation,clientInformation,companyInformation,isTableDispaly}) => {
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
              title="Report View"
              style={{
                color: "orange",
                border: "2px solid orange",
                padding: "3px",
                borderRadius: "5px",
              }}
              onClick={() => {
                // downloadReturnDeliveredPDF(
                //   row,
                //   transformedDOData,
                //   deliverOrderInformation,
                //   clientInformation,
                //   finishGoodsInfo,
                //   itemsizeinfo,
                //   itemUnitInformation,
                //   companyInformation,
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

  // const filteredItems = filteredDatas?.filter(
  //   (item) =>
  //     JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
  //     -1
  // );

  // console.log(filteredItems)
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

export default SalesReturnSummaryReport
