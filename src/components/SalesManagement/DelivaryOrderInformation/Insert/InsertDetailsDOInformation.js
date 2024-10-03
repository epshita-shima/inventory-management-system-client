import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import React from "react";
import Select from "react-select";

const InsertDetailsDOInformation = ({ details, arrayHelpers }) => {
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
                      style={{ width: "25%" }}
                    >
                      Previous Deliver Quantity
                    </th>
                    <th
                      className="bg-white text-center  align-items-center"
                      style={{ width: "20%" }}
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
                    ? details.map((detail, index) => {
                        console.log(detail.totalNetQuantity);
                        return (
                          <tr key={index}>
                            <td className="text-center  align-middle">
                              {index + 1}
                            </td>

                            <td className="text-center  align-items-center">
                              <Field
                                type="number"
                                name={`detailsData.${index}.itemId`}
                                placeholder="Amount"
                                value={detail.amount}
                                style={{
                                  border: "1px solid #2DDC1B",
                                  padding: "5px",
                                  width: "100%",
                                  borderRadius: "5px",
                                  height: "38px",
                                  marginBottom: "5px",
                                  textAlign: "center",
                                }}
                                onKeyUp={(e) => {}}
                              />
                              <br />
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
                                name={`detailsData.${index}.totalNetQuantity`}
                                placeholder="Total Net Quantity"
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
                                name={`detailsData.${index}.deliveryQuantity`}
                                placeholder="Deliver Quantity"
                                value={detail.deliveryQuantity}
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

                            <td className="text-center  align-middle">
                              <button
                                type="button"
                                className=" border-0 rounded  bg-transparent"
                                onClick={() => {
                                  arrayHelpers.remove(index, 1);
                                  //   setFormValues((prev) => {
                                  //     const temp__details = [...prev.detailsData];
                                  //     if (temp__details.length > 1)
                                  //       temp__details.splice(index, 1);

                                  //     return {
                                  //       ...prev,
                                  //       detailsData: [...temp__details],
                                  //     };
                                  //   });
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
