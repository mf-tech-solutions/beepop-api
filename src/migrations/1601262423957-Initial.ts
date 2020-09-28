import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1601262423957 implements MigrationInterface {
    name = 'Initial1601262423957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_token" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Token" varchar NOT NULL, "Provider" tinyint NOT NULL, "Expired" boolean NOT NULL, "ExpirationDate" datetime NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "music" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "ApiId" varchar NOT NULL, "Name" varchar, "ImageUrl" varchar, "ExternalUrl" varchar, "Type" tinyint NOT NULL, CONSTRAINT "UQ_b5c1ca092ea9bcfb05912dfea91" UNIQUE ("ApiId"))`);
        await queryRunner.query(`CREATE TABLE "artist" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "ApiId" varchar NOT NULL, "Name" varchar, "ImageUrl" varchar, "ExternalUrl" varchar)`);
        await queryRunner.query(`CREATE TABLE "music__artists_artist" ("musicId" integer NOT NULL, "artistId" integer NOT NULL, PRIMARY KEY ("musicId", "artistId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_30c3a96d65c982112c7fbb5698" ON "music__artists_artist" ("musicId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aae212f835c06a7697dee153fe" ON "music__artists_artist" ("artistId") `);
        await queryRunner.query(`DROP INDEX "IDX_30c3a96d65c982112c7fbb5698"`);
        await queryRunner.query(`DROP INDEX "IDX_aae212f835c06a7697dee153fe"`);
        await queryRunner.query(`CREATE TABLE "temporary_music__artists_artist" ("musicId" integer NOT NULL, "artistId" integer NOT NULL, CONSTRAINT "FK_30c3a96d65c982112c7fbb56984" FOREIGN KEY ("musicId") REFERENCES "music" ("Id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_aae212f835c06a7697dee153fec" FOREIGN KEY ("artistId") REFERENCES "artist" ("Id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("musicId", "artistId"))`);
        await queryRunner.query(`INSERT INTO "temporary_music__artists_artist"("musicId", "artistId") SELECT "musicId", "artistId" FROM "music__artists_artist"`);
        await queryRunner.query(`DROP TABLE "music__artists_artist"`);
        await queryRunner.query(`ALTER TABLE "temporary_music__artists_artist" RENAME TO "music__artists_artist"`);
        await queryRunner.query(`CREATE INDEX "IDX_30c3a96d65c982112c7fbb5698" ON "music__artists_artist" ("musicId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aae212f835c06a7697dee153fe" ON "music__artists_artist" ("artistId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_aae212f835c06a7697dee153fe"`);
        await queryRunner.query(`DROP INDEX "IDX_30c3a96d65c982112c7fbb5698"`);
        await queryRunner.query(`ALTER TABLE "music__artists_artist" RENAME TO "temporary_music__artists_artist"`);
        await queryRunner.query(`CREATE TABLE "music__artists_artist" ("musicId" integer NOT NULL, "artistId" integer NOT NULL, PRIMARY KEY ("musicId", "artistId"))`);
        await queryRunner.query(`INSERT INTO "music__artists_artist"("musicId", "artistId") SELECT "musicId", "artistId" FROM "temporary_music__artists_artist"`);
        await queryRunner.query(`DROP TABLE "temporary_music__artists_artist"`);
        await queryRunner.query(`CREATE INDEX "IDX_aae212f835c06a7697dee153fe" ON "music__artists_artist" ("artistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_30c3a96d65c982112c7fbb5698" ON "music__artists_artist" ("musicId") `);
        await queryRunner.query(`DROP INDEX "IDX_aae212f835c06a7697dee153fe"`);
        await queryRunner.query(`DROP INDEX "IDX_30c3a96d65c982112c7fbb5698"`);
        await queryRunner.query(`DROP TABLE "music__artists_artist"`);
        await queryRunner.query(`DROP TABLE "artist"`);
        await queryRunner.query(`DROP TABLE "music"`);
        await queryRunner.query(`DROP TABLE "api_token"`);
    }

}
