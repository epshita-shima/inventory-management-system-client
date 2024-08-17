import {
  faArrowAltCircleLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import ProductionSingleInfo from "./ProductionSingleInfo";
import InsertProduction from "../Insert/InsertProduction";

const ProductionCommonPart = () => {
  const [startDate, setStartDate] = useState(new Date());
  const ArrayHelperRef = useRef();
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
    makeBy: "",
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
  const handleSubmit = async (e, values, resetForm) => {
    e.preventDefault();
    // const serialData = {
    //   serialNo: serialNo?.serialNo,
    //   type: "po",
    //   year: new Date().toLocaleDateString("en-CA"),
    //   makeby: makebyUser,
    //   updateby: "",
    // };
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
                  itemDescription: Yup.string().required("Required"),
                  quantity: Yup.string().required("Required"),
                  unitPrice: Yup.string().required("Required"),
                  totalAmount: Yup.string().required("Required"),
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
