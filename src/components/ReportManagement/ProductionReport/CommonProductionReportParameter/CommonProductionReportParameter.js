import React from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";
import "./CommonProductionReportParameter.css";

const CommonProductionReportParameter = ({
  setFilters,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  itemsOptions,
  filters,
  handleApplyFilters,
  setIsProductionDatewiseDetailsReport,
  setIsTableDisplay,
  batchOptions,
  setIsProductionDatewiseSummaryReport,
}) => {
  const reportStatusOptions = [
    { value: "datewiseproductiondetails", label: "Production Details" },
    { value: "datewiseproductionsummary", label: "Production Summary" },
  ];

  return (
    <div>
      <h3 className="fw-bold mt-1">Producton Report</h3>
      <hr />

      <div className="d-block d-lg-flex d-xl-flex justify-content-between align-items-center w-100">
        <div
          style={{ width: "34%" }}
          className="d-block d-md-flex d-lg-flex d-xl-flex justify-content-between align-items-center"
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
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  toDate: toDate?.toLocaleDateString("en-CA"),
                }));
                setToDate(toDate?.toLocaleDateString("en-CA"));
              }}
            />
          </div>
        </div>
        <div className="d-md-flex d-lg-flex d-xl-flex justify-content-between align-items-center item-batch-width">
          <div className="w-100">
            <label htmlFor="">Item Name</label>
            <br />
            <div className="w-100">
              <Select
                class="form-select"
                className="w-100"
                aria-label="Default select example"
                name="iteminfo"
                options={itemsOptions}
                defaultValue={{
                  label: "Select Client Name",
                  value: 0,
                }}
                value={itemsOptions.filter(function (option) {
                  return option.value === filters?.productionItemName;
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
                    productionItemName: e.value,
                  }));
                }}
              ></Select>
            </div>
          </div>

          <div className="w-100 ms-0 ms-md-3 ms-lg-3 ms-xl-3">
            <label htmlFor="">Batch No</label>
            <br />
            <div className="w-100">
              <Select
                class="form-select"
                className="w-100"
                aria-label="Default select example"
                name="poinfo"
                options={batchOptions}
                defaultValue={{
                  label: "Select Batch Number",
                  value: 0,
                }}
                value={batchOptions.filter(function (option) {
                  return option.value === filters?.batchNo;
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
                    batchNo: e.value,
                  }));
                }}
              ></Select>
            </div>
          </div>
        </div>
      </div>

      <div className="d-block d-md-flex d-lg-flex d-xl-flex justify-content-between align-items-center w-100">
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
            }}
            onClick={() => {
              setIsTableDisplay(false);
              setFilters((prevFilters) => ({
                ...prevFilters,
                fromDate: new Date().toLocaleDateString("en-CA"),
                toDate: new Date().toLocaleDateString("en-CA"),
                productionItemName: "",
                batchNo: "",
                reportStatus: "",
              }));
              setFromDate(new Date().toLocaleDateString("en-CA"));
              setToDate(new Date().toLocaleDateString("en-CA"));
            }}
          >
            Clear
          </button>
        </div>
        <div className=" d-flex mt-5 align-items-center justify-content-center report-status-width">
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
                const updatedFilters = {
                  ...filters,
                  reportStatus: e.value,
                };

                if (e.value === "datewiseproductiondetails") {
                  setIsProductionDatewiseDetailsReport(true);
                  setIsProductionDatewiseSummaryReport(false);
                } else if (e.value === "datewiseproductionsummary") {
                  setIsProductionDatewiseSummaryReport(true);
                  setIsProductionDatewiseDetailsReport(false);
                } else if (e.value === "itemwiseproductiondetails") {
                  setIsProductionDatewiseSummaryReport(false);
                  setIsProductionDatewiseDetailsReport(false);
                }

                setFilters(updatedFilters);
                await handleApplyFilters(updatedFilters);
              }}
            ></Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonProductionReportParameter;
