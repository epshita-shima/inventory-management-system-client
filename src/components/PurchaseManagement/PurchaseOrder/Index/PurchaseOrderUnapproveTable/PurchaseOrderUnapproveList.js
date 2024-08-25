/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "../../../../Common/ListDataSearchBoxDesign/FilterComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckToSlot,
  faFilePdf,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useGetAllSupplierInformationQuery } from "../../../../../redux/features/supplierInformation/supplierInfoApi";
import { useGetAllPaymentInformationQuery } from "../../../../../redux/features/paymnetinformation/paymentInfoApi";
import swal from "sweetalert";
import {
  useDeletePurchaseOrderInformationMutation
} from "../../../../../redux/features/purchaseorderinformation/purchaseOrderInfoApi";
import { downloadPOPDF } from "../../../../ReportProperties/handlePurchaseOrderReport";
import { useGetCompanyInfoQuery } from "../../../../../redux/features/companyinfo/compayApi";
import { useGetAllBankInformationQuery } from "../../../../../redux/features/bankinformation/bankInfoAPi";
import { useGetAllRMItemInformationQuery } from "../../../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetAllGRNInformationQuery } from "../../../../../redux/features/goodsreceivenoteinfo/grninfoApi";

const PurchaseOrderUnapproveList = ({
  permission,
  purchaseFilterUnApproveAllData,
  setPurchaseFilterUnApproveAllData,
  purchaseInfoData,
  handleApproveData,
  fromDate,
  toDate,
  refetch,
}) => {
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const {data:bankInformation}=useGetAllBankInformationQuery(undefined)
  const { data: rawMaterialItemInfo } =
    useGetAllRMItemInformationQuery(undefined);
  const { data: paymentData } = useGetAllPaymentInformationQuery(undefined);
  const [deletePurchaseOrderInfo] = useDeletePurchaseOrderInformationMutation();
  const { data: supplierInfo } = useGetAllSupplierInformationQuery(undefined);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filterText, setFilterText] = useState("");
  const reportTitle = "PURCHASE ORDER";
  const {data:grnDataInfo}=useGetAllGRNInformationQuery(undefined)

  const columns = [
    {
      name: "Sl.",
      selector: (purchaseFilterUnApproveAllData, index) => index + 1,
      center: true,
      width: "60px",
    },

    {
      name: "PO Make Date",
      selector: (purchaseFilterUnApproveAllData) =>
        new Date(purchaseFilterUnApproveAllData?.makeDate).toLocaleDateString(
          "en-CA"
        ),
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },

    {
      name: "PO Number",
      selector: (purchaseFilterUnApproveAllData) =>
        purchaseFilterUnApproveAllData?.poNo,
      sortable: true,
      center: true,
      filterable: true,
      width: "260px",
    },

    {
      name: "Supplier Name",
      selector: (purchaseFilterUnApproveAllData) => {
        const supplierName = supplierInfo?.find(
          (x) => x._id === purchaseFilterUnApproveAllData?.supplierId
        );
        return supplierName ? supplierName.supplierName : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "160px",
    },

    {
      name: "Total Quantity",
      selector: (purchaseFilterUnApproveAllData) =>
        (purchaseFilterUnApproveAllData?.grandTotalQuantity).toLocaleString(),
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Total Amount",
      selector: (purchaseFilterUnApproveAllData) =>
        (purchaseFilterUnApproveAllData?.grandTotalAmount).toLocaleString(),
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },
    {
      name: "Total Received Quantity",
      selector: (purchaseInfoData) =>{
        const totalReceiveQuantity =grnDataInfo
        ?.filter((x) => x.supplierPoNo === purchaseInfoData?.poNo)
        .reduce((acc, cur) => acc + parseInt(cur.grandTotalReceivedQuantity, 10), 0);
        return totalReceiveQuantity;
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "220px",
    },
    {
      name: "Total Received Amount",
      selector: (purchaseInfoData) =>{
        const totalReceiveQuantity =grnDataInfo
        ?.filter((x) => x.supplierPoNo === purchaseInfoData?.poNo)
        .reduce((acc, cur) => acc + parseInt(cur.grandTotalAmount, 10), 0);
        return totalReceiveQuantity;
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "220px",
    },
    {
      name: "Action",
      button: true,
      width: "200px",
      grow: 2,
      cell: (purchaseFilterUnApproveAllData) => (
        <div className="d-flex justify-content-between align-items-center">
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
              border: `${
                purchaseFilterUnApproveAllData?.items?.length == 0
                  ? "2px solid gray"
                  : "2px solid red"
              }`,
              padding: "3px",
              borderRadius: "5px",
            }}
            onClick={() => {
              handleApproveData(purchaseFilterUnApproveAllData);
            }}
          >
            <FontAwesomeIcon icon={faCheckToSlot}></FontAwesomeIcon>
          </a>

          {permission?.isPDF ? (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Update item"
              style={{
                color: `${
                  purchaseInfoData?.items?.length == 0 ? "gray" : "orange"
                } `,
                border: `${
                  purchaseInfoData?.items?.length == 0
                    ? "2px solid gray"
                    : "2px solid orange"
                }`,
                padding: "3px",
                borderRadius: "5px",
                marginLeft:'10px'
              }}
              onClick={() => {
                downloadPOPDF(purchaseFilterUnApproveAllData, rawMaterialItemInfo, bankInformation,paymentData,{ companyinfo }, reportTitle);
              }}
            >
              <FontAwesomeIcon icon={faFilePdf}></FontAwesomeIcon>
            </a>
          ) : (
            ""
          )}
          {permission?.isUpdated ? (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Update item"
              style={{
                color: `${
                  purchaseFilterUnApproveAllData?.items?.length == 0
                    ? "gray"
                    : "#2DDC1B"
                } `,
                border: `${
                  purchaseFilterUnApproveAllData?.items?.length == 0
                    ? "2px solid gray"
                    : "2px solid #2DDC1B"
                }`,
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                window.open(
                  `update-purchaseinfo/${purchaseFilterUnApproveAllData?._id}`
                );
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
            </a>
          ) : (
            ""
          )}

          {permission?.isRemoved ? (
            <a
              target="_blank"
              className="action-icon "
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
                swal({
                  title: "Are you sure to delete this item?",
                  text: "If once deleted, this item will not recovery.",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then(async (willDelete) => {
                  if (willDelete) {
                    const response = await deletePurchaseOrderInfo(
                      purchaseFilterUnApproveAllData?._id
                    ).unwrap();
                    console.log(response);
                    if (response.status === 200) {
                      swal("Deleted!", "Your selected item has been deleted!", {
                        icon: "success",
                      });
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
              }}
            >
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
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
  };

  const filteredItems = purchaseFilterUnApproveAllData?.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <div className="d-block d-sm-flex justify-content-center align-items-center ">
        {/* <div>
            <FontAwesomeIcon
              style={{ fontSize: "24px", color: "#2DDC1B", fontWeight: "bold" }}
              icon={faRefresh}
              onClick={() => refetch()}
            ></FontAwesomeIcon>
            &nbsp;
          </div> */}

        <div className="mt-2 mt-sm-0 ms-2 mb-2 mb-sm-0">
          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
          />
        </div>
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <div className="row">
      <div className="col userlist-table">
        <div className="shadow-lg ">
          <DataTable
            columns={columns}
            data={filteredItems}
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
  );
};

export default PurchaseOrderUnapproveList;
