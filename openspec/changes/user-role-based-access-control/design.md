## Context

The user table currently lacks role-based access control. The application uses NestJS with TypeORM and MySQL. Adding a role field requires a database migration, updates to user entity/DTOs, and ensuring the role serializes correctly in API responses.

## Goals / Non-Goals

**Goals**
- Add a `role` column to the users table
- Assign `owner` as the default role for all new users
- Include `role` in user responses returned by the API
- Implement granular permission checks and route guards based on user roles
- Modify existing business logic to act on user roles (`owner`, `driver`, `admin`)
- Keep changes backward compatible

**Non-Goals**
- Allow clients to set roles on registration
- Build a UI for role management

## Decisions

- **Role storage**: Use a MySQL `ENUM('owner', 'driver', 'admin')` column with a default of `'owner'`.
- **Default assignment**: Enforced at both the database column default and in the application entity definition to prevent application bugs.
- **Response inclusion**: Update the user serializer/DTO to expose `role` so the frontend receives it without additional requests.
- **Migration strategy**: Add the column as non-nullable with a default to avoid downtime; backfill existing users to `owner` during migration.
- **Authorization guard**: Implement a NestJS `RolesGuard` that reads required roles from a `@Roles(...)` metadata decorator and compares them against the authenticated user's role in the JWT payload. Combine with existing `AuthGuard` to gate protected endpoints.
- **Car management permissions**: `owner` and `admin` can register, update, and delete cars. `driver` can only view assigned cars. `admin` bypasses ownership checks for cross-user operations.
- **Registration hardening**: Strip `role` from the registration DTO and force assignment in the service layer to prevent client-side role elevation.

## Risks / Trade-offs

- **Migration failure on existing NULL rows** → Mitigation: provide `DEFAULT 'owner'` in the migration and an explicit backfill statement before setting NOT NULL.
- **Enum rigidity** → If roles are expected to change frequently, a lookup table would be preferable. For now, ENUM avoids join complexity.
- **Breaking API consumers** → Adding a new field to responses is backward compatible; existing clients ignore unknown fields.
- **Guard bypass if service layer skips checks** → Mitigation: implement role checks at both the controller guard and service layer for defense-in-depth.
