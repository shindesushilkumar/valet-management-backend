## 1. Database schema

- [x] 1.1 Add `flatNumber: string` to `src/users/user.entity.ts` mapped to the `flat_number` column and marked non-nullable.
- [x] 1.2 Create a new TypeORM migration after `1775916000000-CreateUsersTable.ts` that adds `flat_number VARCHAR(255) NOT NULL` to `users`.
- [x] 1.3 Update runtime and CLI TypeORM migration configuration to include the new migration.

## 2. Registration API implementation

- [x] 2.1 Add `flatNumber` validation to `src/auth/dto/register-user.dto.ts` so missing or whitespace-only values are rejected.
- [x] 2.2 Update `src/auth/dto/auth-response.dto.ts` so `UserResponseDto` includes `flatNumber`.
- [x] 2.3 Update `src/auth/auth.service.ts` to persist `dto.flatNumber.trim()` when creating users and return it from `toUserResponse`.

## 3. Tests and specs

- [x] 3.1 Update `src/auth/auth.service.spec.ts` to assert registration persists flat number and returns it in the response.
- [x] 3.2 Update `test/auth.e2e-spec.ts` to include `flatNumber` in valid registration payloads and assert the service receives it.
- [x] 3.3 Add e2e coverage for missing and empty `flatNumber` registration payloads returning HTTP 400.
- [x] 3.4 Update `openspec/specs/user-registration/spec.md` with the final registration requirements after implementation.

## 4. Verification

- [x] 4.1 Run `npm run lint` and fix any reported issues.
- [x] 4.2 Run `npm test -- auth.service.spec.ts` and fix any failing unit tests.
- [x] 4.3 Run `npm run test:e2e -- auth.e2e-spec.ts` and fix any failing e2e tests.
