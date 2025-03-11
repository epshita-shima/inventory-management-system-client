import { Field } from "formik";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const PaymentOptionInBankModal = ({
  id,
  detail,
  show,
  handleClose,
  index,
  bankInfoOptions,
  setFieldValue,
  bankChequeDate,
  setBankChequeDate,
  bankInCheque,
  setFormValues,
  setUpdatePaymentReceiveInformation,
  makebyUser,
}) => {
  return (
    <Modal
      style={{ opacity: show ? 1 : 0 }}
      show={show}
      onHide={handleClose}
      className="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {" "}
          {id
            ? "Update Bank Information For Cash"
            : "Bank Information For Cash"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row row-cols-1 justify-content-center  row-cols-md-2 row-cols-lg-4">
          <div
            className={`col col-md-6  ${
              bankInCheque ? "col-lg-6" : "col-lg-8"
            }`}
          >
            <label
              htmlFor="bankId"
              className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
            >
              Bank Name
            </label>
            <div className="d-flex justify-content-between align-items-center">
            <div className="w-100">
              <Select
                className="w-100"
                aria-label="Default select example"
                name="bankId"
                options={bankInfoOptions}
                defaultValue={{
                  label: "Select Payment Method",
                  value: 0,
                }}
                value={bankInfoOptions?.filter(function (option) {
                  return option.value === detail.bankId;
                })}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    width: "100%",
                    borderColor: state.isFocused ? "#fff" : "#fff",
                    border: "1px solid #2DDC1B",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                    height: "auto"
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
                menuPosition="fixed"
                menuPortalTarget={document.body}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#B8FEB3",
                    primary: "#2DDC1B",
                  },
                })}
                onChange={(e) => {
                  if (id) {
                    setUpdatePaymentReceiveInformation((prev) => {
                      const temp_details = [...prev.detailsData];
                      const newDetail = { ...temp_details[index] };
                      newDetail["bankId"] = e.value;
                      temp_details[index] = newDetail;
                      return {
                        ...prev,
                        detailsData: temp_details,
                        updateBy: makebyUser,
                        updateDate: new Date(),
                      };
                    });
                  } else {
                    setFieldValue(`detailsData.${index}.bankId`, e.value);
                    setFormValues((prev) => {
                      const temp_details = [...prev.detailsData];
                      const newDetail = { ...temp_details[index] };
                      newDetail["bankId"] = e.value;
                      temp_details[index] = newDetail;
                      return {
                        ...prev,
                        detailsData: [...temp_details],
                      };
                    });
                  }
                }}
              ></Select>
            </div>
            <div className="ms-2 mt-2">
              <FontAwesomeIcon
                className="border  align-items-center text-center p-2 fs-3 rounded-5 text-light "
                style={{
                  background: "#2DDC1B",
                }}
                icon={faPlus}
                data-toggle="modal"
                data-target="#commonInsertModalCenter"
                onClick={() => {}}
              />
            </div>
            </div>
          </div>
          {bankInCheque && (
            <div className="col col-md-6 col-lg-6">
              <label
                htmlFor="chequeNo"
                className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
              >
                Cheque Number
              </label>
              <Field
                type="text"
                name={`detailsData.${index}.chequeNo`}
                placeholder="Check Number"
                value={detail.chequeNo}
                style={{
                  border: "1px solid #2DDC1B",
                  padding: "5px",
                  width: "100%",
                  borderRadius: "5px",
                  height: "38px",
                  marginBottom: "5px",
                  textAlign: "center",
                }}
                onChange={(e) => {
                  if (id) {
                    setUpdatePaymentReceiveInformation((prev) => {
                      const temp_details = [...prev.detailsData];
                      const newDetail = { ...temp_details[index] };
                      newDetail["chequeNo"] = e.target.value;
                      temp_details[index] = newDetail;
                      return {
                        ...prev,
                        detailsData: temp_details,
                        updateBy: makebyUser,
                        updateDate: new Date(),
                      };
                    });
                  } else {
                    setFieldValue(
                      `detailsData.${index}.chequeNo`,
                      e.target.value
                    );
                    setFormValues((prev) => {
                      const temp_details = [...prev.detailsData];
                      const newDetail = { ...temp_details[index] };
                      newDetail["chequeNo"] = e.target.value;
                      temp_details[index] = newDetail;
                      return {
                        ...prev,
                        detailsData: [...temp_details],
                      };
                    });
                  }
                }}
              />
            </div>
          )}
          {bankInCheque && (
            <div className="col col-md-6 col-lg-6 mt-3">
              <label
                htmlFor="chequeDate"
                className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
              >
                Cheque Date
              </label>

              <DatePicker
                dateFormat="y-MM-dd"
                className="text-center custom-datepicker "
                value={detail.chequeDate ? detail.chequeDate : bankChequeDate}
                calendarClassName="custom-calendar"
                selected={bankChequeDate}
                required
                onChange={(bankChequeDate) => {
                  if (id) {
                    setUpdatePaymentReceiveInformation((prev) => {
                      const temp_details = [...prev.detailsData];
                      const newDetail = { ...temp_details[index] };
                      newDetail["chequeDate"] =
                        bankChequeDate.toLocaleDateString("en-CA");
                      temp_details[index] = newDetail;
                      return {
                        ...prev,
                        detailsData: temp_details,
                        updateBy: makebyUser,
                        updateDate: new Date(),
                      };
                    });
                  } else {
                    setBankChequeDate(
                      bankChequeDate.toLocaleDateString("en-CA")
                    );
                    setFieldValue(
                      `detailsData.${index}.chequeDate`,
                      bankChequeDate.toLocaleDateString("en-CA")
                    );
                    setFormValues((prev) => {
                      const temp_details = [...prev.detailsData];
                      const newDetail = { ...temp_details[index] };
                      newDetail["chequeDate"] =
                        bankChequeDate.toLocaleDateString("en-CA");
                      temp_details[index] = newDetail;
                      return {
                        ...prev,
                        detailsData: [...temp_details],
                      };
                    });
                  }
                }}
              />
            </div>
          )}
          <div
            className={`col col-md-6  mt-3 ${
              bankInCheque ? "col-lg-6" : "col-lg-8"
            }`}
          >
            <label
              htmlFor="depositeSlipNo"
              className="ml-sm-0 ml-md-0 ml-lg-4 mt-sm-2 mt-md-2 mt-lg-0"
            >
              Deposite Slip No
            </label>

            <Field
              type="text"
              name={`detailsData.${index}.depositeSlipNo`}
              placeholder="Deposite Slip No"
              value={detail.depositeSlipNo}
              style={{
                border: "1px solid #2DDC1B",
                padding: "5px",
                width: "100%",
                borderRadius: "5px",
                height: "38px",
                marginBottom: "5px",
                textAlign: "center",
              }}
              onChange={(e) => {
                if (id) {
                  setUpdatePaymentReceiveInformation((prev) => {
                    const temp_details = [...prev.detailsData];
                    const newDetail = { ...temp_details[index] };
                    newDetail["depositeSlipNo"] = e.target.value;
                    temp_details[index] = newDetail;
                    return {
                      ...prev,
                      detailsData: temp_details,
                      updateBy: makebyUser,
                      updateDate: new Date(),
                    };
                  });
                } else {
                  setFieldValue(
                    `detailsData.${index}.depositeSlipNo`,
                    e.target.value
                  );
                  setFormValues((prev) => {
                    const temp_details = [...prev.detailsData];
                    const newDetail = { ...temp_details[index] };
                    newDetail["depositeSlipNo"] = e.target.value;

                    temp_details[index] = newDetail;
                    return {
                      ...prev,
                      detailsData: [...temp_details],
                    };
                  });
                }
              }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{ backgroundColor: "red", border: "none" }}
          variant="secondary"
          onClick={()=>{
            handleClose()
            setFormValues((prev) => {
              const temp_details = [...prev.detailsData];
              const newDetail = { ...temp_details[index] };
              newDetail["bankId"] ='';
              newDetail["chequeNo"] ='';
              newDetail["chequeDate"] =new Date(bankChequeDate).toLocaleDateString("en-CA");
              newDetail["depositeSlipNo"] ='';
              temp_details[index] = newDetail;
              return {
                ...prev,
                detailsData: [...temp_details],
              };
            });
          }}
        >
          Close
        </Button>
        <Button
          style={{ backgroundColor: "#2DDC1B", border: "none" }}
          variant="primary"
          onClick={handleClose}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentOptionInBankModal;
