import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import React, { useEffect } from "react";
import swal from "sweetalert";
import "./InsertDetailsDOInformation.css";
const InsertDetailsDOInformation = ({
  details,
  arrayHelpers,
  finishgoods,
  itemSize,
  setFieldValue,
  invoiceInformation,
  setPaymentReceiveSelectedItem,
  checkNetTotalQuantity,
  setIsDOSave,
  values,
}) => {
  console.log(details);
  useEffect(() => {
    details[0]?.detailsData.forEach((detail, index) => {
      const filterPIData = invoiceInformation?.filter(
        (x) => x._id === details[0]?.piNumber
      );

      const findPiQuantityPerItem = filterPIData[0]?.detailsData?.find(
        (item) => item.itemId === detail?.itemId
      );
      const separatePaidTotalQuantity = Number(detail.totalNetQuantity);
      const separateDeliveredQty = Number(findPiQuantityPerItem?.deliveredQty);
      const separateReturnQty = Number(findPiQuantityPerItem?.returnQty);
      const itemsDeliverQty = separatePaidTotalQuantity - separateDeliveredQty;
      const itemsNetDeliverQty = itemsDeliverQty + separateReturnQty;

      setFieldValue(
        `detailsData.${index}.deliverQty`,
        Math.abs(itemsNetDeliverQty)
      );

      // Control button behavior based on the net delivery quantity
      if (itemsNetDeliverQty < 0) {
        setIsDOSave(true);
      } else {
        setIsDOSave(false);
      }
    });
  }, [details, invoiceInformation, setFieldValue, setIsDOSave]);
  console.log(values);
  return (
    <div className="shadow-lg  doinsertdata-main-view">
      <div class="col-12 col-md-12 col-lg-12 py-2">
        <div class="table-responsive">
          <table className="table table-bordered">
            <thead className="w-100">
              <tr>
                <th className="bg-white text-center  align-items-center">Sl</th>
                <th
                  className="bg-white text-center  align-items-center"
                  style={{ width: "19%" }}
                >
                  Item Name
                </th>
                <th className="bg-white text-center  align-items-center">
                  PI Qty
                </th>
                <th className="bg-white text-center  align-items-center">
                  Paid Qty
                </th>
                <th className="bg-white text-center  align-items-center">
                  Adjust Qty
                </th>
                <th className="bg-white text-center  align-items-center ">
                  Net. Qty
                </th>
                <th className="bg-white text-center  align-items-center">
                  Previous Deliver Qty
                </th>
                <th
                  className="bg-white text-center  align-items-center"
                  // style={{ width: "20%" }}
                >
                  Return Qty
                </th>

                <th className="bg-white text-center  align-items-center ">
                  Deliver Qty
                </th>

                <th className="bg-white text-center  align-items-center ">
                  Action
                </th>
              </tr>
              <tr>
                <th className="bg-white text-center  align-items-center"></th>
                <th
                  className="bg-white text-center  align-items-center"
                  style={{ width: "19%" }}
                ></th>
                <th className="bg-white text-center  align-items-center"></th>
                <th className="bg-white text-center  align-items-center">1</th>
                <th className="bg-white text-center  align-items-center">2</th>
                <th className="bg-white text-center  align-items-center ">
                  3=1-2
                </th>
                <th className="bg-white text-center  align-items-center">4</th>
                <th className="bg-white text-center  align-items-center">5</th>

                <th className="bg-white text-center  align-items-center">
                  6=4-1+5
                </th>
                <th className="bg-white text-center  align-items-center">
                </th>
              </tr>
            </thead>

            <tbody>
              {details && details.length > 0
                ? details[0]?.detailsData.map((detail, index) => {
                    const matchingItem = finishgoods?.find(
                      (item) => item._id === detail.itemId
                    );

                    const itemSizeInfo = itemSize?.find(
                      (item) => item._id === matchingItem.sizeId
                    );

                    const filterPIData = invoiceInformation?.filter(
                      (x) => x._id === details[0]?.piNumber
                    );

                    const findPiQuantityPerItem =
                      filterPIData[0]?.detailsData?.find(
                        (item) => item.itemId === detail?.itemId
                      );

                    const itemsDeliverQty =
                      detail.paidTotalQuantity -
                      findPiQuantityPerItem?.deliveredQty;
                    const itemsNetDeliverQty =
                      itemsDeliverQty + findPiQuantityPerItem.returnQty;

                    if (itemsNetDeliverQty < 0) {
                      setIsDOSave(true);
                    } else {
                      setIsDOSave(false);
                    }

                    return (
                      <tr key={index}>
                        <td className="text-center align-middle">
                          {index + 1}
                        </td>

                        <td className="text-center align-items-center">
                          <Field
                            type="number"
                            name={`detailsData.${index}.itemId`}
                            placeholder={
                              matchingItem.itemName +
                              ` (${itemSizeInfo.sizeInfo})`
                            }
                            value={matchingItem.itemName}
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
                            name={`detailsData.${index}.piQuantity`}
                            placeholder="PI quantity"
                            value={findPiQuantityPerItem?.quantity}
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
                            name={`detailsData.${index}.paidTotalQuantity`}
                            placeholder="Paid Quantity"
                            value={detail.paidTotalQuantity}
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
                            name={`detailsData.${index}.totalAdjustQuantity`}
                            placeholder="Total Net Quantity"
                            value={detail.adjustTotalQuantity}
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
                          <br />
                        </td>
                        <td className="text-center  align-items-center">
                          <Field
                            type="number"
                            name={`detailsData.${index}.totalNetQuantity`}
                            placeholder="Deliver Quantity"
                            value={detail.totalNetQuantity}
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
                          <br />
                        </td>
                        <td className="text-center  align-items-center">
                          <Field
                            type="number"
                            name={`detailsData.${index}.previousdeliveryquantity`}
                            placeholder="Previous Deliver Quantity"
                            value={findPiQuantityPerItem?.deliveredQty}
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
                            onClick={(e) => {
                              setFieldValue();
                            }}
                          />
                        </td>
                        <td className="text-center  align-items-center">
                          <Field
                            type="number"
                            name={`detailsData.${index}.returnQty`}
                            placeholder="Return Quantity"
                            value={findPiQuantityPerItem?.returnQty}
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
                            onClick={(e) => {
                              setFieldValue();
                            }}
                          />
                          <br />
                        </td>

                        <td className="text-center  align-items-center">
                          <Field
                            type="number"
                            name={`detailsData.${index}.deliverQty`}
                            placeholder="Deliver Quantity"
                            value={values.detailsData[index]?.deliverQty}
                            disabled={itemsNetDeliverQty < 0 ? true : false}
                            style={{
                              border: "1px solid #2DDC1B",
                              padding: "5px",
                              width: "100%",
                              borderRadius: "5px",
                              height: "38px",
                              marginBottom: "5px",
                              textAlign: "center",
                              color: `${
                                itemsNetDeliverQty < 0 ? "red" : "black"
                              }`,
                            }}
                            onChange={(e) => {
                              const newValue = Number(e.target.value);
                              console.log(newValue, itemsNetDeliverQty);
                              // Check if the input exceeds itemsNetDeliverQty
                              if (newValue > Number(itemsNetDeliverQty)) {
                                swal({
                                  title: "Not Possible",
                                  text: `You cannot deliver more than ${itemsNetDeliverQty}.`,
                                  icon: "warning",
                                  button: "OK",
                                });
                              } else {
                                // Update the Formik field value if valid
                                setFieldValue(
                                  `detailsData.${index}.deliverQty`,
                                  newValue
                                );
                              }
                            }}
                          />
                          <br />
                        </td>
                        {/* <td className="text-center  align-items-center">
                          <Field
                            type="number"
                            name={`detailsData.${index}.deliverQty`}
                            placeholder="Deliver Quantity"
                            value={Math.abs(itemsNetDeliverQty)}
                            disabled={itemsNetDeliverQty < 0 ? true : false}
                            style={{
                              border: "1px solid #2DDC1B",
                              padding: "5px",
                              width: "100%",
                              borderRadius: "5px",
                              height: "38px",
                              marginBottom: "5px",
                              textAlign: "center",
                              color: `${itemsNetDeliverQty < 0 ? 'red' : 'black'}`
                            }}
                            onChange={(e) => {
                              const newValue = Number(e.target.value);
                              
                              // const totalNetQuantity =
                              //   checkNetTotalQuantity[0].detailsData[index]
                              //     .totalNetQuantity;

                              // if (totalNetQuantity < newValue) {
                              //   swal({
                              //     title: "Not Possible",
                              //     text: "You can't deliver more quantity.",
                              //     icon: "warning",
                              //     button: "OK",
                              //   });
                              //   return;
                              // } else {
                              //   setPaymentReceiveSelectedItem((prev) => {
                              //     const temp_details = [...prev[0].detailsData];
                              //     const newDetail = {
                              //       ...temp_details[index],
                              //     };
                              //     newDetail.totalNetQuantity = newValue;
                              //     temp_details[index] = newDetail;
                              //     return [
                              //       {
                              //         ...prev[0],
                              //         detailsData: temp_details,
                              //       },
                              //       ...prev.slice(1),
                              //     ];
                              //   });
                              // }
                            }}
                          />
                          <br />
                        </td> */}

                        <td className="text-center  align-middle">
                          <button
                            type="button"
                            className=" border-0 rounded  bg-transparent"
                            onClick={() => {
                              setPaymentReceiveSelectedItem((prev) => {
                                const temp__details = [...prev[0].detailsData];
                                if (temp__details.length)
                                  temp__details.splice(index, 1);

                                return [
                                  {
                                    ...prev[0],
                                    detailsData: temp__details,
                                  },
                                  ...prev.slice(1), // Keep the rest of the array as is
                                ];
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
};

export default InsertDetailsDOInformation;
