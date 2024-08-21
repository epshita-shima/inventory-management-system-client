/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { downloadProductionPDF } from "../../../ReportProperties/HeaderFooter";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import handleProductionExcel from "../../../ReportProperties/handleProductionExcel";
const ProductionTotalModal = ({ totalProduction }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const { data: companyinfo } = useGetCompanyInfoQuery();
  const reportTitle = "PRODUCTION REPORT";
  
  const columns = [
    {
      name: "Sl.",
      selector: (totalProduction, index) => index + 1,
      center: true,
      width: "50px",
    },
    {
      name: "Production Date",
      selector: (totalProduction) => totalProduction?.productionDate,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Batch No",
      selector: (totalProduction) => totalProduction?.batchNo,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Total Batch",
      selector: (totalProduction) => totalProduction?.totalBatch,
      sortable: true,
      center: true,
      filterable: true,
      width: "150px",
    },
    {
      name: "Total Production Qty",
      selector: (totalProduction) => totalProduction?.productionQty,
      sortable: true,
      center: true,
      filterable: true,
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

  const filteredItems = totalProduction?.filter(
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
      <div className="d-block d-sm-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-end align-items-center">
          <div className="table-head-icon d-flex">
            <div class="dropdown">
              <button
                class="btn btn-download dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() => {
                      if (companyinfo?.length !== 0 || undefined) {
                        downloadProductionPDF({ companyinfo }, reportTitle);
                      }
                    }}
                  >
                    PDF
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() => {
                     handleProductionExcel(
                        totalProduction,
                        companyinfo,
                        reportTitle
                      );
                    }}
                  >
                    Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-2 mt-sm-0 ms-2 mb-2 mb-sm-0">
          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
          />
        </div>
      </div>
    );
  }, [
    filterText,
    totalProduction,
    resetPaginationToggle,
    companyinfo,
    reportTitle,
  ]);
  return (
    <>
      <div
        class="modal fade"
        id="productionModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                All User List
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div
                className=" "
                style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}
              >
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
        </div>
      </div>
    </>
  );
};

export default ProductionTotalModal;
