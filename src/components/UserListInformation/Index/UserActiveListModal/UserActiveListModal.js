/* eslint-disable jsx-a11y/anchor-is-valid */
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useUpdateMultipleUserStatusMutation } from "../../../../redux/features/user/userApi";
import swal from "sweetalert";
import { downloadInactivePDF, downloadPDF } from "../../../ReportProperties/PDF/HeaderFooter";
import handleDownload from "../../../ReportProperties/Excel/HandelExcelDownload";
import './UserActivationModal.css'
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";

const UserActiveListModal = ({
  user,
  activeUserModal,
  inActiveUserModal,
  setInActiveUserModal,
  setActiveUserModal,
  extractedData,
  companyinfo,
  extractedInActiveData
}) => {
  const [selectedData, setSelectedData] = useState([]);
  const [updateMultipleData, { isLoading }] =
    useUpdateMultipleUserStatusMutation();
const activeReportTitle="All Active User"
const inActiveReportTitle="All Inactive User"
  const handleCheckboxClick = (dataItem) => {

    setSelectedData((prevSelectedData) => {
      if (prevSelectedData?.includes(dataItem)) {
        // Deselect the data item if it's already selected
        return prevSelectedData.filter((item) => item !== dataItem);
      } else {
        // Select the data item if it's not already selected
        return [...prevSelectedData, dataItem];
      }
    });
  };

  const handleUpdate = async () => {
    try {
      // Update the isactive field to true for all selected data items
      if (activeUserModal) {
        const updatedData = selectedData.map((item) => ({
          ...item,
          isactive: false,
        }));
        await updateMultipleData(updatedData);
        swal("Done", "Status Change Successfully", "success");
        setSelectedData([]);
      }
      if (inActiveUserModal) {
        const updatedData = selectedData.map((item) => ({
          ...item,
          isactive: true,
        }));
        await updateMultipleData(updatedData);
        swal("Done", "Status Change Successfully", "success");
        setSelectedData([]);
      }

      // setActiveUserModal(false)
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const columns = [
    {
      name: "Sl.",
      selector: (user, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Name",
      selector: (user) => user?.firstname,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Mobile No",
      selector: (user) => user?.mobileNo,
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      button: true,
      width: "200px",
      grow: 2,
      cell: (user) => (
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
              aria-label={`Checkbox for data item ${user._id}`}
              onClick={(e) => handleCheckboxClick(user)}
            />
          </a>
        </div>
      ),
    },
  ];
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
  const filteredItems = user?.filter(
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
            {activeUserModal ? (
              <>
              { user?.length > 0 ? (<div class="dropdown">
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
                          downloadPDF({ companyinfo },activeReportTitle);
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
                        handleDownload(extractedData, companyinfo,activeReportTitle);
                      }}
                    >
                      Excel
                    </a>
                  </li>
                </ul>
              </div>) :''}
              </>
              
            ) : (
              <>
              { user?.length > 0 ? (<div class="dropdown">
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
                          downloadInactivePDF({ companyinfo },inActiveReportTitle);
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
                        handleDownload( extractedInActiveData, companyinfo,inActiveReportTitle);
                      }}
                    >
                      Excel
                    </a>
                  </li>
                </ul>
              </div>) :''}
              </>
              
            )}
          </div>
        </div>
        &nbsp;&nbsp;
        {
          user?.length >0 ? ( <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
          />) :''
        }
       
       
      </div>
    );
  }, [
    filterText,
    resetPaginationToggle,
    companyinfo,
    extractedData,
    activeUserModal,
    extractedInActiveData,
    user?.length
  ]);
  return (
    <div
    class="modal fade"
    id="exampleModalCenter"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
    style={{overflow:'hidden'}}

    >
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              {activeUserModal ? "All Active User" : "All Inactive User"}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                if (activeUserModal) {
                  setActiveUserModal(false);
                }
                if (inActiveUserModal) {
                  setInActiveUserModal(false);
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
            <table id="my-tableInactive" className="d-none">
              <thead>
                <tr>
                  <th>Sl.</th>
                  <th>First name</th>
                  <th>User Name</th>
                  <th>Mobile No</th>
                </tr>
              </thead>
              <tbody>
                { extractedInActiveData?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.firstname}</td>
                    <td>{item.username}</td>
                    <td>{item.mobileNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              onClick={() => {
                if (activeUserModal) {
                  setActiveUserModal(false);
                }
                if (inActiveUserModal) {
                  setInActiveUserModal(false);
                }
               
              }}
              style={{
                backgroundColor:'transparent',
                border:'1px solid #1EDFBD',
                color:'#1EDFBD',
                textTransform:'uppercase'
              }}
            >
              Close
            </button>
            <button
              type="button"
              class={`btn btn-primary ${selectedData.length === 0 || isLoading ? 'disabled-button' : ''}`}
              onClick={handleUpdate}
              disabled={selectedData.length === 0 || isLoading}
              style={{
                backgroundColor:'#1EDFBD',
                border:'none',
                color:'#F7F0D5',
                textTransform:'uppercase'
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

export default UserActiveListModal;
