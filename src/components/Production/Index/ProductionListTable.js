import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ProductionInfoList from "./ProductionInfoTable/ProductionInfoList";
import { useNavigate } from "react-router-dom";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";

const ProductionListTable = () => {
  const [permission, setPermission] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.length > 0) {
      const permissions = extractUserMenuListForCurrectMenu("Production List");
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);


  return (
    <div className="d-block">
      <ProductionInfoList permission={permission}></ProductionInfoList>
      {permission?.isInserted ? (
        <div
          className={`position-absolute`}
          style={{ right: "10%", bottom: "4%", zIndex: "9999" }}
        >
          <div className="">
            <a
              href="/main-view/create-production"
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
  );
};

export default ProductionListTable;
