import React, { useEffect, useState } from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";
import "./PurchaseOrderAproveForm.css";
import {
  useGetAllPurchaseOrderApproveInformationQuery,
  useGetAllPurchaseOrderCashInformationQuery,
  useGetAllPurchaseOrderInformationQuery,
  useGetAllPurchaseOrderLCInformationQuery,
  useGetAllPurchaseOrderUnapproveInformationQuery,
  useUpdatePurchaseOrderInformationStatusMutation,
} from "../../../../redux/features/purchaseorderinformation/purchaseOrderInfoApi";
import PurchaseOrderStatusListTable from "../Index/PurchaseOrderStatusListTable";
import { useGetAllPaymentInformationQuery } from "../../../../redux/features/paymnetinformation/paymentInfoApi";
import { useGetAllGRNInformationQuery } from "../../../../redux/features/goodsreceivenoteinfo/grninfoApi";
import PurchaseHeading from './../../../Common/ListHeadingModal/PurchaseDataModal/PurchaseHeading';
import { useGetAllSupplierInformationQuery } from "../../../../redux/features/supplierInformation/supplierInfoApi";

const PurchaseOrderApproveForm = ({permission}) => {
  const [approveStatus, setApproveStatus] = useState("");
  const [showPurchaseApproveListData, setShowPurchaseOrderApproveListData] =
    useState(false);
  const [showPurchaseUnApproveListData, setShowPurchaseOrderUnApproveListData] =
    useState(false);
      const { data: supplierInfo } = useGetAllSupplierInformationQuery(undefined);
  const {
    data: purchaseInfoData,
    isLoading: isPurchaseOrderLoading,
    refetch,
  } = useGetAllPurchaseOrderInformationQuery(undefined);
  const {
    data: purchaseCashInfoData
  } = useGetAllPurchaseOrderCashInformationQuery(undefined);
  const {
    data: purchaseLCInfoData
  } = useGetAllPurchaseOrderLCInformationQuery(undefined);
  const {
    data: purchaseApproveInfoData
  } = useGetAllPurchaseOrderApproveInformationQuery(undefined);
  const {
    data: purchaseUnapproveInfoData
  } = useGetAllPurchaseOrderUnapproveInformationQuery(undefined);
    const [purchaseInfosModal, setPurchaseInfosModal] = useState(false);
  const [purchaseApproveAllData, setPurchaseApproveAllData] = useState([]);
  const [purchaseUnApproveAllData, setPurchaseUnApproveAllData] = useState([]);
  const [purchaseFilterApproveAllData, setPurchaseFilterApproveAllData] =
    useState([]);
  const [purchaseFilterUnApproveAllData, setPurchaseFilterUnApproveAllData] =
    useState([]);
  const [purchaseInCash, setPurchaseInCash] = useState([]);
  const [purchaseInLCAtSight, setPurchaseInInLCAtSight] = useState([]);
  const [purchaseOrderList, setPurchaseOrderList] = useState(true);
  const [fromDate, setFromDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [toDate, setToDate] = useState(new Date().toLocaleDateString("en-CA"));

  const { data: grnInfoData, refetch: grnRefetch } =
    useGetAllGRNInformationQuery(undefined);
  const { data: paymentData } = useGetAllPaymentInformationQuery(undefined);
  const [updatePOApproveStatus] =
    useUpdatePurchaseOrderInformationStatusMutation();

  const purchaseOrderAprroveOptions = [
    { value: "approve", label: "Approve" },
    { value: "unapprove", label: "UnApprove" },
  ];

  useEffect(() => {
    handleStatus();
    const matches = purchaseInfoData
      ?.map((ref) => {
        return paymentData?.find((payment) => payment._id === ref.paymentId);
      })
      .filter((match) => match !== undefined);

    const categorizedData = matches?.reduce((acc, curr) => {
      if (!acc[curr.paymentType]) {
        acc[curr.paymentType] = [];
      }
      acc[curr.paymentType].push(curr);
      return acc;
    }, {});
    setPurchaseInCash(categorizedData?.cash);
    setPurchaseInInLCAtSight(categorizedData?.lcatsight);
    const approvePurchaseData = purchaseInfoData?.filter((item) => {
      return item.approveStatus === true;
    });
    const unApprovePurchaseData = purchaseInfoData?.filter((item) => {
      return item.approveStatus === false;
    });
    setPurchaseApproveAllData(approvePurchaseData);
    setPurchaseUnApproveAllData(unApprovePurchaseData);
    // setPurchaseOrderApproveWithToDate(approvePurchaseDataWithToDate);
  }, [purchaseInfoData, paymentData]);

  const handleStatus = async () => {
    if (approveStatus === "approve" && toDate && fromDate) {
      setShowPurchaseOrderApproveListData(true);
      setShowPurchaseOrderUnApproveListData(false);
      const approvePurchaseData = purchaseInfoData?.filter((item) => {
        const makeDate = new Date(item.makeDate).toLocaleDateString("en-CA");
        return (
          item.approveStatus === true &&
          makeDate >= fromDate &&
          makeDate <= toDate
        );
      });
      setPurchaseFilterApproveAllData(approvePurchaseData);
      if (approvePurchaseData.length === 0) {
        swal({
          title: "Sorry!",
          text: "No Data Available.",
          icon: "warning",
          button: "OK",
        });
      }
    } else if (approveStatus === "unapprove" && toDate && fromDate) {
      setShowPurchaseOrderUnApproveListData(true);
      setShowPurchaseOrderApproveListData(false);

      const unApprovePurchaseData = purchaseInfoData?.filter((item) => {
        const makeDate = new Date(item.makeDate).toLocaleDateString("en-CA");
        return (
          item.approveStatus === false &&
          makeDate >= fromDate &&
          makeDate <= toDate
        );
      });
      setPurchaseFilterUnApproveAllData(unApprovePurchaseData);
      if (unApprovePurchaseData.length === 0) {
        swal({
          title: "Sorry!",
          text: "No Data Available.",
          icon: "warning",
          button: "OK",
        });
      }
    }
    grnRefetch();
  };

  const handleApproveData = async (data) => {
    const response = await updatePOApproveStatus(data);
    if (response?.data?.status === 200) {
      swal("Done", "Data Save Successfully", "success");
      await refetch();
      handleStatus();
    } else if (response?.error?.status === 400) {
      swal("Not Possible!", response?.error?.data?.message, "error");
    }
  };

  return (
    <div
      className=" row px-4 mx-4"
      style={{ height: "calc(98vh - 120px)", overflowY: "scroll" }}
    >
      <div class="">
        {/* <ListHeading
          purchaseInCash={purchaseInCash}
          purchaseInLCAtSight={purchaseInLCAtSight}
          purchaseOrderApproveData={purchaseApproveAllData}
          purchaseOrderUnApproveData={purchaseUnApproveAllData}
          purchaseApproveAllData={purchaseApproveAllData}
          purchaseOrderList={purchaseOrderList}
          purchaseInfoData={purchaseInfoData}
          setPurchaseOrderList={setPurchaseOrderList}
          isLoading={isPurchaseOrderLoading}
        ></ListHeading> */}
              <PurchaseHeading 
       purchaseInCash={purchaseCashInfoData}
       purchaseInLCAtSight={purchaseLCInfoData}
       purchaseOrderApproveData={purchaseApproveInfoData}
       purchaseOrderUnApproveData={purchaseUnapproveInfoData}
       purchaseInfoData={purchaseInfoData}
       purchaseOrderList={purchaseOrderList}
       setPurchaseOrderList={setPurchaseOrderList}
       isLoading={isPurchaseOrderLoading}
       supplierInfo={supplierInfo}
       permission={permission}
       setPurchaseInfosModal={setPurchaseInfosModal}
       ></PurchaseHeading>

        <div className="mt-2 mt-sm-4 mt-md-4 mt-lg-4 rounded-4 ">
          <div class="row row-cols-2 row-cols-lg-2 w-75">
            <div className="col-12 col-lg-3 text-center mt-2">
              <label htmlFor="">Po Status</label>
              <div className="w-100">
                <Select
                  class="form-select"
                  className="w-100 mb-3"
                  aria-label="Default select example"
                  name="itemName"
                  options={purchaseOrderAprroveOptions}
                  defaultValue={{
                    label: "Select Status",
                    value: 0,
                  }}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      width: "100%",
                      borderColor: state.isFocused ? "#fff" : "#fff",
                      border: "1px solid #2DDC1B",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                      // height: "200px",
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
                    setApproveStatus(e.value);
                  }}
                ></Select>
              </div>
            </div>
            <div className="col-6 col-lg-3 text-center mt-2">
              <label htmlFor="">From Date</label>
              <br />
              <DatePicker
                dateFormat="y-MM-dd"
                className="text-center custom-datepicker3"
                //   value={id ? purchaseOrderAllInformation?.deliveryDate : fromDate}
                calendarClassName="custom-calendar3"
                selected={fromDate}
                required
                onChange={(fromDate) => {
                  if (fromDate > new Date()) {
                    swal({
                      title: "Select Valid Date",
                      text: "Date should be equal or earlier than today",
                      icon: "warning",
                      button: "OK",
                    });
                  } else {
                    setFromDate(fromDate?.toLocaleDateString("en-CA"));
                  }
                }}
              />
            </div>
            <div className="col-6 col-lg-3 text-center mt-2">
              <label htmlFor="">To Date</label>
              <br />
              <DatePicker
                dateFormat="y-MM-dd"
                className="text-center custom-datepicker3"
                //   value={id ? purchaseOrderAllInformation?.deliveryDate : fromDate}
                calendarClassName="custom-calendar3"
                selected={toDate}
                required
                onChange={(toDate) => {
                  const formateFromDate = new Date(fromDate).toLocaleDateString(
                    "en-CA"
                  );
                  const formateToDate = new Date(toDate).toLocaleDateString(
                    "en-CA"
                  );
                  if (toDate > new Date() || formateFromDate > formateToDate) {
                    swal({
                      title: "Select Valid Date",
                      text: "Date should be equal or earlier than today",
                      icon: "warning",
                      button: "OK",
                    });
                  } else {
                    setToDate(toDate?.toLocaleDateString("en-CA"));
                  }
                }}
              />
            </div>
            <div className="col-6 col-lg-3 ms-sm-2 ms-lg-0 mt-2">
              <label htmlFor=""></label>
              <br />
              <button
                type="submit"
                className="border-0 "
                style={{
                  backgroundColor: "#2DDC1B",
                  color: "white",
                  padding: "5px 10px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  width: "100px",
                  height: "38px",
                  marginTop: "3px",
                }}
                onClick={() => {
                  handleStatus();
                }}
              >
                Show
              </button>
            </div>
          </div>

          <div className="">
            {showPurchaseApproveListData && (
              <PurchaseOrderStatusListTable
                showPurchaseApproveListData={showPurchaseApproveListData}
                purchaseFilterApproveAllData={purchaseFilterApproveAllData}
                isPurchaseOrderLoading={isPurchaseOrderLoading}
              ></PurchaseOrderStatusListTable>
            )}
            {showPurchaseUnApproveListData && (
              <PurchaseOrderStatusListTable
                handleApproveData={handleApproveData}
                fromDate={fromDate}
                toDate={toDate}
                showPurchaseUnApproveListData={showPurchaseUnApproveListData}
                purchaseFilterUnApproveAllData={purchaseFilterUnApproveAllData}
                setPurchaseFilterUnApproveAllData={
                  setPurchaseFilterUnApproveAllData
                }
                refetch={refetch}
                isPurchaseOrderLoading={isPurchaseOrderLoading}
              ></PurchaseOrderStatusListTable>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderApproveForm;
