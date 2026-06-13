## Context

The backend is a NestJS API currently bootstrapped in `src/main.ts` with global configuration and no centralized CORS middleware. Browser-based clients need explicit cross-origin access, while non-browser clients should continue to work through the existing HTTP routes.

## Goals / Non-Goals

**Goals:**

- Add a single NestJS CORS configuration point using the `cors` package.
- Configure trusted browser origins from environment variables.
- Preserve existing API behavior for same-origin and non-browser clients.

**Non-Goals:**

- No new API endpoints.
- No authentication or authorization changes.
- No proxy, ingress, or firewall configuration.

## Decisions

### Use the `cors` package as Express middleware

NestJS runs on Express by default through `@nestjs/platform-express`, and the existing app bootstrap is the natural place to register global HTTP middleware. The `cors` package is purpose-built for this and avoids a custom middleware implementation.

Alternatives considered:

- Manual `app.enableCors()` configuration: viable, but the requested change is specifically to use the `cors` package.
- Per-controller or per-route middleware: unnecessary because CORS is a global HTTP policy.

### Store origins in environment configuration

Allowed origins should come from an environment variable such as `CORS_ALLOWED_ORIGINS`, split into an array at bootstrap. This keeps development, staging, and production policies separate without code changes.

Alternatives considered:

- Hard-coded origins: simple but unsafe for production and inconvenient across environments.
- Wildcard origin: convenient but too permissive for an authenticated valet platform.

### Disable credentials by default

`credentials` should be disabled unless a trusted origin explicitly needs cookie-based authentication. This reduces accidental credential leakage to untrusted browser origins.

Alternatives considered:

- Always enable credentials: more convenient for cookie auth but increases risk if an origin is misconfigured.
- Per-origin credential mapping: more precise but more complex than the current requirement.

## Risks / Trade-offs

- [Misconfigured origins can block legitimate browser clients] → Validate the origin list during local testing and document the expected comma-separated format.
- [Credentials disabled by default may require a follow-up change for cookie auth] → Keep the design explicit so future credential support is intentional.
- [Adding a package changes dependency surface] → Add only the `cors` package and keep the configuration centralized.

## Migration Plan

1. Add `cors` to backend dependencies.
2. Add `CORS_ALLOWED_ORIGINS` to `.env.example` and set environment-specific values during deploy.
3. Update `src/main.ts` to import `cors`, resolve the origin list from `ConfigService`, and register it with `app.use(cors(options))` before `app.listen`.
4. Start the backend and verify a browser request from an allowed origin receives CORS headers.
5. Roll back by reverting the dependency and removing the middleware registration.

## Open Questions

- Which frontend or admin origins should be trusted in production?
- Will any browser client need cookie-based credentials, or is token-based authorization sufficient?
