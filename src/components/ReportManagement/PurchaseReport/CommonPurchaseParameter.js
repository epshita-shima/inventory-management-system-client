import React from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";

const CommonPurchaseParameter = ({
  fromDate,
  setFromDate,
  setFilters,
  toDate,
  setToDate,
  supplierOptions,
  filters,
  purchaseOptions,
  itemsOptions,
  handleApplyFilters,
  setIsTableDisplay,
  setIsPurchaseDetails,
  setIsPurchaseSummary
}) => {
  const reportStatusOptions = [
    { value: "purchasedetailsreport", label: "Purchase Details" },
    { value: "purchasesummaryreport", label: "Purchase Summary" },
  ];
  return (
    <div>
      <h3 className="fw-bold mt-1">Purchase Report</h3>
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
        <div
          style={{ width: "65%" }}
          className="d-flex justify-content-between align-items-center"
        >
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
                  return option.value === filters?.itemId;
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
                    itemId: e.value,
                  }));
                }}
              ></Select>
            </div>
          </div>
          <div className="w-100 ms-3">
            <label htmlFor="">Supplier Name</label>
            <br />
            <div className="w-100">
              <Select
                class="form-select"
                className="w-100"
                aria-label="Default select example"
                name="poinfo"
                options={supplierOptions}
                defaultValue={{
                  label: "Select Supper Name",
                  value: 0,
                }}
                value={supplierOptions.filter(function (option) {
                  return option.value === filters?.supplierId;
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
                    supplierId: e.value,
                  }));
                }}
              ></Select>
            </div>
          </div>

          <div className="w-100 ms-3">
            <label htmlFor="">PO Number</label>
            <br />
            <div className="w-100">
              <Select
                class="form-select"
                className="w-100"
                aria-label="Default select example"
                name="poinfo"
                options={purchaseOptions}
                defaultValue={{
                  label: "Select PO Number",
                  value: 0,
                }}
                value={purchaseOptions.filter(function (option) {
                  return option.value === filters?.poId;
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
                    poId: e.value,
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
                itemId: "",
                supplierId: "",
                poId: "",
                reportStatus: "",
              }));
              setFromDate(new Date().toLocaleDateString("en-CA"));
              setToDate(new Date().toLocaleDateString("en-CA"));
            }}
          >
            Clear
          </button>
        </div>
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
                setFilters(updatedFilters);
                if(e.value==="purchasedetailsreport"){
                  setIsPurchaseDetails(true)
                  setIsPurchaseSummary(false)
                }
                if(e.value==='purchasesummaryreport'){
                  setIsPurchaseSummary(true)
                  setIsPurchaseDetails(false)
                }
                await handleApplyFilters(updatedFilters);
              }}
            ></Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonPurchaseParameter;
