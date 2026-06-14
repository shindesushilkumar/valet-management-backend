## ADDED Requirements

### Requirement: User role storage
The users table SHALL store a `role` field for each user. Valid values SHALL be `owner`, `driver`, or `admin`.

#### Scenario: Existing user receives default role
- **WHEN** the migration completes on a database with existing users
- **THEN** every existing user SHALL have `role = 'owner'`

#### Scenario: New user registration
- **WHEN** a new user is created by the application
- **THEN** the user SHALL be assigned `role = 'owner'` unless explicitly set otherwise

### Requirement: Role exposure in user responses
The user serializer/DTO SHALL include the `role` field when returning user objects from the API.

#### Scenario: Fetch current user
- **WHEN** a client requests the current user profile
- **THEN** the response SHALL contain a `role` property with value `owner`, `driver`, or `admin`

#### Scenario: List users
- **WHEN** an admin requests a list of users
- **THEN** each user object in the response SHALL include the `role` field
