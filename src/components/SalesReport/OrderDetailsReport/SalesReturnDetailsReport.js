/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataTable from "react-data-table-component";

const SalesReturnDetailsReport = ({permission,filteredDatas,filterText,piInformation,clientInformation,companyInformation,isTableDispaly,finishGoodsItemInfo,itemSizeInfo}) => {
 
  const transformedSalsReturnData = filteredDatas?.flatMap((piDetails) =>
    piDetails.detailsData.map((detail) => ({
      ...piDetails,
      detailsData: detail,
    }))
  );

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
      name: "Transfer From",
      selector: (row) => {
        const transferFrom = clientInformation?.find(
          (x) => x._id === row?.transferFromClientId
        );
        console.log(transferFrom);
        return transferFrom ? transferFrom.clientName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width:'220px'
    },
    {
      name: "Transfer To",
      selector: (row) => {
        const transferTo = companyInformation?.find(
          (x) => x._id === row?.transferToCompanyId
        );
        console.log(transferTo);
        return transferTo ? transferTo.companyName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width:'250px'
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
      name: " Return Qty",
      selector: (row) => row.detailsData.returnQty,
      sortable: true,
      center: true,
      filterable: true,
      width:"180px"
    },
  
    {
      name: "Return Amount",
      selector: (row) => {
        const piInfo = piInformation?.find(
          (x) => x._id === row?.piId
        );
        const itemDetails=piInfo?.detailsData.find((item)=>item.itemId==row.detailsData.itemId)
      
        return  itemDetails?.unitPrice * row.detailsData.returnQty;
      },
      sortable: true,
      center: true,
      filterable: true,
       width:"220px"
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
                  Sales Summary Report
                </h2>
              }
              columns={columns}
              data={transformedSalsReturnData}
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

export default SalesReturnDetailsReport
