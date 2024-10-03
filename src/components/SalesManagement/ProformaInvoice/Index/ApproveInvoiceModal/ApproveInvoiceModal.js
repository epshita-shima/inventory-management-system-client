/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import "./ApproveInvoiceModal.css";
import { useGetAllClientInformationQuery } from "../../../../../redux/features/clientinformation/clientInfoApi";
import { useGetCompanyInfoQuery } from "../../../../../redux/features/companyinfo/compayApi";
import { useGetAllInvoiceInformationQuery } from "../../../../../redux/features/invoiceinformation/invoiceinfoApi";
import FilterComponent from "../../../../Common/ListDataSearchBoxDesign/FilterComponent";
import handleInvoiceExcel from "../../../../ReportProperties/handleInvoiceExcel";
import { downloadInvoiceSingleDataPDF } from "../../../../ReportProperties/HeaderFooter";

const ApproveInvoiceModal = ({permission}) => {
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const { data: companyinfo } = useGetCompanyInfoQuery();
    const reportTitle = "INVOICE REPORT";
    const { data: invoiceData } = useGetAllInvoiceInformationQuery(undefined);
    const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
    const [filterUnapporovePiData,setfilterUnapporovePiData]=useState([])
  
    useEffect(()=>{
      const filteredUnApproveData=invoiceData?.filter((x)=>x.isApproved==true)
      setfilterUnapporovePiData(filteredUnApproveData)
    },[invoiceData])
  
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
                  <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <a
                      class="dropdown-item"
                      href="#"
                      onClick={() => {
                        if (companyinfo?.length !== 0 || undefined) {
                          downloadInvoiceSingleDataPDF(invoiceData,customerInfo,{ companyinfo }, reportTitle);
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
      );
    }, [filterText, resetPaginationToggle, companyinfo,invoiceData,customerInfo]);
  

    return (
      <>
         <div
  class="modal fade"
  id="approveInvoiceModal"
  tabindex="-1"
  role="dialog"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog fullscreen-modal" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">
          Approve PI List
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
      <div class="modal-body">
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
  

export default ApproveInvoiceModal
