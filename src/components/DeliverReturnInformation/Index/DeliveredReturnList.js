import React, { useEffect, useState } from "react";
import DeliveredReturnListData from "./DeliveredReturnListData";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";

const DeliveredReturnList = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const permissions = extractUserMenuListForCurrectMenu("List Information");
    if (permissions) {
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>

      <div>
        <DeliveredReturnListData
          permission={permission}
        ></DeliveredReturnListData>
        {permission?.isInserted && (
          <div
            className={`position-absolute`}
            style={{ right: "15%", bottom: "4%", zIndex: "9999" }}
          >
            <div className="">
              <a
                href="/main-view/create-return-information"
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
        )}
      </div>
    </div>
  );
};

export default DeliveredReturnList;
