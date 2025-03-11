import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";


const UpdateGRNInfo = ({
  grnSingleData,
  setGRNSingleData,
  rmItemInfo,
  makebyUser,
  setFieldValue,
  touched,
  errors,

}) => {
  const handleKeyUp = (e, index, detail) => {
    const inputValue = e.target.value;
    const parsedValue = parseInt(inputValue, 10);
    const calculateTotalAmount = parsedValue * detail.unitPrice;

    setGRNSingleData((prev) => {
      const temp_details = [...prev.detailsData];
      const newDetail = { ...temp_details[index] };

      newDetail["quantity"] = parsedValue;
      newDetail["amount"] = calculateTotalAmount;

      temp_details[index] = newDetail;

      const totalGrandQuantities = temp_details.reduce(
        (total, item) => total + (parseFloat(item.quantity) || 0),
        0
      );
      const totalGrandTotalAmounts = temp_details.reduce(
        (total, item) => total + (item.amount || 0),
        0
      );

      return {
        ...prev,
        detailsData: [...temp_details],
        updateBy: makebyUser,
        updateDate: new Date(),
        grandTotalReceivedQuantity: totalGrandQuantities,
        grandTotalAmount: totalGrandTotalAmounts,
      };
    });
  };

  return (
    <div className="shadow-lg p-4 grnupdatedata-main-view">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-12 col-lg-12 fixed-column py-2">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="w-100">
                  <tr>
                    <th className="bg-white text-center  align-items-center  ">
                      Sl
                    </th>

                    <th className="bg-white text-center  align-items-center">
                      Item Name
                    </th>
                    <th className="bg-white text-center  align-items-center ">
                      Quantity
                    </th>

                    <th className="bg-white text-center  align-items-center d-none">
                      Amount
                    </th>
                    <th className="bg-white text-center  align-items-center d-none">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {grnSingleData?.detailsData &&
                  grnSingleData?.detailsData.length > 0
                    ? grnSingleData?.detailsData.map((detail, index) => {
                        const matchingItem = rmItemInfo?.find(
                          (item) => item._id === detail.itemId
                        );

                        return (
                          <tr key={index}>
                            <td className="text-center  align-middle">
                              {index + 1}
                            </td>
                            <td className="text-center  align-items-center">
                              <Field
                                type="text"
                                name={`detailsData.${index}.itemId`}
                                disabled
                                placeholder="Item Name"
                                value={matchingItem?.itemName}
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
                              />
                            </td>

                            <td className="text-center  align-items-center">
                              <Field
                                type="text"
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
                                onChange={(e) => {
                                  handleKeyUp(e, index, detail);
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
                            <td className="text-center  align-items-center d-none">
                              <Field
                                type="text"
                                name={`detailsData.${index}.amount`}
                                placeholder="Amount"
                                value={detail.amount}
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
                                onChange={(e) => {
                                  setFieldValue(
                                    `detailsData.${index}.amount`,
                                    e.target.value
                                  );
                                }}
                              />
                            </td>
                            <td className="text-center  align-middle">
                              <button
                                type="button"
                                className=" border-0 rounded  bg-transparent"
                                onClick={() => {
                                  setGRNSingleData((prev) => {
                                    const temp__details = [...prev.detailsData];
                                    if (temp__details.length > 1)
                                      temp__details.splice(index, 1);
                                    const totalGrandQuantitys =
                                      temp__details.reduce(
                                        (total, item) =>
                                          total + parseFloat(item.quantity),
                                        0
                                      );
                                    const totalGrandTotalAmounts =
                                      temp__details.reduce(
                                        (total, item) => total + item.amount,
                                        0
                                      );
                                    return {
                                      ...prev,
                                      detailsData: [...temp__details],
                                      updateBy: makebyUser,
                                      updateDate: new Date(),
                                      grandTotalReceivedQuantity:
                                        totalGrandQuantitys,
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateGRNInfo;
