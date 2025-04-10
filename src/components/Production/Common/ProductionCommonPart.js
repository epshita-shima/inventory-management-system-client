import {
  faArrowAltCircleLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import swal from "sweetalert";
import ProductionSingleInfo from "./ProductionSingleInfo";
import InsertProduction from "../Insert/InsertProduction";

import {
  useGetSingleProductionInformationQuery,
  useInsertProductionInformationMutation,
  useUpdateProductionInformationMutation,
} from "../../../redux/features/productioninformation/productionApi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import { rawMaterialItemDropdown } from "../../Common/CommonDropdown/CommonDropdown";
import { useGetAllCFTInfosQuery } from "../../../redux/features/cftinformation/cftInfosApi";
import UpdateProduction from "../Update/UpdateProduction";
import {
  useCreateSerialNoMutation,
  useGetSerialNoQuery,
} from "../../../redux/features/serialgenerate/serialApi";
import getMakebyUser from "../../Common/CommonMakeUser/CommonMakingUser";
import "../../../buttonStyle/style.css";
import { useInsertRawMaterialConsumptionMutation } from "../../../redux/features/rawmaterialconsumption/rawconsumptionApi";

const ProductionCommonPart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ArrayHelperRef = useRef();
  const { data: getSingleProductionData } =
    useGetSingleProductionInformationQuery(id);
  const [updateProductionData, setUpdateProductionData] = useState([]);
  const [updateSingleProductionInfo] = useUpdateProductionInformationMutation();
  const [insertRawConsumption] = useInsertRawMaterialConsumptionMutation();
  const [startDates, setStartDates] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const { data: rawMaterials } = useGetAllRMItemInformationQuery(undefined);
  const rawMaterialsData = rawMaterialItemDropdown(rawMaterials);
  const { data: cftData } = useGetAllCFTInfosQuery(undefined);
  const { data: serialNo, refetch: serialRefresh } =
    useGetSerialNoQuery(undefined);
  const [serialValue, setSerialValue] = useState([]);
  const [createSerialNo] = useCreateSerialNoMutation();
  const [proStartDate, setProStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [insertProductionData, { isLoading: isProdctionInsertLoading }] =
    useInsertProductionInformationMutation();
  const makebyUser = getMakebyUser();

  const initialValues = {
    productionDate: new Date().toLocaleDateString("en-CA"),
    batchNo: "",
    totalBatch: "",
    receipeQtyRatio: "",
    productionItemName: "",
    productionQty: "",
    productionStart: "",
    productionEnd: "",
    totalHour: "",
    wastageQty: "",
    expectedProductionQtyPerBatch: "",
    expectedProductionQty: "",
    excessOrLessProductionQty: "",
    productionStatus: "",
    makeBy: makebyUser,
    updateBy: null,
    makeDate: new Date(),
    updateDate: null,
    detailsData: [
      {
        itemId: "",
        receipe: "",
        materialUsed: "",
        asPerRatio: "",
        excess: "",
        less: "",
        consumptionStatus: "",
        receipeLabelData: "",
        singleValueCFTPerKg: "",
        detailsMaterialUsed: [],
      },
    ],
  };
  const receipeOptions1000 = [
    { value: "677248c1a1a0d9059b94977e", label: "200" },
    { value: "677248c1a1a0d9059b94977c", label: "150" },
    { value: "677248c1a1a0d9059b94977d", label: "450" },
    { value: "677248c1a1a0d9059b949780", label: "" },
    { value: "677248c1a1a0d9059b949781", label: "" },
    { value: "677248c1a1a0d9059b94977f", label: "200" },
  ];

  const receipeOptionsLessQty938 = [
    { value: "677248c1a1a0d9059b94977e", label: "188" },
    { value: "677248c1a1a0d9059b94977c", label: "150" },
    { value: "677248c1a1a0d9059b94977d", label: "450" },
    { value: "677248c1a1a0d9059b949780", label: "" },
    { value: "677248c1a1a0d9059b949781", label: "" },
    { value: "677248c1a1a0d9059b94977f", label: "150" },
  ];

  const receipeOptionsLessQty900 = [
    { value: "677248c1a1a0d9059b94977e", label: "275" },
    { value: "677248c1a1a0d9059b94977c", label: "150" },
    { value: "677248c1a1a0d9059b94977d", label: "255" },
    { value: "677248c1a1a0d9059b949780", label: "" },
    { value: "677248c1a1a0d9059b949781", label: "12.5" },
    { value: "677248c1a1a0d9059b94977f", label: "250" },
  ];

  const areFieldsEmpty = () => {
    return (
      !updateProductionData?.totalBatch ||
      !updateProductionData?.productionQty ||
      !updateProductionData?.wastageQty ||
      updateProductionData?.detailsData?.some(
        (field) => !field.itemId || !field.materialUsed
      )
    );
  };

  useEffect(() => {
    if (serialNo && serialNo.length > 0) {
      const maxSerialNoObject = serialNo?.reduce((max, current) => {
        if (current.type === "production") {
          return max && current.serialNo > max.serialNo
            ? current
            : max || current;
        }
        return max;
      }, undefined);
      if (maxSerialNoObject) {
        setSerialValue(maxSerialNoObject);
      }
    }
    if (id) {
      setUpdateProductionData(getSingleProductionData);
    }
  }, [serialNo, getSingleProductionData, id]);

  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();
    try {
      if (id) {
        const response = await updateSingleProductionInfo(updateProductionData);
        if (response?.data?.status === 200) {
          navigate("/main-view/production-list");
          swal("Done", "Data Save Successfully", "success");
          resetForm();
        } else if (response?.error?.status === 400) {
          swal("Not Possible!", response?.error?.data?.message, "error");
        }
      } else {
        const serialData = {
          serialNo: serialNo?.serialNo,
          type: "production",
          year: new Date().toLocaleDateString("en-CA"),
          makeby: makebyUser,
          updateby: "",
        };
        const newProductionInfo = {
          productionDate: values.productionDate,
          batchNo: values.batchNo,
          totalBatch: values.totalBatch,
          receipeQtyRatio: values.receipeQtyRatio,
          productionItemName: values.productionItemName,
          productionQty: parseFloat(values.productionQty),
          productionStart: values.productionStart,
          productionEnd: values.productionEnd,
          totalHour: parseFloat(values.totalHour),
          wastageQty: parseFloat(values.wastageQty),
          expectedProductionQtyPerBatch: parseFloat(
            values.expectedProductionQtyPerBatch
          ),
          expectedProductionQty: parseFloat(values.expectedProductionQty),
          excessOrLessProductionQty: parseFloat(
            values.excessOrLessProductionQty
          ),
          productionStatus: values.productionStatus,
          makeBy: makebyUser,
          updateBy: null,
          makeDate: new Date(),
          updateDate: null,
          detailsData: [],
        };
        const materialUsedModel = {
          detailsData: [],
        };
        values.detailsData.forEach((item) => {
          newProductionInfo.detailsData.push({
            itemId: item.itemId,
            receipe: item.receipe,
            materialUsed: parseFloat(item.materialUsed),
            asPerRatio: parseFloat(item.asPerRatio),
            excess: parseFloat(item.excess),
            less: parseFloat(item.less),
            consumptionStatus: item.consumptionStatus,
          });
          item.detailsMaterialUsed.forEach((details) => {
            materialUsedModel.detailsData.push({
              purchaseDate: details.receivedDate,
              itemId: details.itemId,
              quantity: details.quantity,
              rate: details.unitPrice,
              amount: details.amount,
              materialUsed: details.materialUsed,
              closingStock: details.closingStock,
              makeBy: getMakebyUser(),
              updateBy: null,
              makeDate: new Date(),
              updateDate: null,
            });
          });
        });

        const response = await insertProductionData(newProductionInfo);

        if (response.data.status === 200) {
          const rawConsumptionResponse = await insertRawConsumption(
            materialUsedModel.detailsData
          );
          if (rawConsumptionResponse.data.status === 200) {
            swal("Done", "Data Save Successfully", "success");
            await createSerialNo(serialData);
            serialRefresh();
            resetForm();
            setProStartDate("");
            setEndDate("");
          } else {
            swal(
              "Not Possible!",
              "An problem occurred while creating the data",
              "error"
            );
          }
        } else {
          swal(
            "Not Possible!",
            "An problem occurred while creating the data",
            "error"
          );
        }
      }
    } catch (err) {
      console.error(err);
      swal("Relax!", "An problem occurred while creating the data", "error");
    }
    resetForm();
  };

  return (
    <div
      className=" row px-4 mx-4"
      style={{
        overflow: "scroll",
        height: "calc(98vh - 120px)",
        zIndex: "9999",
      }}
    >
      <div className="">
        <div className="px-4 rounded-4">
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              totalBatch: Yup.number().required("Required"),
              productionItemName: Yup.string().required("Required"),
              productionStart: Yup.string().required("Required"),
              productionEnd: Yup.string().required("Required"),
              productionQty: Yup.date().required("Required"),
              wastageQty: Yup.string().required("Required"),
              detailsData: Yup.array().of(
                Yup.object().shape({
                  itemId: Yup.string().required("Required"),
                  materialUsed: Yup.string().required("Required"),
                })
              ),
            })}
            onSubmit={({ setSubmitting, resetForm }) => {
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
              isValid,
              dirty,
            }) => (
              <Form
                id="pocreation-form"
                onSubmit={(e) => {
                  handleSubmit(e, values, resetForm);
                }}
              >
                <FieldArray
                  name="detailsData"
                  render={(arrayHelpers) => {
                    ArrayHelperRef.current = arrayHelpers;
                    const details = values.detailsData;
                    console.log(values);
                    return (
                      <div className=" shadow-lg py-2 px-5">
                        <div className="container-fluid">
                          <div className="row justify-content-center">
                            <div className="col-12 col-md-12 col-lg-12 fixed-column py-2">
                              <div className="d-lg-flex justify-content-between align-items-center">
                                <h2
                                  style={{
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {id
                                    ? "Production Update Form"
                                    : "Production Insert Form"}
                                </h2>
                                <div>
                                  <button
                                    className="customBackToListButton"
                                    onClick={() => {
                                      navigate("/main-view/production-list");
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faArrowAltCircleLeft}
                                    ></FontAwesomeIcon>
                                    Back to ItemList
                                  </button>
                                </div>
                              </div>
                              {
                                <ProductionSingleInfo
                                  startDates={startDates}
                                  setStartDates={setStartDates}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  errors={errors}
                                  values={values}
                                  serialValue={serialValue}
                                  id={id}
                                  makebyUser={makebyUser}
                                  setUpdateProductionData={
                                    setUpdateProductionData
                                  }
                                  updateProductionData={updateProductionData}
                                  cftData={cftData}
                                  proStartDate={proStartDate}
                                  setProStartDate={setProStartDate}
                                  endDate={endDate}
                                  setEndDate={setEndDate}
                                  receipeOptions1000={receipeOptions1000}
                                  receipeOptionsLessQty938={
                                    receipeOptionsLessQty938
                                  }
                                  receipeOptionsLessQty900={
                                    receipeOptionsLessQty900
                                  }
                                ></ProductionSingleInfo>
                              }
                              <div>
                                <h2
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Details Information
                                </h2>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                  <div className="d-lg-flex justify-content-between">
                                    <button
                                      type="submit"
                                      form="pocreation-form"
                                      className="border-0 "
                                      style={{
                                        backgroundColor: id
                                          ? areFieldsEmpty()
                                            ? "gray"
                                            : "#2DDC1B"
                                          : isValid && dirty
                                          ? "#2DDC1B"
                                          : "gray",
                                        color: "white",
                                        padding: "5px 10px",
                                        fontSize: "14px",
                                        fontWeight: 900,
                                        borderRadius: "5px",
                                        width: "100px",
                                      }}
                                      disabled={
                                        id
                                          ? areFieldsEmpty()
                                            ? true
                                            : false
                                          : !(isValid && dirty)
                                      }
                                    >
                                      {id
                                        ? "Update"
                                        : isProdctionInsertLoading
                                        ? "Saving"
                                        : "Save"}
                                    </button>
                                    <div
                                      className="border-0 mt-sm-4 ms-lg-2 mt-lg-0"
                                      style={{
                                        backgroundColor: "#B8FEB3",
                                        color: "#000",
                                        fontWeight: 900,
                                        padding: "5px 10px",
                                        fontSize: "14px",
                                        borderRadius: "5px",
                                        width: "110px",
                                      }}
                                      onClick={() => {
                                        if (id) {
                                          setUpdateProductionData((prev) => {
                                            const temp__details = [
                                              ...prev.detailsData,
                                            ];
                                            temp__details.push({
                                              itemId: "",
                                              receipe: "",
                                              materialUsed: "",
                                              asPerRatio: "",
                                              excess: "",
                                              less: "",
                                              consumptionStatus: "",
                                            });
                                            return {
                                              ...prev,
                                              detailsData: [...temp__details],
                                            };
                                          });
                                        } else {
                                          ArrayHelperRef.current.push({
                                            itemId: "",
                                            receipe: "",
                                            materialUsed: "",
                                            asPerRatio: "",
                                            excess: "",
                                            less: "",
                                            consumptionStatus: "",
                                            receipeLabelData: "",
                                            singleValueCFTPerKg: "",
                                            detailsMaterialUsed: [],
                                          });
                                        }
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faPlus}
                                        style={{ fontWeight: 900 }}
                                      ></FontAwesomeIcon>{" "}
                                      Add Row
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {id ? (
                                <UpdateProduction
                                  makebyUser={makebyUser}
                                  cftData={cftData}
                                  updateProductionData={updateProductionData}
                                  rawMaterialsData={rawMaterialsData}
                                  receipeOptions1000={receipeOptions1000}
                                  receipeOptionsLessQty900={
                                    receipeOptionsLessQty900
                                  }
                                  setUpdateProductionData={
                                    setUpdateProductionData
                                  }
                                  receipeOptionsLessQty938={
                                    receipeOptionsLessQty938
                                  }
                                  touched={touched}
                                  errors={errors}
                                ></UpdateProduction>
                              ) : (
                                <InsertProduction
                                  details={details}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  errors={errors}
                                  arrayHelpers={arrayHelpers}
                                  values={values}
                                  receipeOptions1000={receipeOptions1000}
                                  receipeOptionsLessQty900={
                                    receipeOptionsLessQty900
                                  }
                                  cftData={cftData}
                                  receipeOptionsLessQty938={
                                    receipeOptionsLessQty938
                                  }
                                  rawMaterialsData={rawMaterialsData}
                                ></InsertProduction>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProductionCommonPart;
