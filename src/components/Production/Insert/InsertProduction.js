import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import Select from "react-select";
import swal from "sweetalert";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import RMConsumptionDetailsByFifoInsert from "../../RMConsumptionDetailsByFifo/Insert/RMConsumptionDetailsByFifoInsert";
import { useEffect, useState } from "react";
import { useGetAllPurchaseOrderInformationQuery } from "../../../redux/features/purchaseorderinformation/purchaseOrderInfoApi";
import { useLazyGetPurchaseItemReportQuery } from "../../../redux/features/purchasereport/purchasereportApi";
import getMakebyUser from "../../Common/CommonMakeUser/CommonMakingUser";
import "./InsertProduction.css";
import { useGetAllRawMaterialConsumptionInformationQuery } from "../../../redux/features/rawmaterialconsumption/rawconsumptionApi";

const InsertProduction = ({
  details,
  setFieldValue,
  touched,
  errors,
  arrayHelpers,
  values,
  receipeOptions1000,
  cftData,
  rawMaterialsData,
  receipeOptionsLessQty938,
  receipeOptionsLessQty900,
}) => {
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [modalItems, setModalItems] = useState([]);
  const { data: purchaseData } =
    useGetAllPurchaseOrderInformationQuery(undefined);
  const { data: rawMateialData } = useGetAllRMItemInformationQuery(undefined);
  const [triggerStockReport, { data: purchaseItemDetails, isLoading }] =
    useLazyGetPurchaseItemReportQuery();
  const { data: previousMaterialUsedData } =
    useGetAllRawMaterialConsumptionInformationQuery(undefined);
  const [showModal, setShowModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (purchaseItemDetails && !isLoading) {
      setPurchaseItems(purchaseItemDetails);
      setShowModal(true);
      setShowInfo(false);
    }
  }, [purchaseItemDetails, isLoading]);

  function getCftPerKgByItemId(itemId) {
    const itemDatawithCftDeclaration = rawMaterialsData?.find(
      (detail) =>
        String(detail.value) === String(itemId) &&
        detail?.cftDeclaration === true
    );

    const itemDataWithoutCftDeclaration = rawMaterialsData?.find(
      (detail) =>
        String(detail.value) === String(itemId) &&
        detail?.cftDeclaration === false
    );

    if (itemDatawithCftDeclaration !== undefined) {
      for (const entry of cftData) {
        console.log(
          "entry.isActive === true",
          entry.isActive,
          itemDatawithCftDeclaration.value
        );
        if (entry.isActive === true) {
          const itemCft = entry.detailsData.find(
            (detail) => detail.itemId === itemId
          );
          if (itemCft) {
            return itemCft;
          }
        }
      }
      return null;
    } else {
      return itemDataWithoutCftDeclaration;
    }
  }

  const calculatePreviousUsed = (filterItemData, previousMaterialUsedData) => {
    return filterItemData
      ?.map((purchase) => {
        const totalMaterialUsed = previousMaterialUsedData
          ?.filter(
            (usage) =>
              usage.itemId === purchase.itemId &&
              usage.purchaseDate === purchase.receivedDate
          )
          .reduce((sum, usage) => sum + usage.materialUsed, 0);
        const closingStock = purchase.quantity - totalMaterialUsed;

        return {
          ...purchase,
          previousUsed: totalMaterialUsed, // Total material used before this purchase
          closingStock,
          rate: purchase.rate,
        };
      })
      .filter((item) => item.closingStock !== 0);
  };

  const result = calculatePreviousUsed(
    showInfo ? modalItems : purchaseItems,
    previousMaterialUsedData
  );

  const initialValues = {
    detailsData:
      result?.length > 0
        ? result
        : [
            {
              receivedDate: "",
              itemId: "",
              quantity: "",
              rate: "",
              amount: "",
              materialUsed: "",
              closingStock: "",
              makeBy: getMakebyUser,
              updateBy: null,
              makeDate: new Date(),
              updateDate: null,
            },
          ],
  };

  const data = [
    {
      itemId: "677248c1a1a0d9059b94977d",
      productionConsumption: 600,
      purchasePrice: 105,
      purchaseQuantity: 700,
      stockInHand: 100,
    },
    {
      itemId: "677248c1a1a0d9059b94977c",
      productionConsumption: 500,
      purchasePrice: 90,
      purchaseQuantity: 300,
      stockInHand: 200,
    },
  ];

  const handleSelectChange = async (selectedOption) => {
    await triggerStockReport({ itemId: selectedOption });
    setSelectedItem(selectedOption);
  };

  const handleSelectModal = async (selectedOption) => {
    setSelectedItem(selectedOption[0].itemId);
    setModalItems(selectedOption);
    setShowModal(true);
    setShowInfo(true);
  };

  return (
    <div className="row">
      <div className="col-12 col-md-12 col-lg-12 fixed-column">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="w-100">
              <tr>
                <th className="bg-white text-center align-items-center">Sl</th>

                <th
                  className="bg-white text-center align-items-center"
                  style={{ width: "25%" }}
                >
                  Item Name
                  <span className="text-danger fw-bold fs-2">*</span>
                </th>
                <th className="bg-white text-center align-items-center ">
                  Receipe
                </th>

                <th className="bg-white text-center align-items-center ">
                  Material Used
                  <span className="text-danger fw-bold fs-2">*</span>
                </th>

                <th className="bg-white text-center align-items-center ">
                  As Per Ratio
                </th>

                <th className="bg-white text-center align-items-center ">
                  (+) Excess
                </th>
                <th className="bg-white text-center align-items-center ">
                  (-) Less
                </th>
                <th className="bg-white text-center align-items-center d-none">
                  Consumption Status
                </th>
                <th className="bg-white text-center align-items-center ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {details && details.length > 0
                ? details.map((detail, index) => {
                    console.log(detail);
                    return (
                      <>
                        <tr key={index}>
                          <td className="text-center  align-middle">
                            {index + 1}
                          </td>

                          <td className="d-flex">
                            <div className="w-100 d-flex justify-content-between ">
                              <div className="w-100">
                                <Select
                                  class="form-select"
                                  className="w-100 mb-3"
                                  aria-label="Default select example"
                                  name="itemName"
                                  options={rawMaterialsData}
                                  defaultValue={{
                                    label: "Select Item Name",
                                    value: 0,
                                  }}
                                  value={
                                    rawMaterialsData.find(
                                      (option) => option.value === detail.itemId
                                    ) || {
                                      label: "Select Item Name",
                                      value: 0,
                                    }
                                  }
                                  styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      width: "100%",
                                      borderColor: state.isFocused
                                        ? "#fff"
                                        : "#fff",
                                      border: "1px solid #2DDC1B",
                                    }),
                                    menu: (provided) => ({
                                      ...provided,
                                      zIndex: 9999,
                                      height: "200px",
                                      overflowY: "scroll",
                                    }),
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
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
                                  menuPosition="fixed"
                                  menuPortalTarget={document.body}
                                  onChange={(e) => {
                                    if (
                                      values.receipeQtyRatio === "" ||
                                      values.totalBatch === ""
                                    ) {
                                      swal(
                                        "Not Possible",
                                        "Please select Receipe qty ratio OR Fill Total Batch",
                                        "warning"
                                      );
                                    } else {
                                      const existingPurchaseItem = data?.find(
                                        (details) => details.itemId === e.value
                                      );

                                      const itemNamesFind = rawMateialData.find(
                                        (item) => item._id === e.value
                                      );

                                      if (
                                        values.receipeQtyRatio.toString() ===
                                        "1000"
                                      ) {
                                        const receipeData =
                                          receipeOptions1000.find(
                                            (x) => x.value === e.value
                                          );

                                        if (receipeData) {
                                          const labelData = receipeData
                                            ? receipeData.label
                                            : null;
                                          console.log(labelData);
                                          const findCFTPerKG =
                                            getCftPerKgByItemId(e.value);

                                          if (findCFTPerKG) {
                                            const calculateAsPerRatio =
                                              (labelData /
                                                findCFTPerKG?.cftPerKg) *
                                              values.totalBatch;

                                            const materialUsed = parseFloat(
                                              detail.materialUsed || 0
                                            );
                                            const stockInHand = parseFloat(
                                              existingPurchaseItem?.stockInHand ||
                                                0
                                            );

                                            if (existingPurchaseItem) {
                                              if (
                                                materialUsed > 0 &&
                                                materialUsed > stockInHand
                                              ) {
                                                const remaining =
                                                  stockInHand - materialUsed;
                                                const formattedRemaining =
                                                  remaining.toFixed(2);

                                                swal(
                                                  "Sorry!",
                                                  `Please purchase ${itemNamesFind?.itemName}. Remaining stock quantity is ${formattedRemaining}`,
                                                  "warning"
                                                );

                                                setFieldValue(
                                                  `detailsData.${index}.materialUsed`,
                                                  0
                                                );
                                              }
                                              handleSelectChange(e.value);
                                              setFieldValue(
                                                `detailsData.${index}.itemId`,
                                                e.value
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipeLabelData`,
                                                labelData || 0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.singleValueCFTPerKg`,
                                                findCFTPerKG?.cftPerKg || 0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipe`,
                                                labelData || 0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.asPerRatio`,
                                                calculateAsPerRatio
                                                  ? Math.round(
                                                      calculateAsPerRatio * 100
                                                    ) / 100
                                                  : 0
                                              );
                                            } else {
                                              // Stock not found at all
                                              setFieldValue(
                                                `detailsData.${index}.itemId`,
                                                ""
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipeLabelData`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.singleValueCFTPerKg`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipe`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.asPerRatio`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.materialUsed`,
                                                0
                                              );

                                              swal(
                                                "Sorry!",
                                                `${itemNamesFind?.itemName} stock not available.`,
                                                "warning"
                                              );
                                            }
                                          } else {
                                            swal(
                                              "Not Possible",
                                              "CFT PER KG Not Decleared,Please Contact with HO",
                                              "warning"
                                            );
                                          }
                                        } else {
                                          swal(
                                            "Not Possible",
                                            "Ratio Qty Not Decleared,Please Contact with HO",
                                            "warning"
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.itemId`,
                                            ""
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.receipe`,
                                            0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.asPerRatio`,
                                            0
                                          );

                                          setFieldValue(
                                            `detailsData.${index}.materialUsed`,
                                            ""
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.excess`,
                                            0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.less`,
                                            0
                                          );
                                        }
                                      } else if (
                                        values.receipeQtyRatio.toString() ===
                                        "938"
                                      ) {
                                        const receipeData =
                                          receipeOptionsLessQty938.find(
                                            (x) => x.value === e.value
                                          );
                                        if (receipeData) {
                                          const labelData = receipeData
                                            ? receipeData.label
                                            : null;
                                          const findCFTPerKG =
                                            getCftPerKgByItemId(e.value);
                                          if (findCFTPerKG) {
                                            const calculateAsPerRatio =
                                              (labelData /
                                                findCFTPerKG.cftPerKg) *
                                              values.totalBatch;
                                            const materialUsed = parseFloat(
                                              detail.materialUsed || 0
                                            );
                                            const stockInHand = parseFloat(
                                              existingPurchaseItem?.stockInHand ||
                                                0
                                            );
                                            if (existingPurchaseItem) {
                                              if (
                                                materialUsed > 0 &&
                                                materialUsed > stockInHand
                                              ) {
                                                const remaining =
                                                  stockInHand - materialUsed;
                                                const formattedRemaining =
                                                  remaining.toFixed(2);

                                                swal(
                                                  "Sorry!",
                                                  `Please purchase ${itemNamesFind?.itemName}. Remaining stock quantity is ${formattedRemaining}`,
                                                  "warning"
                                                );

                                                setFieldValue(
                                                  `detailsData.${index}.materialUsed`,
                                                  0
                                                );
                                              }

                                              setFieldValue(
                                                `detailsData.${index}.itemId`,
                                                e.value
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipeLabelData`,
                                                labelData || 0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.singleValueCFTPerKg`,
                                                findCFTPerKG?.cftPerKg || 0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipe`,
                                                labelData || 0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.asPerRatio`,
                                                calculateAsPerRatio
                                                  ? Math.round(
                                                      calculateAsPerRatio * 100
                                                    ) / 100
                                                  : 0
                                              );
                                            } else {
                                              // Stock not found at all
                                              setFieldValue(
                                                `detailsData.${index}.itemId`,
                                                ""
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipeLabelData`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.singleValueCFTPerKg`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipe`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.asPerRatio`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.materialUsed`,
                                                0
                                              );

                                              swal(
                                                "Sorry!",
                                                `${itemNamesFind?.itemName} stock not available.`,
                                                "warning"
                                              );
                                            }
                                          } else {
                                            swal(
                                              "Not Possible",
                                              "CFT PER KG Not Decleared,Please Contact with HO",
                                              "warning"
                                            );
                                          }
                                        } else {
                                          swal(
                                            "Not Possible",
                                            "Ratio Qty Not Decleared,Please Contact with HO",
                                            "warning"
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.itemId`,
                                            ""
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.receipe`,
                                            0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.asPerRatio`,
                                            0
                                          );

                                          setFieldValue(
                                            `detailsData.${index}.materialUsed`,
                                            ""
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.excess`,
                                            ""
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.less`,
                                            ""
                                          );
                                        }
                                      } else if (
                                        values.receipeQtyRatio.toString() ===
                                        "900"
                                      ) {
                                        const receipeData =
                                          receipeOptionsLessQty900.find(
                                            (x) => x.value === e.value
                                          );
                                        if (receipeData) {
                                          const labelData = receipeData
                                            ? receipeData.label
                                            : null;
                                          const findCFTPerKG =
                                            getCftPerKgByItemId(e.value);

                                          if (findCFTPerKG) {
                                            const calculateAsPerRatio =
                                              (labelData /
                                                findCFTPerKG?.cftPerKg) *
                                              values.totalBatch;

                                            const materialUsed = parseFloat(
                                              detail.materialUsed || 0
                                            );
                                            const stockInHand = parseFloat(
                                              existingPurchaseItem?.stockInHand ||
                                                0
                                            );

                                            if (existingPurchaseItem) {
                                              if (
                                                materialUsed > 0 &&
                                                materialUsed > stockInHand
                                              ) {
                                                const remaining =
                                                  stockInHand - materialUsed;
                                                const formattedRemaining =
                                                  remaining.toFixed(2);

                                                swal(
                                                  "Sorry!",
                                                  `Please purchase ${itemNamesFind?.itemName}. Remaining stock quantity is ${formattedRemaining}`,
                                                  "warning"
                                                );

                                                setFieldValue(
                                                  `detailsData.${index}.materialUsed`,
                                                  0
                                                );
                                              }

                                              setFieldValue(
                                                `detailsData.${index}.itemId`,
                                                e.value
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipeLabelData`,
                                                labelData || 0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.singleValueCFTPerKg`,
                                                findCFTPerKG?.cftPerKg || 0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipe`,
                                                labelData || 0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.asPerRatio`,
                                                calculateAsPerRatio
                                                  ? Math.round(
                                                      calculateAsPerRatio * 100
                                                    ) / 100
                                                  : 0
                                              );
                                            } else {
                                              // Stock not found at all
                                              setFieldValue(
                                                `detailsData.${index}.itemId`,
                                                ""
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipeLabelData`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.singleValueCFTPerKg`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.receipe`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.asPerRatio`,
                                                0
                                              );
                                              setFieldValue(
                                                `detailsData.${index}.materialUsed`,
                                                0
                                              );

                                              swal(
                                                "Sorry!",
                                                `${itemNamesFind?.itemName} stock not available.`,
                                                "warning"
                                              );
                                            }
                                          } else {
                                            swal(
                                              "Not Possible",
                                              "CFT PER KG Not Decleared,Please Contact with HO",
                                              "warning"
                                            );
                                          }
                                        } else {
                                          swal(
                                            "Not Possible",
                                            "Ratio Qty Not Decleared,Please Contact with HO",
                                            "warning"
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.itemId`,
                                            ""
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.receipe`,
                                            0
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.asPerRatio`,
                                            ""
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.asPerRatio`,
                                            ""
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.materialUsed`,
                                            ""
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.excess`,
                                            ""
                                          );
                                          setFieldValue(
                                            `detailsData.${index}.less`,
                                            ""
                                          );
                                        }
                                      }
                                    }
                                  }}
                                ></Select>
                              </div>
                              {detail.detailsMaterialUsed?.length > 0 &&
                                detail.itemId !== "" && (
                                  <div
                                    className="border align-items-center text-center p-2 fs-5 rounded-circle text-light ms-2 mt-2 "
                                    style={{
                                      background: "#2DDC1B",
                                      height: "30px",
                                      width: "30px",
                                    }}
                                    // data-toggle="modal"
                                    // data-target="#finishGoodsInsertInvoiceModalCenter"
                                    onClick={() => {
                                      console.log(detail.detailsMaterialUsed);
                                      handleSelectModal(
                                        detail.detailsMaterialUsed
                                      );
                                    }}
                                  >
                                    Info
                                  </div>
                                )}
                            </div>
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
                              type="number"
                              name={`detailsData.${index}.receipe`}
                              placeholder="Receipe"
                              value={detail?.receipe}
                              disabled
                              className="input-design"
                            />
                          </td>

                          <td className="text-center  align-items-center">
                            <Field
                              type="number"
                              name={`detailsData.${index}.materialUsed`}
                              placeholder="Material Used"
                              value={detail?.materialUsed}
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
                              // onChange={(e) => {
                              //   const value1 = parseFloat(e.target.value);
                              //   const value2 = parseFloat(detail.asPerRatio);
                              //   const calculateExcessOrLess = value1 - value2;
                              //   const existingPurchaseItem = data.find(
                              //     (details) => details.itemId === detail.itemId
                              //   );

                              //   console.log(existingPurchaseItem);
                              //   const itemNamesFind = rawMateialData.find(
                              //     (item) => item._id === detail.itemId
                              //   );
                              //   if (existingPurchaseItem) {
                              //     if (
                              //       existingPurchaseItem?.stockInHand >
                              //       e.target.value
                              //     ) {
                              //       if (calculateExcessOrLess === 0) {
                              //         setFieldValue(
                              //           `detailsData.${index}.less`,
                              //           0
                              //         );
                              //         setFieldValue(
                              //           `detailsData.${index}.excess`,
                              //           0
                              //         );
                              //         setFieldValue(
                              //           `detailsData.${index}.consumptionStatus`,
                              //           "No Change"
                              //         );
                              //       } else if (calculateExcessOrLess < 0) {
                              //         setFieldValue(
                              //           `detailsData.${index}.less`,
                              //           Math.abs(
                              //             Math.round(
                              //               calculateExcessOrLess * 100
                              //             ) / 100
                              //           )
                              //         );
                              //         setFieldValue(
                              //           `detailsData.${index}.excess`,
                              //           0
                              //         );
                              //         setFieldValue(
                              //           `detailsData.${index}.consumptionStatus`,
                              //           "Less"
                              //         );
                              //       } else if (calculateExcessOrLess > 0) {
                              //         setFieldValue(
                              //           `detailsData.${index}.excess`,
                              //           Math.abs(
                              //             (Math.round(calculateExcessOrLess) *
                              //               100) /
                              //               100
                              //           )
                              //         );
                              //         setFieldValue(
                              //           `detailsData.${index}.less`,
                              //           0
                              //         );
                              //         setFieldValue(
                              //           `detailsData.${index}.consumptionStatus`,
                              //           "Excess"
                              //         );
                              //       }

                              //       setFieldValue(
                              //         `detailsData.${index}.materialUsed`,
                              //         e.target.value
                              //       );
                              //     } else {
                              //       const quantity = parseFloat(
                              //         existingPurchaseItem?.stockInHand || 0
                              //       );
                              //       const materialUsed = parseFloat(
                              //         detail.materialUsed || 0
                              //       );

                              //       const remaining = quantity - materialUsed;
                              //       const formattedRemaining =
                              //         remaining.toFixed(2);
                              //       swal(
                              //         "Sorry!",
                              //         `Please purchase ${itemNamesFind?.itemName}. Remaing stock quantity is ${formattedRemaining}`,
                              //         "warning"
                              //       );
                              //     }
                              //   } else {
                              //     swal(
                              //       "Sorry!",
                              //       `${itemNamesFind?.itemName} Stock not Available`,
                              //       "warning"
                              //     );
                              //   }
                              // }}
                            />
                          </td>

                          <td className="text-center  align-items-center">
                            <Field
                              type="text"
                              name={`detailsData.${index}.asPerRatio`}
                              placeholder="As Per Ratio"
                              value={detail?.asPerRatio}
                              disabled
                              className="input-design"
                            />
                          </td>
                          <td className="text-center  align-items-center">
                            <Field
                              type="text"
                              name={`detailsData.${index}.excess`}
                              placeholder="Excess"
                              value={
                                detail?.excess === 0 ? "-" : detail?.excess
                              }
                              disabled
                              className="input-design"
                            />
                          </td>
                          <td className="text-center  align-items-center">
                            <Field
                              type="text"
                              name={`detailsData.${index}.Less`}
                              placeholder="Less"
                              value={detail?.less === 0 ? "-" : detail?.less}
                              disabled
                              className="input-design"
                            />
                          </td>
                          <td className="text-center  align-items-center d-none">
                            <Field
                              type="text"
                              name={`detailsData.${index}.consumptionStatus`}
                              placeholder="Consumption Status"
                              value={detail?.consumptionStatus}
                              disabled
                              className="input-design"
                            />
                          </td>
                          <td className="text-center  align-middle">
                            <button
                              type="button"
                              className="border-0 rounded  bg-transparent"
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
                        <RMConsumptionDetailsByFifoInsert
                          showModal={showModal}
                          setShowModal={setShowModal}
                          selectedItem={selectedItem}
                          purchaseData={purchaseData}
                          filterItemData={detail.detailsMaterialUsed}
                          initialValues={initialValues}
                          showInfo={showInfo}
                          valuesData={values}
                          setFieldValueForProduction={setFieldValue}
                          valueIndex={index}
                          data={data}
                          rawMateialData={rawMateialData}
                        ></RMConsumptionDetailsByFifoInsert>
                      </>
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

export default InsertProduction;
