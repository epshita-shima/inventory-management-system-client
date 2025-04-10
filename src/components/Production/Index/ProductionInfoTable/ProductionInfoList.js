/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import {
  useDeleteProductionInformationMutation,
  useGetAllProductionInformationQuery,
  useLazyGetFilteredProductionInfoQuery,
} from "../../../../redux/features/productioninformation/productionApi";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import swal from "sweetalert";
import {
  faDownload,
  faFilePdf,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";

import {
  downloadProductionPDF,
  downloadProductionPDFPERBatch,
} from "../../../ReportProperties/PDF/HeaderFooter";
import ProductionListHeading from "../../../Common/ListHeading/ProductionListHeading";
import handleProductionExcel from "../../../ReportProperties/Excel/handleProductionExcel";
import { useGetAllRMItemInformationQuery } from "../../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/finishgoodsinfoApi";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import '../../Common/ProductionDatePicker.css'
const ProductionInfoList = ({ permission }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const { data: productionInitialData, refetch } =
    useGetAllProductionInformationQuery(undefined);
  const { data: rawItemInfo } = useGetAllRMItemInformationQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: finishGoods } = useGetAllItemInformationQuery(undefined);
  const {data:itemSizeInfo}=useGetAllItemSizeQuery(undefined)
  const [deleteProductionInfo] = useDeleteProductionInformationMutation();
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [fromDate, setFromDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [toDate, setToDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [filteredData, setFilteredData] = useState([]);
  const [isFetchAfterDeleteData, setIsFetchAfterDeleteData] = useState(false);
  const reportTitle = "PRODUCTION REPORT";
  const [executeQuery, setExecuteQuery] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: fromDate,
    toDate: toDate,
  });
  const [perBatchProductionData, setPerBatchProductionData] = useState([]);
  const [lastOneMonthProduction, setLastOneMonthProduction] = useState([]);
  const [lastOneWeekData, setLastOneWeekData] = useState([]);
  const [yesterdayData, setYesterDayData] = useState([]);
  const [trigger, { data: filteredDatas }] =
    useLazyGetFilteredProductionInfoQuery();

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

      const filteredLastMonthData = productionInitialData?.filter((item) => {
        const itemDate = new Date(item.productionDate); // assuming `item.date` is in a format that can be parsed by Date
        return itemDate >= lastMonthDate && itemDate <= today;
      });
      const filteredOneWeekData = productionInitialData?.filter((item) => {
        const itemDate = new Date(item.productionDate); // assuming `item.date` is in a format that can be parsed by Date
        return itemDate >= lastWeekDate && itemDate <= today;
      });
      const filteredYesterdayData = productionInitialData?.filter((item) => {
        const itemDate = new Date(item.productionDate); // assuming `item.date` is in a format that can be parsed by Date

        return (
          itemDate.getDate() === yesterday.getDate() &&
          itemDate.getMonth() === yesterday.getMonth() &&
          itemDate.getFullYear() === yesterday.getFullYear()
        );
      });
      setLastOneMonthProduction(filteredLastMonthData);
      setLastOneWeekData(filteredOneWeekData);
      setYesterDayData(filteredYesterdayData);
    }
  }, [filteredDatas, productionInitialData]);

  useEffect(() => {
    if (isFetchAfterDeleteData) {

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
      name: "Production Date",
      selector: (filteredData) => filteredData?.productionDate,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Batch No",
      selector: (filteredData) => filteredData?.batchNo,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Batch",
      selector: (filteredData) => filteredData?.totalBatch,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Production Qty",
      selector: (filteredData) => filteredData?.productionQty,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Action",
      button: true,
      width: "120px",
      grow: 2,
      cell: (filteredData) => (
        <div className="d-flex justify-content-between align-content-center">
          {permission?.isPDF && (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Update item"
              style={{
                color: `${
                  filteredData?.detailsData?.length === 0 ? "gray" : "orange"
                } `,
                border: `${
                  filteredData?.detailsData?.length === 0
                    ? "2px solid gray"
                    : "2px solid orange"
                }`,
                padding: "3px",
                borderRadius: "5px",
              }}
              onClick={() => {
                setPerBatchProductionData(filteredData);
                downloadProductionPDFPERBatch(
                  filteredData,
                  finishGoods,
                  itemSizeInfo,
                  rawItemInfo,
                  { companyinfo },
                  reportTitle
                );
              }}
            >
              <FontAwesomeIcon icon={faFilePdf}></FontAwesomeIcon>
            </a>
          ) }
          {/* {permission?.isUpdated ? (
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
                window.open(`production-list/update-production-info/${filteredData?._id}`);
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
            </a>
          ) : (
            ""
          )} */}

          {permission?.isRemoved && (
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
                    const response = await deleteProductionInfo(
                      filteredData?._id
                    ).unwrap();
                    if (response.status === 200) {
                      swal("Deleted!", "Your selected item has been deleted!", {
                        icon: "success",
                      });
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
              }}
            >
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
            </a>
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
      <div className="d-block d-sm-flex justify-content-between align-items-center mb-2">
        <div className="d-flex justify-content-end align-items-center">
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
                        downloadProductionPDF(
                          { companyinfo },
                          reportTitle,
                          fromDate,
                          toDate
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
                      handleProductionExcel(
                        filteredData,
                        finishGoods,
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
    finishGoods,
    filteredData,
    resetPaginationToggle,
    fromDate,
    toDate,
    companyinfo,
    reportTitle,
  ]);

  return (
    <div className="row px-5 mx-4 ">
      <ProductionListHeading
        permission={permission}
        totalProduction={productionInitialData}
        lastOneMonthProduction={lastOneMonthProduction}
        lastOneWeekData={lastOneWeekData}
        yesterdayData={yesterdayData}
      ></ProductionListHeading>
      <div className="col userlist-table mt-4">
        <div>
          <div
            className="d-lg-flex justify-content-lg-between align-items-lg-center d-md-block"
            style={{ width: "55%" }}
          >
            <div className="ms-lg-4 margin-md">
              <label htmlFor="">From Date</label>
              <br />
              <DatePicker
                dateFormat="y-MM-dd"
                className="text-center custom-datepicker-production "
                calendarClassName="custom-calendar-production"
                selected={fromDate}
                required
                onChange={(fromDate) => {
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
                className="text-center custom-datepicker-production "
                calendarClassName="custom-calendar-production"
                selected={toDate}
                required
                onChange={(toDate) => {
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    toDate: toDate?.toLocaleDateString("en-CA"),
                  }));
                  setToDate(toDate?.toLocaleDateString("en-CA"));
                }}
              />
            </div>

            <div className="d-flex">
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
                    fromDate: new Date()?.toLocaleDateString("en-CA"),
                    toDate: new Date()?.toLocaleDateString("en-CA"),
                  }));

                  setIsTableDisplay(false);
                }}
              >
                Clear
              </button>
            </div>
            <div>
             
            </div>
          </div>
          <div></div>
        </div>

        {isTableDispaly ? (
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
        ) : null}
      </div>

      <table id="table-total-production" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Production Date</th>
            <th>Batch No</th>
            <th>Total Batch</th>
            <th>Production Qty</th>
          </tr>
        </thead>
        <tbody>
          {" "}
          {productionInitialData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.productionDate}</td>
              <td>{item.batchNo}</td>
              <td>{item.totalBatch}</td>
              <td>{item.productionQty}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table id="production-table" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Production Date</th>
            <th>Batch No</th>
            <th>Total Batch</th>
            <th>Production Qty</th>
          </tr>
        </thead>
        <tbody>
          {" "}
          {filteredData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.productionDate}</td>
              <td>{item.batchNo}</td>
              <td>{item.totalBatch}</td>
              <td>{item.productionQty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table id="production-table-single" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Production Date</th>
            <th>Batch No</th>
            <th>Total Batch</th>
            <th>Production Qty</th>
          </tr>
        </thead>
        <tbody>
        
          <tr>
            <td>{perBatchProductionData?.productionDate}</td>
            <td>{perBatchProductionData?.batchNo}</td>
            <td>{perBatchProductionData?.totalBatch}</td>
            <td>{perBatchProductionData?.productionQty}</td>
          </tr>
    
        </tbody>
      </table>
    </div>
  );
};

export default ProductionInfoList;
