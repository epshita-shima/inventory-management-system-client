import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const RawConsumptionLineChat = ({handleApplyFilters,purchaseOptions,filters,fromDate,toDate,setFilters,setToDate,setFromDate}) => {
  return (
    <div className="row mt-1 g-3">
    <div className="col-sm-4">
      <div className="d-flex flex-column">
        <label className="fw-semibold">Report Status</label>
        <Select
          class="form-select"
          aria-label="--Select sales report--"
          name="reportinfo"
          options={purchaseOptions}
          value={purchaseOptions?.find((option) => option.value === filters?.reportStatus)}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              width: "100%",
              borderColor: state.isFocused ? "#2DDC1B" : "#ccc",
              borderWidth: "1px",
              borderRadius: "5px",
              height: "36px", // Same as DatePicker
              minHeight: "36px",
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
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
            setFilters((prevFilters) => ({
              ...prevFilters,
              itemId: e.value,
            }));
          }}
        />
      </div>
    </div>

    <div className="col-sm-3">
      <div className="d-flex flex-column">
        <label className="fw-semibold">From Date</label>
        <DatePicker
          dateFormat="y-MM-dd"
          className="form-control text-center "
          calendarClassName="custom-calendar-order-details-report"
          selected={fromDate}
          required

          style={{ height: "38px" }}
          onChange={(fromDate) => {
            if (fromDate > toDate) {
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
  
    <div className="col-sm-3">
      <div className="d-flex flex-column">
        <label className="fw-semibold">To Date</label>
        <DatePicker
          dateFormat="y-MM-dd"
          className="form-control text-center"
          calendarClassName="custom-calendar-sales-chart"
          selected={toDate}
          required
          style={{ height: "38px" }}
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
    <div className="col-sm-2
    ">
     <FontAwesomeIcon className="fs-1 text-success mt-5 " icon={faSearch} onClick={async()=>{
       const updatedFilters = {
        ...filters
      };

       await handleApplyFilters(updatedFilters)
     }}></FontAwesomeIcon>
    </div>
  </div>
  
  );
}

export default RawConsumptionLineChat
