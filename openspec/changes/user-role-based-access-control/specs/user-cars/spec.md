## MODIFIED Requirements

### Requirement: Register a car for authenticated user
The system SHALL allow an authenticated user with role `owner` or `admin` to register a new car by providing make, model, registration number, and color. The system MUST associate the car with the authenticated user and return the created car record with its ID. Users with role `driver` MUST NOT be permitted to register cars.

#### Scenario: Successful car registration
- **WHEN** an authenticated `owner` or `admin` sends `POST /cars` with valid make, model, registrationNumber, and color
- **THEN** the system creates a car record linked to the user and returns HTTP 201 with the car ID, make, model, registrationNumber, color, and user ID

#### Scenario: Car registration without authentication
- **WHEN** a client sends `POST /cars` without a valid bearer token
- **THEN** the system returns HTTP 401 and does not create a car record

#### Scenario: Car registration by driver
- **WHEN** an authenticated `driver` sends `POST /cars` with valid car data
- **THEN** the system returns HTTP 403 and does not create a car record

## MODIFIED Requirements

### Requirement: List all cars for authenticated user
The system SHALL return all active (non-deleted) cars belonging to the authenticated user when any authenticated user requests `GET /cars`. Admin users MAY additionally see all cars across all users.

#### Scenario: Successful car list retrieval
- **WHEN** an authenticated user sends `GET /cars`
- **THEN** the system returns HTTP 200 with an array of the user's car records including make, model, registrationNumber, and color

#### Scenario: Admin sees all cars
- **WHEN** an authenticated `admin` user sends `GET /cars`
- **THEN** the system returns HTTP 200 with all active car records across all users

#### Scenario: Car list without cars
- **WHEN** an authenticated user with no registered cars sends `GET /cars`
- **THEN** the system returns HTTP 200 with an empty array

## MODIFIED Requirements

### Requirement: Update car details
The system SHALL allow an authenticated user to update their car's make, model, registration number, and color. The system MUST only allow updates to cars owned by the requesting user. Users with role `driver` MUST NOT be permitted to update car records.

#### Scenario: Successful car update
- **WHEN** an authenticated `owner` or `admin` sends `PATCH /cars/:id` with valid make, model, registrationNumber, and color for their car
- **THEN** the system updates the car record and returns HTTP 200 with the updated car

#### Scenario: Update non-existent car
- **WHEN** an authenticated user sends `PATCH /cars/:id` for a car that does not exist or belongs to another user
- **THEN** the system returns HTTP 404 and does not modify any records

#### Scenario: Driver cannot update car
- **WHEN** an authenticated `driver` sends `PATCH /cars/:id` with valid car data
- **THEN** the system returns HTTP 403 and does not modify any records

## MODIFIED Requirements

### Requirement: Soft delete a car
The system SHALL allow an authenticated user to soft delete their car. The system MUST mark the car as deleted without removing the record. The system MUST only permit deletion by users with role `owner` or `admin`.

#### Scenario: Successful car deletion
- **WHEN** an authenticated `owner` or `admin` sends `DELETE /cars/:id` for their car
- **THEN** the system marks the car as deleted and returns HTTP 200

#### Scenario: Delete non-existent car
- **WHEN** an authenticated user sends `DELETE /cars/:id` for a car that does not exist or belongs to another user
- **THEN** the system returns HTTP 404 and does not modify any records

#### Scenario: Driver cannot delete car
- **WHEN** an authenticated `driver` sends `DELETE /cars/:id` for their car
- **THEN** the system returns HTTP 403 and does not modify any records

#### Scenario: Soft deleted car not returned
- **WHEN** an authenticated user sends `GET /cars` after soft deleting a car
- **THEN** the system returns HTTP 200 without the soft deleted car in the results
