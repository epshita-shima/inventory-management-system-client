/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import DataTable from "react-data-table-component";
import handlePurchaseDatewiseSummaryExcel from "../../../ReportProperties/Excel/handlePurchaseDatewiseSummaryExcel";
import { downloadGoupPurchaseSummaryPDF } from "../../../ReportProperties/PDF/handlePurchaseDatewiseSummary";
import { useLazyGetPurchaseDetailsReportQuery } from "../../../../redux/features/purchasereport/purchasereportApi";
import PurchaseQuantityDetailsModal from "./PurchaseQuantityDetailsModal";
import { useGetAllBankInformationQuery } from "../../../../redux/features/bankinformation/bankInfoAPi";
import { useGetAllPaymentInformationQuery } from "../../../../redux/features/paymnetinformation/paymentInfoApi";
import { useGetAllSupplierInformationQuery } from "../../../../redux/features/supplierInformation/supplierInfoApi";
const PurchaseQuantityModal = ({
  companyinfo,
  filteredDatas,
  purchaseSingleItemId,
  rawMaterialItem,
  itemUnitInfo,
}) => {
  const { data: bankInformation } = useGetAllBankInformationQuery(undefined);
  const { data: paymentData } = useGetAllPaymentInformationQuery(undefined);
  const { data: supplierInfo } = useGetAllSupplierInformationQuery(undefined);
  const itemNames = rawMaterialItem?.find(
    (item) => item._id === purchaseSingleItemId
  );
  const unitInfo = itemUnitInfo?.find((item) => item._id === itemNames?.unitId);
  const reportTitleForSingle = `Itemwise Purchase Quantity of ${itemNames?.itemName}(${unitInfo.unitInfo})`;

  const [
    triggerPurchaseDetailsReport,
    { data: purchaseSingleItemDetailsData },
  ] = useLazyGetPurchaseDetailsReportQuery();

  const handleRowClickForPurchaseDetails = async (rowData) => {
    await triggerPurchaseDetailsReport({
      itemId: rowData.itemId,
    });
  };
  console.log("purchaseSingleItemDetailsData", purchaseSingleItemDetailsData);

  const columns = [
    {
      name: "Sl.",
      selector: (invoiceDetails, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Date",
      sortable: true,
      center: true,
      filterable: true,
      cell: (row) => (
        <div
          className="card-body"
          data-toggle="modal"
          data-target="#exampleModalLabelProductionQtyDetails"
          onClick={() => handleRowClickForPurchaseDetails(row)}
        >
          <a href="#" className="text-success fw-bold">
            {new Date(row.receiveDate).toLocaleDateString("en-CA")}
          </a>
        </div>
      ),
    },

    {
      name: "Total Quantity",
      selector: (row) => row.totalPurchaseQty,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Rate in Avarage",
      selector: (row) =>
        Math.round(row.totalPurchaseAmount / row.totalPurchaseQty),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => row.totalPurchaseAmount,
      sortable: true,
      center: true,
      filterable: true,
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
                          downloadGoupPurchaseSummaryPDF(
                            filteredDatas,
                            { companyinfo },
                            reportTitleForSingle
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
                        handlePurchaseDatewiseSummaryExcel(
                          filteredDatas,
                          companyinfo,
                          reportTitleForSingle
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
  }, [companyinfo, filteredDatas, reportTitleForSingle]);

  return (
    <div>
      <div
        className="modal fade"
        id="exampleModalLabelPurchaseRaw"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg fullscreen-modal" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabelPurchaseRaw">
                {`Itemwise Purchase Quantity ${itemNames?.itemName} (${unitInfo.unitInfo})`}
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
                  data={filteredDatas}
                  defaultSortField="name"
                  customStyles={customStyles}
                  striped
                  pagination
                  subHeader
                  subHeaderComponent={subHeaderComponent}
                  fixedHeader={true}
                  fixedHeaderScrollHeight="calc(85vh - 120px)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        <PurchaseQuantityDetailsModal
          companyinfo={companyinfo}
          rawMaterialItem={rawMaterialItem}
          bankInformation={bankInformation}
          paymentData={paymentData}
          supplierInfo={supplierInfo}
          itemUnitInfo={itemUnitInfo}
          filteredDatas={purchaseSingleItemDetailsData}
        ></PurchaseQuantityDetailsModal>
      }
    </div>
  );
};

export default PurchaseQuantityModal;
