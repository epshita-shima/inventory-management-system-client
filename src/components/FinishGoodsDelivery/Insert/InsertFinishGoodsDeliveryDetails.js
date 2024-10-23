import { Field } from "formik";
import React from "react";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";

const InsertFinishGoodsDeliveryDetails = ({ deliveryOrderInformation }) => {
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
                  Item Name
                </th>
                <th className="bg-white text-center align-items-center ">
                  Deliver Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveryOrderInformation &&
              deliveryOrderInformation?.detailsData?.length > 0
                ? deliveryOrderInformation?.detailsData?.map(
                    (detail, index) => {
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
                        </tr>
                      );
                    }
                  )
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InsertFinishGoodsDeliveryDetails;
