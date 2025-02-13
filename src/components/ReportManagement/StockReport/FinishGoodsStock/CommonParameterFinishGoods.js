import React from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";

const CommonParameterFinishGoods = ({
  fromDate,
  setFromDate,
  setFilters,
  toDate,
  setToDate,
  filters,
  handleApplyFilters,
  setIsTableDisplay
}) => {
  return (
    <div>
      <h3 className="fw-bold mt-1">Finish Goods Stock Report</h3>

      <div className="d-block d-lg-flex d-xl-flex justify-content-between align-items-center w-50">
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

        <div className="ms-0 ms-lg-3 ms-xl-3">
          <label htmlFor="">To Date</label>
          <br />
          <DatePicker
            dateFormat="y-MM-dd"
            className="text-center custom-datepicker-order-details-report"
            calendarClassName="custom-calendar-order-details-report"
            selected={toDate}
            required
            onChange={(toDate) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                toDate: toDate?.toLocaleDateString("en-CA"),
              }));
              setToDate(toDate?.toLocaleDateString("en-CA"));
            }}
          />
        </div>

        <div className="d-flex ms-0 ms-lg-2">
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
                marginTop: "25px",
              }}
              onClick={() => {
                handleApplyFilters(filters);
              }}
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
                marginTop: "25px",
                marginLeft: "5px",
              }}
              onClick={() => {
                setIsTableDisplay(false);
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  fromDate: new Date().toLocaleDateString("en-CA"),
                  toDate: new Date().toLocaleDateString("en-CA"),
                }));
                setFromDate(new Date().toLocaleDateString("en-CA"));
                setToDate(new Date().toLocaleDateString("en-CA"));
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonParameterFinishGoods;
