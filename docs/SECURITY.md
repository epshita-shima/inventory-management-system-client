# Security

Mechanisms that **exist in code**, and gaps that are **visible**.

## Implemented

| Control | Where |
|---|---|
| Password hashing (bcrypt) | `user.service.js` on create/update password |
| JWT access token (10m) | `auth.service.js` |
| Refresh JWT in httpOnly cookie | name `cookie` |
| Token payload without password | `buildAuthTokenPayload` |
| User JSON sanitization | strips `password`, `hashPassword` |
| Login does not persist secrets to localStorage | `sanitizeUser` + client storage helper |
| Frontend route guard | `RequireAuth` + menu flags |
| Menu CRUD/PDF flags | user `menulist` |
| RTK reauth on expired access token | `apiSlice.js` |
| Inactivity logout | 10 minutes |
| Logout blacklist (refresh) | in-memory array |
| CORS allowlist | two origins |
| Multer type/size limits | jpg/png, 2MB |
| Error stack hidden in production | `globalErrorHandler` |
| Form validation | Formik/Yup (browser) |

## Authorization reality

- Server does **not** check menu permissions on PO/GRN/invoice routes.
- `app.use('/api/v1', verifyToken, routes)` is **commented out**.
- Knowing the API URL is enough to call almost every endpoint.

## Token refresh

Documented in [AUTHENTICATION.md](./AUTHENTICATION.md). Refresh requires the httpOnly cookie; access token is in `localStorage` (XSS can steal it).

## Input validation

Mongoose `required` + some controllers. No systematic sanitization library. Clients send ObjectId strings; invalid ids typically 500/null from `findById`.

## Cookie flags

`secure: false` — cookies can be sent over HTTP. `sameSite: "strict"` reduces CSRF on cross-site posts.

## Password verification fallback

Non-bcrypt stored values still match with `===` plaintext. Migrate remaining rows to hashes.

## Secrets

Environment variables only. **Do not** copy `.env` contents into git or documentation. Rotate any secret that was ever committed.

## Firebase

`src/lib/firebase.js` holds a Firebase web config object. It is **not** used by `LoginWithUsername`. Treat unused keys as sensitive anyway.
