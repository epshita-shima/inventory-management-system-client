/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import { useGetAllInvoiceInformationQuery, useLazyGetFilteredInvoiceInfoQuery } from "../../../../redux/features/invoiceinformation/invoiceinfoApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFilePdf,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import { clientInfoDropdown } from "../../../Common/CommonDropdown/CommonDropdown";
import swal from "sweetalert";

const SpecialDeliveryTableList = ({ permission, companyinfo }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const {data:clientInformation}=useGetAllClientInformationQuery(undefined)
  const [filteredPi,setFilteredPi]=useState([])
  const [filters, setFilters] = useState({
    customerID:'6688d7dd39abfa49f8311347'
  });
  console.log(filters)
  const [trigger, { data: filteredDatas, error, isFetching }] =
    useLazyGetFilteredInvoiceInfoQuery();
console.log(filteredDatas)
  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      // Ensure filters are correctly formatted for your API
      trigger(filters)
        .unwrap() // If you're using Redux Toolkit Query
        .then(response => {
          console.log('Data fetched:', response);
        })
        .catch(err => {
          console.error('Error fetching data:', err);
        })
        .finally(() => {
          setExecuteQuery(false); // Reset the query state
        });
    }
  }, [executeQuery, trigger, filters]);

  const handleApplyFilters = () => {
    setExecuteQuery(true); // Trigger the useEffect to fetch data
  };

  const clientInfoOptions= clientInfoDropdown(clientInformation)
  
  const columns = [
    {
      name: "Sl.",
      selector: (filteredPi, index) => index + 1,
      center: true,
      width: "50px",
    },
    {
      name: "Production Date",
      selector: (filteredPi) => filteredPi?.productionDate,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Batch No",
      selector: (filteredPi) => filteredPi?.batchNo,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Batch",
      selector: (filteredPi) => filteredPi?.totalBatch,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Production Qty",
      selector: (filteredPi) => filteredPi?.productionQty,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Action",
      button: true,
      width: "120px",
      grow: 2,
      cell: (filteredPi) => (
        <div className="d-flex justify-content-between align-content-center">
          {permission?.isPDF ? (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Update item"
              style={{
                color: `${
                    filteredPi?.detailsData?.length == 0 ? "gray" : "orange"
                } `,
                border: `${
                    filteredPi?.detailsData?.length == 0
                    ? "2px solid gray"
                    : "2px solid orange"
                }`,
                padding: "3px",
                borderRadius: "5px",
              }}
              onClick={() => {
                // downloadProductionPDFPERBatch(
                //   filteredData,
                //   finishGoods,
                //   rawItemInfo,
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
          {permission?.isUpdated ? (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Update item"
              style={{
                color: `${
                    filteredPi?.items?.length === 0 ? "gray" : "#2DDC1B"
                } `,
                border: `${
                    filteredPi?.items?.length === 0
                    ? "2px solid gray"
                    : "2px solid #2DDC1B"
                }`,
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                window.open(`update-production-info/${filteredPi?._id}`);
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
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

//   const filteredItems = filteredPi?.filter(
//     (item) =>
//       JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
//       -1
//   );

//   const subHeaderComponent = useMemo(() => {
//     const handleClear = () => {
//       if (filterText) {
//         setResetPaginationToggle(!resetPaginationToggle);
//         setFilterText("");
//       }
//     };

//     return (
//       <div className="d-block d-sm-flex justify-content-between align-items-center">
//         <div className="d-flex justify-content-end align-items-center">
//           <div className="table-head-icon d-flex">
//             <div class="dropdown">
//               <button
//                 class="btn btn-download dropdown-toggle"
//                 type="button"
//                 id="dropdownMenuButton1"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
//               </button>
//               <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
//                 <li>
//                   <a
//                     class="dropdown-item"
//                     href="#"
//                     onClick={() => {
//                       console.log( companyinfo);
//                       if (companyinfo?.length !== 0 || undefined) {
//                         // downloadProductionPDF(
//                         //   { companyinfo },
//                         //   reportTitle,
//                         //   fromDate,
//                         //   toDate
//                         // );
//                       }
//                     }}
//                   >
//                     PDF
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     class="dropdown-item"
//                     href="#"
//                     onClick={() => {
//                       //   handleProductionExcel(
//                       //     filteredData,
//                       //     finishGoods,
//                       //     companyinfo,
//                       //     reportTitle
//                       //   );
//                     }}
//                   >
//                     Excel
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="mt-2 mt-sm-0 ms-2 mb-2 mb-sm-0">
//           <FilterComponent
//             onFilter={(e) => setFilterText(e.target.value)}
//             onClear={handleClear}
//             filterText={filterText}
//           />
//         </div>
//       </div>
//     );
//   }, [filterText,  resetPaginationToggle, companyinfo]);

  return (
    <div className="row px-5 mx-4 ">
      <div className="col userlist-table ">
        <div>
          <h3 className="fw-bold mt-1">Special Approve For Delivery</h3>
              <hr />
          <div
            className="d-lg-flex justify-content-lg-between align-items-lg-center d-md-block"
            style={{ width: "50%" }}
          >
            <div className="w-50">
                <label htmlFor="">Client Name</label>
              <div >
                <Select
                  class="form-select"
                  className="w-100 mb-3"
                  aria-label="Default select example"
                  name="itemName"
                  options={clientInfoOptions}
                  defaultValue={{
                    label: "Select Item Name",
                    value: 0,
                  }}
                  value={clientInfoOptions.filter(function (option) {
                    return option.value === filters.customerID;
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
                      // zIndex: 9999,
                      // height: "200px",
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
                        customerID: e.value,
                      }));
                  }}
                ></Select>
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
                  marginTop: "15px",
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
                  marginTop: "15px",
                }}
                onClick={() => {
                  setFilters((prevFilters) => ({
                    customerID:''
                  }));

                  setIsTableDisplay(false);
                }}
              >
                Clear
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
            {/* <DataTable
              columns={columns}
              data={filteredItems}
              defaultSortField="name"
              customStyles={customStyles}
              striped
              pagination
              subHeader
              subHeaderComponent={subHeaderComponent}
            /> */}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SpecialDeliveryTableList;
