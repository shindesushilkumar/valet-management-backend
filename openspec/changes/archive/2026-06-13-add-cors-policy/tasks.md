## 1. Dependency and configuration setup

- [x] 1.1 Add the `cors` package to backend dependencies.
- [x] 1.2 Add `CORS_ALLOWED_ORIGINS` to `.env.example` with a documented comma-separated origin format.
- [x] 1.3 Add a small helper in `src/main.ts` to parse `CORS_ALLOWED_ORIGINS` into a trimmed, non-empty origin array.

## 2. CORS middleware implementation

- [x] 2.1 Import `cors` and `ConfigService` in `src/main.ts`.
- [x] 2.2 Configure `cors` options with allowed origins, `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS` methods, and allowed request headers.
- [x] 2.3 Register `app.use(cors(options))` before `app.listen` so the policy applies globally.
- [x] 2.4 Keep credentials disabled by default and only enable them when explicit configuration requires cookie-based browser authentication.

## 3. Validation and cleanup

- [x] 3.1 Run `npm install` or the project package manager command to update the lockfile after adding `cors`.
- [x] 3.2 Run `npm run lint` to verify TypeScript formatting and linting.
- [x] 3.3 Run `npm test` to verify existing tests still pass.
- [x] 3.4 Start the backend and verify CORS headers for an allowed origin and absence of permissive headers for an unallowed origin.
