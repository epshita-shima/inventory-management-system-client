/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";

import DataTable from "react-data-table-component";
const ConsumptionDataTable = ({consumptionData, rawMaterialList}) => {
  const columns = [
    {
         name: (
        <div>
          <div>SL</div>
          <div style={{ fontSize: "12px", color: "gray" }}>Sub Sl</div>
        </div>
      ),
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },

    {
      name: "PurchaseDate Date",
      selector: (row) => new Date(row.purchaseDate).toLocaleDateString("en-CA"),
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Item Name",
      selector: (row) => {
        const itemName = rawMaterialList?.find(
          (x) => row?.itemId === x._id
        );

        return itemName ? itemName?.itemName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Rate",
      selector: (row) => row.rate,
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
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
        {consumptionData?.length > 0 && (
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
                        // if (companyinfo?.length !== 0 || undefined) {
                        //   downloadProductionDatewiseSummaryPDF(
                        //     { companyinfo },
                        //     reportTitle
                        //   );
                        // }
                      }}
                    >
                      PDF
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        // handleProductionDatewiseSummaryExcel(
                        //   filteredDatas,
                        //   rawMaterialList,
                        //   itemSizeInfo,
                        //   itemUnitInformation,
                        //   companyinfo,
                        //   reportTitle
                        // );
                      }}
                    >
                      Excel
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [consumptionData?.length]);

  return (
    <div>
      {consumptionData && (
        <div
          className=" "
          style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}
        >
          <DataTable
            // title={
            //   <h2
            //     style={{
            //       fontSize: "24px",
            //       fontWeight: "bold",
            //       color: "#000",
            //     }}
            //   >
               
            //   </h2>
            // }
            subHeaderComponent={subHeaderComponent}
            columns={columns}
            data={consumptionData}
            defaultSortField="name"
            customStyles={customStyles}
            striped
            pagination
            subHeader
          />

          <table id="my-production-datewise-summary-table" className="d-none">
            <thead>
              <tr>
                <th>Production Date</th>
                <th>Item Name</th>
                <th>Unit</th>
                <th>Production Qty</th>
              </tr>
            </thead>
            {/* <tbody>
            {filteredDatas?.map((detail, detailIndex) => {
              const itemNames = rawMaterialList?.find(
                (item) => item._id === detail.productionItemName
              );
              const itemSize = itemSizeInfo.find(
                (size) => size._id === itemNames?.sizeId
              );

              const itemUnit = itemUnitInformation.find(
                (size) => size._id === itemNames?.unitId
              );

              const formattedDate = formatDate(detail.date);
              
              return (
                <tr key={detail._id}>
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      {formattedDate}
                    </td>
                  <td>{`${itemNames.itemName} (${itemSize.sizeInfo})`}</td>
                  <td>{itemUnit?.unitInfo}</td>
                  <td>{detail.totalProductionQty.toLocaleString()}</td>
                </tr>
              );
            })}

            <tr>
              <td
                colSpan={3}
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
                {grandTotalProductionQuantity != null
              ? grandTotalProductionQuantity?.toLocaleString()
              : 0}
              </td>
            </tr>
          </tbody> */}
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsumptionDataTable;
