/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import { groupPurchaseDateByDetails } from "../../../Uitilites/reportDataGrouping";
import { downloadGoupPurchaseDetailsPDF } from "../../../ReportProperties/PDF/handlePurchaseDatewiseDetailsPDF";
import handlePurchaseDatewiseReportExcel from "../../../ReportProperties/Excel/handlePurchaseDatewiseReportExcel";
import DataTable from "react-data-table-component";
const PurchaseQuantityDetailsModal = ({
  filteredDatas,
  companyinfo,
  rawMaterialItem,

  supplierInfo,
  itemUnitInfo,
}) => {
  const [groupedData, setGroupedData] = useState({});
  const reportPurchaseTitle = "PURCHASE ORDER INFORMATION";

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
          (x) => x._id === poDetails?.supplierId
        );

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
        const itemName = rawMaterialItem?.find(
          (x) => poDetails?.detailsData.itemId == x._id
        );
        const itemSize = itemUnitInfo?.find(
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
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        if (companyinfo?.length !== 0 || undefined) {
                          downloadGoupPurchaseDetailsPDF(
                            groupedData,
                            filteredDatas,
                            rawMaterialItem,
                            itemUnitInfo,
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
                          rawMaterialItem,
                          itemUnitInfo,
                          supplierInfo,
                          companyinfo,
                          reportPurchaseTitle
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
    filteredDatas,
    companyinfo,
    rawMaterialItem,
    groupedData,
    itemUnitInfo,
    supplierInfo,
    transformedData,
  ]);

  return (
    <div>
      <div
        className="modal fade"
        id="exampleModalLabelProductionQtyDetails"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg fullscreen-modal" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="exampleModalLabelProductionQtyDetails"
              >
                {`Itemwise Production Consumption of  Details`}
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
              <div>
                <DataTable
                  columns={columns}
                  data={transformedData}
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
    </div>
  );
};

export default PurchaseQuantityDetailsModal;
