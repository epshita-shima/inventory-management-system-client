/* eslint-disable jsx-a11y/anchor-is-valid */
import "../../components/NestedDropdown.css";
import {
  useGetAllUserQuery,
  useUpdateMultipleUserFieldMutation,
} from "../../redux/features/user/userApi";
import { useEffect } from "react";
import { Menubar } from "primereact/menubar";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetAllMenuItemsQuery } from "../../redux/features/menus/menuApi";
import MenuIdCollection from "../../components/Common/MenuIdCollection/MenuIdCollection";
const Home = ({ singleUserData, setChangePassword, setResetPassword }) => {
  const { data: user, refetch } = useGetAllUserQuery(undefined);
  const { data: menus } = useGetAllMenuItemsQuery(undefined);

  const getMenulistData = localStorage?.getItem("user");

  const menuListData = JSON.parse(getMenulistData);

  if (menuListData !== null) {
    var menuListSingleData = menuListData?.menulist;
  }

  const [setAllMenuData] = useUpdateMultipleUserFieldMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.length > 0) {
    } else {
      navigate("/");
    }
  }, [navigate]);

  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(21, 253, 4, 0.3)",
    height: "60px",
  };

  // Define your custom style for the Menubar
  const menubarStyle = {
    backgroundColor: "#EE4E4E",
    borderBottom: "1px solid #ccc",
  };
  const refreshBtnStyle = {
    // backgroundColor: "#0A203F",
    backgroundColor: "#2DDC1B",
    color: "#000",
  };
  // Define the menu items
  const filteredMenuItems = menuListSingleData?.map((menu) => {
    const filterItems = (items) => {
      return items.filter((item) => {
        if (item.items && item.items.length > 0) {
          item.items = filterItems(item.items);
          item.isChecked = item.items.some((child) => child.isChecked);
        }
        return item.isChecked === true;
      });
    };

    const filteredItems = filterItems(menu.items);
    return { ...menu, items: filteredItems };
  });

  const handleClick = () => {
    // setShowComponent(true); // Set showComponent state to true to render MyComponent
    setChangePassword(true);
    setResetPassword(false);
    const url = `/main-view/change-password?reset=false&change=true`;
    window.open(url, "_blank");
  };

  const handleRefreshData = async () => {
    await refetch().then(({ data }) => {
      console.log(data);
      const userData = data?.filter(
        (item) =>
          item?.username === menuListData?.username &&
          item.password === menuListData?.password
      );

      if (userData[0]?.roleId === MenuIdCollection.userrole_supperadmin) {
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

          // Recursively isUpdated properties for child items
          newItem.items = newItem?.items?.map((child) =>
            updateProperties(child)
          );
          return newItem;
        };

        // Update properties for each item in the menulist
        const updatedUserData = userData.map((item) => {
          const updatedMenuList = menus?.map((menu) => updateProperties(menu));
          return { ...item, menulist: updatedMenuList };
        });

        const userObjectData = updatedUserData[0];
        console.log(userObjectData);
        setAllMenuData(updatedUserData);
        localStorage.setItem("user", JSON.stringify(userObjectData));
      } else {
        const userObjectData = userData[0];
        localStorage.setItem("user", JSON.stringify(userObjectData));
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-md d-flex justify-content-between align-items-center"
          style={cardStyle}
        >
          <div class="d-block d-md-none">
            <div className="d-flex justify-content-between align-items-center">
              <div className="position-relative">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-basic"
                    style={{
                      backgroundColor: "#0A203F",
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
                      backgroundColor: "#CBF3F0",
                    }}
                  >
                    <Dropdown>
                      <Dropdown.Toggle
                        // variant="secondary"
                        id="dropdown-basic1"
                        style={{
                          backgroundColor: "#0A203F",
                          color: "white",
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
                          // backgroundColor: "#CBF3F0",
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
                      onClick={() => {
                        localStorage.clear();
                        navigate("/");
                      }}
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
                    // backgroundColor: "#0A203F",
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
                    onClick={() => {
                      localStorage.clear();
                      navigate("/");
                    }}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
