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
import InsertPurchaseOrder from "./components/PurchaseManagement/PurchaseOrder/Insert/InsertPurchaseOrder";
import PurchaseOrderListTable from "./components/PurchaseManagement/PurchaseOrder/Index/PurchaseOrderListTable";
import CommonPurchaseOrderInfo from "./components/PurchaseManagement/PurchaseOrder/Common/CommonPurchaseOrderInfo";
import PurchaseOrderApproveForm from "./components/PurchaseManagement/PurchaseOrder/PurchaseOrderApprove/PurchaseOrderApproveForm";
import InsertGRNInfo from "./components/GoodsReceiveNoteInformation/Insert/InsertGRNInfo";
import GRNInfoTable from "./components/GoodsReceiveNoteInformation/Index/GRNInfoTable";
import InsertProduction from "./components/Production/Insert/InsertProduction";
import ProductionCommonPart from "./components/Production/Common/ProductionCommonPart";
import ProductionListTable from "./components/Production/Index/ProductionListTable";
import PaymentModeDataList from "./components/PaymentModeInformation/Index/PaymentModeDataList";
import InsertPaymentOption from "./components/PaymentModeInformation/Insert/InsertPaymentOption";

import InsertPaymentMethodInformation from "./components/PaymentMethodInformation/Insert/InsertPaymentMethodInformation";
import PaymentMethodSingleEntry from "./components/PaymentMethodInformation/Common/PaymentMethodSingleEntry";
import PaymentReceiveDataTableList from "./components/PaymentMethodInformation/Index/PaymentReceiveDataTable/PaymentReceiveDataTableList";
import PaymentReceiveDataTable from "./components/PaymentMethodInformation/Index/PaymentReceiveDataTable";
import SalesManagementCommonPart from "./components/SalesManagement/ProformaInvoice/Common/SalesManagementCommonPart";
import InvoiceInformationList from "./components/SalesManagement/ProformaInvoice/Index/InvoiceInformationListTable/InvoiceInformationList";
import SpecialDeliveryTableList from "./components/SalesManagement/SpecialDelivery/SpecialDeliveryTable/SpecialDeliveryTableList";
import DelivaryOrderCommonInsertPart from "./components/SalesManagement/DelivaryOrderInformation/Common/DelivaryOrderCommonInsertPart";
import DeliveryOrderList from "./components/SalesManagement/DelivaryOrderInformation/Index/DeliveryOrderListTable/DeliveryOrderList";
import DeliveryOrderApproveList from "./components/SalesManagement/DelivaryOrderInformation/DeliveryOderApproveList/DeliveryOrderApproveList";
import FinishGoodsDeliveryList from "./components/FinishGoodsDelivery/DeliveryListTable/FinishGoodsDeliveryList";
import FinishGoodsDeliveryCommonPart from "./components/FinishGoodsDelivery/Common/FinishGoodsDeliveryCommonPart";

function App() {
  const [singleUserData, setSingleUserData] = useState([]);
  const [changePassword, setChangePassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);

  const getMenulistData = localStorage.getItem("user");

  const menuListData = JSON.parse(getMenulistData);

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
                path="change-password"
                element={
                  <ChangePasswordModal
                    menuListData={menuListData}
                    singleUserData={singleUserData}
                    setSingleUserData={setSingleUserData}
                    resetPassword={resetPassword}
                    changePassword={changePassword}
                  />
                }
              ></Route>
              <Route
                path="/main-view/create-user"
                element={
                  // <RequireAuth>
                  <UserCreation></UserCreation>
                  //  </RequireAuth>
                }
              ></Route>
              <Route
                path="/main-view/user-setting"
                element={
                  // <RequireAuth>
                  <UserDataList
                    setChangePassword={setChangePassword}
                    setResetPassword={setResetPassword}
                    resetPassword={resetPassword}
                    changePassword={changePassword}
                  ></UserDataList>
                  //  </RequireAuth>
                }
              ></Route>

              <Route
                path="user-update/:id"
                element={<SingleUserDisplay></SingleUserDisplay>}
              ></Route>
              <Route
                path="/main-view/create-raw-material-item"
                element={<InsertRmItemInfo></InsertRmItemInfo>}
              ></Route>
              <Route
                path="/main-view/raw-material-item-list"
                element={<RMItemInfoTableData></RMItemInfoTableData>}
              ></Route>
              <Route
                path="update-items-raw-material/:id"
                element={<UpdateRmItemInfo></UpdateRmItemInfo>}
              ></Route>
              {/* <Route path="/main-view/create-raw-material-item" element={<UpdateRmItemInfo></UpdateRmItemInfo>}></Route> */}
              <Route
                path="/main-view/finish-goods-item-list"
                element={<FGItemInfoTableData></FGItemInfoTableData>}
              ></Route>
              <Route
                path="/main-view/craete-finish-goods-item"
                element={<InsertFgItemInfo></InsertFgItemInfo>}
              ></Route>
              <Route
                path="update-finish-goods-items/:id"
                element={<UpdateFgItemInfo></UpdateFgItemInfo>}
              ></Route>

              <Route
                path="/main-view/create-cft-infos"
                element={<InsertCFTInfo></InsertCFTInfo>}
              ></Route>
              <Route
                path="/main-view/cft-info-list"
                element={<CFTInfosTableData></CFTInfosTableData>}
              ></Route>
              <Route
                path="update-cft-info/:id"
                element={<UpdateCFTInfo></UpdateCFTInfo>}
              ></Route>

              <Route
                path="/main-view/create-supplier"
                element={
                  <InsertSupplierInformation></InsertSupplierInformation>
                }
              ></Route>
              <Route
                path="/main-view/supplier-list"
                element={<SupplierInfoTableData></SupplierInfoTableData>}
              ></Route>
              <Route
                path="update-supplier-info/:id"
                element={
                  <InsertSupplierInformation></InsertSupplierInformation>
                }
              ></Route>

              <Route
                path="/main-view/client-list"
                element={<ClientInfoTableData></ClientInfoTableData>}
              ></Route>
              <Route
                path="/main-view/create-client"
                element={<InsertClientInformation></InsertClientInformation>}
              ></Route>
              <Route
                path="update-client-info/:id"
                element={<InsertClientInformation></InsertClientInformation>}
              ></Route>

              <Route
                path="/main-view/po-list"
                element={<PurchaseOrderListTable></PurchaseOrderListTable>}
              ></Route>
              <Route
                path="/main-view/create-po"
                element={<CommonPurchaseOrderInfo></CommonPurchaseOrderInfo>}
              ></Route>
              <Route
                path="update-purchaseinfo/:id"
                element={<CommonPurchaseOrderInfo></CommonPurchaseOrderInfo>}
              ></Route>
              <Route
                path="/main-view/po-approval"
                element={<PurchaseOrderApproveForm></PurchaseOrderApproveForm>}
              ></Route>

              <Route
                path="/main-view/grn-list"
                element={<GRNInfoTable></GRNInfoTable>}
              ></Route>
              <Route
                path="/main-view/create-grn"
                element={<InsertGRNInfo></InsertGRNInfo>}
              ></Route>
              <Route
                path="update-grn-info/:id"
                element={<InsertGRNInfo></InsertGRNInfo>}
              ></Route>

              <Route
                path="create-production"
                element={<ProductionCommonPart></ProductionCommonPart>}
              ></Route>
              <Route
                path="production-list"
                element={<ProductionListTable></ProductionListTable>}
              ></Route>
              <Route
                path="update-production-info/:id"
                element={<ProductionCommonPart></ProductionCommonPart>}
              ></Route>

              <Route
                path="create-payment-mode"
                element={<InsertPaymentOption></InsertPaymentOption>}
              ></Route>
              <Route
                path="payment-list"
                element={<PaymentModeDataList></PaymentModeDataList>}
              ></Route>

              <Route
                path="create-invoice"
                element={
                  <SalesManagementCommonPart></SalesManagementCommonPart>
                }
              ></Route>
              <Route
                path="invoice-list"
                element={<InvoiceInformationList></InvoiceInformationList>}
              ></Route>
              <Route
                path="update-invoice/:id"
                element={
                  <SalesManagementCommonPart></SalesManagementCommonPart>
                }
              ></Route>
              <Route
                path="special-delivery-approve"
                element={<SpecialDeliveryTableList></SpecialDeliveryTableList>}
              ></Route>
              <Route
                path="create-payment-received"
                element={<PaymentMethodSingleEntry></PaymentMethodSingleEntry>}
              ></Route>
              <Route
                path="payment-received-list"
                element={<PaymentReceiveDataTable></PaymentReceiveDataTable>}
              ></Route>

              <Route
                path="update-payment-received/:id"
                element={<PaymentMethodSingleEntry></PaymentMethodSingleEntry>}
              ></Route>

              <Route
                path="create-do"
                element={
                  <DelivaryOrderCommonInsertPart></DelivaryOrderCommonInsertPart>
                }
              ></Route>

              <Route
                path="do-list"
                element={
                  <DeliveryOrderList></DeliveryOrderList>
                }
              ></Route>
              <Route
                path="approve-list"
                element={
                  <DeliveryOrderApproveList></DeliveryOrderApproveList>
                }
              ></Route>
              <Route
                path="list-page"
                element={
                  <FinishGoodsDeliveryList></FinishGoodsDeliveryList>
                }
              ></Route>
              <Route
                path="finish-goods-delivery-order-info/:id"
                element={
                  <FinishGoodsDeliveryCommonPart></FinishGoodsDeliveryCommonPart>
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
                element={<CreateMenu></CreateMenu>}
              ></Route>
              <Route
                path="update-menu/:id"
                element={<UpdateMenu></UpdateMenu>}
              ></Route>

              <Route
                path="menu-list"
                element={<MenuDataList></MenuDataList>}
              ></Route>
              <Route path="*" element={<NotFound></NotFound>}></Route>
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
