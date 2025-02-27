import React, { useEffect, useState } from "react";
import ApproveInvoiceModal from "../../SalesManagement/ProformaInvoice/Index/ApproveInvoiceModal/ApproveInvoiceModal";
import UnApproveInvoiceModal from "../../SalesManagement/ProformaInvoice/Index/UnApproveInvoiceModal/UnApproveInvoiceModal"
const InvoiceListHeading = ({
  totalApprovedPi,
  totalUnApprovePi,
  totalApprovePiAmount,
  totalUnApprovePiAmount,
  permission,
  userRoleId,
  userRoles,
  finishGoodsData,unitInfo,
  sizeInfo,
  paymentInfo,
  base64Logo,
  signature,
}) => {
  const [showUnApprovePIModal, setShowUnApprovePIModal] = useState(false);
  const [showApprovePIModal, setShowApprovePIModal] = useState(false);


  return (
    <div>
      <div className="row">
        <div className={"col-md-4 col-lg-3"}>
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
              data-target="#approveInvoiceModal"
              onClick={() => {
                setShowApprovePIModal(true);
                setShowUnApprovePIModal(false);
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
                Total Approve PI
              </p>
              <h5
                className="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {totalApprovedPi}
              </h5>
            </div>
          </div>
        </div>
        <div className={"col-md-4 col-lg-3 mt-4  mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0"}>
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
              data-target="#productionModal"
              onClick={() => {
                // setLastMonthModal(true);
                // setTotalProductionModal(false);
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
                Total Approve PI Amount
              </p>
              <h5
                className="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {totalApprovePiAmount?.toLocaleString()}
              </h5>
            </div>
          </div>
        </div>
        <div className={"col-md-4 col-lg-3 mt-4  mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0"}>
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
              data-target="#unapproveInvoiceModal"
              onClick={() => {
                setShowUnApprovePIModal(true);
                setShowApprovePIModal(false);
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
                Total Unpprove PI
              </p>
              <h5
                className="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {totalUnApprovePi}
              </h5>
            </div>
          </div>
        </div>
        <div className={"col-md-4 col-lg-3 mt-4  mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0"}>
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
              data-target="#productionModal"
              onClick={() => {
                setShowUnApprovePIModal(true);
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
                Total Unapprove PI Amount
              </p>
              <h5
                className="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {totalUnApprovePiAmount?.toLocaleString()}
              </h5>
            </div>
          </div>
        </div>
      </div>

      {showUnApprovePIModal && (
        <UnApproveInvoiceModal permission={permission} 
        userRoleId={userRoleId}
        userRoles={userRoles}
        finishGoodsData={finishGoodsData}
        unitInfo={unitInfo}
  sizeInfo={sizeInfo}
  paymentInfo={paymentInfo}
  base64Logo={base64Logo}
  signature={ signature}
         />
      )}
      {showApprovePIModal && <ApproveInvoiceModal permission={permission} />}
    </div>
  );
};

export default InvoiceListHeading;
