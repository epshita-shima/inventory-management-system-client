import React from "react";
import InsertSupplierInformation from "./../../SupplierProfile/Insert/InsertSupplierInformation";
import InsertRmItemInfo from "./../../RMItemProfile/ItemProfileInformation/Insert/InsertRmItemInfo";
import InsertPaymentOption from "../../PaymentModeInformation/Insert/InsertPaymentOption";
import InsertBankInformation from "../../PurchaseManagement/BankInformation/Insert/InsertBankInformation";
import './SupplierInsertModal.css'

const SupplierInsertModal = ({
  activeSupplierModal,
  setActiveSupplierModal,
  activeItemInfoModal,
  setActiveItemInfoModal,
  acivePaymentModal,
  setAcivePaymentModal,
  aciveBankInfoModal,
  setAciveBankInfoModal
}) => {

  return (
    <div
      class="modal fade"
      id="commonInsertModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="commonInsertModalCenterTitle"
      aria-hidden="true"
      style={{ overflow: "hidden" }}
    >
      <div
        class="modal-dialog modal-dialog-centered  modal-lg  modal-xl"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 className="modal-title" id="commonInsertModalCenterLongTitle">
              {activeSupplierModal && "Insert Supplier Information"}
              {activeItemInfoModal && "Insert Raw Material Item Information"}
              {acivePaymentModal && "Insert Payment Information"}
              {aciveBankInfoModal&& "Insert Bank Information"}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                if (activeSupplierModal) {
                  setActiveSupplierModal(false);
                } else if (activeItemInfoModal) {
                  setActiveItemInfoModal(false);
                }
                else if(acivePaymentModal){
                  setAcivePaymentModal(false);
                }
                else if(aciveBankInfoModal){
                  setAciveBankInfoModal(false)
                }
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" style={{
        overflowY: "scroll",
        height: "calc(80vh - 120px)",
      }}>
            {activeSupplierModal ? (
              <InsertSupplierInformation></InsertSupplierInformation>
            ) : (
              ""
            )}
            {activeItemInfoModal ? <InsertRmItemInfo></InsertRmItemInfo> : ""}
            {
              acivePaymentModal ? <InsertPaymentOption></InsertPaymentOption> :''
            }
            {aciveBankInfoModal ? <InsertBankInformation></InsertBankInformation>
              
            :''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierInsertModal;
