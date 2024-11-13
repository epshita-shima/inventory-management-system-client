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
import {
  useDeleteDeliveryOrderInformationMutation,
  useGetAllDelieryOrderInformationQuery,
} from "../../../../../redux/features/deliveryorderinformation/deliveryinfoApi";
import { useGetAllInvoiceInformationQuery } from "../../../../../redux/features/invoiceinformation/invoiceinfoApi";
import { useGetAllClientInformationQuery } from "../../../../../redux/features/clientinformation/clientInfoApi";
import { useGetAllItemInformationQuery } from "../../../../../redux/features/iteminformation/iteminfoApi";
import { downloadDeliveryOrderPDF } from "../../../../ReportProperties/PDF/HeaderFooter";
import { useGetAllItemSizeQuery } from "../../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetCompanyInfoQuery } from "../../../../../redux/features/companyinfo/compayApi";

const DeliveryOrderListData = ({ permission }) => {
  const reportTitle = "DELIVERY ORDER INFORMATION";
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const { data: deliveryOrderData, refetch } =
    useGetAllDelieryOrderInformationQuery(undefined);
  const { data: invoiceInformation } =
    useGetAllInvoiceInformationQuery(undefined);
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);
  const { data: finishGoodsInfo } = useGetAllItemInformationQuery(undefined);
  const { data: itemsizeinfo } = useGetAllItemSizeQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const [deleteDOInfo] = useDeleteDeliveryOrderInformationMutation();

  const transformedDOData = deliveryOrderData?.flatMap((itemDetails) =>
    itemDetails.detailsData.map((detail) => ({
      ...itemDetails,
      detailsData: detail,
    }))
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Client Name",
      selector: (row) => {
        const piInfo = invoiceInformation?.find((x) => x._id === row?.piId);
        const clientInfo = clientInformation?.find(
          (x) => x._id == piInfo?.customerID
        );
        return clientInfo ? clientInfo?.clientName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width:"220px"
    },

    {
      name: "PI Number",
      selector: (row) => {
        console.log(row)
        const piNumber = invoiceInformation?.find(
          (x) => x._id === row?.piId
        );
        return piNumber ? piNumber.invoiceNo : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },

    {
      name: "DO Number",
      selector: (row) => row?.doNo,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Item Name",
      selector: (row,index) => {
        const itemName = finishGoodsInfo?.find(
          (x) => x._id === row?.detailsData.itemId
        );
       
        const filteredItemSize = finishGoodsInfo?.map((item) => {
          const foundSize = itemsizeinfo?.find(
            (rawItem) => rawItem._id === item.sizeId
          );
          return foundSize;
        });
        const filteredItemSizes = filteredItemSize ? filteredItemSize[index]?.sizeInfo : null;
        return itemName ? itemName.itemName +` (${filteredItemSizes})` : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width:"250px"
    },

    {
      name: "Delivery Quantity",
      selector: (row) => row.detailsData?.deliverQty,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },

    {
      name: "Delivery Status",
      selector: (row) => {
        return row.isApproved ? (
          <p className="text-success">Approved</p>
        ) : (
          <p className="text-danger fw-bold">Not Delivered</p>
        );
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },

    {
      name: "Action",
      button: true,
      width: "150px",
      grow: 2,
      cell: (row) => (
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
                downloadDeliveryOrderPDF(
                  row,
                  deliveryOrderData,
                  invoiceInformation,
                  clientInformation,
                  finishGoodsInfo,
                  itemsizeinfo,
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
                    if (row.deliveryStatus == true) {
                      swal({
                        title: "Sorry!",
                        text: "Delivery already completed.",
                        icon: "warning",
                        button: "OK",
                      });
                    } else {
                      deleteDOInfo(row?._id);
                      refetch();
                      swal("Your data has been deleted!", {
                        icon: "success",
                      });
                    }
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
    title: {
      style: {
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#4A90E2",
        padding: "10px",
      },
    },
  };

  const filteredItems = transformedDOData?.filter(
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
      className="row px-2 mx-4"
      style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
      <div className="col mt-sm-4 mt-md-4 mt-lg-0">
        <div className="shadow-lg">
          <DataTable
            title={
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#000",
                  padding: "10px",
                }}
              >
                DO List
              </h2>
            }
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
