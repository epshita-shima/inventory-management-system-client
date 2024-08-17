import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import Select from "react-select";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import { rawMaterialItemDropdown } from "../../Common/CommonDropdown/CommonDropdown";

const InsertProduction = ({details,setFieldValue,touched, errors,arrayHelpers}) => {
    const { data: rawMaterials } = useGetAllRMItemInformationQuery(undefined);
    const rawMaterialsData = rawMaterialItemDropdown(rawMaterials);
    return (
        <div className="">
          <table className="table table-bordered">
            <thead className="w-100">
              <tr>
                <th className="bg-white text-center  align-items-center">Sl</th>
  
                <th
                  className="bg-white text-center  align-items-center"
                  style={{ width: "20%" }}
                >
                  Item Name
                  <span className="text-danger fw-bold fs-2">*</span>
                </th>
                <th className="bg-white text-center  align-items-center ">
                  Receipe
                  <span className="text-danger fw-bold fs-2">*</span>
                </th>
  
                <th className="bg-white text-center  align-items-center ">
                 Material Used
                  <span className="text-danger fw-bold fs-2">*</span>
                </th>
                <th className="bg-white text-center  align-items-center ">
                  As Per Ratio
                  <span className="text-danger fw-bold fs-2">*</span>
                </th>
  
                <th className="bg-white text-center  align-items-center ">
                 (+) Excess
                  <span className="text-danger fw-bold fs-2">*</span>
                </th>
                <th className="bg-white text-center  align-items-center ">
                 (-) Less
                  <span className="text-danger fw-bold fs-2">*</span>
                </th>
                <th className="bg-white text-center  align-items-center ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {details && details.length > 0
                ? details.map((detail, index) => {
                    let singleQuantity;
                    let singleTotalAmount;
                    let calGrandTotalQuantity = 0;
                    let getCalGrandTotalQuantity = 0;
                    let calTotalAmount = 0;
                    let getCalTotalAmount = 0;
                    for (let i = 0; i < details.length; i++) {
                      singleQuantity = details[i].quantity;
                      singleTotalAmount = details[i].excess;
                      calGrandTotalQuantity += +singleQuantity;
                      getCalGrandTotalQuantity =
                        Math.round(calGrandTotalQuantity * 100) / 100;
                      calTotalAmount += +singleTotalAmount;
                      getCalTotalAmount = Math.round(calTotalAmount * 100) / 100;
                     
                    }
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
                                value={rawMaterialsData.filter(function (
                                  option
                                ) {
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
                                  setFieldValue(
                                    `detailsData.${index}.itemId`,
                                    e.value
                                  );
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
                                onClick={() => {
                                 
                                }}
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
                          <br />
                          {touched.detailsData?.[index]?.receipe &&
                            errors.detailsData?.[index]?.receipe && (
                              <div className="text-danger">
                                {errors.detailsData[index].receipe}
                              </div>
                            )}
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
                            value={detail?.excess}
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
                            value={detail?.less}
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
                            className=" border-0 rounded  bg-transparent"
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
    );
}

export default InsertProduction
