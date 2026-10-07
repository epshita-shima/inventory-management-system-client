# Inventory Management System — Documentation Index

This folder documents the Inventory Management System (manufacturing/brick-factory ERP) as implemented in this repository.

**Source of truth:** the code in `inventory-management-client` and `inventroy-management-server`. Features that are not implemented are marked as such. Secrets are never copied from `.env` files.

## How to read these docs

| Document | Contents |
|---|---|
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Purpose, objectives, features, high-level architecture |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, data flow, folder layout |
| [AUTHENTICATION.md](./AUTHENTICATION.md) | Login, JWT, refresh, roles, menu permissions |
| [MODULES.md](./MODULES.md) | Business modules (master data, purchase, production, sales) |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | REST API reference grouped by module |
| [DATABASE.md](./DATABASE.md) | Mongoose models and collections |
| [FRONTEND.md](./FRONTEND.md) | React app structure, routes, Redux, forms |
| [BACKEND.md](./BACKEND.md) | Express layers, middleware, errors |
| [BUSINESS_WORKFLOWS.md](./BUSINESS_WORKFLOWS.md) | End-to-end operational workflows |
| [REPORTS.md](./REPORTS.md) | Reports, dashboard, PDF/Excel |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Env vars, CORS, build/start, hosting hints |
| [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) | How to add modules, APIs, menus, reports |
| [SECURITY.md](./SECURITY.md) | Implemented security and known gaps |
| [CHANGELOG.md](./CHANGELOG.md) | Visible capabilities; no git history in this workspace |

Root overview: [../README.md](../README.md)

## Tech stack (confirmed)

| Layer | Actual technologies in the repo |
|---|---|
| Frontend | React 18 (Create React App), React Router 6, Redux Toolkit, RTK Query |
| UI | Bootstrap 5, React Bootstrap, PrimeReact, Font Awesome, React Select, Formik, Yup |
| Charts / export | Chart.js, react-chartjs-2, jsPDF, jspdf-autotable, ExcelJS, file-saver, xlsx |
| Backend | Node.js, Express, Mongoose, MongoDB |
| Auth | jsonwebtoken, bcrypt / bcryptjs, httpOnly refresh cookie |
| Not used as the app UI kit | Tailwind CSS and daisyUI are **not** project dependencies. `tailwindcss` appears only as a transitive CRA lockfile package. |

## Repository layout

```
inventory_project/
├── inventory-management-client/     # React SPA
├── inventroy-management-server/     # Express API (folder name is spelled “inventroy”)
└── docs/                            # This documentation
```

## Conventions used in these docs

- API base: `/api/v1` and `/api/v2` mount the **same** router (`src/app/routes/index.js`). The client uses `/api/v2` for login/logout/refresh and `/api/v1` for most CRUD.
- IDs stored on related documents are **strings** (Mongo ObjectId as string), not Mongoose `ref` populations.
- “Not implemented” means no matching model, route, and UI module were found.
