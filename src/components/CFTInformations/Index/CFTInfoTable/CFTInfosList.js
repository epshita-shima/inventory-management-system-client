/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import handleCheckboxClick from "../../../Common/ListHeadingModal/Function/handleCheckboxClick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faPenToSquare,
  faRefresh,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import DataTable from "react-data-table-component";
import {
  downloadAllImage,
  downloadImage,
  downloadPDF,
} from "../../../ReportProperties/PDF/HeaderFooter";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import ListHeading from "../../../Common/ListHeading/ListHeading";
import ActiveListDataModal from "../../../Common/ListHeadingModal/ActiveListModal/ActiveListDataModal";
import { useDeleteCFTInfoMutation } from "../../../../redux/features/cftinformation/cftInfosApi";
import "../../Insert/InsertCFTInfo.css";
import { useGetAllRMItemInformationQuery } from "../../../../redux/features/iteminformation/rmItemInfoApi";
import handleCFTExcel from "../../../ReportProperties/Excel/handleCFTExcel";

const CFTInfosList = ({ permission, cftInfosData, refetch }) => {
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  console.log(cftInfosData);
  const [filterText, setFilterText] = useState("");
  const [extractedAllDataReport, setExtractedAllDataReport] = useState([]);
  const [extractedDataForReport, setExtractedDataForReport] = useState([]);
  const [extractedInActiveDataForReport, setExtractedInActiveDataForReport] =
    useState([]);
  const [activeImageForReport, setActiveImageForReport] = useState([]);
  const [inActiveImageForReport, setInActiveImageForReport] = useState([]);
  const [allImageForReport, setAllImageForReport] = useState([]);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [activeCFTInfosModal, setActiveCFTInfosModal] = useState(false);
  const [inActiveCFTInfosModal, setInActiveCFTInfosModal] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [deleteCFTInfoData] = useDeleteCFTInfoMutation();
  const { data: rawItemInfo } = useGetAllRMItemInformationQuery(undefined);
  const [cftInfoActiveStatus, setCFTInfoActiveStaus] = useState([]);
  const [cftInfoInActiveStatus, setCFTInfoInActiveStatus] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  var reportTitle = "CFT TO KG Converter";
  var reportTitleActiveImage = "All CFT All Active Image";
  var reportTitleInActiveImage = "All CFT All InActive Image";
  var reportTitleForAllImage = "All CFT All Image";

  useEffect(() => {
    const cftInfoActiveStatus = cftInfosData?.filter(
      (item) => item.isActive == true
    );
    const cftInfoInActiveStatus = cftInfosData?.filter(
      (item) => item.isActive == false
    );
    const cftInfoActiveStatusImage = cftInfosData?.filter(
      (item) => item.isActive == true && item.image != undefined
    );
    const cftInfoInActiveStatusWithImage = cftInfosData?.filter(
      (item) => item.isActive == false && item.image != undefined
    );
    const cftInfoAllStatusWithImage = cftInfosData?.filter(
      (item) => item.image != undefined
    );

    const extractedAllFields = cftInfosData?.map((item) => {
      return {
        openingDate: item.openingDate,
        closingDate: item.closingDate ? item.closingDate : "N/A",
        cftPerKg: item.detailsData.map((items) => {
          return items.cftPerKg;
        }),
        isActive: item.isActive ? "Active" : "InActive",
      };
    });
    const extractedActiveImageFields = cftInfoActiveStatusImage?.map((item) => {
      return {
        image: item?.image,
        makeDate: item.makeDate,
      };
    });
    const extractedInActiveImageFields = cftInfoInActiveStatusWithImage?.map(
      (item) => {
        return {
          image: item?.image,
          makeDate: item.makeDate,
        };
      }
    );
    const extractedAllImageFields = cftInfoAllStatusWithImage?.map((item) => {
      return {
        image: item?.image,
        makeDate: item.makeDate,
        status: item.isActive ? "Active" : "InActive",
      };
    });

    const extractedFields = cftInfoActiveStatus?.map((item) => {
      return {
        openingDate: item.openingDate,
        cftPerKg: item.cftPerKg,
        isActive: item.isActive ? "Active" : "InActive",
      };
    });

    const extractedInactiveFields = cftInfoInActiveStatus?.map((item) => {
      return {
        openingDate: item.openingDate,
        cftPerKg: item.cftPerKg,
        isActive: item.isActive ? "Active" : "InActive",
      };
    });
    setExtractedAllDataReport(extractedAllFields);
    setCFTInfoActiveStaus(cftInfoActiveStatus);
    setCFTInfoInActiveStatus(cftInfoInActiveStatus);
    setExtractedDataForReport(cftInfoActiveStatus);
    setExtractedInActiveDataForReport(cftInfoInActiveStatus);
    setActiveImageForReport(extractedActiveImageFields);
    setInActiveImageForReport(extractedInActiveImageFields);
    setAllImageForReport(extractedAllImageFields);
  }, [cftInfosData?.unitId, cftInfosData]);

  useEffect(() => {
    setFilteredData(cftInfosData || []); // Ensure filteredDatas is not null/undefined
  }, [cftInfosData]);

  const generateColumns = (data, fields) => {
    if (data?.length === 0) return [];

    return fields.map((field) => {
      if (field === "isActive") {
        return {
          name: "Status",
          button: true,
          width: "200px",
          grow: 2,
          cell: (row) => (
            <div className="d-flex justify-content-between align-content-center">
              <a
                target="_blank"
                className="action-icon"
                style={{
                  textDecoration: "none",
                  color: "#000",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                <input
                  type="checkbox"
                  aria-label={`Checkbox for data item ${row.id}`}
                  checked={row.status} // Assuming status is a boolean field
                  onChange={(e) => {
                    const existing = cftInfosData?.filter(
                      (x) => x.isActive === true
                    );
                    console.log(existing.length, existing.length > 1);
                    if (inActiveCFTInfosModal) {
                      if (existing.length > 0 || selectedData.length > 0) {
                        swal(
                          "Not Possible!",
                          "There is an active CFT, please close it first",
                          "warning"
                        );
                        e.preventDefault();
                        return;
                      } else {
                        handleCheckboxClick(row, setSelectedData);
                      }
                    } else {
                      handleCheckboxClick(row, setSelectedData);
                    }
                  }}
                />
              </a>
            </div>
          ),
        };
      } else if (field === "cftPerKg") {
        return {
          name: "CFT Per Kg",
          button: true,
          width: "250px",
          selector: (cftInfosData) => {
            const totalItems = cftInfosData.detailsData;
            return totalItems.length == 0 ? "N/A" : totalItems.length;
          },
        };
      } else {
        return {
          name: field.charAt(0).toUpperCase() + field.slice(1), // Capitalize the first letter
          selector: (row) => row[field],
          sortable: true,
          center: true,
        };
      }
    });
  };

  const columns = [
    {
      name: "Sl.",
      selector: (cftInfosData, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Opening Date",
      selector: (cftInfosData) => cftInfosData?.openingDate,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Number OF Items",
      selector: (cftInfosData) => {
        const totalItems = cftInfosData.detailsData;
        return totalItems.length == 0 ? "N/A" : totalItems.length;
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    // {
    //   name: "Status",
    //   button: true,
    //   width: "200px",
    //   grow: 2,
    //   cell: (cftInfosData) => (
    //     <div style={{ textAlign: "center" }} onClick={()=>{
    //  if(cftInfosData?.image){
    //   window.open(`${process.env.REACT_APP_BASE_URL}/${cftInfosData?.image}`);
    //  }

    //     }}>
    //       {cftInfosData?.image ?'File uploaded' : 'No file upload'
    //       }
    //     </div>
    //   ),
    // },
    {
      name: "Status",
      button: true,
      width: "200px",
      grow: 2,
      cell: (cftInfosData) => (
        <div className="d-flex justify-content-between align-content-center">
          <a
            target="_blank"
            className="action-icon"
            style={{
              textDecoration: "none",
              color: "#000",
              fontSize: "14px",
              textAlign: "center",
            }}
            //   href={`update-cft-info/${cftInfosData._id}`}
          >
            {cftInfosData?.isActive == true ? (
              <p className="text-success fw-bold">Active</p>
            ) : (
              <p className="text-danger fw-bold">InActive</p>
            )}
          </a>
        </div>
      ),
    },
    {
      name: "Action",
      button: true,
      width: "200px",
      grow: 2,
      cell: (cftInfosData) => (
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
                  cftInfosData?.items?.length == 0 ? "gray" : "#2DDC1B"
                } `,
                border: `${
                  cftInfosData?.items?.length == 0
                    ? "2px solid gray"
                    : "2px solid #2DDC1B"
                }`,
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                if (cftInfoActiveStatus.length > 0) {
                  if (cftInfoActiveStatus[0]?._id == cftInfosData?._id) {
                    window.open(`update-cft-info/${cftInfosData?._id}`);
                  } else {
                    swal(
                      "Not Possible!",
                      "There is an active CFT,Plase Close it first",
                      "warning"
                    );
                  }
                } else {
                  window.open(`update-cft-info/${cftInfosData?._id}`);
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
                swal({
                  title: "Are you sure to delete this item?",
                  text: "If once deleted, this item will not recovery.",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then(async (willDelete) => {
                  if (willDelete) {
                    const response = await deleteCFTInfoData(
                      cftInfosData?._id
                    ).unwrap();
                    console.log(response);
                    if (response.status === 200) {
                      swal("Deleted!", "Your selected item has been deleted!", {
                        icon: "success",
                      });
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

  const filteredItems = cftInfosData?.filter(
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
      <div className="d-block d-sm-flex justify-content-center align-items-center ">
        <div className="d-flex justify-content-end align-items-center">
          <div className="table-head-icon d-flex ">
            <div>
              <FontAwesomeIcon
                icon={faRefresh}
                onClick={() => refetch()}
              ></FontAwesomeIcon>{" "}
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
                        downloadPDF({ companyinfo }, reportTitle);
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
                      handleCFTExcel(
                        cftInfosData,
                        rawItemInfo,
                        companyinfo,
                        reportTitle
                      );
                    }}
                  >
                    Excel
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() => {
                      if (companyinfo?.length !== 0 || undefined) {
                        downloadImage(
                          activeImageForReport,
                          { companyinfo },
                          reportTitleActiveImage
                        );
                      }
                    }}
                  >
                    Active Image
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() => {
                      if (companyinfo?.length !== 0 || undefined) {
                        downloadImage(
                          inActiveImageForReport,
                          { companyinfo },
                          reportTitleInActiveImage
                        );
                      }
                    }}
                  >
                    Inactive Image
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() => {
                      if (companyinfo?.length !== 0 || undefined) {
                        downloadAllImage(
                          allImageForReport,
                          { companyinfo },
                          reportTitleForAllImage
                        );
                      }
                    }}
                  >
                    All Image
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
    resetPaginationToggle,
    refetch,
    companyinfo,
    reportTitle,
    activeImageForReport,
    reportTitleActiveImage,
    inActiveImageForReport,
    reportTitleInActiveImage,
    allImageForReport,
    reportTitleForAllImage,
    cftInfosData,
    rawItemInfo,
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString("en-US", options);
  };
  return (
    <div className="row px-5 mx-4">
      <ListHeading
        cftInfosData={cftInfosData}
        cftInfoActiveStatus={cftInfoActiveStatus}
        cftInfoInActiveStatus={cftInfoInActiveStatus}
        setActiveDataModal={setActiveCFTInfosModal}
        setInActiveDataModal={setInActiveCFTInfosModal}
      ></ListHeading>
      <div
        className="col userlist-table mt-4 cftdata-main-view"
        // style={{ height: 'calc(80vh - 120px)', overflowY: 'scroll' }}
      >
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
      <table id="my-table" className="d-none">
        <thead>
          <tr>
            <th>Opening Date</th>
            <th>Closing Date</th>
            <th>Item Name</th>
            <th>CFT Per KG</th>
          </tr>
        </thead>
        <tbody>
          {cftInfosData?.map((items, key) => {
            console.log(key, items);
            const group = items?.detailsData;
            const formattedOpeningDate = formatDate(items?.openingDate);
            const formattedClosingDate = formatDate(items?.closingDate);
            console.log(formattedClosingDate);
            const rowSpan = group?.length;

            return (
              <>
                {group?.map((row, rowIndex) => {
                  console.log(row);
                  const itemNames = rawItemInfo
                    ?.filter((item) => row?.itemId === item._id)
                    .map((filteredItem) => filteredItem.itemName)
                    .join(", ");
                  const quantity = row.cftPerKg;

                  return (
                    <tr key={row._id}>
                      {rowIndex === 0 && (
                        <>
                          <td
                            rowSpan={rowSpan}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {formattedOpeningDate}
                          </td>
                          <td
                            rowSpan={rowSpan}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {formattedClosingDate}
                          </td>
                        </>
                      )}
                      <td>{itemNames}</td>
                      <td>{quantity}</td>
                    </tr>
                  );
                })}
              </>
            );
          })}
        </tbody>
      </table>
      <table id="my-table2" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Opening Date</th>
            <th>Closing Date</th>
            <th>Item Name</th>
            <th>CFT Per KG</th>
          </tr>
        </thead>
        <tbody>
          {extractedDataForReport?.map((items, index) => {
            const group = items?.detailsData;
            const formattedOpeningDate = formatDate(items?.openingDate);
            const formattedClosingDate = formatDate(items?.closingDate);
            console.log(formattedClosingDate);
            const rowSpan = group?.length;

            return (
              <>
                {group?.map((row, rowIndex) => {
                  console.log(row);
                  const itemNames = rawItemInfo
                    ?.filter((item) => row?.itemId === item._id)
                    .map((filteredItem) => filteredItem.itemName)
                    .join(", ");
                  const quantity = row.cftPerKg;

                  return (
                    <tr key={row._id}>
                      {rowIndex === 0 && (
                        <>
                          <td
                            rowSpan={rowSpan}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {formattedOpeningDate}
                          </td>
                          <td
                            rowSpan={rowSpan}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {formattedClosingDate}
                          </td>
                        </>
                      )}
                      <td>{itemNames}</td>
                      <td>{quantity}</td>
                    </tr>
                  );
                })}
              </>
            );
          })}
        </tbody>
      </table>

      <table id="my-tableInactive" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Opening Date</th>
            <th>Closing Date</th>
            <th>Item Name</th>
            <th>CFT Per KG</th>
          </tr>
        </thead>
        <tbody>
          {extractedInActiveDataForReport?.map((items, index) => {
            const group = items?.detailsData;
            const formattedOpeningDate = formatDate(items?.openingDate);
            const formattedClosingDate = formatDate(items?.closingDate);
            console.log(formattedClosingDate);
            const rowSpan = group?.length;

            return (
              <>
                {group?.map((row, rowIndex) => {
                  console.log(row);
                  const itemNames = rawItemInfo
                    ?.filter((item) => row?.itemId === item._id)
                    .map((filteredItem) => filteredItem.itemName)
                    .join(", ");
                  const quantity = row.cftPerKg;

                  return (
                    <tr key={row._id}>
                      {rowIndex === 0 && (
                        <>
                          <td
                            rowSpan={rowSpan}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {formattedOpeningDate}
                          </td>
                          <td
                            rowSpan={rowSpan}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {formattedClosingDate}
                          </td>
                        </>
                      )}
                      <td>{itemNames}</td>
                      <td>{quantity}</td>
                    </tr>
                  );
                })}
              </>
            );
          })}
        </tbody>
      </table>
      <table id="my-table-active-image" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>MakeDate</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {activeImageForReport?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.makeDate}</td>
              <img
                src={`${process.env.REACT_APP_BASE_URL}/${item.image}`}
                alt="Image description"
              />
            </tr>
          ))}
        </tbody>
      </table>
      {activeCFTInfosModal ? (
        <ActiveListDataModal
          listData={cftInfoActiveStatus}
          activeDataModal={activeCFTInfosModal}
          setActiveDataModal={setActiveCFTInfosModal}
          extractedData={extractedDataForReport}
          companyinfo={companyinfo}
          generateColumns={generateColumns}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        ></ActiveListDataModal>
      ) : (
        ""
      )}
      {inActiveCFTInfosModal ? (
        <ActiveListDataModal
          listData={cftInfoInActiveStatus}
          inActiveDataModal={inActiveCFTInfosModal}
          setInActiveDataModal={setInActiveCFTInfosModal}
          companyinfo={companyinfo}
          extractedInActiveData={extractedInActiveDataForReport}
          generateColumns={generateColumns}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        ></ActiveListDataModal>
      ) : (
        ""
      )}
    </div>
  );
};

export default CFTInfosList;
