# Deployment and environment

Documented **only** from config files and code. No live credentials.

## Frontend deployment

- CRA production build: `npm run build` in `inventory-management-client` → `build/`.
- CORS allowlist includes `https://brickfactorypro.netlify.app` (Netlify).
- Client `.env` comments mention other backends (`ecoinventorybackend.malihagroup-bd.com`, `meb-inventory-backend.vercel.app`) but the active variable is `REACT_APP_BASE_URL`.
- No `netlify.toml` in the repo; Netlify would be configured in the host UI or a file not present here.

## Backend deployment

- `inventroy-management-server/vercel.json` builds `src/server.js` with `@vercel/node` and rewrites `/(.*)` to that file.
- `npm start` → `node src/server.js`.
- No Dockerfile/docker-compose in the repo.

## Environment variables

| Variable | Purpose | App | Required |
|---|---|---|---|
| `REACT_APP_BASE_URL` | API origin (no trailing path required; client prefixes `/api/v1`) | Frontend | Yes for API calls |
| `DATABASE_URL` | MongoDB connection string | Backend | Yes |
| `PORT` | HTTP listen port | Backend | Yes in practice |
| `NODE_ENV` | `development` / `production` (error stack hiding) | Backend | Recommended |
| `ACCESS_SECRET_TOKEN` | Sign/verify access JWT | Backend | Yes for login |
| `REFRESH_SECRET_TOKEN` | Sign/verify refresh JWT | Backend | Yes for refresh |
| `FRONTEND_URL` | Referenced in **commented** CORS; not used by the active allowlist | Backend | No (unused in running CORS) |

**Placeholders (never commit real values):**

```
REACT_APP_BASE_URL=http://localhost:5000
DATABASE_URL=mongodb+srv://USER:********@HOST/DB
PORT=5000
NODE_ENV=development
ACCESS_SECRET_TOKEN=********
REFRESH_SECRET_TOKEN=********
```

Other keys may exist in a local `.env` (for example leftover password notes). Only variables **read by application code** are listed above (`config/index.js`, `process.env` in auth/CORS comments, CRA `REACT_APP_BASE_URL`).

## Database

`mongoose.connect(process.env.DATABASE_URL)` in `server.js`. Database name is the path in the URI (this project has used `test` on Atlas in development).

## CORS

Active:

```javascript
origin: ["http://localhost:3000", "https://brickfactorypro.netlify.app"]
credentials: true
```

Local UI on any other origin will be blocked.

## Commands

**Backend** (`inventroy-management-server`):

```bash
npm install
# create .env
npm start
npm run seed:dev   # optional sample data; duplicate-safe
```

**Frontend** (`inventory-management-client`):

```bash
npm install
# .env with REACT_APP_BASE_URL
npm start          # http://localhost:3000
npm run build
npm test           # CRA test runner; few/no domain tests
```

## Production notes from code

- Refresh cookie `secure: false` — not suitable as-is for HTTPS-only production.
- JWT blacklist is in-memory — multi-instance (Vercel) will not share logout state.
- `verifyToken` is not applied globally.
