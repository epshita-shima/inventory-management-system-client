import { Modal, Button } from "react-bootstrap";

const ProductionConsumptionModal = ({ show, handleClose, rowData }) => {
  console.log("show", show);
  return (
    <div>
      <div
        class="modal fade"
        id="exampleModalLabelRaw"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabelRaw">
                Production List
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
                style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}
              >
                {/* <DataTable
                  columns={columns}
                  data={filteredItems}
                  defaultSortField="name"
                  customStyles={customStyles}
                  striped
                  pagination
                  subHeader
                  subHeaderComponent={subHeaderComponent}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionConsumptionModal;
