import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import PaymentReceiveDataTableList from "./PaymentReceiveDataTable/PaymentReceiveDataTableList";
import { useGetAllUserQuery } from "../../../redux/features/user/userApi";
import { useNavigate } from "react-router-dom";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";
import LoadingSpineer from "../../Common/LoadingSpinner/LoadingSpineer";

const PaymentReceiveDataTable = () => {
  const { data: user, isLoading: isUserloading } =
    useGetAllUserQuery(undefined);

  const [permission, setPermission] = useState();
  const navigate = useNavigate();


  useEffect(() => {
    if (!isUserloading && user) {
      const permissions = extractUserMenuListForCurrectMenu(
        user,
        "Payment Received List"
      );
      if (permissions) {
        setPermission(permissions);
      } else {
        navigate("/");
      }
    }
  }, [user, navigate, isUserloading]);

  // if (isUserloading) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center">
  //       <button
  //         className="btn"
  //         style={{ backgroundColor: "#2DDC1B", color: "white" }}
  //         type="button"
  //         disabled
  //       >
  //         <span
  //           className="spinner-grow spinner-grow-sm"
  //           role="status"
  //           aria-hidden="true"
  //         ></span>
  //         Loading...
  //       </button>
  //     </div>
  //   );
  // }
  return (
    <div>
      {/* <LoadingSpineer isLoading={isUserloading}></LoadingSpineer> */}
      <div className={`${isUserloading ? "d-none" : "d-block"}`}>
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
