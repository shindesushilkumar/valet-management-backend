## 1. Project setup

- [x] 1.1 Add NestJS auth, TypeORM, MySQL, bcrypt, and JWT dependencies to package.json
- [x] 1.2 Install dependencies and verify lockfile updates
- [x] 1.3 Add environment configuration for MySQL connection and JWT secret/expiry

## 2. Database model

- [x] 2.1 Create the User entity with id, email, passwordHash, createdAt, and updatedAt fields
- [x] 2.2 Add a unique database constraint for email
- [x] 2.3 Add or update the migration that creates the users table
- [x] 2.4 Register TypeORM and the User repository in AuthModule

## 3. Registration implementation

- [x] 3.1 Create registration request DTOs with email and password validation
- [x] 3.2 Create registration response DTOs that exclude password data
- [x] 3.3 Implement AuthService.register to validate uniqueness, hash the password, and persist the user
- [x] 3.4 Implement AuthController POST /auth/register and map duplicate-email errors to HTTP 409

## 4. Login and token validation

- [x] 4.1 Create login request and response DTOs
- [x] 4.2 Implement AuthService.login to compare passwords and issue a signed JWT
- [x] 4.3 Implement JWT auth guard and request-context user type
- [x] 4.4 Implement AuthController POST /auth/login and return HTTP 401 for invalid credentials
- [x] 4.5 Add one protected test endpoint or guard usage that exposes the authenticated user id

## 5. Module wiring and API behavior

- [x] 5.1 Wire AuthModule into AppModule without mixing auth logic into AppController
- [x] 5.2 Configure global or module-level validation pipes for DTO validation
- [x] 5.3 Document auth routes in an OpenAPI-compatible controller if OpenAPI is present

## 6. Tests and validation

- [x] 6.1 Add unit tests for password hashing, duplicate registration, and invalid login
- [x] 6.2 Add API tests for registration success, duplicate email, login success, and invalid credentials
- [x] 6.3 Add API tests for protected routes with valid, missing, and invalid bearer tokens
- [x] 6.4 Run lint, typecheck/build, and test commands; fix any failures
