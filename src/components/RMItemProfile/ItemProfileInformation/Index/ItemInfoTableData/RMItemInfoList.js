/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-undef */
import React, { useState, useEffect, useMemo } from "react";
import { useGetAllCategoryInfoQuery } from "../../../../../redux/features/categoryInfo/categoryInfoApi";
import { useGetAllItemUnitQuery } from "../../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetCompanyInfoQuery } from "../../../../../redux/features/companyinfo/compayApi";
import ListHeading from "../../../../Common/ListHeading/ListHeading";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faDownload,
  faPenToSquare,
  faRefresh,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  useDeleteRMItemInfoMutation,
  useGetAllRMItemInformationQuery,
} from "../../../../../redux/features/iteminformation/rmItemInfoApi";
import { downloadPDF } from "../../../../ReportProperties/HeaderFooter";
import handleDownload from "../../../../ReportProperties/HandelExcelDownload";
import ActiveListDataModal from "../../../../Common/ListHeadingModal/ActiveListModal/ActiveListDataModal";
import handleCheckboxClick from "../../../../Common/ListHeadingModal/Function/handleCheckboxClick";
import FilterComponent from "../../../../Common/ListDataSearchBoxDesign/FilterComponent";
import "./RMItemInfoList.css"
const RMItemInfoList = ({ permission }) => {
  const { data: categoryInfoData } = useGetAllCategoryInfoQuery(undefined);
  const { data: itemUnitInfo } = useGetAllItemUnitQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const {
    data: rmItemInfoData,
    isRmItemLoading,
    refetch,
  } = useGetAllRMItemInformationQuery(undefined);
  const [filterText, setFilterText] = useState("");
  const [extractedDataForReport, setExtractedDataForReport] = useState([]);
  const [extractedAllData, setExtractedAllData] = useState([]);
  const [extractedInActiveDataForReport, setExtractedInActiveDataForReport] =
    useState([]);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [activeRawMeterialItemModal, setActiveRawMeterialItemModal] =
    useState(false);
  const [inActiveRawMeterialItemModal, setInActiveRawMeterialItemModal] =
    useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [deleteRMItemInfo] = useDeleteRMItemInfoMutation();
  const [rmItemActiveStatus, setItemActiveStaus] = useState([]);
  const [rmItemInActiveStatus, setItemInActiveStatus] = useState([]);
  var reportTitle = "All Raw Material Item List";

  useEffect(() => {
    const rmItemActiveStatus = rmItemInfoData?.filter(
      (item) => item.itemStatus == true
    );
    const rmItemInActiveStatus = rmItemInfoData?.filter(
      (item) => item.itemStatus == false
    );
    console.log(rmItemActiveStatus);
    console.log(rmItemInActiveStatus);
    const extractedFields = rmItemActiveStatus?.map((item) => {
      const category = categoryInfoData?.find((x) => x._id === item.categoryId);
      const unit = itemUnitInfo?.find((x) => x._id === item?.unitId);
      console.log(category);
      return {
        openingDate: item.openingDate,
        itemName: item.itemName,
        categoryId: category ? category.categoryInfo : "N/A",
        unitId: unit ? unit.unitInfo : "N/A",
        openingStock: item.openingStock,
        itemStatus:item.itemStatus
      };
    });
    const extractedFieldsForAllData = rmItemInfoData?.map((item) => {
      const category = categoryInfoData?.find((x) => x._id === item.categoryId);
      const unit = itemUnitInfo?.find((x) => x._id === item?.unitId);
      console.log(category);
      return {
        openingDate: item.openingDate,
        itemName: item.itemName,
        categoryId: category ? category.categoryInfo : "N/A",
        unitId: unit ? unit.unitInfo : "N/A",
        openingStock: item.openingStock,
        itemStatus:item.itemStatus
      };
    });

    const extractedInactiveFields = rmItemInActiveStatus?.map((item) => {
      const category = categoryInfoData?.find((x) => x._id === item.categoryId);
      const unit = itemUnitInfo?.find((x) => x._id === rmItemInfoData?.unitId);

      return {
        openingDate: item.openingDate,
        itemName: item.itemName,
        categoryId: category ? category.categoryInfo : "N/A",
        unitId: unit ? unit.unitInfo : "N/A",
        openingStock: item.openingStock,
        itemStatus:item.itemStatus
      };
    });
    setExtractedAllData(extractedFieldsForAllData)
    setItemActiveStaus(rmItemActiveStatus);
    setItemInActiveStatus(rmItemInActiveStatus);
    setExtractedDataForReport(extractedFields);
    setExtractedInActiveDataForReport(extractedInactiveFields);
  }, [itemUnitInfo, rmItemInfoData?.unitId, categoryInfoData, rmItemInfoData]);

  const generateColumns = (data, fields) => {
    if (data?.length === 0) return [];

    return fields.map((field) => {
      if (field === "categoryId") {
        return {
          name: "Category Name",
          selector: (rmItemInfoData) => {
            const category = categoryInfoData?.find(
              (x) => x._id === rmItemInfoData?.categoryId
            );
            return category ? category.categoryInfo : "N/A"; // Assuming 'categoryInfo' is the field that contains the category name
          },
          sortable: true,
          center: true,
          filterable: true,
        };
      } else if (field === "itemStatus") {
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
                  onChange={(e) => handleCheckboxClick(row, setSelectedData)} // Assuming handleCheckboxClick is defined elsewhere
                />
              </a>
            </div>
          ),
        };
      } else {
        return {
          name: field.charAt(0).toUpperCase() + field.slice(1), // Capitalize the first letter
          selector: (row) => row[field],
          sortable: true, // Optional: make columns sortable
          center: true,
        };
      }
    });
  };

  const columns = [
    {
      name: "Sl.",
      selector: (rmItemInfoData, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Opening Date",
      selector: (rmItemInfoData) => rmItemInfoData?.openingDate,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Item Name",
      selector: (rmItemInfoData) => rmItemInfoData?.itemName,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Category Name",
      selector: (rmItemInfoData) => {
        const category = categoryInfoData?.find(
          (x) => x._id === rmItemInfoData?.categoryId
        );
        console.log(category);
        return category ? category.categoryInfo : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Unit Name",
      selector: (rmItemInfoData) => {
        const unit = itemUnitInfo?.find(
          (x) => x._id === rmItemInfoData?.unitId
        );
        return unit ? unit.unitInfo : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Opening Stock",
      selector: (rmItemInfoData) => rmItemInfoData?.openingStock,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Status",
      button: true,
      width: "200px",
      grow: 2,
      cell: (rmItemInfoData) => (
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
            // href={`UpdateGroupName/${data?.GroupId}`}
          >
            {rmItemInfoData?.itemStatus == true ? <p className="text-success fw-bold">Active</p> : <p className="text-danger fw-bold">InActive</p>}
          </a>
        </div>
      ),
    },
    {
      name: "Action",
      button: true,
      width: "200px",
      grow: 2,
      cell: (rmItemInfoData) => (
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
                  rmItemInfoData?.items?.length == 0 ? "gray" : "#2DDC1B"
                } `,
                border: `${
                  rmItemInfoData?.items?.length == 0
                    ? "2px solid gray"
                    : "2px solid #2DDC1B"
                }`,
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                window.open(`update-items-raw-material/${rmItemInfoData?._id}`);
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
                    const response = await deleteRMItemInfo(
                      rmItemInfoData?._id
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

  const filteredItems = rmItemInfoData?.filter(
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
                      handleDownload(
                        extractedAllData,
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
    resetPaginationToggle,
    companyinfo,
    extractedAllData,
    reportTitle,
    refetch,
  ]);

  return (
    <div className="row px-5 mx-4">
      <ListHeading
        rmItemInfoData={rmItemInfoData}
        rmItemActiveStatus={rmItemActiveStatus}
        rmItemInActiveStatus={rmItemInActiveStatus}
        setActiveDataModal={setActiveRawMeterialItemModal}
        setInActiveDataModal={setInActiveRawMeterialItemModal}
      ></ListHeading>
      <div
        className="col userlist-table mt-4 rawdata-main-view "
        // style={{
        //   overflow: "scroll",
        //   height: "420px",
        // }}
      >
        <div className="shadow-lg ">
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
            <th>Sl.</th>
            <th>Opening Date</th>
            <th>RM Item Name</th>
            <th>Category Name</th>
            <th>Unit Info</th>
            <th>Opening Stock</th>
            <th>Status</th>

          </tr>
        </thead>
        <tbody>
          {extractedAllData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.openingDate}</td>
              <td>{item.itemName}</td>
              <td>{item.categoryId}</td>
              <td>{item.unitId}</td>
              <td>{item.openingStock == 0 ? '-' :  item.openingStock}</td>
              <td>{item.itemStatus ? 'Active' : 'InActive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table id="my-table2" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Opening Date</th>
            <th>RM Item Name</th>
            <th>Category Name</th>
            <th>Unit Info</th>
            <th>Opening Stock</th>
            <th>Status</th>

          </tr>
        </thead>
        <tbody>
          {extractedDataForReport?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.openingDate}</td>
              <td>{item.itemName}</td>
              <td>{item.categoryId}</td>
              <td>{item.unitId}</td>
              <td>{item.openingStock == 0 ? '-' :  item.openingStock}</td>
              <td>{item.itemStatus ? 'Active' : 'InActive'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table id="my-tableInactive" className="d-none">
        <thead>
        <tr>
            <th>Sl.</th>
            <th>Opening Date</th>
            <th>RM Item Name</th>
            <th>Category Name</th>
            <th>Unit Info</th>
            <th>Opening Stock</th>
          </tr>
        </thead>
        <tbody>
          {extractedInActiveDataForReport?.map((item, index) => (
           <tr key={index}>
           <td>{index + 1}</td>
           <td>{item.openingDate}</td>
           <td>{item.itemName}</td>
           <td>{item.categoryId}</td>
           <td>{item.unitId}</td>
           <td>{item.openingStock == 0 ? '-' :  item.openingStock}</td>
         </tr>
          ))}
        </tbody>
      </table>

      {activeRawMeterialItemModal ? (
        <ActiveListDataModal
          listData={rmItemActiveStatus}
          activeDataModal={activeRawMeterialItemModal}
          setActiveDataModal={setActiveRawMeterialItemModal}
          extractedData={extractedDataForReport}
          companyinfo={companyinfo}
          generateColumns={generateColumns}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        ></ActiveListDataModal>
      ) : (
        ""
      )}
      {inActiveRawMeterialItemModal ? (
        <ActiveListDataModal
          listData={rmItemInActiveStatus}
          inActiveDataModal={inActiveRawMeterialItemModal}
          setInActiveDataModal={setInActiveRawMeterialItemModal}
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

export default RMItemInfoList;
