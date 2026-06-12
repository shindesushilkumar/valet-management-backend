## Context

The valet management system currently has a `users` table with basic user information (id, firstName, lastName, flatNumber, email, passwordHash). Users need to register their vehicles so valet operators can identify cars belonging to residents. This requires a one-to-many relationship between users and cars.

## Goals / Non-Goals

**Goals:**
- Create a `cars` table with car number and user reference
- CRUD API endpoints for authenticated users to manage their cars
- Soft delete to preserve historical data when cars are removed

**Non-Goals:**
- No car number format validation
- No bulk operations
- No car metadata (model, color, year)

## Decisions

### Decision: Separate cars table with foreign key
- **Chosen**: Create a dedicated `cars` table with `user_id` foreign key
- **Rationale**: One-to-many relationship allows multiple cars per user; normalized data structure
- **Alternative considered**: Embedding car numbers as JSON array in users table - rejected due to query complexity and no soft delete capability

### Decision: Soft delete with deletedAt column
- **Chosen**: Use TypeORM soft delete with `deleted_at` column
- **Rationale**: Preserves historical data for valet records while hiding from active queries
- **Alternative considered**: Hard delete - rejected because valet history would lose car references

### Decision: RESTful endpoints under /cars
- **Chosen**: `POST /cars`, `GET /cars`, `PATCH /cars/:id`, `DELETE /cars/:id`
- **Rationale**: Consistent with NestJS conventions and existing API patterns
- **Alternative considered**: GraphQL - rejected as the codebase uses REST

### Decision: User-scoped queries
- **Chosen**: All car operations scoped to authenticated user via JWT
- **Rationale**: Security - users can only see/manage their own cars
- **Alternative considered**: Admin-only access - rejected as users need self-service

## Risks / Trade-offs

- [Risk] Car number uniqueness not enforced at DB level
  → Mitigation: Application-level validation for user's car numbers
- [Risk] No car number format validation
  → Mitigation: Add basic non-empty string validation in DTO