## Why

The valet services platform currently lacks granular user access control. All users have identical permissions, making it difficult to restrict admin-level operations or differentiate between service owners and drivers. A role-based access control (RBAC) system is needed to align the platform with standard identity management practices and prepare for future business logic that depends on user context.

## What Changes

- Add a `role` column to the user database table with valid values: `owner`, `driver`, `admin`
- Set `owner` as the default role for new users
- Update user serializer/DTOs to include the `role` field in API responses
- Apply database migration to add the new column
- Introduce granular permission checks and route guards based on user roles
- Modify existing business logic to act on user roles (`owner`, `driver`, `admin`)

## Capabilities

### New Capabilities
- `user-roles`: Manage user roles with default owner assignment and expose role in responses

### Modified Capabilities
- `user-login`: Add role-based guards and authorization checks for protected routes
- `user-cars`: Restrict car management operations by user role
- `user-registration`: Ensure new users always receive default `owner` role

## Impact

- Database schema (new `role` column in users table)
- User DTOs/serializers (include role in responses)
- User creation flow (default role assignment)
- Authorization layer (route guards and role checks)
- No breaking changes to existing API contract

## Non-goals

- Do not support role assignment at registration time via public API
- Do not create a UI for role management in this change
