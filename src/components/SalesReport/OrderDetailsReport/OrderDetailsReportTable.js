/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "./OrderDetailsReportTable.css";
import swal from "sweetalert";
import DataTable from "react-data-table-component";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
import {
  clientInfoDropdown,
  finishGoodsWithSizeItemDropdown,
  invoiceListDropdown,
} from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";
import {
  useGetAllInvoiceInformationQuery,
  useLazyGetFilteredForReportInvoiceInfoQuery,
} from "../../../redux/features/invoiceinformation/invoiceinfoApi";
import FilterComponent from "../../Common/ListDataSearchBoxDesign/FilterComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import CommonParameter from "../CommonParameterDetails/CommonParameter";

const OrderDetailsReportTable = ({ permission }) => {
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const [filters, setFilters] = useState({
    fromDate: new Date(fromDate).toLocaleDateString("en-CA"),
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
    itemId: "",
    clientId: "",
    piId: "",
    reportStatus: "",
  });

  console.log(filters);
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const { data: finishGoodsItemInfo } =
    useGetAllItemInformationQuery(undefined);
  const { data: itemSizeInfo } = useGetAllItemSizeQuery(undefined);
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);
  const { data: piInformation } = useGetAllInvoiceInformationQuery(undefined);
  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
  const itemOptions = finishGoodsWithSizeItemDropdown(
    finishGoodsItemInfo,
    itemSizeInfo
  );
  const clientInfoOptions = clientInfoDropdown(clientInformation);
  const piInfoOptions = invoiceListDropdown(piInformation);

  const reportStatusOptions = [
    { value: "orderdetailsreport", label: "Order Details Report" },
    { value: "ordersummaryreport", label: "Order Summary Report" },
    { value: "salesdetailsreport", label: "Sales Details Report" },
    { value: "salessummaryreport", label: "Sales Summary Report" },
    { value: "salesreturndetailsreport", label: "Sales Return Details Report" },
    { value: "salesreturnsummaryreport", label: "Sales Return Summary Report" },
    { value: "combinereport", label: "Combine Report" },
  ];

  const [trigger, { data: filteredDatas }] =
    useLazyGetFilteredForReportInvoiceInfoQuery();

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      // trigger(filters);
      setExecuteQuery(false);
    }
  }, [executeQuery, trigger, filters]);

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
                // downloadInvoicePDF(
                //   userWaysListData,
                //   finishGoodsData,
                //   customerInfo,
                //   unitInfo,
                //   sizeInfo,
                //   paymentInfo,
                //   base64Logo,
                //   signature,
                //   { companyinfo },
                //   reportTitle
                // );
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

  const filteredItems = filteredDatas?.filter(
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
          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
          />
        </div>
      </div>
    );
  }, [
    filterText,
    resetPaginationToggle,
    // refetch,
    // companyinfo,
    // userWaysListData,
    // customerInfo,
  ]);

  const handleApplyFilters = async (updatedFilters) => {
    setExecuteQuery(true);
    trigger(updatedFilters);
    // setFilters((prevFilters) => ({
    //   ...prevFilters,
    //   reportStatus: '',
    // }));
  };

  return (
    <div
      className="row px-5 mx-2"
      style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
     <CommonParameter 
     fromDate={fromDate}
     setFromDate={setFromDate}
      setFilters={setFilters}
      toDate={toDate}
      setToDate={setToDate}
      clientInfoOptions={clientInfoOptions}
      filters={filters}
      piInfoOptions={piInfoOptions}
      reportStatusOptions={reportStatusOptions}
      handleApplyFilters={handleApplyFilters}
     ></CommonParameter>

      {isTableDispaly && (
        <div style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}>
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
      )}
    </div>
  );
};

export default OrderDetailsReportTable;
