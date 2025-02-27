/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import { useGetAllDelieryOrderInformationQuery } from "../../../../redux/features/deliveryorderinformation/deliveryinfoApi";
import { useGetAllInvoiceInformationQuery } from "../../../../redux/features/invoiceinformation/invoiceinfoApi";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { downloadReturnDeliveredPDF } from "../../../ReportProperties/PDF/HeaderFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import handleReturnDetailsExcel from "../../../ReportProperties/Excel/handleReturnDetailsExcel";
import DataTable from "react-data-table-component";
import { downloadReturnDetailsInfoPDF } from "../../../ReportProperties/PDF/handleReturnDetailsInfo";
import {
  calculateGrandTotalReturnAmount,
  calculateGrandTotalReturnQty,
} from "../../../Uitilites/CalculationUtilities/calculation";
import { groupReturnDateByDetails } from "../../../Uitilites/reportDataGrouping";
import { formatDate } from "../../../Uitilites/DateUtilities";

const FinishGoodsReturnQtyDetailsModal = ({
  permission,
  filteredDatas,
  filterText,
  companyinfo,
  isTableDispaly,
  finishGoodsItemInfo,
  itemSizeInfo,
  itemUnitInformation,
  isReturnDetailsLoading,
  returnSingleItemId,
}) => {
  const itemName = finishGoodsItemInfo?.find(
    (item) => item._id === returnSingleItemId
  );
  const sizeInfo = itemSizeInfo?.find((item) => item._id === itemName?.sizeId);
  const [groupedData, setGroupedData] = useState({});
  const reportTitle = `${itemName?.itemName} (${sizeInfo?.sizeInfo}) SALES RETURN INFORMATION`;
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);
  const { data: doInformation } =
    useGetAllDelieryOrderInformationQuery(undefined);
  const { data: piInformation } = useGetAllInvoiceInformationQuery(undefined);
  const { data: companyInformation } = useGetCompanyInfoQuery(undefined);
  const transformedSalsReturnData = filteredDatas?.flatMap((piDetails) =>
    piDetails.detailsData.map((detail) => ({
      ...piDetails,
      detailsData: detail,
    }))
  );

  const grandTotalRetuenQty = calculateGrandTotalReturnQty(filteredDatas);
  const grandTotalRetuenAmount = calculateGrandTotalReturnAmount(
    filteredDatas,
    piInformation
  );
  useEffect(() => {
    const processData = async () => {
      const data = await groupReturnDateByDetails(filteredDatas);
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
        return transferFrom ? transferFrom?.clientName : "N/A";
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
        return transferTo ? transferTo?.companyName : "N/A";
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
          (x) => x._id === row.detailsData.itemId
        );
        console.log("itemName", itemName);
        const itemSize = itemSizeInfo?.find(
          (size) => size._id === itemName.sizeId
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
          (item) => item.itemId === row.detailsData.itemId
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
                  (returnItem) => returnItem._id === row._id
                );
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
      <div className="d-block d-sm-flex justify-content-between align-items-center mb-2">
        {filteredDatas?.length > 0 && (
          <div className="d-flex justify-content-end align-items-center">
            <div className="table-head-icon d-flex">
              <div className="dropdown">
                <button
                  className="btn btn-download dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Download
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <a
                      className="dropdown-item"
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
                      className="dropdown-item"
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
          </div>
        )}
      </div>
    );
  }, [
    clientInformation,
    companyinfo,
    filteredDatas,
    finishGoodsItemInfo,
    itemSizeInfo,
    piInformation,
    reportTitle,
    transformedSalsReturnData,
  ]);

  return (
    <div>
      <div
        className="modal fade"
        id="exampleModalLabelFinshGoodReturnQty"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg fullscreen-modal" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabelFinshGoodReturnQty">
                {`Itemwise Return Quantity ${itemName?.itemName} (${sizeInfo?.sizeInfo}) `}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body w-100">
              <div
              // style={{ height: "calc(65vh - 120px)", width:'100%',overflowY: "scroll" }}
              >
                <DataTable
                  columns={columns}
                  data={transformedSalsReturnData}
                  defaultSortField="name"
                  customStyles={customStyles}
                  striped
                  pagination
                  subHeader
                  subHeaderComponent={subHeaderComponent}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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
              const formattedDate = formatDate(group.returnDate);
              const rowSpan = group?.detailsData.length;

              const piNumber = piInformation?.find(
                (pi) => pi._id === group.piId
              );

              const dateWiseTotalQuantity = group.detailsData.reduce(
                (cur, acc) => cur + acc.returnQty,
                0
              );

              const dateWiseTotalAmount = group.detailsData.reduce(
                (total, detail) => {
                  const item = piNumber?.detailsData.find(
                    (item) => item.itemId === detail.itemId
                  );
                  const itemTotal = detail.returnQty * (item?.unitPrice || 0);
                  return total + itemTotal;
                },
                0
              );

              return (
                <>
                  {group?.detailsData.map((detail, detailIndex) => {
                    const itemNames = finishGoodsItemInfo?.find(
                      (item) => item._id === detail.itemId
                    );
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

                    const unitPrice = piNumber?.detailsData.find(
                      (item) => item.itemId === detail.itemId
                    );

                    const calCulateAmount =
                      unitPrice?.unitPrice * detail.returnQty;
                    const calculateAvgPrice =
                      calCulateAmount / detail.returnQty;

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
                            {piNumber?.invoiceNo}
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

export default FinishGoodsReturnQtyDetailsModal;
