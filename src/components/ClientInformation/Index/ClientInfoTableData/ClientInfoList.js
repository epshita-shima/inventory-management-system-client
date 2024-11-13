/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import {
  useDeleteClientInfoMutation,
  useGetAllClientInformationQuery,
} from "../../../../redux/features/clientinformation/clientInfoApi";
import handleCheckboxClick from "../../../Common/ListHeadingModal/Function/handleCheckboxClick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import {
  faDownload,
  faPenToSquare,
  faRefresh,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import { downloadPDF } from "../../../ReportProperties/PDF/HeaderFooter";
import handleDownload from "../../../ReportProperties/Excel/HandelExcelDownload";
import ListHeading from "../../../Common/ListHeading/ListHeading";
import ActiveListDataModal from "../../../Common/ListHeadingModal/ActiveListModal/ActiveListDataModal";

const ClientInfoList = ({ permission }) => {
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: clientInfoData, refetch } =
    useGetAllClientInformationQuery(undefined);
  const [filterText, setFilterText] = useState("");
  const [extractedAllDataReport, setExtractedAllDataReport] = useState([]);
  const [extractedDataForReport, setExtractedDataForReport] = useState([]);
  const [extractedInActiveDataForReport, setExtractedInActiveDataForReport] =
    useState([]);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [activeClientInfoModal, setActiveClientInfoModal] = useState(false);
  const [inActiveClientInfoModal, setInActiveClientInfoModal] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [deleteClientInfo] = useDeleteClientInfoMutation();
  const [clientInfoActiveStatus, setClientInfoActiveStatus] = useState([]);
  const [clientInfoInActiveStatus, setClientInfoInActiveStatus] = useState([]);
  var reportTitle = "All Client List";
  console.log(selectedData);
  
  useEffect(() => {
    const clientInfoActiveStatus = clientInfoData?.filter(
      (item) => item.isActive == true
    );
    const clientInfoInActiveStatus = clientInfoData?.filter(
      (item) => item.isActive == false
    );
 
    const extractedForAddDataFields = clientInfoData?.map((item) => {
      return {
        clientName: item.clientName,
        email: item.email,
        mobileNo: item.mobileNo,
        contactPerson: item.contactPerson,
        address: item.address,
        isActive:item.isActive ? 'Active' : 'InActive'
      };
    });
    const extractedFields = clientInfoActiveStatus?.map((item) => {
      return {
        clientName: item.clientName,
        email: item.email,
        mobileNo: item.mobileNo,
        contactPerson: item.contactPerson,
        address: item.address,
        isActive:item.isActive ? 'Active' : 'InActive'
      };
    });

    const extractedInactiveFields = clientInfoInActiveStatus?.map((item) => {
      return {
        clientName: item.clientName,
        email: item.email,
        mobileNo: item.mobileNo,
        contactPerson: item.contactPerson,
        address: item.address,
        isActive:item.isActive ? 'Active' : 'InActive'
      };
    });
    setExtractedAllDataReport(extractedForAddDataFields)
    setClientInfoActiveStatus(clientInfoActiveStatus);
    setClientInfoInActiveStatus(clientInfoInActiveStatus);
    setExtractedDataForReport(extractedFields);
    setExtractedInActiveDataForReport(extractedInactiveFields);
  }, [clientInfoData?.unitId, clientInfoData]);

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
                    handleCheckboxClick(row, setSelectedData);
                  }}
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
      selector: (clientInfoData, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Client Name",
      selector: (clientInfoData) => clientInfoData?.clientName,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Email",
      selector: (clientInfoData) => clientInfoData?.email,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Mobile Number",
      selector: (clientInfoData) => clientInfoData?.mobileNo,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Contact Person",
      selector: (clientInfoData) => clientInfoData?.contactPerson,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Address",
      selector: (clientInfoData) => clientInfoData?.address,
      sortable: true,
      center: true,
      filterable: true,
      width: "auto",
    },
    {
      name: "Status",
      button: true,
      width: "100px",
      grow: 2,
      cell: (clientInfoData) => (
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
            {clientInfoData?.isActive == true ? <p className="text-success fw-bold">Active</p> : <p className="text-danger fw-bold">InActive</p>}
          </a>
        </div>
      ),
    },
    {
      name: "Action",
      button: true,
      width: "130px",
      grow: 2,
      cell: (clientInfoData) => (
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
                  clientInfoData?.items?.length == 0 ? "gray" : "#2DDC1B"
                } `,
                border: `${
                  clientInfoData?.items?.length == 0
                    ? "2px solid gray"
                    : "2px solid #2DDC1B"
                }`,
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                window.open(`update-client-info/${clientInfoData?._id}`);
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
                    const response = await deleteClientInfo(
                      clientInfoData?._id
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

  const filteredItems = clientInfoData?.filter(
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
                        extractedAllDataReport,
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
    extractedAllDataReport,
    reportTitle,
    refetch,
  ]);
  return (
    <div className="row px-5 mx-4">
      <ListHeading
        clientInfoData={clientInfoData}
        clientInfoActiveStatus={clientInfoActiveStatus}
        clientInfoInActiveStatus={clientInfoInActiveStatus}
        setActiveDataModal={setActiveClientInfoModal}
        setInActiveDataModal={setInActiveClientInfoModal}
      ></ListHeading>
      <div
        className="col userlist-table mt-4"
        style={{
          overflow: "scroll",
          height: "420px",
        }}
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
            <th>Client Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Contact Person</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {extractedAllDataReport?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.clientName}</td>
              <td>{item.email}</td>
              <td>{item.mobileNo}</td>
              <td>{item.contactPerson}</td>
              <td>{item.address}</td>
              <td>{item.isActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table id="my-table2" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Client Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Contact Person</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {extractedDataForReport?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.clientName}</td>
              <td>{item.email}</td>
              <td>{item.mobileNo}</td>
              <td>{item.contactPerson}</td>
              <td>{item.address}</td>
              <td>{item.isActive}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table id="my-tableInactive" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Client Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Contact Person</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {extractedInActiveDataForReport?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.clientName}</td>
              <td>{item.email}</td>
              <td>{item.mobileNo}</td>
              <td>{item.contactPerson}</td>
              <td>{item.address}</td>
              <td>{item.isActive}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {activeClientInfoModal ? (
        <ActiveListDataModal
          listData={clientInfoActiveStatus}
          activeDataModal={activeClientInfoModal}
          setActiveDataModal={setActiveClientInfoModal}
          extractedData={extractedDataForReport}
          companyinfo={companyinfo}
          generateColumns={generateColumns}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        ></ActiveListDataModal>
      ) : (
        ""
      )}
      {inActiveClientInfoModal ? (
        <ActiveListDataModal
          listData={clientInfoInActiveStatus}
          inActiveDataModal={inActiveClientInfoModal}
          setInActiveDataModal={setInActiveClientInfoModal}
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

export default ClientInfoList;
