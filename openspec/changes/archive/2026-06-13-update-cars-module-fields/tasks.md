## 1. Entity Updates

- [x] 1.1 Update Car entity to replace carNumber with make, model, registrationNumber, and color fields
- [x] 1.2 Run TypeORM migration or database sync to apply schema changes

## 2. DTO Updates

- [x] 2.1 Update CreateCarDto to include make, model, registrationNumber, and color fields
- [x] 2.2 Update UpdateCarDto to include make, model, registrationNumber, and color fields
- [x] 2.3 Update CarResponseDto to return make, model, registrationNumber, and color fields

## 3. Service Updates

- [x] 3.1 Update CarsService.create method to handle new fields
- [x] 3.2 Update CarsService.update method to handle new fields
- [x] 3.3 Update CarsService.toResponse method to map new fields

## 4. Testing and Validation

- [x] 4.1 Verify API endpoints work with new field structure
- [x] 4.2 Check for TypeScript compilation errors