/* eslint-disable jsx-a11y/anchor-is-valid */
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import React, { useEffect, useMemo, useState } from "react";
import { downloadDeliveryOrderPDF } from "../../ReportProperties/PDF/HeaderFooter";
import downloadSalesDetailsPDF from "../../ReportProperties/PDF/handleDeliverDetailsReport";
import handleSalesDetailsExcel from "../../ReportProperties/Excel/handleSalesDetailsExcel";

const SalesDetailsReport = ({
  permission,
  piInformation,
  doInformation,
  companyinfo,
  clientInformation,
  filteredDatas,
  isTableDispaly,
  finishGoodsItemInfo,
  itemSizeInfo,
}) => {
  const [filterText, setFilterText] = React.useState("");
  const [groupedData, setGroupedData] = useState({});
  const reportTitle = "DELIVERY ORDER INFORMATION";
  const transformedPIData = filteredDatas?.flatMap((piDetails) =>
    piDetails.detailsData.map((detail) => ({
      ...piDetails,
      detailsData: detail,
    }))
  );
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  const grandTotalDeliverQty = filteredDatas?.reduce((totalQty, item) => {
    const detailsQty = item.detailsData.reduce(
      (sum, detail) => sum + Number(detail.deliverQty),
      0
    );
    return totalQty + detailsQty;
  }, 0);

  const grandTotalDeliverAmount = filteredDatas?.reduce((totalQty, detail) => {
    const detailReturnQty = detail.detailsData.reduce((sum, detail) => {
      const piNumber = piInformation?.find((pi) => pi._id === detail.piId);
      const unitPrice = piNumber?.detailsData.find(
        (item) => item.itemId === detail.itemId
      );
      return sum + (Number(detail.deliverQty) * Number(unitPrice?.unitPrice));
    }, 0);
    return totalQty + detailReturnQty;
  }, 0);

  useEffect(() => {
    const groupData = (data) => {
      return data?.reduce((acc, row) => {
        // Use only `finishGoodsDeliveryDate` and `piNo` for grouping
        const key = `${new Date(row.finishGoodsDeliveryDate).toLocaleDateString(
          "en-CA"
        )}-${row.transferFromClientId}-${row.transferToCompanyId}-${row.piId}`;

        if (!acc[key]) {
          // Initialize with row data and an empty detailsData array
          acc[key] = {
            ...row,
            detailsData: [],
          };
        }

        row.detailsData.forEach((detail) => {
          // Check if the item already exists in the detailsData array
          const existingDetail = acc[key].detailsData.find(
            (d) => d.itemId === detail.itemId
          );
          console.log(existingDetail);
          if (existingDetail) {
            // If it exists, add to the existing deliverQty
            existingDetail.deliverQty += Number(detail.deliverQty);
          } else {
            // If it doesn’t exist, add the detail to detailsData
            acc[key].detailsData.push({
              ...detail,
              deliverQty: Number(detail.deliverQty),
            });
          }
        });

        return acc;
      }, {});
    };

    const processData = async () => {
      const data = await groupData(filteredDatas);
      setGroupedData(data);
    };

    processData();
  }, [filteredDatas]);

  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Make Date",
      selector: (row) =>
        new Date(row.finishGoodsDeliveryDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
      width: "150px",
    },
    {
      name: "Client Name",
      selector: (row) => {
        const clientInfo = clientInformation?.find(
          (x) => x._id == row?.clientId
        );
        return clientInfo ? clientInfo?.clientName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },

    {
      name: "PI Number",
      selector: (row) => {
        const piNumber = piInformation?.find((x) => x._id === row?.piId);
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
      name: "Currency",
      selector: (row) => {
        const piNumber = piInformation?.find((x) => x._id === row?.piId);
        return piNumber ? piNumber?.currency : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Delivery Qty in PC's",
      selector: (row) => row.detailsData.deliverQty,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Unit Price",
      selector: (row) => {
        const piData = piInformation?.find((x) => x._id === row?.piId);
        const itemDetails = piData?.detailsData.find(
          (item) => item.itemId == row.detailsData.itemId
        );
        return itemDetails ? itemDetails.unitPrice : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "150px",
    },
    {
      name: "Amount in BDT",
      selector: (row) => {
        const piData = piInformation?.find((x) => x._id === row?.piId);
        const itemDetails = piData?.detailsData.find(
          (item) => item.itemId == row.detailsData.itemId
        );
        return itemDetails
          ? itemDetails.unitPrice * row.detailsData.deliverQty
          : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
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
                downloadDeliveryOrderPDF(
                  row,
                  filteredDatas,
                  piInformation,
                  clientInformation,
                  finishGoodsItemInfo,
                  itemSizeInfo,
                  { companyinfo },
                  reportTitle,
                  doInformation
                );
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

  const subHeaderComponent = useMemo(() => {
    return (
      <div className="d-block d-sm-flex justify-content-between align-items-center">
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
                        downloadSalesDetailsPDF({ companyinfo }, reportTitle);
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
                      handleSalesDetailsExcel(
                        transformedPIData,
                        filteredDatas,
                        piInformation,
                        finishGoodsItemInfo,
                        itemSizeInfo,
                        clientInformation,
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
      </div>
    );
  }, [clientInformation, companyinfo, filteredDatas, finishGoodsItemInfo, itemSizeInfo, piInformation, transformedPIData]);

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
            subHeaderComponent={subHeaderComponent}
            columns={columns}
            data={transformedPIData}
            defaultSortField="name"
            customStyles={customStyles}
            striped
            pagination
            subHeader
          />
        </div>
      ) : null}

      <table id="my-deliver-details-table" className="d-none">
        <thead>
          <tr>
            <th>Deliver Date</th>
            <th>Client Name</th>
            <th>PI Number</th>
            <th>Item Name</th>
            <th>Curency</th>
            <th>Deliver Qty</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {groupedData &&
          typeof groupedData === "object" &&
          Object.keys(groupedData).length > 0 ? (
            Object.keys(groupedData)?.map((key) => {
              const group = groupedData[key];
              console.log(group);
              const formattedDate = formatDate(group.finishGoodsDeliveryDate);
              const rowSpan = group?.detailsData.length;

              const piNumber = piInformation.find(
                (pi) => pi._id === group.piId
              );

              const dateWiseTotalQuantity = group.detailsData.reduce(
                (cur, acc) => cur + acc.deliverQty,
                0
              );

              const dateWiseTotalAmount = group.detailsData.reduce(
                (total, detail) => {
                  const item = piNumber.detailsData.find(
                    (item) => item.itemId === detail.itemId
                  );
                  const itemTotal = detail.deliverQty * (item?.unitPrice || 0);
                  return total + itemTotal;
                },
                0
              );
              console.log("dateWiseTotalAmount", dateWiseTotalAmount);
              return (
                <>
                  {group?.detailsData.map((detail, detailIndex) => {
                    const itemNames = finishGoodsItemInfo?.find(
                      (item) => item._id === detail.itemId
                    );
                    console.log(itemNames);
                    const itemSize = itemSizeInfo.find(
                      (size) => size._id === itemNames.sizeId
                    );

                    const unitPrice = piNumber?.detailsData.find(
                      (item) => item.itemId == detail.itemId
                    );
                    const clientName = clientInformation
                    ?.filter((client) => client._id === group.clientId)
                    .map((filteredItem) => filteredItem.clientName)
                    .join(", ");
                  const currency = piInformation
                    ?.filter((piItem) => piItem._id === group.piId)
                    .map((filteredItem) => filteredItem.currency)
                    .join(",");
                    console.log(currency)
                    const calCulateAmount =
                      unitPrice.unitPrice * detail.deliverQty;
                    const calculateAvgPrice =
                      calCulateAmount / detail.deliverQty;
                    console.log(
                      "calculateAvgPrice",
                      calCulateAmount,
                      detail.deliverQty,
                      calculateAvgPrice
                    );
                    return (
                      <tr key={detail._id}>
                        {detailIndex === 0 && (
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
                        {detailIndex === 0 && (
                          <td
                            rowSpan={rowSpan}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {clientName}
                          </td>
                        )}
                        {detailIndex === 0 && (
                          <td
                            rowSpan={rowSpan}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                           {piNumber.invoiceNo}
                          </td>
                        )}
                  
                        <td>{`${itemNames.itemName} (${itemSize.sizeInfo})`}</td>
                        <td>{currency}</td>
                        <td>{detail.deliverQty.toLocaleString()}</td>
                        <td>{calculateAvgPrice.toLocaleString()}</td>
                        <td>{calCulateAmount.toLocaleString()}</td>
                      </tr>
                    );
                  })}

                  <tr>
                    <td
                      colSpan={5}
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
              colSpan={5}
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
              {grandTotalDeliverQty != null
                ? grandTotalDeliverQty.toLocaleString()
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
              {grandTotalDeliverAmount != null
                ? grandTotalDeliverAmount.toLocaleString()
                : 0}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SalesDetailsReport;
