# Database documentation

**Engine:** MongoDB via Mongoose. No schema-level unique indexes (`index: true`) were found besides mongoose-sequence on serial `id`.

**Relationship style:** string IDs, not `ref` + `populate`.

Mongoose default collection names (pluralization) are listed below.

---

## Company — `Company` / `companies`

| Field | Type | Required |
|---|---|---|
| companyName, companyAddress, companyContact, companyEmail, footerAddress, footerContact | String | yes |

No `companyId` on other collections except return `transferToCompanyId`.

---

## UserRole — `UserRole` / `userroles`

| Field | Type | Required |
|---|---|---|
| userrolename | String | yes |
| makeby, updateby | String | no |
| createdAt, updatedAt | Date | timestamps |

---

## user — `user` / `users`

| Field | Type | Required |
|---|---|---|
| firstname, lastname, mobileNo, username | String | yes |
| password, hashPassword | String | no |
| isactive | Boolean | yes |
| roleId | String | yes (UserRole `_id`) |
| menulist | Array of menu nodes | nested flags |
| makeby, updateby | String | no |
| createdAt, updatedAt | Date | defaults |

Nested menu nodes include `id`, `label`, `url`, `trackId`, `isParent`, `isChecked`, `isInserted`, `isUpdated`, `isRemoved`, `isPDF`, `items[]`, `parentIds`.

**Logic:** sanitize strips secrets; bcrypt on write; login verifies hash or legacy plaintext.

---

## menu — `menu` / `menus`

Parent: `label`, `url`, `permissions[]`, `items[]`, flags, `order`, `trackId`, timestamps.  
Child `Item` schema uses ObjectId `_id` auto.

---

## serialnogenerate — `serialnogenerates`

| Field | Type | Required |
|---|---|---|
| serialNo | Number | default 1 |
| type | String | yes (`po`, `grn`, `invoice`, …) |
| year | String | yes |
| makeby, updateby | String | no |
| id | Number | plugin autoincrement |

---

## categoryinformation / itemunitinfo / itemsize

Shared pattern: name field (`categoryInfo` / `unitInfo` / `sizeInfo`), `makeBy`, `makeDate` required; optional update fields.

---

## rmiteminformation / `rmiteminformations`

Required: `itemName`, `categoryId`, `unitId`, `openingStock`, `openingDate`, `cftDeclaration`, `description`, `itemStatus`, `makeBy`, `makeDate`.  
Optional: ledger approve, `vocuherNo` (spelling), `voucherDate`.

---

## fgiteminformation / `fgiteminformations`

Required: `itemName`, `sizeId`, `unitId`, `openingStock`, `openingDate`, `itemStatus`, `productionQtyPerBatch`, `makeBy`, `makeDate`.

---

## cftinformation / `cftinformations`

Header: `openingDate`, `isActive`, `makeBy`, `makeDate`.  
`detailsData[]`: `itemId`, `cftPerKg` required; `image` optional (upload path).

---

## paymentinformation / bankinformation

Payment: `paymentMode`, `paymentType`, `makeBy`, `makeDate`.  
Bank: account/bank/branch/city/address/`routingNumber`/`swiftCode`, audit.

---

## supplierinformation / clientinformation

Partner masters. Required identity + tax + `isActive` + approve status + `isAccountPostingStatus` + `makeBy`/`makeDate`.  
Supplier has `tradeLicenceNo`; client has optional `remarks`. Client has no `tradeLicenceNo` in schema.

---

## purchaseorderinformation / `purchaseorderinformations`

Required header: `poNo`, `supplierId`, `currencyId`, `paymentId`, `bankId`, `deliveryDate`, `grandTotalAmount`, `grandTotalQuantity`, `approveStatus`, `approveBy`, `approveDate`, `makeBy`, `remarks`.  
`makeDate` Date default now.  
Lines: `itemId`, `itemDescription`, `quantity`, `unitPrice`, `totalAmount` (numbers).

**Logic:** updating line `unitPrice` rewrites matching GRN line amounts.

---

## GoodsReceiveNoteInfo / `goodsreceivenoteinfos`

Required: `pOSingleId`, `grnSerialNo`, `supplierId`, `supplierPoNo`, `receiveDate` (**String**), `challanNo`, totals as **String**, `isAccountPostingStatus`, `makeBy`, `makeDate`.  
Lines: `pOSingleId` (PO line id), `itemId`, numeric qty/price/amount.

---

## prodctioninformation / `prodctioninformations`

Required production metrics and `detailsData` array. Dates: `productionDate` **String**; start/end **Date**.

---

## rmconsumptiondetailbyfifo / `rmconsumptiondetailbyfifos`

`productionDate` String; `itemId`, `grnDetailsId` String; numeric qty/rate/amount/`materialUsed`/`closingStock`; `makeBy`; `makeDate` Date.

---

## invoiceinformation / `invoiceinformations`

Required: `piDate`, `expireDate`, `invoiceNo`, `customerID`, `paymentId`, `currency`, `isApproved`, `mktPerson`, `makeBy`, `makeDate`.  
Lines: `itemId`, `description`, `quantity`, `specialApproveForDelivary`, `deliveredQty`, `returnQty`.

---

## paymentreceiveinformation

`clientId`, `piNumber`, `makeBy`; `detailsData` with payment method/status, `piDetailsId`, amounts; optional `bankId`, cheque fields.

---

## deliveryorderinformation

`piId`, `doNo`, `clientId`, `deliveryChallanNo`, `shipmentNo`, `approveStatus`, `deliveryStatus`, `makeBy`. Lines include `piDetailsId`, `deliverQty` as **String**.

---

## finishgoodsdeliveryinformation

`finishGoodsDeliveryDate` Date; `piId`, `doId`, driver fields, `truckNo`, `clientId`, `deliveryChallanNo`, `totalDelivarQty`, `approveStatus`, `makeBy`.  
**Insert service** sets invoice `deliveredQty` and DO `deliveryStatus`.

---

## returndeliveredinformation

`returnDate`, `piId`, `doId`, `deliveredId`, `transferFromClientId`, `transferToCompanyId`, `clientId`, `makeBy`. Line qtys as **String**.

---

## Implied / unused

- `token.model.js` is not a collection.
- No `stock` collection; reports aggregate other collections + opening stock.
- Counters collection may exist from mongoose-sequence (`counters`).

## Referential integrity

Mongo does **not** enforce FKs. Orphan ids are possible if a master row is deleted while POs/invoices still point at it. Delete handlers generally delete one document without cascading.
