import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import IteminfoList from '../../../FGItemProfile/ItemProfileInformation/Index/IteminfoTableData/IteminfoList';
import { useNavigate } from 'react-router-dom';
import { useGetAllUserQuery } from '../../../../redux/features/user/userApi';
import { useGetAllRMItemInformationQuery } from '../../../../redux/features/iteminformation/rmItemInfoApi';
import RMItemInfoList from './ItemInfoTableData/RMItemInfoList';
import { extractUserMenuListForCurrectMenu } from '../../../Uitilites/extractUserMenuListForCurrectMenu';

const RMItemInfoTableData = () => {
    const clickhandler = (name) => console.log("delete", name);
    const { data: user, isUserloading } = useGetAllUserQuery(undefined);
   
    const [permission, setPermission] = useState();
    const navigate = useNavigate();

console.log(permission)
    useEffect(() => {
    if(!isUserloading && user){
      const permissions = extractUserMenuListForCurrectMenu(user, "Raw Material Item List");
      console.log(permissions)
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
            class="btn"
            style={{ backgroundColor: "#2DDC1B", color: "white" }}
            type="button"
            disabled
          >
            <span
              class="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        </div>
      );
    }
    
    return (
      <div>
        <RMItemInfoList
          permission={permission}
          click={clickhandler}
        />
        {permission?.isInserted && (
          <div
            className={`position-absolute`}
            style={{ right: "10%", bottom: "4%", zIndex: "9999" }}
          >
            <div className="">
              <a
                href="/main-view/create-raw-material-item"
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
}

export default RMItemInfoTableData
