import { MigrationInterface, QueryRunner } from "typeorm";

export class Seed1601262433752 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      'INSERT INTO music ("ApiId", "Type") VALUES ("2noRn2Aes5aoNVsU6iWThc", 1)',
    );
    queryRunner.query(
      'INSERT INTO music ("ApiId", "Type") VALUES ("7ouMYWpwJ422jRcDASZB7P", 2)',
    );
    queryRunner.query(
      'INSERT INTO music ("ApiId", "Type") VALUES ("1A2GTWGtFfWp7KSQTwWOyo", 1)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      'DELETE FROM music WHERE "ApiId" = "2noRn2Aes5aoNVsU6iWThc"',
    );
    queryRunner.query(
      'DELETE FROM music WHERE "ApiId" = "7ouMYWpwJ422jRcDASZB7P"',
    );
    queryRunner.query(
      'DELETE FROM music WHERE "ApiId" = "1A2GTWGtFfWp7KSQTwWOyo"',
    );

    queryRunner.query("DELETE FROM artist");
  }
}
