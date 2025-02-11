/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { downloadHeadingProductionPDF, downloadProductionPDFPERBatch } from "../../../ReportProperties/PDF/HeaderFooter";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import handleProductionExcel from "../../../ReportProperties/Excel/handleProductionExcel";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/finishgoodsinfoApi";
import { useGetAllRMItemInformationQuery } from "../../../../redux/features/iteminformation/rmItemInfoApi";
const ProductionTotalModal = ({ totalProduction,permission}) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const { data: companyinfo } = useGetCompanyInfoQuery();
  const reportTitle = "PRODUCTION REPORT";
  const {data:finishGoods}=useGetAllItemInformationQuery(undefined);
  const {data:rawItemInfo}=useGetAllRMItemInformationQuery(undefined);
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
    {
      name: "Action",
      button: true,
      width: "120px",
      grow: 2,
      cell: (filteredData) => (
        <div className="d-flex justify-content-between align-content-center">
          {permission?.isPDF ? (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Update item"
              style={{
                color: `${
                  filteredData?.detailsData?.length === 0 ? "gray" : "orange"
                } `,
                border: `${
                  filteredData?.detailsData?.length === 0
                    ? "2px solid gray"
                    : "2px solid orange"
                }`,
                padding: "3px",
                borderRadius: "5px",
              }}
              onClick={() => {
                downloadProductionPDFPERBatch(
                  filteredData,
                  finishGoods,
                  rawItemInfo,
                  { companyinfo },
                  reportTitle
                );
              }}
            >
              <FontAwesomeIcon icon={faFilePdf}></FontAwesomeIcon>
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
      <>
      {
        totalProduction?.length > 0 && (<div className="d-block d-sm-flex justify-content-between align-items-center mb-2">
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
                          downloadHeadingProductionPDF(totalProduction,{ companyinfo }, reportTitle);
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
                          finishGoods,
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
        </div>)
  }</>
      
    );
  }, [
    finishGoods,
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
               Production List
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
