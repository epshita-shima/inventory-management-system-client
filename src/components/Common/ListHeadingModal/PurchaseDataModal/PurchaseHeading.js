import React, { useState } from "react";
import PurchaseHeadingModal from "./PurchaseHeadingModal";

const PurchaseHeading = ({
  purchaseInCash,
  purchaseInLCAtSight,
  purchaseOrderApproveData,
  purchaseOrderUnApproveData,
  purchaseInfoData,
  permission,
  supplierInfo,
  rawMaterialItemInfo,
  bankInformation,
  paymentData,
  companyinfo,
  reportTitle
}) => {
  const [totalPurchaseModal, setTotalPurchaseModal] = useState(false);
  const [totalPurchaseCashModal, setTotalPurchaseCashModal] = useState(false);
  const [totalPurchaseLCModal, setTotalPurchaseLCModal] = useState(false);
  const [totalPurchaseApproveModal, setTotalPurchaseApproveModal] =
    useState(false);
  const [totalPurchaseUnApproveModal, setTotalPurchaseUnApproveModal] =
    useState(false);
  return (
    <div>
      <div className="row">
        <div
          className={
            "col-lg col-sm-12 col-md-4 mt-4 mt-sm-4 mt-md-4 mt-lg-0 mt-xl-0"
          }
        >
          <div
            className="cardbox shadow-lg"
            style={{
              borderLeft: "12px solid #2DDC1B",
              borderRadius: "10px",
              height: "80px",
              width: "100%",
            }}
          >
            <div
              className="card-body"
              data-toggle="modal"
              data-target="#purchaseModal"
              onClick={() => {
                setTotalPurchaseCashModal(false);
                setTotalPurchaseModal(true);
                setTotalPurchaseLCModal(false);
                setTotalPurchaseApproveModal(false);
                setTotalPurchaseUnApproveModal(false);
                // setLastOneWeekProductionModal(false)
                // setYesterdayProductionModal(false)
              }}
            >
              <p
                className="card-title"
                style={{
                  color: "#8091a5",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Total PO
              </p>
              <h5
                className="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {purchaseInfoData?.length}
              </h5>
            </div>
          </div>
        </div>
        <div
          className={
            "col-lg col-sm-12 col-md-4 mt-4 mt-sm-4 mt-md-4 mt-lg-0 mt-xl-0"
          }
        >
          <div
            className="cardbox shadow-lg"
            style={{
              borderLeft: "12px solid  #B8FEB3",
              borderRadius: "10px",
              height: "80px",
              width: "100%",
            }}
          >
            <div
              className="card-body"
              data-toggle="modal"
              data-target="#purchaseModal"
              onClick={() => {
              
                setTotalPurchaseCashModal(true);
                setTotalPurchaseModal(false);
                setTotalPurchaseLCModal(false);
                setTotalPurchaseApproveModal(false);
                setTotalPurchaseUnApproveModal(false);
               
              }}
            >
              <p
                className="card-title"
                style={{
                  color: "#8091a5",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Total PO in Cash
              </p>
              <h5
                className="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {purchaseInCash?.length}
              </h5>
            </div>
          </div>
        </div>
        <div
          className={
            "col-lg col-sm-12 col-md-4 mt-4 mt-sm-4 mt-md-4 mt-lg-0 mt-xl-0"
          }
        >
          <div
            className="cardbox shadow-lg"
            style={{
              borderLeft: "12px solid red",
              borderRadius: "10px",
              height: "80px",
              width: "100%",
            }}
          >
            <div
              className="card-body"
              data-toggle="modal"
              data-target="#purchaseModal"
              onClick={() => {
                setTotalPurchaseCashModal(false);
                setTotalPurchaseModal(false);
                setTotalPurchaseLCModal(true);
                setTotalPurchaseApproveModal(false);
                setTotalPurchaseUnApproveModal(false);
             
              }}
            >
              <p
                className="card-title"
                style={{
                  color: "#8091a5",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Total PO in LC
              </p>
              <h5
                className="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {purchaseInLCAtSight?.length}
              </h5>
            </div>
          </div>
        </div>
        <div
          className={
            "col-lg col-sm-12 col-md-4 mt-4 mt-sm-4 mt-md-4 mt-lg-0 mt-xl-0"
          }
        >
          <div
            className="cardbox shadow-lg"
            style={{
              borderLeft: "12px solid #2DDC1B",
              borderRadius: "10px",
              height: "80px",
              width: "100%",
            }}
          >
            <div
              className="card-body"
              data-toggle="modal"
              data-target="#purchaseModal"
              onClick={() => {
                setTotalPurchaseCashModal(false);
                setTotalPurchaseModal(false);
                setTotalPurchaseLCModal(false);
                setTotalPurchaseApproveModal(true);
                setTotalPurchaseUnApproveModal(false);
            
              }}
            >
              <p
                className="card-title"
                style={{
                  color: "#8091a5",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Total Approve PO
              </p>
              <h5
                className="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {purchaseOrderApproveData?.length}
              </h5>
            </div>
          </div>
        </div>
        <div
          className={
            "col-lg col-sm-12 col-md-4 mt-4 mt-sm-4 mt-md-4 mt-lg-0 mt-xl-0"
          }
        >
          <div
            className="cardbox shadow-lg"
            style={{
              borderLeft: "12px solid #2DDC1B",
              borderRadius: "10px",
              height: "80px",
              width: "100%",
            }}
          >
            <div
              className="card-body"
              data-toggle="modal"
              data-target="#purchaseModal"
              onClick={() => {
                setTotalPurchaseCashModal(false);
                setTotalPurchaseModal(false);
                setTotalPurchaseLCModal(false);
                setTotalPurchaseApproveModal(false);
                setTotalPurchaseUnApproveModal(true);
              
              }}
            >
              <p
                className="card-title"
                style={{
                  color: "#8091a5",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Total Unapprove PO
              </p>
              <h5
                className="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {purchaseOrderUnApproveData?.length}
              </h5>
            </div>
          </div>
        </div>
      </div>

      {totalPurchaseModal && (
        <PurchaseHeadingModal
          totalPurchase={purchaseInfoData}
          totalPurchaseModal={totalPurchaseModal}
          supplierInfo={supplierInfo}
          permission={permission}
          rawMaterialItemInfo={rawMaterialItemInfo}
          bankInformation={bankInformation}
          paymentData={paymentData}
          companyinfo={companyinfo}
          reportTitle={reportTitle}
        />
      )}
      {totalPurchaseCashModal && (
        <PurchaseHeadingModal
          totalPurchase={purchaseInCash}
          totalPurchaseCashModal={totalPurchaseCashModal}
          supplierInfo={supplierInfo}
          permission={permission}
          rawMaterialItemInfo={rawMaterialItemInfo}
          bankInformation={bankInformation}
          paymentData={paymentData}
          companyinfo={companyinfo}
          reportTitle={reportTitle}
        />
      )}
      {totalPurchaseLCModal && (
        <PurchaseHeadingModal
          totalPurchase={purchaseInLCAtSight}
          totalPurchaseLCModal={totalPurchaseLCModal}
          supplierInfo={supplierInfo}
          permission={permission}
          rawMaterialItemInfo={rawMaterialItemInfo}
          bankInformation={bankInformation}
          paymentData={paymentData}
          companyinfo={companyinfo}
          reportTitle={reportTitle}
        />
      )}
      {totalPurchaseLCModal && (
        <PurchaseHeadingModal
          totalPurchase={purchaseInLCAtSight}
          totalPurchaseLCModal={totalPurchaseLCModal}
          supplierInfo={supplierInfo}
          permission={permission}
          rawMaterialItemInfo={rawMaterialItemInfo}
          bankInformation={bankInformation}
          paymentData={paymentData}
          companyinfo={companyinfo}
          reportTitle={reportTitle}
        />
      )}
      {totalPurchaseApproveModal && (
        <PurchaseHeadingModal
          totalPurchase={purchaseOrderApproveData}
          totalPurchaseApproveModal={totalPurchaseApproveModal}
          totalPurchaseLCModal={totalPurchaseLCModal}
          supplierInfo={supplierInfo}
          permission={permission}
          rawMaterialItemInfo={rawMaterialItemInfo}
          bankInformation={bankInformation}
          paymentData={paymentData}
          companyinfo={companyinfo}
          reportTitle={reportTitle}
        />
      )}
      {totalPurchaseUnApproveModal && (
        <PurchaseHeadingModal
          totalPurchase={purchaseOrderUnApproveData}
          totalPurchaseUnApproveModal={totalPurchaseUnApproveModal}
          totalPurchaseLCModal={totalPurchaseLCModal}
          supplierInfo={supplierInfo}
          permission={permission}
          rawMaterialItemInfo={rawMaterialItemInfo}
          bankInformation={bankInformation}
          paymentData={paymentData}
          companyinfo={companyinfo}
          reportTitle={reportTitle}
        />
      )}
    </div>
  );
};

export default PurchaseHeading;
