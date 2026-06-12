## ADDED Requirements

### Requirement: Login with registered credentials
The system SHALL authenticate a user when a client submits a registered email and the matching password. The system MUST return a signed bearer access token and the authenticated user identity without exposing the password.

#### Scenario: Successful login
- **WHEN** a client sends `POST /auth/login` with a registered email and matching password
- **THEN** the system returns HTTP 200 with a bearer access token and the user id and email

#### Scenario: Invalid login credentials
- **WHEN** a client sends `POST /auth/login` with an unknown email or a password that does not match the stored hash
- **THEN** the system returns HTTP 401 and does not issue a token

### Requirement: Validate bearer token for protected routes
The system SHALL allow protected API requests only when they include a valid bearer access token. The system MUST reject missing, expired, malformed, or unverifiable tokens.

#### Scenario: Valid bearer token access
- **WHEN** a client calls a protected endpoint with a valid bearer access token
- **THEN** the system allows the request and exposes the authenticated user id to the request context

#### Scenario: Missing bearer token access
- **WHEN** a client calls a protected endpoint without an `Authorization: Bearer <token>` header
- **THEN** the system returns HTTP 401 and does not execute the protected handler

#### Scenario: Invalid bearer token access
- **WHEN** a client calls a protected endpoint with an expired, malformed, or unverifiable bearer token
- **THEN** the system returns HTTP 401 and does not expose request context for the token
