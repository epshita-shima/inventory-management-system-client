/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import swal from "sweetalert";
import DataTable from "react-data-table-component";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFilePdf,
  faPenToSquare,
  faRefresh,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { useGetAllPaymentReceiveInformationQuery, useLazyGetFilteredPaymentReceiveInfoQuery } from "../../../../redux/features/paymentreceiveinfo/paymentreceiveApi";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import { useGetAllInvoiceInformationQuery } from "../../../../redux/features/invoiceinformation/invoiceinfoApi";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { clientInfoDropdown, invoiceListDropdown } from "../../../Common/CommonDropdown/CommonDropdown";

const PaymentReceiveDataTableList = ({ permission }) => {
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const { data: paymentReceivedData, refetch } =
    useGetAllPaymentReceiveInformationQuery(undefined);
  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
  const { data: invoiceData } = useGetAllInvoiceInformationQuery(undefined);
  const { data: finishGoods } = useGetAllItemInformationQuery(undefined);
  const { data: itemsizeinfo } = useGetAllItemSizeQuery(undefined);
  const [clientId,setClientId]=useState('')
  const[piNumber,setPiNumber]=useState('')
const[filteredData,setFilteredData]=useState([])
const [executeQuery, setExecuteQuery] = useState(false);
const [isTableDispaly, setIsTableDisplay] = useState(false);
const [filters, setFilters] = useState({
  clientId: clientId,
  piNumber: piNumber,
});
const [isFetchAfterDeleteData, setIsFetchAfterDeleteData] = useState(false);
const {data:clientInformation}=useGetAllClientInformationQuery(undefined)
const piFilteredData = invoiceData?.filter((pi) =>pi.paymentId=="667d2b983e37e91c4e1f3a1f")
const piInfoOptions=invoiceListDropdown(piFilteredData)
const clientInfoOptions=clientInfoDropdown(clientInformation)
const [trigger, { data: filteredDatas, error, isFetching }] =
useLazyGetFilteredPaymentReceiveInfoQuery();

console.log(filteredDatas)
useEffect(() => {
if (executeQuery) {
  setIsTableDisplay(true);
  trigger(filters);
  setExecuteQuery(false);
}
}, [executeQuery, trigger, filters]);

useEffect(() => {
if (filteredDatas && filteredDatas.length === 0) {
  setIsTableDisplay(false);
  swal({
    title: "Sorry!",
    text: "No data found for the selected filters",
    icon: "warning",
    button: "OK",
  });
} else {
  const today = new Date();
  const lastMonthDate = new Date();
  const lastWeekDate = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  lastMonthDate.setMonth(today.getMonth() - 1);
  lastWeekDate.setDate(today.getDate() - 7);
  setFilteredData(filteredDatas || []);
}
}, [filteredDatas]);

useEffect(() => {
if (isFetchAfterDeleteData) {
  handleApplyFilters();
  setIsFetchAfterDeleteData(false);
}
}, [isFetchAfterDeleteData]);

const handleApplyFilters = async () => {
setExecuteQuery(true);
};

  const groupByClient = (data) => {
    const groupedData = [];

    data?.forEach((payment) => {
      // Insert a "group header"
      // groupedData.push({
      //   isGroup: true,
      // });

      // Insert the actual data rows
      payment.detailsData.forEach((detail) => {
        groupedData.push({
          ...payment,
          detail, // attach details
          isGroup: false,
        });
      });
    });
    console.log(groupedData);
    return groupedData;
  };

  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => (row.isGroup ? null : index + 1),
      center: true,
      width: "60px",
    },
    {
      name: "Payment Receive Date",
      selector: (row) =>
        row.isGroup
          ? null
          : new Date(row.detail.paymentReceiveDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "Client Name",
      selector: (row) => {
        const customerName = customerInfo?.find((x) => x._id === row?.clientId);
        return customerName ? customerName.clientName : "N/A"; // Default to "N/A" if not found
      },
      sortable: true,
      center: true,
      width: "250px",
    },
    {
      name: "PI Number",
      selector: (row) => (row.isGroup ? row.piNumber : row.piNumber),
      sortable: true,
      center: true,
      width: "200px",
    },

    {
      name: "Item Name",
      selector: (row) => {
        const itemCode = finishGoods?.find((x) => row.detail.itemId === x._id);
        const itemSize = itemsizeinfo?.find(
          (size) => size._id === itemCode?.sizeId
        );
        return itemCode
          ? itemCode.itemName + " " + `(${itemSize?.sizeInfo})`
          : "N/A";
      },
      sortable: true,
      center: true,
      width: "250px",
    },
    {
      name: "Currency",
      selector: (row) => {
        const currency = invoiceData?.find(
          (x) => x.invoiceNo === row?.piNumber
        );
        return currency ? currency.currency : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },
    {
      name: "Quantity",
      selector: (row) => (row.isGroup ? null : row.detail?.quantity),
      sortable: true,
      center: true,
      width: "120px",
    },
    {
      name: "Amount",
      selector: (row) => (row.isGroup ? null : row.detail?.amount),
      sortable: true,
      center: true,
      width: "120px",
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
                //   downloadInvoicePDF(
                //     paymentReceivedData,
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
                window.open(`update-payment-received/${row?._id}`);
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
                console.log(row?.value);
                swal({
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this data!",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    //   deleteInvoice(paymentReceivedData?._id);
                    swal("Poof! Your data has been deleted!", {
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

  const filteredItems = groupByClient(filteredDatas)?.filter(
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
                      //     paymentReceivedData,
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
                      //   paymentReceivedData,
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
      <div>
        <h3 className="fw-bold mt-1">Payment Receive List</h3>
        <hr />
        <div className="d-lg-flex justify-content-lg-between align-items-lg-center w-50">
          <div className="w-100">
            <label htmlFor="">Client Name</label>
            <br />
            <div className="w-100">
              <Select
                class="form-select"
                className="w-100"
                aria-label="Default select example"
                name="poinfo"
                options={clientInfoOptions}
                defaultValue={{
                  label: "Select Client Name",
                  value: 0,
                }}
                value={clientInfoOptions.filter(function (option) {
                  return option.value === clientId;
                })}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    width: "100%",
                    borderColor: state.isFocused ? "#fff" : "#fff",
                    border: "1px solid #2DDC1B",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                    height: "auto",
                    // overflowY: "scroll",
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#B8FEB3",
                    primary: "#2DDC1B",
                  },
                })}
                onChange={(e) => {
                  setClientId(e.value)
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    clientId:e.value,
                  }));
                }}
              ></Select>
            </div>
          </div>

          <div className="w-100 ms-2">
            <label htmlFor="">PI Number</label>
            <br />
            <div className="w-100">
              <Select
                class="form-select"
                className="w-100"
                aria-label="Default select example"
                name="poinfo"
                options={piInfoOptions}
                defaultValue={{
                  label: "Select PI Number",
                  value: 0,
                }}
                value={piInfoOptions.filter(function (option) {
                  return option.label === piNumber;
                })}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    width: "100%",
                    borderColor: state.isFocused ? "#fff" : "#fff",
                    border: "1px solid #2DDC1B",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                    height: "auto",
                    // overflowY: "scroll",
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#B8FEB3",
                    primary: "#2DDC1B",
                  },
                })}
                onChange={(e) => {
                  console.log(e)
                  setPiNumber(e.label)
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    piNumber:e.label,
                  }));
                }}
              ></Select>
            </div>
          </div>
        </div>
        <div>
          <button
            className="border-0 "
            style={{
              backgroundColor: "#2DDC1B",
              color: "white",
              padding: "5px 10px",
              fontSize: "14px",
              borderRadius: "5px",
              width: "100px",
              height: "38px",
              marginTop: "25px",
            }}
            onClick={handleApplyFilters}
          >
            Show
          </button>

          <button
            className="border-0 "
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "5px 10px",
              fontSize: "14px",
              borderRadius: "5px",
              width: "100px",
              height: "38px",
              marginLeft: "10px",
              marginTop: "25px",
            }}
            onClick={() => {}}
          >
            Clear
          </button>
        </div>
      </div>

      {
        isTableDispaly ? (<div className="col userlist-table mt-sm-4 mt-md-4 mt-lg-0">
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
        </div>) : ''
      }
      
    </div>
  );
};

export default PaymentReceiveDataTableList;
