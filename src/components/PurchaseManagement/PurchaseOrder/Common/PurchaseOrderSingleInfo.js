import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const PurchaseOrderSingleInfo = ({
  id,
  supplierOptions,
  values,
  setFieldValue,
  serialValue,
  touched,
  errors,
  setActiveSupplierModal,
  setAcivePaymentModal,
  setActiveItemInfoModal,
  setAciveBankInfoModal,
  paymentTypeOptions,
  bankInfoOptions,
  startDate,
  setStartDate,
  currencyOptions,
  purchaseOrderAllInformation,
  setPurchaseOrderAllInformation,
  makebyUser,
}) => {
  console.log(purchaseOrderAllInformation);
  return (
    <div class="row row-cols-2 row-cols-lg-3">
      <div class="col-6 col-lg-4">
        <label htmlFor="supplierId">Supplier Name</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between mt-2">
          <div className="w-100">
            <Select
              class="form-select"
              className="w-100 mb-3"
              aria-label="Default select example"
              name="sizeinfo"
              options={supplierOptions}
              defaultValue={{
                label: "Select Size",
                value: 0,
              }}
              value={
                id
                  ? supplierOptions.filter(function (option) {
                      return (
                        option.value === purchaseOrderAllInformation?.supplierId
                      );
                    })
                  : supplierOptions.filter(function (option) {
                      return option.value === values.supplierId;
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
                const poDate = new Date().toLocaleDateString("en-CA");
                const formatedDate = poDate?.replaceAll("-", "");
                const poData = purchaseOrderAllInformation?.poNo;
                const poSerialNo = poData?.slice(-1);

                if (id) {
                  setPurchaseOrderAllInformation((prevData) => ({
                    ...prevData,
                    supplierId: e.value,
                    poNo: `PO-MEB-${e.sortName}-${formatedDate}-${poSerialNo}`,
                    updateBy: makebyUser,
                    updateDate: new Date(),
                  }));
                } else {
                  setFieldValue("supplierId", e.value);
                  setFieldValue(
                    "poNo",
                    `PO-MEB-${e.sortName}-${formatedDate}-${
                      serialValue?.serialNo === undefined
                        ? "1"
                        : serialValue?.serialNo
                    }`
                  );
                }
              }}
            ></Select>

            {id
              ? ""
              : touched.supplierId &&
                errors.supplierId && (
                  <div className="text-danger">{errors.supplierId}</div>
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
              data-target="#commonInsertModalCenter"
              onClick={() => {
                setActiveSupplierModal(true);
                setAcivePaymentModal(false);
                setActiveItemInfoModal(false);
                setAciveBankInfoModal(false);
              }}
            />
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-4">
        <label htmlFor="paymentId">Payment</label>
        <div className="w-lg-75  w-md-100 w-sm-100 d-flex justify-content-between mt-2">
          <div className="w-100">
            <Select
              class="form-select"
              className="w-100 mb-3"
              aria-label="Default select example"
              name="sizeinfo"
              options={paymentTypeOptions}
              defaultValue={{
                label: "Select Size",
                value: 0,
              }}
              value={
                id
                  ? paymentTypeOptions.filter(function (option) {
                      return (
                        option.value === purchaseOrderAllInformation?.paymentId
                      );
                    })
                  : paymentTypeOptions.filter(function (option) {
                      return option.value === values.paymentId;
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
                id
                  ? setPurchaseOrderAllInformation((prevData) => ({
                      ...prevData,
                      paymentId: e.value,
                      updateBy: makebyUser,
                      updateDate: new Date(),
                    }))
                  : setFieldValue("paymentId", e.value);
              }}
            ></Select>

            {id
              ? ""
              : touched.supplierId &&
                errors.supplierId && (
                  <div className="text-danger">{errors.supplierId}</div>
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
              data-target="#commonInsertModalCenter"
              onClick={() => {
                setAcivePaymentModal(true);
                setActiveItemInfoModal(false);
                setActiveSupplierModal(false);
                setAciveBankInfoModal(false);
              }}
            />
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-4">
        <label htmlFor="bankId">Bank Information</label>
        <div className="w-100 d-flex justify-content-between mt-2">
          <div className="w-100">
            <Select
              class="form-select"
              className="w-100 mb-3"
              aria-label="Default select example"
              name="bankInformation"
              options={bankInfoOptions}
              defaultValue={{
                label: "Select Size",
                value: 0,
              }}
              value={
                id
                  ? bankInfoOptions.filter(function (option) {
                      return (
                        option.value === purchaseOrderAllInformation?.bankId
                      );
                    })
                  : bankInfoOptions.filter(function (option) {
                      return option.value === values.bankId;
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
                id
                  ? setPurchaseOrderAllInformation((prevData) => ({
                      ...prevData,
                      bankId: e.value,
                      updateBy: makebyUser,
                      updateDate: new Date(),
                    }))
                  : setFieldValue("bankId", e.value);
              }}
            ></Select>

            {id
              ? ""
              : touched.bankId &&
                errors.bankId && (
                  <div className="text-danger">{errors.bankId}</div>
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
              data-target="#commonInsertModalCenter"
              onClick={() => {
                setAciveBankInfoModal(true);
                setAcivePaymentModal(false);
                setActiveItemInfoModal(false);
                setActiveSupplierModal(false);
              }}
            />
          </div>
        </div>
      </div>

      <div class="col-6 col-lg-4">
        <label htmlFor="">Delivery Date</label>
        <br />
        <DatePicker
          dateFormat="y-MM-dd"
          className="text-center custom-datepicker"
          value={
            id
              ? new Date(
                  purchaseOrderAllInformation?.deliveryDate
                ).toLocaleDateString("en-CA")
              : startDate
          }
          calendarClassName="custom-calendar"
          selected={startDate}
          required
          onChange={(startDate) => {
            if (id) {
              setPurchaseOrderAllInformation((prevData) => ({
                ...prevData,
                deliveryDate: startDate.toLocaleDateString("en-CA"),
                updateBy: makebyUser,
                updateDate: new Date(),
              }));
            } else {
              setStartDate(startDate.toLocaleDateString("en-CA"));
              setFieldValue(
                "deliveryDate",
                startDate.toLocaleDateString("en-CA")
              );
            }
          }}
        />
      </div>
      <div class="col-6 col-lg-4">
        <label htmlFor="Currency">Currency</label>
        <br />
        <div className="w-lg-75 w-md-100">
          <Select
            class="form-select"
            className="w-100 mb-3"
            aria-label="Default select example"
            name="bankInformation"
            options={currencyOptions}
            defaultValue={{
              label: "Select Size",
              value: 0,
            }}
            value={
              id
                ? currencyOptions.filter(function (option) {
                    return (
                      option.value === purchaseOrderAllInformation?.currencyId
                    );
                  })
                : currencyOptions.filter(function (option) {
                    return option.value === values.currencyId;
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
              id
                ? setPurchaseOrderAllInformation((prevData) => ({
                    ...prevData,
                    currencyId: e.value,
                    updateBy: makebyUser,
                    updateDate: new Date(),
                  }))
                : setFieldValue("currencyId", e.value);
            }}
          ></Select>
        </div>
        <br />
        {id
          ? ""
          : touched.currencyId &&
            errors.currencyId && (
              <div className="text-danger">{errors.currencyId}</div>
            )}
      </div>
      <div class="col-6 col-lg-4">
        <label htmlFor="remarks">Remarks</label>
        <br />
        <textarea
          type="textarea"
          name={`remarks`}
          placeholder="Remarks"
          value={id ? purchaseOrderAllInformation?.remarks : values.remarks}
          rows="2"
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
          }}
          onChange={(e) => {
            id
              ? setPurchaseOrderAllInformation((prevData) => ({
                  ...prevData,
                  remarks: e.target.value,
                  updateBy: makebyUser,
                  updateDate: new Date(),
                }))
              : setFieldValue(`remarks`, e.target.value);
          }}
        />
        {id
          ? ""
          : touched.remarks &&
            errors.remarks && (
              <div className="text-danger">{errors.remarks}</div>
            )}
      </div>
    </div>
  );
};

export default PurchaseOrderSingleInfo;
