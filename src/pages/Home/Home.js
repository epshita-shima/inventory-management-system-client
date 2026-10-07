/* eslint-disable jsx-a11y/anchor-is-valid */
import "../../components/NestedDropdown.css";
import {
  useLazyGetCurrentUserQuery,
  useUpdateMultipleUserFieldMutation,
} from "../../redux/features/user/userApi";
import { sanitizeUserForStorage } from "../../components/Uitilites/extractUserMenuListForCurrectMenu";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Menubar } from "primereact/menubar";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetAllMenuItemsQuery } from "../../redux/features/menus/menuApi";
import MenuIdCollection from "../../components/Common/MenuIdCollection/MenuIdCollection";

import swal from "sweetalert";
import { useUserLoggedOutMutation } from "../../redux/features/auth/authApi";
import LoadingSpineer from "../../components/Common/LoadingSpinner/LoadingSpineer";
import { api } from "../../redux/api/apiSlice";

const Home = ({ singleUserData, setChangePassword, setResetPassword }) => {
  const [fetchCurrentUser] = useLazyGetCurrentUserQuery();
  const { data: menus,isLoading:menuLoading } = useGetAllMenuItemsQuery(undefined);

  const getMenulistData = localStorage?.getItem("user");

  const menuListData = JSON.parse(getMenulistData);
  const [loggedoutUser] = useUserLoggedOutMutation();
  const [setAllMenuData] = useUpdateMultipleUserFieldMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardRoute =
    location.pathname === "/main-view" || location.pathname === "/main-view/";
  if (menuListData !== null) {
    var menuListSingleData = menuListData?.menulist;
  }

  console.log(menuListData)
  const menuSort= menus?.length >0 && [...menus]?.sort((a,b)=>a.order - b.order)
  console.log(menuSort)

  useEffect(() => {
    const hasSession =
      localStorage.getItem("user") && localStorage.getItem("accesstoken");
    if (!hasSession) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(21, 253, 4, 0.3)",
    height: "60px",
    position: "relative",
    zIndex: 3000,
    overflow: "visible",
  };

  // Define your custom style for the Menubar
  const menubarStyle = {
    backgroundColor: "#EE4E4E",
    borderBottom: "1px solid #ccc",
  };
  const refreshBtnStyle = {
    backgroundColor: "#2DDC1B",
    color: "#000",
  };
  const PARENT_MENU_ORDER = [
    "Dashboard",
    "Setting",
    "Master Entry",
    "Purchase",
    "Production",
    "Sales",
    "Report",
  ];

  const parentMenuOrderIndex = (label = "") => {
    const index = PARENT_MENU_ORDER.findIndex(
      (name) => label === name || label.startsWith(name)
    );
    return index === -1 ? PARENT_MENU_ORDER.length : index;
  };

  const byExistingOrderField = (a, b) => {
    const orderA = parseFloat(a?.order ?? a?.orderNo);
    const orderB = parseFloat(b?.order ?? b?.orderNo);
    const hasA = !Number.isNaN(orderA);
    const hasB = !Number.isNaN(orderB);
    if (hasA && hasB && orderA !== orderB) {
      return orderA - orderB;
    }
    if (hasA && !hasB) {
      return -1;
    }
    if (!hasA && hasB) {
      return 1;
    }
    return 0;
  };

  const omitEmptySubmenus = (item) => {
    if (!item?.items?.length) {
      const { items, ...rest } = item;
      return rest;
    }
    return {
      ...item,
      items: item.items.map(omitEmptySubmenus),
    };
  };

  // Define the menu items
  const filteredMenuItems = menuListSingleData
    ?.map((menu) => {
      const filterItems = (items) => {
        return items
          .filter((item) => {
            if (item.items && item.items.length > 0) {
              item.items = filterItems(item.items);
              item.isChecked = item.items.some((child) => child.isChecked);
            }
            return item.isChecked === true;
          })
          .sort(byExistingOrderField);
      };

      return omitEmptySubmenus({
        ...menu,
        items: filterItems(menu.items || []),
      });
    })
    ?.sort((a, b) => {
      const orderA = parentMenuOrderIndex(a.label);
      const orderB = parentMenuOrderIndex(b.label);
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return byExistingOrderField(a, b);
    });

  const handleLogout = async () => {
    try {
      await loggedoutUser();
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(api.util.resetApiState());
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/");
    }
  };

  const handleClick = () => {
    // setShowComponent(true); // Set showComponent state to true to render MyComponent
    setChangePassword(true);
    setResetPassword(false);
    const url = `/main-view/change-password?reset=false&change=true`;
    window.open(url, "_blank");
  };

  const handleRefreshData = async () => {
    try {
      const currentUser = await fetchCurrentUser().unwrap();
      if (!currentUser) {
        swal("Sorry!", "Unable to refresh user information", "warning");
        return;
      }

      if (currentUser.roleId === MenuIdCollection.userrole_supperadmin) {
        const updateProperties = (item) => {
          const newItem = {
            ...item,
            id: item._id,
            isChecked: true,
            isInserted: true,
            isUpdated: true,
            isRemoved: true,
            isPDF: true,
          };

          newItem.items = newItem?.items?.map((child) =>
            updateProperties(child)
          );
          return newItem;
        };

        const updatedMenuList = menus?.map((menu) => updateProperties(menu));
        const userObjectData = sanitizeUserForStorage({
          ...currentUser,
          menulist: updatedMenuList,
        });
        setAllMenuData([userObjectData]);
        localStorage.setItem("user", JSON.stringify(userObjectData));
      } else {
        const userObjectData = sanitizeUserForStorage(currentUser);
        localStorage.setItem("user", JSON.stringify(userObjectData));
      }
    } catch (error) {
      swal(
        "Sorry!",
        error?.data?.message || "Unable to refresh user information",
        "warning"
      );
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-md d-flex justify-content-between align-items-center"
          style={cardStyle}
        >
          <div className="d-block d-md-none">
            <div className="d-flex justify-content-between align-items-center">
              <div className="position-relative">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-basic"
                    style={{
                      backgroundColor: "#2DDC1B",
                      color: "white",
                      border: "none",
                      outline: "none",
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} className="fs-3">
                      {" "}
                    </FontAwesomeIcon>
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    style={{
                      overflowY: "auto",
                      height: "150px",
                      width: "250px",
                      backgroundColor: "#B8FEB3",
                    }}
                  >
                    <Dropdown>
                      <Dropdown.Toggle
                        // variant="secondary"
                        id="dropdown-basic1"
                        style={{
                          backgroundColor: "#2DDC1B",
                          color: "black",
                          border: "none",
                          outline: "none",
                          height: "28px",
                        }}
                      >
                        Menus
                      </Dropdown.Toggle>

                      <Dropdown.Menu
                        style={{
                          overflowY: "auto",
                          height: "150px",
                          backgroundColor: "#2DDC1B",
                        }}
                      >
                        <Dropdown.Item
                          onClick={handleRefreshData}
                          style={{ fontWeight: "bold" }}
                        >
                          <FontAwesomeIcon icon={faRefresh} className="me-2" />
                          Refresh Data
                        </Dropdown.Item>
                        <Menubar
                          model={filteredMenuItems}
                          style={menubarStyle}
                        />
                      </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown.Item
                      href="#"
                      onClick={handleClick}
                      style={{ fontWeight: "bold" }}
                    >
                      Change Password
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#"
                      style={{ fontWeight: "bold" }}
                      onClick={handleLogout}
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <span className="d-none d-md-block">
                {menuListData !== null
                  ? `Hello, ${menuListData?.firstname} ${menuListData?.lastname}`
                  : ""}
              </span>
            </div>
          </div>

          <div className="d-none d-md-flex justify-content-between align-items-center w-100">
            <div className="d-flex justify-content-between align-items-center ">
              <button
                className="btn"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Menu Refresh"
                style={refreshBtnStyle} // Limit button width
                onClick={handleRefreshData}
              >
                <FontAwesomeIcon
                  icon={faRefresh}
                  className="fs-3"
                ></FontAwesomeIcon>
              </button>

              <Menubar model={filteredMenuItems} style={menubarStyle} />
            </div>
            <div>
              <Dropdown>
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-basic"
                  style={{
                    backgroundColor: "#2DDC1B",
                    color: "black",
                    border: "none",
                    outline: "none",
                  }}
                >
                  {menuListData !== null
                    ? `Hello, ${menuListData?.firstname} ${menuListData?.lastname}`
                    : ""}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#" onClick={handleClick}>
                    Change Password
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="#"
                    onClick={handleLogout}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
      <LoadingSpineer isLoading={menuLoading && !isDashboardRoute}></LoadingSpineer>
    </div>
  );
};

export default Home;
