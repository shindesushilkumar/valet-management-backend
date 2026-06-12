## Why

The backend currently has only a health-check API and no account identity layer. Adding registration and login is needed so valet platform users can create accounts, authenticate securely, and access protected operations.

## What Changes

- Add a user registration endpoint that creates users with validated email/password data.
- Add a login endpoint that verifies credentials and returns an authentication token.
- Add protected-session middleware or guards for authenticated requests.
- Add persistence for users in MySQL with unique email enforcement.
- Add request/response DTOs and validation for auth payloads.
- Add tests for registration, login, duplicate users, invalid credentials, and protected routes.

## Non-goals

- Password reset, email verification, OAuth/social login, and role-based permissions are not included.
- Frontend registration or login screens are not included.

## Capabilities

### New Capabilities
- `user-registration`: user creation, password hashing, email uniqueness, and validation.
- `user-login`: credential verification, token issuance, and authentication state.

### Modified Capabilities
- None.

## Impact

Affected areas include NestJS modules/controllers/services, MySQL user persistence, DTO validation, authentication middleware/guards, dependency setup for password hashing and JWT issuance, and backend API tests.
