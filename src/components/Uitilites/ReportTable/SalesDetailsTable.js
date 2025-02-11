import React from "react";

const SalesDetailsTable = ({
  groupedData,
  formatDate,
  piInformation,
  finishGoodsItemInfo,
  itemSizeInfo,
  itemUnitInformation,
  clientInformation,
  grandTotalDeliverQty,
  grandTotalDeliverAmount,
}) => {
  
  return (
    <table id="my-deliver-details-table" className="d-none">
      <thead>
        <tr>
          <th>Deliver Date</th>
          <th>Client Name</th>
          <th>PI Number</th>
          <th>Item Name</th>
          <th>Unit</th>
          <th>Currency</th>
          <th>Deliver Qty</th>
          <th>Avarage Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {groupedData &&
        typeof groupedData === "object" &&
        Object.keys(groupedData).length > 0 ? (
          Object.keys(groupedData)?.map((key) => {
            const group = groupedData[key];
            const formattedDate = formatDate(group.finishGoodsDeliveryDate);
            const rowSpan = group?.detailsData.length;

            const piNumber = piInformation.find(
              (pi) => pi._id === group.piId
            );

            const dateWiseTotalQuantity = group.detailsData.reduce(
              (cur, acc) => cur + acc.deliverQty,
              0
            );

            const dateWiseTotalAmount = group.detailsData.reduce(
              (total, detail) => {
                const item = piNumber.detailsData.find(
                  (item) => item.itemId === detail.itemId
                );
                const itemTotal = detail.deliverQty * (item?.unitPrice || 0);
                return total + itemTotal;
              },
              0
            );

            return (
              <>
                {group?.detailsData.map((detail, detailIndex) => {
                  const itemNames = finishGoodsItemInfo?.find(
                    (item) => item._id === detail.itemId
                  );

                  const itemSize = itemSizeInfo.find(
                    (size) => size._id === itemNames.sizeId
                  );
                  const itemUnit = itemUnitInformation?.find(
                    (unit) => unit._id === itemNames.unitId
                  );

                  const unitPrice = piNumber?.detailsData.find(
                    (item) => item.itemId == detail.itemId
                  );

                  const clientName = clientInformation
                    ?.filter((client) => client._id === group.clientId)
                    .map((filteredItem) => filteredItem.clientName)
                    .join(", ");

                  const currency = piInformation
                    ?.filter((piItem) => piItem._id === group.piId)
                    .map((filteredItem) => filteredItem.currency)
                    .join(",");

                  const calCulateAmount =
                    unitPrice.unitPrice * detail.deliverQty;

                  const calculateAvgPrice =
                    calCulateAmount / detail.deliverQty;

                  return (
                    <tr key={detail._id}>
                      {detailIndex === 0 && (
                        <td
                          rowSpan={rowSpan}
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          {formattedDate}
                        </td>
                      )}
                      {detailIndex === 0 && (
                        <td
                          rowSpan={rowSpan}
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          {clientName}
                        </td>
                      )}
                      {detailIndex === 0 && (
                        <td
                          rowSpan={rowSpan}
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          {piNumber.invoiceNo}
                        </td>
                      )}

                      <td>{`${itemNames.itemName} (${itemSize.sizeInfo})`}</td>
                      <td>{`${itemUnit?.unitInfo}`}</td>

                      <td>{currency}</td>
                      <td>{detail.deliverQty.toLocaleString()}</td>
                      <td>{calculateAvgPrice.toLocaleString()}</td>
                      <td>{calCulateAmount.toLocaleString()}</td>
                    </tr>
                  );
                })}

                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      padding: "8px",
                      border: "1px solid black",
                    }}
                  >
                    Datewise Total
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid black",
                    }}
                  >
                    {dateWiseTotalQuantity.toLocaleString()}
                  </td>
                  <td></td>
                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid black",
                    }}
                  >
                    {dateWiseTotalAmount.toLocaleString()}
                  </td>
                </tr>
              </>
            );
          })
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: "center" }}>
              No data available
            </td>
          </tr>
        )}

        <tr>
          <td
            colSpan={6}
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
            {grandTotalDeliverQty != null
              ? grandTotalDeliverQty.toLocaleString()
              : 0}
          </td>
          <td></td>
          <td
            style={{
              textAlign: "center",
              verticalAlign: "middle",
              border: "1px solid black",
            }}
          >
            {grandTotalDeliverAmount != null
              ? grandTotalDeliverAmount.toLocaleString()
              : 0}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default SalesDetailsTable;


