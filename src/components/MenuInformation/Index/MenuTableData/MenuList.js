/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import { useDeleteMenuDataMutation, useGetAllMenuItemsQuery } from "../../../../redux/features/menus/menuApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faRefresh,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import DataTable from "react-data-table-component";

import './MenuList.css'
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
const MenuList = ({permission}) => {
const [deleteMenu]=useDeleteMenuDataMutation()
const [filterText, setFilterText] = React.useState("");
const [resetPaginationToggle, setResetPaginationToggle] =React.useState(false);
const { data: menuItems, isMenuloading,refetch } = useGetAllMenuItemsQuery(undefined);

  const flattenOptions = (options) => {
    const flattenRecursive = (options, parentLabel) => {
      let result = [];
      options?.forEach((option) => {
        result.push({
          value: option._id,
          label: parentLabel ? `${option.label}` : option.label,
          items: parentLabel ? `${option.items}` : option.items
        });
        if (option.items && option.items.length > 0) {
          result = result.concat(flattenRecursive(option.items, option.label));
        }
      });
      return result;
    };
    return flattenRecursive(options);
  };

  const flattenedOptions = flattenOptions(menuItems);

  const columns = [
    {
      name: "Sl.",
      selector: (flattenedOptions, index) => index + 1,
      center: true,
      width: "60px",
    },
    {
      name: "Menu Name",
      selector: (flattenedOptions) => flattenedOptions?.label,
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Action",
      button: true,
      width: "200px",
      grow: 2,
      cell: (flattenedOptions) => (
        <div className="d-flex justify-content-between align-content-center">
          {permission?.isUpdated ? (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Update menu"
            
              style={{
                color: `${flattenedOptions.items.length==0 ? 'gray' : '#2DDC1B'} `,
                border:`${flattenedOptions.items.length==0 ? '2px solid gray' : '2px solid #2DDC1B'}`,
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                window.open(`update-menu/${flattenedOptions?.value}`);
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
            </a>
          ) : (
            ""
          )}

          {permission?.isRemoved ? (
            <a
              target="_blank"
              className="action-icon "
              data-toggle="tooltip"
              data-placement="bottom"
              title="Delete user"
              style={{
                color: "red",
                border: "2px solid red",
                padding: "3px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              onClick={() => {
                console.log(flattenedOptions?.value)
                swal({
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this data!",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    deleteMenu(flattenedOptions?.value);
                    swal("Poof! Your data has been deleted!", {
                      icon: "success",
                    });
                  } else {
                    swal("Your data is safe!");
                  }
                });
              }}
            >
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
            </a>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  const customStyles = {
    rows: {
      style: {
        textAlign: "center",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#B8FEB3",
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: "0.8px",
      },
    },
    cells: {
      style: {
        borderRight: "1px solid gray",
      },
    },
  };
 
  const filteredItems = flattenedOptions?.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
      <div className="d-flex justify-content-end align-items-center w-100">
    <div className="d-flex justify-content-end align-items-center">
          <div className="table-head-icon d-flex ">
            <div>
              <FontAwesomeIcon
                icon={faRefresh}
                onClick={() => refetch()}
              ></FontAwesomeIcon>{" "}
              &nbsp;
            </div>
       
          </div>
    
        <FilterComponent
          onFilter={(e) => setFilterText(e.target.value)}
          onClear={handleClear}
          filterText={filterText}
        />
      </div>
      </div>
    );
  }, [filterText, resetPaginationToggle,refetch]);

  return (
      <div className="row p-5 mx-4">
        <div
          className="col userlist-table"
          style={{ height: 'calc(90vh - 120px)', overflowY: 'scroll' }}
        >
          <div className="shadow-lg ">
            <DataTable
              columns={columns}
              data={filteredItems}
              defaultSortField="name"
              customStyles={customStyles}
              striped
              pagination
              subHeader
              subHeaderComponent={subHeaderComponent}
            />
          </div>
        </div>
      </div>
  );
};

export default MenuList;
