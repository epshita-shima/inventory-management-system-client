# Changelog

This workspace is **not** a git repository (no `git log` at documentation time). There are no tagged releases in the tree. This file records **capabilities present in the current codebase**, not a dated commit history.

## Current codebase (unversioned)

### Authentication and users

- JWT login (`POST /api/v2/jwt`) with bcrypt verification and sanitized user payload
- Access token 10 minutes; refresh cookie; client auto-refresh
- `GET /users/me` behind `verifyToken`
- Inactivity logout hook

### Navigation and access

- Nested menus copied per user
- Home menubar filters `isChecked`, omits empty submenu `items`, parent order Setting → Master Entry → Purchase → Production → Sales → Report
- `RequireAuth` URL checks including update flag

### Operations

- Master data: company, category, size, unit, RM, FG, CFT, payment mode, bank, supplier, client
- Purchase order (cash/LC lists, approve/unapprove) and GRN
- Production batches and FIFO consumption documents
- Sales PI, special delivery approve, payment receive, delivery order, finish-goods delivery, returns
- Serial number helper

### Reporting and dashboard

- Sales/order/return, purchase, production, consumption, combine, FIFO, RM/FG stock reports
- Client PDF/Excel exporters
- Dashboard KPI + charts; default filter last two months; search and reset

### Tooling

- Duplicate-safe Mongo seed: `npm run seed:dev` in the server project
- Backend `vercel.json` Node serverless mapping
- CORS entries for local CRA and Netlify host `brickfactorypro.netlify.app`

### Known incomplete items (not planned work—observed)

See “Limitations” in [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md).
