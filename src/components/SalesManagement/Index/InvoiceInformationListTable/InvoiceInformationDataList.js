/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from 'react'
import swal from "sweetalert";
import DataTable from "react-data-table-component";
import { useDeleteInvoiceInfoMutation, useGetAllInvoiceInformationQuery } from '../../../../redux/features/invoiceinformation/invoiceinfoApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons';
import FilterComponent from '../../../Common/ListDataSearchBoxDesign/FilterComponent';
import { useGetAllClientInformationQuery } from '../../../../redux/features/clientinformation/clientInfoApi';
import InvoiceListHeading from '../../../Common/ListHeading/InvoiceListHeading';
const InvoiceInformationDataList = ({permission}) => {

    const [filterText, setFilterText] = React.useState("");
    const [resetPaginationToggle, setResetPaginationToggle] =
      React.useState(false);
    const { data: invoiceData, refetch } =
      useGetAllInvoiceInformationQuery(undefined);
      const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
    const [deleteInvoice] = useDeleteInvoiceInfoMutation();
    const [totalApprovedPi, setTotalApprovePi] = useState([]);
    const [totalUnApprovePi, setTotalUnApprovePi] = useState([]);
    const [totalApprovePiAmount, setTotalApprovePiAmount] = useState(0);
    const [totalUnApprovePiAmount, setTotalUnApprovePiAmount] = useState(0);

    useEffect(() => {
      const filterApprovePi = invoiceData?.filter((x) => x.isApproved === true);
      const filterUnApprovePi = invoiceData?.filter(
        (x) => x.isApproved === false
      );
      console.log(filterUnApprovePi);
      const totalApprovedAmount = invoiceData
        ?.filter((invoice) => invoice?.isApproved === true)
        .reduce((total, invoice) => {
          return (
            total +
            invoice.detailsData.reduce(
              (subTotal, item) => subTotal + item.totalAmount,
              0
            )
          );
        }, 0);
  
      const totalUnapprovedAmount = invoiceData
        ?.filter((invoice) => invoice?.isApproved === false)
        .reduce((total, invoice) => {
          return (
            total +
            invoice.detailsData.reduce(
              (subTotal, item) => subTotal + item.totalAmount,
              0
            )
          );
        }, 0);
  
      setTotalApprovePi(filterApprovePi);
      setTotalUnApprovePi(filterUnApprovePi);
      setTotalApprovePiAmount(totalApprovedAmount);
      setTotalUnApprovePiAmount(totalUnapprovedAmount);
    }, [invoiceData]);
  
    const columns = [
      {
        name: "Sl.",
        selector: (invoiceData, index) => index + 1,
        center: true,
        width: "60px",
      },
      {
        name: "Pi Date",
        selector: (invoiceData) =>new Date(invoiceData?.piDate).toLocaleDateString("en-CA") ,
        sortable: true,
        center: true,
        filterable: true,
      },
      {
        name: "Invoice No",
        selector: (invoiceData) => invoiceData?.invoiceNo,
        sortable: true,
        center: true,
        filterable: true,
      },
      {
        name: "Client Name",
        selector: (invoiceData) => {
          const customerName = customerInfo?.find(
            (x) => x._id === invoiceData?.customerID
          );
          return customerName ? customerName.clientName : "N/A"; // Assuming 'sizeName' is the field that contains the size name
        },
        sortable: true,
        center: true,
        filterable: true,
      },
      {
        name: "Total Quantity",
        selector: (invoiceData) => {
          const totalQuantity = invoiceData.detailsData
            .reduce(
              (acc, cur) => acc + parseInt(cur.quantity, 10),
              0
            );
          return totalQuantity;
        },
        sortable: true,
        center: true,
        filterable: true,
      },
      {
        name: "Total Amount",
        selector: (invoiceData) =>  {
          const totalAmount = invoiceData.detailsData
            .reduce(
              (acc, cur) => acc + parseInt(cur.totalAmount, 10),
              0
            );
          return totalAmount;
        },
        sortable: true,
        center: true,
        filterable: true,
      },
  
      {
        name: "Action",
        button: true,
        width: "150px",
        grow: 2,
        cell: (invoiceData) => (
          <div className="d-flex justify-content-between align-content-center">
            {permission?.isUpdated ? (
              <a
                target="_blank"
                className={` action-icon `}
                data-toggle="tooltip"
                data-placement="bottom"
                title="Update menu"
                style={{
                  color: "#2DDC1B",
                  border: "2px solid #2DDC1B",
                  padding: "3px",
                  borderRadius: "5px",
                  marginLeft: "10px",
                }}
                onClick={() => {
                  window.open(`update-invoice/${invoiceData?._id}`);
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
                  console.log(invoiceData?.value);
                  swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this data!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  }).then((willDelete) => {
                    if (willDelete) {
                      deleteInvoice(invoiceData?._id);
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
  
    const filteredItems = invoiceData?.filter(
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
    }, [filterText, resetPaginationToggle, refetch]);
  
    return (
      <div className="row px-5 mx-4"
      style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        <InvoiceListHeading 
       totalApprovedPi={totalApprovedPi?.length}
       totalUnApprovePi={totalUnApprovePi?.length}
       totalApprovePiAmount={totalApprovePiAmount}
       totalUnApprovePiAmount={totalUnApprovePiAmount}
       permission={permission}
       ></InvoiceListHeading> 
       <div
         className="col userlist-table mt-sm-4 mt-md-4 mt-lg-0 podata-main-view"
       >
          <div className="shadow-lg">
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
}

export default InvoiceInformationDataList
