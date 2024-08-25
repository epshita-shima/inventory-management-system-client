/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import "./UserListInfo.css";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEye,
  faGear,
  faPenToSquare,
  faRefresh,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import UserListModal from "../UserListModal/UserListModal";
import UserActivationModal from "../UserActivationModal/UserActivationModal";

import { useNavigate } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetAllUserQuery,
} from "../../../../redux/features/user/userApi";
import { Font } from "@react-pdf/renderer";
import swal from "sweetalert";
import "jspdf-autotable";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { downloadPDF } from "../../../ReportProperties/HeaderFooter";
import handleDownload from "../../../ReportProperties/HandelExcelDownload";
import ListHeading from "../../../Common/ListHeading/ListHeading";
import ActiveListDataModal from "../../../Common/ListHeadingModal/ActiveListModal/ActiveListDataModal";
import handleCheckboxClick from './../../../Common/ListHeadingModal/Function/handleCheckboxClick';
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import './UserListInfo.js';

const UserListInfo = ({
  setChangePassword,
  setResetPassword,
  resetPassword,
  changePassword,
  permission,
}) => {
  const [userId, setUserId] = useState(null);
  const { data: user } = useGetAllUserQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const [activeUserModal, setActiveDataModal] = useState(false);
  const [inActiveUserModal, setInActiveUserModal] = useState(false);
  const [deleteUser, { isLoading, isSuccess, isError }] =
    useDeleteUserMutation();
  const navigate = useNavigate();
  const activeUser = user?.filter((user) => user.isactive == true);
  const inActiveUser = user?.filter((user) => user.isactive == false);
  const [extractedData, setExtractedData] = useState([]);
  const [extractedInActiveData, setExtractedInActiveData] = useState([]);
  const [extractedAllData, setExtractedAllData] = useState([]);
  const [demoData, setDemoData] = useState(null);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  var reportTitle = "All User";
  console.log(extractedData)

  useEffect(() => {
    const activeUsers = user?.filter((user) => user.isactive == true);
    const inActiveUser = user?.filter((user) => user.isactive == false);
    const extractedFieldsForAllData = user?.map((item) => ({
      firstname: item.firstname,
      mobileNo: item.mobileNo,
      username: item.username,
      isactive:item.isactive ? 'Active' : 'InActive'
    }));

    const extractedFields = activeUsers?.map((item) => ({
      firstname: item.firstname,
      mobileNo: item.mobileNo,
      username: item.username,
      isactive:item.isactive ? 'Active' : 'InActive'
    }));

    const extractedInactiveFields = inActiveUser?.map((item) => ({
      firstname: item.firstname,
      mobileNo: item.mobileNo,
      username: item.username,
      isactive:item.isactive ? 'Active' : 'InActive'
    }));
    
    setExtractedAllData(extractedFieldsForAllData)
    setExtractedData(extractedFields);
    setExtractedInActiveData(extractedInactiveFields);
  }, [user]);

  useEffect(() => {
    // Fetch the JSON data
    const fetchData = async () => {
      try {
        const response = await fetch("jsonData.json"); // Adjust the path to your JSON file
        const data = await response.json();
        setDemoData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  Font.register({
    family: "Oswald",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });

  const handleActiveStatus = (id) => {
    setUserId(id);
  };

  const generateColumns = (data, fields) => {
    if (data?.length === 0) return [];

    return fields.map((field) => {
      if (field === "isactive") {
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
                  onChange={(e) => handleCheckboxClick(row,setSelectedData)} // Assuming handleCheckboxClick is defined elsewhere
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
      name: "User Name",
      selector: (user) => user?.username,
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
            {user?.isactive == true ? <p className="text-success fw-bold">Active</p> : <p className="text-danger fw-bold">InActive</p>}
          </a>
        </div>
      ),
    },

    {
      name: "Action",
      button: true,
      width: "200px",
      grow: 2,
      cell: (user) => (
        <div className="d-flex justify-content-between align-content-center">
          <a
            target="_blank"
            className="action-icon"
            data-toggle="tooltip"
            data-placement="bottom"
            title="View user"
            style={{
              color: "#2DDC1B",
              border: "2px solid #2DDC1B",
              padding: "3px",
              borderRadius: "5px",
            }}
          >
            <FontAwesomeIcon
              data-toggle="modal"
              data-target="#exampleModalLong"
              icon={faEye}
              onClick={() => {
                handleActiveStatus(activeUser?._id);
              }}
            ></FontAwesomeIcon>
          </a>
          {permission?.isUpdated ? (
            <a
              target="_blank"
              className="action-icon"
              data-toggle="tooltip"
              data-placement="bottom"
              title="Update user"
              style={{
                color: "#2DDC1B",
                border: "2px solid #2DDC1B",
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                window.open(`user-update/${user?._id}`);
                // handleActiveStatus(activeUser?._id);
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
            </a>
          ) : (
            ""
          )}

          <a
            target="_blank"
            className="action-icon "
            style={{
              background: "#2DDC1B",
              padding: "5px",
              color: "#000",
              borderRadius: "5px",
              marginLeft: "10px",
            }}
          >
            <FontAwesomeIcon
              data-toggle="tooltip"
              data-placement="bottom"
              title="Reset password"
              icon={faGear}
              onClick={() => {
                setResetPassword(true);
                setChangePassword(false);
                const url = `/main-view/change-password?reset=true&change=false`;
                window.open(url, "_blank");
              }}
            ></FontAwesomeIcon>
          </a>
          {permission?.isRemoved ? (
            <a
              target="_blank"
              className="action-icon "
              data-toggle="tooltip"
              data-placement="bottom"
              title="Delete user"
              style={{
                color: "red",
                border: "2px solid red",
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                swal({
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this data!",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    deleteUser(user?._id);
                    swal("Poof! Your data has been deleted!", {
                      icon: "success",
                    });
                  } else {
                    swal("Your data is safe!");
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
      <div className="d-block d-sm-flex justify-content-center align-items-center ">
        <div className="d-flex justify-content-end align-items-center">
          <div className="table-head-icon d-flex ">
            <div>
              <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon> &nbsp;
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
                      handleDownload(extractedAllData, companyinfo, reportTitle);
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
    reportTitle,
    extractedAllData
  ]);

  return (
    <div className="row px-4 mx-4">
      <ListHeading
        user={user}
        setActiveDataModal={setActiveDataModal}
        activeUser={activeUser}
        setInActiveDataModal={setInActiveUserModal}
        inActiveUser={inActiveUser}
      ></ListHeading>
      <div class=" mt-5">
        <div class="row">
          <div
            className="col userlist-table main-table-view"
            // style={{ height: 'calc(55vh - 120px)', overflowY: 'scroll' }}
          >
            <div className="shadow-lg overflow-x-auto flex-nowarp">
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
        </div>
      </div>
      <table id="my-table" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>First name</th>
            <th>User Name</th>
            <th>Mobile No</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {extractedAllData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.firstname}</td>
              <td>{item.username}</td>
              <td>{item.mobileNo}</td>
              <td>{item.isactive}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table id="my-table2" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>First name</th>
            <th>User Name</th>
            <th>Mobile No</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {extractedData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.firstname}</td>
              <td>{item.username}</td>
              <td>{item.mobileNo}</td>
              <td>{item.isactive}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table id="my-tableInactive" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>First name</th>
            <th>User Name</th>
            <th>Mobile No</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {extractedInActiveData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.firstname}</td>
              <td>{item.username}</td>
              <td>{item.mobileNo}</td>
              <td>{item.isactive}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <UserListModal user={user}></UserListModal>
      <UserActivationModal userId={userId}></UserActivationModal>
      {activeUserModal ? (
        // <UserActiveListModal
        //   user={activeUser}
        //   activeUserModal={activeUserModal}
        //   setActiveDataModal={setActiveDataModal}
        //   extractedData={extractedData}
        //   companyinfo={companyinfo}
        // ></UserActiveListModal>
        <ActiveListDataModal
          listData={activeUser}
          activeDataModal={activeUserModal}
          // inActiveDataModal={inActiveUserModal}
          // setInActiveDataModal={setInActiveUserModal}
          setActiveDataModal={setActiveDataModal}
          extractedData={extractedData}
          companyinfo={companyinfo}
          // extractedInActiveData={extractedInActiveData}
          generateColumns={generateColumns}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        ></ActiveListDataModal>
      ) : (
        ""
      )}
      {inActiveUserModal ? (
<ActiveListDataModal
   listData={inActiveUser}
   inActiveDataModal={inActiveUserModal}
   setInActiveDataModal={setInActiveUserModal}
   extractedInActiveData={extractedInActiveData}
   generateColumns={generateColumns}
     companyinfo={companyinfo}
     selectedData={selectedData}
     setSelectedData={setSelectedData}
></ActiveListDataModal>
        // <UserActiveListModal
        //   user={inActiveUser}
        //   inActiveUserModal={inActiveUserModal}
        //   setInActiveUserModal={setInActiveUserModal}
        //   extractedInActiveData={extractedInActiveData}
        //   companyinfo={companyinfo}
        // ></UserActiveListModal>
      ) : (
        ""
      )}
    </div>
  );
};

export default UserListInfo;
