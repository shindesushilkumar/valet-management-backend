## Why

The current car entity only tracks a generic `carNumber` field, which is insufficient for valet services that need detailed vehicle information. Replacing it with structured fields (make, model, registration number, color) enables better vehicle identification, improves user experience when managing cars, and supports valet operations that require specific vehicle details.

## What Changes

- **BREAKING**: Replace `carNumber` field with `make`, `model`, `registrationNumber`, and `color` fields in the Car entity
- Update CreateCarDto to accept make, model, registrationNumber, and color instead of carNumber
- Update UpdateCarDto to support the new fields
- Update CarResponseDto to return the new field structure
- Modify CarsService create and update methods to handle the new fields
- No API endpoint changes (same endpoints, different payload structure)

## Capabilities

### New Capabilities

None - this is a schema change to an existing capability.

### Modified Capabilities

- `user-cars`: Change car registration requirements to include make, model, registration number, and color instead of just car number. Update car update requirements to allow modification of these new fields.

## Impact

- Database migration required to alter the `cars` table structure
- Breaking change to API request/response format
- No changes to authentication or authorization logic
- Existing tests will need updates to reflect new field structure