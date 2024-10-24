import { Field } from "formik";
import React from "react";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";

const InsertDeliverReturnDetails = ({
  doDetailsFilteredData,
  setDoDetailsFilteredData,
  values,
  setFieldValue,
  touched,
  errors,
}) => {
  const { data: finishGoods } = useGetAllItemInformationQuery(undefined);
  const { data: itemSizeInfo } = useGetAllItemSizeQuery(undefined);
  return (
    <div class="row justify-content-center">
      <div class="col-12 col-md-12 col-lg-12 fixed-column py-2">
        <div class="table-responsive">
          <table className="table table-bordered">
            <thead className="w-100">
              <tr>
                <th className="bg-white text-center align-items-center">Sl</th>

                <th className="bg-white text-center align-items-center">
                  DO Number
                </th>
                <th
                  className="bg-white text-center align-items-center"
                  style={{ width: "25%" }}
                >
                  Item Name
                </th>
                <th className="bg-white text-center align-items-center ">
                  Deliver Qty
                </th>
                <th className="bg-white text-center align-items-center ">
                  Return Qty
                </th>
                <th className="bg-white text-center align-items-center ">
                  Delivered Challan No
                </th>
                <th className="bg-white text-center align-items-center ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {doDetailsFilteredData &&
              doDetailsFilteredData?.detailsData?.length > 0
                ? doDetailsFilteredData?.detailsData?.map((detail, index) => {
                    const itemName = finishGoods?.find(
                      (item) => item._id == detail.itemId
                    );
                    console.log(itemName);
                    const sizeInfo = itemSizeInfo?.find(
                      (size) => size._id == itemName?.sizeId
                    );
                    console.log(sizeInfo);
                    return (
                      <tr key={index}>
                        <td className="text-center  align-middle">
                          {index + 1}
                        </td>

                        <td className="text-center  align-items-center">
                          <Field
                            type="text"
                            name={`detailsData.${index}.doNo`}
                            placeholder="Do Number"
                            value={doDetailsFilteredData.doNo}
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
                            name={`detailsData.${index}.itemName`}
                            placeholder="Less"
                            value={`${itemName?.itemName} (${sizeInfo?.sizeInfo})`}
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
                            name={`detailsData.${index}.deliverQty`}
                            placeholder="Deliver Quantity"
                            value={detail?.deliverQty}
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
                            name={`detailsData.${index}.returnQty`}
                            placeholder="Return Quantity"
                            value={values.detailsData[{index}]?.returnQty}
                            required
                            style={{
                              border: "1px solid #2DDC1B",
                              padding: "5px",
                              width: "100%",
                              borderRadius: "5px",
                              height: "38px",
                              textAlign: "center",
                            }}
                            onChange={(e) => {
                              if (detail.deliverQty < e.target.value) {
                                swal({
                                  title: "Not Possible!",
                                  text: "You can not return more than delivered quantity",
                                  icon: "warning",
                                  button: "OK",
                                });
                                setFieldValue(
                                  `detailsData.${index}.returnQty`,
                                  ''
                                );
                                e.target.value=''
                              } else {
                                setFieldValue(
                                  `detailsData.${index}.returnQty`,
                                  e.target.value
                                );
                              }
                            }}
                          />
                          <br />
                          {touched?.detailsData?.[index]?.returnQty &&
                            errors?.detailsData?.[index]?.returnQty && (
                              <div className="text-danger">
                                {errors?.detailsData[index].returnQty}
                              </div>
                            )}
                        </td>
                        <td className="text-center  align-items-center">
                          <Field
                            type="text"
                            name={`detailsData.${index}.deliveryChallanNo`}
                            placeholder="Delivery Challan No"
                            value={doDetailsFilteredData?.deliveryChallanNo}
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
                        <td className="text-center align-middle">
                          <button
                            type="button"
                            className=" border-0 rounded  bg-transparent"
                            onClick={() => {
                              setDoDetailsFilteredData((prev) => {
                                const temp__details = [...prev.detailsData];
                                if (temp__details.length > 1)
                                  temp__details.splice(index, 1);

                                return {
                                  ...prev,
                                  detailsData: [...temp__details],
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
};

export default InsertDeliverReturnDetails;
