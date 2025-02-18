import React, { useEffect, useState } from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Field } from "formik";
import {
  finishGoodsWithSizeItemDropdown,
  rawMaterialItemDropdown,
} from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/finishgoodsinfoApi";
import "./ProductionDatePicker.css";
import swal from "sweetalert";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";

const ProductionSingleInfo = ({
  startDates,
  setStartDates,
  setFieldValue,
  touched,
  errors,
  values,
  serialValue,
  id,
  cftData,
  updateProductionData,
  setUpdateProductionData,
  makebyUser,
  proStartDate,
  setProStartDate,
  endDate,
  setEndDate,
  receipeOptions1000,
  receipeOptionsLessQty938,
  receipeOptionsLessQty900
}) => {

  const { data: sizeInfo } = useGetAllItemSizeQuery(undefined);
  const { data: finishGoodsItem } = useGetAllItemInformationQuery(undefined);
  const finishGoodsOptions = finishGoodsWithSizeItemDropdown(
    finishGoodsItem,
    sizeInfo
  );

  const receipeQtyDropdown = [
    { value: "1000", label: "1000" },
    { value: "938", label: "938" },
    {value:"900",label:"900"}
  ];

  function getCftPerKgByItemId(itemId) {
    for (const entry of cftData) {
      const itemData = entry.detailsData.find(
        (detail) => detail.itemId === itemId
      );
      if (itemData) {
        return itemData.cftPerKg;
      }
    }
  }

  const handleStartDateChange = (event) => {
    if (id) {
      setUpdateProductionData((prevData) => ({
        ...prevData,
        productionStart: event.target.value,
        updateBy: makebyUser,
        updateDate: new Date(),
      }));
    } else {
      setProStartDate(event.target.value);
      setFieldValue("productionStart", event.target.value);
    }
  };

  const handleEndDateChange = (event) => {
    if (id) {
      setUpdateProductionData((prevData) => ({
        ...prevData,
        productionEnd: event.target.value,
        updateBy: makebyUser,
        updateDate: new Date(),
      }));
    } else {
      setEndDate(event.target.value);
      setFieldValue("productionEnd", event.target.value);
    }
  };

  useEffect(() => {
    if (id) {
      const startDate = new Date(updateProductionData?.productionStart);
      const endDateObj = new Date(updateProductionData?.productionEnd);
      const differenceInMilliseconds = endDateObj - startDate;
      const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
      setUpdateProductionData((prevData) => ({
        ...prevData,
        totalHour: differenceInHours.toFixed(2),
        updateBy: makebyUser,
        updateDate: new Date(),
      }));
    } else {
      if (proStartDate && endDate) {
        const startDate = new Date(proStartDate);
        const endDateObj = new Date(endDate);
        const differenceInMilliseconds = endDateObj - startDate;
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
        setFieldValue("totalHour", differenceInHours.toFixed(2));
      }
    }
  }, [
    proStartDate,
    endDate,
    setFieldValue,
    id,
    setUpdateProductionData,
    updateProductionData?.productionStart,
    updateProductionData?.productionEnd,
    makebyUser,
  ]);

  useEffect(() => {
    const removeDashFromDate = new Date(startDates).toLocaleDateString("en-CA");
    const removeDash = removeDashFromDate.replace(/-/g, "");
    const makeBatchNo = `MEB-${removeDash}-${
      serialValue?.serialNo === undefined ? "1" :parseInt(serialValue?.serialNo) + 1
    }`;
    setFieldValue(
      "productionDate",
      new Date(startDates).toLocaleDateString("en-CA")
    );
    setFieldValue("batchNo", makeBatchNo);
  }, [serialValue?.serialNo, setFieldValue, startDates]);

  return (
    <div class="row row-cols-1 row-cols-lg-3">
      <div class="col-sm-12 col-md-6 col-lg-3">
        <label htmlFor="productionDate">Production Date</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between mt-2">
          <DatePicker
            dateFormat="y-MM-dd"
            className="text-center custom-datepicker-production"
            value={id ? updateProductionData?.productionDate : startDates}
            calendarClassName="custom-calendar"
            selected={startDates}
            required
            onChange={(startDate) => {
              if (id) {
                const getBatchNo = updateProductionData?.batchNo;
                const parts = getBatchNo.split("-");
                const removeDashFromDate =
                  startDate.toLocaleDateString("en-CA");
                const removeDash = removeDashFromDate.replace(/-/g, "");
                const finalUpdateBatch = parts[parts.length - 1];
                const makeBatchNo = `MEB-${removeDash}-${
                  serialValue?.serialNo === undefined ? "1" : finalUpdateBatch
                }`;
                setUpdateProductionData((prevData) => ({
                  ...prevData,
                  productionDate: startDate.toLocaleDateString("en-CA"),
                  batchNo: makeBatchNo,
                  updateBy: makebyUser,
                  updateDate: new Date(),
                }));
              } else {
                const removeDashFromDate =
                  startDate.toLocaleDateString("en-CA");
                const removeDash = removeDashFromDate.replace(/-/g, "");
                const makeBatchNo = `MEB-${removeDash}-${
                  serialValue?.serialNo === undefined
                    ? "1"
                    : parseInt(serialValue?.serialNo) + 1
                }`;

                setStartDates(startDate.toLocaleDateString("en-CA"));
                setFieldValue(
                  "productionDate",
                  startDate.toLocaleDateString("en-CA")
                );
                setFieldValue("batchNo", makeBatchNo);
              }
            }}
          />
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-3 mt-2">
        <label htmlFor="productionStart">Production Start</label>
        <div className="w-lg-100 w-md-100 w-sm-100 d-flex justify-content-between">
          <input
            type="datetime-local"
            id="dateInput"
            value={id ? updateProductionData?.productionStart : proStartDate}
            onChange={handleStartDateChange}
            style={{
              width: "100%",
              height: "38px",
              borderRadius: "5px",
              padding: "10px",
              border: "1px solid #2DDC1B",
              outline: "none",
            }}
          />
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-3 mt-2">
        <label htmlFor="supplierId">Production End</label>
        <div className="w-lg-75 w-md-100 w-sm-100 d-flex justify-content-between">
          <input
            type="datetime-local"
            id="dateInput"
            value={id ? updateProductionData?.productionEnd : endDate}
            onChange={handleEndDateChange}
            style={{
              width: "100%",
              height: "38px",
              borderRadius: "5px",
              padding: "10px",
              border: "1px solid #2DDC1B",
              outline: "none",
            }}
          />
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-3 mt-3">
        <label htmlFor="paymentId">Total Hour</label>
        <br />
        <Field
          type="text"
          name={`totalHour`}
          placeholder="Total Hour"
          disabled
          value={
            id
              ? updateProductionData?.totalHour
              : values.totalHour === "NaN"
              ? 0
              : values.totalHour
          }
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
      <div class="col-sm-12 col-md-6col-lg-3 d-none">
        <label htmlFor="paymentId">Batch NO</label>
        <br />
        <Field
          type="text"
          name={`batchNo`}
          placeholder="Batch No"
          disabled
          value={id ? updateProductionData?.batchNo : values.batchNo}
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
      <div class="col-sm-12 col-md-6 col-lg-3 mt-2">
        <label htmlFor="totalBatch">Total Batch</label>
        <Field
          type="number"
          name={`totalBatch`}
          placeholder="Total Batch"
          value={id ? updateProductionData?.totalBatch : values.totalBatch}
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
          onChange={(e) => {
            if (id) {
              const expectQty =
                e.target.value *
                updateProductionData?.expectedProductionQtyPerBatch;
              const excessOrLess =
                updateProductionData?.productionQty - expectQty;
       
              const calculateExcessOrLess = Math.abs(
                updateProductionData?.productionQty - expectQty
              );
              // setFieldValue("excessOrLessProductionQty", calculateExcessOrLess);
              if (excessOrLess === 0) {
                setUpdateProductionData((prevData) => ({
                  ...prevData,
                  totalBatch: e.target.value,
                  productionStatus:  "No Change",
                  updateBy: makebyUser,
                  excessOrLessProductionQty: calculateExcessOrLess,
                  updateDate: new Date(),
                }));
              } else if (excessOrLess < 0) {
                setUpdateProductionData((prevData) => ({
                  ...prevData,
                  totalBatch: e.target.value,
                  productionStatus:  "Less",
                  updateBy: makebyUser,
                  excessOrLessProductionQty: calculateExcessOrLess,
                  updateDate: new Date(),
                }));
              } else {
                setUpdateProductionData((prevData) => ({
                  ...prevData,
                  totalBatch: e.target.value,
                  productionStatus: "Excess",
                  updateBy: makebyUser,
                  excessOrLessProductionQty: calculateExcessOrLess,
                  updateDate: new Date(),
                }));
              }

              updateProductionData?.detailsData.forEach((detail, index) => {
                const findCFTPerKG = getCftPerKgByItemId(detail.itemId);
                const calculateAsPerRationBasedTotalBatch =
                  (detail.receipe / findCFTPerKG) * e.target.value;
             
                const value1 = parseFloat(detail.materialUsed);
                const value2 = parseFloat(calculateAsPerRationBasedTotalBatch);
                const calculateExcessOrLess = value1 - value2;
                if (calculateExcessOrLess === 0) {
                  setUpdateProductionData((prev) => {
                    const temp_details = [...prev.detailsData];
                    const newDetail = { ...temp_details[index] };
                    newDetail["less"] = 0;
                    newDetail["excess"] = 0;
                    newDetail["consumptionStatus"] = "No Change";
                    temp_details[index] = newDetail;
                    return {
                      ...prev,
                      detailsData: temp_details,
                      updateBy: makebyUser,
                      updateDate: new Date(),
                    };
                  });
                } else if (calculateExcessOrLess < 0) {
                
                  setUpdateProductionData((prev) => {
                    const temp_details = [...prev.detailsData];
                    const newDetail = { ...temp_details[index] };
                    newDetail["less"] = Math.abs(Math.round(calculateExcessOrLess * 100) / 100);
                    newDetail["excess"] = 0;
                    newDetail["consumptionStatus"] = "Less";
                    temp_details[index] = newDetail;
                    return {
                      ...prev,
                      detailsData: temp_details,
                      updateBy: makebyUser,
                      updateDate: new Date(),
                    };
                  });
                } else if (calculateExcessOrLess > 0) {
                 
                  setUpdateProductionData((prev) => {
                    const temp_details = [...prev.detailsData];
                    const newDetail = { ...temp_details[index] };
                    newDetail["excess"] = Math.abs(Math.round(calculateExcessOrLess * 100) / 100);
                    newDetail["less"] = 0;
                    newDetail["consumptionStatus"] = "Excess";
                    temp_details[index] = newDetail;
                    return {
                      ...prev,
                      detailsData: temp_details,
                      updateBy: makebyUser,
                      updateDate: new Date(),
                    };
                  });
                }
               
                setUpdateProductionData((prev) => {
                  const temp_details = [...prev.detailsData];
                  const newDetail = { ...temp_details[index] };
                  newDetail["asPerRatio"] = parseFloat(
                    Math.round(calculateAsPerRationBasedTotalBatch * 100) / 100
                  );
                  temp_details[index] = newDetail;

                  return {
                    ...prev,
                    detailsData: temp_details,
                    updateBy: makebyUser,
                    updateDate: new Date(),
                  };
                });
              });
              setUpdateProductionData((prevData) => ({
                ...prevData,
                totalBatch: e.target.value,
                expectedProductionQty: expectQty,
                updateBy: makebyUser,
                excessOrLessProductionQty: calculateExcessOrLess,
                updateDate: new Date(),
              }));
            } else {
              const expectQty =
                e.target.value * values.expectedProductionQtyPerBatch;
              setFieldValue("totalBatch", e.target.value);
              setFieldValue("expectedProductionQty", expectQty);
              const excessOrLess = values.productionQty - expectQty;
              const calculateExcessOrLess = Math.abs(
                values.productionQty - expectQty
              );
              setFieldValue("excessOrLessProductionQty", calculateExcessOrLess);
              if (excessOrLess === 0) {
                setFieldValue("productionStatus", "No Change");
              } else if (excessOrLess < 0) {
                setFieldValue("productionStatus", "Less");
              } else {
                setFieldValue("productionStatus", "Excess");
              }
              values.detailsData.forEach((detail, index) => {
                if (detail.asPerRatio) {
                  const calculateAsPerRationBasedTotalBatch =
                    (detail.receipeLabelData / detail.singleValueCFTPerKg) *
                    e.target.value;
                  const value1 = parseFloat(detail.materialUsed);
                  const value2 = parseFloat(
                    calculateAsPerRationBasedTotalBatch
                  );
                  const calculateExcessOrLess = value1 - value2;
                  if (calculateExcessOrLess === 0) {
                    setFieldValue(`detailsData.${index}.less`, 0);
                    setFieldValue(`detailsData.${index}.excess`, 0);
                    setFieldValue(
                      `detailsData.${index}.consumptionStatus`,
                      "No Change"
                    );
                  } else if (calculateExcessOrLess < 0) {
                    setFieldValue(
                      `detailsData.${index}.less`,
                      Math.abs(Math.round(calculateExcessOrLess * 100) / 100)
                    );
                    setFieldValue(`detailsData.${index}.excess`, 0);
                    setFieldValue(
                      `detailsData.${index}.consumptionStatus`,
                      "Less"
                    );
                  } else if (calculateExcessOrLess > 0) {
                    setFieldValue(
                      `detailsData.${index}.excess`,
                      Math.abs((Math.round(calculateExcessOrLess) * 100) / 100)
                    );
                    setFieldValue(`detailsData.${index}.less`, 0);
                    setFieldValue(
                      `detailsData.${index}.consumptionStatus`,
                      "Excess"
                    );
                  }
                  setFieldValue(
                    `detailsData.${index}.asPerRatio`,
                    calculateAsPerRationBasedTotalBatch,
                    false
                  );
                }
              });
            }
          }}
        />
      </div>
      <div class="col-sm-12 col-md-6 col-lg-3 mt-2">
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
              value={
                id
                  ? finishGoodsOptions.filter(function (option) {
                      return (
                        option.value ===
                        updateProductionData?.productionItemName
                      );
                    })
                  : finishGoodsOptions.filter(function (option) {
                      return option.value === values.productionItemName;
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
                  const expectQty =
                    updateProductionData?.totalBatch * e.productionQtyPerBatch;
                  const calculateExcessOrLess = Math.abs(
                    updateProductionData?.productionQty - expectQty
                  );
                  setUpdateProductionData((prevData) => ({
                    ...prevData,
                    productionItemName: e.value,
                    expectedProductionQtyPerBatch: e.productionQtyPerBatch,
                    expectedProductionQty: expectQty,
                    calculateExcessOrLess: calculateExcessOrLess,
                    updateBy: makebyUser,
                    updateDate: new Date(),
                  }));
                } else {
                  if (e.productionQtyPerBatch) {
                    const expectQty =
                      values.totalBatch * e.productionQtyPerBatch;
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
                  } else {
                    swal(
                      "Relax!",
                      "Production Per Batch not Decleared, Please Contact with HO",
                      "warning"
                    );
                  }
                }
              }}
            ></Select>

            {id
              ? ""
              : touched.productionItemName &&
                errors.productionItemName && (
                  <div className="text-danger">{errors.productionItemName}</div>
                )}
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-3 mt-2">
        <label htmlFor="productionQty">Production Qty</label>
        <br />
        <Field
          type="number"
          name={`productionQty`}
          placeholder="Production Qty"
          value={
            id ? updateProductionData?.productionQty : values.productionQty
          }
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
          onChange={(e) => {
            if (id) {
              const excessOrLess =
                e.target.value - updateProductionData?.expectedProductionQty;
              const calculateExcessOrLess = Math.abs(
                e.target.value - updateProductionData?.expectedProductionQty
              );
              setUpdateProductionData((prevData) => ({
                ...prevData,
                excessOrLessProductionQty: calculateExcessOrLess,
                productionQty: e.target.value,
                productionStatus: excessOrLess < 0 ? "Less" : "Excess",
                updateBy: makebyUser,
                updateDate: new Date(),
              }));
            } else {
              const excessOrLess =
                e.target.value - values.expectedProductionQty;
              const calculateExcessOrLess = Math.abs(
                e.target.value - values.expectedProductionQty
              );
              setFieldValue("excessOrLessProductionQty", calculateExcessOrLess);
              setFieldValue("productionQty", e.target.value);
              if (excessOrLess === 0) {
                setFieldValue("productionStatus", "No Change");
              } else if (excessOrLess < 0) {
                setFieldValue("productionStatus", "Less");
              } else {
                setFieldValue("productionStatus", "Excess");
              }
            }
          }}
        />
      </div>

      <div class="col-sm-12 col-md-6 col-lg-3 mt-3">
        <label htmlFor="paymentId">Wastage Qty</label>
        <br />
        <Field
          type="text"
          name={`wastageQty`}
          placeholder="Wastage Qty"
          value={id ? updateProductionData?.wastageQty : values.wastageQty}
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
          onChange={(e) => {
            if (id) {
              setUpdateProductionData((prevData) => ({
                ...prevData,
                wastageQty: e.target.value,
                updateBy: makebyUser,
                updateDate: new Date(),
              }));
            } else {
              setFieldValue("wastageQty", e.target.value);
            }
          }}
        />
      </div>
      <div class="col-sm-12 col-md-6 col-lg-3 mt-3">
        <label htmlFor="paymentId">Expected Production Qty (Per Batch)</label>
        <br />
        <Field
          type="text"
          name={`expectedProductionQtyPerBatch`}
          placeholder="Expected Production Qty (Per Batch)"
          
          value={
            id
              ? updateProductionData?.expectedProductionQtyPerBatch
              : values.expectedProductionQtyPerBatch
          }
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
            values.totalBatch * e.target.value;
            console.log(expectQty)
            
            setFieldValue('expectedProductionQtyPerBatch',Number(e.target.value))
            setFieldValue("expectedProductionQty", expectQty);
            const calculateExcessOrLess = Math.abs(
              values.productionQty - expectQty
            );
            console.log(calculateExcessOrLess)
            setFieldValue(
              "excessOrLessProductionQty",
              calculateExcessOrLess
            );
          }}
        />
      </div>
      <div class="col-sm-12 col-md-6 col-lg-3 mt-3">
        <label htmlFor="paymentId">Expected Production Qty</label>
        <br />
        <Field
          type="text"
          name={`expectedProductionQty`}
          placeholder="Expected Production Qty"
          disabled
          value={
            id
              ? updateProductionData?.expectedProductionQty
              : values.expectedProductionQty
          }
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
      <div class="col-sm-12 col-md-6 col-lg-3 mt-3">
        <label htmlFor="paymentId">Excess Or Less Production Qty</label>
        <br />
        <Field
          type="text"
          name={`excessOrLessProductionQty`}
          placeholder="Excess Or Less Production Qty"
          disabled
          value={
            id
              ? updateProductionData?.excessOrLessProductionQty
              : values.excessOrLessProductionQty
          }
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
      <div class="col-sm-12 col-md-6 col-lg-3 mt-3 d-none">
        <label htmlFor="paymentId">Production Status</label>
        <Field
          type="text"
          name={`productionStatus`}
          placeholder="Production Status"
          disabled
          value={
            id
              ? updateProductionData?.productionStatus
              : values.productionStatus
          }
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
      <div class="col-sm-12 col-md-6 col-lg-3 mt-3">
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
              value={
                id
                  ? receipeQtyDropdown.filter(function (option) {
                      return (
                        option.value === updateProductionData?.receipeQtyRatio
                      );
                    })
                  : receipeQtyDropdown.filter(function (option) {
                      return option.value === values.receipeQtyRatio;
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
                  setUpdateProductionData((prevData) => ({
                    ...prevData,
                    receipeQtyRatio: e.value,
                    updateBy: makebyUser,
                    updateDate: new Date(),
                  }));
                } else {
                  const itemIds = values.detailsData.map((detail) => detail.itemId);
                  if (itemIds.length > 0) {
                    const getRecipeOptions = (receipeQtyRatio) => {
                      switch (receipeQtyRatio) {
                        case "1000":
                          return receipeOptions1000;
                        case "938":
                          return receipeOptionsLessQty938;
                        case "900":
                          return receipeOptionsLessQty900;
                        default:
                          return [];
                      }
                    };
                    
                    const selectedRecipeArray = getRecipeOptions(e.value); // Select correct array dynamically
                    console.log(selectedRecipeArray)
                    const updatedDetailsData = values.detailsData.map((detail) => {
                    
                      const matchedRecipe = selectedRecipeArray.find((option) => option.value === detail.itemId);
                      console.log('matchedRecipe',matchedRecipe)
                      return {
                        ...detail,
                        receipe: matchedRecipe ? matchedRecipe.label : 0,
                        asPerRatio:
                        detail.singleValueCFTPerKg > 0
                          ? Math.round(
                              ((matchedRecipe.label / detail.singleValueCFTPerKg) * values.totalBatch) * 100
                            ) / 100
                          : 0,
                      };
                    });
                    
                    setFieldValue("detailsData", updatedDetailsData);
                  }
                  
                  setFieldValue("receipeQtyRatio", e.value);
                }
              }}
            ></Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionSingleInfo;
