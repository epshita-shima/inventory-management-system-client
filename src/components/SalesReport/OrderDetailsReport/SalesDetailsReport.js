/* eslint-disable jsx-a11y/anchor-is-valid */
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataTable from "react-data-table-component";
import React from 'react'

const SalesDetailsReport = ({permission,piInformation,doInformation,clientInformation,filteredDatas,isTableDispaly,finishGoodsItemInfo,itemSizeInfo}) => {
  const [filterText, setFilterText] = React.useState("");
  const transformedPIData = filteredDatas?.flatMap((piDetails) =>
    piDetails.detailsData.map((detail) => ({
      ...piDetails,
      detailsData: detail,
    }))
  );
  console.log(transformedPIData);
  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Make Date",
      selector: (row) => new Date(row.finishGoodsDeliveryDate).toLocaleDateString('en-CA'),
      sortable: true,
      center: true,
      filterable: true,
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
       width:'200px'
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
      name: "Item Name",
      selector: (row) => {
        const itemName = finishGoodsItemInfo?.find(
          (x) => row?.detailsData.itemId == x._id
        );
        const itemSize = itemSizeInfo?.find(
          (size) => size._id == itemName.sizeId
        );
        return itemName ? itemName?.itemName + ` (${itemSize?.sizeInfo})` : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "230px",
    },

    {
      name: "Currency",
      selector: (row) => {
        const piNumber = piInformation?.find(
          (x) => x._id === row?.piId
        );
        return piNumber ? piNumber?.currency : "N/A"; 
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    // {
    //   name: "Ordered Qty in PC's",
    //   selector: (row) => {
    //     const piData = piInformation?.find(
    //       (x) => x._id === row?.piId
    //     );
    //     const itemDetails=piData?.detailsData.find((item)=>item.itemId==row.detailsData.itemId)
    //     return itemDetails ?  itemDetails.quantity : "N/A"
    //   },
    //   sortable: true,
    //   center: true,
    //   filterable: true,
    //    width:'200px'
    // },

    {
      name: "Delivery Qty in PC's",
      selector: (row) =>row.detailsData.deliverQty
      ,
      sortable: true,
      center: true,
      filterable: true,
      width:'200px'
    },
    {
      name: "Unit Price",
      selector: (row) => {
        const piData = piInformation?.find(
          (x) => x._id === row?.piId
        );
        const itemDetails=piData?.detailsData.find((item)=>item.itemId==row.detailsData.itemId)
        return itemDetails ?  itemDetails.unitPrice : "N/A"
      },
      sortable: true,
      center: true,
      filterable: true,
       width:'150px'
    },
    {
      name: "Amount in BDT",
      selector: (row) => {
        const piData = piInformation?.find(
          (x) => x._id === row?.piId
        );
        const itemDetails=piData?.detailsData.find((item)=>item.itemId==row.detailsData.itemId)
        return itemDetails ?  itemDetails.unitPrice * row.detailsData.deliverQty: "N/A"
       
      },
      sortable: true,
      center: true,
      filterable: true,
       width:'200px'
    },


    {
      name: "Action",
      button: true,
      width: "120px",
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

  const filteredItems = transformedPIData?.filter(
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
                  Sales Details Report
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

export default SalesDetailsReport
