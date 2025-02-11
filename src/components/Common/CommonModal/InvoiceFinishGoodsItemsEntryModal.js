import React from "react";
import InsertFgItemInfo from "./../../FGItemProfile/ItemProfileInformation/Insert/InsertFgItemInfo";
import "./InvoiceFinishGoodsItemsEntryModal.css";
const InvoiceFinishGoodsItemsEntryModal = () => {
  return (
    <>
      <div
        class="modal fade"
        id="finishGoodsInsertInvoiceModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="commonInsertModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog fullscreen-modal-insertItem" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="commonInsertModalCenterLongTitle">
                Insert Finish Goods Item
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div className="">{<InsertFgItemInfo></InsertFgItemInfo>}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default InvoiceFinishGoodsItemsEntryModal;
