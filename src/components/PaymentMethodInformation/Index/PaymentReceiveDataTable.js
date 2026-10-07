import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import PaymentReceiveDataTableList from "./PaymentReceiveDataTable/PaymentReceiveDataTableList";
import { useNavigate } from "react-router-dom";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";

const PaymentReceiveDataTable = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    const permissions = extractUserMenuListForCurrectMenu("Payment Received List");
    if (permissions) {
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);


  return (
    <div>
      <div className="d-block">
        <PaymentReceiveDataTableList
          permission={permission}
        ></PaymentReceiveDataTableList>
        {permission?.isInserted ? (
          <div
            className={`position-absolute`}
            style={{ right: "15%", bottom: "4%", zIndex: "9999" }}
          >
            <div className="">
              <a
                href="/main-view/create-payment-received"
                target="_blank"
                className="text-white text-center d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: "#2DDC1B",
                  height: "40px",
                  width: "40px",
                  borderRadius: "50px",
                }}
              >
                <FontAwesomeIcon
                  className="text-white fs-4"
                  icon={faPlus}
                ></FontAwesomeIcon>
              </a>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default PaymentReceiveDataTable;
