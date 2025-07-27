import React, { useEffect, useState } from "react";
import getMakebyUser from "../../Common/CommonMakeUser/CommonMakingUser";
import { Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import InsertFinishGoodsDelivery from "../Insert/InsertFinishGoodsDelivery";
import InsertFinishGoodsDeliveryDetails from "../Insert/InsertFinishGoodsDeliveryDetails";
import {
  useGetSingleFinishGoodsDeliveryInformationQuery,
  useInsertFinishGoodsDeliveryInformationMutation,
} from "../../../redux/features/finishgoodsdeliveryinfo/finishgoodsdeliveryApi";
import '../../../buttonStyle/style.css';

const FinishGoodsDeliveryCommonPart = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const initialValues = {
    driverName: "",
    driverContactNo: "",
    truckNo: "",
  };
  const [deliveryOrderInformation, setDeliveryOrderInformation] = useState([]);
  const { data: singleDeliveryOrderData,isLoading:isLoadingDetDelivery } =
    useGetSingleFinishGoodsDeliveryInformationQuery(id);
  const [insertFinishGoodsDeliveryInfo,{isLoading:isLoadingInsertDelivery}] =
    useInsertFinishGoodsDeliveryInformationMutation();

  useEffect(() => {
    setDeliveryOrderInformation(singleDeliveryOrderData);
    setDeliveryOrderInformation((prev) => ({
        ...prev,
        deliveryStatus: true, // Change to true or false as needed
      }));
  }, [singleDeliveryOrderData]);

  const handleSubmit = async (e,values) => {
    e.preventDefault();
    const modelData = {
      finishGoodsDeliveryDate: new Date(),
      piId: deliveryOrderInformation?.piId,
      doId: deliveryOrderInformation?._id,
      clientId: deliveryOrderInformation?.clientId,
      totalDelivarQty: deliveryOrderInformation?.detailsData?.reduce(
        (acc, cur) => acc + parseFloat(cur.deliverQty || 0),
        0
      ),
      driverName:values.driverName,
      driverContactNo:values.driverContactNo,
      deliveryChallanNo: deliveryOrderInformation?.deliveryChallanNo,
      truckNo:values.truckNo,
      approveStatus: false,
      approveBy: "",
      approveDate: "",
      makeBy: getMakebyUser(),
      updateBy: "",
      makeDate: new Date(),
      updateDate: "",
      detailsData: [],
    };
    deliveryOrderInformation?.detailsData.map((item) => {
      modelData.detailsData.push({
        piDetailsId: item?.piDetailsId,
        piId: item?.piId,
        doId: deliveryOrderInformation?._id,
        itemId: item.itemId,
        deliverQty: item.deliverQty,
        returnStatus: false,
        returnQty: 0,
      });
    });

    const response = await insertFinishGoodsDeliveryInfo(modelData);
    if (response?.data?.status === 200) {
      swal("Done", "Data Save Successfully", "success");
      navigate('/main-view/list-page');
    } else if (response?.error?.status === 400) {
      swal("Not Possible!", response?.error?.data?.message, "error");
    }
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

      <div className={isLoadingDetDelivery ? 'd-none' : 'd-block'}>
        <div className="px-4 rounded-4">
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              driverName: Yup.string().required("Required"),
              driverContactNo: Yup.string()
                .required("Required")
                .min(11, "Must be at least 11 characters long")
                .max(11, "Must be at most 11 characters long")
                .matches(/^[0-9]+$/, "Must be a valid phone number"),
              truckNo: Yup.string().required("Required"),
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
                  render={() => {
                    const totalDeliverQtyCalculate =
                      deliveryOrderInformation?.detailsData?.reduce(
                        (acc, cur) => acc + parseFloat(cur.deliverQty || 0),
                        0
                      );
                   
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
                                  Finish Goods Delivery Insert Form
                                </h2>
                                <div>
                                  <button
                                   className="customBackToListButton"
                                    onClick={() => {
                                      navigate('/main-view/list-page');
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
                                <InsertFinishGoodsDelivery
                                  values={values}
                                  deliveryOrderInformation={
                                    deliveryOrderInformation
                                  }
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  errors={errors}
                                ></InsertFinishGoodsDelivery>
                             
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
                                        backgroundColor:
                                          isValid && dirty ? "#2DDC1B" : "gray",
                                        color: "white",
                                        padding: "5px 10px",
                                        fontSize: "14px",
                                        fontWeight: 900,
                                        borderRadius: "5px",
                                        width: "100px",
                                      }}
                                      disabled={!(isValid && dirty)}
                                    >
                                   {isLoadingInsertDelivery ? 'Saving' : 'Save'}
                                    </button>
                                  </div>
                                  <div>
                                    <label htmlFor="totalDeliverQty">
                                      Total Deliver Qty
                                    </label>
                                    <Field
                                      type="text"
                                      name={`totalDeliverQty`}
                                      placeholder="totalDeliverQty"
                                      value={totalDeliverQtyCalculate}
                                      disabled
                                      style={{
                                        border: "1px solid #2DDC1B",
                                        padding: "5px",
                                        width: "60%",
                                        borderRadius: "5px",
                                        height: "38px",
                                        textAlign: "center",
                                        marginLeft: "5px",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {
                                <InsertFinishGoodsDeliveryDetails
                                  deliveryOrderInformation={
                                    deliveryOrderInformation
                                  }
                                ></InsertFinishGoodsDeliveryDetails>
                           
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

export default FinishGoodsDeliveryCommonPart;
