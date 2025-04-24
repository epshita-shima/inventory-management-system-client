/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";

import DataTable from "react-data-table-component";
import "./ConsumptionDataTable.css"
const ConsumptionDataTable = ({ consumptionData, rawMaterialList }) => {
  // const columns = [
  //   {
  //        name:"Sl.",
  //     selector: (row, index) => index + 1,
  //     center: true,
  //     width: "60px",
  //   },

  //   {
  //     name: "PurchaseDate Date",
  //     selector: (row) => new Date(row.purchaseDate).toLocaleDateString("en-CA"),
  //     sortable: true,
  //     center: true,
  //     filterable: true,
  //   },
  //   {
  //     name: "Item Name",
  //     selector: (row) => {
  //       const itemName = rawMaterialList?.find(
  //         (x) => row?.itemId === x._id
  //       );

  //       return itemName ? itemName?.itemName : "N/A";
  //     },
  //     sortable: true,
  //     center: true,
  //     filterable: true,
  //   },

  //   {
  //     name: "Rate",
  //     selector: (row) => row.rate,
  //     sortable: true,
  //     center: true,
  //     filterable: true,
  //   },
  //   {
  //     name: "Amount",
  //     selector: (row) => row.amount,
  //     sortable: true,
  //     center: true,
  //     filterable: true,
  //   },
  // ];
  
  const columns = [
    { name: 'Date', selector: row => row.date, width: '8%' ,center:true},
  
    // Opening Balance
    // { name: '', selector: row => row.opening.item, width: '6%',center:true },
    { name: '', selector: row => <div>{row.opening.quantity === 0 ? '--' : row.opening.quantity}</div>, width: '8%',center:true },
    { name: '', selector: row => <div>{row.opening.rate === 0 ? '--' : row.opening.rate}</div>, width: '6.89%',center:true },
    { name: '', selector: row => <div>{row.opening.amount === 0 ? '--' : row.opening.amount}</div>, width: '8%',center:true },
  
    // Purchase
    // { name: '', selector: row => row.purchase.item, width: '5%',center:true },
    { name: '', selector: row => <div>{row.purchase.quantity === 0 ? '--' : row.purchase.quantity}</div>, width: '8%',center:true },
    { name: '', selector: row => <div>{row.purchase.rate === 0 ? '--' : row.purchase.rate}</div>, width: '6.7%',center:true },
    { name: '', selector: row => <div>{row.purchase.amount === 0 ? '--' : row.purchase.amount}</div>, width: '8%',center:true },
  
    // Issue
    // { name: '', selector: row => row.issue.item, width: '5%',center:true },
    { name: '', selector: row => <div>{row.issue.quantity === 0 ? '--' : row.issue.quantity}</div>, width: '8%',center:true },
    { name: '', selector: row => <div>{row.issue.rate === 0 ? '--' : row.issue.rate}</div>, width: '6.88%',center:true },
    { name: '', selector: row => <div>{row.issue.amount === 0 ? '--' : row.issue.amount}</div>, width: '8%',center:true },
  
    // Closing
    // { name: '', selector: row => row.closing.item, width: '5%',center:true },
    { name: '', selector: row => <div>{row.closing.quantity === 0 ? '--' : row.closing.quantity}</div>, width: '8%',center:true },
    { name: '', selector: row => <div>{row.closing.rate === 0 ? '--' : row.closing.rate}</div>, width: '6.8%',center:true },
    { name: '', selector: row => <div>{row.closing.amount === 0 ? '--' : row.closing.amount}</div>, width: '8%',center:true },
  ];



  

  // const customStyles = {
  //   rows: {
  //     style: {
  //       textAlign: "center",
  //     },
  //   },
  //   headCells: {
  //     style: {
  //       backgroundColor: "#B8FEB3",
  //       color: "#000",
  //       fontWeight: "bold",
  //       textAlign: "center",
  //       letterSpacing: "0.8px",
  //     },
  //   },
  //   cells: {
  //     style: {
  //       borderRight: "1px solid gray",
  //     },
  //   },
  //   headRow: {
  //     style: {
  //       paddingTop: "0px",
  //     },
  //   },
  //   header: {
  //     style: {
  //       marginTop: "8px",
  //     },
  //   },
  // };

  // const subHeaderComponent = useMemo(() => {
  //   return (
  //     <div className="d-block d-sm-flex justify-content-between align-items-center mb-2">
  //       {consumptionData?.length > 0 && (
  //         <div className="d-flex justify-content-end align-items-center">
  //           <div className="table-head-icon d-flex">
  //             <div className="dropdown">
  //               <button
  //                 className="btn btn-download dropdown-toggle"
  //                 type="button"
  //                 id="dropdownMenuButton1"
  //                 data-bs-toggle="dropdown"
  //                 aria-expanded="false"
  //               >
  //                 Download
  //               </button>
  //               <ul
  //                 className="dropdown-menu"
  //                 aria-labelledby="dropdownMenuButton1"
  //               >
  //                 <li>
  //                   <a
  //                     className="dropdown-item"
  //                     href="#"
  //                     onClick={() => {
  //                       // if (companyinfo?.length !== 0 || undefined) {
  //                       //   downloadProductionDatewiseSummaryPDF(
  //                       //     { companyinfo },
  //                       //     reportTitle
  //                       //   );
  //                       // }
  //                     }}
  //                   >
  //                     PDF
  //                   </a>
  //                 </li>
  //                 <li>
  //                   <a
  //                     className="dropdown-item"
  //                     href="#"
  //                     onClick={() => {
  //                       // handleProductionDatewiseSummaryExcel(
  //                       //   filteredDatas,
  //                       //   rawMaterialList,
  //                       //   itemSizeInfo,
  //                       //   itemUnitInformation,
  //                       //   companyinfo,
  //                       //   reportTitle
  //                       // );
  //                     }}
  //                   >
  //                     Excel
  //                   </a>
  //                 </li>
  //               </ul>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }, [consumptionData?.length]);
  const customStyles = {
    rows: {
      style: {
        border: '1px solid #dee2e6', // Bootstrap border color
      },
    },
    cells: {
      style: {
        border: '1px solid #dee2e6',
        padding: '8px',
      },
    },
    headRow: {
      style: {
        display: 'none', // Hide default header since we're using subHeaderComponent
      },
    },
  };
  
  const subHeaderComponent = useMemo(() => {
    return (
      <div className="w-100 mt-4">
        {/* First Row: Main Group Headers */}
        <div className="d-flex bg-light fw-bold" style={{ borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
          <div className="d-flex align-items-center justify-content-center border-start border-end" style={{ width: '8%', height: '40px' }}>
            Date
          </div>
          {['Opening Balance', 'Purchase', 'Issue', 'Closing'].map((title, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-center border-end border-start"
              style={{ width: '22.5%', height: '40px' }}
            >
              {title}
            </div>
          ))}
        </div>
  
        {/* Second Row: Sub-Headers */}
        <div className="d-flex bg-light text-muted" style={{ borderBottom: '1px solid #ccc' }}>
          <div style={{ width: '8%' }}></div> {/* Placeholder under Date */}
  
          {/* 4 Groups × 4 sub-headers */}
          {Array(4).fill().map((_, groupIndex) => (
            <div
              key={groupIndex}
              className="d-flex justify-content-between align-items-center border-start border-end"
              style={{ width: '22.5%', padding: '0 5px',height:'50px' }}
            >
              {/* <div className="text-center" style={{ width: '25%' }}>Item</div> */}
              <div className="text-center" style={{ width: '25%' }}>Quantity</div>
              <div className="text-center" style={{ width: '25%' }}>Rate</div>
              <div className="text-center" style={{ width: '25%' }}>Amount</div>
            </div>
          ))}
        </div>
      </div>
    );
  }, []);
  

  return (
    <div>
        <div className="overflow-y-hidden" style={{overflowY:'hidden'}}>
            <DataTable
              columns={columns}
              data={consumptionData}
              customStyles={customStyles}
              subHeaderComponent={subHeaderComponent}
              persistTableHead
              noHeader
              striped
              pagination
              subHeader
              defaultSortField="name"
              fixedHeader={true}
              fixedHeaderScrollHeight={`calc(50vh - 120px)`}
            />
        </div>
    </div>
  );
};

export default ConsumptionDataTable;
