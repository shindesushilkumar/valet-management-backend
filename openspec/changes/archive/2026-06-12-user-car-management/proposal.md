## Why

Users need to register their vehicles when using valet services. Currently, the system only tracks user identity but has no way to associate car license plate numbers with users. This prevents valet operators from knowing which cars belong to which residents.

## What Changes

- Create a new `cars` database table to store vehicle information
- Add RESTful API endpoints for car management (create, read, update, soft delete)
- Establish relationship between cars and users (one user can have multiple cars)
- Implement soft delete for cars to preserve historical data

## Capabilities

### New Capabilities
- `user-cars`: Manage car license plate registration for authenticated users

### Modified Capabilities
- `user-registration`: Extend user data model to include car associations

## Impact

- New `cars` table with `car_number` and `user_id` foreign key
- New API endpoints under `/cars` namespace
- Protected routes requiring authentication (JWT bearer token)
- MySQL database migration required

## Non-goals

- No car number validation (format, region-specific checks)
- No bulk import of car numbers
- No car model/year/color tracking