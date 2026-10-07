# Inventory Management System

Full-stack inventory and manufacturing operations application (purchase, production, sales, stock reports) implemented as:

- **Frontend:** `inventory-management-client` (React 18, Create React App)
- **Backend:** `inventroy-management-server` (Node.js, Express, MongoDB) — directory name is spelled *inventroy*

## Overview

The system stores master data and operational documents in MongoDB and exposes REST APIs consumed by a Redux Toolkit / RTK Query SPA. Users log in with username and password. Access to screens is controlled by a **per-user nested menu** (view / insert / update / delete / PDF flags), not by a separate department module.

It is designed around brick/concrete manufacturing documents (CFT, kiln-style production, finish-goods delivery). It is **not** a general ledger / accounting product; posting flags exist on some records without an accounts engine.

## Main features

- JWT authentication (bcrypt passwords, refresh cookie, token refresh, inactivity logout)
- Users, roles (names), menus, company profile
- Raw materials, finish goods, category, size, unit, CFT, payment modes, banks
- Suppliers, purchase orders (with approval), goods receive notes
- Production batches and FIFO raw-material consumption
- Clients, proforma invoices, payments, delivery orders, finish-goods delivery, returns
- Dashboard (last two months by default) and operational reports with PDF/Excel export

**Not implemented:** purchase requisition, gate pass/issue, warehouse sections/departments as master data, dedicated stock ledger collection, Tailwind/daisyUI UI kit.

## Technology stack

| Layer | Technologies (in this repo) |
|---|---|
| Frontend | React 18, React Router 6, Redux Toolkit, RTK Query, Bootstrap 5, React Bootstrap, PrimeReact, Formik, Yup, React Select, Font Awesome, Chart.js |
| Export | jsPDF, ExcelJS, file-saver |
| Backend | Express, Mongoose, MongoDB, jsonwebtoken, bcrypt, Multer, Winston, cookie-parser, CORS |
| Hosting hints | Netlify origin in CORS; `vercel.json` on the API |

## Installation

```bash
# API
cd inventroy-management-server
npm install

# UI
cd ../inventory-management-client
npm install
```

## Environment setup

**Server** `inventroy-management-server/.env`:

```
DATABASE_URL=mongodb+srv://USER:********@HOST/DBNAME
PORT=5000
NODE_ENV=development
ACCESS_SECRET_TOKEN=********
REFRESH_SECRET_TOKEN=********
```

**Client** `inventory-management-client/.env`:

```
REACT_APP_BASE_URL=http://localhost:5000
```

Never commit real secrets. Full variable table: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Development commands

| Location | Command | Purpose |
|---|---|---|
| Server | `npm start` | API on `PORT` |
| Server | `npm run seed:dev` | Optional sample Mongo data (skips duplicates) |
| Client | `npm start` | UI at http://localhost:3000 |
| Client | `npm run build` | Production bundle in `build/` |

CORS allows `http://localhost:3000` and `https://brickfactorypro.netlify.app` only.

## Documentation

Start here: **[docs/README.md](docs/README.md)**

| Topic | File |
|---|---|
| Overview | [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) |
| Architecture | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Auth | [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) |
| Modules | [docs/MODULES.md](docs/MODULES.md) |
| API | [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) |
| Database | [docs/DATABASE.md](docs/DATABASE.md) |
| Frontend | [docs/FRONTEND.md](docs/FRONTEND.md) |
| Backend | [docs/BACKEND.md](docs/BACKEND.md) |
| Workflows | [docs/BUSINESS_WORKFLOWS.md](docs/BUSINESS_WORKFLOWS.md) |
| Reports | [docs/REPORTS.md](docs/REPORTS.md) |
| Deploy | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| Develop | [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) |
| Security | [docs/SECURITY.md](docs/SECURITY.md) |
| Changelog | [docs/CHANGELOG.md](docs/CHANGELOG.md) |

## Deployment overview

- **UI:** CRA `npm run build`; production origin currently expected to be Netlify (`brickfactorypro.netlify.app`) based on CORS.
- **API:** `node src/server.js` or Vercel via `inventroy-management-server/vercel.json`.
- **DB:** MongoDB URI in `DATABASE_URL`.
