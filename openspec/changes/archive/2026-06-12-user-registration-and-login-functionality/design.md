## Context

The current backend is a small NestJS application with `AppModule`, `AppController`, and `AppService` only. There is no user model, authentication module, token strategy, or protected API surface. The change adds the minimum secure account identity foundation needed for a valet services platform.

## Goals / Non-Goals

**Goals:**
- Add server-side user registration and login APIs.
- Store users in MySQL with unique email values and hashed passwords.
- Issue and validate bearer tokens for authenticated requests.
- Keep the implementation modular, testable, and aligned with NestJS conventions.

**Non-Goals:**
- Password reset, email verification, OAuth/social login, refresh tokens, role-based permissions, and frontend screens are excluded.

## Decisions

### Use NestJS modules for auth boundaries
Create a dedicated `AuthModule` that owns registration, login, token issuance, and validation. This keeps identity behavior separate from unrelated app features and makes future auth features easier to add.

Alternative considered: implement auth directly in `AppModule`. Rejected because it would mix core identity behavior with general app setup and make testing harder.

### Store users with TypeORM and MySQL
Add a `User` entity with `id`, `fname`, `lname`, `email`, `passwordHash`, and timestamps. Enforce email uniqueness at the database layer, not only through application validation.

Alternative considered: in-memory or JSON persistence. Rejected because the project context requires MySQL and production-ready uniqueness guarantees.

### Hash passwords with bcrypt
Hash passwords before storage and compare submitted passwords during login. Use a configured salt-round value so password cost can be tuned later.

Alternative considered: plain-text password storage. Rejected because it exposes users to credential compromise if data is leaked.

### Issue short-lived JWT access tokens
Login returns a signed JWT containing the user id and email. The token is validated by a NestJS guard before protected routes can execute.

Alternative considered: opaque session tokens stored in the database. Rejected because JWT validation is simpler for the first implementation and avoids an extra session lookup on every request.

### Validate DTOs at module boundaries
Use NestJS DTOs with class-validator/class-transformer for registration and login payloads. Controllers should receive typed input and return typed responses.

Alternative considered: manual validation inside services. Rejected because DTO validation centralizes payload rules and improves API consistency.

## Risks / Trade-offs

- JWT access tokens can remain usable until expiry if stolen → Keep initial expiry short and leave room to add refresh-token revocation later.
- Password hashing adds latency to registration and login → Acceptable for auth flows; tune bcrypt rounds if tests or production latency show issues.
- MySQL schema changes must be deployed before application code uses the user table → Run migrations before or with the application release and keep rollback SQL ready.
- No role-based authorization is included → Protected endpoints can only distinguish authenticated versus unauthenticated requests for this change.

## Migration Plan

1. Add auth-related dependencies and imports.
2. Add the `User` entity and migration/schema changes for MySQL.
3. Add DTOs, auth service, auth controller, JWT strategy/guard, and module wiring.
4. Add API tests for registration, login, duplicate users, invalid credentials, and protected endpoints.
5. Deploy database changes first, then deploy backend code.
6. Roll back by reverting backend code and dropping the migration if no users were created; otherwise preserve the table and disable the endpoints until a safe migration path is defined.

## Open Questions

- What JWT expiry duration should be used for the first release? 30 minutes
- Which user type is registering first: valet staff, customer, admin, or multiple roles? customer
- What password policy is required by product or compliance? Minimum 8 characters password with the mix of uppercase, lowercase, number, and special characters
