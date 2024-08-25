import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import Select from "react-select";

const InsertPurchaseOrder = ({
  details,
  setTotalGrandQuantity,
  setTotalGrandTotalAmount,
  rawMaterialItemOptions,
  setFieldValue,
  setActiveItemInfoModal,
  setAcivePaymentModal,
  setActiveSupplierModal,
  setAciveBankInfoModal,
  touched,
  errors,
  totalGrandQuantity,
  totalGrandTotalAmount,
  arrayHelpers,
}) => {
  console.log(window.screen)
  return (
      <div className="insertpo-responsive-custom"
      //  style={{ height: 'calc(42vh - 120px)', overflowY: "auto" }}
       >
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
                Item Description
                <span className="text-danger fw-bold fs-2">*</span>
              </th>

              <th className="bg-white text-center  align-items-center ">
                Quantity
                <span className="text-danger fw-bold fs-2">*</span>
              </th>
              <th className="bg-white text-center  align-items-center ">
                Unit Price
                <span className="text-danger fw-bold fs-2">*</span>
              </th>

              <th className="bg-white text-center  align-items-center ">
                Total Amount
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
                    singleTotalAmount = details[i].totalAmount;
                    calGrandTotalQuantity += +singleQuantity;
                    getCalGrandTotalQuantity =
                      Math.round(calGrandTotalQuantity * 100) / 100;
                    calTotalAmount += +singleTotalAmount;
                    getCalTotalAmount = Math.round(calTotalAmount * 100) / 100;
                    setTotalGrandQuantity(getCalGrandTotalQuantity);
                    setTotalGrandTotalAmount(getCalTotalAmount);
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
                              options={rawMaterialItemOptions}
                              defaultValue={{
                                label: "Select Size",
                                value: 0,
                              }}
                              value={rawMaterialItemOptions.filter(function (
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
                                setActiveItemInfoModal(true);
                                setAcivePaymentModal(false);
                                setActiveSupplierModal(false);
                                setAciveBankInfoModal(false);
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
                        <textarea
                          type="textarea"
                          name={`detailsData.${index}.itemDescription`}
                          placeholder="Item description"
                          value={detail?.itemDescription}
                          rows="1"
                          style={{
                            border: "1px solid #2DDC1B",
                            padding: "5px",
                            width: "100%",
                            borderRadius: "5px",
                            height: "38px",
                          }}
                          onChange={(e) => {
                            setFieldValue(
                              `detailsData.${index}.itemDescription`,
                              e.target.value
                            );
                          }}
                        />
                        <br />
                        {touched.detailsData?.[index]?.itemDescription &&
                          errors.detailsData?.[index]?.itemDescription && (
                            <div className="text-danger">
                              {errors.detailsData[index].itemDescription}
                            </div>
                          )}
                      </td>

                      <td className="text-center  align-items-center">
                        <Field
                          type="number"
                          name={`detailsData.${index}.quantity`}
                          placeholder="Quantity"
                          value={detail?.quantity}
                          
                          style={{
                            border: "1px solid #2DDC1B",
                            padding: "5px",
                            width: "100%",
                            borderRadius: "5px",
                            height: "38px",
                            marginBottom: "5px",
                            textAlign: "center",
                          }}
                          onKeyUp={(e) => {
                            console.log(e.target.value);
                            setFieldValue(
                              `detailsData.${index}.quantity`,
                              e.target.value
                            );
                            const calculateTotalAmount =
                            parseFloat((e.target.value * detail.unitPrice))
                         
                            setFieldValue(
                              `detailsData.${index}.totalAmount`,
                              calculateTotalAmount.toFixed(2)
                            );
                            setFieldValue(
                              "grandTotalQuantity",
                              totalGrandQuantity
                            );
                            setFieldValue(
                              "grandTotalAmount",
                              totalGrandTotalAmount
                            );
                          }}
                        />
                        <br />
                        {touched.detailsData?.[index]?.quantity &&
                          errors.detailsData?.[index]?.quantity && (
                            <div className="text-danger">
                              {errors.detailsData[index].quantity}
                            </div>
                          )}
                      </td>

                      <td className="text-center  align-items-center">
                        <Field
                          type="text"
                          name={`detailsData.${index}.unitPrice`}
                          placeholder="Unit Price"
                          value={detail?.unitPrice}
                          step="0.01"
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
                            setFieldValue(
                              `detailsData.${index}.unitPrice`,
                              e.target.value
                            );
                            const calculateTotalAmount =
                            parseFloat( e.target.value * detail.quantity);
                            setFieldValue(
                              `detailsData.${index}.totalAmount`,
                              calculateTotalAmount.toFixed(2)
                            );
                            setFieldValue(
                              "grandTotalAmount",
                              totalGrandTotalAmount
                            );
                            setFieldValue(
                              "grandTotalAmount",
                              totalGrandTotalAmount
                            );
                          }}
                        />
                        <br />
                        {touched.detailsData?.[index]?.unitPrice &&
                          errors.detailsData?.[index]?.unitPrice && (
                            <div className="text-danger">
                              {errors.detailsData[index].unitPrice}
                            </div>
                          )}
                      </td>
                      <td className="text-center  align-items-center">
                        <Field
                          type="text"
                          name={`detailsData.${index}.totalAmount`}
                          placeholder="Total Amount"
                          value={detail?.totalAmount}
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

export default InsertPurchaseOrder;
