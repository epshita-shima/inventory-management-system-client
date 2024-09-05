import { Field } from "formik";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const PaymentOptionInBankModal = ({
  detail,
  show,
  handleClose,
  index,
  bankInfoOptions,
  setFieldValue,
  bankChequeDate,
  setBankChequeDate,
  bankInCheque
}) => {
  return (
    <Modal
      style={{ opacity: show ? 1 : 0 }}
      show={show}
      onHide={handleClose}
      className="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Bank Information For Cash</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div class="table-responsive">
          <table className="table table-bordered">
            <thead className="w-100">
              <tr>
                <th
                  className="bg-white text-center  align-items-center"
                  style={{ width: "25%" }}
                >
                  Bank Name
                </th>
                {
                  bankInCheque &&  <th
                  className="bg-white text-center  align-items-center"
                  style={{ width: "25%" }}
                >
                  Check No
                </th>
                }
                {
                  bankInCheque && <th
                  className="bg-white text-center  align-items-center"
                  style={{ width: "25%" }}
                >
                  Check Date
                </th>
                }
               
                
                <th
                  className="bg-white text-center  align-items-center "
                  style={{ width: "25%" }}
                >
                  Deposite Slip No
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="text-center  align-middle">
                  <Select
                    className="w-100"
                    aria-label="Default select example"
                    name="sizeinfo"
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
                        height: "auto",
                        // overflowY: "scroll",
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
                      // swal({
                      //   title: "Sorry!",
                      //   text: "This Client has no PI.",
                      //   icon: "warning",
                      //   button: "OK",
                      // });

                      setFieldValue(`detailsData.${index}.bankId`, e.value);
                    }}
                  ></Select>
                  <br />
             
                </td>
                {
                  bankInCheque &&  <td className="text-center  align-items-center">
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
                      setFieldValue(
                        `detailsData.${index}.chequeNo`,
                        e.target.value
                      );
                    }}
                  />
                </td>
                }
               
             {
              bankInCheque &&    <td className="text-center  align-items-center">
              <DatePicker
                dateFormat="y-MM-dd"
                className="text-center custom-datepicker "
                value={detail.chequeDate? detail.chequeDate : bankChequeDate }
                calendarClassName="custom-calendar"
                selected={bankChequeDate}
                required
                onChange={(bankChequeDate) => {
                  setBankChequeDate(
                    bankChequeDate.toLocaleDateString("en-CA")
                  );
                  setFieldValue(
                    `detailsData.${index}.chequeDate`,
                    bankChequeDate.toLocaleDateString("en-CA")
                  );
                }}
              />
             
            </td>
             }
                <td className="text-center  align-items-center">
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
                      setFieldValue(
                        `detailsData.${index}.depositeSlipNo`,
                        e.target.value
                      );
                    }}
                  />
               
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentOptionInBankModal;
