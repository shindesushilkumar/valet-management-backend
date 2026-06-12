## Context

User registration currently accepts `firstName`, `lastName`, `email`, and `password`, then creates a `users` row with `first_name`, `last_name`, `email`, and `password_hash`. The users table does not store a flat number, so downstream valet workflows cannot rely on registration data to identify a user's residence.

## Goals / Non-Goals

**Goals:**

- Make `flatNumber` a mandatory `POST /auth/register` field.
- Persist `flatNumber` as a non-nullable `flat_number` column on the users table.
- Return `flatNumber` in the registration response.
- Update unit and e2e tests to enforce the new requirement.

**Non-Goals:**

- Do not change login, JWT payload, or `GET /auth/me` response shape.
- Do not add a profile update endpoint.
- Do not change existing email uniqueness or password policy behavior.

## Decisions

### API field name: `flatNumber`

Use camelCase in request and response payloads to match existing DTO style (`firstName`, `lastName`). Persist it as `flat_number` in MySQL to match the existing column naming convention.

### Validation: non-empty trimmed string

`RegisterUserDto.flatNumber` should be validated as a string and rejected when missing or whitespace-only. This aligns with existing `firstName` and `lastName` validation and prevents storing unusable values.

### Database migration: non-nullable column

Add a new migration after `CreateUsersTable1775916000000` to add `flat_number VARCHAR(255) NOT NULL` to `users`. Existing rows must be populated before applying `NOT NULL` constraints in production-like environments.

Alternatives considered:

- Nullable column: simpler for existing rows but violates the requirement that flat number is mandatory.
- Default placeholder value: avoids migration failures but stores misleading data.

### Response DTO update

Add `flatNumber` to `UserResponseDto` and map it in `AuthService.toUserResponse`. This keeps the registration response consistent with the persisted user identity data.

## Risks / Trade-offs

- [Existing users lack flat numbers] → Backfill or defaulting strategy must be decided before applying a non-nullable migration to populated databases.
- [Breaking API contract] → Clients must be updated to send `flatNumber` on registration, otherwise they receive HTTP 400.
- [Migration order matters] → The new migration timestamp must be greater than the existing create-users migration.

## Migration Plan

1. Update `RegisterUserDto` to require and normalize `flatNumber`.
2. Update `User` entity to map `flatNumber` to `flat_number`.
3. Add a new TypeORM migration that adds the non-nullable `flat_number` column and update both runtime and CLI migration configuration.
4. Update `AuthService.register` to persist and return `flatNumber`.
5. Update unit and e2e tests for successful, missing, empty, duplicate, and invalid registration payloads.
6. Run tests and lint before implementation is considered complete.

Rollback strategy: revert the code changes, remove the new migration from `typeorm.config.ts`, and run `npm run migration:revert` before the migration is applied in shared environments.

## Open Questions

- What backfill value or process should be used for existing users if the production database already contains user rows?
- Should there be a maximum length for `flatNumber`, or should it match the existing 255-character string convention?
