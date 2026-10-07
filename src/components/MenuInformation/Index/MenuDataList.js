import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import MenuList from "./MenuTableData/MenuList";
import { useNavigate } from "react-router-dom";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";

const MenuDataList = () => {
  const clickhandler = (name) => console.log("delete", name);

  const [permission, setPermission] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.length > 0) {
      const permissions = extractUserMenuListForCurrectMenu("Menu List");
      setPermission(permissions);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <div>
        <MenuList permission={permission} click={clickhandler} />
        {permission?.isInserted && (
          <div
            className={`position-absolute`}
            style={{ right: "20%", bottom: "4%", zIndex: "9999" }}
          >
            <div className="">
              <a
                href="/main-view/create-menu"
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

export default MenuDataList;
