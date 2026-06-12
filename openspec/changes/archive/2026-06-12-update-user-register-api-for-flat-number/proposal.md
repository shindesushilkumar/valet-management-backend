## Why

Valet service operations need to associate each registered user with a mandatory flat number so downstream booking, access, and service workflows can identify the correct residence without additional profile updates.

## What Changes

- **BREAKING**: `POST /auth/register` requires a non-empty `flatNumber` field; requests without it return HTTP 400.
- User registration persists the submitted flat number on the new user record.
- Registration response includes the saved flat number.
- The users database table receives a non-nullable `flat_number` column.
- Existing migration setup is updated so the database schema reflects the mandatory field.
- Unit and e2e tests are updated to cover required, valid, duplicate, and invalid registration payloads.

## Capabilities

### New Capabilities

### Modified Capabilities

- `user-registration`: Registration now requires `flatNumber` in the request, persists it, and returns it in the created user response.

## Non-goals

- Do not change login, token claims, or authenticated user lookup behavior.
- Do not add a separate profile update API.
- Do not change password policy or email uniqueness behavior.

## Impact

- `src/auth/dto/register-user.dto.ts`
- `src/auth/auth.service.ts`
- `src/users/user.entity.ts`
- `src/app.module.ts`
- `src/database/typeorm.config.ts`
- `src/database/migrations/*`
- `src/auth/auth.service.spec.ts`
- `test/auth.e2e-spec.ts`
- `openspec/specs/user-registration/spec.md`
