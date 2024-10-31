/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import swal from "sweetalert";
import DataTable from "react-data-table-component";
import FilterComponent from "../../../Common/ListDataSearchBoxDesign/FilterComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { useLazyGetFilteredPaymentReceiveInfoQuery } from "../../../../redux/features/paymentreceiveinfo/paymentreceiveApi";
import { useGetAllClientInformationQuery } from "../../../../redux/features/clientinformation/clientInfoApi";
import { useGetAllInvoiceInformationQuery } from "../../../../redux/features/invoiceinformation/invoiceinfoApi";
import { useGetAllItemInformationQuery } from "../../../../redux/features/iteminformation/iteminfoApi";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import {
  clientInfoDropdown,
  invoiceListDropdown,
} from "../../../Common/CommonDropdown/CommonDropdown";
import {
  downloadPaymentReceivedAllSelectedPIPDF,
  downloadPaymentReceivedPDF,
} from "../../../ReportProperties/HeaderFooter";
import { useGetCompanyInfoQuery } from "../../../../redux/features/companyinfo/compayApi";
import { useGetAllBankInformationQuery } from "../../../../redux/features/bankinformation/bankInfoAPi";
import handelPaymentReceiveExcel from "../../../ReportProperties/handelPaymentReceiveExcel";

const PaymentReceiveDataTableList = ({ permission }) => {
  const reportTitle = "PAYMENT RECEIVE INFORMATION";
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const { data: customerInfo } = useGetAllClientInformationQuery(undefined);
  const { data: invoiceData } = useGetAllInvoiceInformationQuery(undefined);
  const { data: finishGoods } = useGetAllItemInformationQuery(undefined);
  const { data: itemsizeinfo } = useGetAllItemSizeQuery(undefined);
  const { data: companyinfo } = useGetCompanyInfoQuery(undefined);
  const { data: bankInformation } = useGetAllBankInformationQuery(undefined);
  const [clientId, setClientId] = useState("");
  const [piNumber, setPiNumber] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [executeQuery, setExecuteQuery] = useState(false);
  const [isTableDispaly, setIsTableDisplay] = useState(false);
  const [filters, setFilters] = useState({
    clientId: clientId,
    piNumber: piNumber,
  });
  const [isFetchAfterDeleteData, setIsFetchAfterDeleteData] = useState(false);
  const [filterInvoiceList, setFilterInvoiceList] = useState([]);
  const { data: clientInformation } =
    useGetAllClientInformationQuery(undefined);

  const piInfoOptions = invoiceListDropdown(filterInvoiceList);
  const clientInfoOptions = clientInfoDropdown(clientInformation);
  const [trigger, { data: filteredDatas }] =
    useLazyGetFilteredPaymentReceiveInfoQuery();

  useEffect(() => {
    if (executeQuery) {
      setIsTableDisplay(true);
      trigger(filters);
      setExecuteQuery(false);
    }
  }, [executeQuery, trigger, filters]);

  useEffect(() => {
    const piFilteredData = invoiceData?.filter(
      (pi) => pi.paymentId === "667d2b983e37e91c4e1f3a1f"
    );
    setFilterInvoiceList(piFilteredData);
  }, [invoiceData]);

  useEffect(() => {
    if (filteredDatas && filteredDatas.length === 0) {
      setIsTableDisplay(false);
      swal({
        title: "Sorry!",
        text: "No data found for the selected filters",
        icon: "warning",
        button: "OK",
      });
    } else {
      setFilteredData(filteredDatas || []);
    }
  }, [filteredDatas]);

  useEffect(() => {
    if (isFetchAfterDeleteData) {
      handleApplyFilters();
      setIsFetchAfterDeleteData(false);
    }
  }, [isFetchAfterDeleteData]);

  const handleApplyFilters = async () => {
    setExecuteQuery(true);
  };

  const groupByClient = (data) => {
    const groupedDataMap = new Map();
    data?.forEach((payment) => {
      payment.detailsData.forEach((detail) => {
        const key = `${payment.clientId}_${payment.piNumber}_${detail.itemId}`;

        if (groupedDataMap.has(key)) {
          const existingEntry = groupedDataMap.get(key);
          existingEntry.amount += detail.amount;
          existingEntry.quantity += detail.quantity;
        } else {
          groupedDataMap.set(key, {
            ...payment,
            detail: {
              ...detail,
            },
            isGroup: false,
          });
        }
      });
    });

    const groupedData = Array.from(groupedDataMap.values());
    return groupedData;
  };

  const groupDataByPINumber = (filteredData) => {
    return filteredData?.reduce((acc, row) => {
      const key = `${row.piNumber}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(row);
      return acc;
    }, {});
  };

  const groupedData = groupDataByPINumber(filteredData);

  const calculateTotalCashQuantity = (data) => {
    let totalCashQuantity = 0;
    Object.values(data).forEach((invoiceArray) => {
      invoiceArray.forEach((invoice) => {
        invoice.detailsData.forEach((item) => {
          if (item.paymentStatus === "cash") {
            totalCashQuantity += item.quantity;
          }
        });
      });
    });

    return totalCashQuantity;
  };
  const calculateTotalCashAmount = (data) => {
    let totalCashAmount = 0;
    Object.values(data).forEach((invoiceArray) => {
      invoiceArray.forEach((invoice) => {
        invoice.detailsData.forEach((item) => {
          if (item.paymentStatus === "cash") {
            totalCashAmount += item.amount;
          }
        });
      });
    });

    return totalCashAmount;
  };
  const calculateTotalAdjustQuantity = (data) => {
    let totalAdjustQuantity = 0;
    Object.values(data).forEach((invoiceArray) => {
      invoiceArray.forEach((invoice) => {
        invoice.detailsData.forEach((item) => {
          if (item.paymentStatus === "adjustment") {
            totalAdjustQuantity += item.quantity;
          }
        });
      });
    });
    return totalAdjustQuantity;
  };
  const calculateTotalAdjustAmount = (data) => {
    let totalAdjustAmount = 0;
    Object.values(data).forEach((invoiceArray) => {
      invoiceArray.forEach((invoice) => {
        invoice.detailsData.forEach((item) => {
          if (item.paymentStatus === "adjustment") {
            totalAdjustAmount += item.quantity;
          }
        });
      });
    });
    return totalAdjustAmount;
  };

  const grandTotalCashAmount = calculateTotalCashAmount(groupedData);
  const grandTotalCashQuantity = calculateTotalCashQuantity(groupedData);
  const grandTotalAdjustQuantity = calculateTotalAdjustQuantity(groupedData);
  const grandTotalAdjustAmount = calculateTotalAdjustAmount(groupedData);
  const grandTotalNetQuantity =
    grandTotalCashQuantity - grandTotalAdjustQuantity;
  const grandTotalNetAmount = grandTotalCashAmount - grandTotalAdjustAmount;

  const groupItemsByNameAndSize = (detailsData) => {
    return detailsData.reduce((acc, curr) => {
      const itemKey = `${curr.itemId}-${curr.sizeId}`;
      if (!acc[itemKey]) {
        acc[itemKey] = {
          ...curr,
          quantity: curr.quantity,
          amount: curr.amount,
        };
      } else {
        // Sum quantities and amounts for repeated items
        acc[itemKey].quantity += curr.quantity;
        acc[itemKey].amount += curr.amount;
      }
      return acc;
    }, {});
  };

  const getFilteredMatchedItemsForCalculation = (filteredDatas, row) => {
    return filteredDatas
      ?.map((data) => {
        if (data.piNumber === row.piNumber && data.clientId === row.clientId) {
          const filteredData = data?.detailsData.filter(
            (item) => item.itemId === row.detail.itemId
          );
          return filteredData.length > 0 ? filteredData : null;
        }
        return null;
      })
      .filter(Boolean);
  };
  const columns = [
    {
      name: "Sl.",
      selector: (row, index) => (row.isGroup ? null : index + 1),
      center: true,
      width: "60px",
    },
    {
      name: "Client Name",
      selector: (row) => {
        const customerName = customerInfo?.find((x) => x._id === row?.clientId);
        return customerName ? customerName.clientName : "N/A"; // Default to "N/A" if not found
      },
      sortable: true,
      center: true,
      width: "250px",
    },
    {
      name: "PI Number",
      selector: (row) => {
        const invoiceNo = invoiceData?.find((x) => x._id === row?.piNumber);
        return invoiceNo ? invoiceNo?.invoiceNo : "N/A"; // Default to "N/A" if not found
      },
      sortable: true,
      center: true,
      width: "200px",
    },

    {
      name: "Item Name",
      selector: (row) => {
        const itemCode = finishGoods?.find((x) => row.detail.itemId === x._id);
        const itemSize = itemsizeinfo?.find(
          (size) => size._id === itemCode?.sizeId
        );
        return itemCode
          ? itemCode.itemName + " " + `(${itemSize?.sizeInfo})`
          : "N/A";
      },
      sortable: true,
      center: true,
      width: "250px",
    },
    {
      name: "Currency",
      selector: (row) => {
        const currency = invoiceData?.find(
          (x) => x._id === row?.piNumber
        );
        return currency ? currency.currency : "N/A";
      },
      sortable: true,
      center: true,
      filterable: true,
      width: "180px",
    },
    {
      name: "PI Quantity",
      selector: (row) => {
        if (row.isGroup) {
          return null;
        }
        const filterPIData = invoiceData?.find(
          (x) => x._id === row?.piNumber
        );
        const findPiQuantityPerItem = filterPIData?.detailsData.find(
          (item) => item.itemId === row.detail.itemId
        );
        return findPiQuantityPerItem ? findPiQuantityPerItem.quantity : "N/A";
      },
      center: true,
      width: "180px",
    },
    {
      name: "PI Amount",
      selector: (row) => {
        if (row.isGroup) {
          return null;
        }
        const filterPIData = invoiceData?.find(
          (x) => x._id === row?.piNumber
        );
        const findPiAmountPerItem = filterPIData?.detailsData.find(
          (item) => item.itemId === row.detail.itemId
        );
        return findPiAmountPerItem ? findPiAmountPerItem.totalAmount : "N/A";
      },
      center: true,
      width: "180px",
    },
    {
      name: "Paid Quantity",
      selector: (row) => {
        const filterMatchedItem = getFilteredMatchedItemsForCalculation(
          filteredDatas,
          row
        );

        if (filterMatchedItem && filterMatchedItem.length > 0) {
          // Filter the "cash" items
          const paidQuantityItems = filterMatchedItem
            .flat()
            .filter((item) => item.paymentStatus === "cash");

          console.log(paidQuantityItems);
          // Calculate total amount for cash and adjustment

          const totalQuantity = paidQuantityItems
            .flat()
            .reduce((acc, item) => acc + item.quantity, 0);

          return Math.round(totalQuantity * 100) / 100;
        }

        return "N/A"; // Default value if no match is found
      },
      center: true,
      width: "180px",
    },

    {
      name: "Paid Amount",
      selector: (row) => {
        const filterMatchedItem = getFilteredMatchedItemsForCalculation(
          filteredDatas,
          row
        );

        if (filterMatchedItem && filterMatchedItem.length > 0) {
          // Filter the "cash" items

          const cashItems = filterMatchedItem
            .flat()
            .filter((item) => item.paymentStatus === "cash");

          const totalCash = cashItems
            .flat()
            .reduce((acc, item) => acc + item.amount, 0);

          return Math.round(totalCash * 100) / 100;
        }

        return "N/A"; // Default value if no match is found
      },
      center: true,
      width: "180px",
    },
    {
      name: "Adjust Quantity",
      selector: (row) => {
        const filterMatchedItem = getFilteredMatchedItemsForCalculation(
          filteredDatas,
          row
        );

        if (filterMatchedItem && filterMatchedItem.length > 0) {
          // Filter the "cash" items
          const adjustmentItems = filterMatchedItem
            .flat()
            .filter((item) => item.paymentStatus === "adjustment");

          console.log(adjustmentItems);
          // Calculate total amount for cash and adjustment

          const totalAdjustment = adjustmentItems
            .flat()
            .reduce((acc, item) => acc + item.quantity, 0);

          return Math.round(totalAdjustment * 100) / 100;
        }

        return "N/A"; // Default value if no match is found
      },
      center: true,
      width: "180px",
    },
    {
      name: "Adjust Amount",
      selector: (row) => {
        const filterMatchedItem = getFilteredMatchedItemsForCalculation(
          filteredDatas,
          row
        );

        if (filterMatchedItem && filterMatchedItem.length > 0) {
          const adjustmentItems = filterMatchedItem
            .flat()
            .filter((item) => item.paymentStatus === "adjustment");

          const totalAdjustment = adjustmentItems
            .flat()
            .reduce((acc, item) => acc + item.amount, 0);

          return Math.round(totalAdjustment * 100) / 100;
        }

        return "N/A"; // Default value if no match is found
      },
      center: true,
      width: "180px",
    },
    {
      name: "Net Quantity",
      selector: (row) => {
        const filterMatchedItem = filteredDatas
          ?.map((data) => {
            if (
              data.piNumber === row.piNumber &&
              data.clientId === row.clientId
            ) {
              const filteredData = data?.detailsData.filter(
                (item) => item.itemId === row.detail.itemId
              );
              return filteredData.length > 0 ? filteredData : null;
            }
            return null;
          })
          .filter(Boolean);

        if (filterMatchedItem && filterMatchedItem.length > 0) {
          // Filter the "cash" items
          // const cashItems = filterMatchedItem.filter((item) =>
          //   item.some((data) => data.paymentStatus === "cash")
          // );
          const adjustmentItems = filterMatchedItem
            .flat()
            .filter((item) => item.paymentStatus === "adjustment");
          const cashItems = filterMatchedItem
            .flat()
            .filter((item) => item.paymentStatus === "cash");

          const totalCash = cashItems
            .flat()
            .reduce((acc, item) => acc + item.quantity, 0);

          const totalAdjustment = adjustmentItems
            .flat()
            .reduce((acc, item) => acc + item.quantity, 0);

          const netAmount = totalCash - totalAdjustment;
          console.log(netAmount);
          return Math.round(netAmount * 100) / 100;
        }

        return "N/A"; // Default value if no match is found
      },
      center: true,
      width: "180px",
    },
    {
      name: "Net Amount",
      selector: (row) => {
        const filterMatchedItem = getFilteredMatchedItemsForCalculation(
          filteredDatas,
          row
        );

        if (filterMatchedItem && filterMatchedItem.length > 0) {
          const adjustmentItems = filterMatchedItem
            .flat()
            .filter((item) => item.paymentStatus === "adjustment");
          const cashItems = filterMatchedItem
            .flat()
            .filter((item) => item.paymentStatus === "cash");
          const totalCash = cashItems
            .flat()
            .reduce((acc, item) => acc + item.amount, 0);
          const totalAdjustment = adjustmentItems
            .flat()
            .reduce((acc, item) => acc + item.amount, 0);
          console.log(totalCash, totalAdjustment);
          const netAmount = totalCash - totalAdjustment;
          console.log(netAmount);
          return Math.round(netAmount * 100) / 100;
        }
        return "N/A";
      },
      center: true,
      width: "180px",
    },
    {
      name: "Action",
      button: true,
      width: "150px",
      grow: 2,
      cell: (row) => (
        <div className="d-flex justify-content-between align-content-center">
          {permission?.isPDF ? (
            <a
              target="_blank"
              className={` action-icon `}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Update item"
              style={{
                color: "orange",
                border: "2px solid orange",
                padding: "3px",
                borderRadius: "5px",
              }}
              onClick={() => {
                const filterMatchedItem = getFilteredMatchedItemsForCalculation(
                  filteredDatas,
                  row
                );

                downloadPaymentReceivedPDF(
                  row,
                  filterMatchedItem,
                  customerInfo,
                  finishGoods,
                  invoiceData,
                  itemsizeinfo,
                  bankInformation,
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

  const filteredItems = groupByClient(filteredDatas)?.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );


  //for all items pdf report 
  function groupDataByPiNumberAndItemId(data) {
    const groupedData = {};
    data?.forEach((entry) => {
      const { piNumber, detailsData } = entry;
      detailsData?.forEach((item) => {
        const { itemId, amount, quantity, paymentStatus } = item;
        console.log(itemId, amount, quantity, paymentStatus);
        if (!groupedData[piNumber]) {
          groupedData[piNumber] = {};
        }
        if (!groupedData[piNumber][itemId]) {
          groupedData[piNumber][itemId] = {
            piNumber,
            itemId,
            paidTotalQuantity: 0,
            paidTotalAmount: 0,
            adjustTotalAmount: 0,
            adjustTotalQuantity: 0,
            totalNetQuantity: 0,
            totalNetAmount: 0,
          };
        }

        if (paymentStatus === "cash") {
          groupedData[piNumber][itemId].paidTotalQuantity += quantity || 0;
          groupedData[piNumber][itemId].paidTotalAmount += amount || 0;
        } else if (paymentStatus === "adjustment") {
          groupedData[piNumber][itemId].adjustTotalQuantity += quantity || 0;
          groupedData[piNumber][itemId].adjustTotalAmount += amount || 0;
        }
        groupedData[piNumber][itemId].itemId = itemId;
        groupedData[piNumber][itemId].totalNetQuantity =
          groupedData[piNumber][itemId].paidTotalQuantity -
          groupedData[piNumber][itemId].adjustTotalQuantity;
        groupedData[piNumber][itemId].totalNetAmount =
          groupedData[piNumber][itemId].paidTotalAmount -
          groupedData[piNumber][itemId].adjustTotalAmount;
      });
    });

    return Object.values(groupedData)
      .map((piGroup) => Object.values(piGroup))
      .flat();
  }

  const groupedResult = groupDataByPiNumberAndItemId(filteredDatas);

  const result = groupedResult?.reduce((acc, item) => {
    let existingPiNumber = acc.find((p) => p.piNumber === item.piNumber);

    if (existingPiNumber) {
      existingPiNumber.detailsData.push({
        itemId: item.itemId,
        paidTotalQuantity: item.paidTotalQuantity,
        paidTotalAmount: item.paidTotalAmount,
        adjustTotalAmount: item.adjustTotalAmount,
        adjustTotalQuantity: item.adjustTotalQuantity,
        totalNetQuantity: item.totalNetQuantity,
        totalNetAmount: item.totalNetAmount,
      });
    } else {
      acc.push({
        piNumber: item.piNumber,
        detailsData: [
          {
            itemId: item.itemId,
            paidTotalQuantity: item.paidTotalQuantity,
            paidTotalAmount: item.paidTotalAmount,
            adjustTotalAmount: item.adjustTotalAmount,
            adjustTotalQuantity: item.adjustTotalQuantity,
            totalNetQuantity: item.totalNetQuantity,
            totalNetAmount: item.totalNetAmount,
          },
        ],
      });
    }

    return acc;
  }, []);

  console.log(result)
//group by piNumber and all items are single

  // const groupedDataByPINumber = filteredDatas?.reduce((acc, curr) => {
  //   const key = `${curr.clientId}-${curr.piNumber}`;
  //   if (!acc[key]) {
  //     acc[key] = {
  //       clientId: curr.clientId,
  //       piNumber: curr.piNumber,
  //       makeBy: curr.makeBy,
  //       updateBy: curr.updateBy,
  //       makeDate: curr.makeDate,
  //       updateDate: curr.updateDate,
  //       detailsData: [...curr.detailsData],
  //     };
  //   } else {
  //     acc[key].detailsData = acc[key].detailsData.concat(curr.detailsData);
  //   }
  //   return acc;
  // }, {});

  // console.log(groupedDataByPINumber);

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
      <div className="d-flex justify-content-end align-items-center w-100">
        {filteredDatas?.length > 0 ? (
          <div className="d-flex justify-content-end align-items-center">
            <div className="table-head-icon d-flex align-items-center me-2">
              {/* <div>
                <FontAwesomeIcon
                  icon={faRefresh}
                  onClick={() => refetch()}
                ></FontAwesomeIcon>
                &nbsp;
              </div> */}
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
                          downloadPaymentReceivedAllSelectedPIPDF(
                            filteredDatas,
                            customerInfo,
                            { companyinfo },
                            reportTitle
                          );
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
                        handelPaymentReceiveExcel(
                          filteredDatas,
                          customerInfo,
                          invoiceData,
                          itemsizeinfo,
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

            <FilterComponent
              onFilter={(e) => setFilterText(e.target.value)}
              onClear={handleClear}
              filterText={filterText}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }, [
    filteredDatas,
    filterText,
    resetPaginationToggle,
    companyinfo,
    customerInfo,
    finishGoods,
    invoiceData,
    itemsizeinfo,
  ]);

  return (
    <div
      className="row px-5 mx-4"
      style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
    >
      <div>
        <h3 className="fw-bold mt-1">Payment Receive List</h3>
        <hr />
        <div className="d-flex">
          <div className="d-lg-flex justify-content-lg-between align-items-lg-center w-50">
            <div className="w-100">
              <label htmlFor="">Client Name</label>
              <br />
              <div className="w-100">
                <Select
                  class="form-select"
                  className="w-100"
                  aria-label="Default select example"
                  name="poinfo"
                  options={clientInfoOptions}
                  defaultValue={{
                    label: "Select Client Name",
                    value: 0,
                  }}
                  value={clientInfoOptions.filter(function (option) {
                    return option.value === clientId;
                  })}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      width: "100%",
                      borderColor: state.isFocused ? "#fff" : "#fff",
                      border: "1px solid #2DDC1B",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                      height: "auto",
                      // overflowY: "scroll",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#B8FEB3",
                      primary: "#2DDC1B",
                    },
                  })}
                  onChange={(e) => {
                    const matchedInvoice = invoiceData?.filter(
                      (invoice) =>
                        invoice.customerID === e.value &&
                        invoice.isApproved === true
                    );
                    if (matchedInvoice?.length > 0) {
                      setFilterInvoiceList(matchedInvoice);
                    } else {
                      setFilterInvoiceList([]);
                    }
                    setClientId(e.value);
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      clientId: e.value,
                    }));
                  }}
                ></Select>
              </div>
            </div>

            <div className="w-100 ms-2">
              <label htmlFor="">PI Number</label>
              <br />
              <div className="w-100">
                <Select
                  class="form-select"
                  className="w-100"
                  aria-label="Default select example"
                  name="poinfo"
                  options={piInfoOptions}
                  defaultValue={{
                    label: "Select PI Number",
                    value: 0,
                  }}
                  value={piInfoOptions.filter(function (option) {
                    return option.value === piNumber;
                  })}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      width: "100%",
                      borderColor: state.isFocused ? "#fff" : "#fff",
                      border: "1px solid #2DDC1B",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                      height: "auto",
                      // overflowY: "scroll",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#B8FEB3",
                      primary: "#2DDC1B",
                    },
                  })}
                  onChange={(e) => {
                    console.log(e);
                    setPiNumber(e.value);
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      piNumber: e.value,
                    }));
                  }}
                ></Select>
              </div>
            </div>
          </div>
          <div className="ms-4">
            <button
              className="border-0 "
              style={{
                backgroundColor: "#2DDC1B",
                color: "white",
                padding: "5px 10px",
                fontSize: "14px",
                borderRadius: "5px",
                width: "100px",
                height: "38px",
                marginTop: "25px",
              }}
              onClick={handleApplyFilters}
            >
              Show
            </button>

            <button
              className="border-0 "
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "5px 10px",
                fontSize: "14px",
                borderRadius: "5px",
                width: "100px",
                height: "38px",
                marginLeft: "10px",
                marginTop: "25px",
              }}
              onClick={() => {
                setIsTableDisplay(false);
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  clientId: "",
                  piNumber: "",
                }));
                setClientId("");
                setPiNumber("");
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {isTableDispaly ? (
        <div style={{ height: "calc(65vh - 120px)", overflowY: "scroll" }}>
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
      ) : (
        ""
      )}

      <table id="my-paymnet-receive-table" className="d-none">
        <thead>
          <tr>
            <th>PI Number</th>
            <th>Item Name</th>
            <th>Currency</th>
            <th>PI Quantity</th>
            <th>PI Amount</th>
            <th>Paid Quantity</th>
            <th>Paid Amount</th>
            <th>Adjust Quantity</th>
            <th>Adjust Amount</th>
            <th>Net Quantity</th>
            <th>Net Amount</th>
          </tr>
        </thead>

        <tbody>
          <>
            {result.map((row, rowIndex) => {
              const rowSpan = row?.detailsData?.length; // Get the length of detailsData for rowspan

              // Calculate totals for each piNumber
              const totalCashQuantity = row.detailsData.reduce(
                (acc, detail) => acc + detail.paidTotalQuantity,
                0
              );
              const totalCashAmount = row.detailsData.reduce(
                (acc, detail) => acc + detail.paidTotalAmount,
                0
              );
              const totalAdjustQuantity = row.detailsData.reduce(
                (acc, detail) => acc + detail.adjustTotalQuantity,
                0
              );
              const totalAdjustAmount = row.detailsData.reduce(
                (acc, detail) => acc + detail.adjustTotalAmount,
                0
              );
              const totalNetQuantitys = row.detailsData.reduce(
                (acc, detail) => acc + detail.totalNetQuantity,
                0
              );
              const totalNetAmounts = row.detailsData.reduce(
                (acc, detail) => acc + detail.totalNetAmount,
                0
              );

              return (
                <React.Fragment key={row.piNumber}>
                  {row.detailsData.map((detail, detailIndex) => {
                    const itemNames = finishGoods?.find(
                      (rawItem) => rawItem._id === detail.itemId
                    );
                    const filteredItemSize = itemsizeinfo?.find(
                      (x) => x?._id === itemNames?.sizeId
                    );
                    const matchPiNumber = invoiceData?.find(
                      (x) => row?.piNumber === x._id
                    );
                    const filterIPQuantity = matchPiNumber?.detailsData.find(
                      (item) => item.itemId === detail.itemId
                    );
                    console.log(detail);
                    return (
                      <tr key={`${row.piNumber}-${detail.itemId}`}>
                        {detailIndex === 0 && (
                          <td
                            rowSpan={rowSpan}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {row?.piNumber}
                          </td>
                        )}
                        <td>{`${itemNames?.itemName} (${filteredItemSize?.sizeInfo}) `}</td>
                        <td>{matchPiNumber?.currency}</td>
                        <td>{filterIPQuantity?.quantity?.toLocaleString()}</td>
                        <td>
                          {filterIPQuantity?.totalAmount?.toLocaleString()}
                        </td>
                        <td>
                          {detail.paidTotalQuantity === 0
                            ? "-"
                            : detail.paidTotalQuantity?.toLocaleString()}
                        </td>
                        <td>
                          {detail.paidTotalAmount === 0
                            ? "-"
                            : detail.paidTotalAmount?.toLocaleString()}
                        </td>
                        <td>
                          {detail.adjustTotalQuantity === 0
                            ? "-"
                            : detail.adjustTotalQuantity?.toLocaleString()}
                        </td>
                        <td>
                          {detail.adjustTotalAmount === 0
                            ? "-"
                            : detail.adjustTotalAmount?.toLocaleString()}
                        </td>
                        <td>
                          {detail.totalNetQuantity < 0
                            ? `(${detail.totalNetQuantity?.toLocaleString()})`
                            : detail.totalNetQuantity?.toLocaleString()}
                        </td>
                        <td>
                          {detail.totalNetAmount < 0
                            ? `(${detail.totalNetAmount?.toLocaleString()})`
                            : detail.totalNetAmount?.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Add the totals row after the detailsData rows */}
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "right",
                        fontWeight: "bold",
                        padding: "8px",
                        border: "1px solid black",
                      }}
                    >
                      PI wise Total
                    </td>
                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {totalCashQuantity.toLocaleString()}
                    </td>
                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {totalCashAmount.toLocaleString()}
                    </td>
                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {totalAdjustQuantity === 0
                        ? "-"
                        : totalAdjustQuantity.toLocaleString()}
                    </td>
                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {totalAdjustAmount === 0
                        ? "-"
                        : totalAdjustAmount.toLocaleString()}
                    </td>
                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {totalNetQuantitys === 0
                        ? "-"
                        : totalNetQuantitys.toLocaleString()}
                    </td>
                    <td
                      style={{ textAlign: "center", border: "1px solid black" }}
                    >
                      {totalNetAmounts === 0
                        ? "-"
                        : totalNetAmounts.toLocaleString()}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </>
          {/* Grand total row */}

          <tr>
            <td
              colSpan={5}
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
              {grandTotalCashQuantity?.toLocaleString()}
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalCashAmount?.toLocaleString()}
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalAdjustQuantity?.toLocaleString()}
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalAdjustAmount?.toLocaleString()}
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalNetQuantity?.toLocaleString()}
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid black",
              }}
            >
              {grandTotalNetAmount?.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PaymentReceiveDataTableList;
