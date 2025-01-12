import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import Select from "react-select";
import '../Insert/InsertPurchaseOrder.css'

const UpdatePurchaseOrderInfo = ({
  purchaseOrderAllInformation,
  setPurchaseOrderAllInformation,
  setTotalGrandQuantity,
  setTotalGrandTotalAmount,
  rawMaterialItemOptions,
  setActiveItemInfoModal,
  setAcivePaymentModal,
  setActiveSupplierModal,
  setAciveBankInfoModal,
  touched,
  errors,
  makebyUser,
}) => {
  const handleKeyUp = (e, index, detail) => {
    const inputValue = e.target.value;
    const parsedValue = parseInt(inputValue, 10);
    const calculateTotalAmount = parseFloat(e.target.value * detail.unitPrice);
    setPurchaseOrderAllInformation((prev) => {
      const temp_details = [...prev.detailsData];
      const newDetail = { ...temp_details[index] };
      newDetail["quantity"] = parsedValue
  
      newDetail["totalAmount"] = calculateTotalAmount.toFixed(2);
      temp_details[index] = newDetail;

      const totalGrandQuantitys = temp_details.reduce(
        (total, item) => total + parseFloat(item.quantity),
        0
      );
      const totalGrandTotalAmounts = temp_details.reduce(
        (total, item) => total + parseFloat(item.totalAmount),
        0
      );

      return {
        ...prev,
        detailsData: [...temp_details],
        updateBy: makebyUser,
        updateDate: new Date(),
        grandTotalQuantity: totalGrandQuantitys,
        grandTotalAmount: parseFloat(totalGrandTotalAmounts.toFixed(2)),
      };
    });
  };
  
  return (
    <div className="insertpo-responsive-custom" 
    >
      <table className="table w-full table-bordered">
        <thead className="w-100">
          <tr>
            <th className="bg-white text-center  align-items-center  ">Sl</th>

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
          {purchaseOrderAllInformation?.detailsData &&
          purchaseOrderAllInformation?.detailsData.length > 0
            ? purchaseOrderAllInformation?.detailsData.map((detail, index) => {
                let singleQuantity;
                let singleTotalAmount;
                let calGrandTotalQuantity = 0;
                let getCalGrandTotalQuantity = 0;
                let calTotalAmount = 0;
                let getCalTotalAmount = 0;
                for (
                  let i = 0;
                  i < purchaseOrderAllInformation.detailsData.length;
                  i++
                ) {
                  singleQuantity =
                    purchaseOrderAllInformation.detailsData[i].quantity;
                  singleTotalAmount =
                    purchaseOrderAllInformation.detailsData[i].totalAmount;
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
                              setPurchaseOrderAllInformation((prev) => {
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
                          setPurchaseOrderAllInformation((prev) => {
                            const temp_details = [...prev.detailsData];
                            const newDetail = { ...temp_details[index] };
                            newDetail["itemDescription"] = e.target.value;
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
                        value={!detail?.quantity ? 0 : detail?.quantity}
                        style={{
                          border: "1px solid #2DDC1B",
                          padding: "5px",
                          width: "100%",
                          borderRadius: "5px",
                          height: "38px",
                          marginBottom: "5px",
                          textAlign: "center",
                        }}
                        onChange={(e) => handleKeyUp(e, index, detail)}
                      />
                      <br />
                    </td>

                    <td className="text-center  align-items-center">
                      <Field
                        type="number"
                        name={`detailsData.${index}.unitPrice`}
                        placeholder="Unit Price"
                        step="0.01"
                        value={!detail?.unitPrice ? 0 : detail?.unitPrice}
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
                          const inputValue = e.target.value;
                          const parsedValue = parseFloat(inputValue);
                          const calculateTotalAmount = parseFloat(
                            (parsedValue * detail.quantity).toFixed(2)
                          );
                        
                          setPurchaseOrderAllInformation((prev) => {
                            const temp_details = [...prev.detailsData];
                            const newDetail = { ...temp_details[index] };
                            newDetail["unitPrice"] = parsedValue;
                            newDetail["totalAmount"] = calculateTotalAmount;
                        
                            temp_details[index] = newDetail;
                        
                            const totalGrandTotalAmounts = temp_details.reduce(
                              (total, item) => total + parseFloat(item.totalAmount),
                              0
                            );
                        
                            return {
                              ...prev,
                              detailsData: temp_details,
                              updateBy: makebyUser,
                              updateDate: new Date(),
                              grandTotalAmount: parseFloat(totalGrandTotalAmounts.toFixed(2))
                            };
                          });
                        }}
                      />
                      <br />
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
                          setPurchaseOrderAllInformation((prev) => {
                            const temp__details = [...prev.detailsData];
                            if (temp__details.length > 1)
                              temp__details.splice(index, 1);
                            const totalGrandQuantitys = temp__details.reduce(
                              (total, item) =>
                                total + parseFloat(item.quantity),
                              0
                            );
                            const totalGrandTotalAmounts = temp__details.reduce(
                              (total, item) => total + item.totalAmount,
                              0
                            );
                            return {
                              ...prev,
                              detailsData: [...temp__details],
                              updateBy: makebyUser,
                              updateDate: new Date(),
                              grandTotalQuantity: totalGrandQuantitys,
                              grandTotalAmount: totalGrandTotalAmounts,
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
  );
};

export default UpdatePurchaseOrderInfo;
