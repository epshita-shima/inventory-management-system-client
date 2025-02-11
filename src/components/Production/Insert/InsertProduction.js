import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import Select from "react-select";
import swal from "sweetalert";
const InsertProduction = ({
  details,
  setFieldValue,
  touched,
  errors,
  arrayHelpers,
  values,
  receipeOptions1000,
  cftData,
  rawMaterialsData,
  receipeOptionsLessQty938,
  receipeOptionsLessQty900,
}) => {
  function getCftPerKgByItemId(itemId) {
    console.log(rawMaterialsData, itemId);
    const itemDatawithCftDeclaration = rawMaterialsData?.find(
      (detail) =>
        String(detail.value) === String(itemId) &&
        detail?.cftDeclaration === true
    );

    const itemDataWithoutCftDeclaration = rawMaterialsData?.find(
      (detail) =>
        String(detail.value) === String(itemId) &&
        detail?.cftDeclaration === false
    );

    if (itemDatawithCftDeclaration !== undefined) {
      for (const entry of cftData) {
        console.log(
          "entry.isActive === true",
          entry.isActive,
          itemDatawithCftDeclaration.value
        );
        if (entry.isActive === true) {
          const itemCft = entry.detailsData.find(
            (detail) => detail.itemId === itemId
          );
          if (itemCft) {
            return itemCft;
          }
        }
      }
      return null;
    } else {
      return itemDataWithoutCftDeclaration;
    }
  }

  return (
    <div class="row">
      <div class="col-12 col-md-12 col-lg-12 fixed-column">
        <div class="table-responsive">
          <table className="table table-bordered">
            <thead className="w-100">
              <tr>
                <th className="bg-white text-center align-items-center">Sl</th>

                <th
                  className="bg-white text-center align-items-center"
                  style={{ width: "25%" }}
                >
                  Item Name
                  <span className="text-danger fw-bold fs-2">*</span>
                </th>
                <th className="bg-white text-center align-items-center ">
                  Receipe
                </th>

                <th className="bg-white text-center align-items-center ">
                  Material Used
                  <span className="text-danger fw-bold fs-2">*</span>
                </th>

                <th className="bg-white text-center align-items-center ">
                  As Per Ratio
                </th>

                <th className="bg-white text-center align-items-center ">
                  (+) Excess
                </th>
                <th className="bg-white text-center align-items-center ">
                  (-) Less
                </th>
                <th className="bg-white text-center align-items-center d-none">
                  Consumption Status
                </th>
                <th className="bg-white text-center align-items-center ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {details && details.length > 0
                ? details.map((detail, index) => {
                    console.log(detail);
                    return (
                      <tr key={index}>
                        <td className="text-center  align-middle">
                          {index + 1}
                        </td>

                        <td className="d-flex">
                          <div className="w-100 d-flex justify-content-between ">
                            <div className="w-100">
                              <Select
                                class="form-select"
                                className="w-100 mb-3"
                                aria-label="Default select example"
                                name="itemName"
                                options={rawMaterialsData}
                                defaultValue={{
                                  label: "Select Item Name",
                                  value: 0,
                                }}
                                value={rawMaterialsData.find(function (option) {
                                  return option.value === detail.itemId;
                                })}
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    width: "100%",
                                    borderColor: state.isFocused
                                      ? "#fff"
                                      : "#fff",
                                    border: "1px solid #2DDC1B",
                                  }),
                                  menu: (provided) => ({
                                    ...provided,
                                    zIndex: 9999,
                                    height: "200px",
                                    overflowY: "scroll",
                                  }),
                                  menuPortal: (base) => ({
                                    ...base,
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
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                onChange={(e) => {
                                  if (
                                    values.receipeQtyRatio === "" ||
                                    values.totalBatch === ""
                                  ) {
                                    swal(
                                      "Not Possible",
                                      "Please select Receipe qty ratio OR Fill Total Batch",
                                      "warning"
                                    );
                                  } else {
                                    if (
                                      values.receipeQtyRatio.toString() ===
                                      "1000"
                                    ) {
                                      const receipeData =
                                        receipeOptions1000.find(
                                          (x) => x.value === e.value
                                        );

                                      console.log("receipeData", receipeData);

                                      if (receipeData) {
                                        const labelData = receipeData
                                          ? receipeData.label
                                          : null;
                                        console.log(labelData);
                                        const findCFTPerKG =
                                          getCftPerKgByItemId(e.value);

                                        if (findCFTPerKG) {
                                          const calculateAsPerRatio =
                                            (labelData /
                                              findCFTPerKG?.cftPerKg) *
                                            values.totalBatch;
                                          console.log(calculateAsPerRatio);
                                          setFieldValue(
                                            `detailsData.${index}.itemId`,
                                            e.value
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.receipeLabelData`,
                                            labelData ? labelData : 0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.singleValueCFTPerKg`,
                                            findCFTPerKG?.cftPerKg ? findCFTPerKG?.cftPerKg :0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.receipe`,
                                            labelData ? labelData : 0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.asPerRatio`,
                                            calculateAsPerRatio
                                              ? Math.round(
                                                  calculateAsPerRatio * 100
                                                ) / 100
                                              : 0
                                          );
                                        } else {
                                          swal(
                                            "Not Possible",
                                            "CFT PER KG Not Decleared,Please Contact with HO",
                                            "warning"
                                          );
                                        }
                                      } else {
                                        swal(
                                          "Not Possible",
                                          "Ratio Qty Not Decleared,Please Contact with HO",
                                          "warning"
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.itemId`,
                                          ""
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.receipe`,
                                          0
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.asPerRatio`,
                                          0
                                        );

                                        setFieldValue(
                                          `detailsData.${index}.materialUsed`,
                                          ""
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.excess`,
                                          0
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.less`,
                                          0
                                        );
                                      }
                                    } else if (
                                      values.receipeQtyRatio.toString() ===
                                      "938"
                                    ) {
                                      const receipeData =
                                        receipeOptionsLessQty938.find(
                                          (x) => x.value === e.value
                                        );
                                      if (receipeData) {
                                        const labelData = receipeData
                                          ? receipeData.label
                                          : null;
                                        const findCFTPerKG =
                                          getCftPerKgByItemId(e.value);
                                        if (findCFTPerKG) {
                                          const calculateAsPerRatio =
                                            (labelData /
                                              findCFTPerKG.cftPerKg) *
                                            values.totalBatch;

                                          setFieldValue(
                                            `detailsData.${index}.itemId`,
                                            e.value
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.receipe`,
                                            labelData ? labelData : 0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.asPerRatio`,
                                            calculateAsPerRatio
                                              ? Math.round(
                                                  calculateAsPerRatio * 100
                                                ) / 100
                                              : 0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.receipeLabelData`,
                                            labelData ? labelData :0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.singleValueCFTPerKg`,
                                            findCFTPerKG?.cftPerKg ? findCFTPerKG?.cftPerKg : 0
                                          );
                                        } else {
                                          swal(
                                            "Not Possible",
                                            "CFT PER KG Not Decleared,Please Contact with HO",
                                            "warning"
                                          );
                                        }
                                      } else {
                                        swal(
                                          "Not Possible",
                                          "Ratio Qty Not Decleared,Please Contact with HO",
                                          "warning"
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.itemId`,
                                          ""
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.receipe`,
                                          0
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.asPerRatio`,
                                       0
                                        );
                                     
                                        setFieldValue(
                                          `detailsData.${index}.materialUsed`,
                                          ""
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.excess`,
                                          ""
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.less`,
                                          ""
                                        );
                                      }
                                    } else if (
                                      values.receipeQtyRatio.toString() ===
                                      "900"
                                    ) {
                                      const receipeData =
                                        receipeOptionsLessQty900.find(
                                          (x) => x.value === e.value
                                        );
                                      if (receipeData) {
                                        const labelData = receipeData
                                          ? receipeData.label
                                          : null;
                                        const findCFTPerKG =
                                          getCftPerKgByItemId(e.value);

                                        if (findCFTPerKG) {
                                          const calculateAsPerRatio =
                                            (labelData /
                                              findCFTPerKG?.cftPerKg) *
                                            values.totalBatch;

                                          setFieldValue(
                                            `detailsData.${index}.itemId`,
                                            e.value
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.receipe`,
                                            labelData ? labelData : 0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.asPerRatio`,
                                            calculateAsPerRatio
                                              ? Math.round(
                                                  calculateAsPerRatio * 100
                                                ) / 100
                                              : 0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.receipeLabelData`,
                                            labelData ? labelData :0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.singleValueCFTPerKg`,
                                            findCFTPerKG?.cftPerKg ?  findCFTPerKG?.cftPerKg : 0
                                          );
                                        } else {
                                          swal(
                                            "Not Possible",
                                            "CFT PER KG Not Decleared,Please Contact with HO",
                                            "warning"
                                          );
                                        }
                                      } else {
                                        swal(
                                          "Not Possible",
                                          "Ratio Qty Not Decleared,Please Contact with HO",
                                          "warning"
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.itemId`,
                                          ""
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.receipe`,
                                         0
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.asPerRatio`,
                                          ""
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.asPerRatio`,
                                          ""
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.materialUsed`,
                                          ""
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.excess`,
                                          ""
                                        );
                                        setFieldValue(
                                          `detailsData.${index}.less`,
                                          ""
                                        );
                                      }
                                    }
                                  }
                                }}
                              ></Select>
                            </div>
                            <div className="ms-2 mt-2">
                              <FontAwesomeIcon
                                className="border  align-items-center text-center p-2 fs-3 rounded-5 text-light "
                                style={{
                                  background: "#2DDC1B",
                                }}
                                icon={faPlus}
                                data-toggle="modal"
                                data-target="#finishGoodsInsertInvoiceModalCenter"
                                onClick={() => {}}
                              />
                            </div>
                          </div>
                          <br />
                          {touched.detailsData?.[index]?.itemId &&
                            errors.detailsData?.[index]?.itemId && (
                              <div className="text-danger">
                                {errors.detailsData[index].itemId}
                              </div>
                            )}
                        </td>
                        <td className="text-center  align-items-center">
                          <Field
                            type="number"
                            name={`detailsData.${index}.receipe`}
                            placeholder="Receipe"
                            value={detail?.receipe}
                            disabled
                            style={{
                              border: "1px solid #2DDC1B",
                              padding: "5px",
                              width: "100%",
                              borderRadius: "5px",
                              height: "38px",
                              marginBottom: "5px",
                              textAlign: "center",
                            }}
                          />
                        </td>

                        <td className="text-center  align-items-center">
                          <Field
                            type="number"
                            name={`detailsData.${index}.materialUsed`}
                            placeholder="Material Used"
                            value={detail?.materialUsed}
                            style={{
                              border: "1px solid #2DDC1B",
                              padding: "5px",
                              width: "100%",
                              borderRadius: "5px",
                              height: "38px",
                              marginBottom: "5px",
                              textAlign: "center",
                            }}
                            onChange={(e) => {
                              const value1 = parseFloat(e.target.value);
                              const value2 = parseFloat(detail.asPerRatio);
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
                                  Math.abs(
                                    Math.round(calculateExcessOrLess * 100) /
                                      100
                                  )
                                );
                                setFieldValue(`detailsData.${index}.excess`, 0);
                                setFieldValue(
                                  `detailsData.${index}.consumptionStatus`,
                                  "Less"
                                );
                              } else if (calculateExcessOrLess > 0) {
                                setFieldValue(
                                  `detailsData.${index}.excess`,
                                  Math.abs(
                                    (Math.round(calculateExcessOrLess) * 100) /
                                      100
                                  )
                                );
                                setFieldValue(`detailsData.${index}.less`, 0);
                                setFieldValue(
                                  `detailsData.${index}.consumptionStatus`,
                                  "Excess"
                                );
                              }

                              setFieldValue(
                                `detailsData.${index}.materialUsed`,
                                e.target.value
                              );
                            }}
                          />
                          <br />
                          {touched.detailsData?.[index]?.materialUsed &&
                            errors.detailsData?.[index]?.materialUsed && (
                              <div className="text-danger">
                                {errors.detailsData[index].materialUsed}
                              </div>
                            )}
                        </td>

                        <td className="text-center  align-items-center">
                          <Field
                            type="text"
                            name={`detailsData.${index}.asPerRatio`}
                            placeholder="As Per Ratio"
                            value={detail?.asPerRatio}
                            disabled
                            style={{
                              border: "1px solid #2DDC1B",
                              padding: "5px",
                              width: "100%",
                              borderRadius: "5px",
                              height: "38px",
                              marginBottom: "5px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td className="text-center  align-items-center">
                          <Field
                            type="text"
                            name={`detailsData.${index}.excess`}
                            placeholder="Excess"
                            value={detail?.excess === 0 ? "-" : detail?.excess}
                            disabled
                            style={{
                              border: "1px solid #2DDC1B",
                              padding: "5px",
                              width: "100%",
                              borderRadius: "5px",
                              height: "38px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td className="text-center  align-items-center">
                          <Field
                            type="text"
                            name={`detailsData.${index}.Less`}
                            placeholder="Less"
                            value={detail?.less === 0 ? "-" : detail?.less}
                            disabled
                            style={{
                              border: "1px solid #2DDC1B",
                              padding: "5px",
                              width: "100%",
                              borderRadius: "5px",
                              height: "38px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td className="text-center  align-items-center d-none">
                          <Field
                            type="text"
                            name={`detailsData.${index}.consumptionStatus`}
                            placeholder="Consumption Status"
                            value={detail?.consumptionStatus}
                            disabled
                            style={{
                              border: "1px solid #2DDC1B",
                              padding: "5px",
                              width: "100%",
                              borderRadius: "5px",
                              height: "38px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td className="text-center  align-middle">
                          <button
                            type="button"
                            className="border-0 rounded  bg-transparent"
                            onClick={() => {
                              arrayHelpers.remove(index, 1);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faXmarkCircle}
                              className="text-danger fs-1"
                            ></FontAwesomeIcon>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InsertProduction;
