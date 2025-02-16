/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import {
  calculateGrandTotalSalesAmount,
  calculateGrandTotalSalesQty,
} from "../../../Uitilites/CalculationUtilities/calculation";
import { groupSalesDataByDetails } from "../../../Uitilites/reportDataGrouping";
import { downloadDeliveryOrderPDF } from "../../../ReportProperties/PDF/HeaderFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { downloadSalesDetailsPDF } from "../../../ReportProperties/PDF/handleDeliverDetailsReport";
import handleSalesDetailsExcel from "../../../ReportProperties/Excel/handleSalesDetailsExcel";
import DataTable from "react-data-table-component";
import SalesDetailsTable from "../../../Uitilites/ReportTable/SalesDetailsTable";
import { formatDate } from "../../../Uitilites/DateUtilities";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import { useGetAllDelieryOrderInformationQuery } from "../../../../redux/features/deliveryorderinformation/deliveryinfoApi";
import { useGetAllInvoiceInformationQuery } from "../../../../redux/features/invoiceinformation/invoiceinfoApi";

const FinishGoodsDeliveredQtyDetailsModal = ({
  permission,
  companyinfo,
  filteredDatas,
  isTableDispaly,
  finishGoodsItemInfo,
  itemSizeInfo,
  itemUnitInformation,
  deliveredSingleItemId
}) => {
  const itemName=finishGoodsItemInfo?.find((item)=>item._id===deliveredSingleItemId)
  const sizeInfo=itemSizeInfo?.find((item)=>item._id===itemName?.sizeId)
    const { data: clientInformation } =
      useGetAllClientInformationQuery(undefined);
    const { data: doInformation } =
      useGetAllDelieryOrderInformationQuery(undefined);
    const { data: piInformation } = useGetAllInvoiceInformationQuery(undefined);

  const [groupedData, setGroupedData] = useState({});
  const reportTitle = `${itemName?.itemName} (${sizeInfo?.sizeInfo}) DELIVERY ORDER INFORMATION`;
  const transformedPIData = filteredDatas?.flatMap((piDetails) =>
    piDetails.detailsData.map((detail) => ({
      ...piDetails,
      detailsData: detail,
    }))
  );

  const grandTotalDeliverQty = calculateGrandTotalSalesQty(filteredDatas);
  const grandTotalDeliverAmount = calculateGrandTotalSalesAmount(
    filteredDatas,
    piInformation
  );

  useEffect(() => {
    const processData = async () => {
      const data = await groupSalesDataByDetails(filteredDatas);
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
          (x) => x._id === row?.clientId
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
          (x) => row?.detailsData.itemId === x._id
        );
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
      name: "Avarage Rate",
      selector: (row) => {
        const piData = piInformation?.find((x) => x._id === row?.piId);
        const itemDetails = piData?.detailsData.find(
          (item) => item.itemId === row.detailsData.itemId
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
          (item) => item.itemId === row.detailsData.itemId
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
      <div className="d-block d-sm-flex justify-content-between align-items-center mb-2">
        {filteredDatas?.length > 0 && (
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
                          itemUnitInformation,
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
  }, [clientInformation, companyinfo, filteredDatas, finishGoodsItemInfo, itemSizeInfo, itemUnitInformation, piInformation, reportTitle, transformedPIData]);

  return (
    <div>
      <div
        class="modal fade"
        id="exampleModalLabelFinshGoodDeliveredQty"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg fullscreen-modal" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="exampleModalLabelFinshGoodDeliveredQty"
              >
                {`Itemwise Delivered Quantity ${itemName?.itemName} (${sizeInfo?.sizeInfo}) `}
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body w-100">
              <div
              // style={{ height: "calc(65vh - 120px)", width:'100%',overflowY: "scroll" }}
              >
              * <DataTable
                  columns={columns}
                  data={transformedPIData}
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
      <SalesDetailsTable
        groupedData={groupedData}
        formatDate={formatDate}
        piInformation={piInformation}
        finishGoodsItemInfo={finishGoodsItemInfo}
        itemSizeInfo={itemSizeInfo} 
        itemUnitInformation={itemUnitInformation}
        clientInformation={clientInformation}
        grandTotalDeliverQty={grandTotalDeliverQty}
        grandTotalDeliverAmount={grandTotalDeliverAmount}
      />
    </div>
  );
};

export default FinishGoodsDeliveredQtyDetailsModal;
