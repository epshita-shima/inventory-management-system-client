/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  faCheckToSlot,
  faDownload,
  faFilePdf,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import swal from "sweetalert";
import {
  useDeletePurchaseOrderInformationMutation,
  useUpdatePurchaseOrderInformationStatusMutation,
} from "../../../../redux/features/purchaseorderinformation/purchaseOrderInfoApi";
import { useGetAllGRNInformationQuery } from "../../../../redux/features/goodsreceivenoteinfo/grninfoApi";
import { downloadPOPDF } from "../../../ReportProperties/PDF/handlePurchaseOrderReport";
const PurchaseHeadingModal = ({
  totalPurchase,
  supplierInfo,
  permission,
  totalPurchaseModal,
  totalPurchaseCashModal,
  totalPurchaseLCModal,
  totalPurchaseApproveModal,
  totalPurchaseUnApproveModal,
  approveDataRefetch,
  rawMaterialItemInfo,
  bankInformation,
  paymentData,
  companyinfo,
  reportTitle
}) => {
  const { data: grnDataInfo, refetch: grnRefetch } =
    useGetAllGRNInformationQuery(undefined);
  const [deletePurchaseOrderInfo] = useDeletePurchaseOrderInformationMutation();
  const [updatePOApproveStatus] =
    useUpdatePurchaseOrderInformationStatusMutation();

  const [filterText, setFilterText] = useState("");

  const columns = [
    {
      name: "Sl.",
      selector: (totalPurchase, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "PO Make Date",
      selector: (totalPurchase) =>
        new Date(totalPurchase?.makeDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },
    {
      name: "PO Number",
      selector: (totalPurchase) => totalPurchase?.poNo,
      sortable: true,
      center: true,
      filterable: true,
      width: "260px",
    },

    {
      name: "Supplier Name",
      selector: (totalPurchase) => {
        const supplierName = supplierInfo?.find(
          (x) => x._id === totalPurchase?.supplierId
        );
        return supplierName ? supplierName.supplierName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },

    {
      name: "Total Quantity",
      selector: (totalPurchase) =>
        (totalPurchase?.grandTotalQuantity).toLocaleString(),
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },
    {
      name: "Total Amount",
      selector: (totalPurchase) =>
        (totalPurchase?.grandTotalAmount).toLocaleString(),
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },

    {
      name: "PO Status",
      button: true,
      width: "180px",
      grow: 2,
      cell: (totalPurchase) => (
        <div className="d-flex justify-content-between align-content-center">
          <a
            target="_blank"
            className="action-icon"
            style={{
              textDecoration: "none",
              color: "#000",
              fontSize: "14px",
              textAlign: "center",
            }}
            
          >
            {totalPurchase?.approveStatus === true ? (
              <p className="text-success fw-bold">Approve</p>
            ) : (
              <p className="text-danger fw-bold">UnApprove</p>
            )}
          </a>
        </div>
      ),
    },

    {
      name: "Action",
      button: true,
      width: "180px",
      grow: 2,
      cell: (totalPurchase) => (
        <div className="d-flex justify-content-between align-content-center">
            {permission?.isPDF &&  totalPurchase?.approveStatus === true ? (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Update item"
              style={{
                color: `${
                  totalPurchase?.items?.length === 0
                    ? "gray"
                    : "orange"
                } `,
                border: `${
                  totalPurchase?.items?.length === 0
                    ? "2px solid gray"
                    : "2px solid orange"
                }`,
                padding: "3px",
                borderRadius: "5px",
              }}
              onClick={() => {
                downloadPOPDF(
                  totalPurchase,
                  rawMaterialItemInfo,
                  bankInformation,
                 
                  paymentData,
                  supplierInfo,
                  { companyinfo },
                  reportTitle
                );
              }}
            >
           {
             <FontAwesomeIcon icon={faFilePdf}></FontAwesomeIcon>
           }  
            </a>
          ) : (
            ""
          )}
          {totalPurchaseUnApproveModal && (
            <a
              target="_blank"
              className="action-icon"
              data-toggle="tooltip"
              data-placement="bottom"
              title="approve item"
              style={{
                textDecoration: "none",
                color: "red",
                // fontSize: "22px",
                textAlign: "center",
                fontWeight: "bold",
                border: "2px solid red",
                padding: "3px",
                borderRadius: "5px",
              }}
              onClick={() => {
                handleApproveData(totalPurchase);
              }}
            >
              <FontAwesomeIcon icon={faCheckToSlot}></FontAwesomeIcon>
            </a>
          )}

          {permission?.isRemoved && (
            <a
              target="_blank"
              className="action-icon"
              data-toggle="tooltip"
              data-placement="bottom"
              title="Delete Item"
              style={{
                color: "red",
                border: "2px solid red",
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                const matchData = grnDataInfo.find(
                  (item) => item.pOSingleId === totalPurchase._id
                );
                if (matchData && matchData.length !== 0) {
                  swal(
                    "Can not Delete!",
                    "Because already received the goods.",
                    "error"
                  );
                } else {
                  swal({
                    title: "Are you sure to delete this item?",
                    text: "If once deleted, this item will not recovery.",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  }).then(async (willDelete) => {
                    if (willDelete) {
                      const response = await deletePurchaseOrderInfo(
                        totalPurchase?._id
                      ).unwrap();
                      if (response.status === 200) {
                        swal(
                          "Deleted!",
                          "Your selected item has been deleted!",
                          {
                            icon: "success",
                          }
                        );
                      } else {
                        swal(
                          "Error",
                          "An error occurred while creating the data",
                          "error"
                        );
                      }
                    } else {
                      swal(" Cancel! Your selected item is safe!");
                    }
                  });
                }
              }}
            >
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
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
  const filteredItems = totalPurchase?.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );

  const handleApproveData = async (data) => {
    const response = await updatePOApproveStatus(data);
    if (response?.data?.status === 200) {
      swal("Done", "Data Approve Successfully", "success");
    } else if (response?.error?.status === 400) {
      swal("Not Possible!", response?.error?.data?.message, "error");
    }
  };
  return (
    <div
      class="modal fade"
      id="purchaseModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
      style={{ overflow: "hidden" }}
    >
      <div class="modal-dialog modal-dialog-centered modal-lg " role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              {totalPurchaseModal
                ? "Total PO"
                : totalPurchaseCashModal
                ? "Total Cash PO"
                : totalPurchaseLCModal
                ? "Total LC PO"
                : totalPurchaseApproveModal
                ? "Total Approve PO"
                : totalPurchaseUnApproveModal
                ? "Total Unapprove PO"
                : ""}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                // if (activeDataModal) {
                //   setActiveDataModal(false);
                // }
                // if (inActiveDataModal) {
                //   setInActiveDataModal(false);
                // }
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <DataTable
              columns={columns}
              data={filteredItems}
              defaultSortField="name"
              customStyles={customStyles}
              striped
              pagination
              subHeader
           
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              onClick={() => {
                // if (activeDataModal) {
                //   setActiveDataModal(false);
                // }
                // if (inActiveDataModal) {
                //   setInActiveDataModal(false);
                // }
              }}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #2DDC1B",
                color: "#2DDC1B",
                textTransform: "uppercase",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHeadingModal;
