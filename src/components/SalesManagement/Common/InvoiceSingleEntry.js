import { Field } from "formik";
import React, { useState } from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";
import { clientInfoDropdown } from "../../Common/CommonDropdown/CommonDropdown";

const InvoiceSingleEntry = ({ values, setFieldValue, touched, errors,serialValue }) => {
  const [piDate, setPiDate] = useState(new Date());
  const [expireDate, setExpireDate] = useState(new Date());
  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);

  console.log(values)
  const customerOptions=clientInfoDropdown(customerInfo)
  const currencyOptions = [
    {
      value: "BDT",
      label: "BDT",
    },
    {
      value: "USD",
      label: "USD",
    },
  ];
  return (
    <div class="row row-cols-1 row-cols-lg-3">
      <div class="col-sm-12 col-md-6 col-lg-3">
        <label htmlFor="piDate">PI Date</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between mt-2">
          <DatePicker
            dateFormat="y-MM-dd"
            className="text-center custom-datepicker-production"
              value={piDate}
            calendarClassName="custom-calendar"
            selected={piDate}
            required
            onChange={(piDate) => {
              setPiDate(piDate.toLocaleDateString("en-CA"))
              setFieldValue("PIDate", piDate.toLocaleDateString("en-CA"));
            }}
          />
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-3">
        <label htmlFor="piDate">Expire Date</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between mt-2">
          <DatePicker
            dateFormat="y-MM-dd"
            className="text-center custom-datepicker-production"
            value={expireDate}
            calendarClassName="custom-calendar"
            selected={expireDate}
            required
            onChange={(expireDate) => {
              setExpireDate(expireDate.toLocaleDateString("en-CA"));
              setFieldValue(
                "expireDate",
                expireDate.toLocaleDateString("en-CA")
              );
            }}
          />
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-3  d-none">
        <label htmlFor="paymentId">Invoice No</label>
        <br />
        <Field
          type="text"
          name={`totalHour`}
          placeholder="Total Hour"
          disabled
          // value={}
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
        />
      </div>

      <div class="col-sm-12 col-md-6 col-lg-3">
        <label htmlFor="customerName">Customer Name</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between">
          <div className="w-100">
            <Select
              class="form-select"
              className="w-100 mb-3"
              aria-label="Default select example"
              name="customerName"
              options={customerOptions}
              defaultValue={{
                label: "Select Customer Name",
                value: 0,
              }}
              value={customerOptions.filter(function (option) {
                      return option.value === values.customerID;
                    })
              }
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
                const removeDashFromDate = new Date(piDate).toLocaleDateString("en-CA");
                const removeDash = removeDashFromDate.replace(/-/g, "");
                const shortName=e.clientShortName;
                const makeBatchNo = `MEB-${shortName}-${removeDash}-${
                  serialValue?.serialNo === undefined ? "1" : serialValue?.serialNo
                }`;
              
                setFieldValue("invoiceNo", makeBatchNo);
                setFieldValue('customerID',e.value)

              }}
            ></Select>

            {/* {touched.productionItemName &&
              errors.productionItemName && (
                <div className="text-danger">{errors.productionItemName}</div>
              )} */}
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-3">
        <label htmlFor="receipeQtyRatio">Currency</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between">
          <div className="w-100">
            <Select
              class="form-select"
              className="w-100 mb-3"
              aria-label="Default select example"
              name="receipeinfo"
              options={currencyOptions}
              defaultValue={{
                label: "Select currency",
                value: 0,
              }}
              value={ currencyOptions.filter(function (option) {
                      return option.value === values.currency;
                    })
              }
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
                setFieldValue('currency',e.value)
              }}
            ></Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSingleEntry;
