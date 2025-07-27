/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import ListHeading from "../../../Common/ListHeading/ListHeading";
import DataTable from "react-data-table-component";
import { useDeleteSupplierInfoMutation, useGetAllSupplierInformationQuery } from "../../../../redux/features/supplierInformation/supplierInfoApi";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import handleCheckboxClick from "../../../Common/ListHeadingModal/Function/handleCheckboxClick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPenToSquare, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import { downloadPDF } from "../../../ReportProperties/PDF/HeaderFooter";
import handleDownload from "../../../ReportProperties/Excel/HandelExcelDownload";
import ActiveListDataModal from "../../../Common/ListHeadingModal/ActiveListModal/ActiveListDataModal";

const SupplierInfoList = ({permission}) => {
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: supplierInfoData, refetch } =
    useGetAllSupplierInformationQuery(undefined);
  const [filterText, setFilterText] = useState("");
  const [extractedAllDataReport, setExtractedAllDataReport] = useState([]);
  const [extractedDataForReport, setExtractedDataForReport] = useState([]);
  const [extractedInActiveDataForReport, setExtractedInActiveDataForReport] =
    useState([]);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [activeSupplierInfoModal, setActiveSupplierInfoModal] =
    useState(false);
  const [inActiveSupplierInfoModal, setInActiveSupplierInfoModal] =
    useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [deleteSupplierInfo] = useDeleteSupplierInfoMutation();
  const [supplierInfoActiveStatus, setSupplierInfoActiveStaus] = useState([]);
  const [supplierInfoInActiveStatus, setSupplierInfoInActiveStatus] = useState([]);
  var reportTitle = "All Supplier List";

  useEffect(() => {
    const supplierInfoActiveStatus = supplierInfoData?.filter(
      (item) => item.isActive == true
    );
    const supplierInfoInActiveStatus = supplierInfoData?.filter(
      (item) => item.isActive == false
    );

    const extractedFieldsForAllData = supplierInfoData?.map((item) => {
      return {
        supplierName: item.supplierName,
        email: item.email,
        mobileNo: item.mobileNo,
        contactPerson: item.contactPerson,
        address: item.address,
        isActive:item.isActive ? 'Active': 'InActive'
      };
    });
    const extractedFields = supplierInfoActiveStatus?.map((item) => {
      return {
        supplierName: item.supplierName,
        email: item.email,
        mobileNo: item.mobileNo,
        contactPerson: item.contactPerson,
        address: item.address,
        isActive:item.isActive ? 'Active': 'InActive'
      };
    });

    const extractedInactiveFields = supplierInfoInActiveStatus?.map((item) => {
      return {
        supplierName: item.supplierName,
        email: item.email,
        mobileNo: item.mobileNo,
        contactPerson: item.contactPerson,
        address: item.address,
        isActive:item.isActive ? 'Active': 'InActive'
      };
    });
    setExtractedAllDataReport(extractedFieldsForAllData)
    setSupplierInfoActiveStaus(supplierInfoActiveStatus);
    setSupplierInfoInActiveStatus(supplierInfoInActiveStatus);
    setExtractedDataForReport(extractedFields);
    setExtractedInActiveDataForReport(extractedInactiveFields);
  }, [
    supplierInfoData?.unitId,
    supplierInfoData,
  ]);

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
                  aria-label={`Checkbox for data item ${row._id}`}
                  checked={selectedData.some((item) => item._id === row._id)}
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
      selector: (supplierInfoData, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Supplier Name",
      selector: (supplierInfoData) => supplierInfoData?.supplierName,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Email",
      selector: (supplierInfoData) => supplierInfoData?.email,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Mobile Number",
      selector: (supplierInfoData) => supplierInfoData?.mobileNo,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Contact Person",
      selector: (supplierInfoData) => supplierInfoData?.contactPerson,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Address",
      selector: (supplierInfoData) => supplierInfoData?.address,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Status",
      button: true,
      width: "200px",
      grow: 2,
      cell: (supplierInfoData) => (
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
            {supplierInfoData?.isActive == true ? <p className="text-success fw-bold">Active</p> : <p className="text-danger fw-bold">InActive</p>}
          </a>
        </div>
      ),
    },
    {
      name: "Action",
      button: true,
      width: "150px",
      grow: 2,
      cell: (supplierInfoData) => (
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
                  supplierInfoData?.items?.length == 0 ? "gray" : "#2DDC1B"
                } `,
                border: `${
                  supplierInfoData?.items?.length == 0
                    ? "2px solid gray"
                    : "2px solid #2DDC1B"
                }`,
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                window.open(`supplier-list/update-supplier-info/${supplierInfoData?._id}`)
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
                    const response = await deleteSupplierInfo(
                      supplierInfoData?._id
                    ).unwrap();
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

  const filteredItems = supplierInfoData?.filter(
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
      <div className="d-block d-sm-flex justify-content-center align-items-center mb-2">
        <div className="d-flex justify-content-end align-items-center">
          <div className="table-head-icon d-flex ">
            <div>
              <FontAwesomeIcon
                icon={faRefresh}
                onClick={() => refetch()}
              ></FontAwesomeIcon>{" "}
              &nbsp;
            </div>
            <div className="dropdown">
              <button
                className="btn btn-download dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <a
                    className="dropdown-item"
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
                    className="dropdown-item"
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
        supplierInfoData={supplierInfoData}
        supplierInfoActiveStatus={supplierInfoActiveStatus}
        supplierInfoInActiveStatus={supplierInfoInActiveStatus}
        setActiveDataModal={setActiveSupplierInfoModal}
        setInActiveDataModal={setInActiveSupplierInfoModal}
      ></ListHeading>
      <div
        className="col  mt-4"
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
            fixedHeader={true}
            fixedHeaderScrollHeight="calc(65vh - 120px)"
          />
        </div>
      </div>

      <table id="my-table" className="d-none">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Supplier Name</th>
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
              <td>{item.supplierName}</td>
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
            <th>Supplier Name</th>
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
              <td>{item.supplierName}</td>
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
            <th>Supplier Name</th>
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
              <td>{item.supplierName}</td>
              <td>{item.email}</td>
              <td>{item.mobileNo}</td>
              <td>{item.contactPerson}</td>
              <td>{item.address}</td>
              <td>{item.isActive}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {activeSupplierInfoModal ? (
        <ActiveListDataModal
          listData={supplierInfoActiveStatus}
          activeDataModal={activeSupplierInfoModal}
          setActiveDataModal={setActiveSupplierInfoModal}
          extractedData={extractedDataForReport}
          companyinfo={companyinfo}
          generateColumns={generateColumns}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        ></ActiveListDataModal>
      ) : (
        ""
      )}
      {inActiveSupplierInfoModal ? (
        <ActiveListDataModal
          listData={supplierInfoInActiveStatus}
          inActiveDataModal={inActiveSupplierInfoModal}
          setInActiveDataModal={setInActiveSupplierInfoModal}
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

export default SupplierInfoList;
