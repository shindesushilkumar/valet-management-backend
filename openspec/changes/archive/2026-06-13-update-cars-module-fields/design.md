## Context

The Car entity currently uses a single `carNumber` field to identify vehicles in the valet management system. This field has been identified as insufficient for valet operations where detailed vehicle identification (make, model, color) is crucial for proper vehicle handling and retrieval.

The current database schema has a `car_number` column. This change requires migrating to a more structured representation.

## Goals / Non-Goals

**Goals:**
- Replace `carNumber` with four distinct fields for better vehicle identification
- Maintain existing API endpoints (backwards compatible within the same deployment)
- Preserve soft-delete functionality
- Update all related DTOs and service logic

**Non-Goals:**
- Database migration scripts (handled by TypeORM but not specified in detail)
- Frontend UI changes
- Adding additional fields beyond make, model, registrationNumber, color

## Decisions

- **Field Types**: All new fields will be non-nullable strings with appropriate length constraints to match business requirements for vehicle data
- **Database Columns**: Use snake_case naming convention consistent with existing codebase (`car_make`, `car_model`, `registration_number`, `color`)
- **Validation**: Apply IsString and IsNotEmpty decorators to all fields in DTOs to match the existing validation pattern
- **Service Logic**: Update `toResponse` method to map all new fields, maintaining the same response structure pattern

## Risks / Trade-offs

- [Existing Data Loss] → Existing `car_number` data cannot be migrated to the new fields automatically; will require manual intervention or data migration process
- [Breaking API Change] → API clients will need to update their payloads; no backward compatibility with old `carNumber` field