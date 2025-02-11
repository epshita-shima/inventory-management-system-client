/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import {
  useDeleteReturnDeliveredInformationMutation,
  useGetAllReturnDeliveredInformationQuery,
} from "../../../redux/features/returndeliveredinformation/returndeliveredApi";
import DataTable from "react-data-table-component";
import swal from "sweetalert";
import FilterComponent from "../../Common/ListDataSearchBoxDesign/FilterComponent";
import { useGetAllInvoiceInformationQuery } from "../../../redux/features/invoiceinformation/invoiceinfoApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useGetAllDelieryOrderInformationAfterDeliverQuery } from "../../../redux/features/deliveryorderinformation/deliveryinfoApi";
import { useGetCompanyInfoQuery } from "../../../redux/features/companyinfo/compayApi";
import { useGetAllClientInformationQuery } from "../../../redux/features/clientinformation/clientInfoApi";
import { downloadReturnDeliveredPDF } from "../../ReportProperties/PDF/HeaderFooter";
import { useGetAllItemInformationQuery } from "../../../redux/features/iteminformation/finishgoodsinfoApi";
import { useGetAllItemSizeQuery } from "../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetAllItemUnitQuery } from "../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import {
  useGetAllFinishGoodsDeliveryInformationQuery
} from "../../../redux/features/finishgoodsdeliveryinfo/finishgoodsdeliveryApi";

const DeliveredReturnListData = ({ permission }) => {
  const reportTitle = "Sales Return Report";
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const { data: deliveredReturnInformationData, refetch,isFetching:isReturnDataFetching } =
    useGetAllReturnDeliveredInformationQuery(undefined);
  const { data: deliverOrderInformation } =
    useGetAllDelieryOrderInformationAfterDeliverQuery(undefined);
  const { data: finishGoodsDeliveryInfo } =
    useGetAllFinishGoodsDeliveryInformationQuery(undefined);
  const { data: invoiceInformation } =
    useGetAllInvoiceInformationQuery(undefined);
  const { data: companyInformation } = useGetCompanyInfoQuery(undefined);
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);
  const [deleteReturnDeliveredInfo] =
    useDeleteReturnDeliveredInformationMutation();

  const { data: finishGoodsInfo } = useGetAllItemInformationQuery(undefined);
  const { data: itemsizeinfo } = useGetAllItemSizeQuery(undefined);
  const { data: itemUnitInformation } = useGetAllItemUnitQuery(undefined);
  const transformedDOData = deliveredReturnInformationData?.flatMap(
    (itemDetails) =>
      itemDetails.detailsData.map((detail) => ({
        ...itemDetails,
        detailsData: detail,
      }))
  );


  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => index + 1,
      center: true,
      width: "60px",
    },

    {
      name: "PI Number",
      selector: (row) => {
        const piNumber = invoiceInformation?.find((x) => x._id === row?.piId);
        return piNumber ? piNumber.invoiceNo : "N/A"; // Assuming 'sizeName' is the field that contains the size name
      },
      sortable: true,
      center: true,
      filterable: true,
    },

    {
      name: "Transfer From",
      selector: (row) => {
        const transferFrom = clientInformation?.find(
          (x) => x._id === row?.transferFromClientId
        );

        return transferFrom ? transferFrom.clientName : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
    },
    {
      name: "Transfer To",
      selector: (row) => {
        const transferTo = companyInformation?.find(
          (x) => x._id === row?.transferToCompanyId
        );
        return transferTo ? transferTo.companyName : "N/A";
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
      cell: (row) => (
        <div className="d-flex justify-content-between align-content-center">
          {permission?.isPDF && (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="PDF Item"
              style={{
                color: "orange",
                border: "2px solid orange",
                padding: "3px",
                borderRadius: "5px",
              }}
              onClick={() => {
                downloadReturnDeliveredPDF(
                  row,
                  transformedDOData,
                  deliverOrderInformation,
                  clientInformation,
                  finishGoodsInfo,
                  itemsizeinfo,
                  itemUnitInformation,
                  companyInformation,
                  reportTitle
                );
              }}
            >
              <FontAwesomeIcon icon={faFilePdf}></FontAwesomeIcon>
            </a>
          )}
          {permission?.isRemoved && (
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
                swal({
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this data!",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then(async (willDelete) => {
                  if (willDelete) {
                    await deleteReturnDeliveredInfo(row?._id);
                      swal("Your data has been deleted!", {
                        icon: "success",
                      });
                      refetch();
                    // }
                  } else {
                    swal("Your data is safe!");
                  }
                });
              }}
            >
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
            </a>
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

  const filteredItems = deliveredReturnInformationData?.filter(
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
      <div className="d-block d-sm-flex justify-content-between align-items-center mb-2 pe-4">
        {
          deliveredReturnInformationData?.length ===0 ? '' : (<div className="mt-2 mt-sm-0 ms-2 mb-2 mb-sm-0">
            <FilterComponent
              onFilter={(e) => setFilterText(e.target.value)}
              onClear={handleClear}
              filterText={filterText}
            />
          </div>)
        }
      </div>
    );
  }, [filterText, resetPaginationToggle,deliveredReturnInformationData]);

  return (
    <div
      className="row px-5 mx-4"
      style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
      <div className="col mt-sm-4 mt-md-4 mt-lg-0">
        <div className="shadow-lg">
          <DataTable
            title={
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#000",
                  padding: "10px",
                }}
              >
                Sales Return List
              </h2>
            }
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

export default DeliveredReturnListData;
