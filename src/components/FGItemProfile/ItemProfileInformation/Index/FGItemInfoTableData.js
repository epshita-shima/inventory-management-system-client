import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import IteminfoList from "./IteminfoTableData/IteminfoList";
import { useNavigate } from "react-router-dom";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/finishgoodsinfoApi";
import { useGetAllUserQuery } from "../../../../redux/features/user/userApi";
import { extractUserMenuListForCurrectMenu } from "../../../Uitilites/extractUserMenuListForCurrectMenu";

const FGItemInfoTableData = () => {
  const clickhandler = (name) => console.log("delete", name);
  const { data: user, isUserloading } = useGetAllUserQuery(undefined);
  const {
    data: finishGoodInItemInfoData,
    isFGItemloading,
    refetch,
  } = useGetAllItemInformationQuery(undefined);
  const [permission, setPermission] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserloading && user) {
      const permissions = extractUserMenuListForCurrectMenu(
        user,
        "Finish Goods Item List"
      );
      if (permissions) {
        setPermission(permissions);
      } else {
        navigate("/");
      }
    }
  }, [user, navigate, isUserloading]);

  return (
    <div>
      <IteminfoList
        permission={permission}
        finishGoodInItemInfoData={finishGoodInItemInfoData}
        isFGItemloading={isFGItemloading}
        click={clickhandler}
        refetch={refetch}
      />
      {permission?.isInserted ? (
        <div
          className={`position-absolute`}
          style={{ right: "20%", bottom: "4%", zIndex: "9999" }}
        >
          <div className="">
            <a
              href="/main-view/craete-finish-goods-item"
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

export default FGItemInfoTableData;
