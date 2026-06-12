## 1. Create Car Entity and DTOs

- [x] 1.1 Create car.entity.ts with id, carNumber, userId, createdAt, updatedAt, deletedAt columns
- [x] 1.2 Create create-car.dto.ts with carNumber validation
- [x] 1.3 Create update-car.dto.ts with optional carNumber field
- [x] 1.4 Create car-response.dto.ts for API response shape

## 2. Create Cars Module

- [x] 2.1 Create cars/cars.module.ts with TypeORM imports
- [x] 2.2 Create cars/cars.controller.ts with route decorators
- [x] 2.3 Create cars/cars.service.ts with CRUD methods
- [x] 2.4 Configure controller routes: POST /cars, GET /cars, PATCH /cars/:id, DELETE /cars/:id
- [x] 2.5 Apply JWT authentication guard to all endpoints

## 3. Database Migration

- [x] 3.1 Generate TypeORM migration for cars table
- [x] 3.2 Add foreign key constraint to users table
- [x] 3.3 Run migration against development database

## 4. Register Module

- [x] 4.1 Import CarsModule in app.module.ts
- [x] 4.2 Export CarsModule for potential cross-module use