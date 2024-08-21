import React, { useState } from "react";
import ProductionTotalModal from "../../Production/Index/ProductionModal/ProductionTotalModal";

const ProductionListHeading = ({
  totalProduction,
  lastOneMonthProduction,
  lastOneWeekData,
  yesterdayData,
}) => {
  const [lastMonthModal, setLastMonthModal] = useState(false);
  const [totalProductionModal, setTotalProductionModal] = useState(false);
  const [lastOneWeekProdactionModal,setLastOneWeekProductionModal]=useState(false)
  const [yesterdayProductionModal,setYesterdayProductionModal]=useState(false)
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
                setLastMonthModal(false);
                setTotalProductionModal(true);
                setLastOneWeekProductionModal(false)
                setYesterdayProductionModal(false)
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
                Total Production
              </p>
              <h5
                class="card-text"
                style={{ color: "#000", fontSize: "30px", fontWeight: "700" }}
              >
                {totalProduction?.length ? totalProduction?.length : 0}
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
                // const searchItem = mainData?.filter((x) => x.url === pathname);
                // if (
                //   searchItem[0]?.menuId !== MenuIdCollection.purchaseorderlist
                // ) {
                //   setActiveDataModal(true);
                // }
                setLastMonthModal(true);
                setTotalProductionModal(false);
                setLastOneWeekProductionModal(false)
                setYesterdayProductionModal(false)
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
                Last One Month Production
              </p>
              <h5
                class="card-text"
                style={{ color: "#000", fontSize: "30px", fontWeight: "700" }}
              >
                {lastOneMonthProduction?.length
                  ? lastOneMonthProduction?.length
                  : 0}
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
              data-target="#productionModal"
              onClick={() => {
                setLastMonthModal(false);
                setTotalProductionModal(false);
                setLastOneWeekProductionModal(true)
                setYesterdayProductionModal(false)
                // const searchItem = mainData?.filter((x) => x.url == pathname);
                // if (
                //   searchItem[0]?.menuId !== MenuIdCollection.purchaseorderlist
                // ) {
                //   setInActiveDataModal(true);
                // }
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
                Last One Week Production
              </p>
              <h5
                class="card-text"
                style={{ color: "#000", fontSize: "30px", fontWeight: "700" }}
              >
                {lastOneWeekData?.length ? lastOneWeekData?.length : 0}
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
              data-target="#productionModal"
              onClick={() => {
                setLastMonthModal(false);
                setTotalProductionModal(false);
                setLastOneWeekProductionModal(false)
                setYesterdayProductionModal(true)
                // const searchItem = mainData?.filter((x) => x.url == pathname);
                // if (
                //   searchItem[0]?.menuId !== MenuIdCollection.purchaseorderlist
                // ) {
                //   setInActiveDataModal(true);
                // }
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
                Yeasterday Production
              </p>
              <h5
                class="card-text"
                style={{ color: "#000", fontSize: "30px", fontWeight: "700" }}
              >
                {yesterdayData?.length ? yesterdayData?.length : 0}
              </h5>
            </div>
          </div>
        </div>
      </div>

      {totalProductionModal && (
        <ProductionTotalModal totalProduction={totalProduction} />
      )}
      {lastMonthModal && (
        <ProductionTotalModal totalProduction={lastOneMonthProduction} />
      )}
      {lastOneWeekProdactionModal && (
        <ProductionTotalModal totalProduction={lastOneWeekData} />
      )}
      {yesterdayProductionModal && (
        <ProductionTotalModal totalProduction={yesterdayData} />
      )}
    </div>
  );
};

export default ProductionListHeading;
