import React from 'react'
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";
const CommonParameter = ({fromDate,setFromDate,setFilters,toDate,setToDate,clientInfoOptions,filters,piInfoOptions,reportStatusOptions,handleApplyFilters}) => {
  return (
    <div>
        <h3 className="fw-bold mt-1"> Order Details Report</h3>
        <hr />

        <div className="d-flex justify-content-between align-items-center w-100">
          <div
            style={{ width: "34%" }}
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
            style={{ width: "65%" }}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="w-100">
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
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      clientId: e.value,
                    }));
                  }}
                ></Select>
              </div>
            </div>

            <div className="w-100 ms-3">
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

        <div
          style={{ width: "100%" }}
          className="d-flex justify-content-between align-items-center"
        >
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

          <div
            className=" d-flex mt-5 align-items-center justify-content-center"
            style={{ width: "40%" }}
          >
            <label htmlFor="" className="w-50">
              Report Status
            </label>
            <div className="w-100">
              <Select
                class="form-select"
                aria-label="--Select sales report --"
                name="reportinfo"
                options={reportStatusOptions}
                value={reportStatusOptions.filter(function (option) {
                  return option.value === filters.reportStatus;
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
                  const updatedFilters = {
                    ...filters,
                    reportStatus: e.value,
                  };

                  // Update the filters state
                  setFilters(updatedFilters);

                  await handleApplyFilters(updatedFilters);
                }}
              ></Select>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CommonParameter
