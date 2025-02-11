import React, { useEffect, useState } from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Field } from "formik";
import swal from "sweetalert";
import "./DeliverReturnSinglePart.css";
import { deliveryOrderDropdown } from "../../Common/CommonDropdown/CommonDropdown";

const DeliverReturnSinglePart = ({
  deliveryOrderDataInformation,
  values,
  setFieldValue,
  touched,
  errors,
  returnDate,
  setReturnDate,
  piNumberOptions,
  setDoDetailsFilteredData,
  doInformation
}) => {
  
  const [filteredDeliveryOrderData, setFilteredDeliveryOrderData] = useState(
    []
  );
  const matchedDeliverInfo = doInformation?.filter((deliverOrder) => 
    filteredDeliveryOrderData.some((item) => item.piId === deliverOrder.piId)
  );
  const deliveryOptions = deliveryOrderDropdown(matchedDeliverInfo);

  return (
    <div class="row row-cols-1 row-cols-lg-4">
      <div class="col-sm-12 col-md-6 col-lg-4 mt-2">
        <label htmlFor="paymentId">Return Date</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between mt-2">
          <DatePicker
            dateFormat="y-MM-dd"
            className="text-center custom-datepicker-delivered-return"
            value={returnDate}
            calendarClassName="custom-calendar"
            selected={returnDate}
            required
            onChange={(returnDate) => {
              setReturnDate(returnDate.toLocaleDateString("en-CA"));
              setFieldValue(
                "productionDate",
                returnDate.toLocaleDateString("en-CA")
              );
            }}
          />
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-4 mt-3">
        <label htmlFor="paymentId">PI Number</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between">
          <div className="w-100">
            <Select
              class="form-select"
              className="w-100 mb-3"
              aria-label="Default select example"
              name="piId"
              options={piNumberOptions}
              defaultValue={{
                label: "Select PI Number",
                value: 0,
              }}
              value={piNumberOptions.filter(function (option) {
                return option.value === values.piId;
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
                setFieldValue("piId", e.value);
                const filteredDeliveryData =
                  deliveryOrderDataInformation?.filter(
                    (order) => order.piId == e.value
                  );
                setFilteredDeliveryOrderData(filteredDeliveryData);
                // swal(
                //   "Relax!",
                //   "Production Per Batch not Decleared, Please Contact with HO",
                //   "warning"
                // );
              }}
            ></Select>

           
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-4 mt-3">
        <label htmlFor="paymentId">DO Number</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between">
          <div className="w-100">
            <Select
              class="form-select"
              className="w-100 mb-3"
              aria-label="Default select example"
              name="doId"
              isDisabled={filteredDeliveryOrderData?.length == 0}
              options={deliveryOptions}
              defaultValue={{
                label: "Select DO Number",
                value: 0,
              }}
                value={ deliveryOptions.filter(function (option) {
                        return option.value === values.doId;
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
                const filteredData = deliveryOrderDataInformation.find(
                  (doOrder) => doOrder.doId === e.value
                );
                setFieldValue('doId',e.value)
                setDoDetailsFilteredData(filteredData);
              }}
            ></Select>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverReturnSinglePart;
