# Modules

Only modules that exist as models + routes (and usually UI) are listed. IDs on related records are strings unless noted.

---

## 1. User and company management

### Users

- **Purpose:** Application logins, assigned role, and a personal copy of the menu tree.
- **Model:** `user` → collection `users`
- **Main fields:** `firstname`, `lastname`, `mobileNo`, `username`, `password`, `hashPassword`, `isactive`, `roleId`, `menulist[]`, `makeby`, `updateby`, timestamps
- **CRUD:** create, list, get by id, update menu/user info, change password, delete, bulk status/field updates
- **APIs:** `/api/v1/users` (see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md))
- **UI:** `components/UserListInformation/**`, route `/main-view/user-list`, `/main-view/create-user`, `user-list/user-update/:id`
- **Notes:** `GET /users/me` is the only user route with `verifyToken`.

### User roles

- **Purpose:** Named roles (e.g. Super Admin). Not a permission matrix.
- **Model:** `UserRole` → `userroles`
- **Fields:** `userrolename`, `makeby`, `updateby`, timestamps
- **APIs:** `POST/GET /api/v1/userrole`
- **UI:** `components/UserRoleInformation` (modal used from user screens)

### Company

- **Purpose:** Letterhead / address for documents and reports.
- **Model:** `Company` → `companies`
- **Fields:** `companyName`, `companyAddress`, `companyContact`, `companyEmail`, `footerAddress`, `footerContact` (all required)
- **APIs:** `POST/GET /api/v1/company`
- **UI:** used via `redux/features/companyinfo/compayApi.js` (filename spelling `compayApi`)
- **Limitation:** other documents do **not** store `companyId`. Returns use `transferToCompanyId` as a string field on the return model.

### Department

**Not implemented** as a master table. No department schema or routes.

---

## 2. Master data

### Category

- **Purpose:** Classify raw materials.
- **Model:** `categoryinformation` → `categoryinformations`
- **Fields:** `categoryInfo`, `makeBy`, `makeDate` (required); `updateBy`, `updateDate`
- **APIs:** `GET/POST /api/v1/categoryinfo` (no update/delete routes)
- **UI:** `components/CategoryInformation`

### Item unit

- **Purpose:** UOM (Kg, MT, Pcs, …)
- **Model:** `itemunitinfo` → `itemunitinfos`
- **Fields:** `unitInfo`, `makeBy`, `makeDate`
- **APIs:** `GET/POST /api/v1/itemunit`
- **UI:** `components/UnitInformation`

### Item size

- **Purpose:** Finish-goods sizes
- **Model:** `itemsize` → `itemsizes`
- **Fields:** `sizeInfo`, `makeBy`, `makeDate`
- **APIs:** `GET/POST /api/v1/itemsize`
- **UI:** `components/SizeInformation`

### Raw material items

- **Purpose:** RM catalog and opening stock
- **Model:** `rmiteminformation` → `rmiteminformations`
- **Fields:** `itemName`, `categoryId`, `unitId`, `openingStock`, `openingDate`, `cftDeclaration`, `description`, `itemStatus`, optional ledger/voucher fields, audit fields
- **CRUD:** full list/create/get/update/status/delete
- **APIs:** `/api/v1/rawmaterialinfo`
- **UI:** `components/RMItemProfile`, routes `/main-view/raw-material-item-list`, create/update

### Finish goods items

- **Purpose:** FG catalog, size, batch expected qty
- **Model:** `fgiteminformation` → `fgiteminformations`
- **Fields:** `itemName`, `sizeId`, `unitId`, `openingStock`, `openingDate`, `itemStatus`, `productionQtyPerBatch`, optional ledger fields
- **APIs:** `/api/v1/finishgoodsinfo`
- **UI:** `components/FGItemProfile`

### CFT information

- **Purpose:** Cubic-feet declaration per RM item (`cftPerKg`), used in production mix when `cftDeclaration` is true
- **Model:** `cftinformation` → `cftinformations`
- **Fields:** `openingDate`, `detailsData[{ itemId, cftPerKg, image }]`, `isActive`, `closingDate`, audit
- **APIs:** `/api/v1/cftinfo`
- **UI:** `components/CFTInformations`

### Payment modes

- **Purpose:** Cash / LC etc. referenced by PO and invoices (`paymentId`)
- **Model:** `paymentinformation` → `paymentinformations`
- **Fields:** `paymentMode`, `paymentType`, audit
- **APIs:** `GET/POST/DELETE /api/v1/paymentinfo` (no PUT)
- **UI:** `components/PaymentModeInformation` (`payment-list`, `create-payment-mode`)

### Bank accounts

- **Purpose:** Bank details on POs / cheque receipts
- **Model:** `bankinformation` → `bankinformations`
- **Fields:** `accountNumber`, `accountName`, `bankName`, `branchName`, `city`, `address`, `routingNumber`, `swiftCode`, audit
- **APIs:** `GET/POST /api/v1/bankinfo`
- **UI:** `components/BankInformation` (used from forms; no dedicated App.js route name isolated)

### Menus

- **Purpose:** Nested navigation definition copied onto users
- **Model:** `menu` → `menus`
- **APIs:** `/api/v1/menuitems` (create/update nested/delete)
- **UI:** `components/MenuInformation` (`menu-list`, `create-menu`)

### Serial numbers

- **Purpose:** Next number for `po`, `grn`, `invoice`, `do`, `production`, `deliveryChallan`, `user`, …
- **Model:** `serialnogenerate` → `serialnogenerates` (mongoose-sequence plugin on field `id`)
- **APIs:** `GET/POST /api/v1/serial`

---

## 3. Purchase / procurement

### Supplier

- **Purpose:** Vendors for POs/GRNs
- **Model:** `supplierinformation`
- **Fields:** identity, tax (`binNo`, `tinNo`, `tradeLicenceNo`), `isActive`, `supplierApproveStatus`, `isAccountPostingStatus`, voucher fields, audit
- **APIs:** `/api/v1/supplierinfo`
- **UI:** `components/SupplierProfile`

### Purchase requisition

**Not implemented.**

### Purchase order

- **Purpose:** Buy RM from a supplier
- **Model:** `purchaseorderinformation`
- **Header:** `poNo`, `supplierId`, `currencyId` (`BDT`/`USD` in UI), `paymentId`, `bankId`, `deliveryDate`, totals, `approveStatus`, `approveBy`, `approveDate`, `remarks`, audit
- **Lines:** `itemId`, `itemDescription`, `quantity`, `unitPrice`, `totalAmount`
- **APIs:** `/api/v1/purchaseorderinfo` including `/cash`, `/lc`, `/approve`, `/unapprove`
- **UI:** `components/PurchaseManagement/PurchaseOrder`, routes `po-list`, `create-po`, `po-approval`
- **Approval:** `approveStatus` boolean; GRN insert UI refuses unapproved POs (`InsertGRNInfo.js`)

### GRN (Goods Receive Note)

- **Purpose:** Record received qty against a PO
- **Model:** `GoodsReceiveNoteInfo` → `goodsreceivenoteinfos`
- **Header:** `pOSingleId` (PO `_id`), `grnSerialNo`, `supplierId`, `supplierPoNo`, `receiveDate`, `challanNo`, totals, `isAccountPostingStatus`
- **Lines:** `pOSingleId` (PO **line** `_id`), `itemId`, `quantity`, `previousReceivedQuantity`, `unitPrice`, `amount`
- **APIs:** `/api/v1/grninfo` (+ `/filtered`)
- **UI:** `components/GoodsReceiveNoteInformation`
- **Stock:** there is no inventory movement table. RM stock **reports** add GRN quantities to opening stock.

### Gate pass / issue

**Not implemented.**

---

## 4. Production

- **Model:** `prodctioninformation` (spelling) → `prodctioninformations`
- **Header:** `productionDate`, `batchNo`, `totalBatch`, `receipeQtyRatio`, `productionItemName` (FG item id string), quantities, start/end, hours, wastage, expected vs actual, `productionStatus` (`No Change` / `Less` / `Excess`)
- **Lines:** RM `itemId`, `receipe`, `materialUsed`, `asPerRatio`, `excess`, `less`, `consumptionStatus`
- **APIs:** `/api/v1/production`
- **UI:** `components/Production`
- **FIFO rows:** on save, UI also POSTs `/api/v1/raw-consumption` (`rmconsumptiondetailbyfifo`) with `grnDetailsId`, qty, rate, `materialUsed`, `closingStock`

---

## 5. Sales

### Client (customer)

- **Model:** `clientinformation`
- **Fields:** similar to supplier (`clientName`, tax ids, `isActive`, `clientApproveStatus`, `isAccountPostingStatus`)
- **APIs:** `/api/v1/clientinfo`
- **UI:** `components/ClientInformation`

### Proforma invoice

- **Model:** `invoiceinformation`
- **Header:** `piDate`, `expireDate`, `invoiceNo`, `customerID`, `paymentId`, `currency`, `shipmentNo`, `isApproved`, `mktPerson`
- **Lines:** `itemId`, `description`, `quantity`, prices, `specialApproveForDelivary`, `deliveredQty`, `returnQty`
- **APIs:** `/api/v1/invoiceinfo` (`/filtered`, `/special-approve`, `/shipment`)
- **UI:** `components/SalesManagement/ProformaInvoice`, special delivery list `special-delivery-approve`

### Payment receive

- **Model:** `paymentreceiveinformation`
- **Header:** `clientId`, `piNumber` (invoice `_id` string)
- **Lines:** date, `paymentMethod` (`cash` / `bank-cash` / `bank-cheque`), `paymentStatus` (`cash` / `advance` / `adjustment`), `itemId`, `piDetailsId`, amount, optional bank/cheque fields
- **APIs:** `/api/v1/payment-receive`
- **UI:** `components/PaymentMethodInformation`

### Delivery order

- **Model:** `deliveryorderinformation` (file `deliveryorderinfo.module.js`)
- **Fields:** `piId`, `doNo`, `clientId`, challan numbers, `shipmentNo`, `approveStatus`, `deliveryStatus`, line `deliverQty` / `piDetailsId`
- **APIs:** `/api/v1/delivery-order`
- **UI:** create DO, `do-list`, `approve-list`

### Finish goods delivery

- **Model:** `finishgoodsdeliveryinformation`
- **Fields:** date, `piId`, `doId`, driver/truck, `clientId`, `deliveryChallanNo`, `totalDelivarQty`, `approveStatus`, lines with `deliverQty`
- **APIs:** `/api/v1/finish-goods-delivery` (GET/POST; limited update/delete)
- **Service:** on insert, updates invoice `deliveredQty` and DO `deliveryStatus`
- **Stock impact:** FG stock report subtracts delivered qty

### Returns

- **Model:** `returndeliveredinformation`
- **Header:** `returnDate`, `piId`, `doId`, `deliveredId`, `transferFromClientId`, `transferToCompanyId`, `clientId`
- **Lines:** `returnQty`, `deliveredQty`, `deliveryChallanNo`, ids
- **APIs:** `/api/v1/return-deliver`
- **UI:** `components/DeliverReturnInformation`

---

## 6. Reports and dashboard

See [REPORTS.md](./REPORTS.md). Dashboard is `pages/Dashboard/Dashboard.js`.
