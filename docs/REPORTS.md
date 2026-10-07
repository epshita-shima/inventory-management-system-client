# Reports and dashboard

Reports load **after the user searches** on report screens (lazy RTK Query). The **dashboard** auto-loads the last two calendar months on mount.

Client-side tables use `react-data-table-component` with **`pagination` on the already returned array** (not SQL/Mongo skip/limit).

PDF: `jsPDF` + `jspdf-autotable` under `components/ReportProperties/PDF`.  
Excel: `ExcelJS` + `file-saver` under `components/ReportProperties/Excel`.

Permission object from `extractUserMenuListForCurrectMenu` gates PDF buttons where wired.

---

## Dashboard (`/main-view`)

**UI:** `src/pages/Dashboard/Dashboard.js`

**KPI cards** — `GET /api/v1/sales-chart/sales-total?fromDate&toDate`

| Card | Fields |
|---|---|
| Total Purchase | `grandTotalPurchaseQty`, `grandTotalPurchaseAmount` (from GRN lines in range) |
| Raw Material Consumption | `grandTotalRawConsumptionQty` (production `materialUsed`) |
| Finish Goods Production | `grandTotalProductionItemQty` |
| Total Sales | `grandTotalSalesQuantity`, `grandTotalSalesAmount` (from **finish-goods deliveries** × PI unit price) |

Backend: `chart.service.js` `getSalesTotalDB`. Without dates it would scan all docs; the dashboard always sends dates.

**Charts** (each has item dropdown + from/to + Search + Reset):

| Chart | API | Filter extras |
|---|---|---|
| Purchase pie | `GET /purchase-report/details` | `itemId` optional |
| RM consumption line | `GET /production-report/raw-material-consumption-summary` | `itemId` |
| FG production line | `GET /production-report/datewise-summary` | `productionItemName` |
| Sales bar | `GET /report/sales-summary` | `itemId` |

Default range: `today` minus 2 months through `today` (`en-CA`). Reset restores that range and refetches. Search uses selected dates/item only (no full-history pull).

---

## Sales / order reports — route `sales-report`

**UI:** `ReportManagement/SalesReport/OrderDetailsReport/*`  
**Filters (CommonParameter):** report type, client, item, invoice, fromDate, toDate (and related dropdowns).

| Report | API | PDF / Excel helpers (examples) |
|---|---|---|
| Order details | `/report/order-details` | PDF/Excel under ReportProperties |
| Order summary | `/report/order-summary` | Excel `handleOrderSummaryExcel` |
| Sales details | `/report/sales-details` | `handleSalesDetailsExcel` |
| Sales summary | `/report/sales-summary` | `handleSalesSummaryPDF`, `handleSalesSummaryExcel` |
| Return details | `/report/return-details` | `handleReturnDetailsExcel` |
| Return summary | `/report/return-summary` | `handleSalesReturnSummaryExcel` |
| Combine (from this screen) | `/report/combine` | combine PDF/Excel |

Data is grouped in the **service** (e.g. monthly sales). Search triggers lazy queries; not auto on open.

---

## Purchase report — `purchase-report`

**UI:** `PurchaseReportTable` → `PurchaseReportView`  
APIs: `/purchase-report/details`, `/summary`, `/single-item`  
Filters: dates, item, supplier, PO (as implemented in the view).  
Excel: `handlePurchaseDatewiseReportExcel`, `handlePurchaseDatewiseSummaryExcel`, `handleGRNExcel` where buttons exist.

---

## Production report — `finish-goods`

**UI:** `ProductionReportTable`  
APIs: datewise details/summary, itemwise details.  
Excel/PDF: `handleProductionDatewise*`, `handleProductionExcel*`.

---

## Raw material consumption — `raw-material-consumption`

APIs: `/production-report/raw-material-consumption-details` and `-summary`.  
PDF/Excel: consumption helpers in ReportProperties.

---

## FIFO consumption report — `consumption-in-fifo-method`

**API:** `GET /api/v1/consupmtion-report` (typo in path)  
**Service:** `consumptionfifo.service.js` (GRN vs consumption by date/item).  
**UI:** `ConsumptionReportMenuPermission`.

---

## Combine report — `combine-report`

**API:** `GET /api/v1/combine-report?fromDate&toDate`  
Aggregates purchase, order, sales, production, return in `combinereport.service.js`.  
PDF: `handleCombineReportPDF`.

---

## Stock reports

| Screen | Route | API path (note spelling) |
|---|---|---|
| RM stock | `raw-material-stock` | `/stock-report/raw--material-stock-report` |
| FG stock | `finish-goods-stock` | `/stock-report/finish-goods-stock-report` |

Filters: fromDate, toDate. Drill-down modals reuse purchase/production PDF/Excel. Tables paginate client-side.

---

## Document prints (not “report module” but export)

Invoice/PO/GRN PDF generators exist (`InvoiceReportDownload.js`, `handlePurchaseOrderReport.js`, `handleGRNReport.js`, etc.) from list/detail actions when `isPDF` permission allows.
