import { Field } from "formik";
import React from "react";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";
import { useGetAllInvoiceInformationQuery } from "../../../redux/features/invoiceinformation/invoiceinfoApi";

const InsertFinishGoodsDelivery = ({
  values,
  deliveryOrderInformation,
  setFieldValue,
  touched,
  errors,
}) => {
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);
  const { data: invoiceInformation } =
    useGetAllInvoiceInformationQuery(undefined);
  const clientInfo = clientInformation?.find(
    (client) => client._id === deliveryOrderInformation?.clientId
  );
  const invoiceInfo = invoiceInformation?.find(
    (invoice) => invoice._id === deliveryOrderInformation?.piId
  );
  
  return (
    <div className="row row-cols-1 row-cols-lg-3">
      <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
        <label htmlFor="paymentId">Client Name</label>
        <br />
        <Field
          type="text"
          name={`clientId`}
          placeholder="Client Name"
          disabled
          value={clientInfo?.clientName}
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
        />
      </div>
      <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
        <label htmlFor="paymentId">PI Number</label>
        <br />
        <Field
          type="text"
          name={`piNumber`}
          placeholder="PI Number"
          value={invoiceInfo?.invoiceNo}
          disabled
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
        />
      </div>
      <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
        <label htmlFor="paymentId">DO Number</label>
        <br />
        <Field
          type="text"
          name={`doNo`}
          placeholder="DO Number"
          disabled
          value={deliveryOrderInformation?.doNo}
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
        />
      </div>
      <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
        <label htmlFor="paymentId">Driver Name</label>
        <br />
        <Field
          type="text"
          name={`diverName`}
          placeholder="Diver Name"
          value={values.diverName}
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
          onChange={(e) => {
            setFieldValue("driverName", e.target.value);
          }}
        />
      </div>
      <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
        <label htmlFor="driverContactNo">Driver Contact No</label>
        <br />
        <Field
          type="number"
          name={`driverContactNo`}
          placeholder="Diver Contact No"
          value={values.driverContactNo}
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
          onChange={(e) => {
            setFieldValue("driverContactNo", e.target.value);
          }}
        />
        <br />
        {touched.driverContactNo && errors.driverContactNo && (
          <div className="text-danger">{errors.driverContactNo}</div>
        )}
      </div>
      <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
        <label htmlFor="truckNo">Truck Number</label>
        <br />
        <Field
          type="text"
          name={`truckNo`}
          placeholder="Truck Number"
          value={values.truckNo}
          style={{
            border: "1px solid #2DDC1B",
            padding: "5px",
            width: "100%",
            borderRadius: "5px",
            textAlign: "center",
            height: "38px",
          }}
          onChange={(e) => {
            setFieldValue("truckNo", e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default InsertFinishGoodsDelivery;
