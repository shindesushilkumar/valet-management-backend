## 1. Database Migration

- [x] 1.1 Create migration file to add `role` ENUM('owner', 'driver', 'admin') column to users table with default 'owner'
- [x] 1.2 Add backfill statement to set existing NULL roles to 'owner'
- [x] 1.3 Verify migration runs successfully on local MySQL

## 2. Entity & DTO Updates

- [x] 2.1 Add `role` property to user entity with ENUM type and default value
- [x] 2.2 Update user serializer/DTO to include `role` field
- [x] 2.3 Confirm all user response types now include `role`

## 3. Authorization Infrastructure

- [x] 3.1 Create `Roles` decorator to specify allowed roles for route handlers
- [x] 3.2 Implement `RolesGuard` to enforce role-based access control
- [x] 3.3 Integrate `RolesGuard` with existing `AuthGuard` for combined authentication and authorization
- [x] 3.4 Add helper to extract verified roles from JWT payload

## 4. Apply Route Guards

- [x] 4.1 Apply admin-only guard to admin management routes
- [x] 4.2 Apply owner/admin guard to car registration routes (`POST /cars`)
- [x] 4.3 Apply owner/admin guard to car update routes (`PATCH /cars/:id`)
- [x] 4.4 Apply owner/admin guard to car delete routes (`DELETE /cars/:id`)
- [x] 4.5 Ensure driver role is blocked from car management operations

## 5. Business Logic Role Checks

- [x] 5.1 Update car service to validate user role before car CRUD operations
- [x] 5.2 Add role checks inside service methods for defense-in-depth
- [x] 5.3 Ensure admin users can view/modify all cars regardless of ownership

## 6. Registration Role Enforcement

- [x] 6.1 Ensure registration always sets `role = 'owner'` regardless of input
- [x] 6.2 Strip any `role` field from registration DTO to prevent client override

## 7. Validation & Testing

- [x] 7.1 Write unit tests for `RolesGuard` covering all role scenarios
- [x] 7.2 Add integration tests for each protected route with different roles
- [x] 7.3 Verify driver cannot access restricted endpoints (expect 403)
- [x] 7.4 Verify admin can access all endpoints
- [x] 7.5 Ensure e2e tests pass with new schema and guards

## 8. Finalization

- [x] 8.1 Run lint and typecheck
- [x] 8.2 Commit changes with conventional commit message
