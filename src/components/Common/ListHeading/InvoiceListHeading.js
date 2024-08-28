import React, { useState } from "react";
import UnApproveInvoiceModal from "../../SalesManagement/Index/UnApproveInvoiceModal/UnApproveInvoiceModal";

const InvoiceListHeading = ({totalApprovedPi,totalUnApprovePi,totalApprovePiAmount,totalUnApprovePiAmount,permission}) => {
const [showUnApprovePIModal,setShowUnApprovePIModal]=useState(false)
  return (
    <div>
      <div class="row">
        <div class={"col-md-4 col-lg-3"}>
          <div
            class="cardbox shadow-lg"
            style={{
              borderLeft: "12px solid #2DDC1B",
              borderRadius: "10px",
              height: "80px",
              width: "100%",
            }}
          >
            <div
              class="card-body"
              data-toggle="modal"
              data-target="#productionModal"
              onClick={() => {
                // setLastMonthModal(false);
                // setTotalProductionModal(true);
                // setLastOneWeekProductionModal(false)
                // setYesterdayProductionModal(false)
              }}
            >
              <p
                class="card-title"
                style={{
                  color: "#8091a5",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Total PI
              </p>
              <h5
                class="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {totalApprovedPi}
              </h5>
            </div>
          </div>
        </div>
        <div class={"col-md-4 col-lg-3 mt-4  mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0"}>
          <div
            class="cardbox shadow-lg"
            style={{
              borderLeft: "12px solid  #B8FEB3",
              borderRadius: "10px",
              height: "80px",
              width: "100%",
            }}
          >
            <div
              class="card-body"
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
                class="card-title"
                style={{
                  color: "#8091a5",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Total Approve PI Amount
              </p>
              <h5
                class="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {totalApprovePiAmount}
              </h5>
            </div>
          </div>
        </div>
        <div class={"col-md-4 col-lg-3 mt-4  mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0"}>
          <div
            class="cardbox shadow-lg"
            style={{
              borderLeft: "12px solid red",
              borderRadius: "10px",
              height: "80px",
              width: "100%",
            }}
          >
            <div
              class="card-body"
              data-toggle="modal"
              data-target="#unapproveInvoiceModal"
              onClick={() => {
                setShowUnApprovePIModal(true)
              }}
            >
              <p
                class="card-title"
                style={{
                  color: "#8091a5",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Total Unpprove PI
              </p>
              <h5
                class="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {totalUnApprovePi}
              </h5>
            </div>
          </div>
        </div>
        <div class={"col-md-4 col-lg-3 mt-4  mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0"}>
          <div
            class="cardbox shadow-lg"
            style={{
              borderLeft: "12px solid #2DDC1B",
              borderRadius: "10px",
              height: "80px",
              width: "100%",
            }}
          >
            <div
              class="card-body"
              data-toggle="modal"
              data-target="#productionModal"
              onClick={() => {
             setShowUnApprovePIModal(true)
              }}
            >
              <p
                class="card-title"
                style={{
                  color: "#8091a5",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Total Unapprove PI Amount
              </p>
              <h5
                class="card-text"
                style={{ color: "#000", fontSize: "25px", fontWeight: "700" }}
              >
                {totalUnApprovePiAmount}
              </h5>
            </div>
          </div>
        </div>
      </div>

       {showUnApprovePIModal && (
            <UnApproveInvoiceModal  permission={permission}/>
          )}
        
    </div>
  );
};

export default InvoiceListHeading;
