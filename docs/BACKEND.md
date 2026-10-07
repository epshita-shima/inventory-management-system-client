# Backend architecture

Entry: `src/server.js` → `mongoose.connect(config.database_url)` → `app.listen(config.port)`.

App: `src/app.js`.

## Layers

```
HTTP → route → controller → service → Mongoose model
```

| Layer | Role |
|---|---|
| `*.route.js` | Express Router, HTTP verbs |
| `*.controller.js` | Read `req.query` / `req.body` / `req.params`, call service, `res.json` |
| `*.service.js` | `find`, `insertMany`, `findByIdAndUpdate`, aggregations |
| `*.model.js` | Schema |

Auth skips a separate controller: routes call `auth.service.js` functions.

## Middleware

| Middleware | File | Use |
|---|---|---|
| CORS | `app.js` | Fixed origin allowlist + credentials |
| cookie-parser | `app.js` | Refresh cookie |
| express.json / urlencoded | `app.js` | Body |
| Multer `dynamicFields` | `module/multer/configuration.js` | `upload.any()`, PNG/JPG, 2MB, parse body JSON |
| static `/uploads` | `app.js` | Uploaded files |
| `verifyToken` | `middlewares/verifyToken.js` | JWT + cookie + blacklist (**users/me only**) |
| `loggerTestMiddleware` | login POST | Logging hook |
| `globalErrorHandler` | last | ValidationError / ApiError |

`loggerTestMiddleware` and Winston (`shared/logger.js`) exist; coverage of all routes is not universal.

## Authentication middleware

`verifyToken`:

- Reads `Authorization` Bearer token and `cookies.cookie`.
- Both required.
- Rejects if refresh token is in `blacklist` array.
- `jwt.verify` with `ACCESS_SECRET_TOKEN`.
- Sets `req.loginUser`.

Commented code in `app.js` would apply this to every `/api/v1` route; it is disabled.

## Validation

- Mongoose `required` on schemas (cast/validation errors).
- Ad hoc checks (login username/password present).
- Duplicate username checked in `user.service` create (`findOne` username).
- No centralized Joi/Zod layer.

## Error handling

`errors/ApiError.js` custom error with statusCode.  
`handleValidatorError.js` flattens Mongoose validation.  
`globalErrorHandler` returns JSON; stack omitted when `NODE_ENV === "production"`.

Many controllers catch errors themselves and never hit the global handler.

## Utilities

| File | Role |
|---|---|
| `config/index.js` | env |
| `shared/logger.js` | Winston daily rotate |
| `auth/blacklistToken.js` | in-memory array |
| `scripts/seed-dev-inventory.js` | duplicate-safe sample data |

## Environment (names only)

See [DEPLOYMENT.md](./DEPLOYMENT.md). Do not commit real secret values.
