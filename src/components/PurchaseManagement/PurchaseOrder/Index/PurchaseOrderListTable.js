import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import PurchaseOderList from "./PurchaseOderInfoTable/PurchaseOderList";
import { useNavigate } from "react-router-dom";
import { extractUserMenuListForCurrectMenu } from "../../../Uitilites/extractUserMenuListForCurrectMenu";

const PurchaseOrderListTable = () => {
  const clickhandler = (name) => console.log("delete", name);

  const [permission, setPermission] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const permissions = extractUserMenuListForCurrectMenu("PO List");
    if (permissions) {
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);



  return (
    <div>
      <PurchaseOderList
        permission={permission}
        click={clickhandler}
      ></PurchaseOderList>
      {permission?.isInserted && (
        <div
          className={`position-absolute`}
          style={{ right: "15%", bottom: "4%", zIndex: "9999" }}
        >
          <div className="">
            <a
              href="/main-view/create-po"
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
  );
};

export default PurchaseOrderListTable;
