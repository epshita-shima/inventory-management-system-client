/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import { downloadReturnDeliveredPDF } from "../../../ReportProperties/PDF/HeaderFooter";
import { downloadReturnDetailsInfoPDF } from "../../../ReportProperties/PDF/handleReturnDetailsInfo";
import handleReturnDetailsExcel from "../../../ReportProperties/Excel/handleReturnDetailsExcel";
import { formatDate } from "../../../Uitilites/DateUtilities";

const SalesReturnDetailsReport = ({
  permission,
  filteredDatas,
  filterText,
  piInformation,
  companyinfo,
  doInformation,
  clientInformation,
  companyInformation,
  isTableDispaly,
  finishGoodsItemInfo,
  itemSizeInfo,
  itemUnitInformation,
}) => {
  const reportTitle = "SALES RETURN INFORMATION";
  const [groupedData, setGroupedData] = useState({});
  const transformedSalsReturnData = filteredDatas?.flatMap((piDetails) =>
    piDetails.detailsData.map((detail) => ({
      ...piDetails,
      detailsData: detail,
    }))
  );


  const grandTotalRetuenQty = filteredDatas?.reduce((totalQty, detail) => {
    const detailReturnQty = detail.detailsData.reduce(
      (sum, item) => sum + Number(item.returnQty),
      0
    );
    return totalQty + Number(detailReturnQty);
  }, 0);



  const grandTotalRetuenAmount = filteredDatas?.reduce((totalQty, detail) => {
    const detailReturnQty = detail.detailsData.reduce((sum, detail) => {
      const piNumber = piInformation?.find((pi) => pi._id === detail.piId);
      const unitPrice = piNumber?.detailsData.find(
        (item) => item.itemId == detail.itemId
      );
      return sum + detail.returnQty * unitPrice?.unitPrice;
    }, 0);
    return totalQty + detailReturnQty;
  }, 0);

  useEffect(() => {
    const groupData = (data) => {
      return data?.reduce((acc, row) => {
        // Use only `returnDate` and `piNo` for grouping
        const key = `${new Date(row.returnDate).toLocaleDateString("en-CA")}-${
          row.transferFromClientId
        }-${row.transferToCompanyId}-${row.piId}`;

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
            // If it exists, add to the existing returnQty
            existingDetail.returnQty += Number(detail.returnQty);
          } else {
            // If it doesn’t exist, add the detail to detailsData
            acc[key].detailsData.push({
              ...detail,
              returnQty: Number(detail.returnQty),
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
      name: "Return Date",
      selector: (row) => new Date(row.returnDate).toLocaleDateString("en-CA"),
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
      width: "220px",
    },
    {
      name: "Transfer To",
      selector: (row) => {
        const transferTo = companyInformation?.find(
          (x) => x._id === row?.transferToCompanyId
        );
        return transferTo ? transferTo.companyName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "250px",
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
      name: " Return Qty",
      selector: (row) => row.detailsData.returnQty,
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },

    {
      name: "Return Amount",
      selector: (row) => {
        const piInfo = piInformation?.find((x) => x._id === row?.piId);
        const itemDetails = piInfo?.detailsData.find(
          (item) => item.itemId == row.detailsData.itemId
        );

        return itemDetails?.unitPrice * row.detailsData.returnQty;
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "220px",
    },

    {
      name: "Action",
      button: true,
      width: "100px",
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
                const singleReturnData = filteredDatas.find(
                  (returnItem) => returnItem._id == row._id
                );
                console.log(singleReturnData);
                downloadReturnDeliveredPDF(
                  singleReturnData,
                  transformedSalsReturnData,
                  doInformation,
                  clientInformation,
                  finishGoodsItemInfo,
                  itemSizeInfo,
                  itemUnitInformation,
                  companyInformation,
                  reportTitle
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
                          downloadReturnDetailsInfoPDF(
                            { companyinfo },
                            reportTitle
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
                        handleReturnDetailsExcel(
                          transformedSalsReturnData,
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
          </div>)
        }
        
      </div>
    );
  }, [clientInformation, companyinfo, filteredDatas, finishGoodsItemInfo, itemSizeInfo, piInformation, transformedSalsReturnData]);

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
                Return Details Report
              </h2>
            }
            subHeaderComponent={subHeaderComponent}
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

      <table id="my-return-details-table" className="d-none">
        <thead>
          <tr>
            <th>Return Date</th>
            <th>Transfer From</th>
            <th>Transfer To</th>
            <th>PI Number</th>
            <th>Item Name</th>
            <th>Return Qty</th>
            <th>Unit Price</th>
            <th>Return Amount</th>
          </tr>
        </thead>
        <tbody>
          {groupedData &&
          typeof groupedData === "object" &&
          Object.keys(groupedData).length > 0 ? (
            Object.keys(groupedData)?.map((key) => {
              const group = groupedData[key];
              console.log(group);
              const formattedDate = formatDate(group.returnDate);
              const rowSpan = group?.detailsData.length;

              const piNumber = piInformation.find(
                (pi) => pi._id === group.piId
              );

              const dateWiseTotalQuantity = group.detailsData.reduce(
                (cur, acc) => cur + acc.returnQty,
                0
              );

              const dateWiseTotalAmount = group.detailsData.reduce(
                (total, detail) => {
                  const item = piNumber.detailsData.find(
                    (item) => item.itemId === detail.itemId
                  );
                  const itemTotal = detail.returnQty * (item?.unitPrice || 0);
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

                    const transferFrom = clientInformation
                      ?.filter(
                        (client) => client._id === group.transferFromClientId
                      )
                      .map((filteredItem) => filteredItem.clientName)
                      .join(", ");

                    const transferTo = companyInformation
                      ?.filter(
                        (comapany) => comapany._id === group.transferToCompanyId
                      )
                      .map((filteredItem) => filteredItem.companyName)
                      .join(", ");

                    const unitPrice = piNumber.detailsData.find(
                      (item) => item.itemId == detail.itemId
                    );

                    const calCulateAmount =
                      unitPrice.unitPrice * detail.returnQty;
                    const calculateAvgPrice =
                      calCulateAmount / detail.returnQty;
                    console.log(
                      "calculateAvgPrice",
                      calCulateAmount,
                      detail.returnQty,
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
                            {transferFrom}
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
                            {transferTo}
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
                        <td>{detail.returnQty.toLocaleString()}</td>
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
              {grandTotalRetuenQty != null
                ? grandTotalRetuenQty.toLocaleString()
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
              {grandTotalRetuenAmount != null
                ? grandTotalRetuenAmount.toLocaleString()
                : 0}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SalesReturnDetailsReport;
