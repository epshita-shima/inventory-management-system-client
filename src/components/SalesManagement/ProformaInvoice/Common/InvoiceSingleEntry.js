import { Field } from "formik";
import React, { useState } from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import { clientInfoDropdown } from "../../../Common/CommonDropdown/CommonDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./InvoiceSingleEntry.css";
import { useGetUserRoleQuery } from "../../../../redux/features/userrole/userroleApi";

const InvoiceSingleEntry = ({
  id,
  makebyUser,
  values,
  setFieldValue,
  touched,
  errors,
  serialValue,
  piDate,
  setPiDate,
  expireDate,
  setExpireDate,
  paymentTypeOptions,
  setAcivePaymentModal,
  updateSingleInvoiceData,
  setUpdateSingleInvoiceData,
  userInfoOptions,
  userList,
  superAdminId,
  setMarketingPerson,
}) => {
  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
  const { data: getRuserRole } = useGetUserRoleQuery(undefined);
  const customerOptions = clientInfoDropdown(customerInfo);
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
  const role = getRuserRole?.find((role) => role._id === userList?.roleId);
  const user = role ? userList?.find((user) => user.roleId === role._id) : null;
  const username = user ? user.username : "";

  return (
    <div class="row row-cols-1 ">
      <div class="col-sm-12 col-md-6 col-lg-4">
        <label htmlFor="piDate">PI Date</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between mt-2">
          <DatePicker
            dateFormat="y-MM-dd"
            className="text-center custom-datepicker-invoice"
            value={
              id
                ? new Date(updateSingleInvoiceData?.piDate).toLocaleDateString(
                    "en-CA"
                  )
                : piDate
            }
            calendarClassName="custom-calendar"
            selected={piDate}
            required
            onChange={(piDate) => {
              if (piDate > new Date()) {
                swal({
                  title: "Select Valid Date",
                  text: "Date should be equal or earlier than today",
                  icon: "warning",
                  button: "OK",
                });
              } else {
                if (id) {
                  setUpdateSingleInvoiceData((prevData) => ({
                    ...prevData,
                    piDate: new Date(piDate).toLocaleDateString("en-CA"),
                    updateBy: makebyUser,
                    updateDate: new Date(),
                  }));
                } else {
                  setPiDate(piDate.toLocaleDateString("en-CA"));
                  setFieldValue("piDate", piDate.toLocaleDateString("en-CA"));
                }
              }
            }}
          />
        </div>
      </div>
      
      <div class="col-sm-12 col-md-6 col-lg-4">
        <label htmlFor="piDate"> PI Expire Date</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between mt-2">
          <DatePicker
            dateFormat="y-MM-dd"
            className="text-center custom-datepicker-invoice"
            value={
              id
                ? new Date(
                    updateSingleInvoiceData?.expireDate
                  ).toLocaleDateString("en-CA")
                : expireDate
            }
            calendarClassName="custom-calendar"
            selected={expireDate}
            required
            onChange={(expireDate) => {
              const selectedDate = new Date(expireDate);
              const today = new Date();
              selectedDate.setHours(0, 0, 0, 0);
              today.setHours(0, 0, 0, 0);
              if (selectedDate < today) {
                swal({
                  title: "Select Valid Date",
                  text: "Date should be equal or latter than today",
                  icon: "warning",
                  button: "OK",
                });
              } else {
                if (id) {
                  setUpdateSingleInvoiceData((prevData) => ({
                    ...prevData,
                    expireDate: new Date(expireDate).toLocaleDateString(
                      "en-CA"
                    ),
                    updateBy: makebyUser,
                    updateDate: new Date(),
                  }));
                } else {
                  setExpireDate(expireDate.toLocaleDateString("en-CA"));
                  setFieldValue(
                    "expireDate",
                    expireDate.toLocaleDateString("en-CA")
                  );
                }
              }
            }}
          />
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4  d-none">
        <label htmlFor="invoiceNo">Invoice No</label>
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

      <div class="col-sm-12 col-md-6 col-lg-4 mt-2">
        <label htmlFor="customerName">Customer Name</label>
        <div className=" w-md-100 w-sm-100 d-flex justify-content-between">
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
              value={
                id
                  ? customerOptions.filter(function (option) {
                      return (
                        option.value === updateSingleInvoiceData?.customerID
                      );
                    })
                  : customerOptions.filter(function (option) {
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
                if (id) {
                  setUpdateSingleInvoiceData((prevData) => ({
                    ...prevData,
                    customerID: e.value,
                    updateBy: makebyUser,
                    updateDate: new Date(),
                  }));
                } else {
                  const removeDashFromDate = new Date(
                    piDate
                  ).toLocaleDateString("en-CA");
                  const removeDash = removeDashFromDate.replace(/-/g, "");
                  const shortName = e.clientShortName;
                  const makeBatchNo = `MEB-${shortName}-${removeDash}-${
                    serialValue?.serialNo === undefined
                      ? "1"
                      :parseInt(serialValue?.serialNo) + 1
                  }`;
                  setFieldValue("invoiceNo", makeBatchNo);
                  setFieldValue("customerID", e.value);
                }
              }}
            ></Select>

            {id
              ? ""
              : touched.customerID &&
                errors.customerID && (
                  <div className="text-danger">{errors.customerID}</div>
                )}
          </div>
          <div className="ms-2 mt-2">
            <FontAwesomeIcon
              className="border  align-items-center text-center p-2 fs-3 rounded-5 text-light "
              style={{
                background: "#2DDC1B",
              }}
              icon={faPlus}
              data-toggle="modal"
              data-target="#clientInsertInvoiceModalCenter"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>

      <div class="col-6 col-lg-4">
        <label htmlFor="paymentId">Payment Mode</label>
        <div className="d-flex justify-content-between mt-2">
          <div className="w-100">
            <Select
              class="form-select"
              className="w-100"
              aria-label="Default select example"
              name="sizeinfo"
              options={paymentTypeOptions}
              defaultValue={{
                label: "Select Size",
                value: 0,
              }}
              value={
                id
                  ? paymentTypeOptions?.filter(function (option) {
                      return (
                        option.value === updateSingleInvoiceData?.paymentId
                      );
                    })
                  : paymentTypeOptions?.filter(function (option) {
                      return option.value === values?.paymentId;
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
                if (id) {
                  setUpdateSingleInvoiceData((prevData) => ({
                    ...prevData,
                    paymentId: e.value,
                    updateBy: makebyUser,
                    updateDate: new Date(),
                  }));
                } else {
                  setAcivePaymentModal(true);
                  setFieldValue("paymentId", e.value);
                }
              }}
            ></Select>

            {id
              ? ""
              : touched.paymentId &&
                errors.paymentId && (
                  <div className="text-danger">{errors.paymentId}</div>
                )}
          </div>
          <div className="ms-2 mt-2">
            <FontAwesomeIcon
              className="border align-items-center text-center p-2 fs-3 rounded-5 text-light "
              style={{
                background: "#2DDC1B",
              }}
              icon={faPlus}
              data-toggle="modal"
              data-target="#commonInsertInvoiceModalCenter"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4 mt-2">
        <label htmlFor="receipeQtyRatio">Currency</label>
        <div className="w-lg-100 w-md-100 w-sm-100 d-flex justify-content-between">
          <div className="w-100">
            <Select
              class="form-select"
              className="w-100"
              aria-label="Default select example"
              name="receipeinfo"
              options={currencyOptions}
              defaultValue={{
                label: "Select currency",
                value: 0,
              }}
              value={
                id
                  ? currencyOptions.filter(function (option) {
                      return option.value === updateSingleInvoiceData?.currency;
                    })
                  : currencyOptions.filter(function (option) {
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
                if (id) {
                  setUpdateSingleInvoiceData((prevData) => ({
                    ...prevData,
                    currency: e.value,
                    updateBy: makebyUser,
                    updateDate: new Date(),
                  }));
                } else {
                  setFieldValue("currency", e.value);
                }
              }}
            ></Select>
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4 mt-2">
        <label htmlFor="receipeQtyRatio">Marketing Person</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between">
          {superAdminId === "65d48768a106fcb4f5c28071" ||
          superAdminId === "65d486123346cddf01c3773a" ? (
            <div className="w-100">
              <Select
                class="form-select"
                className="w-100 "
                aria-label="Default select example"
                name="receipeinfo"
                options={userInfoOptions}
                defaultValue={{
                  label: "Select marketing person",
                  value: 0,
                }}
                value={
                  id
                    ? userInfoOptions?.filter(function (option) {
                        return (
                          option.value === updateSingleInvoiceData?.mktPerson
                        );
                      })
                    : userInfoOptions?.filter(function (option) {
                        return option.value === values?.mktPerson;
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
                  if (id) {
                    setUpdateSingleInvoiceData((prevData) => ({
                      ...prevData,
                      mktPerson: e.value,
                      updateBy: makebyUser,
                      updateDate: new Date(),
                    }));
                  } else {
                    setMarketingPerson(e.value);
                    setFieldValue("mktPerson", e.value);
                  }
                }}
              ></Select>
            </div>
          ) : (
            <Field
              type="text"
              name={`mktPerson`}
              placeholder="MKT Person"
              disabled
              value={username}
              style={{
                border: "1px solid #2DDC1B",
                padding: "5px",
                width: "100%",
                borderRadius: "5px",
                textAlign: "center",
                height: "38px",
              }}
            />
          )}
        </div>
      </div>

    </div>
  );
};

export default InvoiceSingleEntry;
