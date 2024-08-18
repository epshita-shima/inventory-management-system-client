import React, { useState } from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Field } from "formik";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import { rawMaterialItemDropdown } from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
const ProductionSingleInfo = ({
  startDate,
  setStartDate,
  setFieldValue,
  touched,
  errors,
  values,
  serialValue,
}) => {
  const [proStartDate, setProStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { data: finishGoodsItem } = useGetAllItemInformationQuery(undefined);
  const finishGoodsOptions = rawMaterialItemDropdown(finishGoodsItem);
  const receipeQtyDropdown = [
    { value: "1000", label: "1000" },
    { value: "938", label: "938" },
  ];
  function calculateHoursDifference(startDate, endDate) {
    // Parse the dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = end - start;
    // Convert milliseconds to hours
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

    return differenceInHours;
  }

  const hoursDifference = calculateHoursDifference(proStartDate, endDate);
  return (
    <div class="row row-cols-2 row-cols-lg-3">
      <div class="col-6 col-lg-4">
        <label htmlFor="productionDate">Production Date</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between mt-2">
          <DatePicker
            dateFormat="y-MM-dd"
            className="text-center custom-datepicker"
            value={startDate}
            calendarClassName="custom-calendar"
            selected={startDate}
            required
            onChange={(startDate) => {
              const makeBatchNo = `MEB-${startDate.toLocaleDateString(
                "en-CA"
              )}-${
                serialValue?.serialNo === undefined
                  ? "1"
                  : serialValue?.serialNo
              }`;

              setStartDate(startDate.toLocaleDateString("en-CA"));
              setFieldValue(
                "productionDate",
                startDate.toLocaleDateString("en-CA")
              );
              setFieldValue("batchNo", makeBatchNo);
            }}
          />
        </div>
      </div>
      <div class="col-6 col-lg-4">
        <label htmlFor="paymentId">Batch NO</label>
        <br />
        <Field
          type="text"
          name={`batchNo`}
          placeholder="Batch No"
          disabled
          value={values.batchNo}
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
      <div class="col-6 col-lg-4">
        <label htmlFor="totalBatch">Total Batch</label>
        <br />
        <Field
          type="number"
          name={`totalBatch`}
          placeholder="Total Batch"
          value={values.totalBatch}
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
          onChange={(e) => {
            const expectQty =
              e.target.value * values.expectedProductionQtyPerBatch;
            setFieldValue("totalBatch", e.target.value);
            setFieldValue("expectedProductionQty", expectQty);
          }}
        />
      </div>

      <div class="col-6 col-lg-4 mt-2">
        <label htmlFor="receipeQtyRatio">Receipe Qty Ratio</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between">
          <div className="w-100">
            <Select
              class="form-select"
              className="w-100 mb-3"
              aria-label="Default select example"
              name="receipeinfo"
              options={receipeQtyDropdown}
              defaultValue={{
                label: "Select receipe qty",
                value: 0,
              }}
              value={receipeQtyDropdown.filter(function (option) {
                return option.value === values.receipeQtyRatio;
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
                setFieldValue("receipeQtyRatio", e.value);
              }}
            ></Select>

            {/* {touched.values.receipeQtyRatio && errors.values.receipeQtyRatio && (
              <div className="text-danger">{errors.values.receipeQtyRatio}</div>
            )} */}
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-4 mt-2">
        <label htmlFor="productionItemName">Production Item Name</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between">
          <div className="w-100">
            <Select
              class="form-select"
              className="w-100 mb-3"
              aria-label="Default select example"
              name="productionItemName"
              options={finishGoodsOptions}
              defaultValue={{
                label: "Select Production Item Name",
                value: 0,
              }}
              value={finishGoodsOptions.filter(function (option) {
                return option.value === values.productionItemName;
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
                const expectQty = values.totalBatch * e.productionQtyPerBatch;
                setFieldValue("productionItemName", e.value);
                setFieldValue(
                  "expectedProductionQtyPerBatch",
                  e.productionQtyPerBatch
                );
                setFieldValue("expectedProductionQty", expectQty);
                const calculateExcessOrLess = Math.abs(
                  values.productionQty - expectQty
                );
                setFieldValue(
                  "excessOrLessProductionQty",
                  calculateExcessOrLess
                );
              }}
            ></Select>

            {touched.productionItemName && errors.productionItemName && (
              <div className="text-danger">{errors.productionItemName}</div>
            )}
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-4 mt-2">
        <label htmlFor="productionQty">Production Qty</label>
        <br />
        <Field
          type="number"
          name={`productionQty`}
          placeholder="Production Qty"
          value={values.productionQty}
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
          onChange={(e) => {
            const calculateExcessOrLess = Math.abs(
              e.target.value - values.expectedProductionQty
            );
            setFieldValue("excessOrLessProductionQty", calculateExcessOrLess);
            setFieldValue("productionQty", e.target.value);
          }}
        />
      </div>
      <div class="col-6 col-lg-4 mt-2">
        <label htmlFor="productionStart">Production Start</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between">
          <DatePicker
            dateFormat="y-MM-dd"
            className="text-center custom-datepicker"
            value={proStartDate}
            calendarClassName="custom-calendar"
            selected={startDate}
            required
            onChange={(startDate) => {
              setFieldValue('totalHour',hoursDifference)
              setProStartDate(startDate.toLocaleDateString("en-CA"));
              setFieldValue(
                "productionStart",
                startDate.toLocaleDateString("en-CA")
              );
            }}
          />
        </div>
      </div>
      <div class="col-6 col-lg-4 mt-2">
        <label htmlFor="supplierId">Production End</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between">
          <DatePicker
            dateFormat="y-MM-dd"
            className="text-center custom-datepicker"
            value={endDate}
            calendarClassName="custom-calendar"
            selected={startDate}
            required
            onChange={(startDate) => {
              setFieldValue('totalHour',hoursDifference)
              setEndDate(startDate.toLocaleDateString("en-CA"));
              setFieldValue(
                "productionEnd",
                startDate.toLocaleDateString("en-CA")
              );
            }}
          />
        </div>
      </div>

      <div class="col-6 col-lg-4 mt-2">
        <label htmlFor="paymentId">Total Hour</label>
        <br />
        <Field
          type="text"
          name={`totalHour`}
          placeholder="Total Hour"
          disabled
          value={hoursDifference}
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

      <div class="col-6 col-lg-4 mt-2">
        <label htmlFor="paymentId">Wastage Qty</label>
        <br />
        <Field
          type="text"
          name={`wastageQty`}
          placeholder="Wastage Qty"
          value={values.wastageQty}
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
          onChange={(e) => {
            setFieldValue("wasteageQty", e.target.value);
          }}
        />
      </div>
      <div class="col-6 col-lg-4 mt-2">
        <label htmlFor="paymentId">Expected Production Qty (Per Batch)</label>
        <br />
        <Field
          type="text"
          name={`expectedProductionQtyPerBatch`}
          placeholder="Expected Production Qty (Per Batch)"
          disabled
          value={values.expectedProductionQtyPerBatch}
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
      <div class="col-6 col-lg-4 mt-2">
        <label htmlFor="paymentId">Expected Production Qty</label>
        <br />
        <Field
          type="text"
          name={`expectedProductionQty`}
          placeholder="Expected Production Qty"
          disabled
          value={values.expectedProductionQty}
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
      <div class="col-6 col-lg-4 mt-2">
        <label htmlFor="paymentId">Excess Or Less Production Qty</label>
        <br />
        <Field
          type="text"
          name={`excessOrLessProductionQty`}
          placeholder="Excess Or Less Production Qty"
          disabled
          value={values.excessOrLessProductionQty}
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
    </div>
  );
};

export default ProductionSingleInfo;
