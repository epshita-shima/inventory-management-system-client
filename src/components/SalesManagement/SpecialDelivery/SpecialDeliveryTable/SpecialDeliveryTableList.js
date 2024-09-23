/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import {
  useGetAllInvoiceInformationQuery,
  useLazyGetFilteredInvoiceInfoQuery,
  useUpdateInvoiceSpecialPIApproveStatusMutation,
} from "../../../../redux/features/invoiceinformation/invoiceinfoApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEye,
  faFilePdf,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import { clientInfoDropdown } from "../../../Common/CommonDropdown/CommonDropdown";
import swal from "sweetalert";
import reportImage from "../../../../assets/images/reportlogo.png";
import authorizesSingatureImage from "../../../../assets/images/Image_20240831165135.png";
import { useNavigate } from "react-router-dom";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { useGetAllPaymentInformationQuery } from "../../../../redux/features/paymnetinformation/paymentInfoApi";
import { downloadInvoicePDF } from "../../../ReportProperties/InvoiceReportDownload";

const SpecialDeliveryTableList = ({ permission }) => {
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);
  const [selectedData, setSelectedData] = useState([]);
  const [approveStatus] = useUpdateInvoiceSpecialPIApproveStatusMutation();
  const [filters, setFilters] = useState({
    customerID: "",
  });
  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
  const { data: finishGoodsData } = useGetAllItemInformationQuery(undefined);
  const { data: unitInfo } = useGetAllItemUnitQuery(undefined);
  const { data: sizeInfo } = useGetAllItemSizeQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: paymentInfo } = useGetAllPaymentInformationQuery(undefined);
  const reportTitle = "PRO FORMA INVOICE";
  const base64Logo = reportImage;
  const signature = authorizesSingatureImage;
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const approveBy = getUserParse[0].username;
  const [trigger, { data: filteredDatas, error, isFetching }] =
    useLazyGetFilteredInvoiceInfoQuery();
  const [userWaysListData, setUserWaysListData] = useState([]);

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      // Ensure filters are correctly formatted for your API
      trigger(filters)
        .unwrap() // If you're using Redux Toolkit Query
        .then((response) => {
          console.log("Data fetched:", response);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        })
        .finally(() => {
          setExecuteQuery(false); // Reset the query state
        });
    }
    setUserWaysListData(filteredDatas);
  }, [executeQuery, trigger, filters, filteredDatas]);

  const handleApplyFilters = () => {
    setExecuteQuery(true); // Trigger the useEffect to fetch data
  };

  // const handleCheckboxClick = (dataItem, setSelectedData) => {
  //   setSelectedData((prevSelectedData) => {
  //     const isSelected = prevSelectedData?.some((item) => item._id === dataItem._id);

  //     const updatedDataItem = {
  //       ...dataItem,
  //       specialApproveForDelivary: !isSelected,
  //       specialApproveBy: !isSelected ? approveBy : null,
  //       specialApproveDate: !isSelected ? new Date() : null,
  //     };

  //     if (isSelected) {
  //       return prevSelectedData.filter((item) => item._id !== dataItem._id);
  //     } else {
  //       return [...prevSelectedData, updatedDataItem];
  //     }
  //   });
  // };

  const handleCheckboxClick = (dataItem, setSelectedData) => {
    const updatedDataItem = {
      ...dataItem,
      specialApproveForDelivary: !dataItem.specialApproveForDelivary, // Toggle the value
      specialApproveBy: !dataItem.specialApproveForDelivary
        ? approveBy
        : approveBy, // Set approveBy only if approving
      specialApproveDate: !dataItem.specialApproveForDelivary
        ? new Date()
        : new Date(), // Set approveDate only if approving
    };

    setSelectedData((prevSelectedData) => {
      if (prevSelectedData.some((item) => item._id === dataItem._id)) {
        // Update the item if it's already in the selected data
        return prevSelectedData.map((item) =>
          item._id === dataItem._id ? updatedDataItem : item
        );
      } else {
        // Add the updated item if it's not already selected
        return [...prevSelectedData, updatedDataItem];
      }
    });

    // Update userWaysListData as well
    setUserWaysListData((prevData) => {
      return prevData.map((item) =>
        item._id === dataItem._id ? updatedDataItem : item
      );
    });
  };

  const handleSpecialApprove = async () => {
    console.log(selectedData);
    const response = await approveStatus(selectedData);

    // if (response?.data?.status === 200) {
    //   const response = await insertPaymentReceive(modelData);
    //   if (response?.data?.status === 200) {
    //     navigate("/main-view/invoice-list");
    //     swal("Done", "PI Approve Successfully", "success");
    //   } else if (response?.error?.status === 400) {
    //     swal("Not Possible!", response?.error?.data?.message, "error");
    //   }
    // }
  };

  const clientInfoOptions = clientInfoDropdown(clientInformation);

  const columns = [
    {
      name: "Sl.",
      selector: (userWaysListData, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Pi Date",
      selector: (userWaysListData) =>
        new Date(userWaysListData?.piDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Invoice No",
      selector: (userWaysListData) => userWaysListData?.invoiceNo,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Client Name",
      selector: (userWaysListData) => {
        const customerName = clientInformation?.find(
          (x) => x._id === userWaysListData?.customerID
        );
        return customerName ? customerName.clientName : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Payment Status",
      selector: (userWaysListData) => userWaysListData?.paymentId,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Quantity",
      selector: (userWaysListData) => {
        const totalQuantity = userWaysListData.detailsData.reduce(
          (acc, cur) => acc + parseInt(cur.quantity, 10),
          0
        );
        return totalQuantity;
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Amount",
      selector: (userWaysListData) => {
        const totalAmount = userWaysListData.detailsData.reduce(
          (acc, cur) => acc + parseInt(cur.totalAmount, 10),
          0
        );
        return totalAmount;
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Action",
      button: true,
      width: "150px",
      grow: 2,
      cell: (userWaysListData) => (
        <div className="d-flex justify-content-between align-content-center">
          <input
            type="checkbox"
            style={{
              display: "inline-block",
              width: "22px",
              height: "22px",
              border: "2px solid #fff",
            }}
            aria-label={`Checkbox for data item ${userWaysListData.id}`}
            checked={userWaysListData.specialApproveForDelivary} // Assuming status is a boolean field
            onChange={(e) =>
              handleCheckboxClick(userWaysListData, setSelectedData)
            } // Assuming handleCheckboxClick is defined elsewhere
          />

          <a
            target="_blank"
            className={` action-icon `}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Update item"
            style={{
              color: "orange",
              border: "2px solid orange",
              padding: "3px",
              borderRadius: "5px",
              marginLeft: "5px",
            }}
            onClick={() => {
              downloadInvoicePDF(
                userWaysListData,
                finishGoodsData,
                customerInfo,
                unitInfo,
                sizeInfo,
                paymentInfo,
                base64Logo,
                signature,
                { companyinfo },
                reportTitle
              );
            }}
          >
            <FontAwesomeIcon icon={faFilePdf}></FontAwesomeIcon>
          </a>
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

  const filteredItems = userWaysListData?.filter(
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
      <div className="d-block d-sm-flex justify-content-between align-items-center">
        {userWaysListData?.length > 0 ? (
          <>
            <div className="d-flex justify-content-end align-items-center">
              <div className="table-head-icon d-flex">
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
                          console.log(companyinfo);
                          if (companyinfo?.length !== 0 || undefined) {
                            // downloadProductionPDF(
                            //   { companyinfo },
                            //   reportTitle,
                            //   fromDate,
                            //   toDate
                            // );
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
                          //   handleProductionExcel(
                          //     filteredData,
                          //     finishGoods,
                          //     companyinfo,
                          //     reportTitle
                          //   );
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
          </>
        ) : (
          ""
        )}
      </div>
    );
  }, [filterText, resetPaginationToggle, companyinfo, userWaysListData]);

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
              <div>
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
                    customerID: "",
                  }));
                  setUserWaysListData([]);
                  setIsTableDisplay(false);
                }}
              >
                Clear
              </button>
            </div>
            <div>
              {userWaysListData?.length > 0 ? (
                <button
                  className="border-0 "
                  style={{
                    backgroundColor:
                      selectedData.length > 0 ? "#2DDC1B" : "#808080",
                    color: "white",
                    padding: "5px 10px",
                    fontSize: "14px",
                    borderRadius: "5px",
                    width: "100px",
                    height: "38px",
                    marginTop: "15px",
                    disabled: selectedData.length > 0 ? false : true,
                  }}
                  onClick={() => {
                    handleSpecialApprove();
                  }}
                >
                  Approve
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
          <div></div>
        </div>

        {isTableDispaly ? (
          <div
            className=" "
            style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}
          >
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
        ) : null}
      </div>
    </div>
  );
};

export default SpecialDeliveryTableList;
