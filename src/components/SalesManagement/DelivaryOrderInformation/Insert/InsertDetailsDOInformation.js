import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import React from "react";
import swal from "sweetalert";

const InsertDetailsDOInformation = ({
  details,
  arrayHelpers,
  finishgoods,
  itemSize,
  setFieldValue,
  invoiceInformation,
  setPaymentReceiveSelectedItem,
  checkNetTotalQuantity
}) => {
  console.log(details);
  return (
    <div
      className="shadow-lg p-4 grninsertdata-main-view"
      // style={{ height: "300px", overflowY: "auto" }}
    >
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-md-12 col-lg-12 fixed-column py-2">
            <div class="table-responsive">
              <table className="table table-bordered">
                <thead className="w-100">
                  <tr>
                    <th className="bg-white text-center  align-items-center">
                      Sl
                    </th>
                    <th
                      className="bg-white text-center  align-items-center"
                      style={{ width: "25%" }}
                    >
                      Item Name
                    </th>
                    <th
                      className="bg-white text-center  align-items-center"
                      // style={{ width: "25%" }}
                    >
                      PI Quantity
                    </th>
                    <th
                      className="bg-white text-center  align-items-center"
                      // style={{ width: "25%" }}
                    >
                      Paid Quantity
                    </th>
                    <th
                      className="bg-white text-center  align-items-center"
                      // style={{ width: "25%" }}
                    >
                      Adjust Quantity
                    </th>
                    <th
                      className="bg-white text-center  align-items-center"
                      // style={{ width: "25%" }}
                    >
                      Previous Deliver Quantity
                    </th>
                    <th
                      className="bg-white text-center  align-items-center"
                      // style={{ width: "20%" }}
                    >
                      Due Quantity
                    </th>
                    <th className="bg-white text-center  align-items-center ">
                      Deliver Quantity
                    </th>

                    <th className="bg-white text-center  align-items-center ">
                      Action
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
                          (x) => x.invoiceNo === details[0]?.piNumber
                        );

                        const findPiQuantityPerItem =
                          filterPIData[0]?.detailsData?.find(
                            (item) => item.itemId === detail?.itemId
                          );

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
                                name={`detailsData.${index}.previousdeliveryquantity`}
                                placeholder="Previous Deliver Quantity"
                                value={0}
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
                                name={`detailsData.${index}.dueQuantity`}
                                placeholder="Due Quantity"
                                value={0}
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
                                name={`detailsData.${index}.deliveryQuantity`}
                                placeholder="Deliver Quantity"
                                value={detail.totalNetQuantity}
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
                                  const newValue = Number(e.target.value);
                                  const totalNetQuantity =
                                  checkNetTotalQuantity[0].detailsData[index].totalNetQuantity;
                                
                                  if (totalNetQuantity < newValue) {
                                    swal({
                                      title: "Not Possible",
                                      text: "You can't deliver more quantity.",
                                      icon: "warning",
                                      button: "OK",
                                    });
                                    return;
                                  } else {
                                  
                                    setPaymentReceiveSelectedItem((prev) => {
                                      const temp_details = [
                                        ...prev[0].detailsData,
                                      ];
                                      const newDetail = {
                                        ...temp_details[index],
                                      }; 
                                      newDetail.totalNetQuantity = newValue; 
                                      temp_details[index] = newDetail; 
                                      return [
                                        {
                                          ...prev[0],
                                          detailsData: temp_details,
                                        },
                                        ...prev.slice(1),
                                      ];
                                    });
                                  }
                                }}
                              />
                              <br />
                            </td>

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
      </div>
    </div>
  );
};

export default InsertDetailsDOInformation;
