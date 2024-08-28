/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { useGetAllInvoiceInformationQuery, useUpdateInvoiceStatusMutation } from "../../../../redux/features/invoiceinformation/invoiceinfoApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckToSlot,
  faDownload,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";

const UnApproveInvoiceModal = ({ permission }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const { data: companyinfo } = useGetCompanyInfoQuery();
  const reportTitle = "INVOICE REPORT";
  const { data: invoiceData } = useGetAllInvoiceInformationQuery(undefined);
  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
  const [filterUnapporovePiData,setfilterUnapporovePiData]=useState([])
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const makebyUser = getUserParse[0].username;
  const [piApproveDate,setPiApproveDate]=useState(new Date())
  const [updatePIStatus]=useUpdateInvoiceStatusMutation()

  useEffect(()=>{
    const filteredUnApproveData=invoiceData?.filter((x)=>x.isApproved==false)
    setfilterUnapporovePiData(filteredUnApproveData)
  },[invoiceData])

  console.log(filterUnapporovePiData)
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
    },

    {
      name: "Status",
      button: true,
      width: "100px",
      grow: 2,
      cell: (filterUnapporovePiData) => (
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="checkbox"
            aria-label={`Checkbox for data item`}
            checked={filterUnapporovePiData?.isApproved} // Assuming status is a boolean field
            onChange={(e) => {
                 handleApproveStatus(e,filterUnapporovePiData)
            }}
          />
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
                        //   downloadHeadingProductionPDF(invoieData,{ companyinfo }, reportTitle);
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
                      //    handleProductionExcel(
                      //       invoieData,
                      //       finishGoods,
                      //       companyinfo,
                      //       reportTitle
                      //     );
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
  }, [filterText, resetPaginationToggle, companyinfo]);

  const handleApproveStatus=async(e,invoiceData)=>{
    const updatedObject = {
        ...invoiceData,
        isApproved: true,
        approveBy:makebyUser,
        approveDate:piApproveDate
      };
      console.log(updatedObject)
      const response = await updatePIStatus(updatedObject);
      console.log(response.data.status);
      if (response.data.status === 200) {
        swal("Done", "Data Update status Successfully", "success");
     
      } else {
        swal(
          "Not Possible!",
          "An problem occurred while updating the data",
          "error"
        );
      }
  }

  return (
    <>
      <div
        class="modal fade"
        id="unapproveInvoiceModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                All User List
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
                className=" "
                style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}
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
