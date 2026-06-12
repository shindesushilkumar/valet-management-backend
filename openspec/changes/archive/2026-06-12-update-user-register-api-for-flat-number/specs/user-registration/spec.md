## MODIFIED Requirements

### Requirement: Register user with email and password
The system SHALL create a new user account when a client submits a valid registration request containing a unique email address, a password that satisfies the configured password policy, and a non-empty flat number. The system MUST store only a bcrypt password hash, MUST persist the flat number, and MUST return the created user identity without exposing the password.

#### Scenario: Successful registration
- **WHEN** a client sends `POST /auth/register` with a valid unique email, first name, last name, password, and non-empty flat number
- **THEN** the system creates a user record, hashes the password, persists the flat number, and returns HTTP 201 with the user id, email, first name, last name, and flat number

#### Scenario: Duplicate email registration
- **WHEN** a client sends `POST /auth/register` with an email that already exists
- **THEN** the system returns HTTP 409 and does not create another user record

#### Scenario: Missing flat number
- **WHEN** a client sends `POST /auth/register` with a valid email, first name, last name, and password but no flat number
- **THEN** the system returns HTTP 400 and does not create a user record

#### Scenario: Empty flat number
- **WHEN** a client sends `POST /auth/register` with a valid email, first name, last name, and password but a blank or whitespace-only flat number
- **THEN** the system returns HTTP 400 and does not create a user record

#### Scenario: Invalid registration payload
- **WHEN** a client sends `POST /auth/register` with a missing email, invalid email format, missing password, weak password, missing first name, or missing last name
- **THEN** the system returns HTTP 400 and does not create a user record

### Requirement: Protect stored user credentials
The system MUST never store plaintext passwords and MUST compare submitted passwords against the stored bcrypt hash during credential checks.

#### Scenario: Password hash stored
- **WHEN** a user is created through registration
- **THEN** the stored user record contains a bcrypt password hash and never contains the submitted plaintext password
