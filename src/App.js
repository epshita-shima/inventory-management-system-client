import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import UserCreation from "./components/UserListInformation/Insert/UserCreation";
import SingleUserDisplay from "./components/UserListInformation/Update/SingleUserDisplay";
import LoginWithUsername from "./pages/Login/LoginWithUsername";
import MainView from "./components/MainView/MainView";
import ChangePasswordModal from "./pages/Login/ChangePasswordModal";
import NotFound from "./pages/NotFound/NotFound";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateMenu from "./components/MenuInformation/Insert/CreateMenu";
import MenuDataList from "./components/MenuInformation/Index/MenuDataList";
import UpdateMenu from "./components/MenuInformation/Update/UpdateMenu";
import UserDataList from "./components/UserListInformation/Index/UserDataList";
import FGItemInfoTableData from "./components/FGItemProfile/ItemProfileInformation/Index/FGItemInfoTableData";
import InsertFgItemInfo from "./components/FGItemProfile/ItemProfileInformation/Insert/InsertFgItemInfo";
import UpdateFgItemInfo from "./components/FGItemProfile/ItemProfileInformation/Update/UpdateFgItemInfo";
import InsertRmItemInfo from "./components/RMItemProfile/ItemProfileInformation/Insert/InsertRmItemInfo";
import UpdateRmItemInfo from "./components/RMItemProfile/ItemProfileInformation/Update/UpdateRmItemInfo";
import RMItemInfoTableData from "./components/RMItemProfile/ItemProfileInformation/Index/RMItemInfoTableData";
import InsertCFTInfo from "./components/CFTInformations/Insert/InsertCFTInfo";
import CFTInfosTableData from "./components/CFTInformations/Index/CFTInfosTableData";
import UpdateCFTInfo from "./components/CFTInformations/Update/UpdateCFTInfo";
import InsertSupplierInformation from "./components/SupplierProfile/Insert/InsertSupplierInformation";
import SupplierInfoTableData from "./components/SupplierProfile/Index/SupplierInfoTableData/SupplierInfoTableData";
import InsertClientInformation from "./components/ClientInformation/Insert/InsertClientInformation";
import ClientInfoTableData from "./components/ClientInformation/Index/ClientInfoTableData";
import PurchaseOrderListTable from "./components/PurchaseManagement/PurchaseOrder/Index/PurchaseOrderListTable";
import CommonPurchaseOrderInfo from "./components/PurchaseManagement/PurchaseOrder/Common/CommonPurchaseOrderInfo";
import PurchaseOrderApproveForm from "./components/PurchaseManagement/PurchaseOrder/PurchaseOrderApprove/PurchaseOrderApproveForm";
import InsertGRNInfo from "./components/GoodsReceiveNoteInformation/Insert/InsertGRNInfo";
import GRNInfoTable from "./components/GoodsReceiveNoteInformation/Index/GRNInfoTable";
import ProductionCommonPart from "./components/Production/Common/ProductionCommonPart";
import ProductionListTable from "./components/Production/Index/ProductionListTable";
import PaymentModeDataList from "./components/PaymentModeInformation/Index/PaymentModeDataList";
import InsertPaymentOption from "./components/PaymentModeInformation/Insert/InsertPaymentOption";
import PaymentMethodSingleEntry from "./components/PaymentMethodInformation/Common/PaymentMethodSingleEntry";
import PaymentReceiveDataTable from "./components/PaymentMethodInformation/Index/PaymentReceiveDataTable";
import SalesManagementCommonPart from "./components/SalesManagement/ProformaInvoice/Common/SalesManagementCommonPart";
import InvoiceInformationList from "./components/SalesManagement/ProformaInvoice/Index/InvoiceInformationListTable/InvoiceInformationList";
import SpecialDeliveryTableList from "./components/SalesManagement/SpecialDelivery/SpecialDeliveryTable/SpecialDeliveryTableList";
import DelivaryOrderCommonInsertPart from "./components/SalesManagement/DelivaryOrderInformation/Common/DelivaryOrderCommonInsertPart";
import DeliveryOrderList from "./components/SalesManagement/DelivaryOrderInformation/Index/DeliveryOrderListTable/DeliveryOrderList";
import DeliveryOrderApproveList from "./components/SalesManagement/DelivaryOrderInformation/DeliveryOderApproveList/DeliveryOrderApproveList";
import FinishGoodsDeliveryList from "./components/FinishGoodsDelivery/DeliveryListTable/FinishGoodsDeliveryList";
import FinishGoodsDeliveryCommonPart from "./components/FinishGoodsDelivery/Common/FinishGoodsDeliveryCommonPart";
import DeliverReturnCommonPart from "./components/DeliverReturnInformation/Common/DeliverReturnCommonPart";
import DeliveredReturnList from "./components/DeliverReturnInformation/Index/DeliveredReturnList";
import OrderDetailsReport from "./components/ReportManagement/SalesReport/OrderDetailsReport/OrderDetailsReport";
import ProductionReportTable from "./components/ReportManagement/ProductionReport/ProductionReportSection/ProductionReportTable";
import RawMaterialConsumptionTable from "./components/ReportManagement/RawMaterialConsumptionSection/RawMaterialConsumptionTable/RawMaterialConsumptionTable";
import CombineReportTable from "./components/ReportManagement/CombineReport/CombineReportTable";
import PurchaseReportTable from "./components/ReportManagement/PurchaseReport/PurchaseReportTable";
import RequireAuth from "./pages/RequireAuth/RequireAuth";
function App() {
  const [singleUserData, setSingleUserData] = useState([]);
  const [changePassword, setChangePassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [userIdForChangePassowrd, setUserIdForChangePassowrd] = useState([]);
  const getMenulistData = localStorage.getItem("user");
  const menuListData = JSON.parse(getMenulistData);
  console.log(userIdForChangePassowrd);
  // http://localhost:3000/main-view/production-list/update-production-info/677a2c1f52e67d627de4f9f7
  return (
    <div>
      <div className="app-container">
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <LoginWithUsername
                  singleUserData={singleUserData}
                  setSingleUserData={setSingleUserData}
                ></LoginWithUsername>
              }
            ></Route>
            <Route
              path="/main-view"
              element={
                <MainView
                  setChangePassword={setChangePassword}
                  setResetPassword={setResetPassword}
                ></MainView>
              }
            >
              <Route index element={<Dashboard></Dashboard>}></Route>
              <Route
                path="/main-view/change-password"
                element={
                  <ChangePasswordModal
                    menuListData={menuListData}
                    userIdForChangePassowrd={userIdForChangePassowrd}
                    singleUserData={singleUserData}
                    setSingleUserData={setSingleUserData}
                    resetPassword={resetPassword}
                    changePassword={changePassword}
                  />
                }
              ></Route>

              <Route
                path="/main-view/user-setting"
                element={
                  <RequireAuth>
                    <UserDataList
                      setChangePassword={setChangePassword}
                      setResetPassword={setResetPassword}
                      setUserIdForChangePassowrd={setUserIdForChangePassowrd}
                      resetPassword={resetPassword}
                      changePassword={changePassword}
                    ></UserDataList>
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/main-view//create-user"
                element={
                  <RequireAuth>
                    <UserCreation></UserCreation>
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="user-setting/user-update/:id"
                element={
                  <RequireAuth>
                    <SingleUserDisplay />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/main-view/create-raw-material-item"
                element={
                  <RequireAuth>
                    <InsertRmItemInfo />
                 </RequireAuth>
                }
              ></Route>
              <Route
                path="/main-view/raw-material-item-list"
                element={
                  <RequireAuth>
                    <RMItemInfoTableData />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="update-items-raw-material/:id"
                element={
                  <RequireAuth>
                    <UpdateRmItemInfo />
                  </RequireAuth>
                }
              ></Route>
              {/* <Route path="/main-view/create-raw-material-item" element={<UpdateRmItemInfo></UpdateRmItemInfo>}></Route> */}
              <Route
                path="/main-view/finish-goods-item-list"
                element={
                  <RequireAuth>
                    <FGItemInfoTableData />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/main-view/craete-finish-goods-item"
                element={
                  <RequireAuth>
                    <InsertFgItemInfo />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="update-finish-goods-items/:id"
                element={
                  <RequireAuth>
                    <UpdateFgItemInfo />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="/main-view/create-cft-infos"
                element={
                  <RequireAuth>
                    <InsertCFTInfo />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/main-view/cft-info-list"
                element={
                  <RequireAuth>
                    <CFTInfosTableData />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="update-cft-info/:id"
                element={
                  <RequireAuth>
                    <UpdateCFTInfo />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="/main-view/create-supplier"
                element={
                  <RequireAuth>
                    <InsertSupplierInformation />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/main-view/supplier-list"
                element={
                  <RequireAuth>
                    <SupplierInfoTableData />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="update-supplier-info/:id"
                element={
                  <RequireAuth>
                    <InsertSupplierInformation />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="/main-view/client-list"
                element={
                  <RequireAuth>
                    <ClientInfoTableData />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/main-view/create-client"
                element={
                  <RequireAuth>
                    <InsertClientInformation />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="update-client-info/:id"
                element={
                  <RequireAuth>
                    <InsertClientInformation />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="/main-view/po-list"
                element={
                  <RequireAuth>
                    <PurchaseOrderListTable />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/main-view/create-po"
                element={
                  <RequireAuth>
                    <CommonPurchaseOrderInfo />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="update-purchaseinfo/:id"
                element={
                  <RequireAuth>
                    <CommonPurchaseOrderInfo />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/main-view/po-approval"
                element={
                  <RequireAuth>
                    <PurchaseOrderApproveForm />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="/main-view/grn-list"
                element={
                  <RequireAuth>
                    <GRNInfoTable />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/main-view/create-grn"
                element={
                  <RequireAuth>
                    <InsertGRNInfo />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="update-grn-info/:id"
                element={
                  <RequireAuth>
                    <InsertGRNInfo />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="create-production"
                element={
                  <RequireAuth>
                    <ProductionCommonPart />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="production-list"
                element={
                  <RequireAuth>
                    <ProductionListTable />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="production-list/update-production-info/:id"
                element={
                  <RequireAuth>
                    <ProductionCommonPart />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="create-payment-mode"
                element={
                  <RequireAuth>
                    <InsertPaymentOption />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="payment-list"
                element={
                  <RequireAuth>
                    <PaymentModeDataList />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="create-invoice"
                element={
                  <RequireAuth>
                    <SalesManagementCommonPart />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="invoice-list"
                element={
                  <RequireAuth>
                    <InvoiceInformationList />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="update-invoice/:id"
                element={
                  <RequireAuth>
                    <SalesManagementCommonPart />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="special-delivery-approve"
                element={
                  <RequireAuth>
                    <SpecialDeliveryTableList />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="create-payment-received"
                element={
                  <RequireAuth>
                    <PaymentMethodSingleEntry />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="payment-received-list"
                element={
                  <RequireAuth>
                    <PaymentReceiveDataTable />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="update-payment-received/:id"
                element={
                  <RequireAuth>
                    <PaymentMethodSingleEntry />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="create-do"
                element={
                  <RequireAuth>
                    <DelivaryOrderCommonInsertPart />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="do-list"
                element={
                  <RequireAuth>
                    <DeliveryOrderList />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="approve-list"
                element={
                  <RequireAuth>
                    <DeliveryOrderApproveList />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="list-page"
                element={
                  <RequireAuth>
                    <FinishGoodsDeliveryList />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="finish-goods-delivery-order-info/:id"
                element={
                  <RequireAuth>
                    <FinishGoodsDeliveryCommonPart />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="create-return-information"
                element={
                  <RequireAuth>
                    <DeliverReturnCommonPart />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="list-information"
                element={
                  <RequireAuth>
                    <DeliveredReturnList />
                  </RequireAuth>
                }
              ></Route>

              {/* <Route
                path="/main-view/user-list"
                element={
                  // <RequireAuth>
                    <UserListInfo
                      setChangePassword={setChangePassword}
                      setResetPassword={setResetPassword}
                      resetPassword={resetPassword}
                      changePassword={changePassword}
                    ></UserListInfo>
                  // </RequireAuth>
                }
              ></Route> */}
              <Route
                path="create-menu"
                element={
                  <RequireAuth>
                    <CreateMenu />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="update-menu/:id"
                element={
                  <RequireAuth>
                    <UpdateMenu />
                  </RequireAuth>
                }
              ></Route>

              <Route
                path="menu-list"
                element={
                  <RequireAuth>
                    <MenuDataList />
                  </RequireAuth>
                }
              ></Route>
              <Route path="*" element={<NotFound></NotFound>}></Route>

              {/* sales report */}
              <Route
                path="sales-report"
                element={
                  <RequireAuth>
                    <OrderDetailsReport />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="finish-goods"
                element={
                  <RequireAuth>
                    <ProductionReportTable />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="raw-material-consumption"
                element={
                  <RequireAuth>
                    <RawMaterialConsumptionTable />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="combine-report"
                element={
                  <RequireAuth>
                    <CombineReportTable />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="purchase-report"
                element={
                  <RequireAuth>
                    <PurchaseReportTable />
                  </RequireAuth>
                }
              ></Route>
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
