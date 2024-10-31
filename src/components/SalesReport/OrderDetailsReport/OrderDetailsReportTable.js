import React, { useEffect, useState } from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "./OrderDetailsReportTable.css";
import swal from "sweetalert";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
import {
  clientInfoDropdown,
  finishGoodsWithSizeItemDropdown,
  invoiceListDropdown,
} from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";
import {
  useGetAllInvoiceInformationQuery,
  useLazyGetFilteredForReportInvoiceInfoQuery,
} from "../../../redux/features/invoiceinformation/invoiceinfoApi";
const OrderDetailsReportTable = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [filters, setFilters] = useState({
    fromDate: new Date(fromDate).toLocaleDateString('en-CA'),
    toDate: new Date(toDate).toLocaleDateString('en-CA'),
    itemId: "",
    clientId: "",
    piId: "",
  });
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const { data: finishGoodsItemInfo } =
    useGetAllItemInformationQuery(undefined);
  const { data: itemSizeInfo } = useGetAllItemSizeQuery(undefined);
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);
  const { data: piInformation } = useGetAllInvoiceInformationQuery(undefined);
  const itemOptions = finishGoodsWithSizeItemDropdown(
    finishGoodsItemInfo,
    itemSizeInfo
  );
  const clientInfoOptions = clientInfoDropdown(clientInformation);
  const piInfoOptions = invoiceListDropdown(piInformation);

  const [trigger, { data: filteredDatas }] =useLazyGetFilteredForReportInvoiceInfoQuery();
console.log(filters)
  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      trigger(filters);
      setExecuteQuery(false);
    }
  }, [executeQuery, trigger, filters]);

  const handleApplyFilters = async () => {
    setExecuteQuery(true);
    trigger(); 
  };
  console.log(filteredDatas)
  return (
    <div
      className="row px-5 mx-2"
      style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
      <div>
        <h3 className="fw-bold mt-1"> Order Details Report</h3>
        <hr />

        <div className="d-flex justify-content-between align-items-center w-100">
          <div
            style={{ width: "23%" }}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="">
              <label htmlFor="">From Date</label>
              <br />
              <DatePicker
                dateFormat="y-MM-dd"
                className="text-center custom-datepicker-order-details-report "
                calendarClassName="custom-calendar-order-details-report"
                selected={fromDate}
                required
                onChange={(fromDate) => {
                  console.log(fromDate);
                  if (fromDate > new Date()) {
                    swal({
                      title: "Select Valid Date",
                      text: "Date should be equal or earlier than today",
                      icon: "warning",
                      button: "OK",
                    });
                  } else {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      fromDate: fromDate?.toLocaleDateString("en-CA"),
                    }));
                    setFromDate(fromDate?.toLocaleDateString("en-CA"));
                  }
                }}
              />
            </div>
            <div className=" ">
              <label htmlFor="">To Date</label>
              <br />
              <DatePicker
                dateFormat="y-MM-dd"
                className="text-center custom-datepicker-order-details-report"
                calendarClassName="custom-calendar-order-details-report"
                selected={toDate}
                required
                onChange={(toDate) => {
                  console.log(toDate);

                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    toDate: toDate?.toLocaleDateString("en-CA"),
                  }));
                  setToDate(toDate?.toLocaleDateString("en-CA"));
                }}
              />
            </div>
          </div>
          <div
            style={{ width: "75%" }}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="w-100 ms-2">
              <label htmlFor="">Item Name</label>
              <br />
              <div className="w-100">
                <Select
                  class="form-select"
                  className="w-100"
                  aria-label="Default select example"
                  name="poinfo"
                  options={itemOptions}
                  defaultValue={{
                    label: "Select Client Name",
                    value: 0,
                  }}
                  value={itemOptions.filter(function (option) {
                    return option.value === filters.itemId;
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
                    // const matchedInvoice = invoiceData?.filter(
                    //   (invoice) =>
                    //     invoice.customerID === e.value &&
                    //     invoice.isApproved === true
                    // );
                    // if (matchedInvoice?.length > 0) {
                    //   setFilterInvoiceList(matchedInvoice);
                    // } else {
                    //   setFilterInvoiceList([]);
                    // }
                    // setClientId(e.value);
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      itemId: e.value,
                    }));
                  }}
                ></Select>
              </div>
            </div>
            <div className="w-100 ms-2">
              <label htmlFor="">Client Name</label>
              <br />
              <div className="w-100">
                <Select
                  class="form-select"
                  className="w-100"
                  aria-label="Default select example"
                  name="poinfo"
                  options={clientInfoOptions}
                  defaultValue={{
                    label: "Select Client Name",
                    value: 0,
                  }}
                  value={clientInfoOptions.filter(function (option) {
                    return option.value === filters.clientId;
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
                    // const matchedInvoice = invoiceData?.filter(
                    //   (invoice) =>
                    //     invoice.customerID === e.value &&
                    //     invoice.isApproved === true
                    // );
                    // if (matchedInvoice?.length > 0) {
                    //   setFilterInvoiceList(matchedInvoice);
                    // } else {
                    //   setFilterInvoiceList([]);
                    // }
                    // setClientId(e.value);
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      clientId: e.value,
                    }));
                  }}
                ></Select>
              </div>
            </div>

            <div className="w-100 ms-2">
              <label htmlFor="">PI Number</label>
              <br />
              <div className="w-100">
                <Select
                  class="form-select"
                  className="w-100"
                  aria-label="Default select example"
                  name="poinfo"
                  options={piInfoOptions}
                  defaultValue={{
                    label: "Select PI Number",
                    value: 0,
                  }}
                  value={piInfoOptions.filter(function (option) {
                    return option.value === filters.piId;
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
                    // console.log(e);
                    // setPiNumber(e.value);
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      piId: e.value,
                    }));
                  }}
                ></Select>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: "25%" }}>
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
              marginTop: "25px",
            }}
            onClick={handleApplyFilters}
          >
            Show
          </button>

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
              marginLeft: "5px",
              marginTop: "25px",
            }}
            onClick={() => {
              // setIsTableDisplay(false);
              // setFilters((prevFilters) => ({
              //   ...prevFilters,
              //   clientId: "",
              //   piNumber: "",
              // }));
              // setClientId("");
              // setPiNumber("");
            }}
          >
            Clear
          </button>
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
              marginLeft: "5px",
              marginTop: "25px",
            }}
            // onClick={handleApplyFilters}
          >
            PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsReportTable;
