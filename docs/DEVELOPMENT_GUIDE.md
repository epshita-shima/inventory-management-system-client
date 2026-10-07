# Development guide

## Installation and setup

1. Clone the repository (folder names: `inventory-management-client`, `inventroy-management-server`).
2. Install backend: `cd inventroy-management-server && npm install`.
3. Create `inventroy-management-server/.env` using placeholders in [DEPLOYMENT.md](./DEPLOYMENT.md).
4. Install frontend: `cd inventory-management-client && npm install`.
5. Set `REACT_APP_BASE_URL=http://localhost:5000` in `inventory-management-client/.env`.
6. Start API: `npm start` in the server folder (MongoDB must be reachable).
7. Start UI: `npm start` in the client folder.
8. Log in with an existing `users` document. If the database is empty, create a user via `POST /api/v1/users` or `npm run seed:dev` for masters/transactions (seed does **not** create users).

Optional: `npm run seed:dev` inserts brick-factory sample masters and documents; it skips rows that already match business keys.

## Add a new backend module

1. Create `src/app/module/<name>/` with `*.model.js`, `*.service.js`, `*.controller.js`, `*.route.js`.
2. Register in `src/app/routes/index.js` (`path` + `route`).
3. Keep IDs as strings if joining in services, consistent with this codebase.
4. Do not assume JWT is enforced unless you add `verifyToken` on the router.

## Add a new API

1. Add `router.get/post/...` in the module route file.
2. Implement controller + service.
3. Mirror the URL in a new or existing `*Api.js` `injectEndpoints` block.
4. Export the generated hook.

## Add a Mongoose model

1. `mongoose.model('Name', schema)` — collection name will be pluralized unless overridden.
2. Put `required` on fields the UI always sends.
3. Avoid extra fields if `strict` is default true (seed keys would be stripped).

## Add a frontend page

1. Build Insert/Index/Update under `src/components/<Feature>/`.
2. Add a `<Route>` in `App.js` inside `/main-view`, wrapped in `RequireAuth`.
3. Add a menu item (label, `url` matching the path) in **Menus**, then assign it on the user (`menulist`) with `isChecked` / CRUD flags.

## Add an RTK Query endpoint

1. Prefer injecting into the shared `api` from `redux/api/apiSlice.js`.
2. Use `params` for GET filters; `method` + `body` for mutations.
3. `providesTags` / `invalidatesTags` if list freshness matters.
4. Auth refresh is already in `baseQueryWithReauth`.

## Add menu / permission access

1. Create nested menu in Menu master (`/main-view/menu-list`).
2. Edit the user and check View (`isChecked`), Insert, Update, Delete, PDF.
3. `Home.js` shows checked nodes; `RequireAuth` compares `item.url` to the path.
4. For toolbar buttons, call `extractUserMenuListForCurrectMenu("Exact menu label")`.

## Add a report

1. Backend: GET handler with `fromDate`/`toDate` (and ids) in `app/module/report/...`.
2. Return `[]` when filters are empty if you follow existing services.
3. Frontend: lazy query + filter form + `react-data-table-component`.
4. Optional: add PDF/Excel functions next to `ReportProperties`.
5. Register route + menu URL.

## Troubleshooting (from this codebase)

| Symptom | Likely cause |
|---|---|
| CORS error from a host other than localhost:3000 or brickfactorypro.netlify.app | Hard-coded origin list in `app.js` |
| Login 401 | Username missing, bcrypt mismatch, or legacy password field |
| 401 on `/users/me` only | Missing Bearer or refresh cookie |
| Charts empty on dashboard | Date range has no movements; Reset to last 2 months |
| GRN cannot pick PO | PO `approveStatus` is false |
| DO cannot pick PI | PI `isApproved` is false (UI) |
| Submenu arrow on a leaf | Empty `items: []`; Home now strips empty arrays |
| API works without login | Global `verifyToken` is commented out |
| Logout not honored on another server instance | In-memory token blacklist |
| `GET /delivery-order/:id` returns all DOs | Route maps `/:id` to the list controller |
| Stock path 404 | Path is `raw--material-stock-report` (two hyphens) |
| Combine FIFO URL 404 | Path is `/consupmtion-report` |
| Cookie not set on HTTPS | `secure: false` on refresh cookie |
| Seed skipped everything | Duplicate-safe keys already present |
| Folder not found | Server directory is spelled `inventroy-management-server` |

## Feature summary (completed in code)

Users/roles/menus, company, RM/FG items, category/size/unit, CFT, payment modes, banks, suppliers, clients, PO + approval, GRN, production + FIFO consumption, PI + special approve, payment receive, DO + approve, FG delivery, returns, serials, dashboard, listed reports, PDF/Excel, JWT login/refresh, inactivity logout, dev seed.

## Limitations / TODO visible in code

- Purchase requisition, gate pass, departments: absent.
- Most APIs unauthenticated at the server.
- No dedicated stock ledger; opening stock not auto-updated.
- `verifyUserPassword` still allows plaintext equality for non-bcrypt values.
- Firebase, extra Login/SignUp pages unused.
- Dual `/api/v1` and `/api/v2` same router — easy to call the “wrong” version; both work.
- Typoed paths and collection name `prodctioninformation`.
- Cookie `maxAge` 1h vs refresh JWT 24h.
- Winston logging not clearly applied to every request.
- No automated API test suite (`package.json` test script is a stub on the server).
- Accounts posting flags exist without an accounts engine.
