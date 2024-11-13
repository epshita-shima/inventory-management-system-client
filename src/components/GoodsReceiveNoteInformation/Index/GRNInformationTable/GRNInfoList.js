/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import {
  useDeleteGRNInformationMutation,
  useGetAllGRNInformationQuery,
  useLazyGetFilteredGRNQuery,
} from "../../../../redux/features/goodsreceivenoteinfo/grninfoApi";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import swal from "sweetalert";
import {
  faDownload,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useGetAllSupplierInformationQuery } from "../../../../redux/features/supplierInformation/supplierInfoApi";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import styles from "./GRNInfoList.css";
import { useGetAllPurchaseOrderInformationQuery } from "../../../../redux/features/purchaseorderinformation/purchaseOrderInfoApi";
import { downloadGRNPDF } from "../../../ReportProperties/PDF/handleGRNReport";
import { useGetAllRMItemInformationQuery } from "../../../../redux/features/iteminformation/rmItemInfoApi";
import { supplierDropdown } from "../../../Common/CommonDropdown/CommonDropdown";
import makeAnimated from "react-select/animated";
import handleGRNDownload from "../../../ReportProperties/Excel/handleGRNExcel";

const GRNInfoList = ({ permission }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const {
    refetch,
  } = useGetAllGRNInformationQuery(undefined);
  const { data: supplierInfo } = useGetAllSupplierInformationQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: rawItemInfo } = useGetAllRMItemInformationQuery(undefined);
  const { data: purchaseInfoData } =
    useGetAllPurchaseOrderInformationQuery(undefined);

  const [deleteGRNInfo] = useDeleteGRNInformationMutation();
  const [selectSupplierPoNo, setSelectSupplierPoNo] = useState("");
  const [selectSupplierName, setSelectSupplierName] = useState("");
  const [selectMonth, setSelectMonth] = useState([]);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [fromDate, setFromDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [toDate, setToDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [pOOptionsData, setPOOptionsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isFetchAfterDeleteData, setIsFetchAfterDeleteData] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const animatedComponents = makeAnimated();
  const reportTitle = "GOODS RECEIVE REPORT";
  const [executeQuery, setExecuteQuery] = useState(false);
  const [filters, setFilters] = useState({
    supplierPONo: "",
    supplierId: "",
    fromDate:new Date().toLocaleDateString("en-CA"),
    toDate: new Date().toLocaleDateString("en-CA"),
    selectMonth: [],
  });

  const [trigger, { data: filteredDatas, error, isFetching }] =
    useLazyGetFilteredGRNQuery();

 console.log(JSON.stringify(filteredData))

  useEffect(() => {
    const createPODropdown = (options) => {
      let result = [];
      options?.forEach((option) => {
        result.push({
          value: option.poNo,
          label: option.poNo,
        });
      });
      return result;
    };
    const poOptions = createPODropdown(purchaseInfoData);
    setPOOptionsData(poOptions);
  }, [purchaseInfoData]);

  const supplierOptions = supplierDropdown(supplierInfo);

  const groupData = (filteredData) => {
    return filteredData?.reduce((acc, row) => {
      const key = `${row.makeDate}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(row);
      return acc;
    }, {});
  };

  const groupedData = groupData(filteredData);

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      trigger(filters); // Trigger the query
      setExecuteQuery(false); // Reset executeQuery after triggering the query
    }
  }, [executeQuery, trigger, filters]);

  useEffect(() => {
    // Check if filteredDatas has been updated
    if (filteredDatas && filteredDatas.length === 0) {
      setIsTableDisplay(false);
      swal({
        title: "Sorry!",
        text: "No data found for the selected filters",
        icon: "warning",
        button: "OK",
      });
    } else {
      setFilteredData(filteredDatas || []); // Ensure filteredDatas is not null/undefined
    }
  }, [filteredDatas]);

  useEffect(() => {
    if (isFetchAfterDeleteData) {
      // setFilteredData(grnAllInformation);
      handleApplyFilters();
      setIsFetchAfterDeleteData(false);
    }
  }, [isFetchAfterDeleteData]);


  const handleApplyFilters = async () => {
    setExecuteQuery(true);
  };

  const columns = [
    {
      name: "Sl.",
      selector: (filteredData, index) => index + 1,
      center: true,
      width: "50px",
    },
    {
      name: "Receive Date",
      selector: (filteredData) => filteredData?.receiveDate,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "GRNNo",
      selector: (filteredData) => filteredData?.grnSerialNo,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "ChallanNo",
      selector: (filteredData) => filteredData?.challanNo,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "supplierName",
      selector: (filteredData) => {
        const supplier = supplierInfo?.find(
          (x) => x._id === filteredData?.supplierId
        );
        return supplier ? supplier.supplierName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },

    {
      name: "Supplier PO Number",
      selector: (filteredData) => filteredData?.supplierPoNo,
      sortable: true,
      center: true,
      filterable: true,
      width: "240px",
    },
    {
      name: "Total Received Quantity",
      selector: (filteredData) => filteredData?.grandTotalReceivedQuantity,
      sortable: true,
      center: true,
      filterable: true,
      width: "210px",
    },

    {
      name: "Action",
      button: true,
      width: "120px",
      grow: 2,
      cell: (filteredData) => (
        <div className="d-flex justify-content-between align-content-center">
          {permission?.isUpdated ? (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Update item"
              style={{
                color: `${
                  filteredData?.items?.length === 0 ? "gray" : "#2DDC1B"
                } `,
                border: `${
                  filteredData?.items?.length === 0
                    ? "2px solid gray"
                    : "2px solid #2DDC1B"
                }`,
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                //already posted in accounting system
                if (filteredData.isAccountPostingStatus === true) {
                  swal(
                    "Can not Update!",
                    "Because already posted in accounting system",
                    "error"
                  );
                } else {
                  window.open(`update-grn-info/${filteredData?._id}`);
                }
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
                if (filteredData.isAccountPostingStatus === true) {
                  swal(
                    "Can not Update!",
                    "Because already posted in accounting system",
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
                      const response = await deleteGRNInfo(
                        filteredData?._id
                      ).unwrap();
                      console.log(response);
                      if (response.status === 200) {
                        swal(
                          "Deleted!",
                          "Your selected item has been deleted!",
                          {
                            icon: "success",
                          }
                        );
                        await refetch();

                        setIsFetchAfterDeleteData(true);
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

  const filteredItems = filteredData?.filter(
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
                      console.log(filteredData, companyinfo);
                      if (companyinfo?.length !== 0 || undefined) {
                        downloadGRNPDF(
                          filteredData,
                          supplierInfo,
                          rawItemInfo,
                          fromDate,
                          toDate,
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
                      handleGRNDownload(
                          filteredData,
                          rawItemInfo,
                          supplierInfo,
                          purchaseInfoData,
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
  }, [
    filterText,
    filteredData,
    supplierInfo,
    rawItemInfo,
    resetPaginationToggle,
    fromDate,
    purchaseInfoData,
    toDate,
    companyinfo,
    reportTitle,
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const generateMonths = (year) => {
    const getYear = year.getFullYear();
    const months = [
      { name: "Jan", num: "01" },
      { name: "Feb", num: "02" },
      { name: "Mar", num: "03" },
      { name: "Apr", num: "04" },
      { name: "May", num: "05" },
      { name: "Jun", num: "06" },
      { name: "Jul", num: "07" },
      { name: "Aug", num: "08" },
      { name: "Sep", num: "09" },
      { name: "Oct", num: "10" },
      { name: "Nov", num: "11" },
      { name: "Dec", num: "12" },
    ];
    return months.map((month) => ({
      value: `${getYear}-${month.num}-01`,
      label: `${month.name} ${getYear}`,
    }));
  };

  const totalQuantitys = filteredData?.reduce((accumulator, currentValue) => {
    const quantity = parseFloat(currentValue.grandTotalReceivedQuantity);
    return accumulator + (isNaN(quantity) ? 0 : quantity);
  }, 0);
  const totalAmounts = filteredData?.reduce((accumulator, currentValue) => {
    const amount = parseFloat(currentValue.grandTotalAmount);
    return accumulator + (isNaN(amount) ? 0 : amount);
  }, 0);
  const formattedDate = generateMonths(new Date());

  return (
    <div className="row px-5 mx-4 ">
      <div
        className="col userlist-table mt-4"
      >
        <div>
          <h3 className="fw-bold mt-1">Goods Receive Note (GRN) List</h3>
          <hr />
          <div className="d-lg-flex justify-content-lg-between align-items-lg-center w-lg-100 d-md-block">
            <div className="width-lg-23 width-md-23">
              <div className="w-100">
                <label htmlFor="">Supplier Name</label>
                <br />
                <div className="w-100">
                  <Select
                    class="form-select"
                    className="w-100"
                    aria-label="Default select example"
                    name="poinfo"
                    options={supplierOptions}
                    defaultValue={{
                      label: "Select Supplier Name",
                      value: 0,
                    }}
                    value={supplierOptions.filter(function (option) {
                      return option.value === selectSupplierName;
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
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        supplierId: e.value,
                      }));
                      setSelectSupplierName(e.value);
                    }}
                  ></Select>
                </div>
              </div>
            </div>
            <div className="width-lg-23 width-md-23" style={{ marginLeft: "18px" }}>
              <div className="w-100">
                <label htmlFor="">Supplier PO No</label>
                <br />
                <div className="w-100">
                  <Select
                    class="form-select"
                    className="w-100"
                    aria-label="Default select example"
                    name="poinfo"
                    options={pOOptionsData}
                    defaultValue={{
                      label: "Select Supplier PONo",
                      value: 0,
                    }}
                    value={pOOptionsData.filter(function (option) {
                      return option.value === selectSupplierPoNo;
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
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        supplierPONo: e.value,
                      }));
                      setSelectSupplierPoNo(e.value);
                    }}
                  ></Select>
                </div>
              </div>
            </div>
            <div className="ms-lg-4 margin-md">
              <label htmlFor="">From Date</label>
              <br />
              <DatePicker
                dateFormat="y-MM-dd"
                className="text-center custom-datepicker2 "
                calendarClassName="custom-calendar2"
                selected={fromDate}
                required
                onChange={(fromDate) => {
                  console.log(fromDate);
                  if (fromDate > new Date()) {
                    swal({
                      title: "Select Valid Date",
                      text: "Date should be equal or earlier than today",
                      icon: "warning",
                      button: "OK",
                    });
                  } else {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      fromDate: fromDate?.toLocaleDateString("en-CA"),
                    }));
                    setFromDate(fromDate?.toLocaleDateString("en-CA"));
                  }
                }}
              />
            </div>
            <div className="ms-lg-4 margin-md">
              <label htmlFor="">To Date</label>
              <br />
              <DatePicker
                dateFormat="y-MM-dd"
                className="text-center custom-datepicker2 "
                calendarClassName="custom-calendar2"
                selected={toDate}
                required
                onChange={(toDate) => {
                  console.log(toDate);

                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    toDate: toDate?.toLocaleDateString("en-CA"),
                  }));
                  setToDate(toDate?.toLocaleDateString("en-CA"));
                }}
              />
            </div>
            <div className="width-lg-16 margin-md" style={{  marginLeft: "20px" }}>
              <div className="w-100">
                <label htmlFor="">Select Month</label>
                <br />
                <div className="w-100">
                  <Select
                    class="form-select"
                    className="w-100"
                    aria-label="Default select example"
                    name="monthinfo"
                    components={animatedComponents}
                    options={formattedDate}
                    isMulti
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
                      const sortedSelectedMonths = e.slice().sort((a, b) => {
                        if (a.value < b.value) {
                          return -1;
                        }
                        if (a.value > b.value) {
                          return 1;
                        }
                        return 0;
                      });
                      const getEndDate = (year, month) => {
                        return new Date(year, month, 0).getDate();
                      };
                      const dates = sortedSelectedMonths?.map((option) => {
                        console.log(option);

                        const [selectedYear, selectedMonthNum] = option.value
                          .split("-")
                          .map(Number);
                        const start = `${selectedYear}-${String(
                          selectedMonthNum
                        ).padStart(2, "0")}-01`;
                        const endDay = getEndDate(
                          selectedYear,
                          selectedMonthNum
                        );
                        const end = `${selectedYear}-${String(
                          selectedMonthNum
                        ).padStart(2, "0")}-${endDay}`;
                        return { start, end };
                      });
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        selectMonth: JSON.stringify(
                          dates.map((month) => ({
                            start: month.start,
                            end: month.end,
                          }))
                        ),
                      }));
                    }}
                  ></Select>
                </div>
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
              onClick={() => {
                setFromDate(new Date()?.toLocaleDateString("en-CA"));
                setToDate(new Date()?.toLocaleDateString("en-CA"));
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  supplierPONo: "",
                  supplierId: "",
                  fromDate: new Date().toLocaleDateString("en-CA"),
                  toDate: new Date().toLocaleDateString("en-CA"),
                  selectMonth: [],
                }));
                setSelectSupplierName("");
                setSelectSupplierPoNo("");
                setSelectMonth("");
                setIsTableDisplay(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {isTableDispaly ? (
          <div className=" " 
          style={{ height: 'calc(65vh - 120px)', overflowY: 'scroll' }}
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
        ) : null}
      </div>

      <table id="my-grn-table" className="d-none">
        <thead>
          <tr>
            <th>Received Date</th>
            <th>Supplier Name</th>
            <th>Supplier PO No</th>
            <th>Item Name</th>
            <th>GRN No</th>
            <th>Challan No</th>
            <th>Currency</th>
            <th>Reveive Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
           {Object.keys(groupedData)?.map((key) => {
            const group = groupedData[key];
            console.log(key)
            const formattedDate = formatDate(group[0].makeDate);
            const supplierPONo = group[0].supplierPoNo;
            const rowSpan = group.length;

            const totalGroupWaysQuantity = group?.reduce(
              (accumulator, currentValue) => {
                const quantity = parseFloat(
                  currentValue.grandTotalReceivedQuantity
                );
                return accumulator + (isNaN(quantity) ? 0 : quantity);
              },
              0
            );
            const totalGroupWaysAmount = group?.reduce(
              (accumulator, currentValue) => {
                const amount = parseFloat(currentValue.grandTotalAmount);
                return accumulator + (isNaN(amount) ? 0 : amount);
              },
              0
            );

            return (
              <>
                {group.map((row, rowIndex) => {
                  const itemNames = rawItemInfo
                    ?.filter((item) =>
                      row?.detailsData?.some(
                        (detail) => detail?.itemId === item._id
                      )
                    )
                    .map((filteredItem) => filteredItem.itemName)
                    .join(", ");
                  const unitPrices = row.detailsData
                    .map((detail) => detail.unitPrice)
                    .join(", ");
                  const amounts = row.detailsData
                    .map((detail) => detail.amount)
                    .join(", ");
                  const supplierName = supplierInfo
                    ?.filter((rawItem) => rawItem._id === row.supplierId)
                    .map((filteredItem) => filteredItem.supplierName)
                    .join(", ");
                  const currency = purchaseInfoData
                    ?.filter((poItem) => poItem._id === row.pOSingleId)
                    .map((filteredItem) => filteredItem.currencyId)
                    .join(",");

                  return (
                    <tr key={row._id}>
                      {rowIndex === 0 && (
                        <td
                          rowSpan={rowSpan}
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          {formattedDate}
                        </td>
                      )}
                      <td>{supplierName}</td>
                      <td>{supplierPONo}</td>
                      <td>{itemNames}</td>
                      <td>{row.grnSerialNo}</td>
                      <td>{row.challanNo}</td>
                      <td>{currency}</td>
                      <td>{row.grandTotalReceivedQuantity}</td>
                      <td>{unitPrices}</td>
                      <td>{amounts}</td>
                    </tr>
                  );
                })}
               
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      padding: "8px",
                      border: "1px solid black",
                    }}
                  >
                    Datewise Total
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid black",
                    }}
                  >
                    {totalGroupWaysQuantity.toLocaleString()}
                  </td>
                  <td></td>
                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid black",
                    }}
                  >
                    {totalGroupWaysAmount.toLocaleString()}
                  </td>
                </tr>
              </>
            );
          })} 

          <tr>
            <td
              colSpan={7}
              style={{
                textAlign: "right",
                fontWeight: "bold",
                padding: "8px",
                border: "1px solid black",
              }}
            >
              Grand Total
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {totalQuantitys?.toLocaleString()}
            </td>
            <td></td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {totalAmounts?.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GRNInfoList;
