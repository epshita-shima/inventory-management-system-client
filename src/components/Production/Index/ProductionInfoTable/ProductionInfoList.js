/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import {
  useDeleteProductionInformationMutation,
  useGetAllProductionInformationQuery,
  useLazyGetFilteredProductionInfoQuery,
} from "../../../../redux/features/productioninformation/productionApi";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import makeAnimated from "react-select/animated";
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
import { downloadGRNPDF } from "../../../ReportProperties/handleGRNReport";
import handleGRNDownload from "../../../ReportProperties/handleGRNExcel";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import ListHeading from "../../../Common/ListHeading/ListHeading";
import { downloadProductionPDF } from "../../../ReportProperties/HeaderFooter";

const ProductionInfoList = ({ permission }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const { refetch } = useGetAllProductionInformationQuery(undefined);

  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);

  const [deleteProductionInfo] = useDeleteProductionInformationMutation();
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [fromDate, setFromDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [toDate, setToDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [filteredData, setFilteredData] = useState([]);
  const [isFetchAfterDeleteData, setIsFetchAfterDeleteData] = useState(false);
  const reportTitle = "Production REPORT";
  const [executeQuery, setExecuteQuery] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });
  console.log(filters);
  const [trigger, { data: filteredDatas, error, isFetching }] =
    useLazyGetFilteredProductionInfoQuery();

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      trigger(filters); // Trigger the query
      setExecuteQuery(false); // Reset executeQuery after triggering the query
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
                window.open(`update-production-info/${filteredData?._id}`);
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
                        downloadProductionPDF(
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
                      handleGRNDownload(filteredData, companyinfo, reportTitle);
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
    resetPaginationToggle,
    companyinfo,
    reportTitle,
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="row px-5 mx-4 ">
      <ListHeading
        // purchaseInCash={purchaseInCash}
        // purchaseInLCAtSight={purchaseInLCAtSight}
        // purchaseOrderApproveData={purchaseOrderApproveData}
        // purchaseOrderUnApproveData={purchaseOrderUnApproveData}
        // purchaseInfoData={purchaseInfoData}
        // purchaseOrderList={purchaseOrderList}
        // setPurchaseOrderList={setPurchaseOrderList}
      ></ListHeading>
      <div className="col userlist-table mt-4">
        <div>
          {/* <h3 className="fw-bold mt-1">Goods Receive Note (GRN) List</h3>
          <hr /> */}
          <div className="d-lg-flex justify-content-lg-between align-items-lg-center w-75 d-md-block">
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
            </div>
            <div>
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
                    fromDate: "",
                    toDate: "",
                    selectMonth: [],
                  }));

                  setIsTableDisplay(false);
                }}
              >
                Clear
              </button>
            </div>
            <div className="width-lg-16 margin-md">
              <button
                style={{
                  backgroundColor: "white",
                  border: "1px solid #2DDC1B",
                  color: "#2DDC1B",
                  fontWeight: "900",
                  padding: "5px 10px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  width: "150px",
                  height: "38px",
                  marginTop: "25px",
                }}
              >
                Summary
              </button>
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

      <table id="production-table" className="d-none">
        <thead>
          <tr>
            <th>Production Date</th>
            <th>Batch No</th>
            <th>Total Batch</th>
            <th>Receipe Qty Ratio</th>
            <th>Production Item Name</th>
            <th>Production Qty</th>
            <th>Production Start Date</th>
            <th>Production End Date</th>
            <th>Total Hour</th>
            <th>Wastage Qty</th>
            <th>Expected ProductionQty(Per Batch)</th>
            <th>Expected Production Qty</th>
            <th>ExcessOrLess Production Qty</th>
            <th>Item Name</th>
            <th>Receipe</th>
            <th>Material Used</th>
            <th>As Per Ratio</th>
            <th>Excess</th>
            <th>Less</th>
          </tr>
        </thead>
        <tbody> {filteredData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.productionDate}</td>
              <td>{item.batchNo}</td>
              <td>{item.totalBatch}</td>
              <td>{item.receipeQtyRatio}</td>
              <td>{item.productionItemName}</td>
              <td>{item.itemStatus}</td>
            </tr>
          ))}
          </tbody>
      </table>
    </div>
  );
};

export default ProductionInfoList;
