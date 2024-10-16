/* eslint-disable jsx-a11y/anchor-is-valid */
import FilterComponent from "../../../../Common/ListDataSearchBoxDesign/FilterComponent";
import React, { useEffect, useMemo, useState } from "react";
import swal from "sweetalert";
import DataTable from "react-data-table-component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFilePdf,
  faPenToSquare,
  faRefresh,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useGetAllDelieryOrderInformationQuery } from "../../../../../redux/features/deliveryorderinformation/deliveryinfoApi";

const DeliveryOrderListData = ({ permission }) => {
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const { data: deliveryOrderData, refetch } =
    useGetAllDelieryOrderInformationQuery(undefined);

    console.log(deliveryOrderData)

  const columns = [
    {
      name: "Sl.",
      selector: (deliveryOrderData, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Client Name",
      selector: (deliveryOrderData) =>
        new Date(deliveryOrderData?.piDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "PI Number",
      selector: (deliveryOrderData) => deliveryOrderData?.piNumber,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },

    {
      name: "DO Number",
      selector: (deliveryOrderData) => deliveryOrderData?.piNumber,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Delivery Quantity",
      selector: (deliveryOrderData) => deliveryOrderData?.deliverQty,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Delivery Status",
      selector: (deliveryOrderData) => {
        return deliveryOrderData.isApproved ? (
          <p className="text-success">Approved</p>
        ) : (
          <p className="text-danger">Unapprove</p>
        );
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Action",
      button: true,
      width: "150px",
      grow: 2,
      cell: (deliveryOrderData) => (
        <div className="d-flex justify-content-between align-content-center">
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
              }}
              onClick={() => {
                //   downloadInvoicePDF(
                //     deliveryOrderData,
                //     finishGoodsData,
                //     customerInfo,
                //     unitInfo,
                //     sizeInfo,
                //     paymentInfo,
                //     base64Logo,
                //     signature,
                //     { companyinfo },
                //     reportTitle
                //   );
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
              title="Update menu"
              style={{
                color: "#2DDC1B",
                border: "2px solid #2DDC1B",
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                window.open(`update-invoice/${deliveryOrderData?._id}`);
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
              title="Delete user"
              style={{
                color: "red",
                border: "2px solid red",
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                swal({
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this data!",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    // deleteInvoice(deliveryOrderData?._id);
                    swal("Your data has been deleted!", {
                      icon: "success",
                    });
                  } else {
                    swal("Your data is safe!");
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

  const filteredItems = deliveryOrderData?.filter(
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
      <div className="d-flex justify-content-end align-items-center w-100">
        <div className="d-flex justify-content-end align-items-center">
          <div className="table-head-icon d-flex align-items-center me-2">
            <div>
              <FontAwesomeIcon
                icon={faRefresh}
                onClick={() => refetch()}
              ></FontAwesomeIcon>
              &nbsp;
            </div>
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
                      // if (companyinfo?.length !== 0 || undefined) {
                      //   downloadInvoiceSingleDataPDF(
                      //     deliveryOrderData,
                      //     customerInfo,
                      //     { companyinfo },
                      //     reportTitle
                      //   );
                      // }
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
                      // handleInvoiceExcel(
                      //   deliveryOrderData,
                      //   customerInfo,
                      //   companyinfo,
                      //   reportTitle
                      // );
                    }}
                  >
                    Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
          />
        </div>
      </div>
    );
  }, [filterText, resetPaginationToggle, refetch]);

  return (
    <div
      className="row px-5 mx-4"
      style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
      <div className="col mt-sm-4 mt-md-4 mt-lg-0">
        <div className="shadow-lg">
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

export default DeliveryOrderListData;
