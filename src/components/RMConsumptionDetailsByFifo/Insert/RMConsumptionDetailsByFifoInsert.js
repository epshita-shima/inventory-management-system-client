import { Field, FieldArray, Formik } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import getMakebyUser from "./../../Common/CommonMakeUser/CommonMakingUser";
import * as Yup from "yup";
import swal from "sweetalert";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import "./RMConsumptionDetailsByFifo.css";

const RMConsumptionDetailsByFifoInsert = ({
  showModal,
  setShowModal,
  selectedItem,
  purchaseData,
  filterItemData,
  initialValues,
  valuesData,
  setFieldValue,
  valueIndex,
  data,
  rawMateialData,
}) => {
  const makebyUser = getMakebyUser();
  const { data: rawMaterialData } = useGetAllRMItemInformationQuery(undefined);
  console.log(valuesData);
  const itemNameMatching = rawMaterialData?.find(
    (item) => item._id === selectedItem
  );

  const handleSubmitMaterialUSed = (e, values, resetForm) => {
    e.preventDefault();
    const filtredData = values.detailsData.filter(
      (item) => item.materialUsed !== ""
    );
    const totalMaterialUSed = filtredData.reduce((sum, details) => {
      return sum + details.materialUsed;
    }, 0);
    setFieldValue(`detailsData.${valueIndex}.materialUsed`, totalMaterialUSed);
    setFieldValue(`detailsData.${valueIndex}.detailsMaterialUsed`, filtredData);
    setShowModal(false);
  };
  console.log();
  return (
    <>
      {showModal && (
        <>
          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>

          {/* Modal itself */}
          <div
            className="modal show"
            style={{ display: "block" }}
            tabIndex="-1"
            role="dialog"
          >
            <div
              className="modal-dialog fullscreen-modal-poruction-create"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{`Selected ${itemNameMatching?.itemName} Details  `}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object({
                      detailsData: Yup.array().of(
                        Yup.object().shape({
                          unitInfo: Yup.string().required("Required"),
                        })
                      ),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      resetForm({ values: initialValues });
                      setSubmitting(false);
                    }}
                  >
                    {({
                      values,
                      resetForm,
                      setFieldValue,
                      errors,
                      touched,
                    }) => (
                      <Form
                        id="materialused-info-form"
                        // onSubmit={(e) => {
                        //   handleSubmitMaterialUSed(e, values, resetForm);
                        // }}
                      >
                        <FieldArray
                          name="detailsData"
                          render={() => {
                            const details = values.detailsData;
                            console.log(details);
                            return (
                              <div
                                className=" flex-1 items-center d-flex-nowrap"
                                style={{ height: "60vh", overflowY: "auto" }}
                              >
                                <table className="table w-full table-bordered">
                                  <thead className="w-100">
                                    <tr>
                                      <th className="bg-white text-center align-middle  ">
                                        Sl
                                      </th>

                                      <th className="bg-white text-center align-middle ">
                                        Purchase Date
                                      </th>
                                      <th className="bg-white text-center align-middle ">
                                        Quantity
                                      </th>
                                      <th className="bg-white text-center align-middle ">
                                        Rate
                                      </th>
                                      <th className="bg-white text-center align-middle ">
                                        Amount
                                      </th>
                                      <th className="bg-white text-center align-middle ">
                                        Previous Material Used
                                      </th>
                                      <th className="bg-white text-center align-middle ">
                                        Closing Stock
                                      </th>
                                      <th className="bg-white text-center align-middle ">
                                        Matrial Used
                                        <span className="text-danger fw-bold fs-2">
                                          *
                                        </span>
                                      </th>
                                    </tr>
                                  </thead>
                                  {details && details.length > 0
                                    ? details.map((detail, index) => {
                                        return (
                                          <tbody>
                                            <tr key={index}>
                                              <td className="bg-white text-center align-middle">
                                                {index + 1}
                                              </td>

                                              <td className="text-center align-middle">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.receivedDate`}
                                                  placeholder="received date"
                                                  value={detail?.receivedDate}
                                                  required
                                                  disabled
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                    textAlign: "center",
                                                  }}
                                                  onClick={(e) => {
                                                    setFieldValue(
                                                      "receivedDate",
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center align-middle">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.quantity`}
                                                  placeholder="quantity"
                                                  value={detail?.quantity}
                                                  required
                                                  disabled
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                    textAlign: "center",
                                                  }}
                                                  onClick={(e) => {
                                                    setFieldValue(
                                                      "quantity",
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center align-middle">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.unitPrice`}
                                                  placeholder="rate"
                                                  value={detail?.unitPrice}
                                                  required
                                                  disabled
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                    textAlign: "center",
                                                  }}
                                                  onClick={(e) => {
                                                    setFieldValue(
                                                      "unitPrice",
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center align-middle">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.amount`}
                                                  placeholder="amount"
                                                  value={detail?.amount}
                                                  required
                                                  disabled
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                    textAlign: "center",
                                                  }}
                                                  onClick={(e) => {
                                                    setFieldValue(
                                                      "amount",
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center align-middle">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.previousMaterialUsed`}
                                                  placeholder="previous material used"
                                                  value={detail?.previousUsed}
                                                  required
                                                  disabled
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                    textAlign: "center",
                                                  }}
                                                  onClick={(e) => {
                                                    setFieldValue(
                                                      "previousMaterialUsed",
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center align-middle">
                                                <Field
                                                  type="text"
                                                  name={`detailsData.${index}.closingStock`}
                                                  placeholder="closing stock"
                                                  value={detail?.closingStock}
                                                  required
                                                  disabled
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                    textAlign: "center",
                                                  }}
                                                  onClick={(e) => {
                                                    setFieldValue(
                                                      "closingStock",
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              </td>
                                              <td className="text-center align-middle">
                                                <Field
                                                  type="number"
                                                  name={`detailsData.${index}.materialUsed`}
                                                  placeholder="material used"
                                                  value={detail?.materialUsed}
                                                  disabled={
                                                    index > 0 &&
                                                    values.detailsData[
                                                      index - 1
                                                    ]?.closingStock !==
                                                      values.detailsData[
                                                        index - 1
                                                      ]?.materialUsed
                                                  }
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                    textAlign: "center",
                                                  }}
                                                  onChange={(e) => {
                                                    const usedValue = Number(
                                                      e.target.value
                                                    );
                                                    if (
                                                      detail.closingStock <
                                                      usedValue
                                                    ) {
                                                      swal({
                                                        title: "Sorry!",
                                                        text: "You can not used more than closing stock.",
                                                        icon: "warning",
                                                        button: "OK",
                                                      });
                                                      return;
                                                    }
                                                    // setFieldValue(
                                                    //   `detailsData.${index}.materialUsed`,
                                                    //   usedValue
                                                    // );

                                                    const updatedDetails = [
                                                      ...values.detailsData,
                                                    ];
                                                    const currentClosingStock =
                                                      updatedDetails[index]
                                                        .closingStock;
                                                    const isCurrentRowFinished =
                                                      usedValue ===
                                                      currentClosingStock;

                                                    if (
                                                      isCurrentRowFinished &&
                                                      updatedDetails[index + 1]
                                                    ) {
                                                    } else {
                                                      // If not fully used, clear all the next rows' materialUsed
                                                      for (
                                                        let i = index + 1;
                                                        i <
                                                        updatedDetails.length;
                                                        i++
                                                      ) {
                                                        setFieldValue(
                                                          `detailsData.${i}.materialUsed`,
                                                          ""
                                                        );
                                                      }
                                                    }
                                                    const newValue = parseFloat(e.target.value) || 0; // Default to 0 if invalid
                                                    const updatedDetailsData = [...details]; // Make a copy of the details array
                                                  
                                                    // Assuming you're updating the materialUsed of the specific index
                                                    updatedDetailsData[index].materialUsed = newValue;
                                                  
                                                    // Recalculate the total
                                                    const totalMaterialUsed = updatedDetailsData.reduce((total, detail) => {
                                                      return total + (parseFloat(detail.materialUsed) || 0); // Add each materialUsed value
                                                    }, 0);
                                                    const value1 =
                                                      parseFloat(
                                                        totalMaterialUsed
                                                      );
                                                    const value2 = parseFloat(
                                                      valuesData.detailsData[
                                                        index
                                                      ]?.asPerRatio
                                                    );
                                                    const calculateExcessOrLess =
                                                      value1 - value2;
                                                console.log('totalMaterialUsed=',totalMaterialUsed,'calculateExcessOrLess=',calculateExcessOrLess)
                                                    const existingPurchaseItem =
                                                      data.find(
                                                        (details) =>
                                                          details.itemId ===
                                                          detail.itemId
                                                      );

                                                    console.log(
                                                      existingPurchaseItem
                                                    );
                                                    const itemNamesFind =
                                                      rawMateialData.find(
                                                        (item) =>
                                                          item._id ===
                                                          detail.itemId
                                                      );
                                                    if (existingPurchaseItem) {
                                                      if (
                                                        existingPurchaseItem?.stockInHand >
                                                        e.target.value
                                                      ) {
                                                        if (
                                                          calculateExcessOrLess ===
                                                          0
                                                        ) {
                                                          setFieldValue(
                                                            `detailsData.${index}.less`,
                                                            0
                                                          );
                                                          setFieldValue(
                                                            `detailsData.${index}.excess`,
                                                            0
                                                          );
                                                          setFieldValue(
                                                            `detailsData.${index}.consumptionStatus`,
                                                            "No Change"
                                                          );
                                                        } else if (
                                                          calculateExcessOrLess <
                                                          0
                                                        ) {
                                                          setFieldValue(
                                                            `detailsData.${index}.less`,
                                                            Math.abs(
                                                              Math.round(
                                                                calculateExcessOrLess *
                                                                  100
                                                              ) / 100
                                                            )
                                                          );
                                                          setFieldValue(
                                                            `detailsData.${index}.excess`,
                                                            0
                                                          );
                                                          setFieldValue(
                                                            `detailsData.${index}.consumptionStatus`,
                                                            "Less"
                                                          );
                                                        } else if (
                                                          calculateExcessOrLess >
                                                          0
                                                        ) {
                                                          setFieldValue(
                                                            `detailsData.${index}.excess`,
                                                            Math.abs(
                                                              (Math.round(
                                                                calculateExcessOrLess
                                                              ) *
                                                                100) /
                                                                100
                                                            )
                                                          );
                                                          setFieldValue(
                                                            `detailsData.${index}.less`,
                                                            0
                                                          );
                                                          setFieldValue(
                                                            `detailsData.${index}.consumptionStatus`,
                                                            "Excess"
                                                          );
                                                        }

                                                        setFieldValue(
                                                          `detailsData.${index}.materialUsed`,
                                                          e.target.value
                                                        );
                                                      } else {
                                                        const quantity =
                                                          parseFloat(
                                                            existingPurchaseItem?.stockInHand ||
                                                              0
                                                          );
                                                        const materialUsed =
                                                          parseFloat(
                                                            detail.materialUsed ||
                                                              0
                                                          );

                                                        const remaining =
                                                          quantity -
                                                          materialUsed;
                                                        const formattedRemaining =
                                                          remaining.toFixed(2);
                                                        swal(
                                                          "Sorry!",
                                                          `Please purchase ${itemNamesFind?.itemName}. Remaing stock quantity is ${formattedRemaining}`,
                                                          "warning"
                                                        );
                                                      }
                                                    } else {
                                                      swal(
                                                        "Sorry!",
                                                        `${itemNamesFind?.itemName} Stock not Available`,
                                                        "warning"
                                                      );
                                                    }
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        );
                                      })
                                    : null}
                                </table>
                              </div>
                            );
                          }}
                        />
                        <div className="text-right mt-4">
                          <button
                            className="btn text-uppercase rounded-4"
                            data-dismiss="modal"
                            style={{
                              border: "1px solid #2DDC1B",
                              color: "#2DDC1B",
                              fontWeight: "700",
                              outline: "none",
                            }}
                            onClick={() => setShowModal(false)}
                          >
                            Cancle
                          </button>
                          <button
                            className="btn text-uppercase rounded-4 ms-4"
                            style={{
                              background: "#2DDC1B",
                              color: "#fff",
                              fontWeight: "700",
                              outline: "none",
                              border: "none",
                            }}
                            type="button"
                            onClick={(e) => handleSubmitMaterialUSed(e, values)}
                          >
                            Save Info
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
                {/* <div className="modal-footer">
               <button
                 type="button"
                 className="btn btn-secondary"
                 onClick={() => setShowModal(false)}
               >
                 Close
               </button>
             </div> */}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RMConsumptionDetailsByFifoInsert;
