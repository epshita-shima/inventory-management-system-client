import React from "react";

const PaymentOptionInBankModal = () => {
  return (
    <>
      <div
        class="modal fade"
        id="bankPaymentOptionModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Select Bank Payment Option
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
              <div
                className=""
                // style={{ height: "calc(90vh - 120px)", overflowY: "scroll" }}
              >
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="optionsRadios"
                    id="option1"
                    value="option1"
                    checked
                  />
                  <label class="form-check-label" for="option1">
                    Option 1
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="optionsRadios"
                    id="option2"
                    value="option2"
                  />
                  <label class="form-check-label" for="option2">
                    Option 2
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentOptionInBankModal;
