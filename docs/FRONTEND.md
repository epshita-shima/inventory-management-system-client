# Frontend architecture

SPA: Create React App (`react-scripts` 5), React 18, React Router 6.

## Bootstrap

`src/index.js` wraps `<Provider store>` and `<BrowserRouter>`. `App.js` defines routes and calls `useInactivityLogout()`.

## Pages vs components

| Area | Location |
|---|---|
| Login | `src/pages/Login/LoginWithUsername.js` |
| Shell / menubar | `src/pages/Home/Home.js` inside `MainView` |
| Dashboard | `src/pages/Dashboard/Dashboard.js` |
| Route guard | `src/pages/RequireAuth/RequireAuth.js` |
| Feature screens | `src/components/<Feature>/Insert|Index|Update|Common` |

## Routes (`App.js`)

Public: `/` login.

Nested under `/main-view` (layout `MainView`):

| Path | Screen |
|---|---|
| index | Dashboard |
| `change-password` | ChangePasswordModal |
| `user-list`, `create-user`, `user-list/user-update/:id` | Users |
| `raw-material-item-list`, `create-raw-material-item`, update `raw-material-item-list/update-items-raw-material/:id` | RM |
| `finish-goods-item-list`, `craete-finish-goods-item` (typo in path), update | FG |
| `cft-info-list`, `create-cft-infos`, update | CFT |
| `supplier-list`, `create-supplier`, update | Supplier |
| `client-list`, `create-client`, update | Client |
| `po-list`, `create-po`, `po-list/update-purchaseinfo/:id`, `po-approval` | PO |
| `grn-list`, `create-grn`, update | GRN |
| `create-production`, `production-list`, update | Production |
| `create-payment-mode`, `payment-list` | Payment modes |
| `create-invoice`, `invoice-list`, update | PI |
| `special-delivery-approve` | Special delivery |
| `create-payment-received`, `payment-received-list`, update | Payment receive |
| `create-do`, `do-list`, `approve-list` | Delivery order |
| `list-page`, update FG delivery | Finish goods delivery |
| `create-return-information`, `list-information` | Returns |
| `create-menu`, `menu-list`, update | Menus |
| `sales-report`, `finish-goods`, `raw-material-consumption`, `consumption-in-fifo-method`, `combine-report`, `purchase-report`, `raw-material-stock`, `finish-goods-stock` | Reports |

Most feature routes wrap `<RequireAuth>`. Dashboard index does not.

## Redux

`src/redux/store.js`:

- `user` ← `userSlice`
- `menu` ← `updateUserSlice`
- `[api.reducerPath]` ← RTK Query `api`

`serializableCheck` is disabled. `setupListeners` enabled.

`src/redux/api/apiSlice.js` is the shared `createApi` with `fetchBaseQuery`, cookie credentials, Bearer header, and refresh retry.

Feature files under `src/redux/features/**` call `api.injectEndpoints`. Naming typos exist (`paymnetinformation`, `compayApi`, `bankInfoAPi`).

## Hooks

| Hook | Role |
|---|---|
| RTK `useGet*` / `useLazyGet*` / `use*Mutation` | Data |
| `useInactivityLogout` | Idle session end |
| `getMakebyUser` | Username from localStorage for `makeBy` |

No React Query besides RTK.

## Reusable UI

- `components/Common/CommonDropdown/CommonDropdown.js` — select option mappers
- `components/Common/LoadingSpinner/LoadingSpineer.js`
- `components/Common/CommonMakeUser`
- `components/ReportProperties/PDF` and `Excel`
- PrimeReact `Menubar`, React Bootstrap forms/modals, React Select, React DatePicker, `react-data-table-component`

## Forms and validation

Formik + Yup on create/update screens (PO, GRN, sales, masters). Yup runs in the browser only.

## Permission handling

1. User `menulist` in `localStorage`.
2. Home filters visible items.
3. `RequireAuth` for URLs.
4. List/report screens call `extractUserMenuListForCurrectMenu("<Menu label>")` to hide insert/update/delete/PDF buttons.

## Styling

Bootstrap utility classes, custom CSS (e.g. `Home.css`, `buttonStyle`). **Not** Tailwind/daisyUI.

## Dead / unused frontend

Firebase `src/lib/firebase.js`; alternate Login/SignUp pages not referenced from `App.js`.
