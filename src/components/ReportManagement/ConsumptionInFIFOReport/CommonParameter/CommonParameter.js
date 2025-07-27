import React from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";
import handleFIFOConsumtionReportExcel from "./../../../ReportProperties/Excel/handleFIFOConsumtionReportExcel";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";

const CommonParameter = ({
  setFilters,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  itemsOptions,
  filters,
  hangleGetConsumptionData,
  consumptionData,
  setShowTable,
  showTable,
}) => {
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const reportTitle = "FIFO Consumption Report";
  const reportStatusOptions = [{ value: "excel", label: "Excel" }];
  const parsedDate = new Date(fromDate);
  const firstDayOfMonth = new Date(
    parsedDate?.getFullYear(),
    parsedDate?.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    parsedDate?.getFullYear(),
    parsedDate?.getMonth() + 1,
    0
  );

  return (
    <div className=" px-5 mx-2">
      <h3 className="fw-bold mt-1">Consumption Report</h3>

      <div className="d-block d-lg-flex d-xl-flex justify-content-between align-items-center w-100">
        <div
          style={{ width: "60%" }}
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
              filterDate={(date) => date.getDate() === 1}
              onChange={(date) => {
                if (date > new Date()) {
                  swal({
                    title: "Select Valid Date",
                    text: "Date should be equal or earlier than today",
                    icon: "warning",
                    button: "OK",
                  });
                } else {
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    fromDate: date?.toLocaleDateString("en-CA"),
                  }));
                  setFromDate(date?.toLocaleDateString("en-CA"));
                }
              }}
            />
          </div>
          <div className="ms-2 ">
            <label htmlFor="">To Date</label>
            <br />
            <DatePicker
              dateFormat="y-MM-dd"
              className="text-center custom-datepicker-order-details-report"
              calendarClassName="custom-calendar-order-details-report"
              selected={toDate}
              required
              filterDate={(date) => {
                const lastDay = new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
                );
                return date.getDate() === lastDay.getDate();
              }}
              onChange={(toDate) => {
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  toDate: toDate?.toLocaleDateString("en-CA"),
                }));
                setToDate(toDate?.toLocaleDateString("en-CA"));
              }}
            />
          </div>
          <div className="w-100 ms-2">
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
                // value={itemsOptions.filter(function (option) {
                //   return option.value === filters?.productionItemName;
                // })}
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
                    itemId: e.value,
                  }));
                }}
              ></Select>
            </div>
          </div>
        </div>
      </div>

      <div className="d-block d-md-flex d-lg-flex d-xl-flex justify-content-between align-items-center w-100">
        <div className="d-flex ">
          <button
            className="border-0 "
            style={{
              backgroundColor: " #2DDC1B",
              color: "white",
              padding: "5px 10px",
              fontSize: "14px",
              borderRadius: "5px",
              width: "250px",
              height: "38px",
              marginTop: "15px",
            }}
            onClick={async (e) => {
              const updatedFilters = {
                ...filters,
                reportStatus: e.value,
              };
              setShowTable(true);
              setFilters(updatedFilters);
              await hangleGetConsumptionData(updatedFilters);
            }}
          >
            Show Consumption
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
              marginTop: "15px",
              marginLeft: "15px",
            }}
            onClick={() => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                fromDate: new Date().toLocaleDateString("en-CA"),
                toDate: new Date().toLocaleDateString("en-CA"),
                itemId: "",
              }));
              setFromDate(new Date().toLocaleDateString("en-CA"));
              setToDate(new Date().toLocaleDateString("en-CA"));
            }}
          >
            Clear
          </button>
        </div>
        {showTable && (
          <div className=" d-flex mt-3 align-items-center justify-content-start report-status-width">
            <label htmlFor="" className="w-25" style={{ fontSize: "24px" }}>
              Download
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
                    marginLeft: "10px",
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
                  handleFIFOConsumtionReportExcel(
                    consumptionData,
                    companyinfo,
                    reportTitle
                  );
                }}
              ></Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonParameter;
