import React from 'react'

const PurchaseQuantityDetailsModal = () => {
  return (
    <div>
      <div
        class="modal fade"
        id="exampleModalLabelPurchaseRaw"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg fullscreen-modal" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabelPurchaseRaw">
                {`Production OF `}
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
            <div class="modal-body w-100">
              <div
                // style={{ height: "calc(65vh - 120px)", width:'100%',overflowY: "scroll" }}
              >
               {/* <DataTable
                  columns={columns}
                  data={transformedProductionData}
                  defaultSortField="name"
                  customStyles={customStyles}
                  striped
                  pagination
                  subHeader
                  subHeaderComponent={subHeaderComponent}
                />  */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseQuantityDetailsModal
