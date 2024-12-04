import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* eslint-disable jsx-a11y/anchor-is-valid */
export const getSalesColumns = ( finishGoodsInfo,itemSizeInfo,itemUnitInformation,permission) => [
  {
    name: "Sl.",
    selector: (row, index) => index + 1,
    center: true,
    width: "60px",
  },

  {
    name: "Item Name",
    selector: (row) => {
      const itemName = finishGoodsInfo?.find((x) => row?.itemId == x._id);
      const itemSize = itemSizeInfo?.find((size) => size._id == itemName?.sizeId);
      return itemName ? `${itemName?.itemName} (${itemSize.sizeInfo})` : "N/A";
    },
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "Unit",
    selector: (row) => {
      const itemName = finishGoodsInfo?.find((x) => row?.itemId == x._id);
      const itemUnit = itemUnitInformation?.find((size) => size._id == itemName?.unitId);
      return itemName ? `${itemUnit?.unitInfo}` : "N/A";
    },
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "Delivered Qty",
    selector: (row) => row.totalSalesQuantity,
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "SalesRate in Avg",
    selector: (row) => Math.round(row.salesRateinAvg),
    sortable: true,
    center: true,
    filterable: true,
  },

  {
    name: "Sales Amount",
    selector: (row) => row.totalSalesAmount,
    sortable: true,
    center: true,
    filterable: true,
  },
  {
    name: "Action",
    button: true,
    width: "100px",
    grow: 2,
    cell: (invoiceDetails) => (
      <div className="d-flex justify-content-between align-content-center">
        {permission?.isPDF ? (
          <a
            target="_blank"
            className={` action-icon `}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Report View"
            style={{
              color: "orange",
              border: "2px solid orange",
              padding: "3px",
              borderRadius: "5px",
            }}
            onClick={() => {
              
              // downloadInvoicePDF(
              //   filterReportData,
              //   finishGoodsItemInfo,
              //   customerInfo,
              //   unitInfo,
              //   itemSizeInfo,
              //   paymentInfo,
              //   base64Logo,
              //   signature,
              //   { companyinfo },
              //   reportTitle
              // );
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