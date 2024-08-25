import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import React, { useEffect } from "react";
import { useGetAllGRNInformationQuery } from "../../../redux/features/goodsreceivenoteinfo/grninfoApi";
import '../Update/UpdateGRNInfo.css'
const InsertGRNDetailsInfo = ({
  details,
  values,
  rmItemInfo,
  setTotalGrandQuantity,
  setTotalGrandAmount,
  setFieldValue,
  touched,
  errors,
  purchaseOrderInfo,
  totalGrandAmount,
  totalGrandQuantity,
  arrayHelpers,
}) => {
  const { data: grnInfoData } = useGetAllGRNInformationQuery(undefined);

  console.log(purchaseOrderInfo);
  useEffect(() => {
    // Calculate the grand totals when details change
    let calGrandTotalQuantity = 0;
    let calTotalAmount = 0;

    details.forEach((detail) => {
      calGrandTotalQuantity += +detail.quantity || 0;
      calTotalAmount += +detail.totalAmount || 0;
    });

    setTotalGrandQuantity(calGrandTotalQuantity);
    setTotalGrandAmount(calTotalAmount);

    setFieldValue("grandTotalQuantity", calGrandTotalQuantity);
    setFieldValue("grandTotalAmount", calTotalAmount);
  }, [details,setTotalGrandAmount,setTotalGrandQuantity, setFieldValue]);

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
            <th className="bg-white text-center  align-items-center">Sl</th>
            <th className="bg-white text-center  align-items-center">
              Item Name
            </th>
            <th className="bg-white text-center  align-items-center">
              Previous Received Quantity
            </th>
            <th className="bg-white text-center  align-items-center ">
              Quantity
            </th>
            <th className="bg-white text-center  align-items-center ">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {details && details.length > 0
            ? details.map((detail, index) => {
                const matchingItem = rmItemInfo?.find(
                  (item) => item._id === detail.itemId
                );

                const matchPONO = purchaseOrderInfo?.find(
                  (item) => item.poNo === values.supplierPoNo
                );

                const itemIdToCalculate = matchingItem._id;
                const totalQuantity = grnInfoData.reduce((acc, cur) => {
                  const itemQuantity = cur.detailsData
                    .filter(
                      (item) =>
                        item.itemId === itemIdToCalculate &&
                        item.pOSingleId === matchPONO._id
                    )
                    .reduce(
                      (itemAcc, itemCur) => itemAcc + itemCur.quantity,
                      0
                    );
                  return acc + itemQuantity;
                }, 0);

                console.log(totalQuantity);
                return (
                  <tr key={index}>
                    <td className="text-center  align-middle">{index + 1}</td>
                    <td className="text-center  align-items-center">
                      <Field
                        type="text"
                        name={`detailsData.${index}.itemId`}
                        disabled
                        placeholder="Item Name"
                        value={matchingItem.itemName}
                        style={{
                          border: "1px solid #2DDC1B",
                          padding: "5px",
                          width: "100%",
                          borderRadius: "5px",
                          height: "38px",
                          marginBottom: "5px",
                          textAlign: "center",
                          background: "#F1F5F9",
                        }}
                        onKeyUp={(e) => {
                          console.log(e.target.value);
                          setFieldValue(
                            `detailsData.${index}.itemId`,
                            e.target.value
                          );
                        }}
                      />
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
                        type="text"
                        name={`detailsData.${index}.itemId`}
                        disabled
                        placeholder="Previous received quantity"
                        value={totalQuantity}
                        style={{
                          border: "1px solid #2DDC1B",
                          padding: "5px",
                          width: "100%",
                          borderRadius: "5px",
                          height: "38px",
                          marginBottom: "5px",
                          textAlign: "center",
                          background: "#F1F5F9",
                        }}
                        onKeyUp={(e) => {
                          console.log(e.target.value);
                          setFieldValue(
                            `detailsData.${index}.itemId`,
                            e.target.value
                          );
                        }}
                      />
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
                        type="text"
                        name={`detailsData.${index}.quantity`}
                        placeholder="Quantity"
                        value={detail.quantity}
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
                          const calculateTotalAmount =
                            e.target.value * detail.unitPrice;

                          setFieldValue(
                            `detailsData.${index}.totalAmount`,
                            calculateTotalAmount
                          );
                          setFieldValue(
                            `detailsData.${index}.quantity`,
                            e.target.value
                          );
                          setFieldValue("grandTotalAmount", totalGrandAmount);
                          setFieldValue(
                            "grandTotalQuantity",
                            totalGrandQuantity
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
            </div>
            </div>
            </div>
      
    </div>
  );
};

export default InsertGRNDetailsInfo;
