/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import "./UserListModal.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import handleDownload from "../../../ReportProperties/HandelExcelDownload";
import {
  downloadAllPDF,
  downloadPDF,
} from "../../../ReportProperties/HeaderFooter";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";

const UserListModal = ({ user }) => {
  const [extractedData, setExtractedData] = useState([]);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
var reportTitle="All User list"
  useEffect(() => {
    const extractedFields = user?.map((item) => ({
      firstname: item.firstname,
      mobileNo: item.mobileNo,
      username: item.username,
    }));
    setExtractedData(extractedFields);
  }, [user]);
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
            // href={`UpdateGroupName/${data?.GroupId}`}
          >
            {user?.isactive == true ? <p>Active</p> : <p>InActive</p>}
          </a>
        </div>
      ),
    },
  ];
  
  const customStyles = {
    table: {
      style: {
        height: "380px",
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
      <>
        <div className="d-flex justify-content-end align-items-center">
          <div className="table-head-icon">
            {/* <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon> &nbsp; */}
            {
              user?.length > 0 ?( <div class="dropdown">
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
                        downloadAllPDF({ companyinfo },reportTitle);
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
                      console.log(reportTitle)
                      handleDownload(extractedData, companyinfo,reportTitle);
                    }}
                  >
                    Excel
                  </a>
                </li>
              </ul>
            </div>) :''
            }
           
          </div>
        </div>{" "}
        &nbsp;&nbsp;
       {
        user?.length >0 ? ( <FilterComponent
          onFilter={(e) => setFilterText(e.target.value)}
          onClear={handleClear}
          filterText={filterText}
        />) :''
       }
      </>
    );
  }, [filterText, resetPaginationToggle, companyinfo, extractedData,reportTitle,user?.length]);

  return (
    <>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                All User List
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
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
              <table id="my-table2" className="d-none">
                <thead>
                  <tr>
                    <th>Sl.</th>
                    <th>First name</th>
                    <th>User Name</th>
                    <th>Mobile No</th>
                  </tr>
                </thead>
                <tbody>
                  {extractedData?.map((item, index) => (
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
          </div>
        </div>
      </div>
    </>
  );
};

export default UserListModal;
