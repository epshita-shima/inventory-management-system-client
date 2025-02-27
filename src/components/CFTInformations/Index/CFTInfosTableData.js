import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import CFTInfosList from "./CFTInfoTable/CFTInfosList";
import { useGetAllUserQuery } from "../../../redux/features/user/userApi";
import { useNavigate } from "react-router-dom";
import { useGetAllCFTInfosQuery } from "../../../redux/features/cftinformation/cftInfosApi";
import { extractUserMenuListForCurrectMenu } from "../../Uitilites/extractUserMenuListForCurrectMenu";

const CFTInfosTableData = () => {
  const clickhandler = (name) => console.log("delete", name);
  const { data: user, isLoading:isUserloading } = useGetAllUserQuery(undefined);

  const [permission, setPermission] = useState();
  const navigate = useNavigate();

    useEffect(() => {
      if (!isUserloading && user) {
        const permissions = extractUserMenuListForCurrectMenu(
          user,
          "CFT Info List"
        );
        if (permissions) {
          setPermission(permissions);
        } else {
          navigate("/");
        }
      }
    }, [user, navigate, isUserloading]);

  if (isUserloading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn"
          style={{ backgroundColor: "#2DDC1B", color: "white" }}
          type="button"
          disabled
        >
          <span
            className="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Loading cft...
        </button>
      </div>
    );
  }

  return (
    <div>
      <CFTInfosList
        permission={permission}
        click={clickhandler}
      />
      {permission?.isInserted ? (
        <div
          className={`position-absolute`}
          style={{ right: "10%", bottom: "4%", zIndex: "9999" }}
        >
          <div className="">
            <a
              href="/main-view/create-cft-infos"
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

export default CFTInfosTableData;
