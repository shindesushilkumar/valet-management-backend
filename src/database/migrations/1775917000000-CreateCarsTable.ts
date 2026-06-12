import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCarsTable1775917000000 implements MigrationInterface {
  name = 'CreateCarsTable1775917000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE cars (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        car_number VARCHAR(255) NOT NULL,
        user_id BIGINT UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL,
        PRIMARY KEY (id),
        KEY FK_cars_user_id (user_id),
        CONSTRAINT FK_cars_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE cars`);
  }
}
