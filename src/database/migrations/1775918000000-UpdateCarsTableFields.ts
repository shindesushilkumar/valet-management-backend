import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCarsTableFields1775918000000 implements MigrationInterface {
  name = 'UpdateCarsTableFields1775918000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE cars
      ADD COLUMN car_make VARCHAR(255) NOT NULL AFTER id,
      ADD COLUMN car_model VARCHAR(255) NOT NULL AFTER car_make,
      ADD COLUMN registration_number VARCHAR(255) NOT NULL AFTER car_model,
      ADD COLUMN color VARCHAR(255) NOT NULL AFTER registration_number
    `);

    await queryRunner.query(`
      ALTER TABLE cars DROP COLUMN car_number
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE cars
      ADD COLUMN car_number VARCHAR(255) NOT NULL AFTER color
    `);

    await queryRunner.query(`
      ALTER TABLE cars DROP COLUMN color,
      DROP COLUMN registration_number,
      DROP COLUMN car_model,
      DROP COLUMN car_make
    `);
  }
}
