import {
  faArrowAltCircleLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  useGetAllInvoiceInformationQuery,
  useGetSingleInvoiceQuery,
  useUpdateInvoiceShipmentMutation,
} from "../../../../redux/features/invoiceinformation/invoiceinfoApi";
import {
  invoiceListDropdown,
  paymnetInformationDropdown,
} from "../../../Common/CommonDropdown/CommonDropdown";
import { FieldArray, Form, Formik } from "formik";
import getInitialDOFormValues from "../../../Common/CommonDropdown/CommonFromValues/FormValuesForDoInsert";
import getMakebyUser from "./../../../Common/CommonMakeUser/CommonMakingUser";
import * as Yup from "yup";
import swal from "sweetalert";
import { useGetAllPaymentInformationQuery } from "../../../../redux/features/paymnetinformation/paymentInfoApi";
import { useGetAllPaymentReceiveInformationQuery } from "../../../../redux/features/paymentreceiveinfo/paymentreceiveApi";
import InsertDetailsDOInformation from "../Insert/InsertDetailsDOInformation";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/finishgoodsinfoApi";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useInsertDeliveryOrderInformationMutation } from "../../../../redux/features/deliveryorderinformation/deliveryinfoApi";
import { useCreateSerialNoMutation, useGetSerialNoQuery } from "../../../../redux/features/serialgenerate/serialApi";
import LoadingSpineer from "../../../Common/LoadingSpinner/LoadingSpineer";
import '../../../../buttonStyle/style.css';

const DelivaryOrderCommonInsertPart = () => {
  const navigate = useNavigate();
  const ArrayHelperRef = useRef();
  const makebyUser = getMakebyUser();
  const [isDisplay, setIsDisplay] = useState(false);
  const [piNumber, setPINumber] = useState("");
  const [invoiceList, setInvoiceList] = useState([]);
  const [piType, setPIType] = useState("");
  const [isDOSave,setIsDOSave]=useState(false)
  const [singlePaymentReceiveInfo, setSinglePaymentReceiveInfo] = useState([]);
  const [formValues, setFormValues] = useState(
    getInitialDOFormValues(piNumber, makebyUser)
  );
  const [invoiveByInvoiceNumber, setInvoiveByInvoiceNumber] = useState([]);
  const [paymentReceiveSelectedItem, setPaymentReceiveSelectedItem] = useState(
    []
  );
  const [checkNetTotalQuantity, setCheckNetTotalQuantity] = useState([]);
  const [serialValue, setSerialValue] = useState([]);
  const { data: paymentTypeInfo, isLoading:isPaymentLoading } = useGetAllPaymentInformationQuery(undefined);
  const { data: invoiceInformation } =
    useGetAllInvoiceInformationQuery(undefined);
  const { data: finishgoods } = useGetAllItemInformationQuery(undefined);
  const { data: itemSize } = useGetAllItemSizeQuery(undefined);
  const { data: paymentReceiveInformation, isLoading:isPaymentReceiveLoading } =
    useGetAllPaymentReceiveInformationQuery(undefined);
  const { data: serialNo, refetch: serialRefetch } =
    useGetSerialNoQuery(undefined);
  const piTypeOptions = paymnetInformationDropdown(paymentTypeInfo);
  const invoiceListOption = invoiceListDropdown(invoiceList);
  const [createSerialNo] = useCreateSerialNoMutation();
  const [invoiceId, setInvoiceId] = useState("");
  const { data: singleInvoiceData } = useGetSingleInvoiceQuery(invoiceId);
  const [updateInvoiceShipmentNo] = useUpdateInvoiceShipmentMutation();

  const [insertDOInfo,{isLoading:isDOInsertLoading}] = useInsertDeliveryOrderInformationMutation();
  useEffect(() => {
    if (serialNo && serialNo.length > 0) {
      const maxSerialNoObject = serialNo?.reduce((max, current) => {
        if (current.type === piNumber) {
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
  }, [serialNo, piNumber]);

  useEffect(() => {
    if (serialNo && serialNo.length > 0) {
      const maxSerialNoObject = serialNo?.reduce((max, current) => {
        if (current.type === "do") {
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

  useEffect(() => {
    function groupDataByPiNumberAndItemId(data) {
      const groupedData = {};
      data?.forEach((entry) => {
        const { piNumber, clientId, detailsData } = entry;

        detailsData?.forEach((item) => {
          const {
            itemId,
            piDetailsId,
            amount,
            returnQty,
            deliveredQty,
            quantity,
            paymentStatus,
          } = item;
          if (!groupedData[piNumber]) {
            groupedData[piNumber] = {};
          }
          if (!groupedData[piNumber][itemId]) {
            groupedData[piNumber][itemId] = {
              piNumber,
              clientId,
              itemId,
              returnQty: 0,
              deliveredQty: 0,
              paidTotalQuantity: 0,
              paidTotalAmount: 0,
              adjustTotalAmount: 0,
              adjustTotalQuantity: 0,
              totalNetQuantity: 0,
              totalNetAmount: 0,
            };
          }

          if (paymentStatus === "cash") {
            groupedData[piNumber][itemId].paidTotalQuantity += quantity || 0;
            groupedData[piNumber][itemId].paidTotalAmount += amount || 0;
          } else if (paymentStatus === "adjustment") {
            groupedData[piNumber][itemId].adjustTotalQuantity += quantity || 0;
            groupedData[piNumber][itemId].adjustTotalAmount += amount || 0;
          }
          groupedData[piNumber][itemId].returnQty = returnQty;
          groupedData[piNumber][itemId].deliveredQty = deliveredQty;
          groupedData[piNumber][itemId].itemId = itemId;
          groupedData[piNumber][itemId].piNumber = piNumber;
          groupedData[piNumber][itemId].piDetailsId = piDetailsId;
          groupedData[piNumber][itemId].totalNetQuantity =
            groupedData[piNumber][itemId].paidTotalQuantity -
            groupedData[piNumber][itemId].adjustTotalQuantity;
          groupedData[piNumber][itemId].totalNetAmount =
            groupedData[piNumber][itemId].paidTotalAmount -
            groupedData[piNumber][itemId].adjustTotalAmount;
        });
      });

      return Object.values(groupedData)
        .map((piGroup) => Object.values(piGroup))
        .flat();
    }

    const groupedResult = groupDataByPiNumberAndItemId(
      singlePaymentReceiveInfo
    );

    const result = groupedResult?.reduce((acc, item) => {
      let existingPiNumber = acc.find((p) => p.piNumber === item.piNumber);

      if (existingPiNumber) {
        existingPiNumber.detailsData.push({
          itemId: item.itemId,
          returnQty: item.returnQty,
          deliveredQty: item.deliveredQty,
          piDetailsId: item.piDetailsId,
          paidTotalQuantity: item.paidTotalQuantity,
          paidTotalAmount: item.paidTotalAmount,
          adjustTotalAmount: item.adjustTotalAmount,
          adjustTotalQuantity: item.adjustTotalQuantity,
          totalNetQuantity: item.totalNetQuantity,
          totalNetAmount: item.totalNetAmount,
        });
      } else {
        acc.push({
          piNumber: item.piNumber,
          clientId: item.clientId,
          detailsData: [
            {
              itemId: item.itemId,
              returnQty: item.returnQty,
              deliveredQty: item.deliveredQty,
              piDetailsId: item.piDetailsId,
              paidTotalQuantity: item.paidTotalQuantity,
              paidTotalAmount: item.paidTotalAmount,
              adjustTotalAmount: item.adjustTotalAmount,
              adjustTotalQuantity: item.adjustTotalQuantity,
              totalNetQuantity: item.totalNetQuantity,
              totalNetAmount: item.totalNetAmount,
            },
          ],
        });
      }

      return acc;
    }, []);

    if (result) {
      setPaymentReceiveSelectedItem(result);
      setCheckNetTotalQuantity(result);
    }
  }, [piNumber, singlePaymentReceiveInfo]);

  const handleSubmit = async (e,values) => {
    e.preventDefault();
    const removeDashFromDate = new Date().toLocaleDateString("en-CA");
    const removeDash = removeDashFromDate.replace(/-/g, "");

    const serialData = {
      serialNo: serialNo?.serialNo,
      type: "do",
      year: new Date().toLocaleDateString("en-CA"),
      makeby: makebyUser,
      updateby: "",
    };

    const delivaryChallanData = {
      serialNo: serialNo?.serialNo,
      type: "deliveryChallan",
      year: new Date().toLocaleDateString("en-CA"),
      makeby: makebyUser,
      updateby: "",
    };

    const modelData = {
      clientId: paymentReceiveSelectedItem[0]?.clientId,
      piId: paymentReceiveSelectedItem[0]?.piNumber,
      doNo: `DO-${removeDash}-${
        serialValue?.serialNo === undefined ? "1" :parseInt(serialValue?.serialNo) + 1
      }`,
      mushokChallanNo: "",
      deliveryChallanNo: `${
        serialValue?.serialNo === undefined ? "1" :parseInt(serialValue?.serialNo) + 1
      }`,
      shipmentNo: singleInvoiceData?.shipmentNo + 1,
      approveStatus: false,
      approveBy: "",
      approveDate: "",
      deliveryStatus: false,
      makeBy: makebyUser || "",
      updateBy: null,
      makeDate: new Date(),
      updateDate: null,
      detailsData: [],
    };

    paymentReceiveSelectedItem[0]?.detailsData.map(((item,index) => {
      modelData.detailsData.push({
        clientId: paymentReceiveSelectedItem[0]?.clientId,
        piId: paymentReceiveSelectedItem[0]?.piNumber,
        piDetailsId: item.piDetailsId,
        itemId: item.itemId,
        previousDelivaryQty: 0,
        returnQty: 0,
        deliverQty: parseFloat(values.detailsData[index]?.deliverQty),
      });
    }));

    const response = await insertDOInfo(modelData);
    if (response?.data?.status === 200) {
      await Promise.all([
        createSerialNo(serialData),
        createSerialNo(delivaryChallanData),
      ]);
      serialRefetch();
      await updateInvoiceShipmentNo(singleInvoiceData);
      swal("Done", "Data Save Successfully", "success");
      navigate("/main-view/do-list");
    } else if (response?.error?.status === 400) {
      swal("Not Possible!", response?.error?.data?.message, "error");
    }
  };

  useEffect(() => {}, [paymentReceiveSelectedItem]);

  useEffect(() => {
    if (piType !== "" && piNumber !== "") {
      setIsDisplay(true);
    } else {
      setIsDisplay(false);
    }
  }, [piNumber, piType]);

  return (
    <div
      className={`row mx-2 `}
      style={{ height: "calc(98vh - 120px)", overflowY: "hidden" }}
    >
      <LoadingSpineer isLoading={isPaymentLoading}></LoadingSpineer>
      <div class={`${isPaymentLoading ? 'd-none' : 'd-block'}`}>
        <div className="shadow-lg  rounded-4">
          <Formik
            initialValues={formValues}
            enableReinitialize={true}
            validationSchema={Yup.object({
              challanNo: Yup.string().required("Required"),
              detailsData: Yup.array().of(
                Yup.object().shape({
                  paymentMethod: Yup.string().required("Required"),
                  paymentStatus: Yup.string().required("Required"),
                  quantity: Yup.string().required("Required"),
                  unitPrice: Yup.string().required("Required"),
                })
              ),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              resetForm({ values: formValues });
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
                id="do-form"
                onSubmit={(e) => {
                  handleSubmit(e, values, resetForm);
                }}
              >
                <FieldArray
                  name="detailsData"
                  render={(arrayHelpers) => {
                    ArrayHelperRef.current = arrayHelpers;
                    return (
                      <div className=" flex-1 items-center d-flex-nowrap mt-3  px-4">
                        <div>
                          <div className="d-flex justify-content-between align-items-center">
                            <h2
                              className="fs-sm fw-bold"
                              style={{ fontSize: "24px", fontWeight: "bold" }}
                            >
                              Insert DO Information
                            </h2>
                            <div>
                              <button
                                className="customBackToListButton"
                                onClick={() => {
                                  navigate("/main-view/do-list");
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faArrowAltCircleLeft}
                                ></FontAwesomeIcon>
                                Back to ItemList
                              </button>
                            </div>
                          </div>

                          <div class="row row-cols-1  row-cols-md-2 row-cols-lg-4">
                            <div class="col col-md-6 col-lg-3">
                              <label
                                htmlFor="supplierId"
                                className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
                              >
                                PI Type
                              </label>
                              <div className="w-100 d-flex justify-content-between mt-2">
                                <div className="w-100">
                                  <Select
                                    class="form-select"
                                    className="w-100 mb-3"
                                    aria-label="Default select example"
                                    name="sizeinfo"
                                    options={piTypeOptions}
                                    isDisabled={false}
                                    defaultValue={{
                                      label: "Select PI Type",
                                      value: 0,
                                    }}
                                    value={piTypeOptions?.filter(function (
                                      option
                                    ) {
                                      return option.value === piType;
                                    })}
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
                                        height: "auto",
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
                                    onChange={(e) => {
                                      const matchedInvoice =
                                        invoiceInformation?.filter(
                                          (invoice) =>
                                            invoice.isApproved === true &&
                                            invoice.paymentId === e.value
                                        );
                                      setPIType(e.value);
                                      if (matchedInvoice?.length > 0) {
                                        setInvoiceList(matchedInvoice);
                                      } else {
                                        setIsDisplay(false);
                                        swal({
                                          title: "Sorry!",
                                          text: "This Client has no PI.",
                                          icon: "warning",
                                          button: "OK",
                                        });
                                        setPINumber("");
                                        setInvoiceList([]);
                                      }

                                      // handleSelectSupplier(e, setFieldValue);
                                    }}
                                  ></Select>
                                </div>
                              </div>
                            </div>
                            <div class="col col-md-6 col-lg-3">
                              <label
                                htmlFor="supplierId"
                                className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
                              >
                                PI Number
                              </label>

                              <div className="w-100 d-flex justify-content-between mt-2">
                                <div className="w-100">
                                  <Select
                                    class="form-select"
                                    className="w-100 mb-3"
                                    aria-label="Default select example"
                                    name="supplierpono"
                                    options={invoiceListOption}
                                    isDisabled={false}
                                    defaultValue={{
                                      label: "Select PI Number",
                                      value: 0,
                                    }}
                                    value={invoiceListOption?.filter(function (
                                      option
                                    ) {
                                      return option?.value === piNumber;
                                    })}
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
                                        height: "auto",
                                        // overflowY: "scroll",
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
                                    onChange={(e) => {
                                      setInvoiceId(e.value);
                                      setPINumber(e.value);
                                      setFieldValue("piNumber", e.value);
                                      if (
                                        paymentReceiveInformation.length !== 0
                                      ) {
                                        const matchPIWithPaymentReceive =
                                          paymentReceiveInformation.filter(
                                            (item) => item.piNumber === e.value
                                          );
                                        
                                        if (
                                          matchPIWithPaymentReceive.length > 0
                                        ) {
                                          setSinglePaymentReceiveInfo(
                                            matchPIWithPaymentReceive
                                          );
                                        } else {
                                          swal({
                                            title: "Sorry!",
                                            text: "This PI has no Payment Receiced yet.",
                                            icon: "warning",
                                            button: "OK",
                                          });
                                          setIsDisplay(false);
                                        }
                                      }

                                      const invoiceListMatchingData =
                                        invoiceList.find(
                                          (data) => data._id === e.value
                                        );
                                   
                                      setInvoiveByInvoiceNumber(
                                        invoiceListMatchingData
                                      );
                                      setFormValues((prevData) => {
                                        return {
                                          ...prevData,
                                          piNumber: e.value,
                                        };
                                      });
                                    }}
                                  ></Select>
                                </div>
                              </div>
                            </div>
                            {/* {showPreviousPaymentDetailsButton &&
                            previousPaymentData.length > 0 ? (
                              <div className="col col-md-6 col-lg-2 mt-2">
                                <button
                                  type="button"
                                  className="border-0 "
                                  style={{
                                    backgroundColor: "#2DDC1B",
                                    color: "white",
                                    padding: "5px 10px",
                                    fontSize: "14px",
                                    borderRadius: "5px",
                                    width: "100%",
                                    height: "38px",
                                    marginTop: "25px",
                                  }}
                                  onClick={() => setShow(true)}
                                >
                                  Previous Payment Details
                                </button>
                              </div>
                            ) : (
                              ""
                            )} */}
                          </div>
                        </div>
                        
                        {isDisplay && (
                          <div div className={`${isPaymentReceiveLoading ? 'd-none' : 'd-block'}`}>
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
                                    form="do-form"
                                    className="border-0"

                                    style={{
                                      backgroundColor: isDOSave || isDOInsertLoading ? "gray" : "#2DDC1B",
                                      color: "white",
                                      padding: "5px 10px",
                                      fontSize: "14px",
                                      borderRadius: "5px",
                                      width: "100px",
                                    }}
                                    disabled={isDOSave || isDOInsertLoading
                                    }
                                  >
                                   {isDOInsertLoading ? 'Saving' : 'Save'} 
                                  </button>
                                </div>
                              </div>
                            </div>
                            {
                              <InsertDetailsDOInformation
                                itemSize={itemSize}
                                finishgoods={finishgoods}
                                details={paymentReceiveSelectedItem}
                                setPaymentReceiveSelectedItem={
                                  setPaymentReceiveSelectedItem
                                }
                                setFieldValue={setFieldValue}
                                invoiceInformation={invoiceInformation}
                                checkNetTotalQuantity={checkNetTotalQuantity}
                                setIsDOSave={setIsDOSave}
                                values={values}
                              ></InsertDetailsDOInformation>
                            }
                          </div>
                        )}
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

export default DelivaryOrderCommonInsertPart;
