import {
  faArrowAltCircleLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import swal from "sweetalert";
import ProductionSingleInfo from "./ProductionSingleInfo";
import InsertProduction from "../Insert/InsertProduction";
import { useCreateSerialNoMutation, useGetSerialNoQuery } from "../../../redux/api/apiSlice";
import { useInsertProductionInformationMutation } from "../../../redux/features/productioninformation/productionApi";

const ProductionCommonPart = () => {
  const [startDate, setStartDate] = useState(new Date().toLocaleDateString("en-CA"));
  const ArrayHelperRef = useRef();
  const { data: serialNo ,refetch: serialRefresh} = useGetSerialNoQuery(undefined);
  const [serialValue, setSerialValue] = useState([]);
  const [createSerialNo] = useCreateSerialNoMutation();
  const [insertProductionData]=useInsertProductionInformationMutation()
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const makebyUser = getUserParse[0].username;
  const initialValues = {
    productionDate: new Date().toLocaleDateString("en-CA"),
    batchNo: "",
    totalBatch: "",
    receipeQtyRatio: "",
    productionItemName: "",
    productionQty: "",
    productionStart: new Date(),
    productionEnd: new Date(),
    totalHour: "",
    wasteageQty: "",
    expectedProductionQtyPerBatch: "",
    expectedProductionQty: "",
    excessOrLessProductionQty: "",
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
      },
    ],
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
  }, [serialNo]);

  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();
    try {
      const serialData = {
        serialNo: serialNo?.serialNo,
        type: "production",
        year: new Date().toLocaleDateString("en-CA"),
        makeby: makebyUser,
        updateby: "",
      };
      const newProductionInfo = {
        productionDate:values.productionDate,
        batchNo: values.batchNo,
        totalBatch: values.totalBatch,
        receipeQtyRatio: values.receipeQtyRatio,
        productionItemName: values.productionItemName,
        productionQty: parseFloat(values.productionQty),
        productionStart: values.productionStart,
        productionEnd: values.productionEnd,
        totalHour: parseFloat(values.totalHour),
        wasteageQty: parseFloat(values.wasteageQty),
        expectedProductionQtyPerBatch: parseFloat(values.expectedProductionQtyPerBatch),
        expectedProductionQty: parseFloat(values.expectedProductionQty),
        excessOrLessProductionQty: parseFloat(values.excessOrLessProductionQty),
        makeBy: makebyUser,
        updateBy: null,
        makeDate: new Date(),
        updateDate: null,
        detailsData: [],
      };
      values.detailsData.map((item)=>{
        newProductionInfo.detailsData.push({
          itemId: item.itemId,
          receipe: item.receipe,
          materialUsed: parseFloat(item.materialUsed),
          asPerRatio: parseFloat(item.asPerRatio),
          excess: parseFloat(item.excess), 
          less: parseFloat(item.less) 
        })
      })
      console.log(JSON.stringify(newProductionInfo))
      const response = await insertProductionData(newProductionInfo);
      if (response.data.status === 200) {
        swal("Done", "Data Save Successfully", "success");
        await createSerialNo(serialData);
        serialRefresh();
        resetForm();
      } else {
        swal(
          "Not Possible!",
          "An problem occurred while creating the data",
          "error"
        );
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
      <div class="">
        <div className="px-4 rounded-4">
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              detailsData: Yup.array().of(
                Yup.object().shape({
                  itemId: Yup.string().required("Required"),
                  materialUsed: Yup.string().required("Required"),
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
              isSubmitting,
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
                    console.log(values)
                    return (
                      <div
                        className=" shadow-lg py-2 px-5"
                        // style={{
                        //   overflowY: "hidden",
                        //   height: "calc(95vh - 120px)",
                        //   zIndex: "9999",
                        // }}
                      >
                        <div class="container-fluid">
                          <div class="row justify-content-center">
                            <div class="col-12 col-md-12 col-lg-12 fixed-column py-2">
                              <div className="d-flex justify-content-between align-items-center">
                                <h2
                                  style={{
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Production Form
                                </h2>
                                <div>
                                  <button
                                    style={{
                                      backgroundColor: "#E55566",
                                      outline: "none",
                                      border: "none",
                                      color: "white",
                                      height: "25px",
                                    }}
                                    onClick={() => {
                                      // navigate("/main-view/po-list");
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
                                  startDate={startDate}
                                  setStartDate={setStartDate}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  errors={errors}
                                  values={values}
                                  serialValue={serialValue}
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
                                  <div className="d-flex justify-content-between">
                                    <button
                                      type="submit"
                                      form="pocreation-form"
                                      className="border-0 "
                                      style={{
                                        backgroundColor:
                                          isValid && dirty ? "#2DDC1B" : "gray",
                                        color: "white",
                                        padding: "5px 10px",
                                        fontSize: "14px",
                                        borderRadius: "5px",
                                        width: "100px",
                                      }}
                                      disabled={!(isValid && dirty)}
                                    >
                                      Save
                                    </button>
                                    <div
                                      className="border-0 "
                                      style={{
                                        // backgroundColor: "#00B987",
                                        backgroundColor: "#B8FEB3",
                                        color: "#000",
                                        padding: "5px 10px",
                                        fontSize: "14px",
                                        borderRadius: "5px",
                                        marginLeft: "5px",
                                        width: "100px",
                                      }}
                                      onClick={() => {
                                        ArrayHelperRef.current.push({
                                            itemId: "",
                                            receipe: "",
                                            materialUsed: "",
                                            asPerRatio: "",
                                            excess: "",
                                            less: "",
                                          },);
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faPlus}
                                      ></FontAwesomeIcon>
                                      Add Row
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {
                                <InsertProduction
                                  details={details}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  errors={errors}
                                  arrayHelpers={arrayHelpers}
                                  values={values}
                                ></InsertProduction>
                              }
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
