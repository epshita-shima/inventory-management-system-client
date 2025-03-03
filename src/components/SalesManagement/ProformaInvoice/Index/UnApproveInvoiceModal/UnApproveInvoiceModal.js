/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useGetCompanyInfoQuery } from "../../../../../redux/features/companyinfo/compayApi";
import {
  useGetAllInvoiceInformationQuery,
  useUpdateInvoiceStatusMutation,
} from "../../../../../redux/features/invoiceinformation/invoiceinfoApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckToSlot,
  faDownload,
  faEye,
  faFilePdf,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import { useGetAllClientInformationQuery } from "../../../../../redux/features/clientinformation/clientInfoApi";
import FilterComponent from "../../../../Common/ListDataSearchBoxDesign/FilterComponent";
import handleInvoiceExcel from "../../../../ReportProperties/Excel/handleInvoiceExcel";
import {
  downloadInvoiceSingleDataPDF,
  downloadInvoiceUnapproveDataPDF,
} from "../../../../ReportProperties/PDF/HeaderFooter";
import "./UnApproveInvoiceModal.css";
import { downloadInvoicePDF } from "../../../../ReportProperties/PDF/InvoiceReportDownload";
import getMakebyUser from "../../../../Common/CommonMakeUser/CommonMakingUser";

const UnApproveInvoiceModal = ({
  permission,
  userRoleId,
  userRoles,
  finishGoodsData,
  unitInfo,
  sizeInfo,
  paymentInfo,
  base64Logo,
  signature,
}) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const { data: companyinfo } = useGetCompanyInfoQuery();
  const reportTitle = "INVOICE REPORT";
  const { data: invoiceData } = useGetAllInvoiceInformationQuery(undefined);
  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
  const [filterUnapporovePiData, setfilterUnapporovePiData] = useState([]);
  const makebyUser = getMakebyUser();

  const [updatePIStatus] = useUpdateInvoiceStatusMutation();
  const [approveStatus, setApproveStatus] = useState([]);

  useEffect(() => {
    const invoiceDatas = invoiceData?.filter(
      (data) => data.makeBy === makebyUser
    );
    const matchUserRole = userRoles?.find((x) => x._id == userRoleId);
    const filteredUnApproveData = invoiceDatas?.filter(
      (x) => x.isApproved == false
    );
    const filteredUnApproveDataProtected = invoiceData?.filter(
      (x) => x.isApproved == false
    );
    if (
      matchUserRole?._id === "65d48768a106fcb4f5c28071" ||
      matchUserRole?._id === "65d486123346cddf01c3773a"
    ) {
      setfilterUnapporovePiData(filteredUnApproveDataProtected);
    } else {
      setfilterUnapporovePiData(filteredUnApproveData);
    }

    setApproveStatus(matchUserRole);
  }, [invoiceData, userRoleId, userRoles, makebyUser]);

  const columns = [
    {
      name: "Sl.",
      selector: (filterUnapporovePiData, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Pi Date",
      selector: (filterUnapporovePiData) =>
        new Date(filterUnapporovePiData?.piDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Invoice No",
      selector: (filterUnapporovePiData) => filterUnapporovePiData?.invoiceNo,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Client Name",
      selector: (filterUnapporovePiData) => {
        const customerName = customerInfo?.find(
          (x) => x._id === filterUnapporovePiData?.customerID
        );
        return customerName ? customerName.clientName : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Total Quantity",
      selector: (filterUnapporovePiData) => {
        const totalQuantity = filterUnapporovePiData.detailsData.reduce(
          (acc, cur) => acc + parseInt(cur.quantity, 10),
          0
        );
        return totalQuantity;
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Total Amount",
      selector: (filterUnapporovePiData) => {
        const totalAmount = filterUnapporovePiData.detailsData.reduce(
          (acc, cur) => acc + parseInt(cur.totalAmount, 10),
          0
        );
        return totalAmount;
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },

    ...(approveStatus?._id === "65d48768a106fcb4f5c28071" ||
    approveStatus?._id === "65d486123346cddf01c3773a"
      ? [
          {
            name: "Status",
            button: true,
            width: "100px",
            grow: 2,
            cell: (filterUnapporovePiData) => (
              <div className="d-flex justify-content-between align-items-center">
                {/* <input
                  type="checkbox"
                  aria-label={`Checkbox for data item`}
                  checked={filterUnapporovePiData?.isApproved}
                  onChange={(e) => {
                    handleApproveStatus(e, filterUnapporovePiData);
                  }}
                /> */}
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
                      filterUnapporovePiData?.items?.length == 0
                        ? "2px solid gray"
                        : "2px solid red"
                    }`,
                    padding: "3px",
                    borderRadius: "5px",
                  }}
                  onClick={(e) => {
                    handleApproveStatus(e, filterUnapporovePiData);
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
                      color: "orange",
                      border: "2px solid orange",
                      padding: "3px",
                      borderRadius: "5px",
                      marginLeft: "10px",
                    }}
                    onClick={() => {
                      downloadInvoicePDF(
                        filterUnapporovePiData,
                        finishGoodsData,
                        customerInfo,
                        unitInfo,
                        sizeInfo,
                        paymentInfo,
                        base64Logo,
                        signature,
                        { companyinfo },
                        reportTitle
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
        ]
      : []),
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

  const filteredItems = filterUnapporovePiData?.filter(
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
      <div
        className={`${
          filterUnapporovePiData?.length === 0 ? "d-none" : "d-block"
        }`}
      >
        <div
          className={`d-block d-sm-flex justify-content-between align-items-center mb-2 `}
        >
          <div className={`d-flex justify-content-end align-items-center `}>
            <div className="table-head-icon d-flex">
              <div className="dropdown">
                <button
                  className="btn btn-download dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        if (companyinfo?.length !== 0 || undefined) {
                          downloadInvoiceUnapproveDataPDF(
                            invoiceData,
                            customerInfo,
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
                        handleInvoiceExcel(
                          invoiceData,
                          customerInfo,
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

          <div className="mt-2 mt-sm-0 ms-2 mb-2 mb-sm-0">
            <FilterComponent
              onFilter={(e) => setFilterText(e.target.value)}
              onClear={handleClear}
              filterText={filterText}
            />
          </div>
        </div>
      </div>
    );
  }, [
    filterUnapporovePiData,
    filterText,
    resetPaginationToggle,
    companyinfo,
    invoiceData,
    customerInfo,
  ]);

  const handleApproveStatus = async (e, invoiceData) => {
    const updatedObject = {
      ...invoiceData,
      isApproved: true,
      approveBy: makebyUser,
      approveDate: new Date(),
    };

    const response = await updatePIStatus(updatedObject);
    if (response.data.status === 200) {
      swal("Done", "Data Update status Successfully", "success");
    } else {
      swal(
        "Not Possible!",
        "An problem occurred while updating the data",
        "error"
      );
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="unapproveInvoiceModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog fullscreen-modal" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Unapprove PI List
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
            <div className="modal-body">
              <div
                className=""
                style={{ height: "calc(90vh - 120px)", overflowY: "scroll" }}
              >
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
        </div>
      </div>
    </>
  );
};

export default UnApproveInvoiceModal;
