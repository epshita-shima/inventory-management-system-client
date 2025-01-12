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
  receipeOptions,
  cftData,
  rawMaterialsData,
  receipeOptionsLessQty,
}) => {
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

  return (
    <div className="">
       <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-md-12 col-lg-12 fixed-column py-2">
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
            <th className="bg-white text-center align-items-center ">Action</th>
          </tr>
        </thead>
        <tbody>
          {details && details.length > 0
            ? details.map((detail, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center  align-middle">{index + 1}</td>
                    <td className="d-flex ">
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
                            value={rawMaterialsData.filter(function (option) {
                              return option.value === detail.itemId;
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
                                // height: "200px",
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
                              if(values.receipeQtyRatio === ''  || values.totalBatch ==''){
                                swal("Not Possible", "Please select Receipe qty ratio OR Fill Total Batch", "warning");
                              }
                             else {
                              if (values.receipeQtyRatio === 1000  ) {
                               
                                const receipeData = receipeOptions.find(
                                  (x) => x.value === e.value
                                );
                                if(receipeData){
                                  const labelData = receipeData
                                    ? receipeData.label
                                    : null;
                                  const findCFTPerKG = getCftPerKgByItemId(
                                    e.value
                                  );
                                  if(findCFTPerKG){
                                    const calculateAsPerRatio =
                                      (labelData / findCFTPerKG) *
                                      values.totalBatch;

                                    setFieldValue(
                                      `detailsData.${index}.itemId`,
                                      e.value
                                    );
                                    setFieldValue(
                                      `detailsData.${index}.receipeLabelData`,
                                      labelData
                                    );
                                    setFieldValue(
                                      `detailsData.${index}.singleValueCFTPerKg`,
                                      findCFTPerKG
                                    );
                                    setFieldValue(
                                      `detailsData.${index}.receipe`,
                                      labelData
                                    );
                                    setFieldValue(
                                      `detailsData.${index}.asPerRatio`,
                                      Math.round(calculateAsPerRatio * 100) / 100
                                    );
                                  }
                                  else{
                                    swal("Not Possible", "CFT PER KG Not Decleared,Please Contact with HO", "warning");
                                  }
                                }
                                else{
                                  swal("Not Possible", "Ratio Qty Not Decleared,Please Contact with HO", "warning");
                                  setFieldValue(
                                    `detailsData.${index}.itemId`,
                                   ""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.receipe`,
                                   ""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.asPerRatio`,""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.asPerRatio`,""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.materialUsed`,""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.excess`,""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.less`,""
                                  );
                                }
                              
                             
                              } else if(values.receipeQtyRatio === 938) {
                                const receipeData = receipeOptionsLessQty.find(
                                  (x) => x.value === e.value
                                );
                                if(receipeData){
                                  const labelData = receipeData
                                    ? receipeData.label
                                    : null;
                                  const findCFTPerKG = getCftPerKgByItemId(
                                    e.value
                                  );
                                  if(findCFTPerKG){
                                    const calculateAsPerRatio =
                                      (labelData / findCFTPerKG) *
                                      values.totalBatch;
    
                                    setFieldValue(
                                      `detailsData.${index}.itemId`,
                                      e.value
                                    );
                                    setFieldValue(
                                      `detailsData.${index}.receipe`,
                                      labelData
                                    );
                                    setFieldValue(
                                      `detailsData.${index}.asPerRatio`,
                                      Math.round(calculateAsPerRatio * 100) / 100
                                    );
                                  }
                                  else{
                                    swal("Not Possible", "CFT PER KG Not Decleared,Please Contact with HO", "warning");
                                  }
                                }
                                else{
                                  swal("Not Possible", "Ratio Qty Not Decleared,Please Contact with HO", "warning");
                                  setFieldValue(
                                    `detailsData.${index}.itemId`,
                                   ""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.receipe`,
                                   ""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.asPerRatio`,""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.asPerRatio`,""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.materialUsed`,""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.excess`,""
                                  );
                                  setFieldValue(
                                    `detailsData.${index}.less`,""
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
                            data-target="#commonInsertModalCenter"
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
                                Math.round(calculateExcessOrLess * 100) / 100
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
                                (Math.round(calculateExcessOrLess) * 100) / 100
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
            </div>
      
    </div>
  );
};

export default InsertProduction;
