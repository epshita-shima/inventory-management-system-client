/* eslint-disable jsx-a11y/anchor-is-valid */

import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import ProductionConsumptionDetailsModal from "./ProductionConsumptionDetailsModal";
import { useLazyGetRawMaterialDetailsConsumptionReportQuery } from "../../../../redux/features/productionreport/productionreportApi";
import { formatDate } from "../../../Uitilites/DateUtilities";
import { downloadRawMaterailProductionConsumptionDetailsPDFItemwisSummary } from "../../../ReportProperties/PDF/handleItemwiseProsuctionConsumption";

const ProductionConsumptionModal = ({
  productionSingleItemId,
  itemUnitInfo,
  productionItemDetailsData,
  rawMaterialItem,
  companyinfo,
}) => {
  console.log(productionItemDetailsData);
  const [showProductionDetailsModal, setShowProductionDetailsModal] =
    useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const itemNames = rawMaterialItem?.find(
    (item) => item._id === productionSingleItemId
  );
  const unitInfo = itemUnitInfo?.find((item) => item._id === itemNames?.unitId);
  const reportTitleForSingle = `Itemwise Production Consumption of ${itemNames?.itemName}(${unitInfo.unitInfo})`;

  const [
    triggerProductionDetailsReport,
    { data: productionSingleItemDetailsData },
  ] = useLazyGetRawMaterialDetailsConsumptionReportQuery();

  const groupData = (filteredData) => {
    const result = filteredData?.reduce((acc, row) => {
      row.detailsData.forEach((detail) => {
        const key = `${row.productionDate}-${detail.itemId}`;
        if (!acc[key]) {
          acc[key] = {
            productionDate: row.productionDate,
            totalProductionConsumption: 0,
            itemId: detail.itemId,
          };
        }
        acc[key].totalProductionConsumption += detail.materialUsed;
      });
      return acc;
    }, {});
    return Object.values(result);
  };

  const grandTotalProductionConsumption = groupData(
    productionItemDetailsData
  )?.reduce(
    (sum, detail) => sum + parseFloat(detail.totalProductionConsumption) || 0,
    0
  );

  const handleRowClickForProductionDetails = async (rowData) => {
    await triggerProductionDetailsReport({
      itemId: rowData.itemId,
    });
    setSelectedRow(rowData);
    setShowProductionDetailsModal(true);
  };

  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },

    {
      name: "Production Date",
      sortable: true,
      center: true,
      filterable: true,
      cell: (row) => (
        <div
          className="card-body"
          data-toggle="modal"
          data-target="#exampleModalLabelProductionConsumptionDetails"
          onClick={() => handleRowClickForProductionDetails(row)}
        >
          <a href="#" className="text-success fw-bold">
            {new Date(row.productionDate).toLocaleDateString("en-CA")}
          </a>
        </div>
      ),
    },

    {
      name: "Production Consumption",
      selector: (row) => row.totalProductionConsumption,
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
    headRow: {
      style: {
        paddingTop: "0px",
      },
    },
    header: {
      style: {
        marginTop: "8px",
      },
    },
  };

  const subHeaderComponent = useMemo(() => {
    return (
      <div className="d-block d-sm-flex justify-content-between align-items-center mb-2">
        {productionItemDetailsData?.length > 0 && (
          <div className="d-flex justify-content-end align-items-center">
            <div className="table-head-icon d-flex">
              <div className="dropdown">
                <button
                  className="btn btn-download dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Download
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        if (companyinfo?.length !== 0 || undefined) {
                          downloadRawMaterailProductionConsumptionDetailsPDFItemwisSummary(
                            { companyinfo },
                            reportTitleForSingle
                          );
                        }
                      }}
                    >
                      PDF
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [companyinfo, productionItemDetailsData?.length, reportTitleForSingle]);

  return (
    <div>
      <div
        className="modal fade"
        id="exampleModalLabelRaw"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg fullscreen-modal" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabelRaw">
                {`Itemwise Production Consumption ${itemNames?.itemName} (${unitInfo?.unitInfo})`}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body w-100">
              <div>
                <DataTable
                  columns={columns}
                  data={groupData(productionItemDetailsData)}
                  defaultSortField="name"
                  customStyles={customStyles}
                  striped
                  pagination
                  subHeader
                  subHeaderComponent={subHeaderComponent}
                  fixedHeader={true}
                  fixedHeaderScrollHeight="calc(85vh - 120px)"
                />
              </div>

              <table
                id="my-raw-material-consumption-details-table-itemwise-summary"
                className="d-none"
              >
                <thead>
                  <tr>
                    <th>Production Date</th>
                    <th>Production Consumption</th>
                  </tr>
                </thead>
                <tbody>
                  {groupData(productionItemDetailsData).map((item, index) => {
                    const formattedDate = formatDate(item.productionDate);

                    return (
                      <>
                        <tr key={index}>
                          <td>{formattedDate}</td>
                          <td>{item.totalProductionConsumption}</td>
                        </tr>
                      </>
                    );
                  })}
                  {/* Grand Total Row */}
                  <tr>
                    <td
                      colSpan={1}
                      style={{
                        textAlign: "right",
                        fontWeight: "bold",
                        padding: "8px",
                        border: "1px solid black",
                      }}
                    >
                      Grand Total
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        border: "1px solid black",
                      }}
                    >
                      {grandTotalProductionConsumption.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showProductionDetailsModal && (
        <ProductionConsumptionDetailsModal
          rawMaterialItem={rawMaterialItem}
          companyinfo={companyinfo}
          itemUnitInfo={itemUnitInfo}
          selectedRow={selectedRow}
          productionSingleItemDetailsData={productionSingleItemDetailsData}
        ></ProductionConsumptionDetailsModal>
      )}
    </div>
  );
};

export default ProductionConsumptionModal;
