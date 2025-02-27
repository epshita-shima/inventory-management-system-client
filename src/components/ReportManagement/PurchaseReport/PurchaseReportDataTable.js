/* eslint-disable jsx-a11y/anchor-is-valid */
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { groupPurchaseDateByDetails } from './../../Uitilites/reportDataGrouping';
import { downloadGoupPurchaseDetailsPDF } from "../../ReportProperties/PDF/handlePurchaseDatewiseDetailsPDF";
import handlePurchaseDatewiseReportExcel from "../../ReportProperties/Excel/handlePurchaseDatewiseReportExcel";
import { downloadPOPDF } from "../../ReportProperties/PDF/handlePurchaseOrderReport";
import { useGetAllPurchaseOrderInformationQuery } from "../../../redux/features/purchaseorderinformation/purchaseOrderInfoApi";
import LoadingSpineer from "../../Common/LoadingSpinner/LoadingSpineer";
const PurchaseReportDataTable = ({
  rawMaterialInfo,
  filteredDatas,
  permission,
  itemUnitInformation,
  companyinfo,
  supplierInfo,
  bankInformation,
  paymentData,
  filters,
  isTableDispaly,
  isPurchaseDetailsLoading
}) => {
  const [groupedData, setGroupedData] = useState({});
  const reportPurchaseTitle = "PURCHASE ORDER INFORMATION";
  const reportPOTitle="PO INFORMATION"
const {data:poInformation}=useGetAllPurchaseOrderInformationQuery(undefined)
  const transformedData = filteredDatas?.flatMap((piDetails) =>
    piDetails.detailsData.map((detail) => ({
      ...piDetails,
      detailsData: detail,
    }))
  );

  useEffect(() => {
    const processData = async () => {
      const data = await groupPurchaseDateByDetails(filteredDatas);
      // const convertObjectData=Object.values(data)
      setGroupedData(data);
    };
    processData();
  }, [filteredDatas]);


  const columns = [
    {
      name: "Sl.",
      selector: (poDetails, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Pi Date",
      selector: (poDetails) =>
        new Date(poDetails?.receiveDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "PO No",
      selector: (poDetails) => poDetails?.supplierPoNo,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Supplier Name",
      selector: (poDetails) => {
        const supplierName = supplierInfo?.find(
          (x) => x._id === poDetails?.supplierId);
        
        return supplierName ? supplierName.supplierName : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "220px",
    },

    {
      name: "Item Name",
      selector: (poDetails) => {
        const itemName = rawMaterialInfo?.find(
          (x) => poDetails?.detailsData.itemId == x._id
        );
        const itemSize = itemUnitInformation?.find(
          (size) => size._id == itemName?.unitId
        );
        return itemName
          ? itemName?.itemName + ` (${itemSize?.unitInfo})`
          : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "230px",
    },

    {
      name: "Quantity",
      selector: (poDetails) => poDetails?.detailsData?.quantity,
      sortable: true,
      center: true,
      filterable: true,
      width: "150px",
    },

    {
      name: "Unit Price",
      selector: (poDetails) => poDetails?.detailsData.unitPrice,
      sortable: true,
      center: true,
      filterable: true,
      width: "120px",
    },

    {
      name: "Amount",
      selector: (poDetails) => poDetails?.detailsData.amount,
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
      cell: (poDetails) => (
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
                const filterReportData = poInformation.find(
                  (item) => item._id === poDetails.pOSingleId
                );
              
                downloadPOPDF(
                  filterReportData,
                  rawMaterialInfo,
                  bankInformation,
                  paymentData,
                  supplierInfo,
                  {companyinfo},
                  reportPOTitle
                )
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
                          downloadGoupPurchaseDetailsPDF(
                            groupedData,
                            filteredDatas,
                            rawMaterialInfo,
                            itemUnitInformation,
                            supplierInfo,
                            { companyinfo },
                            reportPurchaseTitle
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
                        handlePurchaseDatewiseReportExcel(
                          transformedData,
                          filteredDatas,
                          rawMaterialInfo,
                          itemUnitInformation,
                          supplierInfo,
                          companyinfo,
                          reportPurchaseTitle
                        )
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
  }, [filteredDatas, companyinfo, rawMaterialInfo, groupedData,itemUnitInformation, supplierInfo, transformedData]);

  return (
    <div
    // className="row px-5 mx-2"
    // style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
      <LoadingSpineer isLoading={isPurchaseDetailsLoading}></LoadingSpineer>
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
                Purchase Details Report
              </h2>
            }
            columns={columns}
            data={transformedData}
            defaultSortField="name"
            customStyles={customStyles}
            subHeaderComponent={subHeaderComponent}
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

export default PurchaseReportDataTable;
