import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFlatNumberToUsersTable1775916100000 implements MigrationInterface {
  name = 'AddFlatNumberToUsersTable1775916100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD flat_number VARCHAR(255) NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN flat_number
    `);
  }
}
