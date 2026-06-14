import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleToUsersTable1776425474000 implements MigrationInterface {
  name = 'AddRoleToUsersTable1776425474000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN role ENUM('owner', 'driver', 'admin') NOT NULL DEFAULT 'owner'
    `);
    await queryRunner.query(`
      UPDATE users SET role = 'owner' WHERE role IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN role
    `);
  }
}
