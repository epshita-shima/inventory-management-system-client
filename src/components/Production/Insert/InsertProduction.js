import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import Select from "react-select";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import { rawMaterialItemDropdown } from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllCFTInfosQuery } from "../../../redux/features/cftinformation/cftInfosApi";

const InsertProduction = ({
  details,
  setFieldValue,
  touched,
  errors,
  arrayHelpers,
  values,
}) => {
  const { data: rawMaterials } = useGetAllRMItemInformationQuery(undefined);
  const rawMaterialsData = rawMaterialItemDropdown(rawMaterials);
  const { data: cftData } = useGetAllCFTInfosQuery(undefined);

  const receipeOptions = [
    { value: "6676521ee8ecc1fa62ec8a46", label: "200" },
    { value: "6676521ee8ecc1fa62ec8a44", label: "150" },
    { value: "6676521ee8ecc1fa62ec8a45", label: "450" },
    { value: "6676521ee8ecc1fa62ec8a4a", label: "" },
    { value: "6676521ee8ecc1fa62ec8a4c", label: "" },
    { value: "6676521ee8ecc1fa62ec8a49", label: "200" },
  ];

  const receipeOptionsLessQty = [
    { value: "6676521ee8ecc1fa62ec8a46", label: "188" },
    { value: "6676521ee8ecc1fa62ec8a44", label: "150" },
    { value: "6676521ee8ecc1fa62ec8a45", label: "450" },
    { value: "6676521ee8ecc1fa62ec8a4a", label: "" },
    { value: "6676521ee8ecc1fa62ec8a4c", label: "" },
    { value: "6676521ee8ecc1fa62ec8a49", label: "150" },
  ];
  function getCftPerKgByItemId(itemId) {
    for (const entry of cftData) {
      const itemData = entry.detailsData.find(
        (detail) => detail.itemId == itemId
      );
      console.log(itemData);
      if (itemData) {
        return itemData.cftPerKg;
      }
    }
  }
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
                              if(values.receipeQtyRatio ==1000){
                                const receipeData = receipeOptions.find(
                                  (x) => x.value == e.value
                                );
                                const labelData = receipeData
                                  ? receipeData.label
                                  : null;
                                const findCFTPerKG = getCftPerKgByItemId(e.value);
                                const calculateAsPerRatio =
                                  (labelData / findCFTPerKG) * values.totalBatch;
                              
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
                                  calculateAsPerRatio
                                );
                              }
                            else{
                              const receipeData = receipeOptionsLessQty.find(
                                (x) => x.value == e.value
                              );
                              const labelData = receipeData
                                ? receipeData.label
                                : null;
                                console.log(labelData)
                              const findCFTPerKG = getCftPerKgByItemId(e.value);
                              console.log(findCFTPerKG)
                              const calculateAsPerRatio =
                                (labelData / findCFTPerKG ==undefined ? 0 :findCFTPerKG) * values.totalBatch;
                            console.log(findCFTPerKG)
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
                                calculateAsPerRatio
                              );
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

                          if (isNaN(value1) || isNaN(value2)) {
                            console.error(
                              "Invalid input: one of the values is not a number"
                            );
                          } else {
                            const calculateExcessOrLess = value1 - value2;
                            if (calculateExcessOrLess == 0) {
                              setFieldValue(`detailsData.${index}.less`, "-");
                              setFieldValue(`detailsData.${index}.excess`, "-");
                            } else if (calculateExcessOrLess < 0) {
                              setFieldValue(
                                `detailsData.${index}.less`,
                                Math.abs(calculateExcessOrLess)
                              );
                              setFieldValue(`detailsData.${index}.excess`, "-");
                            } else if (calculateExcessOrLess > 0) {
                              setFieldValue(
                                `detailsData.${index}.excess`,
                                Math.abs(calculateExcessOrLess)
                              );
                              setFieldValue(`detailsData.${index}.less`, "-");
                            }
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
};

export default InsertProduction;
