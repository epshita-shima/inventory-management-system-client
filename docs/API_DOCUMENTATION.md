# API Documentation

Base URL: `{REACT_APP_BASE_URL}` (example: `http://localhost:5000`).

All module routers are mounted twice:

- `/api/v1/<path>`
- `/api/v2/<path>`

The tables below use `/api/v1` except auth, which the client calls on `/api/v2`.

## Cross-cutting behavior

| Topic | Actual behavior |
|---|---|
| Authentication | Required on `GET /users/me` only. Other routes do not enforce JWT in `app.js`. |
| Content type | JSON. Multer `upload.any()` runs globally and `JSON.parse`s `req.body`. |
| Validation | Mostly Mongoose `required` plus some controller checks (login body). Formik/Yup is **client-side**. |
| Success shapes | Inconsistent: raw arrays, `{ status: 200, data }`, `{ success, data, token }`. Controllers differ. |
| Errors | HTTP 400/401/500 JSON; `globalErrorHandler` uses `{ success: false, message, errorMessages, stack? }`. Many controllers still `res.status(500).json({ error })` locally. |
| Pagination | **No server-side skip/limit** on these list/report endpoints. `pagination` on the client is `react-data-table-component`. |

---

## Auth (`/jwt`)

Controller/service: `app/module/auth/auth.service.js`

| Method | Endpoint | Auth | Body | Success |
|---|---|---|---|---|
| POST | `/api/v2/jwt` | No | `{ username, password }` | `{ success, data: userWithoutSecrets, token, message }` |
| POST | `/api/v2/jwt/refresh-token` | Refresh cookie | empty | `{ success, data, token }` |
| POST | `/api/v2/jwt/logout` | Cookie optional | unused | clears cookie; blacklists refresh token in memory |

**Errors:** 400 missing credentials; 401 invalid login or bad refresh; 404 user missing on refresh; 500 refresh without cookie.

Example login:

```http
POST /api/v2/jwt
Content-Type: application/json

{ "username": "Super-05", "password": "********" }
```

---

## Users (`/users`)

`user.controller.js` / `user.service.js` / `user.model.js`

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/api/v1/users` | No | Create user; hashes password |
| GET | `/api/v1/users/me` | Bearer + cookie | Current user, sanitized |
| GET | `/api/v1/users` | No | All users, sanitized in service |
| GET | `/api/v1/users/:id` | No | Single user |
| PUT | `/api/v1/users/update/:id` | No | Update (menu/user) |
| PUT | `/api/v1/users/updateinfo/:id` | No | Profile fields |
| PUT | `/api/v1/users/change/password/:id` | No | Password change |
| DELETE | `/api/v1/users/delete/:id` | No | Delete |
| PUT | `/api/v1/users/status/updateStatus` | No | Bulk `isactive` |
| PUT | `/api/v1/users/updatestatus/updateMultiple` | No | Bulk field update (used to refresh menulist) |

Declare `/me` **before** `/:id` (already the case) or `me` is captured as an id.

---

## Roles, menus, serials, company

| Method | Endpoint | Body / query |
|---|---|---|
| POST | `/api/v1/userrole` | `{ userrolename, makeby? }` |
| GET | `/api/v1/userrole` | — |
| GET | `/api/v1/menuitems` | — |
| POST | `/api/v1/menuitems/create/menu` | Nested menu payload |
| POST | `/api/v1/menuitems/update/menu` | Update tree |
| GET | `/api/v1/menuitems/singlemenu/:id` | — |
| GET | `/api/v1/menuitems/singlemenu/changingparent/:id` | — |
| PUT | `/api/v1/menuitems/updatesingle-menu` | — |
| PUT | `/api/v1/menuitems/singlemenu/singleupdate/:id` | — |
| POST | `/api/v1/menuitems/updatenesteditems/menu` | — |
| DELETE | `/api/v1/menuitems/deletemenu/:id` | — |
| GET | `/api/v1/serial` | — |
| POST | `/api/v1/serial` | `{ serialNo, type, year, makeby }` |
| POST | `/api/v1/company` | Company fields |
| GET | `/api/v1/company` | — |

---

## Master data

| Resource | GET list | POST | GET id | PUT id | PUT status | DELETE |
|---|---|---|---|---|---|---|
| Category | `/categoryinfo` | `/categoryinfo` | — | — | — | — |
| Unit | `/itemunit` | `/itemunit` | — | — | — | — |
| Size | `/itemsize` | `/itemsize` | — | — | — | — |
| RM item | `/rawmaterialinfo` | yes | `/:id` | `/:id` | `/` | `/:id` |
| FG item | `/finishgoodsinfo` | yes | `/:id` | `/:id` | `/` | `/:id` |
| CFT | `/cftinfo` | yes | `/:id` | `/:id` | `/` | `/:id` |
| Payment mode | `/paymentinfo` | yes | — | — | — | `/:id` |
| Bank | `/bankinfo` | yes | — | — | — | — |
| Supplier | `/supplierinfo` | yes | `/:id` | `/:id` | `/` | `/:id` |
| Client | `/clientinfo` | yes | `/:id` | `/:id` | `/` | `/:id` |

POST bodies are typically **arrays** (`insertMany`) from Formik `detailsData`.

---

## Purchase orders `/purchaseorderinfo`

| Method | Endpoint | Query / body |
|---|---|---|
| GET | `/` | All POs |
| GET | `/cash` | Cash POs (service filter) |
| GET | `/lc` | LC POs |
| GET | `/approve` | `approveStatus: true` |
| GET | `/unapprove` | Unapproved |
| POST | `/` | PO document(s) |
| GET | `/:id` | One PO |
| PUT | `/:id` | Update; also syncs GRN line prices if unit price changes |
| PUT | `/` | Status updates |
| DELETE | `/:id` | Delete |

**PO body (schema-required):** `poNo`, `supplierId`, `currencyId`, `paymentId`, `bankId`, `deliveryDate`, totals, `approveStatus`, `approveBy`, `approveDate`, `makeBy`, `remarks`, `detailsData[]`.

---

## GRN `/grninfo`

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/` | All |
| GET | `/filtered` | `supplierPONo`, `supplierId`, `fromDate`, `toDate`, `selectMonth` |
| POST | `/` | Insert |
| GET | `/:id` | One |
| PUT | `/:id` | Update |
| DELETE | `/:id` | Delete |

---

## Production `/production`

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/` | All |
| GET | `/filtered` | `fromDate`, `toDate` |
| POST | `/` | Batch |
| GET | `/:id` | One |
| PUT | `/:id` | Update |
| DELETE | `/:id` | Delete |

FIFO companion: `GET/POST /api/v1/raw-consumption`.

---

## Sales

### Invoices `/invoiceinfo`

| Method | Endpoint |
|---|---|
| GET | `/` |
| POST | `/` |
| GET | `/filtered` query `customerID`, `piNumber` |
| GET | `/:id` |
| PUT | `/special-approve` |
| PUT | `/shipment` |
| PUT | `/:id` |
| PUT | `/` (status / approve) |
| DELETE | `/:id` |

### Payment receive `/payment-receive`

GET `/`, GET `/filtered`, POST `/`, GET `/:id`, PUT `/`, DELETE `/`.

### Delivery orders `/delivery-order`

GET `/`, `/after-deliver`, `/filtered`, POST `/`, GET `/:id`, GET `/single-info`, PUT `/approve-status`, PUT `/delivery-status`, DELETE `/:id`.

`GET /:id` and `GET /` both call `getDOInfoController` in the route file — `GET /:id` does **not** load by id (bug/limitation). Single-by-id is intended on `/single-info`.

### Finish goods delivery `/finish-goods-delivery`

GET `/`, GET `/filtered`, POST `/`, GET `/:id`.

### Returns `/return-deliver`

GET `/`, POST `/`, GET `/:id`, DELETE `/:id`.

---

## Reports

Query params are typically `fromDate`, `toDate`, plus entity ids. Empty filter objects often yield `[]` (services return empty if no criteria).

| Method | Endpoint | Typical query |
|---|---|---|
| GET | `/report/order-details` | fromDate, toDate, itemId, clientId, piId, reportStatus |
| GET | `/report/order-summary` | same |
| GET | `/report/sales-details` | same (delivery dates) |
| GET | `/report/sales-summary` | same |
| GET | `/report/return-details` | same |
| GET | `/report/return-summary` | same |
| GET | `/report/combine` | (also mounted; combine module has `/combine-report`) |
| GET | `/combine-report/` | fromDate, toDate |
| GET | `/purchase-report/details` | fromDate, toDate, itemId, supplierId, poId |
| GET | `/purchase-report/summary` | same |
| GET | `/purchase-report/single-item` | itemId |
| GET | `/production-report/datewise-details` | fromDate, toDate, productionItemName, batchNo |
| GET | `/production-report/datewise-summary` | same |
| GET | `/production-report/itemwise-details` | same |
| GET | `/production-report/raw-material-consumption-details` | fromDate, toDate, itemId |
| GET | `/production-report/raw-material-consumption-summary` | same |
| GET | `/consupmtion-report/` | fromDate, toDate, itemId (path spelling `consupmtion`) |
| GET | `/stock-report/raw--material-stock-report` | fromDate, toDate (double hyphen in path) |
| GET | `/stock-report/finish-goods-stock-report` | fromDate, toDate |
| GET | `/sales-chart/sales-total` | fromDate, toDate (dashboard KPIs) |

Date format used by the client: `YYYY-MM-DD` (`toLocaleDateString("en-CA")`).

GRN `receiveDate` and production `productionDate` are **strings** in Mongo; sales delivery dates are **Date**.

---

## Health

`GET /` → text `Running inventory management`.
