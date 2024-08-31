import React from "react";
import InsertClientInformation from "./../../ClientInformation/Insert/InsertClientInformation";

const InvoiceClientEntryModal = () => {
  return (
    <div
      class="modal fade"
      id="clientInsertInvoiceModalCenter"
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
              Insert Client Information
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => {}}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div
            className="modal-body"
            style={{
              overflowY: "scroll",
              height: "calc(80vh - 120px)",
            }}
          >
            {<InsertClientInformation></InsertClientInformation>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceClientEntryModal;
