import React, { useState } from 'react'
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";

const FinishGoodsProductionLineChart = () => {
  const [fromDate,setFromDate]=useState(new Date())
  const [toDate,setToDate]=useState(new Date())
  const [filters,setFilters]=useState({
    fromDate: new Date(fromDate).toLocaleDateString("en-CA"),
    toDate: new Date(toDate).toLocaleDateString("en-CA"),
    itemId: "",
    reportStatus: "",
  });
  const productionOptions=[{}]

  return (
    <div className="row mt-4">
          <div className="col-sm-6">
          <div
          className=" d-flex mt-5 align-items-center justify-content-center report-status-width"
          // style={{ width: "40%" }}
        >
          <label htmlFor="" className="w-100">
            Report Status
          </label>
          <div className="w-100">
            <Select
              class="form-select"
              aria-label="--Select sales report --"
              name="reportinfo"
              options={productionOptions}
              value={productionOptions.filter(function (option) {
                return option.value === filters?.reportStatus;
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
              onChange={async (e) => {
       
              }}
            ></Select>
          </div>
        </div>
          </div>
          <div className="col-sm-6">
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
          </div>
          <div className="col-sm-6">
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
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  toDate: toDate?.toLocaleDateString("en-CA"),
                }));
                setToDate(toDate?.toLocaleDateString("en-CA"));
              }}
            />
          </div>
          </div>
        </div>
  )
}

export default FinishGoodsProductionLineChart
