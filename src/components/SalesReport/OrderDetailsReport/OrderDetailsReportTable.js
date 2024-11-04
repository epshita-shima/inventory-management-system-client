/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./OrderDetailsReportTable.css";
import DataTable from "react-data-table-component";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

const OrderDetailsReportTable = ({
  permission,
  filteredDatas,
  isTableDispaly,
  finishGoodsItemInfo,itemSizeInfo
}) => {
  const [filterText, setFilterText] = React.useState("");

  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
console.log(filteredDatas)
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
      selector: (invoiceDetails, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Pi Date",
      selector: (invoiceDetails) =>
        new Date(invoiceDetails?.piDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Invoice No",
      selector: (invoiceDetails) => invoiceDetails?.invoiceNo,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Client Name",
      selector: (invoiceDetails) => {
        const customerName = customerInfo?.find(
          (x) => x._id === invoiceDetails?.customerID
        );
        return customerName ? customerName.clientName : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "220px",
    },
    {
      name: "Item Name",
      selector: (invoiceDetails) => {
        const itemName = finishGoodsItemInfo?.find(
          (x) => invoiceDetails?.detailsData.itemId == x._id
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
      name: "Quantity",
      selector: (invoiceDetails) => invoiceDetails?.detailsData?.quantity,
      sortable: true,
      center: true,
      filterable: true,
      width: "150px",
    },
    {
      name: "Unit Price",
      selector: (invoiceDetails) => invoiceDetails?.detailsData.unitPrice,
      sortable: true,
      center: true,
      filterable: true,
      width: "120px",
    },
    {
      name: "Total Amount",
      selector: (invoiceDetails) => invoiceDetails?.detailsData.totalAmount,
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
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

  const filteredItems = transformedPIData?.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );

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
                  Order Details Report
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
        </div>
      )}
    </div>
  );
};

export default OrderDetailsReportTable;
