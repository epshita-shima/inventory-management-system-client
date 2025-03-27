import { Field, FieldArray, Formik } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import getMakebyUser from "./../../Common/CommonMakeUser/CommonMakingUser";
import * as Yup from "yup";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import "./RMConsumptionDetailsByFifo.css";

const RMConsumptionDetailsByFifoInsert = ({
  showModal,
  setShowModal,
  selectedItem,
  purchaseData,
  filterItemData,
}) => {
  const makebyUser = getMakebyUser();
  const { data: rawMaterialData } = useGetAllRMItemInformationQuery(undefined);

  const itemNameMatching = rawMaterialData?.find(
    (item) => item._id === selectedItem
  );

  console.log(filterItemData)
  const previousMaterialUsedData = [
    {
      purchaseDate: "2025-03-23",
      itemId: "677248c1a1a0d9059b94977d",
      quantity: 100,
      rate: 50,
      amount: 5000,
      materialUsed: 80,
      makeBy: "JohnDoe",
      updateBy: "JaneDoe",
      makeDate: "2025-03-27T10:00:00Z",
      updateDate: "",
    },
    {
      purchaseDate: "2025-03-23",
      itemId: "677248c1a1a0d9059b94977c",
      quantity: 200,
      rate: 400,
      amount: 8000,
      materialUsed: 150,
      makeBy: "AliceSmith",
      updateBy: "BobJohnson",
      makeDate: "2025-03-26T09:30:00Z",
      updateDate: "",
    },
    {
      purchaseDate: "2025-03-24",
      itemId: "677248c1a1a0d9059b94977c",
      quantity: 200,
      rate: 400,
      amount: 8000,
      materialUsed: 50,
      makeBy: "AliceSmith",
      updateBy: "BobJohnson",
      makeDate: "2025-03-26T09:30:00Z",
      updateDate: "",
    },
    {
      purchaseDate: "2025-03-25",
      itemId: "677248c1a1a0d9059b94977c",
      quantity: 150,
      rate: 500,
      amount: 9000,
      materialUsed: 120,
      makeBy: "CharlieBrown",
      updateBy: "DavidLee",
      makeDate: "2025-03-25T08:15:00Z",
      updateDate: "",
    },
  ];
  const calculatePreviousUsed = (filterItemData, previousMaterialUsedData) => {
    return filterItemData?.map((purchase) => {
      // Find all previous material usage records for the same item before the purchase date
      const totalMaterialUsed = previousMaterialUsedData
        .filter(
          (usage) =>usage.itemId === purchase.itemId && usage.purchaseDate === purchase.receivedDate 
        )
        .reduce((sum, usage) => sum + usage.materialUsed, 0);
        const closingStock = purchase.quantity - totalMaterialUsed;

      return {
        ...purchase,
        previousUsed: totalMaterialUsed, // Total material used before this purchase
        closingStock,
      };
    }).filter((item)=>item.closingStock !==0)
  };
   
  const result = calculatePreviousUsed(filterItemData, previousMaterialUsedData);
  console.log(JSON.stringify(result));
  const initialValues = {
    detailsData: result?.length > 0 ? result : [
      {
        receivedDate: "",
        itemId: "",
        quantity: '',
        rate: '',
        amount: '',
        materialUsed: '',
        closingStock: '',  // Ensure closingStock is included
        makeBy: makebyUser,
        updateBy: null,
        makeDate: new Date(),
        updateDate: null,
      }
    ]
  };
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
                        id="menucreation-form"
                        onSubmit={(e) => {
                          // handleSubmit(e, values, resetForm);
                        }}
                      >
                        <FieldArray
                          name="detailsData"
                          render={() => {
                            const details = values.detailsData;
console.log(details)
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
                                                  required
                                                  disabled={index > 0 && values.detailsData[index - 1]?.closingStock !== values.detailsData[index - 1]?.materialUsed }
                                                  style={{
                                                    border: "1px solid #2DDC1B",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                    textAlign: "center",
                                                  }}
                                                  onChange={(e) => {
                                                    const usedValue = Number(e.target.value);
                                                    console.log("usedValue",usedValue)
                                                    console.log('detail.closingStock - usedValue',detail)
                                                    setFieldValue(`detailsData.${index}.materialUsed`, usedValue);
                                                    // setFieldValue(`detailsData.${index}.closingStock`, 
                                                    //   Math.max(0, detail.closingStock - usedValue)
                                                    // );
                                                    if (index > 0 && values.detailsData[index - 1]?.closingStock !== values.detailsData[index - 1]?.materialUsed ) {
                                                      setFieldValue(`detailsData.${index}.materialUsed`, '');
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
                            type="submit"
                          >
                            Submit
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
