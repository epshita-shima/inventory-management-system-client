/* eslint-disable jsx-a11y/anchor-is-valid */
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import swal from "sweetalert";
import DataTable from "react-data-table-component";
import {
  downloadAllPDF,
  downloadInactivePDF,
  downloadPDF,
} from "../../../ReportProperties/HeaderFooter";
import handleDownload from "../../../ReportProperties/HandelExcelDownload";
import { useUpdateMultipleUserStatusMutation } from "../../../../redux/features/user/userApi";
import MenuIdCollection from "../../MenuIdCollection/MenuIdCollection";
import { useUpdateRawMaterialStatusMutation } from "../../../../redux/features/iteminformation/rmItemInfoApi";
import { useUpdateCFTInfoStatusMutation } from "../../../../redux/features/cftinformation/cftInfosApi";
import { useUpdateFinishGoodStatusMutation } from "../../../../redux/features/iteminformation/iteminfoApi";
import { useUpdateSupplierInfoStatusMutation } from "../../../../redux/features/supplierInformation/supplierInfoApi";
import { useUpdateClientInfoStatusMutation } from "../../../../redux/features/clientinformation/clientInfoApi";
import FilterComponent from "../../ListDataSearchBoxDesign/FilterComponent";

const ActiveListDataModal = ({
  listData,
  activeDataModal,
  inActiveDataModal,
  setInActiveDataModal,
  setActiveDataModal,
  extractedData,
  companyinfo,
  extractedInActiveData,
  generateColumns,
  selectedData,
  setSelectedData,
}) => {
  const [updateStatusForUserData, { isLoading, isError }] =
    useUpdateMultipleUserStatusMutation();
  const [updateStatusForRawMeterial] = useUpdateRawMaterialStatusMutation();
  const [updateStatusForFinishGood] = useUpdateFinishGoodStatusMutation();
  const [updateCFTInfoStatus] = useUpdateCFTInfoStatusMutation();
  const [updateSupplierInfoStatus]=useUpdateSupplierInfoStatusMutation();
  const [updateClientInfoStatus]=useUpdateClientInfoStatusMutation();
  const currentUrl = window.location.href;
  const pathname = new URL(currentUrl).pathname;
  const wordsURL = pathname.split("/");
  const repStr = wordsURL[2].replaceAll("-", " ");
  const pathNameConvertCapitalize=repStr.charAt(0).toUpperCase() + repStr.slice(1)
  const activeReportTitle = `All Active ${pathNameConvertCapitalize}`;
  const inActiveReportTitle = `All Inactive ${pathNameConvertCapitalize}`;
 
  const getUserFromLocal = localStorage.getItem("user");
  const getUserFromLocalConvert = JSON.parse(getUserFromLocal);
  const getMenuListFromLOcalUser = getUserFromLocalConvert[0]?.menulist;
  // const [columns,setColumns]=useState([])

console.log(selectedData)

  const traverse = (items) => {
    const urls = [];
    items.forEach((item) => {
      if (item.url && item.url !== "#") {
        urls.push({
          menuId: item._id,
          headerLabelName: item.label,
          url: item.url,
        });
      }
      if (item.items && item.items.length > 0) {
        // Concatenate the arrays returned by recursive calls
        urls.push(...traverse(item.items));
      }
    });
    return urls; // Return the complete urls array after all iterations are done
  };

  const mainData = traverse(getMenuListFromLOcalUser);
  console.log(mainData);

  var columns;
  const searchItem = mainData?.filter((x) => x.url == pathname);
  if (searchItem[0]?.menuId == MenuIdCollection.userSeting) {
    const fieldsToDisplay = ["firstname", "mobileNo", "isactive"];
    columns = generateColumns(listData, fieldsToDisplay);
  } else if (searchItem[0]?.menuId == MenuIdCollection.rmItemList) {
    const fieldsToDisplay = ["itemName", "categoryId", "itemStatus"];
    columns = generateColumns(listData, fieldsToDisplay);
  } else if (searchItem[0]?.menuId == MenuIdCollection.fgItemList) {
    const fieldsToDisplay = ["itemName", "sizeId", "itemStatus"];
    columns = generateColumns(listData, fieldsToDisplay);
  } else if (searchItem[0]?.menuId == MenuIdCollection.cftinfolist) {
    const fieldsToDisplay = ["openingDate", "cftPerKg", "isActive"];
    columns = generateColumns(listData, fieldsToDisplay);
  } else if (searchItem[0]?.menuId == MenuIdCollection.supplierinfolist) {
    const fieldsToDisplay = ["supplierName", "mobileNo", "isActive"];
    columns = generateColumns(listData, fieldsToDisplay);
  }
   else if (searchItem[0]?.menuId == MenuIdCollection.clientinfolistId) {
    const fieldsToDisplay = ["clientName", "mobileNo", "isActive"];
    columns = generateColumns(listData, fieldsToDisplay);
  }

  const handleUpdate = async () => {
    try {
      // Update the isactive field to true for all selected data items

      if (
        activeDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.userSeting
      ) {
        const updatedData = selectedData.map((item) => ({
          ...item,
          isactive: false,
        }));

        const response = await updateStatusForUserData(updatedData);
        console.log(response);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      } else if (
        activeDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.rmItemList
      ) {
        const updateRawMeterial = selectedData.map((item) => ({
          ...item,
          itemStatus: false,
        }));
        const response = await updateStatusForRawMeterial(updateRawMeterial);
        console.log(response.data.status);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      } else if (
        activeDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.fgItemList
      ) {
        const updateFinishGood = selectedData.map((item) => ({
          ...item,
          itemStatus: false,
        }));
        const response = await updateStatusForFinishGood(updateFinishGood);
        console.log(response.data.status);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      } else if (
        activeDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.cftinfolist
      ) {
        const updateCftInfo = selectedData.map((item) => ({
          ...item,
          isActive: false,
        }));
        const response = await updateCFTInfoStatus(updateCftInfo);
        console.log(response.data.status);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      }
      else if (
        activeDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.supplierinfolist
      ) {
        const updateSupplierInfo = selectedData.map((item) => ({
          ...item,
          isActive: false,
        }));
        const response = await updateSupplierInfoStatus(updateSupplierInfo);
        console.log(response.data.status);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      }
      else if (
        activeDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.clientinfolistId
      ) {
        const updateClientInfo = selectedData.map((item) => ({
          ...item,
          isActive: false,
        }));
        const response = await updateClientInfoStatus(updateClientInfo);
        console.log(response.data.status);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      }
      if (
        inActiveDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.userSeting
      ) {
        const updatedData = selectedData.map((item) => ({
          ...item,
          isactive: true,
        }));
        const response = await updateStatusForUserData(updatedData);
        console.log(response);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      } else if (
        inActiveDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.rmItemList
      ) {
        const updateRawMeterial = selectedData.map((item) => ({
          ...item,
          itemStatus: true,
        }));
        console.log(updateRawMeterial);
        const response = await updateStatusForRawMeterial(updateRawMeterial);
        console.log(response);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      } else if (
        inActiveDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.fgItemList
      ) {
        const updateFinishGood = selectedData.map((item) => ({
          ...item,
          itemStatus: true,
        }));
        const response = await updateStatusForFinishGood(updateFinishGood);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      } else if (
        inActiveDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.cftinfolist
      ) {
        const updateCFTInfo = selectedData.map((item) => ({
          ...item,
          isActive: true,
        }));
        console.log(updateCFTInfo);
        const response = await updateCFTInfoStatus(updateCFTInfo);
        console.log(response);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      }
      else if (
        inActiveDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.supplierinfolist
      ) {
        const updateSupplierInfo = selectedData.map((item) => ({
          ...item,
          isActive: true,
        }));
        const response = await updateSupplierInfoStatus(updateSupplierInfo);
        console.log(response.data.status);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      }
      else if (
        inActiveDataModal &&
        searchItem[0]?.menuId == MenuIdCollection.clientinfolistId
      ) {
        const updateClientInfo = selectedData.map((item) => ({
          ...item,
          isActive: true,
        }));
        const response = await updateClientInfoStatus(updateClientInfo);
        console.log(response.data.status);
        if (response.data.status === 200) {
          swal("Done", "Data Update status Successfully", "success");
          setSelectedData([]);
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while updating the data",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const customStyles = {
    table: {
      style: {
        height: "250px",
        overflow: "auto",
      },
    },
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

  if (window.matchMedia("(max-width: 768px)").matches) {
    customStyles.table.style.height = "150px"; // Adjust height for smaller screens
  }
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = listData?.filter(
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
      <div className="d-flex align-items-center">
        <div className="d-flex justify-content-end align-items-center">
          <div className="table-head-icon">
            {/* <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon> &nbsp; */}
            {activeDataModal ? (
              <>
                {listData?.length > 0 ? (
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
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={() => {
                            if (companyinfo?.length !== 0 || undefined) {
                              downloadAllPDF({ companyinfo }, activeReportTitle);
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
                              extractedData,
                              companyinfo,
                              activeReportTitle
                            );
                          }}
                        >
                          Excel
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              <>
                {listData?.length > 0 ? (
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
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={() => {
                            if (companyinfo?.length !== 0 || undefined) {
                              downloadInactivePDF(
                                { companyinfo },
                                inActiveReportTitle
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
                            handleDownload(
                              extractedInActiveData,
                              companyinfo,
                              inActiveReportTitle
                            );
                          }}
                        >
                          Excel
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
        &nbsp;&nbsp;
        {listData?.length > 0 ? (
          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
          />
        ) : (
          ""
        )}
      </div>
    );
  }, [
    filterText,
    resetPaginationToggle,
    companyinfo,
    extractedData,
    activeDataModal,
    extractedInActiveData,
    listData?.length,
    inActiveReportTitle,
    activeReportTitle
  ]);
  return (
    <div
      class="modal fade"
      id="exampleModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
      style={{ overflow: "hidden" }}
    >
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              {activeDataModal
                ? "All Active listData"
                : "All Inactive listData"}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                if (activeDataModal) {
                  setActiveDataModal(false);
                }
                if (inActiveDataModal) {
                  setInActiveDataModal(false);
                }
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
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
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              onClick={() => {
                if (activeDataModal) {
                  setActiveDataModal(false);
                }
                if (inActiveDataModal) {
                  setInActiveDataModal(false);
                }
              }}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #2DDC1B",
                color: "#2DDC1B",
                textTransform: "uppercase",
              }}
            >
              Close
            </button>
            <button
              type="button"
              class={`btn btn-primary ${
                selectedData.length === 0 || isLoading ? "disabled-button" : ""
              }`}
              onClick={handleUpdate}
              disabled={selectedData.length === 0 || isLoading}
              style={{
                backgroundColor: "#2DDC1B",
                border: "none",
                color: "#F7F0D5",
                textTransform: "uppercase",
              }}
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveListDataModal;
