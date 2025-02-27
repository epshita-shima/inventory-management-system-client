import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import React from "react";
import Select from "react-select";
const UpdateInvoiceDetails = ({finisGoodsOptions,  touched, errors,makebyUser, updateSingleInvoiceData,setUpdateSingleInvoiceData}) => {
 
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
                      style={{ width: "30%" }}
                    >
                      Item Name
                      <span className="text-danger fw-bold fs-2">*</span>
                    </th>
                   
                    <th className="bg-white text-center align-items-center"  style={{ width: "20%" }}>
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
                  {updateSingleInvoiceData && updateSingleInvoiceData?.detailsData?.length > 0
                    ? updateSingleInvoiceData?.detailsData?.map((detail, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-center ">{index + 1}</td>
                            <td className="">
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
                                    value={finisGoodsOptions.filter(function (option) {
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
                                      setUpdateSingleInvoiceData((prev) => {
                                        const temp_details = [...prev.detailsData];
                                        const newDetail = { ...temp_details[index] };
                                        newDetail["itemId"] = e.value;
                                        temp_details[index] = newDetail;
                                        return {
                                          ...prev,
                                          detailsData: [...temp_details],
                                          updateBy: makebyUser,
                                          updateDate: new Date(),
                                        };
                                      });
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
                              <textarea
                                type="text"
                                name={`detailsData.${index}.description`}
                                placeholder="description"
                                value={detail?.description}
                                style={{
                                  border: "1px solid #2DDC1B",
                                  padding: "5px",
                                  width: "100%",
                                  borderRadius: "5px",
                                  height: "38px",
                                  marginBottom: "5px",
                                  textAlign: "center",
                                }}
                                onChange={(e)=>{
                                  setUpdateSingleInvoiceData((prev) => {
                                    const temp_details = [...prev.detailsData];
                                    const newDetail = { ...temp_details[index] };
                                    newDetail["description"] = e.target.value;
                                    temp_details[index] = newDetail;
                                    return {
                                      ...prev,
                                      detailsData: [...temp_details],
                                      updateBy: makebyUser,
                                      updateDate: new Date(),
                                    };
                                  });
                                }}
                              />
                            </td>
    
                            <td className="text-center  align-items-center">
                              <Field
                                type="number"
                                name={`detailsData.${index}.quantity`}
                                placeholder="quantity"
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
                                onChange={(e)=>{
                                  const calculateTotalAmount=e.target.value * detail.unitPrice
                                  setUpdateSingleInvoiceData((prev) => {
                                    const temp_details = [...prev.detailsData];
                                    const newDetail = { ...temp_details[index] };
                                    newDetail["quantity"] = e.target.value;
                                    newDetail["totalAmount"] = calculateTotalAmount;
                                    temp_details[index] = newDetail;
                                    return {
                                      ...prev,
                                      detailsData: [...temp_details],
                                      updateBy: makebyUser,
                                      updateDate: new Date(),
                                    };
                                  });
                                }}
                              />
                            </td>
                            <td className="text-center  align-items-center">
                              <Field
                                type="number"
                                name={`detailsData.${index}.unitPrice`}
                                value={detail.unitPrice}
                                placeholder="Unit Price"
                                style={{
                                  border: "1px solid #2DDC1B",
                                  padding: "5px",
                                  width: "100%",
                                  borderRadius: "5px",
                                  height: "38px",
                                  textAlign: "center",
                                }}
                                onChange={(e)=>{
                                  const calculateTotalAmount=e.target.value * detail.quantity
                                  setUpdateSingleInvoiceData((prev) => {
                                    const temp_details = [...prev.detailsData];
                                    const newDetail = { ...temp_details[index] };
                                    newDetail["unitPrice"] = e.target.value;
                                    newDetail["totalAmount"] = calculateTotalAmount;
                                    temp_details[index] = newDetail;
                                    return {
                                      ...prev,
                                      detailsData: [...temp_details],
                                      updateBy: makebyUser,
                                      updateDate: new Date(),
                                    };
                                  });
                                }}
                              />
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
    
                            <td className="text-center ">
                              <button
                                type="button"
                                className="border-0 rounded  bg-transparent"
                                onClick={() => {
                                  setUpdateSingleInvoiceData((prev) => {
                                    const temp__details = [...prev.detailsData];
                                    if (temp__details.length)
                                      temp__details.splice(index, 1);
                                 
                                    return {
                                      ...prev,
                                      detailsData: [...temp__details],
                                      updateBy: makebyUser,
                                      updateDate: new Date(),
                                    };
                                  });
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
}

export default UpdateInvoiceDetails
