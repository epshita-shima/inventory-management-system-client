import React, { useEffect, useState } from "react";
import DeliverReturnSinglePart from "./DeliverReturnSinglePart";
import { Field, FieldArray, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import swal from "sweetalert";
import { useGetAllInvoiceInformationQuery } from "../../../redux/features/invoiceinformation/invoiceinfoApi";
import { invoiceListDropdown } from "../../Common/CommonDropdown/CommonDropdown";
import {
  useGetAllDelieryOrderInformationAfterDeliverQuery,
} from "../../../redux/features/deliveryorderinformation/deliveryinfoApi";
import InsertDeliverReturnDetails from "../Insert/InsertDeliverReturnDetails";
import getMakebyUser from "../../Common/CommonMakeUser/CommonMakingUser";
import { useGetCompanyInfoQuery } from "../../../redux/features/companyinfo/compayApi";
import {
  useInsertReturnDeliveredInformationMutation,
} from "../../../redux/features/returndeliveredinformation/returndeliveredApi";
import { useNavigate } from "react-router-dom";
import { useGetAllFinishGoodsDeliveryInformationQuery,} from "../../../redux/features/finishgoodsdeliveryinfo/finishgoodsdeliveryApi";
import LoadingSpineer from "../../Common/LoadingSpinner/LoadingSpineer";
import '../../../buttonStyle/style.css'

const DeliverReturnCommonPart = () => {
  const navigate=useNavigate()
  const [isDisplay, setIsDisplay] = useState(false);
  const [doDetailsFilteredData, setDoDetailsFilteredData] = useState([]);
  const { data: invoiceInformation,isLoading:isPiInfoLoading } =
    useGetAllInvoiceInformationQuery(undefined);
  const { data: companyInfo } = useGetCompanyInfoQuery(undefined);
  const { data: deliveryOrderDataInformation } =
    useGetAllFinishGoodsDeliveryInformationQuery(undefined);
const{data:doInformation}=useGetAllDelieryOrderInformationAfterDeliverQuery(undefined);
  const [insertReturnDelivredInfo,{isLoading:isInsertReturnLoading}] =
    useInsertReturnDeliveredInformationMutation();

  const [returnDate, setReturnDate] = useState(new Date());

  
  const initialValues = {
    returnDate: "",
    piId: "",
    doId: "",
    transferFromClientId: "",
    transferToCompanyId: "",
    detailsData: [
      {
        piDetailsId: "",
        itemId: "",
        returnQty: "",
        deliveredQty: "",
        deliveryChallanNo: "",
        piId: "",
        doId: "",
      },
    ],
  };

  const piNumberOptions = invoiceListDropdown(invoiceInformation);

  useEffect(() => {
    if (doDetailsFilteredData?.length !== 0) {
      setIsDisplay(true);
    }
  }, [doDetailsFilteredData]);

  const handleSubmit = async (e, values) => {
    e.preventDefault();
    const modelData = {
      returnDate: new Date(returnDate),
      piId: doDetailsFilteredData?.piId,
      doId: doDetailsFilteredData?.doId,
      deliveredId:doDetailsFilteredData?._id,
      transferFromClientId: doDetailsFilteredData?.clientId,
      transferToCompanyId: companyInfo[0]?._id,
      clientId: doDetailsFilteredData?.clientId,
      makeBy: getMakebyUser(),
      updateBy: "",
      makeDate: new Date(),
      updateDate: "",
      detailsData: [],
    };

    doDetailsFilteredData?.detailsData?.map((item, index) => {
      modelData.detailsData.push({
        piDetailsId: item?.piDetailsId,
        piId: item?.piId,
        doId: doDetailsFilteredData?.doId,
        itemId: item.itemId,
        deliveredQty: parseFloat(item.deliverQty),
        returnQty: parseFloat(values.detailsData[index]?.returnQty) || 0,
        deliveryChallanNo: doDetailsFilteredData?.deliveryChallanNo,
      });
    });

    const response = await insertReturnDelivredInfo(modelData);
    if (response?.data?.status === 200) {
      // await updateFinishGoodsReturnStatus(doDetailsFilteredData);
      swal("Done", "Data Save Successfully", "success");
      navigate('/main-view/list-information');
    } else if (response?.error?.status === 500) {
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
      {/* <LoadingSpineer isLoading={isPiInfoLoading}></LoadingSpineer> */}
      <div className={`${isPiInfoLoading ? 'd-none' : 'd-block'}`}>
        <div className="px-4 rounded-4">
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              returnQty: Yup.string()
                .required("Required")
                .matches(/^\d+$/, "Must be a number"),
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
                    const totalQtyCalculate =
                      doDetailsFilteredData?.detailsData?.reduce(
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
                                  Sales Return Insert Form
                                </h2>
                                <div>
                                  <button
                                   className="customBackToListButton"
                                    onClick={() => {
                                        navigate('/main-view/list-information');
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
                                <DeliverReturnSinglePart
                                  values={values}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  errors={errors}
                                  returnDate={returnDate}
                                  setReturnDate={setReturnDate}
                                  piNumberOptions={piNumberOptions}
                                  deliveryOrderDataInformation={
                                    deliveryOrderDataInformation
                                  }
                                  setIsDisplay={setIsDisplay}
                                  setDoDetailsFilteredData={
                                    setDoDetailsFilteredData
                                  }
                                  doInformation={doInformation}
                                ></DeliverReturnSinglePart>
                              }
                              

                              {isDisplay && (
                                <>
                               
                                <div>
                                <h2
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Details Information
                                </h2>
                                <div className="d-block d-lg-flex d-xl-flex justify-content-between align-items-center mb-4">
                                  <div className="d-lg-flex justify-content-between">
                                    <button
                                      type="submit"
                                      form="pocreation-form"
                                      className="border-0 "
                                      style={{
                                        backgroundColor:isInsertReturnLoading? 'gray': "#2DDC1B",
                                        color: "white",
                                        padding: "5px 10px",
                                        fontSize: "14px",
                                        fontWeight: 900,
                                        borderRadius: "5px",
                                        width: "100px",
                                      }}
                                      disabled={isInsertReturnLoading}
                                    >
                                     {isInsertReturnLoading ? 'Saving' : 'Save'}
                                    </button>
                                  </div>
                                  <div>
                                    <label htmlFor="totalDeliverQty">
                                      Total Deliver Qty
                                    </label>
                                    <Field
                                      type="text"
                                      name={`totalDeliverQty`}
                                      placeholder="Total Deliver Qty"
                                      value={totalQtyCalculate}
                                      disabled
                                      className='total-qty-input'
                                      
                                    />
                                  </div>
                                </div>
                              </div>
                                <InsertDeliverReturnDetails
                                  values={values}
                                  doDetailsFilteredData={doDetailsFilteredData}
                                  setDoDetailsFilteredData={
                                    setDoDetailsFilteredData
                                  }
                                  doInformation={doInformation}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                ></InsertDeliverReturnDetails>
                                 </>
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

export default DeliverReturnCommonPart;
