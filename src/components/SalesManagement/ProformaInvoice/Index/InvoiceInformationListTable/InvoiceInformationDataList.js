/* eslint-disable jsx-a11y/anchor-is-valid */
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

import reportImage from "../../../../../assets/images/reportlogo.png";
import authorizesSingatureImage from "../../../../../assets/images/Image_20240831165135.png";
import {
  useDeleteInvoiceInfoMutation,
  useGetAllInvoiceInformationQuery,
} from "../../../../../redux/features/invoiceinformation/invoiceinfoApi";
import { useGetAllClientInformationQuery } from "../../../../../redux/features/clientinformation/clientInfoApi";
import { useGetAllItemInformationQuery } from "../../../../../redux/features/iteminformation/finishgoodsinfoApi";
import { useGetAllItemUnitQuery } from "../../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetAllItemSizeQuery } from "../../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetCompanyInfoQuery } from "../../../../../redux/features/companyinfo/compayApi";
import { useGetAllPaymentInformationQuery } from "../../../../../redux/features/paymnetinformation/paymentInfoApi";
import { useGetAllPaymentReceiveInformationQuery } from "../../../../../redux/features/paymentreceiveinfo/paymentreceiveApi";
import { useGetUserRoleQuery } from "../../../../../redux/features/userrole/userroleApi";
import InvoiceListHeading from "../../../../Common/ListHeading/InvoiceListHeading";
import { downloadInvoiceSingleDataPDF } from "../../../../ReportProperties/PDF/HeaderFooter";
import handleInvoiceExcel from "../../../../ReportProperties/Excel/handleInvoiceExcel";
import FilterComponent from "../../../../Common/ListDataSearchBoxDesign/FilterComponent";
import { downloadInvoicePDF } from "../../../../ReportProperties/PDF/InvoiceReportDownload";
import getMakebyUser from "../../../../Common/CommonMakeUser/CommonMakingUser";
import LoadingSpineer from "./../../../../Common/LoadingSpinner/LoadingSpineer";

const InvoiceInformationDataList = ({ permission }) => {
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const {
    data: invoiceDatas,
    refetch,
    isLoading: isInvoiceLoading,
  } = useGetAllInvoiceInformationQuery(undefined);
  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
  const { data: finishGoodsData } = useGetAllItemInformationQuery(undefined);
  const { data: unitInfo } = useGetAllItemUnitQuery(undefined);
  const { data: sizeInfo } = useGetAllItemSizeQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: paymentInfo } = useGetAllPaymentInformationQuery(undefined);
  const { data: payementReceiveData } =
    useGetAllPaymentReceiveInformationQuery(undefined);
  const [deleteInvoice] = useDeleteInvoiceInfoMutation();
  const [totalApprovedPi, setTotalApprovePi] = useState([]);
  const [totalUnApprovePi, setTotalUnApprovePi] = useState([]);
  const [totalApprovePiAmount, setTotalApprovePiAmount] = useState(0);
  const [totalUnApprovePiAmount, setTotalUnApprovePiAmount] = useState(0);
  const [userWaysListData, setUserWaysListData] = useState([]);
  const reportTitle = "PRO FORMA INVOICE";
  const base64Logo = reportImage;
  const signature = authorizesSingatureImage;

  const { data: userRoles } = useGetUserRoleQuery(undefined);
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const userRoleId = getUserParse.roleId;
  const makebyUser = getMakebyUser();

  useEffect(() => {
    const matchUserRole = userRoles?.find((x) => x._id == userRoleId);
    const invoiceData = invoiceDatas?.filter(
      (data) => data.makeBy === makebyUser
    );

    if (
      matchUserRole?._id === "65d48768a106fcb4f5c28071" ||
      matchUserRole?._id === "65d486123346cddf01c3773a"
    ) {
      const filterApprovePi = invoiceDatas?.filter(
        (x) => x.isApproved === true
      );
      const filterUnApprovePi = invoiceDatas?.filter(
        (x) => x.isApproved === false
      );

      const totalApprovedAmount = invoiceDatas
        ?.filter((invoice) => invoice?.isApproved === true)
        .reduce((total, invoice) => {
          return (
            total +
            invoice.detailsData.reduce(
              (subTotal, item) => subTotal + item.totalAmount,
              0
            )
          );
        }, 0);

      const totalUnapprovedAmount = invoiceDatas
        ?.filter((invoice) => invoice?.isApproved === false)
        .reduce((total, invoice) => {
          return (
            total +
            invoice.detailsData.reduce(
              (subTotal, item) => subTotal + item.totalAmount,
              0
            )
          );
        }, 0);
      setTotalApprovePi(filterApprovePi);
      setTotalUnApprovePi(filterUnApprovePi);
      setTotalApprovePiAmount(totalApprovedAmount);
      setTotalUnApprovePiAmount(totalUnapprovedAmount);
    } else {
      const filterApprovePi = invoiceData?.filter((x) => x.isApproved === true);
      const filterUnApprovePi = invoiceData?.filter(
        (x) => x.isApproved === false
      );

      const totalApprovedAmount = invoiceData
        ?.filter((invoice) => invoice?.isApproved === true)
        .reduce((total, invoice) => {
          return (
            total +
            invoice.detailsData.reduce(
              (subTotal, item) => subTotal + item.totalAmount,
              0
            )
          );
        }, 0);

      const totalUnapprovedAmount = invoiceData
        ?.filter((invoice) => invoice?.isApproved === false)
        .reduce((total, invoice) => {
          return (
            total +
            invoice.detailsData.reduce(
              (subTotal, item) => subTotal + item.totalAmount,
              0
            )
          );
        }, 0);
      setTotalApprovePi(filterApprovePi);
      setTotalUnApprovePi(filterUnApprovePi);
      setTotalApprovePiAmount(totalApprovedAmount);
      setTotalUnApprovePiAmount(totalUnapprovedAmount);
    }

    if (
      matchUserRole?._id === "65d48768a106fcb4f5c28071" ||
      matchUserRole?._id === "65d486123346cddf01c3773a"
    ) {
      setUserWaysListData(invoiceDatas);
    } else {
      setUserWaysListData(invoiceData);
    }
  }, [invoiceDatas, customerInfo, makebyUser, userRoleId, userRoles]);

  const columns = [
    {
      name: "Sl.",
      selector: (userWaysListData, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Pi Date",
      selector: (userWaysListData) =>
        new Date(userWaysListData?.piDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Invoice No",
      selector: (userWaysListData) => userWaysListData?.invoiceNo,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Client Name",
      selector: (userWaysListData) => {
        const customerName = customerInfo?.find(
          (x) => x._id === userWaysListData?.customerID
        );
        return customerName ? customerName.clientName : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Quantity",
      selector: (userWaysListData) => {
        const totalQuantity = userWaysListData.detailsData.reduce(
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
      selector: (userWaysListData) => {
        const totalAmount = userWaysListData.detailsData.reduce(
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
      name: "Approve Status",
      selector: (userWaysListData) => {
        return userWaysListData.isApproved ? (
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
      cell: (userWaysListData) => (
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
                downloadInvoicePDF(
                  userWaysListData,
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
                window.open(`invoice-list/update-invoice/${userWaysListData?._id}`);
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
                const isSpecialPaymentExist =
                  userWaysListData?.detailsData.find(
                    (item) => item.specialApproveForDelivary === true
                  );
                const isPaymentReceiveExist = payementReceiveData.find(
                  (item) => item.piNumber === userWaysListData.invoiceNo
                );

                if (
                  (userWaysListData?.paymentId == "667d2b983e37e91c4e1f3a20" &&
                    isSpecialPaymentExist) ||
                  isPaymentReceiveExist
                ) {
                  swal({
                    title: "Not Possible!",
                    text: "This PI has already prepared for delivery.",
                    icon: "warning",
                  });
                } else {
                  swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this data!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  }).then((willDelete) => {
                    if (willDelete) {
                      deleteInvoice(userWaysListData?._id);
                      swal("Your data has been deleted!", {
                        icon: "success",
                      });
                    } else {
                      swal("Your data is safe!");
                    }
                  });
                }
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

  const filteredItems = userWaysListData?.filter(
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
      <div className={`${invoiceDatas?.length == 0 ? "d-none" : "d-block"}`}>
        <div
          className={`d-flex justify-content-end align-items-center w-100 mb-2 mt-2`}
        >
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
                        if (companyinfo?.length !== 0 || undefined) {
                          downloadInvoiceSingleDataPDF(
                            userWaysListData,
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
                      class="dropdown-item"
                      href="#"
                      onClick={() => {
                        handleInvoiceExcel(
                          userWaysListData,
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
    invoiceDatas,
    filterText,
    resetPaginationToggle,
    refetch,
    companyinfo,
    userWaysListData,
    customerInfo,
  ]);

  return (
    <div>
       <LoadingSpineer isLoading={isInvoiceLoading}></LoadingSpineer>
      <div
        className={`row px-5 mx-4 ${isInvoiceLoading ? "d-none" : "d-block"} `}
        style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
      >
        <InvoiceListHeading
          totalApprovedPi={totalApprovedPi?.length}
          totalUnApprovePi={totalUnApprovePi?.length}
          totalApprovePiAmount={totalApprovePiAmount}
          totalUnApprovePiAmount={totalUnApprovePiAmount}
          permission={permission}
          userRoleId={userRoleId}
          userRoles={userRoles}
          finishGoodsData={finishGoodsData}
          unitInfo={unitInfo}
          sizeInfo={sizeInfo}
          paymentInfo={paymentInfo}
          base64Logo={base64Logo}
          signature={signature}
        ></InvoiceListHeading>
        <div
          className="px-2"
          style={{ height: "calc(80vh - 120px)", overflowY: "auto" }}
        >
          <div className="col  mt-sm-4 mt-md-4 mt-lg-4">
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
      </div>
    </div>
  );
};

export default InvoiceInformationDataList;
