/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import "./OrderDetailsReportTable.css";
import DataTable from "react-data-table-component";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import reportImage from "../../../../assets/images/reportlogo.png";
import authorizesSingatureImage from "../../../../assets/images/Image_20240831165135.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { downloadInvoicePDF } from "../../../ReportProperties/PDF/InvoiceReportDownload";
import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetAllPaymentInformationQuery } from "../../../../redux/features/paymnetinformation/paymentInfoApi";
import { downloadOrderDetailsAllDataPDF } from "../../../ReportProperties/PDF/handleOrderDetailsAllReport";
import handleOrderDetailsExcel from "../../../ReportProperties/Excel/handleOrderDetailsExcel";
import { formatDate } from "../../../Uitilites/DateUtilities";

const OrderDetailsReportTable = ({
  permission,
  filteredDatas,
  isTableDispaly,
  finishGoodsItemInfo,
  itemSizeInfo,
  companyinfo
}) => {
  const [filterText, setFilterText] = React.useState("");
  const [groupedData, setGroupedData] = useState({});
  const { data: unitInfo } = useGetAllItemUnitQuery(undefined);
  const { data: paymentInfo } = useGetAllPaymentInformationQuery(undefined);
  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
  
  const reportOrderTitle = "PRO FORMA INVOICE";
  const base64Logo = reportImage;
  const signature = authorizesSingatureImage;

  const transformedPIData = filteredDatas?.flatMap((piDetails) =>
    piDetails.detailsData.map((detail) => ({
      ...piDetails,
      detailsData: detail,
    }))
  );


  const grandTotalQuantity = filteredDatas?.reduce((totalQuantity, item) => {
    const detailsTotal = item.detailsData.reduce(
      (sum, detail) => sum + detail.quantity,
      0
    );
    return totalQuantity + detailsTotal;
  }, 0);

  const grandTotalAmount = filteredDatas?.reduce((totalAmount, item) => {
    const detailsTotal = item.detailsData.reduce(
      (sum, detail) => sum + detail.totalAmount,
      0
    );
    return totalAmount + detailsTotal;
  }, 0);

  useEffect(() => {
    const groupData = async (data) => {
      return data?.reduce((acc, row) => {
        const key = `${row.piDate}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(row);
        return acc;
      }, {});
    };

    // Process and set grouped data
    const processData = async () => {
      const data = await groupData(filteredDatas);
      setGroupedData(data);
    };

    processData();
  }, [filteredDatas]);

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
        return itemName
          ? itemName?.itemName + ` (${itemSize?.sizeInfo})`
          : "N/A";
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
                const filterReportData = filteredDatas.find(
                  (item) => item._id === invoiceDetails._id
                );

                console.log(filterReportData);
                downloadInvoicePDF(
                  filterReportData,
                  finishGoodsItemInfo,
                  customerInfo,
                  unitInfo,
                  itemSizeInfo,
                  paymentInfo,
                  base64Logo,
                  signature,
                  { companyinfo },
                  reportOrderTitle
                );
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

  const subHeaderComponent = useMemo(() => {
    return (
      <div className="d-block d-sm-flex justify-content-between align-items-center">
        {
          filteredDatas?.length > 0 && (<div className="d-flex justify-content-end align-items-center">
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
                          downloadOrderDetailsAllDataPDF(
                            { companyinfo },
                            reportOrderTitle
                          );
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
                        handleOrderDetailsExcel(
                          transformedPIData,
                          filteredDatas,
                          finishGoodsItemInfo,
                          itemSizeInfo,
                          customerInfo,
                          companyinfo,
                          reportOrderTitle
                          );
                      }}
                    >
                      Excel
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>)
        }
        
      </div>
    );
  }, [companyinfo, customerInfo, filteredDatas, finishGoodsItemInfo, itemSizeInfo, transformedPIData]);

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
              subHeaderComponent={subHeaderComponent}
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

      <table id="my-order-details-table" className="d-none">
        <thead>
          <tr>
            <th>PI Date</th>
            <th>Client Name</th>
            <th>Invoice No</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {groupedData &&
          typeof groupedData === "object" &&
          Object.keys(groupedData).length > 0 ? (
            Object.keys(groupedData)?.map((key) => {
              const group = groupedData[key];
              const formattedDate = formatDate(group[0].piDate);
              const rowSpan = group.reduce(
                (total, item) => total + item.detailsData.length,
                0
              );
          
              const dateWiseTotalQuantity = group.reduce(
                (totalQty, item) =>
                  totalQty +
                  item.detailsData.reduce(
                    (itemTotal, detail) => itemTotal + detail.quantity,
                    0
                  ),
                0
              );
              const dateWiseTotalAmount = group.reduce(
                (totalQty, item) =>
                  totalQty +
                  item.detailsData.reduce(
                    (itemTotal, detail) => itemTotal + detail.totalAmount,
                    0
                  ),
                0
              );
           
              return (
                <>
                  {group?.map((row, rowIndex) => {
                    return row.detailsData.map((detail, detailIndex) => {
                      // Retrieve item name, client name, and currency based on detail and row data
                      const itemNames = finishGoodsItemInfo?.find(
                        (item) => item._id === detail.itemId
                      );
                      console.log(itemNames);
                      const itemSize = itemSizeInfo.find(
                        (size) => size._id === itemNames.sizeId
                      );
                      const clientName = customerInfo
                        ?.filter((client) => client._id === row.customerID)
                        .map((filteredItem) => filteredItem.clientName)
                        .join(", ");
                   
                      return (
                        <tr key={detail._id}>
                          {rowIndex === 0 && detailIndex === 0 && (
                            <td
                              rowSpan={rowSpan}
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              {formattedDate}
                            </td>
                          )}

                          <td>{clientName}</td>

                          <td>{row.invoiceNo}</td>

                          <td>{`${itemNames.itemName} (${itemSize.sizeInfo})`}</td>
                          <td>{detail.quantity}</td>
                          <td>{detail.unitPrice}</td>
                          <td>{detail.totalAmount.toLocaleString()}</td>
                        </tr>
                      );
                    });
                  })}

                  {/* Datewise Total Row */}
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        textAlign: "right",
                        fontWeight: "bold",
                        padding: "8px",
                        border: "1px solid black",
                      }}
                    >
                      Datewise Total
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        border: "1px solid black",
                      }}
                    >
                      {dateWiseTotalQuantity.toLocaleString()}
                    </td>
                    <td></td>
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        border: "1px solid black",
                      }}
                    >
                      {dateWiseTotalAmount.toLocaleString()}
                    </td>
                  </tr>
                </>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No data available
              </td>
            </tr>
          )}

          <tr>
            <td
              colSpan={4}
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
                ? grandTotalQuantity.toLocaleString()
                : 0}
            </td>
            <td></td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalAmount != null ? grandTotalAmount.toLocaleString() : 0}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailsReportTable;
