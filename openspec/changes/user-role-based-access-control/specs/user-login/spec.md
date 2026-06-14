## MODIFIED Requirements

### Requirement: Login with registered credentials
The system SHALL authenticate a user when a client submits a registered email and matching password. The system MUST return a signed bearer access token and the authenticated user identity including role, without exposing the password.

#### Scenario: Successful login
- **WHEN** a client sends `POST /auth/login` with a registered email and matching password
- **THEN** the system returns HTTP 200 with a bearer access token and the user id, email, and role

#### Scenario: Invalid login credentials
- **WHEN** a client sends `POST /auth/login` with an unknown email or a password that does not match the stored hash
- **THEN** the system returns HTTP 401 and does not issue a token

## MODIFIED Requirements

### Requirement: Validate bearer token for protected routes
The system SHALL allow protected API requests only when they include a valid bearer access token and the requesting user's role satisfies the required access level. The system MUST reject missing, expired, malformed, or unverifiable tokens, and MUST reject requests where the user's role does not meet the guard requirements.

#### Scenario: Valid bearer token access
- **WHEN** a client calls a protected endpoint with a valid bearer access token and sufficient role
- **THEN** the system allows the request and exposes the authenticated user id and role to the request context

#### Scenario: Missing bearer token access
- **WHEN** a client calls a protected endpoint without an `Authorization: Bearer <token>` header
- **THEN** the system returns HTTP 401 and does not execute the protected handler

#### Scenario: Invalid bearer token access
- **WHEN** a client calls a protected endpoint with an expired, malformed, or unverifiable bearer token
- **THEN** the system returns HTTP 401 and does not expose request context for the token

#### Scenario: Insufficient role access
- **WHEN** a client calls a role-protected endpoint with a valid bearer token but the user's role does not satisfy the required access level
- **THEN** the system returns HTTP 403 and does not execute the protected handler

## ADDED Requirements

### Requirement: Role-based route protection
The system SHALL enforce role-based access control on protected routes by validating the authenticated user's role against required roles before executing handler logic.

#### Scenario: Admin-only route access
- **WHEN** a client with role `admin` calls an admin-only endpoint with a valid token
- **THEN** the system executes the handler and returns the response

#### Scenario: Non-admin blocked from admin route
- **WHEN** a client with role `owner` or `driver` calls an admin-only endpoint with a valid token
- **THEN** the system returns HTTP 403 and does not execute the handler
