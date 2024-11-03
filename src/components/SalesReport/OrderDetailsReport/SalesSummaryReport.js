/* eslint-disable jsx-a11y/anchor-is-valid */
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataTable from "react-data-table-component";
import React from 'react'

const SalesSummaryReport = ({permission,piInformation,doInformation,clientInformation,filteredDatas,isTableDispaly}) => {
 
  const [filterText, setFilterText] = React.useState("");
  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Client Name",
      selector: (row) => {
        const clientInfo = clientInformation?.find(
          (x) => x._id ==row?.clientId
        );
        return clientInfo ? clientInfo?.clientName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "PI Number",
      selector: (row) => {
        const piNumber = piInformation?.find(
          (x) => x._id === row?.piId
        );
        return piNumber ? piNumber.invoiceNo : "N/A"; 
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },

    {
      name: "DO Number",
      selector: (row) => {
        const doNumber = doInformation?.find(
          (x) => x._id === row?.doId
        );
        return doNumber ? doNumber.doNo : "N/A"; 
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Delivered Quantity",
      selector: (row) => {
        const totalDeliverQty = row.detailsData.reduce((acc, cur) => acc + parseFloat(cur.deliverQty || 0), 0);
        console.log(totalDeliverQty);
        return totalDeliverQty;
      },
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
