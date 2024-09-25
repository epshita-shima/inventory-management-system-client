/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import {
  useGetAllInvoiceInformationQuery,
  useLazyGetFilteredInvoiceInfoQuery,
  useUpdateInvoiceSpecialPIApproveStatusMutation,
} from "../../../../redux/features/invoiceinformation/invoiceinfoApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import {
  clientInfoDropdown,
  invoiceListDropdown,
} from "../../../Common/CommonDropdown/CommonDropdown";
import swal from "sweetalert";
import reportImage from "../../../../assets/images/reportlogo.png";
import authorizesSingatureImage from "../../../../assets/images/Image_20240831165135.png";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { useGetAllPaymentInformationQuery } from "../../../../redux/features/paymnetinformation/paymentInfoApi";
import { downloadInvoicePDF } from "../../../ReportProperties/InvoiceReportDownload";
import SpecialDelivaryModal from "../SpecialDelivaryModal";
import getInitialFormValues from "../../../Common/CommonFromValues/CommonFromValues";
import getMakebyUser from "../../../Common/CommonMakeUser/CommonMakingUser";
import {
  useGetAllPaymentReceiveInformationQuery,
  useInsertPaymentReceiveInformationMutation,
} from "../../../../redux/features/paymentreceiveinfo/paymentreceiveApi";

const SpecialDeliveryTableList = ({ permission }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);
  const [selectedData, setSelectedData] = useState([]);
  const [approveStatus] = useUpdateInvoiceSpecialPIApproveStatusMutation();
  const [filters, setFilters] = useState({
    customerID: "",
    piNumber: "",
  });
  const [customerID, setCustomID] = useState("");
  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
  const { data: finishGoodsData } = useGetAllItemInformationQuery(undefined);
  const { data: unitInfo } = useGetAllItemUnitQuery(undefined);
  const { data: sizeInfo } = useGetAllItemSizeQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: paymentInfo } = useGetAllPaymentInformationQuery(undefined);
  const { data: invoiceInformation } =
    useGetAllInvoiceInformationQuery(undefined);
  const { data: previousPaymentInformation } =
    useGetAllPaymentReceiveInformationQuery(undefined);
  const [invoiceList, setInvoiceList] = useState([]);
  const [piNumber, setPINumber] = useState("");
  const [invoiveByInvoiceNumber, setInvoiveByInvoiceNumber] = useState([]);
  const [openModals, setOpenModals] = useState([]);
  const [show, setShow] = useState(false);
  const reportTitle = "PRO FORMA INVOICE";
  const base64Logo = reportImage;
  const signature = authorizesSingatureImage;
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const approveBy = getUserParse[0].username;
  const [trigger, { data: filteredDatas, error, isFetching }] =
    useLazyGetFilteredInvoiceInfoQuery();
  const [userWaysListData, setUserWaysListData] = useState([]);
  const invoiceListOption = invoiceListDropdown(invoiceList);
  const [insertPaymentReceive] = useInsertPaymentReceiveInformationMutation();
  const makebyUser = getMakebyUser();
  const [paymentStatusMood, setPaymentStatusMood] = useState("");
  const [formValues, setFormValues] = useState(
    getInitialFormValues(customerID, piNumber, makebyUser, new Date())
  );

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
    const paymentType = paymentInfo?.find((x) =>
      filteredDatas?.some((item) => item.paymentId === x._id)
    );

    setPaymentStatusMood(paymentType);
  }, [executeQuery, trigger, filters, filteredDatas, paymentInfo]);

  const handleApplyFilters = () => {
    setExecuteQuery(true); // Trigger the useEffect to fetch data
  };

  const handleCheckboxClick = (dataItem) => {
    const updatedDataItem = {
      ...dataItem,
      detailsData: {
        ...dataItem.detailsData,
        specialApproveForDelivary: !dataItem.specialApproveForDelivary,
        specialApproveBy: !dataItem.specialApproveForDelivary
          ? approveBy
          : null,
        specialApproveDate: !dataItem.specialApproveForDelivary
          ? new Date()
          : null,
      },
    };

    setSelectedData((prevSelectedData) => {
      if (
        prevSelectedData?.some(
          (item) => item.detailsData._id === dataItem.detailsData._id
        )
      ) {
        return prevSelectedData.filter(
          (item) =>
            item.detailsData._id !== dataItem.detailsData._id && dataItem
        );
      } else {
        return [...prevSelectedData, updatedDataItem];
      }
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

  const groupByClient = (data) => {
    const groupedDataMap = new Map();

    data?.forEach((payment) => {
      payment.detailsData.forEach((detail) => {
        // Create a unique key based on clientId, piNumber, and itemId
        const key = `${payment.customerID}_${payment.invoiceNo}_${detail.itemId}`;
        // If the key doesn't exist, create a new entry
        groupedDataMap.set(key, {
          ...payment,
          detailsData: {
            ...detail,
          },
          isGroup: false,
        });
      });
    });

    // Convert the map back to an array
    const groupedData = Array.from(groupedDataMap.values());
    return groupedData;
  };

  const handlePaymentMethodChange = (e, index) => {
    if(e.target.checked){
      const newOpenModals = [...openModals];
      newOpenModals[index] = true; // Set the modal open for the specific row
      setOpenModals(newOpenModals);
      setShow(true);
    }
    else{
      handleCloseModal()
    }
  };

  const handleCloseModal = (index) => {
    const newOpenModals = [...openModals];
    newOpenModals[index] = false; // Close the modal for the specific row
    setOpenModals(newOpenModals);
    setFormValues((prev) => {
      const temp_details = [...prev.detailsData];
      const newDetail = {
        ...temp_details[0],
      };
      newDetail["itemId"] ='';
      newDetail["paymentStatus"] = "cash";
      newDetail["paymentMethod"] = "cash";
      newDetail["unitPrice"] = '';
      newDetail["amount"] ='';
      newDetail["quantity"] = '';
      newDetail["paymentReceiveDate"] = '';
     
      temp_details[0] = newDetail;
      return {
        ...prev,
        clientId: filters.customerID,  // Assuming you are getting clientId from filters
        piNumber: filters.piNumber, 
        makeBy:makebyUser,
        detailsData: [...temp_details],
      };
    });
    setSelectedData([])
  };

  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Pi Date",
      selector: (row) => new Date(row?.piDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Client Name",
      selector: (row) => {
        const customerName = clientInformation?.find(
          (x) => x._id === row?.customerID
        );
        return customerName ? customerName.clientName : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Invoice No",
      selector: (row) => row?.invoiceNo,
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },
    {
      name: "Invoice No",
      selector: (row) => {
        const itemName = finishGoodsData.find(
          (item) => item._id === row.detailsData.itemId
        );
        const sizeDetails = sizeInfo.find(
          (size) => size._id === itemName.sizeId
        );
        return itemName
          ? itemName.itemName + ` (${sizeDetails.sizeInfo})`
          : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "280px",
    },
    {
      name: "Payment Status",
      selector: (row) => {
        const paymentType = paymentInfo?.find((x) => x._id === row?.paymentId);
        return paymentType ? paymentType.paymentMode : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },
    {
      name: "Quantity",
      selector: (row) => row.detailsData.quantity,
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },
    {
      name: "Amount",
      selector: (row) => row.detailsData.totalAmount,
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },
    {
      name: "Action",
      button: true,
      width: "150px",
      grow: 2,
      cell: (row, index) => (
        <div className="d-flex justify-content-between align-content-center">
          {
            paymentStatusMood?.paymentMode == "Cash" ? 
              (<input
              type="checkbox"
              style={{
                display: "inline-block",
                width: "22px",
                height: "22px",
                border: "2px solid #fff",
              }}
              aria-label={`Checkbox for data item ${row.id}`}
              checked={ selectedData?.some((item) => item.detailsData._id === row.detailsData._id)} 
              onChange={(e) => {
                const paymentType = paymentInfo?.find(
                  (x) => x._id === row?.paymentId
                );
                console.log(paymentType.paymentMode);
                if (paymentType.paymentMode == "Cash") {
                  handlePaymentMethodChange(e, index);
                  handleCheckboxClick(row);
                } else {
                  handleCheckboxClick(row);
                }
              }}
            />) : (  <input
              type="checkbox"
              style={{
                display: "inline-block",
                width: "22px",
                height: "22px",
                border: "2px solid #fff",
              }}
              aria-label={`Checkbox for data item ${row.id}`}
              checked={ selectedData?.some((item) => item.detailsData._id === row.detailsData._id)} 
              onChange={(e) => {
                const paymentType = paymentInfo?.find(
                  (x) => x._id === row?.paymentId
                );
                console.log(paymentType.paymentMode);
                if (paymentType.paymentMode == "Cash") {
                  handlePaymentMethodChange(e, index);
                  handleCheckboxClick(row);
                } else {
                  handleCheckboxClick(row);
                }
              }}
            />)         
          }
          
          {openModals[index] && (
            <SpecialDelivaryModal
              row={row}
              filters={filters}
              makebyUser={makebyUser}
              formValues={formValues}
              selectedData={selectedData}
              setFormValues={setFormValues}
              finishGoodsData={finishGoodsData}
              sizeInfo={sizeInfo}
              show={openModals[index]}
              handleClose={() => handleCloseModal(index)}
              index={index}
              approveStatus={approveStatus}
              insertPaymentReceive={insertPaymentReceive}
            />
          )}
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

  const filteredItems = groupByClient(filteredDatas)?.filter(
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
            style={{ width: "75%" }}
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
                    const matchedInvoice = invoiceInformation?.filter(
                      (invoice) =>
                        invoice.customerID === e.value &&
                        invoice.isApproved === true &&
                        previousPaymentInformation.every(
                          (item) => item.piNumber !== invoice.invoiceNo
                        )
                    );

                    if (matchedInvoice?.length > 0) {
                      setInvoiceList(matchedInvoice);
                    } else {
                      swal({
                        title: "Sorry!",
                        text: "This Client has no PI.",
                        icon: "warning",
                        button: "OK",
                      });
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        piNumber: "",
                      }));
                      setInvoiceList([]);
                    }
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      customerID: e.value,
                    }));
                  }}
                ></Select>
              </div>
            </div>
            <div className="w-50 ms-2">
              <label htmlFor="">PI Number</label>
              <div>
                <Select
                  class="form-select"
                  className="w-100 mb-3"
                  aria-label="Default select example"
                  name="client pino"
                  options={invoiceListOption}
                  defaultValue={{
                    label: "Select PI Number",
                    value: 0,
                  }}
                  value={invoiceListOption?.filter(function (option) {
                    return option?.label === piNumber;
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
                      zIndex: 9999,
                      height: "auto",
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
                    setPINumber(e.label);
                    const invoiceListMatchingData = invoiceList.find(
                      (data) => data._id === e.value
                    );
                    setInvoiveByInvoiceNumber(invoiceListMatchingData);
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      piNumber: e.value,
                    }));
                  }}
                ></Select>
              </div>
            </div>
            <div className="ms-2">
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
            <div className="ms-2">
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
                    ...prevFilters,
                    customerID: "",
                    piNumber: "",
                  }));
                  setPINumber("");
                  setUserWaysListData([]);
                  setIsTableDisplay(false);
                }}
              >
                Clear
              </button>
            </div>
            <div className="ms-2">
              {paymentStatusMood?.paymentMode == "Cash" ? (
                ""
              ) : (
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
