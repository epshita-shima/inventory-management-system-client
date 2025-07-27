import React from "react";
import InsertClientInformation from "./../../ClientInformation/Insert/InsertClientInformation";
import './InvoiceClientEntryModal.css'
const InvoiceClientEntryModal = () => {
  return (
    <>
      <div
        className="modal fade"
        id="clientInsertInvoiceModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="commonInsertModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog fullscreen-modal-client-insert" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="commonInsertModalCenterLongTitle">
                Insert Finish Goods Item
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="">{<InsertClientInformation></InsertClientInformation>}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default InvoiceClientEntryModal;
