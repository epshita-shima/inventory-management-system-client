/* eslint-disable jsx-a11y/anchor-is-valid */
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";
import swal from "sweetalert";
import DataTable from "react-data-table-component";
import {
  downloadAllPDF,
  downloadInactivePDF,
} from "../../../ReportProperties/PDF/HeaderFooter";
import handleDownload from "../../../ReportProperties/Excel/HandelExcelDownload";
import { useUpdateMultipleUserStatusMutation } from "../../../../redux/features/user/userApi";
import MenuIdCollection from "../../MenuIdCollection/MenuIdCollection";
import { useUpdateRawMaterialStatusMutation } from "../../../../redux/features/iteminformation/rmItemInfoApi";
import { useUpdateCFTInfoStatusMutation } from "../../../../redux/features/cftinformation/cftInfosApi";
import { useUpdateFinishGoodStatusMutation } from "../../../../redux/features/iteminformation/finishgoodsinfoApi";
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
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [updateStatusForUserData, { isLoading: isLoadingUser }] =
    useUpdateMultipleUserStatusMutation();
  const [updateStatusForRawMeterial, { isLoading: isLoadingRawMaterial }] =
    useUpdateRawMaterialStatusMutation();
  const [updateStatusForFinishGood, { isLoading: isLoadingFinishGoods }] =
    useUpdateFinishGoodStatusMutation();
  const [updateCFTInfoStatus, { isLoading: isLoadingCft }] =
    useUpdateCFTInfoStatusMutation();
  const [updateSupplierInfoStatus, { isLoading: isLoadingSupplierInfo }] =
    useUpdateSupplierInfoStatusMutation();
  const [updateClientInfoStatus, { isLoading: isLoadingClient }] =
    useUpdateClientInfoStatusMutation();
  const currentUrl = window.location.href;
  const pathname = new URL(currentUrl).pathname;
  const wordsURL = pathname.split("/");
  const repStr = wordsURL[2].replaceAll("-", " ");
  const pathNameConvertCapitalize =
    repStr.charAt(0).toUpperCase() + repStr.slice(1);
  const activeReportTitle = `All Active ${pathNameConvertCapitalize}`;
  const inActiveReportTitle = `All Inactive ${pathNameConvertCapitalize}`;

  const getUserFromLocal = localStorage.getItem("user");
  const getUserFromLocalConvert = JSON.parse(getUserFromLocal);
  const getMenuListFromLOcalUser = getUserFromLocalConvert?.menulist;

  const traverse = (items) => {
    const urls = [];
    items?.forEach((item) => {
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

  var columns;
  const searchItem = mainData?.filter((x) => x.url === pathname);
  if (searchItem[0]?.menuId === MenuIdCollection.userList) {
    const fieldsToDisplay = ["firstname", "mobileNo", "isactive"];
    columns = generateColumns(listData, fieldsToDisplay);
  } else if (searchItem[0]?.menuId === MenuIdCollection.rmItemList) {
    const fieldsToDisplay = ["itemName", "categoryId", "itemStatus"];
    columns = generateColumns(listData, fieldsToDisplay);
  } else if (searchItem[0]?.menuId === MenuIdCollection.fgItemList) {
    const fieldsToDisplay = ["itemName", "sizeId", "itemStatus"];
    columns = generateColumns(listData, fieldsToDisplay);
  } else if (searchItem[0]?.menuId === MenuIdCollection.cftinfolist) {
    const fieldsToDisplay = ["openingDate", "cftPerKg", "isActive"];
    columns = generateColumns(listData, fieldsToDisplay);
  } else if (searchItem[0]?.menuId === MenuIdCollection.supplierinfolist) {
    const fieldsToDisplay = ["supplierName", "mobileNo", "isActive"];
    columns = generateColumns(listData, fieldsToDisplay);
  } else if (searchItem[0]?.menuId === MenuIdCollection.clientinfolistId) {
    const fieldsToDisplay = ["clientName", "mobileNo", "isActive"];
    columns = generateColumns(listData, fieldsToDisplay);
  }

  const handleUpdate = async () => {
    try {

      if (
        activeDataModal &&
        searchItem[0]?.menuId === MenuIdCollection.userList
      ) {
        const updatedData = selectedData.map((item) => ({
          ...item,
          isactive: false,
        }));

        const response = await updateStatusForUserData(updatedData);
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
        searchItem[0]?.menuId === MenuIdCollection.rmItemList
      ) {
        const updateRawMeterial = selectedData.map((item) => ({
          ...item,
          itemStatus: false,
        }));
        const response = await updateStatusForRawMeterial(updateRawMeterial);
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
        searchItem[0]?.menuId === MenuIdCollection.fgItemList
      ) {
        const updateFinishGood = selectedData.map((item) => ({
          ...item,
          itemStatus: false,
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
        activeDataModal &&
        searchItem[0]?.menuId === MenuIdCollection.cftinfolist
      ) {
        const updateCftInfo = selectedData.map((item) => ({
          ...item,
          isActive: false,
        }));
        const response = await updateCFTInfoStatus(updateCftInfo);
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
        searchItem[0]?.menuId === MenuIdCollection.supplierinfolist
      ) {
        const updateSupplierInfo = selectedData.map((item) => ({
          ...item,
          isActive: false,
        }));
        const response = await updateSupplierInfoStatus(updateSupplierInfo);
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
        searchItem[0]?.menuId === MenuIdCollection.clientinfolistId
      ) {
        const updateClientInfo = selectedData.map((item) => ({
          ...item,
          isActive: false,
        }));
        const response = await updateClientInfoStatus(updateClientInfo);
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
        searchItem[0]?.menuId === MenuIdCollection.userList
      ) {
        const updatedData = selectedData.map((item) => ({
          ...item,
          isactive: true,
        }));
        const response = await updateStatusForUserData(updatedData);
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
        searchItem[0]?.menuId === MenuIdCollection.rmItemList
      ) {
        const updateRawMeterial = selectedData.map((item) => ({
          ...item,
          itemStatus: true,
        }));

        const response = await updateStatusForRawMeterial(updateRawMeterial);

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
        searchItem[0]?.menuId === MenuIdCollection.fgItemList
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
        searchItem[0]?.menuId === MenuIdCollection.cftinfolist
      ) {
        const updateCFTInfo = selectedData.map((item) => ({
          ...item,
          isActive: true,
        }));

        const response = await updateCFTInfoStatus(updateCFTInfo);

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
        searchItem[0]?.menuId === MenuIdCollection.supplierinfolist
      ) {
        const updateSupplierInfo = selectedData.map((item) => ({
          ...item,
          isActive: true,
        }));
        const response = await updateSupplierInfoStatus(updateSupplierInfo);
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
        searchItem[0]?.menuId === MenuIdCollection.clientinfolistId
      ) {
        const updateClientInfo = selectedData.map((item) => ({
          ...item,
          isActive: true,
        }));
        const response = await updateClientInfoStatus(updateClientInfo);
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
        <div className="d-flex justify-content-end align-items-center mb-2">
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
                              downloadAllPDF(
                                { companyinfo },
                                activeReportTitle
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
    activeReportTitle,
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
                ? "All Active ListData"
                : "All Inactive ListData"}
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
                selectedData.length === 0 ||
                isLoadingUser ||
                isLoadingRawMaterial ||
                isLoadingFinishGoods ||
                isLoadingSupplierInfo ||
                isLoadingClient ||
                isLoadingCft
                  ? "disabled-button"
                  : ""
              }`}
              onClick={handleUpdate}
              disabled={
                selectedData.length === 0 ||
                isLoadingUser ||
                isLoadingRawMaterial ||
                isLoadingFinishGoods ||
                isLoadingSupplierInfo ||
                isLoadingClient ||
                isLoadingCft
              }
              style={{
                backgroundColor: "#2DDC1B",
                border: "none",
                color: "#F7F0D5",
                textTransform: "uppercase",
              }}
            >
              {isLoadingUser ||
              isLoadingRawMaterial ||
              isLoadingFinishGoods ||
              isLoadingSupplierInfo ||
              isLoadingClient ||
              isLoadingCft
                ? "Updating Status"
                : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveListDataModal;
