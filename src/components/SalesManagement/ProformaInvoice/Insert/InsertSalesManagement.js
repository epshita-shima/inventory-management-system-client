import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import React from "react";
import Select from "react-select";

const InsertSalesManagement = ({
  finisGoodsOptions,
  details,
  touched,
  errors,
  setFieldValue,
  arrayHelpers,
  unitInfoOptions,
}) => {
  return (
    <div className="row">
      <div className="col-12 col-md-12 col-lg-12 fixed-column">
        <div className="table-responsive">
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

                <th
                  className="bg-white text-center align-items-center "
                  style={{ width: "20%" }}
                >
                  Description
                </th>
                <th className="bg-white text-center align-items-center ">
                  Quantity
                </th>

                <th className="bg-white text-center align-items-center ">
                  UnitPrice
                </th>
                <th className="bg-white text-center align-items-center ">
                  Total Amount
                </th>

                <th className="bg-white text-center align-items-center ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {details && details.length > 0
                ? details.map((detail, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-center align-middle">
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
                                options={finisGoodsOptions}
                                defaultValue={{
                                  label: "Select Item Name",
                                  value: 0,
                                }}
                                value={finisGoodsOptions.filter(function (
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

                        <td className="text-center   align-middle">
                          <textarea
                            type="textarea"
                            name={`detailsData.${index}.description`}
                            placeholder="Description"
                            value={detail?.description}
                            style={{
                              border: "1px solid #2DDC1B",
                              padding: "5px",
                              width: "100%",
                              borderRadius: "5px",
                              height: "38px",
                              marginBottom: "5px",
                              textAlign: "left",
                            }}
                            onChange={(e) => {
                              setFieldValue(
                                `detailsData.${index}.description`,
                                e.target.value
                              );
                            }}
                          />
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
                            onChange={(e) => {
                              const calculateTotalAmount =
                                e.target.value * detail.unitPrice;
                              setFieldValue(
                                `detailsData.${index}.quantity`,
                                e.target.value
                              );
                              setFieldValue(
                                `detailsData.${index}.totalAmount`,
                                calculateTotalAmount
                              );
                            }}
                          />
                        </td>
                        <td className="text-center  align-items-center ">
                          <Field
                            type="number"
                            name={`detailsData.${index}.unitPrice`}
                            placeholder="Unit Price"
                            style={{
                              border: "1px solid #2DDC1B",
                              padding: "5px",
                              width: "100%",
                              borderRadius: "5px",
                              height: "38px",
                              textAlign: "center",
                            }}
                            onChange={(e) => {
                              const calculateTotalAmount =
                                e.target.value * detail.quantity;
                              setFieldValue(
                                `detailsData.${index}.unitPrice`,
                                e.target.value
                              );
                              setFieldValue(
                                `detailsData.${index}.totalAmount`,
                                calculateTotalAmount
                              );
                            }}
                          />
                        </td>
                        <td className="text-center  align-items-center ">
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
                              textAlign: "right",
                            }}
                          />
                        </td>

                        <td className="text-center align-middle">
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

export default InsertSalesManagement;
