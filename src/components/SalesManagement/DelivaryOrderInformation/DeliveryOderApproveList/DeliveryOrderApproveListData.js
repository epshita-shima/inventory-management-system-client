/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { clientInfoDropdown } from "../../../Common/CommonDropdown/CommonDropdown";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import {
  useLazyGetFilteredDeliveryOrderQuery,
  useUpdateDeliveryOrderApproveStatusMutation,
} from "../../../../redux/features/deliveryorderinformation/deliveryinfoApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import swal from "sweetalert";
import {
  faCheckToSlot,
  faDownload,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { useGetAllInvoiceInformationQuery } from "../../../../redux/features/invoiceinformation/invoiceinfoApi";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/finishgoodsinfoApi";
import { downloadDeliveryOrderPDF } from "../../../ReportProperties/PDF/HeaderFooter";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import getMakebyUser from "../../../Common/CommonMakeUser/CommonMakingUser";

const DeliveryOrderApproveListData = ({ permission }) => {
  const reportTitle = "DELIVERY ORDER INFORMATION";
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [filters, setFilters] = useState({
    approveStatus: "",
  });
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);
  const [trigger, { data: filteredDatas, error, isFetching }] =
    useLazyGetFilteredDeliveryOrderQuery();
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: invoiceInformation } =
    useGetAllInvoiceInformationQuery(undefined);
  const { data: itemsizeinfo } = useGetAllItemSizeQuery(undefined);
  const { data: finishGoodsInfo } = useGetAllItemInformationQuery(undefined);
  const [insertApproveStatus] = useUpdateDeliveryOrderApproveStatusMutation();
  const clientInfoOptions = clientInfoDropdown(clientInformation);

  const transformedDOData = filteredDatas?.flatMap((itemDetails) =>
    itemDetails.detailsData.map((detail) => ({
      ...itemDetails,
      detailsData: detail,
    }))
  );
  const handleApproveStatus = async (e, doData) => {
    const updatedObject = {
      ...doData,
      approveStatus: true, // Toggle approveStatus
      approveBy: getMakebyUser(),
      approveDate: new Date(),
    };
    console.log(updatedObject);
    const response = await insertApproveStatus(updatedObject);
    if (response.data.status === 200) {
      swal("Done", "Data Update status Successfully", "success");
      setExecuteQuery(true);
    } else {
      swal(
        "Not Possible!",
        "An problem occurred while updating the data",
        "error"
      );
    }
  };

  const approveTypeOptions = [
    { value: true, label: "Approved" },
    { value: false, label: "Unapproved" },
  ];

  const handleApplyFilters = () => {
    if (filters.approveStatus !== "") {
      setExecuteQuery(true);
    }
  };

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      trigger(filters)
        .unwrap()
        .then((response) => {
          console.log("Data fetched:", response);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        })
        .finally(() => {
          setExecuteQuery(false);
        });
    }
  }, [executeQuery, trigger, filters, filteredDatas]);

  console.log(selectedData);

  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Client Name",
      selector: (row) => {
        const piInfo = invoiceInformation?.find((x) => x._id === row?.piId);
        const clientInfo = clientInformation?.find(
          (x) => x._id == piInfo?.customerID
        );
        return clientInfo ? clientInfo?.clientName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "PI Number",
      selector: (row) => {
        const piNumber = invoiceInformation?.find(
          (x) => x._id === row?.piId
        );
        return piNumber ? piNumber.invoiceNo : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "200px",
    },

    {
      name: "DO Number",
      selector: (row) => row?.doNo,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Item Name",
      selector: (row) => {
        const itemName = finishGoodsInfo?.find(
          (x) => x._id === row?.detailsData.itemId
        );
        return itemName ? itemName.itemName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Delivery Quantity",
      selector: (row) => row.detailsData?.deliverQty,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Delivery Status",
      selector: (row) => {
        return row.isApproved ? (
          <p className="text-success">Approved</p>
        ) : (
          <p className="text-danger fw-bold">Not Delivered</p>
        );
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
      cell: (row) => (
        <div className="d-flex justify-content-between align-content-center">
          {row.approveStatus === false && (
            <a
              target="_blank"
              className="action-icon"
              data-toggle="tooltip"
              data-placement="bottom"
              title="approve item"
              style={{
                textDecoration: "none",
                color: "red",
                // fontSize: "22px",
                textAlign: "center",
                fontWeight: "bold",
                border: `${
                  transformedDOData?.items?.length == 0
                    ? "2px solid gray"
                    : "2px solid red"
                }`,
                padding: "3px",
                borderRadius: "5px",
              }}
              onClick={(e) => {
                handleApproveStatus(e, row);
              }}
            >
              <FontAwesomeIcon icon={faCheckToSlot}></FontAwesomeIcon>
            </a>
          )}

          {permission?.isPDF ? (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="PDF Item"
              style={{
                color: "orange",
                border: "2px solid orange",
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "5px",
              }}
              onClick={() => {
                downloadDeliveryOrderPDF(
                  row,
                  transformedDOData,
                  invoiceInformation,
                  clientInformation,
                  finishGoodsInfo,
                  itemsizeinfo,
                  { companyinfo },
                  reportTitle
                );
              }}
            >
              <FontAwesomeIcon icon={faFilePdf}></FontAwesomeIcon>
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

  const filteredItems = transformedDOData?.filter(
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
        {filteredDatas?.length && (
          <div className="mt-2 mt-sm-0 ms-2 mb-2 mb-sm-0">
            <FilterComponent
              onFilter={(e) => setFilterText(e.target.value)}
              onClear={handleClear}
              filterText={filterText}
            />
          </div>
        )}
      </div>
    );
  }, [filterText, resetPaginationToggle, filteredDatas]);

  return (
    <div className="row px-5 mx-4">
      <div className="col userlist-table">
        <div>
          <h3 className="fw-bold mt-1">Delivery Order Approve Status</h3>
          <hr />
          <div
            className="d-lg-flex justify-content-lg-between align-items-lg-center d-md-block"
            style={{ width: "45%" }}
          >
            {/* <div className="w-50">
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
                  </div> */}
            <div className="w-50">
              <label htmlFor="">Approve Type</label>
              <div>
                <Select
                  class="form-select"
                  className="w-100 mb-3"
                  aria-label="Default select example"
                  name="client pino"
                  options={approveTypeOptions}
                  defaultValue={{
                    label: "Select PI Number",
                    value: 0,
                  }}
                  value={approveTypeOptions?.filter(function (option) {
                    return option?.value === filters.approveStatus;
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
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      approveStatus: e.value,
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
                    ...prevFilters,
                    approveStatus: "",
                  }));
                  setIsTableDisplay(false);
                }}
              >
                Clear
              </button>
            </div>
          </div>
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

export default DeliveryOrderApproveListData;
